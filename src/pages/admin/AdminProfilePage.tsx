import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { useToast } from '../../components/common/Toast';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { ImageUploader } from '../../components/admin/ImageUploader';
import { FileUploader } from '../../components/admin/FileUploader';
import { Save, User, FileText, Sparkles, Plus, Trash2, Image as ImageIcon } from 'lucide-react';

interface HighlightItem {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
}

const DEFAULT_HIGHLIGHTS: HighlightItem[] = [
  {
    id: 'hl-1',
    icon: 'brain',
    title: 'M.Tech AI & DS',
    subtitle: 'CUSAT 2025–2027',
  },
  {
    id: 'hl-2',
    icon: 'code',
    title: 'Full Stack & GenAI',
    subtitle: 'React • Python • FastAPI',
  },
  {
    id: 'hl-3',
    icon: 'database',
    title: 'Cloud & Realtime',
    subtitle: 'GCP • AWS • Supabase',
  },
  {
    id: 'hl-4',
    icon: 'sparkles',
    title: 'GATE 2024',
    subtitle: 'CS & IT Qualified',
  },
  {
    id: 'hl-5',
    icon: 'graduation',
    title: 'B.Tech IT Graduate',
    subtitle: 'GEC Idukki 2021–2025',
  },
  {
    id: 'hl-6',
    icon: 'cpu',
    title: 'Machine Learning',
    subtitle: 'PyTorch • LangChain • RAG',
  },
];

export const AdminProfilePage: React.FC = () => {
  const { data, updateProfile, updateSiteSetting } = usePortfolio();
  const { success, error } = useToast();
  const profile = data.profile;

  const [formData, setFormData] = useState({
    full_name: '',
    headline: '',
    bio: '',
    about: '',
    email: '',
    phone: '',
    location: '',
    avatar_url: '',
    about_image_url: '',
    resume_url: '',
    availability_status: '',
    years_experience: '',
    is_visible: true,
  });

  const [highlights, setHighlights] = useState<HighlightItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || 'Bilal Ahamed PT',
        headline: profile.headline || '',
        bio: profile.bio || '',
        about: profile.about || '',
        email: profile.email || '',
        phone: profile.phone || '',
        location: profile.location || '',
        avatar_url: profile.avatar_url || '',
        about_image_url: profile.about_image_url || data.siteSettings?.about?.image_url || '',
        resume_url: profile.resume_url || '',
        availability_status: profile.availability_status || '',
        years_experience: profile.years_experience || '',
        is_visible: profile.is_visible ?? true,
      });
    }
  }, [profile, data.siteSettings]);

  useEffect(() => {
    const list = data.siteSettings?.hero?.highlights && data.siteSettings.hero.highlights.length > 0
      ? data.siteSettings.hero.highlights
      : DEFAULT_HIGHLIGHTS;
    setHighlights(list);
  }, [data.siteSettings]);

  const handleAddHighlight = () => {
    setHighlights((prev) => [
      ...prev,
      {
        id: `hl-${Date.now()}`,
        icon: 'sparkles',
        title: 'New Highlight',
        subtitle: 'Key achievement or skill',
      },
    ]);
  };

  const handleUpdateHighlight = (id: string, field: keyof HighlightItem, val: string) => {
    setHighlights((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: val } : item))
    );
  };

  const handleDeleteHighlight = (id: string) => {
    setHighlights((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const { about_image_url, ...profileFields } = formData;
      const [profileRes, settingRes, aboutSettingRes] = await Promise.all([
        updateProfile(profileFields),
        updateSiteSetting('hero', {
          ...(data.siteSettings?.hero || {}),
          highlights,
        }),
        updateSiteSetting('about', {
          ...(data.siteSettings?.about || {}),
          image_url: formData.about_image_url,
        }),
      ]);


      if (profileRes.success && settingRes.success) {
        success('Profile & Photos saved successfully!', 'Changes are now live across your portfolio.');
      } else {
        error('Failed to update profile', profileRes.error?.message || settingRes.error?.message);
      }
    } catch (err: any) {
      error('Error updating profile', err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Profile, Photos & Hero Highlights</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your personal bio, hero photo, long about photo (no limits), resume, and flowing highlights.
          </p>
        </div>

        <Button
          type="button"
          onClick={handleSubmit}
          variant="primary"
          size="md"
          isLoading={isSaving}
          leftIcon={<Save className="w-4 h-4" />}
        >
          Save All Changes
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Media & Assets */}
        <div className="lg:col-span-5 space-y-6">
          {/* Hero Section Photo */}
          <Card className="p-6 bg-[#0d0f17]/95 border-white/[0.08]">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-1 flex items-center gap-2">
              <User className="w-4 h-4 text-sky-400" />
              <span>Hero Entry Photo</span>
            </h2>
            <p className="text-[11px] text-slate-400 mb-4">
              Transparent background-removed photo layered in front of the giant "Bilal" masthead.
            </p>

            <ImageUploader
              value={formData.avatar_url}
              onChange={(url) => setFormData({ ...formData, avatar_url: url })}
              folder="profile"
              label="Hero Avatar Image"
              aspectRatio="auto"
            />
          </Card>

          {/* About Section Photo (Free Dimensions / No limitation) */}
          <Card className="p-6 bg-[#0d0f17]/95 border-white/[0.08]">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                <span>About Section Photo (Free Dimensions)</span>
              </h2>
            </div>
            <p className="text-[11px] text-slate-400 mb-4">
              Upload any long, tall, or wide photo. No crop or dimension limit! It displays freely on the About section without any enclosing box.
            </p>

            <ImageUploader
              value={formData.about_image_url}
              onChange={(url) => setFormData({ ...formData, about_image_url: url })}
              folder="profile"
              label="About Photo (Any Length/Width)"
              aspectRatio="free"
            />
          </Card>

          {/* Resume PDF */}
          <Card className="p-6 bg-[#0d0f17]/95 border-white/[0.08]">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-400" />
              <span>Resume Document (PDF)</span>
            </h2>
            <p className="text-[11px] text-slate-400 mb-4">
              Uploaded PDF downloaded by visitors when clicking "Download Resume".
            </p>

            <FileUploader
              value={formData.resume_url}
              onChange={(url) => setFormData({ ...formData, resume_url: url })}
              folder="documents"
              label="Resume PDF"
              accept=".pdf"
            />
          </Card>
        </div>

        {/* Right Column: Bio & Personal Info */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 bg-[#0d0f17]/95 border-white/[0.08] space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">
              Personal Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Headline
                </label>
                <input
                  type="text"
                  value={formData.headline}
                  onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-sky-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Short Bio (Hero Section)
              </label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-sky-400 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Detailed About Section (Story & Background)
              </label>
              <textarea
                rows={6}
                value={formData.about}
                onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-sky-400 resize-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Availability / Work Status
                </label>
                <input
                  type="text"
                  value={formData.availability_status}
                  onChange={(e) => setFormData({ ...formData, availability_status: e.target.value })}
                  placeholder="Open to Opportunities"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-sky-400"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Full Width Row: Hero Flowing Highlights (Marquee Ticker) Editor */}
        <div className="lg:col-span-12">
          <Card className="p-6 bg-[#0d0f17]/95 border-white/[0.08] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky-400" />
                  <span>Hero Flowing Highlights (Marquee Strip)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  These cards flow from right to left under your View Projects button on the home page and pause on hover.
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddHighlight}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                className="text-xs shrink-0"
              >
                Add Highlight Box
              </Button>
            </div>

            {/* List of flowing boxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {highlights.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-3 relative group hover:border-sky-500/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-sky-400 font-semibold">
                      Box #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteHighlight(item.id)}
                      className="p-1 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Delete Box"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Title (Main Text)
                    </label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => handleUpdateHighlight(item.id, 'title', e.target.value)}
                      placeholder="e.g. M.Tech AI & DS"
                      className="w-full px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-sky-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Subtitle (Detail / Years)
                    </label>
                    <input
                      type="text"
                      value={item.subtitle}
                      onChange={(e) => handleUpdateHighlight(item.id, 'subtitle', e.target.value)}
                      placeholder="e.g. CUSAT 2025–2027"
                      className="w-full px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-sky-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Icon
                    </label>
                    <select
                      value={item.icon}
                      onChange={(e) => handleUpdateHighlight(item.id, 'icon', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#0f111a] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-sky-400 cursor-pointer"
                    >
                      <option value="brain">Brain (AI & Data Science)</option>
                      <option value="code">Code (Full Stack & GenAI)</option>
                      <option value="database">Database (Cloud & Realtime)</option>
                      <option value="sparkles">Sparkles (GATE & Accolades)</option>
                      <option value="graduation">Graduation Cap (Degree)</option>
                      <option value="cpu">CPU (Machine Learning)</option>
                      <option value="trophy">Trophy (Awards & Honors)</option>
                      <option value="rocket">Rocket (Projects & Startups)</option>
                      <option value="users">Users (Leadership & Community)</option>
                      <option value="terminal">Terminal (Scripts & DevOps)</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-white/[0.08] flex justify-end">
              <Button
                type="button"
                onClick={handleSubmit}
                variant="primary"
                size="sm"
                isLoading={isSaving}
                leftIcon={<Save className="w-3.5 h-3.5" />}
              >
                Save All Changes
              </Button>
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
};
