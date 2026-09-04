import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usePortfolio } from '../../context/PortfolioContext';
import { useToast } from '../../components/common/Toast';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ImageUploader } from '../../components/admin/ImageUploader';
import {
  ArrowLeft,
  Save,
  Award,
  Calendar,
  ExternalLink,
  ShieldCheck,
  Tag,
  Plus,
  X,
  Sparkles,
  Eye,
  CheckCircle2,
  FileText,
  Info,
} from 'lucide-react';

const POPULAR_CATEGORIES = [
  'AI & Machine Learning',
  'Cloud & DevOps',
  'Full Stack Development',
  'Data Science & Analytics',
  'Cybersecurity',
  'Programming Languages',
  'Honors & Specializations',
];

const ISSUER_SUGGESTIONS = [
  'Google Cloud',
  'Amazon Web Services (AWS)',
  'DeepLearning.AI',
  'Coursera',
  'Meta',
  'Microsoft Learn',
  'Stanford Online',
  'Udemy',
  'IEEE',
  'HackerRank',
];

export const AdminCertificateUploadPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === 'new';
  const { data, createCertification, updateCertification } = usePortfolio();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    issuer: '',
    issue_date: new Date().getFullYear().toString(),
    expires_at: '',
    credential_id: '',
    credential_url: '',
    certificate_url: '',
    image_url: '',
    category: 'AI & Machine Learning',
    description: '',
    display_order: 1,
    is_visible: true,
  });

  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load existing certificate if editing
  useEffect(() => {
    if (!isNew && id) {
      const existing = data.certifications.find((c) => c.id === id);
      if (existing) {
        setFormData({
          name: existing.name,
          issuer: existing.issuer,
          issue_date: existing.issue_date || '',
          expires_at: existing.expires_at || '',
          credential_id: existing.credential_id || '',
          credential_url: existing.credential_url || '',
          certificate_url: existing.certificate_url || existing.image_url || '',
          image_url: existing.image_url || existing.certificate_url || '',
          category: existing.category || 'AI & Machine Learning',
          description: existing.description || '',
          display_order: existing.display_order ?? 1,
          is_visible: existing.is_visible ?? true,
        });

        if (existing.skills && Array.isArray(existing.skills)) {
          setSkills(existing.skills);
        }
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        display_order: data.certifications.length + 1,
      }));
    }
  }, [id, isNew, data.certifications]);

  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed) return;
    if (!skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleImageChange = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      certificate_url: url,
      image_url: url,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      error('Certificate Name is required', 'Please provide a title for this certificate.');
      return;
    }

    if (!formData.issuer.trim()) {
      error('Issuer is required', 'Please provide the issuing organization or platform.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        issuer: formData.issuer.trim(),
        issue_date: formData.issue_date.trim() || null,
        expires_at: formData.expires_at.trim() || null,
        credential_id: formData.credential_id.trim() || null,
        credential_url: formData.credential_url.trim() || null,
        certificate_url: formData.certificate_url.trim() || null,
        image_url: formData.image_url.trim() || formData.certificate_url.trim() || null,
        category: formData.category.trim() || 'General',
        description: formData.description.trim() || null,
        skills: skills,
        display_order: Number(formData.display_order) || 1,
        is_visible: formData.is_visible,
      };

      if (!isNew && id) {
        const res = await updateCertification(id, payload);
        if (res.success) {
          success('Certificate updated successfully!', 'Your changes are live on the portfolio.');
          navigate('/admin/certifications');
        } else {
          error('Update failed', res.error?.message || 'Could not update certificate.');
        }
      } else {
        const res = await createCertification(payload);
        if (res.success) {
          success('Certificate uploaded successfully!', 'New certificate is now published.');
          navigate('/admin/certifications');
        } else {
          error('Upload failed', res.error?.message || 'Could not save certificate.');
        }
      }
    } catch (err: any) {
      console.error('Error saving certificate:', err);
      error('Submission Error', err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/certifications"
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white border border-white/[0.08] transition-colors"
            title="Back to Certifications"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-sky-400" />
              {isNew ? 'Upload New Certificate' : 'Edit Certificate'}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Upload certificate files/images and attach verification links to showcase on your portfolio.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/admin/certifications">
            <Button variant="outline" size="sm">
              Cancel
            </Button>
          </Link>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            leftIcon={<Save className="w-4 h-4" />}
          >
            {isNew ? 'Publish Certificate' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Main Grid: Form & Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Fields (7 cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          {/* Certificate Media Upload */}
          <Card className="p-5 bg-[#0d0f17]/95 border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky-400" />
                  Certificate Image or Document
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Upload a high-resolution PNG, JPG, or WebP file of the certificate, or paste a direct image URL.
                </p>
              </div>
            </div>

            <ImageUploader
              value={formData.certificate_url}
              onChange={handleImageChange}
              folder="certificates"
              label="Certificate Document / Badge Image"
              aspectRatio="free"
            />
          </Card>

          {/* Core Information */}
          <Card className="p-5 bg-[#0d0f17]/95 border-white/[0.08] space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-sky-400" />
              Certificate Details
            </h2>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Certificate Title / Course Name <span className="text-sky-400">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Deep Learning Specialization / Google Cloud Associate Engineer"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder-slate-500 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all"
              />
            </div>

            {/* Issuer with Quick Suggestions */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Issuing Organization / Authority <span className="text-sky-400">*</span>
              </label>
              <input
                type="text"
                value={formData.issuer}
                onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                placeholder="e.g. DeepLearning.AI & Coursera, Amazon Web Services"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder-slate-500 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all"
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className="text-[11px] text-slate-500 mr-1 self-center">Popular:</span>
                {ISSUER_SUGGESTIONS.slice(0, 5).map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => setFormData({ ...formData, issuer: sug })}
                    className="px-2 py-0.5 rounded-md bg-white/[0.03] hover:bg-white/[0.08] text-[11px] text-slate-400 hover:text-white border border-white/[0.06] transition-colors cursor-pointer"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
                {POPULAR_CATEGORIES.map((cat) => {
                  const isSelected = formData.category === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat })}
                      className={`px-3 py-2 rounded-xl text-xs font-medium text-left border transition-all cursor-pointer truncate ${
                        isSelected
                          ? 'bg-sky-500/15 border-sky-500/40 text-sky-400 font-semibold shadow-xs'
                          : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.05]'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Or custom category name..."
                className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white text-xs placeholder-slate-500 focus:outline-none focus:border-sky-400"
              />
            </div>

            {/* Date Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Issue Date
                </label>
                <input
                  type="text"
                  value={formData.issue_date}
                  onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                  placeholder="e.g. 2024 or Oct 2024"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Expiration Date (Optional)
                </label>
                <input
                  type="text"
                  value={formData.expires_at}
                  onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                  placeholder="e.g. No Expiration or 2027"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-sky-400"
                />
              </div>
            </div>

            {/* Verification & Credentials */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Credential ID (Optional)
                </label>
                <input
                  type="text"
                  value={formData.credential_id}
                  onChange={(e) => setFormData({ ...formData, credential_id: e.target.value })}
                  placeholder="e.g. AWS-339210 or DL-889342"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm font-mono focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Verification / Credly URL
                </label>
                <input
                  type="url"
                  value={formData.credential_url}
                  onChange={(e) => setFormData({ ...formData, credential_url: e.target.value })}
                  placeholder="https://credly.com/... or coursera.org/verify/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-sky-400"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Description / Curriculum Summary
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief summary of skills, competencies, or hands-on projects validated by this certificate..."
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder-slate-500 focus:outline-none focus:border-sky-400"
              />
            </div>
          </Card>

          {/* Skills Verified */}
          <Card className="p-5 bg-[#0d0f17]/95 border-white/[0.08] space-y-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Tag className="w-4 h-4 text-sky-400" />
              Verified Skills & Tools
            </h2>
            <p className="text-xs text-slate-400">
              Add technologies and key skills authenticated by this certification.
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                placeholder="e.g. PyTorch, Kubernetes, React, AWS Lambda..."
                className="flex-1 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-sky-400"
              />
              <Button type="button" variant="secondary" size="sm" onClick={handleAddSkill} leftIcon={<Plus className="w-3.5 h-3.5" />}>
                Add Skill
              </Button>
            </div>

            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-medium"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </Card>

          {/* Display & Visibility Settings */}
          <Card className="p-5 bg-[#0d0f17]/95 border-white/[0.08]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 1 })}
                  className="w-24 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_visible"
                  checked={formData.is_visible}
                  onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
                  className="w-4 h-4 rounded border-white/[0.2] bg-white/[0.05] text-sky-500 focus:ring-sky-400"
                />
                <label htmlFor="is_visible" className="text-xs font-semibold text-white cursor-pointer select-none">
                  Visible on Portfolio
                  <p className="text-[11px] text-slate-400 font-normal">
                    Turn off to keep certificate saved in CMS as a draft
                  </p>
                </label>
              </div>
            </div>
          </Card>
        </form>

        {/* Right Column: Live Portfolio Preview Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-20 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-sky-400" />
                Live Portfolio Preview
              </h2>
              <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Realtime
              </span>
            </div>

            {/* The Preview Card rendered with Portfolio styling */}
            <div className="rounded-2xl border border-[#738666]/30 bg-[#fbfcf9] text-[#1b281c] p-5 shadow-xl shadow-[#1b281c]/[0.05] relative overflow-hidden group">
              {/* Category & Status */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#738666]/15 text-[#3e5239] border border-[#738666]/25">
                  {formData.category || 'Certification'}
                </span>

                {formData.credential_url ? (
                  <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Verified
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400 font-mono">
                    {formData.issue_date || 'Date'}
                  </span>
                )}
              </div>

              {/* Certificate Image Preview */}
              <div className="w-full min-h-[160px] max-h-[340px] rounded-xl overflow-hidden bg-[#eef1ea]/70 border border-[#738666]/20 relative mb-4 flex items-center justify-center p-2">
                {formData.certificate_url ? (
                  <img
                    src={formData.certificate_url}
                    alt={formData.name || 'Certificate'}
                    className="w-full h-auto max-h-[320px] object-contain rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-[#738666] p-4 text-center">
                    <Award className="w-10 h-10 stroke-1" />
                    <p className="text-xs font-medium text-[#556950]">Certificate image will preview here</p>
                  </div>
                )}

                <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-white text-[10px] font-mono">
                  {formData.issue_date || '2024'}
                </div>
              </div>

              {/* Title & Issuer */}
              <h3 className="text-base font-bold text-[#1b281c] font-display line-clamp-2 mb-1">
                {formData.name || 'Certificate Title'}
              </h3>
              <p className="text-xs font-semibold text-[#556950] mb-2 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#738666]" />
                {formData.issuer || 'Issuing Authority'}
              </p>

              {/* Description */}
              {formData.description && (
                <p className="text-xs text-[#3b4e39]/80 line-clamp-2 mb-3 leading-relaxed">
                  {formData.description}
                </p>
              )}

              {/* Skills preview */}
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {skills.slice(0, 4).map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#738666]/10 text-[#2f422d]"
                    >
                      {skill}
                    </span>
                  ))}
                  {skills.length > 4 && (
                    <span className="text-[10px] text-[#556950] font-mono self-center">
                      +{skills.length - 4} more
                    </span>
                  )}
                </div>
              )}

              {/* Action Preview Buttons */}
              <div className="pt-3 border-t border-[#738666]/15 flex items-center justify-between text-xs">
                {formData.credential_id && (
                  <span className="font-mono text-[10px] text-[#556950]">
                    ID: {formData.credential_id}
                  </span>
                )}
                {formData.credential_url ? (
                  <span className="text-[#3b4e39] font-medium hover:text-[#1b281c] flex items-center gap-1 ml-auto">
                    <span>Verify Credential</span>
                    <ExternalLink className="w-3 h-3 text-[#738666]" />
                  </span>
                ) : (
                  <span className="text-[11px] text-[#556950] ml-auto">View Certificate</span>
                )}
              </div>
            </div>

            {/* Quick Tips Box */}
            <Card className="p-4 bg-sky-950/20 border-sky-500/20 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-sky-400 font-semibold">
                <Info className="w-4 h-4 shrink-0" />
                <span>Certification Publishing Tips</span>
              </div>
              <ul className="text-slate-400 space-y-1 text-[11px] list-disc list-inside">
                <li>Attach a high-contrast horizontal certificate image for the best showcase presentation.</li>
                <li>Credly and Coursera URLs provide instant verifiable badge trust for recruiters.</li>
                <li>Adding skill tags enables search and filtering on your live portfolio.</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
