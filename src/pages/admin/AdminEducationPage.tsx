import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { useToast } from '../../components/common/Toast';
import { Education } from '../../types/database';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Plus, Edit2, Trash2, GraduationCap, Calendar, MapPin, Building } from 'lucide-react';

export const AdminEducationPage: React.FC = () => {
  const { data, createEducation, updateEducation, deleteEducation } = usePortfolio();
  const { success, error } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<Education | null>(null);
  const [eduToDelete, setEduToDelete] = useState<Education | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    degree: '',
    field_of_study: '',
    institution: '',
    start_year: '2025',
    end_year: '2027',
    grade_or_status: 'Pursuing',
    location: '',
    display_order: 1,
  });

  const handleOpenAdd = () => {
    setEditingEdu(null);
    setFormData({
      degree: 'M.Tech',
      field_of_study: 'Computer Science and Engineering (AI & Data Science)',
      institution: 'Cochin University of Science and Technology (CUSAT)',
      start_year: '2025',
      end_year: '2027',
      grade_or_status: 'Pursuing',
      location: 'Kochi, Kerala, India',
      display_order: data.education.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (edu: Education) => {
    setEditingEdu(edu);
    setFormData({
      degree: edu.degree,
      field_of_study: edu.field_of_study,
      institution: edu.institution,
      start_year: edu.start_year,
      end_year: edu.end_year,
      grade_or_status: edu.grade_or_status || '',
      location: edu.location || '',
      display_order: edu.display_order,
    });
    setIsModalOpen(true);
  };

  const handleSaveEdu = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.degree || !formData.institution) {
      error('Please fill in required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingEdu) {
        const res = await updateEducation(editingEdu.id, formData);
        if (res.success) {
          success('Education record updated');
          setIsModalOpen(false);
        } else {
          error('Failed to update education');
        }
      } else {
        const res = await createEducation(formData);
        if (res.success) {
          success('Education record added');
          setIsModalOpen(false);
        } else {
          error('Failed to add education');
        }
      }
    } catch (err: any) {
      error('Error saving education', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!eduToDelete) return;
    try {
      const res = await deleteEducation(eduToDelete.id);
      if (res.success) {
        success('Education record deleted');
        setEduToDelete(null);
      } else {
        error('Failed to delete education');
      }
    } catch (err: any) {
      error('Error deleting education', err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Education & Degrees</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage academic degrees, universities, and graduation statuses.
          </p>
        </div>

        <Button variant="primary" size="md" onClick={handleOpenAdd} leftIcon={<Plus className="w-4 h-4" />}>
          Add Degree
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.education.map((edu) => (
          <Card key={edu.id} className="p-6 bg-[#0d0f17]/95 border-white/[0.08] flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  <GraduationCap className="w-5 h-5" />
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(edu)}
                    className="p-1.5 text-sky-400 hover:bg-sky-500/10 rounded-lg transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setEduToDelete(edu)}
                    className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-bold text-white mb-1">
                {edu.degree} in {edu.field_of_study}
              </h3>
              <p className="text-sm font-semibold text-sky-400 mb-2">{edu.institution}</p>

              <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  {edu.start_year} – {edu.end_year}
                </span>
                {edu.grade_or_status && (
                  <span className="text-emerald-400 font-semibold">● {edu.grade_or_status}</span>
                )}
              </div>
            </div>

            {edu.location && (
              <p className="text-xs text-slate-500 pt-4 mt-4 border-t border-white/[0.04]">
                {edu.location}
              </p>
            )}
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEdu ? 'Edit Degree' : 'Add Degree'}
      >
        <form onSubmit={handleSaveEdu} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Degree (e.g. M.Tech, B.Tech) <span className="text-sky-400">*</span>
              </label>
              <input
                type="text"
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-sky-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Field of Study <span className="text-sky-400">*</span>
              </label>
              <input
                type="text"
                value={formData.field_of_study}
                onChange={(e) => setFormData({ ...formData, field_of_study: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-sky-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Institution / University <span className="text-sky-400">*</span>
            </label>
            <input
              type="text"
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-sky-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Start Year
              </label>
              <input
                type="text"
                value={formData.start_year}
                onChange={(e) => setFormData({ ...formData, start_year: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-sky-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                End Year
              </label>
              <input
                type="text"
                value={formData.end_year}
                onChange={(e) => setFormData({ ...formData, end_year: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-sky-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Status / Grade
              </label>
              <input
                type="text"
                value={formData.grade_or_status}
                onChange={(e) => setFormData({ ...formData, grade_or_status: e.target.value })}
                placeholder="Pursuing / Graduated"
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-sky-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-sky-400"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-white/[0.08]">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
              Save Degree
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(eduToDelete)}
        onClose={() => setEduToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Degree"
        message={`Delete "${eduToDelete?.degree} in ${eduToDelete?.field_of_study}"?`}
      />
    </div>
  );
};
