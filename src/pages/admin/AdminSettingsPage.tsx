import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { useToast } from '../../components/common/Toast';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Save, Settings, Globe, Shield, Sparkles } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { data, updateSiteSetting } = usePortfolio();
  const { success, error } = useToast();

  const [settings, setSettings] = useState({
    siteTitle: 'Bilal Ahamed PT | AI & Full Stack Developer',
    metaDescription: 'Official portfolio of Bilal Ahamed PT. M.Tech AI & Data Science student at CUSAT, Full Stack Developer, Generative AI & ML specialist.',
    accentColor: '#38bdf8',
    enableContactForm: true,
    enableRealtime: true,
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (data.siteSettings?.general) {
      setSettings((prev) => ({
        ...prev,
        ...data.siteSettings.general,
      }));
    }
  }, [data.siteSettings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await updateSiteSetting('general', settings);
      if (res.success) {
        success('Site settings saved successfully');
      } else {
        error('Failed to update site settings');
      }
    } catch (err: any) {
      error('Error saving settings', err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Site Settings & SEO</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure metadata, search engine indexing, and feature controls.
          </p>
        </div>

        <Button
          type="button"
          onClick={handleSave}
          variant="primary"
          size="md"
          isLoading={isSaving}
          leftIcon={<Save className="w-4 h-4" />}
        >
          Save Settings
        </Button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* SEO & Meta Tags */}
        <Card className="p-6 bg-[#0d0f17]/95 border-white/[0.08] space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
            <Globe className="w-4 h-4 text-sky-400" />
            <span>Search Engine Optimization (SEO)</span>
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Default Browser Title Tag
            </label>
            <input
              type="text"
              value={settings.siteTitle}
              onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-sky-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Meta Description (Search Snippet)
            </label>
            <textarea
              rows={3}
              value={settings.metaDescription}
              onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-sky-400 resize-none"
            />
          </div>
        </Card>

        {/* Feature Switches */}
        <Card className="p-6 bg-[#0d0f17]/95 border-white/[0.08] space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>Feature Controls & Realtime</span>
          </h2>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableRealtime}
                onChange={(e) => setSettings({ ...settings, enableRealtime: e.target.checked })}
                className="w-4 h-4 rounded text-sky-500 bg-white/[0.04] border-white/[0.1]"
              />
              <div>
                <span className="text-xs text-white font-semibold block">Supabase Realtime Sync</span>
                <span className="text-[11px] text-slate-400 block">
                  Broadcast live changes from admin dashboard to public portfolio
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableContactForm}
                onChange={(e) => setSettings({ ...settings, enableContactForm: e.target.checked })}
                className="w-4 h-4 rounded text-sky-500 bg-white/[0.04] border-white/[0.1]"
              />
              <div>
                <span className="text-xs text-white font-semibold block">Enable Contact Inquiries Form</span>
                <span className="text-[11px] text-slate-400 block">
                  Allow visitors to submit direct messages stored in database
                </span>
              </div>
            </label>
          </div>
        </Card>
      </form>
    </div>
  );
};
