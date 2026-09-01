import React, { useState, useRef } from 'react';
import { uploadFile } from '../../lib/supabase';
import { useToast } from '../common/Toast';
import { Button } from '../common/Button';
import { FileText, Upload, Check, Loader2, Download, Trash2 } from 'lucide-react';

interface FileUploaderProps {
  value: string | null;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  accept?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  value,
  onChange,
  folder = 'resume',
  label = 'Document / PDF File',
  accept = '.pdf,application/pdf',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { success, error } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.size > 10 * 1024 * 1024) {
      error('File too large', 'File size must be less than 10MB.');
      return;
    }

    try {
      setIsUploading(true);
      const { url, error: uploadErr } = await uploadFile('portfolio', folder, file);
      if (uploadErr || !url) {
        throw uploadErr || new Error('Upload failed');
      }

      onChange(url);
      success('File uploaded successfully to Supabase Storage!');
    } catch (err: any) {
      console.error('File upload failed:', err);
      error('Upload failed', err.message || 'Could not upload file.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
        {label}
      </label>

      {value ? (
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.04] border border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Attached Document</p>
              <p className="text-[11px] text-slate-400 font-mono truncate max-w-xs">{value}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a href={value} target="_blank" rel="noopener noreferrer" download>
              <Button type="button" variant="outline" size="sm" leftIcon={<Download className="w-3.5 h-3.5" />}>
                Preview
              </Button>
            </a>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              Replace
            </Button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
              title="Remove file"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-white/[0.1] hover:border-sky-400/50 rounded-xl p-6 text-center cursor-pointer transition-colors bg-white/[0.02] hover:bg-white/[0.04] flex flex-col items-center justify-center gap-2"
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-sky-400" />
              <span className="text-xs text-slate-400">Uploading document...</span>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-sky-500/10 text-sky-400 flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Click to upload document / PDF</p>
                <p className="text-[11px] text-slate-400 mt-0.5">PDF format up to 10MB</p>
              </div>
            </>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};
