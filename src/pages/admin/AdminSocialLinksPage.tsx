import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { useToast } from '../../components/common/Toast';
import { SocialLink } from '../../types/database';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Plus, Edit2, Trash2, Share2, ExternalLink } from 'lucide-react';

export const AdminSocialLinksPage: React.FC = () => {
  const { data, createSocialLink, updateSocialLink, deleteSocialLink } = usePortfolio();
  const { success, error } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
  const [linkToDelete, setLinkToDelete] = useState<SocialLink | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    platform: '',
    url: '',
    icon: '',
    label: '',
    display_order: 1,
    is_visible: true,
  });

  const handleOpenAdd = () => {
    setEditingLink(null);
    setFormData({
      platform: 'GitHub',
      url: '',
      icon: 'github',
      label: '',
      display_order: data.socialLinks.length + 1,
      is_visible: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (link: SocialLink) => {
    setEditingLink(link);
    setFormData({
      platform: link.platform,
      url: link.url,
      icon: link.icon || '',
      label: link.label || '',
      display_order: link.display_order,
      is_visible: link.is_visible,
    });
    setIsModalOpen(true);
  };

  const handleSaveLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.platform || !formData.url) {
      error('Please complete required fields (Platform, URL).');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingLink) {
        const res = await updateSocialLink(editingLink.id, formData);
        if (res.success) {
          success('Social link updated');
          setIsModalOpen(false);
        } else {
          error('Failed to update social link');
        }
      } else {
        const res = await createSocialLink(formData);
        if (res.success) {
          success('Social link created');
          setIsModalOpen(false);
        } else {
          error('Failed to create social link');
        }
      }
    } catch (err: any) {
      error('Error saving link', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!linkToDelete) return;
    try {
      const res = await deleteSocialLink(linkToDelete.id);
      if (res.success) {
        success('Social link deleted');
        setLinkToDelete(null);
      } else {
        error('Failed to delete social link');
      }
    } catch (err: any) {
      error('Error deleting social link', err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Social & Contact Links</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage links for GitHub, LinkedIn, Email, Phone, and social platforms.
          </p>
        </div>

        <Button variant="primary" size="md" onClick={handleOpenAdd} leftIcon={<Plus className="w-4 h-4" />}>
          Add Link
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.socialLinks.map((link) => (
          <Card key={link.id} className="p-5 bg-[#0d0f17]/95 border-white/[0.08] flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">{link.platform}</span>
                {!link.is_visible && <span className="text-[10px] text-rose-400 font-semibold">(Hidden)</span>}
              </div>
              <p className="text-xs text-sky-400 truncate max-w-[200px] mt-0.5">{link.label || link.url}</p>
            </div>

            <div className="flex items-center gap-1">
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={() => handleOpenEdit(link)}
                className="p-1.5 text-sky-400 hover:bg-sky-500/10 rounded-lg transition-colors cursor-pointer"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLinkToDelete(link)}
                className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingLink ? 'Edit Link' : 'Add Social Link'}
      >
        <form onSubmit={handleSaveLink} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Platform Name <span className="text-sky-400">*</span>
            </label>
            <input
              type="text"
              value={formData.platform}
              onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
              placeholder="e.g. GitHub, LinkedIn, Twitter"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-sky-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Target URL <span className="text-sky-400">*</span>
            </label>
            <input
              type="text"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://..."
              required
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-sky-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Display Label (optional)
            </label>
            <input
              type="text"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              placeholder="e.g. linkedin.com/in/bilalvpm4321"
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-sky-400"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-white/[0.08]">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
              Save Link
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(linkToDelete)}
        onClose={() => setLinkToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Social Link"
        message={`Delete "${linkToDelete?.platform}" link?`}
      />
    </div>
  );
};
