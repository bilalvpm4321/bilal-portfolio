import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { useToast } from '../../components/common/Toast';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { ImageUploader } from '../../components/admin/ImageUploader';
import { FileUploader } from '../../components/admin/FileUploader';
import { Save, User, FileText, CheckCircle2 } from 'lucide-react';

export const AdminProfilePage: React.FC = () => {
  const { data, updateProfile } = usePortfolio();
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
    resume_url: '',
    availability_status: '',
    years_experience: '',
    is_visible: true,
  });

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
        resume_url: profile.resume_url || '',
        availability_status: profile.availability_status || '',
        years_experience: profile.years_experience || '',
        is_visible: profile.is_visible ?? true,
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await updateProfile(formData);
      if (res.success) {
        success('Profile updated successfully!', 'Changes are now live across your portfolio.');
      } else {
        error('Failed to update profile', res.error?.message);
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
          <h1 className="text-xl font-bold text-white">Profile Management</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Update your personal bio, contact channels, avatar, and resume document.
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
          Save Profile
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Media & Assets */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6 bg-[#0d0f17]/95 border-white/[0.08]">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-sky-400" />
              <span>Profile Photo</span>
            </h2>

            <ImageUploader
              value={formData.avatar_url}
              onChange={(url) => setFormData((prev) => ({ ...prev, avatar_url: url }))}
              folder="profile"
              label="Avatar Image"
              aspectRatio="portrait"
            />
          </Card>

          <Card className="p-6 bg-[#0d0f17]/95 border-white/[0.08]">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-400" />
              <span>Resume PDF</span>
            </h2>

            <FileUploader
              value={formData.resume_url}
              onChange={(url) => setFormData((prev) => ({ ...prev, resume_url: url }))}
              folder="resume"
              label="Curriculum Vitae (PDF)"
            />
          </Card>

          <Card className="p-6 bg-[#0d0f17]/95 border-white/[0.08]">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
              Portfolio Visibility
            </h2>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_visible}
                onChange={(e) => setFormData((prev) => ({ ...prev, is_visible: e.target.checked }))}
                className="w-4 h-4 rounded text-sky-500 focus:ring-sky-400 bg-white/[0.05] border-white/[0.1]"
              />
              <span className="text-xs text-slate-200 font-medium">
                Make profile publicly visible
              </span>
            </label>
          </Card>
        </div>

        {/* Right Column: Biographical & Details Form */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="p-6 bg-[#0d0f17]/95 border-white/[0.08] space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">
              Personal Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-sky-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Professional Headline <span className="text-sky-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.headline}
                  onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                  placeholder="AI & Data Science | Full Stack Developer"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-sky-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Hero Short Introduction
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
                Detailed About Section
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
      </form>
    </div>
  );
};
