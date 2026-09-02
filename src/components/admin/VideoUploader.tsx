import React, { useState, useRef } from 'react';
import { uploadFile, deleteFile } from '../../lib/supabase';
import { useToast } from '../common/Toast';
import { Button } from '../common/Button';
import { Video, Upload, Trash2, Link as LinkIcon, Loader2, Play, Eye } from 'lucide-react';

interface VideoUploaderProps {
  currentVideoUrl?: string | null;
  onVideoChange: (url: string | null) => void;
  folder?: string;
  label?: string;
  helperText?: string;
}

export const VideoUploader: React.FC<VideoUploaderProps> = ({
  currentVideoUrl,
  onVideoChange,
  folder = 'projects/videos',
  label = 'Project Demo Video / Screen Recording',
  helperText = 'Upload an MP4/WebM screen recording or enter a direct video URL (e.g. Supabase, Cloudinary, or direct video link).',
}) => {
  const { success, error } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    // Check file size (max 50MB for video)
    if (file.size > 50 * 1024 * 1024) {
      error('File too large', 'Please upload a video under 50MB.');
      return;
    }

    setIsUploading(true);
    try {
      const { url, error: uploadErr } = await uploadFile('portfolio', folder, file);
      if (uploadErr || !url) throw uploadErr || new Error('Upload failed');

      onVideoChange(url);
      success('Video uploaded successfully!', 'Video is attached to this project.');
    } catch (err: any) {
      error('Video upload failed', err.message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    onVideoChange(urlInput.trim());
    setUrlInput('');
    setShowUrlInput(false);
    success('Video URL updated');
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
    success('Video removed');
  };

  const isYouTubeOrVimeo = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com');
  };

  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    return url;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-xs text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1 cursor-pointer"
        >
          <LinkIcon className="w-3.5 h-3.5" />
          <span>{showUrlInput ? 'Hide URL input' : 'Paste video URL'}</span>
        </button>
      </div>

      {showUrlInput && (
        <form onSubmit={handleUrlSubmit} className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://... (direct .mp4 URL or YouTube embed)"
            className="flex-1 px-3 py-2 text-xs rounded-xl bg-white/[0.04] border border-white/[0.1] text-white focus:outline-none focus:border-sky-400 font-mono"
          />
          <Button type="submit" variant="primary" size="sm">
            Set URL
          </Button>
        </form>
      )}

      {currentVideoUrl ? (
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
          <div className="p-3 bg-[#0d0f17]/90 border-t border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-300 truncate max-w-sm">
              <Video className="w-4 h-4 text-sky-400 shrink-0" />
              <span className="truncate font-mono text-[11px]">{currentVideoUrl}</span>
            </div>

            <div className="flex items-center gap-2">
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
          className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
            isUploading
              ? 'border-sky-500/50 bg-sky-500/[0.03]'
              : 'border-white/[0.1] hover:border-sky-500/50 hover:bg-white/[0.02]'
          }`}
        >
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              {isUploading ? (
                <Loader2 className="w-6 h-6 animate-spin text-sky-400" />
              ) : (
                <Video className="w-6 h-6" />
              )}
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                {isUploading ? 'Uploading Video to Storage...' : 'Click or drop project video / screen recording'}
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">{helperText}</p>
            </div>

            <span className="px-3 py-1 rounded-lg bg-white/[0.04] text-[11px] text-slate-300 font-mono">
              Supports MP4, WebM, QuickTime (.mov) up to 50MB
            </span>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime,video/ogg"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};
