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
    <footer className="border-t border-[#738666]/20 bg-[#f8faf6] relative overflow-hidden text-[#1b281c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[#738666]/15">
          {/* Brand & Tagline */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Link to="/" className="flex items-center gap-2 text-lg font-bold text-[#1b281c] mb-2">
              <div className="w-7 h-7 rounded-lg bg-[#738666] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                B
              </div>
              <span className="font-editorial text-xl">Bilal</span>
            </Link>
            <p className="text-xs text-[#556950] max-w-sm">
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
                  className="p-2.5 rounded-xl bg-white hover:bg-[#f1f4ed] border border-[#738666]/20 text-[#556950] hover:text-[#1b281c] hover:border-[#738666]/50 transition-all duration-200 shadow-xs"
                >
                  {getSocialIcon(link.platform)}
                </a>
              ))}
          </div>

          {/* Back to top */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-xs font-medium text-[#556950] hover:text-[#1b281c] px-3 py-2 rounded-xl bg-white hover:bg-[#f1f4ed] border border-[#738666]/20 transition-colors cursor-pointer shadow-xs"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 text-[#738666]" />
          </button>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#556950]">
          <p className="flex items-center gap-1.5">
            © {currentYear} Bilal. Built with React, Vite, Supabase & Tailwind.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/bilalvpm4321/bilal-portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#1b281c] transition-colors"
            >
              GitHub Repository
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
