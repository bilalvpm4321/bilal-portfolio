import { createClient } from '@supabase/supabase-js';
import * as tus from 'tus-js-client';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

export interface UploadProgress {
  loaded: number;
  total: number;
  percent: number;
}

export interface UploadController {
  abort: () => void;
}

export interface UploadVideoOptions {
  onProgress?: (progress: UploadProgress) => void;
  onStart?: (controller: UploadController) => void;
}

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabasePublishableKey &&
    supabaseUrl !== 'your_supabase_project_url' &&
    supabasePublishableKey !== 'your_supabase_publishable_key' &&
    supabaseUrl.startsWith('https://')
  );
};

// Initialize Supabase Client
export const supabase = createClient(
  isSupabaseConfigured() ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured() ? supabasePublishableKey : 'placeholder-publishable-key',
  {
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

// Storage helper functions
export const uploadFile = async (
  bucket: string,
  path: string,
  file: File
): Promise<{ url: string | null; error: Error | null }> => {
  try {
    if (!isSupabaseConfigured()) {
      const localUrl = URL.createObjectURL(file);
      return { url: localUrl, error: null };
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = path ? `${path}/${fileName}` : fileName;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return { url: data.publicUrl, error: null };
  } catch (err: any) {
    console.error('Storage upload error:', err);
    return { url: null, error: err };
  }
};

/**
 * Resumable / Chunked video uploader supporting large files (up to 130MB+)
 * Uses TUS protocol with progress reporting and graceful fallback to direct upload.
 */
export const uploadVideoFile = async (
  bucket: string,
  path: string,
  file: File,
  options?: UploadVideoOptions
): Promise<{ url: string | null; error: Error | null }> => {
  try {
    if (!isSupabaseConfigured()) {
      // Mock progress for unconfigured environment
      if (options?.onProgress) {
        options.onProgress({ loaded: Math.round(file.size * 0.3), total: file.size, percent: 30 });
        await new Promise((r) => setTimeout(r, 200));
        options.onProgress({ loaded: Math.round(file.size * 0.7), total: file.size, percent: 70 });
        await new Promise((r) => setTimeout(r, 200));
        options.onProgress({ loaded: file.size, total: file.size, percent: 100 });
      }
      const localUrl = URL.createObjectURL(file);
      return { url: localUrl, error: null };
    }

    const cleanBaseUrl = supabaseUrl.replace(/\/+$/, '');
    const fileExt = file.name.split('.').pop() || 'mp4';
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = path ? `${path}/${fileName}` : fileName;

    const { data: sessionData } = await supabase.auth.getSession().catch(() => ({ data: { session: null } }));
    const token = sessionData?.session?.access_token || supabasePublishableKey;

    return await new Promise<{ url: string | null; error: Error | null }>((resolve) => {
      let isAborted = false;
      let tusUpload: tus.Upload | null = null;
      let xhr: XMLHttpRequest | null = null;

      const controller: UploadController = {
        abort: () => {
          isAborted = true;
          if (tusUpload) {
            try {
              tusUpload.abort(true);
            } catch (err) {
              console.warn('TUS abort error:', err);
            }
          }
          if (xhr) {
            try {
              xhr.abort();
            } catch (err) {
              console.warn('XHR abort error:', err);
            }
          }
          resolve({ url: null, error: new Error('Upload cancelled by user') });
        },
      };

      options?.onStart?.(controller);

      const tryDirectUploadFallback = () => {
        if (isAborted) return;
        xhr = new XMLHttpRequest();
        xhr.open('POST', `${cleanBaseUrl}/storage/v1/object/${bucket}/${filePath}`, true);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.setRequestHeader('apikey', supabasePublishableKey);
        xhr.setRequestHeader('x-upsert', 'true');
        if (file.type) {
          xhr.setRequestHeader('Content-Type', file.type);
        }

        xhr.upload.onprogress = (e) => {
          if (isAborted) return;
          if (e.lengthComputable) {
            const percent = Math.min(100, Math.round((e.loaded / e.total) * 100));
            options?.onProgress?.({ loaded: e.loaded, total: e.total, percent });
          }
        };

        xhr.onload = () => {
          if (isAborted) return;
          if (xhr!.status >= 200 && xhr!.status < 300) {
            options?.onProgress?.({ loaded: file.size, total: file.size, percent: 100 });
            const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
            resolve({ url: data.publicUrl, error: null });
          } else if (xhr!.status === 413) {
            resolve({
              url: null,
              error: new Error(
                'Upload rejected (413 Payload Too Large): Supabase Free Plan enforces a 50MB single-file limit. To upload files up to 130MB, please upgrade to Supabase Pro or paste an external video link (e.g. YouTube, Vimeo, Google Drive, Cloudinary).'
              ),
            });
          } else {
            let msg = `Upload failed (Status ${xhr!.status})`;
            try {
              const res = JSON.parse(xhr!.responseText);
              msg = res.message || res.error || msg;
            } catch {}
            resolve({ url: null, error: new Error(msg) });
          }
        };

        xhr.onerror = () => {
          if (isAborted) return;
          resolve({
            url: null,
            error: new Error('Network error during video upload. Please check your internet connection or paste an external video URL.'),
          });
        };

        xhr.send(file);
      };

      tusUpload = new tus.Upload(file, {
        endpoint: `${cleanBaseUrl}/storage/v1/upload/resumable`,
        retryDelays: [0, 1000, 3000, 5000],
        headers: {
          authorization: `Bearer ${token}`,
          apikey: supabasePublishableKey,
          'x-upsert': 'true',
        },
        uploadDataDuringCreation: true,
        removeFingerprintOnSuccess: true,
        metadata: {
          bucketName: bucket,
          objectName: filePath,
          contentType: file.type || 'video/mp4',
          cacheControl: '3600',
        },
        chunkSize: 6 * 1024 * 1024, // 6MB chunk size recommended for Supabase
        onError: (err) => {
          if (isAborted) return;
          console.warn('TUS resumable upload failed, attempting direct upload fallback:', err);
          const errStr = String(err?.message || err || '');
          if (
            errStr.includes('413') ||
            errStr.toLowerCase().includes('payload too large') ||
            errStr.toLowerCase().includes('entity too large')
          ) {
            resolve({
              url: null,
              error: new Error(
                'Upload rejected (413 Payload Too Large): Supabase Free Plan enforces a 50MB single-file limit. To upload files up to 130MB, please upgrade to Supabase Pro or paste an external video link (e.g. YouTube, Vimeo, Google Drive, Cloudinary).'
              ),
            });
            return;
          }
          tryDirectUploadFallback();
        },
        onProgress: (bytesUploaded, bytesTotal) => {
          if (isAborted) return;
          const percent = bytesTotal > 0 ? Math.min(100, Math.round((bytesUploaded / bytesTotal) * 100)) : 0;
          options?.onProgress?.({ loaded: bytesUploaded, total: bytesTotal, percent });
        },
        onSuccess: () => {
          if (isAborted) return;
          options?.onProgress?.({ loaded: file.size, total: file.size, percent: 100 });
          const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
          resolve({ url: data.publicUrl, error: null });
        },
      });

      tusUpload.start();
    });
  } catch (err: any) {
    console.error('Storage video upload error:', err);
    return { url: null, error: err };
  }
};

export const deleteFile = async (
  bucket: string,
  path: string
): Promise<{ success: boolean; error: Error | null }> => {
  try {
    if (!isSupabaseConfigured()) {
      return { success: true, error: null };
    }

    const { error } = await supabase.storage.from(bucket).remove([path]);
    if (error) throw error;
    return { success: true, error: null };
  } catch (err: any) {
    console.error('Storage delete error:', err);
    return { success: false, error: err };
  }
};

export const listBucketFiles = async (
  bucket: string,
  folder: string = ''
): Promise<{ files: any[]; error: Error | null }> => {
  try {
    if (!isSupabaseConfigured()) {
      return {
        files: [
          { name: 'profile-avatar.jpg', id: '1', updated_at: new Date().toISOString(), metadata: { size: 142850 } },
          { name: 'bilal-resume.pdf', id: '2', updated_at: new Date().toISOString(), metadata: { size: 285400 } },
          { name: 'smile-ai-preview.jpg', id: '3', updated_at: new Date().toISOString(), metadata: { size: 450120 } },
          { name: 'yodhac-preview.jpg', id: '4', updated_at: new Date().toISOString(), metadata: { size: 382400 } },
        ],
        error: null,
      };
    }

    const { data, error } = await supabase.storage
      .from(bucket)
      .list(folder, { limit: 100, sortBy: { column: 'name', order: 'asc' } });

    if (error) throw error;
    return { files: data || [], error: null };
  } catch (err: any) {
    console.error('Storage list error:', err);
    return { files: [], error: err };
  }
};
