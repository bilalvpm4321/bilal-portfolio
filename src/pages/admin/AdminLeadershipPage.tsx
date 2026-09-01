import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { useToast } from '../../components/common/Toast';
import { Leadership } from '../../types/database';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Plus, Edit2, Trash2, Users, Calendar, Building } from 'lucide-react';

export const AdminLeadershipPage: React.FC = () => {
  const { data, createLeadership, updateLeadership, deleteLeadership } = usePortfolio();
  const { success, error } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Leadership | null>(null);
  const [leadToDelete, setLeadToDelete] = useState<Leadership | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    role: '',
    organization: '',
    period: '',
    description: '',
    display_order: 1,
    is_visible: true,
  });

  const handleOpenAdd = () => {
    setEditingLead(null);
    setFormData({
      role: '',
      organization: '',
      period: '2024–25',
      description: '',
      display_order: data.leadership.length + 1,
      is_visible: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (lead: Leadership) => {
    setEditingLead(lead);
    setFormData({
      role: lead.role,
      organization: lead.organization,
      period: lead.period,
      description: lead.description || '',
      display_order: lead.display_order,
      is_visible: lead.is_visible,
    });
    setIsModalOpen(true);
  };

  const handleSaveLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.role || !formData.organization) {
      error('Please complete required fields (Role, Organization).');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingLead) {
        const res = await updateLeadership(editingLead.id, formData);
        if (res.success) {
          success('Leadership record updated');
          setIsModalOpen(false);
        } else {
          error('Failed to update leadership');
        }
      } else {
        const res = await createLeadership(formData);
        if (res.success) {
          success('Leadership record created');
          setIsModalOpen(false);
        } else {
          error('Failed to create leadership');
        }
      }
    } catch (err: any) {
      error('Error saving leadership', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!leadToDelete) return;
    try {
      const res = await deleteLeadership(leadToDelete.id);
      if (res.success) {
        success('Leadership record deleted');
        setLeadToDelete(null);
      } else {
        error('Failed to delete leadership');
      }
    } catch (err: any) {
      error('Error deleting leadership', err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Leadership & Volunteering</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage IEEE, GDSC, NSS, and student coordinator positions.
          </p>
        </div>

        <Button variant="primary" size="md" onClick={handleOpenAdd} leftIcon={<Plus className="w-4 h-4" />}>
          Add Position
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.leadership.map((lead) => (
          <Card key={lead.id} className="p-6 bg-[#0d0f17]/95 border-white/[0.08] flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Users className="w-5 h-5" />
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(lead)}
                    className="p-1.5 text-sky-400 hover:bg-sky-500/10 rounded-lg transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setLeadToDelete(lead)}
                    className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-base font-bold text-white mb-0.5">{lead.role}</h3>
              <p className="text-xs font-semibold text-purple-400 mb-2">{lead.organization}</p>
              {lead.description && <p className="text-xs text-slate-300 line-clamp-3 mb-3">{lead.description}</p>}
            </div>

            <div className="pt-3 border-t border-white/[0.04] text-xs font-mono text-slate-400 flex items-center justify-between">
              <span>{lead.period}</span>
              {!lead.is_visible && <span className="text-rose-400 text-[10px] font-semibold">Hidden</span>}
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingLead ? 'Edit Leadership Record' : 'Add Leadership Record'}
      >
        <form onSubmit={handleSaveLead} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Role / Position Title <span className="text-sky-400">*</span>
            </label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="e.g. University Union Council Coordinator"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-sky-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Organization / Society <span className="text-sky-400">*</span>
              </label>
              <input
                type="text"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                placeholder="e.g. CUSAT, IEEE RAS SBC"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-sky-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Period / Years
              </label>
              <input
                type="text"
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                placeholder="2025–26"
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-sky-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Description / Responsibilities
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
              Save Record
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(leadToDelete)}
        onClose={() => setLeadToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Leadership Record"
        message={`Delete "${leadToDelete?.role} at ${leadToDelete?.organization}"?`}
      />
    </div>
  );
};
