import React, { useState, useRef } from 'react';
import { uploadVideoFile, deleteFile, UploadProgress, UploadController } from '../../lib/supabase';
import { useToast } from '../common/Toast';
import { Button } from '../common/Button';
import {
  Video,
  Upload,
  Trash2,
  Link as LinkIcon,
  Loader2,
  X,
  AlertCircle,
  HardDrive,
  FileVideo,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

interface VideoUploaderProps {
  currentVideoUrl?: string | null;
  onVideoChange: (url: string | null) => void;
  folder?: string;
  label?: string;
  helperText?: string;
}

const MAX_VIDEO_MB = 130;
const MAX_VIDEO_BYTES = 135 * 1024 * 1024; // 135MB (130MB + 5MB headroom for metadata)

export const VideoUploader: React.FC<VideoUploaderProps> = ({
  currentVideoUrl,
  onVideoChange,
  folder = 'projects/videos',
  label = 'Project Demo Video / Screen Recording',
  helperText = 'Upload an MP4/WebM video or screen recording up to 130MB, or enter a direct video URL (e.g. YouTube, Vimeo, Google Drive, or Cloudinary).',
}) => {
  const { success, error } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [uploadFileName, setUploadFileName] = useState('');
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const controllerRef = useRef<UploadController | null>(null);

  const processFile = async (file: File) => {
    // Check file size (max 130MB with headroom)
    if (file.size > MAX_VIDEO_BYTES) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
      error(
        'File too large',
        `File is ${fileSizeMB}MB. Maximum supported size is ${MAX_VIDEO_MB}MB. Please compress the video or paste an external video link.`
      );
      return;
    }

    // Check mime type or extension
    const validExtensions = ['.mp4', '.webm', '.mov', '.ogg', '.mkv', '.avi'];
    const hasValidExt = validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));
    const isVideoMime = file.type.startsWith('video/');

    if (!isVideoMime && !hasValidExt) {
      error('Invalid file type', 'Please select a valid video file (MP4, WebM, QuickTime, MKV, AVI).');
      return;
    }

    setErrorDetail(null);
    setIsUploading(true);
    setUploadFileName(file.name);
    setUploadProgress({ loaded: 0, total: file.size, percent: 0 });

    try {
      const { url, error: uploadErr } = await uploadVideoFile('portfolio', folder, file, {
        onStart: (controller) => {
          controllerRef.current = controller;
        },
        onProgress: (prog) => {
          setUploadProgress(prog);
        },
      });

      if (uploadErr || !url) {
        throw uploadErr || new Error('Upload failed');
      }

      onVideoChange(url);
      success('Video uploaded successfully!', `${file.name} is now attached to this project.`);
    } catch (err: any) {
      if (err.message?.includes('cancelled')) {
        success('Upload cancelled');
      } else {
        const is413 =
          err.message?.includes('413') ||
          err.message?.toLowerCase().includes('payload too large') ||
          err.message?.toLowerCase().includes('free plan');

        if (is413) {
          setErrorDetail(
            'Supabase Free Plan limits single-file uploads to 50MB. If your Supabase account is on the Free tier, you can paste an external URL (YouTube, Vimeo, Cloudinary, Google Drive) which has no size limit, or upgrade to Supabase Pro for direct 130MB+ uploads.'
          );
        }
        error('Video upload failed', err.message || 'An error occurred during video upload.');
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
      controllerRef.current = null;
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    processFile(files[0]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleCancelUpload = () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    onVideoChange(urlInput.trim());
    setUrlInput('');
    setShowUrlInput(false);
    setErrorDetail(null);
    success('Video URL updated', 'External video link attached.');
  };

  const handleRemove = async () => {
    if (currentVideoUrl && currentVideoUrl.includes('supabase.co')) {
      try {
        const parts = currentVideoUrl.split('/portfolio/');
        if (parts.length > 1) {
          await deleteFile('portfolio', parts[1]);
        }
      } catch (err) {
        console.error('Failed to remove from storage:', err);
      }
    }
    onVideoChange(null);
    setErrorDetail(null);
    success('Video removed');
  };

  const isYouTubeOrVimeo = (url: string) => {
    return (
      url.includes('youtube.com') ||
      url.includes('youtu.be') ||
      url.includes('vimeo.com') ||
      url.includes('drive.google.com')
    );
  };

  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes('drive.google.com/file/d/')) {
      return url.replace('/view', '/preview');
    }
    return url;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            {label}
          </label>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 font-medium">
            Up to 130MB
          </span>
        </div>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-xs text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1 cursor-pointer transition-colors"
        >
          <LinkIcon className="w-3.5 h-3.5" />
          <span>{showUrlInput ? 'Hide URL input' : 'Paste video URL'}</span>
        </button>
      </div>

      {showUrlInput && (
        <form onSubmit={handleUrlSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://... (direct .mp4 URL, YouTube, Vimeo, or Google Drive embed)"
            className="flex-1 px-3 py-2 text-xs rounded-xl bg-white/[0.04] border border-white/[0.1] text-white focus:outline-none focus:border-sky-400 font-mono"
          />
          <div className="flex items-center gap-2">
            <Button type="submit" variant="primary" size="sm">
              Set Video URL
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowUrlInput(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Storage Limit Error / Advisory Alert */}
      {errorDetail && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex flex-col gap-2">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
            <div className="flex-1 space-y-1">
              <p className="font-semibold text-amber-200">Supabase Storage Notice (50MB+ Video)</p>
              <p className="text-[11px] leading-relaxed text-amber-300/90">{errorDetail}</p>
            </div>
            <button
              type="button"
              onClick={() => setErrorDetail(null)}
              className="text-amber-400 hover:text-amber-200 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-center gap-2 pt-1 border-t border-amber-500/20">
            <button
              type="button"
              onClick={() => {
                setShowUrlInput(true);
                setErrorDetail(null);
              }}
              className="text-[11px] font-semibold text-amber-300 hover:text-white underline flex items-center gap-1 cursor-pointer"
            >
              <LinkIcon className="w-3 h-3" />
              <span>Paste YouTube / Vimeo / Drive URL instead (Unlimited size)</span>
            </button>
          </div>
        </div>
      )}

      {/* Active Uploading State with Real-Time Progress Bar */}
      {isUploading ? (
        <div className="border-2 border-sky-500/40 bg-sky-950/20 rounded-2xl p-6 sm:p-7 text-center">
          <div className="max-w-md mx-auto space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 animate-pulse">
                <FileVideo className="w-5 h-5" />
              </div>
              <div className="text-left flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{uploadFileName}</p>
                <p className="text-[11px] text-slate-400">
                  {uploadProgress ? (
                    <>
                      <span>{formatFileSize(uploadProgress.loaded)}</span>
                      <span className="mx-1">/</span>
                      <span>{formatFileSize(uploadProgress.total)}</span>
                      <span className="ml-2 font-mono text-sky-400 font-semibold">
                        ({uploadProgress.percent}%)
                      </span>
                    </>
                  ) : (
                    'Preparing chunked upload...'
                  )}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCancelUpload}
                leftIcon={<X className="w-3.5 h-3.5" />}
                className="text-red-400 border-red-500/20 hover:bg-red-500/10"
              >
                Cancel
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="h-2.5 w-full bg-white/[0.08] rounded-full overflow-hidden p-0.5 border border-white/[0.05]">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-cyan-400 rounded-full transition-all duration-300 ease-out shadow-[0_0_12px_rgba(56,189,248,0.5)]"
                  style={{ width: `${uploadProgress?.percent || 2}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Resumable TUS Chunk Upload</span>
                <span>{uploadProgress?.percent || 0}% completed</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 italic">
              Uploading large video file in 6MB chunks to Supabase Storage. Please do not close this tab.
            </p>
          </div>
        </div>
      ) : currentVideoUrl ? (
        <div className="relative rounded-2xl overflow-hidden border border-white/[0.1] bg-black/60 group">
          {isYouTubeOrVimeo(currentVideoUrl) ? (
            <div className="aspect-video w-full">
              <iframe
                src={getEmbedUrl(currentVideoUrl)}
                title="Project Video"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="aspect-video w-full bg-black flex items-center justify-center">
              <video
                src={currentVideoUrl}
                controls
                className="w-full h-full object-contain"
                preload="metadata"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {/* Action overlay buttons */}
          <div className="p-3 bg-[#0d0f17]/90 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-slate-300 truncate max-w-md">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="truncate font-mono text-[11px]">{currentVideoUrl}</span>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                leftIcon={<Upload className="w-3.5 h-3.5" />}
              >
                Replace Video
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={handleRemove}
                leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              >
                Remove
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-sky-400 bg-sky-500/10 scale-[0.99]'
              : 'border-white/[0.1] hover:border-sky-500/50 hover:bg-white/[0.02]'
          }`}
        >
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 transition-transform group-hover:scale-110">
              <Video className="w-6 h-6" />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                Click or drop project demo video / screen recording
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">{helperText}</p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-1">
              <span className="px-3 py-1 rounded-lg bg-sky-500/10 border border-sky-500/20 text-[11px] text-sky-300 font-mono font-medium">
                Supports MP4, WebM, MOV up to 130MB
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] text-[11px] text-slate-400 font-mono">
                Resumable 6MB Chunks
              </span>
            </div>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime,video/ogg,video/x-matroska,video/avi"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};
