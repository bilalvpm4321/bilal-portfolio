import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usePortfolio } from '../../context/PortfolioContext';
import { useToast } from '../../components/common/Toast';
import { slugify } from '../../lib/utils';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { ImageUploader } from '../../components/admin/ImageUploader';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Layers,
  Sparkles,
  Link as LinkIcon,
  CheckCircle2,
  Activity,
  Image as ImageIcon,
} from 'lucide-react';

export const AdminProjectEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === 'new';
  const { data, createProject, updateProject } = usePortfolio();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    short_description: '',
    detailed_description: '',
    category: 'Generative AI / NLP / Full Stack',
    image_url: '',
    gallery_images: [] as string[],
    github_url: '',
    live_url: '',
    is_featured: false,
    is_published: true,
    display_order: 1,
    project_date: '2024 - Present',
  });

  const [technologies, setTechnologies] = useState<string[]>([]);
  const [techInput, setTechInput] = useState('');

  const [highlights, setHighlights] = useState<string[]>([]);
  const [highlightInput, setHighlightInput] = useState('');

  const [metrics, setMetrics] = useState<Array<{ key: string; value: string }>>([]);
  const [metricKey, setMetricKey] = useState('');
  const [metricVal, setMetricVal] = useState('');

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isNew && id) {
      const existing = data.projects.find((p) => p.id === id);
      if (existing) {
        setFormData({
          title: existing.title,
          slug: existing.slug,
          short_description: existing.short_description,
          detailed_description: existing.detailed_description || '',
          category: existing.category,
          image_url: existing.image_url || '',
          gallery_images: existing.gallery_images || [],
          github_url: existing.github_url || '',
          live_url: existing.live_url || '',
          is_featured: existing.is_featured,
          is_published: existing.is_published,
          display_order: existing.display_order || 1,
          project_date: existing.project_date || '',
        });

        if (existing.technologies) {
          setTechnologies(existing.technologies.map((t) => t.name));
        }

        if (existing.highlights) {
          setHighlights(existing.highlights);
        }

        if (existing.metrics) {
          setMetrics(
            Object.entries(existing.metrics).map(([key, value]) => ({
              key,
              value: String(value),
            }))
          );
        }
      }
    }
  }, [id, isNew, data.projects]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    if (isNew) {
      setFormData((prev) => ({
        ...prev,
        title,
        slug: slugify(title),
      }));
    } else {
      setFormData((prev) => ({ ...prev, title }));
    }
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

  const handleAddHighlight = () => {
    if (!highlightInput.trim()) return;
    setHighlights([...highlights, highlightInput.trim()]);
    setHighlightInput('');
  };

  const handleRemoveHighlight = (index: number) => {
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  const handleAddMetric = () => {
    if (!metricKey.trim() || !metricVal.trim()) return;
    setMetrics([...metrics, { key: metricKey.trim(), value: metricVal.trim() }]);
    setMetricKey('');
    setMetricVal('');
  };

  const handleRemoveMetric = (index: number) => {
    setMetrics(metrics.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug || !formData.short_description) {
      error('Please complete all required fields (Title, Slug, Short Description).');
      return;
    }

    const metricsObj: Record<string, string> = {};
    metrics.forEach((m) => {
      metricsObj[m.key] = m.value;
    });

    const projectPayload = {
      ...formData,
      metrics: metricsObj,
      highlights,
    };

    setIsSaving(true);
    try {
      if (isNew) {
        const res = await createProject(projectPayload, technologies);
        if (res.success) {
          success('Project created successfully!', 'Your project is now in your portfolio.');
          navigate('/admin/projects');
        } else {
          error('Failed to create project', res.error?.message);
        }
      } else {
        const res = await updateProject(id!, projectPayload, technologies);
        if (res.success) {
          success('Project updated successfully!');
          navigate('/admin/projects');
        } else {
          error('Failed to update project', res.error?.message);
        }
      }
    } catch (err: any) {
      error('Error saving project', err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/projects"
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-white/[0.04] border border-white/[0.06] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white">
              {isNew ? 'Create New Project' : `Edit: ${formData.title}`}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Configure project metadata, technology stacks, images, and showcases.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => navigate('/admin/projects')}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            variant="primary"
            size="md"
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            {isNew ? 'Create Project' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Core Fields */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="p-6 bg-[#0d0f17]/95 border-white/[0.08] space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">
              Basic Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Project Title <span className="text-sky-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={handleTitleChange}
                  placeholder="e.g. Smile AI Tutor"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  URL Slug <span className="text-sky-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: slugify(e.target.value) })}
                  placeholder="e.g. smile-ai-tutor"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm font-mono focus:outline-none focus:border-sky-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Category <span className="text-sky-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g. Generative AI / NLP / Full Stack"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Project Date / Timeline
                </label>
                <input
                  type="text"
                  value={formData.project_date}
                  onChange={(e) => setFormData({ ...formData, project_date: e.target.value })}
                  placeholder="e.g. 2024 - Present"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-sky-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Short Description (Cards & Previews) <span className="text-sky-400">*</span>
              </label>
              <textarea
                rows={3}
                value={formData.short_description}
                onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                placeholder="Concise overview of what this project accomplishes..."
                required
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-sky-400 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Detailed Description & Architecture
              </label>
              <textarea
                rows={6}
                value={formData.detailed_description}
                onChange={(e) => setFormData({ ...formData, detailed_description: e.target.value })}
                placeholder="Comprehensive breakdown of features, architecture, machine learning models, and system design..."
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-sky-400 resize-none leading-relaxed"
              />
            </div>
          </Card>

          {/* Technology Chips Input */}
          <Card className="p-6 bg-[#0d0f17]/95 border-white/[0.08]">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-400" />
              <span>Technologies & Libraries</span>
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Normalized technology tags attached to this project.
            </p>

            <div className="flex gap-2 mb-3">
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
                placeholder="Add technology (e.g. FastAPI, OpenCV, Docker, React)..."
                className="flex-1 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-sky-400"
              />
              <Button type="button" variant="secondary" size="sm" onClick={handleAddTech}>
                Add
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {technologies.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-500/10 text-sky-300 border border-sky-500/20 text-xs font-medium"
                >
                  <span>{tech}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTech(tech)}
                    className="hover:text-rose-400 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </Card>

          {/* Key Capabilities / Highlights */}
          <Card className="p-6 bg-[#0d0f17]/95 border-white/[0.08]">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Key Capabilities & Highlights</span>
            </h2>

            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={highlightInput}
                onChange={(e) => setHighlightInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddHighlight();
                  }
                }}
                placeholder="Add a key feature or highlight bullet point..."
                className="flex-1 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-sky-400"
              />
              <Button type="button" variant="secondary" size="sm" onClick={handleAddHighlight}>
                Add
              </Button>
            </div>

            <div className="space-y-2">
              {highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-slate-300"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveHighlight(idx)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </Card>

          {/* Metrics & Performance */}
          <Card className="p-6 bg-[#0d0f17]/95 border-white/[0.08]">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" />
              <span>Key Metrics & Performance</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 mb-3">
              <input
                type="text"
                value={metricKey}
                onChange={(e) => setMetricKey(e.target.value)}
                placeholder="Metric Name (e.g. Accuracy)"
                className="sm:col-span-2 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-sky-400"
              />
              <input
                type="text"
                value={metricVal}
                onChange={(e) => setMetricVal(e.target.value)}
                placeholder="Metric Value (e.g. 98.7%)"
                className="sm:col-span-2 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-sky-400"
              />
              <Button type="button" variant="secondary" size="sm" onClick={handleAddMetric}>
                Add Metric
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {metrics.map((m, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-sky-500/5 border border-sky-500/20 flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-bold text-sky-400">{m.value}</p>
                    <p className="text-[10px] text-slate-400 capitalize">{m.key}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveMetric(idx)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Media, Links & Status */}
        <div className="lg:col-span-4 space-y-6">
          {/* Cover Image */}
          <Card className="p-6 bg-[#0d0f17]/95 border-white/[0.08]">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-sky-400" />
              <span>Project Cover Image</span>
            </h2>

            <ImageUploader
              value={formData.image_url}
              onChange={(url) => setFormData((prev) => ({ ...prev, image_url: url }))}
              folder="projects"
              label="Thumbnail"
              aspectRatio="video"
            />
          </Card>

          {/* Links */}
          <Card className="p-6 bg-[#0d0f17]/95 border-white/[0.08] space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-sky-400" />
              <span>Project Links</span>
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                GitHub Repository URL
              </label>
              <input
                type="url"
                value={formData.github_url}
                onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                placeholder="https://github.com/bilalvpm4321/..."
                className="w-full px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-sky-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Live Demo / Deployment URL
              </label>
              <input
                type="url"
                value={formData.live_url}
                onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                placeholder="https://demo-app.com"
                className="w-full px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-sky-400"
              />
            </div>
          </Card>

          {/* Controls: Display Order, Featured, Published */}
          <Card className="p-6 bg-[#0d0f17]/95 border-white/[0.08] space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">
              Display & Status
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Display Order Priority
              </label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) =>
                  setFormData({ ...formData, display_order: parseInt(e.target.value) || 1 })
                }
                min={1}
                className="w-full px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-sky-400"
              />
            </div>

            <div className="pt-2 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="w-4 h-4 rounded text-sky-500 focus:ring-sky-400 bg-white/[0.05] border-white/[0.1]"
                />
                <div>
                  <span className="text-xs text-white font-semibold block">Featured Project</span>
                  <span className="text-[11px] text-slate-400 block">
                    Spotlight this project with special badge on homepage
                  </span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                  className="w-4 h-4 rounded text-sky-500 focus:ring-sky-400 bg-white/[0.05] border-white/[0.1]"
                />
                <div>
                  <span className="text-xs text-white font-semibold block">Publish to Public Portfolio</span>
                  <span className="text-[11px] text-slate-400 block">
                    Uncheck to save as draft (hidden from public visitors)
                  </span>
                </div>
              </label>
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
};
