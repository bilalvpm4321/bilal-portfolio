import React, { useState, useMemo } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { useToast } from '../../components/common/Toast';
import { Skill } from '../../types/database';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Plus, Edit2, Trash2, Brain, Check, Eye, EyeOff, Layers } from 'lucide-react';

const CATEGORIES = [
  'Programming',
  'AI & Machine Learning',
  'Frontend',
  'Backend & Cloud',
  'Databases',
  'DevOps & Tools',
];

const LEVELS = ['Expert', 'Advanced', 'Proficient', 'Familiar'];

export const AdminSkillsPage: React.FC = () => {
  const { data, createSkill, updateSkill, deleteSkill } = usePortfolio();
  const { success, error } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [skillToDelete, setSkillToDelete] = useState<Skill | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Programming',
    icon: '',
    level: 'Advanced',
    display_order: 1,
    is_visible: true,
  });

  const skillsByCategory = useMemo(() => {
    const grouped: Record<string, Skill[]> = {};
    data.skills.forEach((skill) => {
      if (!grouped[skill.category]) grouped[skill.category] = [];
      grouped[skill.category].push(skill);
    });
    return grouped;
  }, [data.skills]);

  const handleOpenAdd = () => {
    setEditingSkill(null);
    setFormData({
      name: '',
      category: 'Programming',
      icon: '',
      level: 'Advanced',
      display_order: data.skills.length + 1,
      is_visible: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      icon: skill.icon || '',
      level: skill.level,
      display_order: skill.display_order,
      is_visible: skill.is_visible,
    });
    setIsModalOpen(true);
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      error('Please enter a skill name.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingSkill) {
        const res = await updateSkill(editingSkill.id, formData);
        if (res.success) {
          success(`Updated skill "${formData.name}"`);
          setIsModalOpen(false);
        } else {
          error('Failed to update skill', res.error?.message);
        }
      } else {
        const res = await createSkill(formData);
        if (res.success) {
          success(`Created skill "${formData.name}"`);
          setIsModalOpen(false);
        } else {
          error('Failed to create skill', res.error?.message);
        }
      }
    } catch (err: any) {
      error('Error saving skill', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!skillToDelete) return;
    try {
      const res = await deleteSkill(skillToDelete.id);
      if (res.success) {
        success('Skill deleted');
        setSkillToDelete(null);
      } else {
        error('Failed to delete skill');
      }
    } catch (err: any) {
      error('Error deleting skill', err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Skills & Technologies</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage programming languages, frameworks, AI tools, and technical proficiency.
          </p>
        </div>

        <Button variant="primary" size="md" onClick={handleOpenAdd} leftIcon={<Plus className="w-4 h-4" />}>
          Add New Skill
        </Button>
      </div>

      {/* Skills Grouped by Category */}
      <div className="space-y-6">
        {Object.entries(skillsByCategory).map(([category, skills]) => (
          <Card key={category} className="p-6 bg-[#0d0f17]/95 border-white/[0.08]">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-sky-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">{category}</h2>
                <span className="text-xs font-mono text-slate-400">({skills.length})</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between hover:border-sky-500/30 transition-all"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{skill.name}</span>
                      {!skill.is_visible && (
                        <span className="text-[10px] text-slate-500 font-semibold">(Hidden)</span>
                      )}
                    </div>
                    <span className="text-[10px] text-sky-400 font-medium">{skill.level}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(skill)}
                      className="p-1.5 text-slate-400 hover:text-sky-400 rounded-lg transition-colors cursor-pointer"
                      title="Edit skill"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setSkillToDelete(skill)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                      title="Delete skill"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Add / Edit Skill Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSkill ? 'Edit Skill' : 'Add New Skill'}
      >
        <form onSubmit={handleSaveSkill} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Skill Name <span className="text-sky-400">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Python, React, Generative AI"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-sky-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/[0.08] text-white text-sm focus:outline-none focus:border-sky-400"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Proficiency Level
              </label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/[0.08] text-white text-sm focus:outline-none focus:border-sky-400"
              >
                {LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Display Order
              </label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) =>
                  setFormData({ ...formData, display_order: parseInt(e.target.value) || 1 })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-sky-400"
              />
            </div>

            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_visible}
                  onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
                  className="w-4 h-4 rounded text-sky-500 bg-white/[0.04] border-white/[0.1]"
                />
                <span className="text-xs text-white font-medium">Visible on Public Portfolio</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-white/[0.08]">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
              Save Skill
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(skillToDelete)}
        onClose={() => setSkillToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Skill"
        message={`Delete "${skillToDelete?.name}" from your portfolio?`}
      />
    </div>
  );
};
