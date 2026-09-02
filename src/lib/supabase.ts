import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

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
