import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { useToast } from '../../components/common/Toast';
import { Achievement } from '../../types/database';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Plus, Edit2, Trash2, Trophy, Calendar, Sparkles } from 'lucide-react';

export const AdminAchievementsPage: React.FC = () => {
  const { data, createAchievement, updateAchievement, deleteAchievement } = usePortfolio();
  const { success, error } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAch, setEditingAch] = useState<Achievement | null>(null);
  const [achToDelete, setAchToDelete] = useState<Achievement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    date_or_year: '2024',
    description: '',
    badge: 'National Examination',
    display_order: 1,
    is_visible: true,
  });

  const handleOpenAdd = () => {
    setEditingAch(null);
    setFormData({
      title: '',
      subtitle: '',
      date_or_year: new Date().getFullYear().toString(),
      description: '',
      badge: '',
      display_order: data.achievements.length + 1,
      is_visible: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ach: Achievement) => {
    setEditingAch(ach);
    setFormData({
      title: ach.title,
      subtitle: ach.subtitle || '',
      date_or_year: ach.date_or_year || '',
      description: ach.description || '',
      badge: ach.badge || '',
      display_order: ach.display_order,
      is_visible: ach.is_visible,
    });
    setIsModalOpen(true);
  };

  const handleSaveAch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      error('Please enter achievement title.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingAch) {
        const res = await updateAchievement(editingAch.id, formData);
        if (res.success) {
          success('Achievement updated');
          setIsModalOpen(false);
        } else {
          error('Failed to update achievement');
        }
      } else {
        const res = await createAchievement(formData);
        if (res.success) {
          success('Achievement added');
          setIsModalOpen(false);
        } else {
          error('Failed to add achievement');
        }
      }
    } catch (err: any) {
      error('Error saving achievement', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!achToDelete) return;
    try {
      const res = await deleteAchievement(achToDelete.id);
      if (res.success) {
        success('Achievement deleted');
        setAchToDelete(null);
      } else {
        error('Failed to delete achievement');
      }
    } catch (err: any) {
      error('Error deleting achievement', err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Achievements & Honors</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Showcase GATE qualifications, employer awards, and volunteer milestones.
          </p>
        </div>

        <Button variant="primary" size="md" onClick={handleOpenAdd} leftIcon={<Plus className="w-4 h-4" />}>
          Add Achievement
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.achievements.map((ach) => (
          <Card key={ach.id} className="p-6 bg-[#0d0f17]/95 border-white/[0.08] flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Trophy className="w-5 h-5" />
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(ach)}
                    className="p-1.5 text-sky-400 hover:bg-sky-500/10 rounded-lg transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setAchToDelete(ach)}
                    className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-base font-bold text-white mb-0.5">{ach.title}</h3>
              {ach.subtitle && <p className="text-xs font-semibold text-sky-400 mb-2">{ach.subtitle}</p>}
              {ach.description && <p className="text-xs text-slate-300 line-clamp-3 mb-3">{ach.description}</p>}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/[0.04] text-xs">
              <span className="font-mono text-slate-400">{ach.date_or_year}</span>
              {ach.badge && (
                <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
                  {ach.badge}
                </span>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAch ? 'Edit Achievement' : 'Add Achievement'}
      >
        <form onSubmit={handleSaveAch} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Title <span className="text-sky-400">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. GATE 2024 Qualified"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-sky-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Subtitle / Issuer
              </label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="e.g. Computer Science & IT"
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-sky-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Year / Date
              </label>
              <input
                type="text"
                value={formData.date_or_year}
                onChange={(e) => setFormData({ ...formData, date_or_year: e.target.value })}
                placeholder="2024"
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-sky-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Badge Tag
            </label>
            <input
              type="text"
              value={formData.badge}
              onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
              placeholder="e.g. National Examination, Double Recipient"
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-sky-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-sky-400 resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-white/[0.08]">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
              Save Achievement
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(achToDelete)}
        onClose={() => setAchToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Achievement"
        message={`Delete "${achToDelete?.title}"?`}
      />
    </div>
  );
};
