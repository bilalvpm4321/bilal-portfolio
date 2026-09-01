import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { usePortfolio } from '../../context/PortfolioContext';
import { useToast } from '../../components/common/Toast';
import { Project } from '../../types/database';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Eye,
  EyeOff,
  Sparkles,
  ArrowUpDown,
  Layers,
} from 'lucide-react';

export const AdminProjectsPage: React.FC = () => {
  const { data, updateProject, deleteProject } = usePortfolio();
  const { success, error } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const categories = useMemo(() => {
    const list = data.projects.map((p) => p.category);
    return ['All', ...Array.from(new Set(list))];
  }, [data.projects]);

  const filteredProjects = useMemo(() => {
    return data.projects.filter((p) => {
      const matchSearch =
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.short_description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = categoryFilter === 'All' || p.category === categoryFilter;
      return matchSearch && matchCategory;
    });
  }, [data.projects, searchTerm, categoryFilter]);

  const handleTogglePublish = async (project: Project) => {
    try {
      const res = await updateProject(project.id, { is_published: !project.is_published });
      if (res.success) {
        success(
          `Project ${!project.is_published ? 'published' : 'moved to draft'}!`,
          'Changes updated.'
        );
      } else {
        error('Failed to update project status');
      }
    } catch (err: any) {
      error('Error updating status', err.message);
    }
  };

  const handleToggleFeatured = async (project: Project) => {
    try {
      const res = await updateProject(project.id, { is_featured: !project.is_featured });
      if (res.success) {
        success(`Featured status updated for "${project.title}"`);
      } else {
        error('Failed to toggle featured status');
      }
    } catch (err: any) {
      error('Error updating status', err.message);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;
    setIsDeleting(true);
    try {
      const res = await deleteProject(projectToDelete.id);
      if (res.success) {
        success('Project deleted successfully');
        setProjectToDelete(null);
      } else {
        error('Failed to delete project', res.error?.message);
      }
    } catch (err: any) {
      error('Error deleting project', err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Projects Management</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Create, edit, reorder, and manage portfolio project showcases.
          </p>
        </div>

        <Link to="/admin/projects/new">
          <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>
            Create New Project
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 bg-[#0d0f17]/95 border-white/[0.08] flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search projects by title, category, or description..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-sky-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-sky-400 w-full sm:w-auto"
          >
            {categories.map((c) => (
              <option key={c} value={c} className="bg-slate-900 text-white">
                {c === 'All' ? 'All Categories' : c}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Projects Table */}
      <Card className="p-0 bg-[#0d0f17]/95 border-white/[0.08] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.02] text-slate-400">
                <th className="p-4 font-semibold">Order</th>
                <th className="p-4 font-semibold">Project</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Technologies</th>
                <th className="p-4 font-semibold text-center">Featured</th>
                <th className="p-4 font-semibold text-center">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No projects found matching your search.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-mono text-slate-400">#{project.display_order}</td>

                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-800 overflow-hidden shrink-0 border border-white/[0.06]">
                          {project.image_url ? (
                            <img src={project.image_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-600">
                              <Layers className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-white">{project.title}</p>
                          <p className="text-[11px] text-slate-400 font-mono">/{project.slug}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-slate-300 font-medium">{project.category}</td>

                    <td className="p-4 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {project.technologies?.slice(0, 3).map((t) => (
                          <span
                            key={t.id}
                            className="px-2 py-0.5 rounded text-[10px] bg-white/[0.04] text-slate-300 border border-white/[0.06]"
                          >
                            {t.name}
                          </span>
                        ))}
                        {project.technologies && project.technologies.length > 3 && (
                          <span className="text-[10px] text-slate-500 font-mono">
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(project)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          project.is_featured
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                            : 'bg-white/[0.02] border-white/[0.06] text-slate-500 hover:text-slate-300'
                        }`}
                        title={project.is_featured ? 'Featured' : 'Not Featured'}
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>
                    </td>

                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleTogglePublish(project)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors cursor-pointer ${
                          project.is_published
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {project.is_published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{project.is_published ? 'Published' : 'Draft'}</span>
                      </button>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/projects/${project.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                          title="View on site"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/admin/projects/${project.id}/edit`}
                          className="p-1.5 rounded-lg text-sky-400 hover:text-sky-300 hover:bg-sky-500/10 transition-colors"
                          title="Edit project"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setProjectToDelete(project)}
                          className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Delete project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(projectToDelete)}
        onClose={() => setProjectToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Project"
        message={`Are you sure you want to delete "${projectToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete Project"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};
