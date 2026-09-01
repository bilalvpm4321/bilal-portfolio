import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { useToast } from '../../components/common/Toast';
import { Experience } from '../../types/database';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Plus, Edit2, Trash2, Briefcase, Calendar, MapPin, Building, CheckCircle2 } from 'lucide-react';

export const AdminExperiencePage: React.FC = () => {
  const { data, createExperience, updateExperience, deleteExperience } = usePortfolio();
  const { success, error } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [expToDelete, setExpToDelete] = useState<Experience | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    company_url: '',
    description: '',
    start_date: '',
    end_date: '',
    is_current: false,
    location: '',
    display_order: 1,
  });

  const [responsibilities, setResponsibilities] = useState<string[]>([]);
  const [respInput, setRespInput] = useState('');

  const [technologies, setTechnologies] = useState<string[]>([]);
  const [techInput, setTechInput] = useState('');

  const handleOpenAdd = () => {
    setEditingExp(null);
    setFormData({
      title: '',
      company: '',
      company_url: '',
      description: '',
      start_date: '',
      end_date: '',
      is_current: false,
      location: 'Kerala, India',
      display_order: data.experience.length + 1,
    });
    setResponsibilities([]);
    setTechnologies([]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (exp: Experience) => {
    setEditingExp(exp);
    setFormData({
      title: exp.title,
      company: exp.company,
      company_url: exp.company_url || '',
      description: exp.description || '',
      start_date: exp.start_date,
      end_date: exp.end_date || '',
      is_current: exp.is_current,
      location: exp.location || '',
      display_order: exp.display_order,
    });
    setResponsibilities(exp.responsibilities || []);
    setTechnologies(exp.technologies || []);
    setIsModalOpen(true);
  };

  const handleAddResp = () => {
    if (!respInput.trim()) return;
    setResponsibilities([...responsibilities, respInput.trim()]);
    setRespInput('');
  };

  const handleRemoveResp = (index: number) => {
    setResponsibilities(responsibilities.filter((_, i) => i !== index));
  };

  const handleAddTech = () => {
    if (!techInput.trim()) return;
    if (!technologies.includes(techInput.trim())) {
      setTechnologies([...technologies, techInput.trim()]);
    }
    setTechInput('');
  };

  const handleRemoveTech = (tech: string) => {
    setTechnologies(technologies.filter((t) => t !== tech));
  };

  const handleSaveExp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.company || !formData.start_date) {
      error('Please complete all required fields (Job Title, Company, Start Date).');
      return;
    }

    const payload = {
      ...formData,
      responsibilities,
      technologies,
    };

    setIsSubmitting(true);
    try {
      if (editingExp) {
        const res = await updateExperience(editingExp.id, payload);
        if (res.success) {
          success(`Updated experience at "${formData.company}"`);
          setIsModalOpen(false);
        } else {
          error('Failed to update experience', res.error?.message);
        }
      } else {
        const res = await createExperience(payload);
        if (res.success) {
          success(`Created experience at "${formData.company}"`);
          setIsModalOpen(false);
        } else {
          error('Failed to create experience', res.error?.message);
        }
      }
    } catch (err: any) {
      error('Error saving experience', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!expToDelete) return;
    try {
      const res = await deleteExperience(expToDelete.id);
      if (res.success) {
        success('Experience deleted');
        setExpToDelete(null);
      } else {
        error('Failed to delete experience');
      }
    } catch (err: any) {
      error('Error deleting experience', err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Work Experience</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your employment history, roles, responsibilities, and achievements.
          </p>
        </div>

        <Button variant="primary" size="md" onClick={handleOpenAdd} leftIcon={<Plus className="w-4 h-4" />}>
          Add Experience
        </Button>
      </div>

      {/* Experience List */}
      <div className="space-y-4">
        {data.experience.map((exp) => (
          <Card key={exp.id} className="p-6 bg-[#0d0f17]/95 border-white/[0.08]">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">{exp.title}</h3>
                  <span className="text-xs font-mono text-slate-500">#{exp.display_order}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-sky-400 font-semibold mt-1">
                  <Building className="w-4 h-4" />
                  <span>{exp.company}</span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2">
                  <span className="flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-sky-400" />
                    {exp.start_date} – {exp.is_current ? 'Present' : exp.end_date}
                  </span>
                  {exp.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      {exp.location}
                    </span>
                  )}
                </div>

                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <div className="space-y-1.5 mt-4">
                    {exp.responsibilities.slice(0, 3).map((r, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                        <span>{r}</span>
                      </div>
                    ))}
                    {exp.responsibilities.length > 3 && (
                      <p className="text-[11px] text-slate-500 font-mono pl-5">
                        +{exp.responsibilities.length - 3} more responsibilities
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleOpenEdit(exp)}
                  className="p-2 text-sky-400 hover:bg-sky-500/10 rounded-lg transition-colors cursor-pointer"
                  title="Edit experience"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setExpToDelete(exp)}
                  className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                  title="Delete experience"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add / Edit Experience Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingExp ? 'Edit Experience' : 'Add Experience'}
        maxWidth="xl"
      >
        <form onSubmit={handleSaveExp} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Job Title <span className="text-sky-400">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Full Stack Developer"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-sky-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Company Name <span className="text-sky-400">*</span>
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g. Expectation Walkers"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-sky-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Company Website URL
              </label>
              <input
                type="url"
                value={formData.company_url}
                onChange={(e) => setFormData({ ...formData, company_url: e.target.value })}
                placeholder="https://company.com"
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-sky-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Kerala, India"
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-sky-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Start Date <span className="text-sky-400">*</span>
              </label>
              <input
                type="text"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                placeholder="e.g. May 2026"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-sky-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                End Date (leave empty if Present)
              </label>
              <input
                type="text"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                placeholder="e.g. Sep 2026"
                disabled={formData.is_current}
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-sky-400 disabled:opacity-40"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 py-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_current}
                onChange={(e) => setFormData({ ...formData, is_current: e.target.checked })}
                className="w-4 h-4 rounded text-sky-500 bg-white/[0.04] border-white/[0.1]"
              />
              <span className="text-xs text-white font-medium">Currently working in this role</span>
            </label>
          </div>

          {/* Responsibilities list builder */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Responsibilities & Accomplishments
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={respInput}
                onChange={(e) => setRespInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddResp();
                  }
                }}
                placeholder="Add bullet point responsibility..."
                className="flex-1 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-sky-400"
              />
              <Button type="button" variant="secondary" size="sm" onClick={handleAddResp}>
                Add
              </Button>
            </div>

            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {responsibilities.map((r, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/[0.04] text-xs text-slate-300"
                >
                  <span className="truncate max-w-sm">{r}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveResp(idx)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Technologies */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Technologies Used
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTech();
                  }
                }}
                placeholder="e.g. React, Python, GCP..."
                className="flex-1 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-sky-400"
              />
              <Button type="button" variant="secondary" size="sm" onClick={handleAddTech}>
                Add
              </Button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {technologies.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-sky-500/10 text-sky-300 border border-sky-500/20 text-xs"
                >
                  <span>{t}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTech(t)}
                    className="hover:text-rose-400"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-white/[0.08]">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
              Save Experience
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(expToDelete)}
        onClose={() => setExpToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Experience"
        message={`Delete record "${expToDelete?.title} at ${expToDelete?.company}"?`}
      />
    </div>
  );
};
