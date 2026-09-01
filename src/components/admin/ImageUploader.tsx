import React, { useState, useRef } from 'react';
import { uploadFile } from '../../lib/supabase';
import { useToast } from '../common/Toast';
import { Button } from '../common/Button';
import { Upload, X, Image as ImageIcon, Loader2, Link as LinkIcon, Check } from 'lucide-react';

interface ImageUploaderProps {
  value: string | null;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'auto';
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  folder = 'projects',
  label = 'Image',
  aspectRatio = 'auto',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { success, error } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      error('Invalid file type', 'Please select an image file (PNG, JPG, WebP, SVG).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      error('File too large', 'Image size must be less than 5MB.');
      return;
    }

    try {
      setIsUploading(true);
      const { url, error: uploadErr } = await uploadFile('portfolio', folder, file);
      if (uploadErr || !url) {
        throw uploadErr || new Error('Upload failed');
      }

      onChange(url);
      success('Image uploaded successfully to Supabase Storage!');
    } catch (err: any) {
      console.error('Image upload failed:', err);
      error('Upload failed', err.message || 'Could not upload image to storage.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) return;
    onChange(urlInput.trim());
    setUrlInput('');
    setShowUrlInput(false);
    success('Image URL applied');
  };

  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-[16/9]',
    portrait: 'aspect-[4/5]',
    auto: 'min-h-[160px]',
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer"
        >
          <LinkIcon className="w-3 h-3" />
          <span>{showUrlInput ? 'Upload File' : 'Paste Direct URL'}</span>
        </button>
      </div>

      {showUrlInput && (
        <div className="flex gap-2 mb-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="flex-1 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-sky-400"
          />
          <Button size="sm" variant="secondary" onClick={handleApplyUrl}>
            Apply
          </Button>
        </div>
      )}

      {value ? (
        <div className={`relative rounded-xl overflow-hidden bg-slate-900 border border-white/[0.1] ${aspectClasses[aspectRatio]}`}>
          <img src={value} alt="Uploaded preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              Replace
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={() => onChange('')}
            >
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed border-white/[0.1] hover:border-sky-400/50 rounded-xl p-6 text-center cursor-pointer transition-colors bg-white/[0.02] hover:bg-white/[0.04] flex flex-col items-center justify-center gap-2 ${aspectClasses[aspectRatio]}`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-sky-400" />
              <span className="text-xs text-slate-400">Uploading to Supabase Storage...</span>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-sky-500/10 text-sky-400 flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Click or drag image here</p>
                <p className="text-[11px] text-slate-400 mt-0.5">PNG, JPG, WebP up to 5MB</p>
              </div>
            </>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};
