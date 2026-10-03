import React from 'react';
import { Link } from 'react-router-dom';
import { usePortfolio } from '../../context/PortfolioContext';
import { Mail, Phone, ArrowUpRight, Sparkles, ShieldCheck, MapPin } from 'lucide-react';
import { Github, Linkedin } from '../common/BrandIcons';
import { ThemeToggle } from './ThemeToggle';

export const Footer: React.FC = () => {
  const { data } = usePortfolio();
  const currentYear = new Date().getFullYear();

  // Social & contact link resolvers with graceful fallbacks
  const githubLink =
    data.socialLinks?.find((l) => l.platform.toLowerCase() === 'github' && l.is_visible)?.url ||
    'https://github.com/bilalvpm4321';

  const linkedinLink =
    data.socialLinks?.find((l) => l.platform.toLowerCase() === 'linkedin' && l.is_visible)?.url ||
    'https://www.linkedin.com/in/bilalvpm4321';

  const emailAddress = data.profile?.email || 'bilalvpm2@gmail.com';
  const emailLink = `mailto:${emailAddress}`;

  const phoneNumber = data.profile?.phone || '+91-7306448145';
  const cleanPhone = phoneNumber.replace(/[^0-9+]/g, '');
  const phoneLink = `tel:${cleanPhone}`;

  // Any additional custom social links defined by user in admin panel
  const additionalLinks = (data.socialLinks || []).filter(
    (l) =>
      l.is_visible &&
      !['github', 'linkedin', 'email', 'phone'].includes(l.platform.toLowerCase())
  );

  return (
    <footer className="border-t border-[#738666]/20 dark:border-white/[0.08] bg-[#f8faf6] dark:bg-[#08080a] relative overflow-hidden text-[#1b281c] dark:text-white transition-colors duration-300">
      {/* Ambient background glow for visual depth */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[#738666]/8 dark:from-white/[0.03] to-transparent"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10 pb-12 border-b border-[#738666]/15 dark:border-white/[0.08]">
          {/* Left: Brand & Profile Info */}
          <div className="flex flex-col max-w-lg">
            {/* Brand Logo & Name */}
            <Link
              to="/"
              className="group inline-flex items-center gap-3 mb-4 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#738666] rounded-xl w-fit"
            >
              <div className="w-10 h-10 rounded-xl bg-[#738666] dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-base shadow-sm group-hover:scale-105 transition-all duration-200">
                B
              </div>
              <div className="flex flex-col">
                <span className="font-editorial text-2xl font-bold tracking-tight text-[#1b281c] dark:text-white group-hover:text-[#738666] dark:group-hover:text-zinc-300 transition-colors">
                  Bilal Ahamed
                </span>
                <span className="text-[11px] uppercase tracking-widest text-[#556950] dark:text-zinc-400 font-semibold">
                  AI & Full-Stack Developer
                </span>
              </div>
            </Link>

            {/* Tagline / Bio */}
            <p className="text-sm text-[#465943] dark:text-zinc-400 leading-relaxed mb-5 font-normal">
              {data.profile?.headline ||
                'M.Tech AI & Data Science @ CUSAT • Crafting intelligent systems, LLM solutions & scalable full-stack applications.'}
            </p>

            {/* Status Pill Badge & Location */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-[#121215] border border-[#738666]/25 dark:border-white/[0.1] shadow-2xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-semibold text-[#2d3e2b] dark:text-zinc-300">
                  {data.profile?.availability_status || 'Open to Opportunities & Collaborations'}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-[#556950] dark:text-zinc-400">
                <MapPin className="w-3.5 h-3.5 text-[#738666] dark:text-zinc-400" />
                <span>{data.profile?.location || 'Kerala, India'} • CUSAT</span>
              </div>
            </div>
          </div>

          {/* Right: Connect & Social Icons ALIGNED TO THE RIGHT */}
          <div className="flex flex-col items-start md:items-end text-left md:text-right w-full md:w-auto">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#738666] dark:text-zinc-300 mb-2">
              Connect & Collaborate
            </h3>
            <p className="text-sm text-[#465943] dark:text-zinc-400 mb-5 max-w-sm">
              Have a project idea, research proposal, or career opportunity? Let’s connect.
            </p>

            {/* Primary Action Icons on the Right: LinkedIn, GitHub, Email, Phone */}
            <div className="flex items-center gap-3 justify-start md:justify-end flex-wrap mb-4">
              {/* LinkedIn */}
              <a
                href={linkedinLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                title="Connect on LinkedIn"
                className="w-11 h-11 rounded-xl bg-white dark:bg-[#141418] hover:bg-[#738666] dark:hover:bg-white border border-[#738666]/25 dark:border-white/[0.1] text-[#465943] dark:text-zinc-300 hover:text-white dark:hover:text-black shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center group"
              >
                <Linkedin className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
              </a>

              {/* GitHub */}
              <a
                href={githubLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                title="View GitHub Repositories"
                className="w-11 h-11 rounded-xl bg-white dark:bg-[#141418] hover:bg-[#738666] dark:hover:bg-white border border-[#738666]/25 dark:border-white/[0.1] text-[#465943] dark:text-zinc-300 hover:text-white dark:hover:text-black shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center group"
              >
                <Github className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
              </a>

              {/* Email */}
              <a
                href={emailLink}
                aria-label={`Email ${emailAddress}`}
                title={`Send email to ${emailAddress}`}
                className="w-11 h-11 rounded-xl bg-white dark:bg-[#141418] hover:bg-[#738666] dark:hover:bg-white border border-[#738666]/25 dark:border-white/[0.1] text-[#465943] dark:text-zinc-300 hover:text-white dark:hover:text-black shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center group"
              >
                <Mail className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
              </a>

              {/* Phone */}
              <a
                href={phoneLink}
                aria-label={`Call or WhatsApp ${phoneNumber}`}
                title={`Call or WhatsApp ${phoneNumber}`}
                className="w-11 h-11 rounded-xl bg-white dark:bg-[#141418] hover:bg-[#738666] dark:hover:bg-white border border-[#738666]/25 dark:border-white/[0.1] text-[#465943] dark:text-zinc-300 hover:text-white dark:hover:text-black shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center group"
              >
                <Phone className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
              </a>

              {/* Additional social links if configured */}
              {additionalLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label || link.platform}
                  title={link.label || link.platform}
                  className="w-11 h-11 rounded-xl bg-white dark:bg-[#141418] hover:bg-[#738666] dark:hover:bg-white border border-[#738666]/25 dark:border-white/[0.1] text-[#465943] dark:text-zinc-300 hover:text-white dark:hover:text-black shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center group"
                >
                  <Sparkles className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                </a>
              ))}
            </div>

            {/* Direct email & phone pills on the right */}
            <div className="flex flex-col items-start md:items-end gap-1.5 mt-1">
              <a
                href={emailLink}
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#32452f] dark:text-zinc-300 hover:text-[#738666] dark:hover:text-white transition-colors py-1 px-2.5 rounded-lg bg-[#738666]/8 dark:bg-white/[0.06] hover:bg-[#738666]/15 dark:hover:bg-white/[0.12] border border-[#738666]/15 dark:border-white/[0.1]"
              >
                <Mail className="w-3.5 h-3.5 text-[#738666] dark:text-zinc-400" />
                <span>{emailAddress}</span>
              </a>
              <a
                href={phoneLink}
                className="inline-flex items-center gap-2 text-xs font-medium text-[#556950] dark:text-zinc-400 hover:text-[#1b281c] dark:hover:text-white transition-colors px-1"
              >
                <Phone className="w-3 h-3 text-[#738666] dark:text-zinc-400" />
                <span>{phoneNumber}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Sub-Footer / Copyright & Meta Info */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#556950] dark:text-zinc-500">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
            <span>© {currentYear} Bilal Ahamed. All rights reserved.</span>
            <span className="hidden sm:inline text-[#738666]/40 dark:text-zinc-700">•</span>
            <span className="text-[#64795f] dark:text-zinc-500">Built with React, TypeScript & Tailwind CSS</span>
          </div>

          <div className="flex items-center gap-5">
            <ThemeToggle size="sm" />

            <a
              href="https://github.com/bilalvpm4321/bilal-portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-[#1b281c] dark:hover:text-white transition-colors font-medium"
            >
              <span>Source Code</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#738666] dark:text-zinc-400" />
            </a>

            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 hover:text-[#1b281c] dark:hover:text-white transition-colors text-[#64795f] dark:text-zinc-500"
              title="Admin Management Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#738666] dark:text-zinc-400" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
