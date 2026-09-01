import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { ArrowUp, Mail, Phone, Sparkles } from 'lucide-react';
import { Github, Linkedin } from '../common/BrandIcons';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const { data } = usePortfolio();
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'github':
        return <Github className="w-4 h-4" />;
      case 'linkedin':
        return <Linkedin className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'phone':
        return <Phone className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <footer className="border-t border-white/[0.08] bg-[#07080c] relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-sky-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/[0.06]">
          {/* Brand & Tagline */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Link to="/" className="flex items-center gap-2 text-lg font-bold text-white mb-2">
              <div className="w-7 h-7 rounded-lg bg-sky-500 flex items-center justify-center text-slate-950 font-bold text-xs">
                BA
              </div>
              <span className="font-display">Bilal Ahamed PT</span>
            </Link>
            <p className="text-xs text-slate-400 max-w-sm">
              M.Tech AI & Data Science @ CUSAT • Full Stack & Generative AI Developer.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            {data.socialLinks
              .filter((l) => l.is_visible)
              .map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.platform}
                  className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.08] text-slate-400 hover:text-sky-400 hover:border-sky-500/30 transition-all duration-200"
                >
                  {getSocialIcon(link.platform)}
                </a>
              ))}
          </div>

          {/* Back to top */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white px-3 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 text-sky-400" />
          </button>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="flex items-center gap-1.5">
            © {currentYear} Bilal Ahamed PT. Built with React, Vite, Supabase & Tailwind.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/bilalvpm4321/bilal-portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-sky-400 transition-colors"
            >
              GitHub Repository
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
