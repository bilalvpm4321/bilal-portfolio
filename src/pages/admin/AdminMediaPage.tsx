import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '../../components/common/Toast';
import { uploadFile, deleteFile, listBucketFiles, isSupabaseConfigured } from '../../lib/supabase';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import {
  Image as ImageIcon,
  FileText,
  Upload,
  Copy,
  Trash2,
  Folder,
  Check,
  ExternalLink,
  RefreshCw,
  Loader2,
} from 'lucide-react';

const FOLDERS = ['all', 'profile', 'projects', 'resume', 'certificates', 'general'];

export const AdminMediaPage: React.FC = () => {
  const { success, error } = useToast();
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [fileToDelete, setFileToDelete] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const folderPath = selectedFolder === 'all' ? '' : selectedFolder;
      const { files: fetched, error: listErr } = await listBucketFiles('portfolio', folderPath);
      if (listErr) throw listErr;
      setFiles(fetched || []);
    } catch (err: any) {
      console.error('Fetch media error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [selectedFolder]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files;
    if (!uploaded || uploaded.length === 0) return;

    setIsUploading(true);
    try {
      const folder = selectedFolder === 'all' ? 'general' : selectedFolder;
      const file = uploaded[0];
      const { url, error: uploadErr } = await uploadFile('portfolio', folder, file);
      if (uploadErr || !url) throw uploadErr || new Error('Upload failed');

      success('File uploaded to Supabase Storage!', 'URL generated and stored.');
      fetchFiles();
    } catch (err: any) {
      error('Upload Error', err.message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    success('Public URL copied to clipboard!');
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleDeleteConfirm = async () => {
    if (!fileToDelete) return;
    try {
      const path = selectedFolder === 'all' ? fileToDelete.name : `${selectedFolder}/${fileToDelete.name}`;
      const { success: delSuccess, error: delErr } = await deleteFile('portfolio', path);
      if (delErr || !delSuccess) throw delErr || new Error('Delete failed');

      success('File deleted from storage');
      setFileToDelete(null);
      fetchFiles();
    } catch (err: any) {
      error('Delete Error', err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Media & Storage Explorer</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage assets stored in Supabase Storage bucket <code className="text-sky-400 font-mono">portfolio</code>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchFiles}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
          >
            Refresh
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            isLoading={isUploading}
            leftIcon={<Upload className="w-4 h-4" />}
          >
            Upload File
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Folder Tabs */}
      <div className="flex items-center gap-2 flex-wrap pb-2 border-b border-white/[0.08]">
        {FOLDERS.map((folder) => {
          const isSelected = selectedFolder === folder;
          return (
            <button
              key={folder}
              onClick={() => setSelectedFolder(folder)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                isSelected
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                  : 'bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.06]'
              }`}
            >
              <Folder className="w-3.5 h-3.5" />
              <span>{folder}</span>
            </button>
          );
        })}
      </div>

      {/* Files Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
        </div>
      ) : files.length === 0 ? (
        <Card className="p-12 text-center bg-[#0d0f17]/95 border-white/[0.08]">
          <ImageIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-white mb-1">No Files in this Folder</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            Upload images or documents using the button above.
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            leftIcon={<Upload className="w-4 h-4" />}
          >
            Upload to {selectedFolder}
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {files.map((file) => {
            const isImage = /\.(jpg|jpeg|png|webp|svg|gif)$/i.test(file.name);
            const fileUrl = isSupabaseConfigured()
              ? `https://${import.meta.env.VITE_SUPABASE_URL?.replace('https://', '')}/storage/v1/object/public/portfolio/${
                  selectedFolder === 'all' ? file.name : `${selectedFolder}/${file.name}`
                }`
              : `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80`;

            return (
              <Card
                key={file.name}
                className="p-2.5 bg-[#0d0f17]/95 border-white/[0.08] group flex flex-col justify-between"
              >
                <div className="relative aspect-square rounded-lg overflow-hidden bg-slate-900 mb-2 flex items-center justify-center border border-white/[0.04]">
                  {isImage ? (
                    <img
                      src={fileUrl}
                      alt={file.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <FileText className="w-10 h-10 text-sky-400" />
                  )}

                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                    <button
                      onClick={() => copyUrl(fileUrl)}
                      className="p-1.5 rounded-lg bg-white/20 hover:bg-white/40 text-white transition-colors cursor-pointer"
                      title="Copy Public URL"
                    >
                      {copiedUrl === fileUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-white/20 hover:bg-white/40 text-white transition-colors"
                      title="Open in new tab"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => setFileToDelete(file)}
                      className="p-1.5 rounded-lg bg-rose-500/30 hover:bg-rose-500 text-white transition-colors cursor-pointer"
                      title="Delete file"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="px-1">
                  <p className="text-[11px] font-semibold text-white truncate" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono">
                    {file.metadata?.size ? `${Math.round(file.metadata.size / 1024)} KB` : 'Storage'}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(fileToDelete)}
        onClose={() => setFileToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Storage Object"
        message={`Are you sure you want to permanently delete "${fileToDelete?.name}" from Supabase Storage?`}
      />
    </div>
  );
};
