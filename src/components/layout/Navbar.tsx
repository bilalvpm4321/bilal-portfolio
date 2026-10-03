import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  Menu,
  X,
  User,
  FolderGit2,
  Briefcase,
  Code2,
  GraduationCap,
  Award,
  FileCheck,
  Users,
  Mail,
  Download,
  ArrowRight,
  Phone,
  Sparkles,
} from 'lucide-react';
import { Github, Linkedin } from '../common/BrandIcons';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';

const NAV_LINKS = [
  { name: 'About', label: 'About Me', href: '#about', icon: User, subtitle: 'Bio & 3D Dossier' },
  { name: 'Projects', label: 'Featured Projects', href: '#projects', icon: FolderGit2, subtitle: 'AI & Web Apps' },
  { name: 'Experience', label: 'Work Experience', href: '#experience', icon: Briefcase, subtitle: 'Industry Roles' },
  { name: 'Skills', label: 'Technical Skills', href: '#skills', icon: Code2, subtitle: 'Tech Stack & Tools' },
  { name: 'Education', label: 'Education', href: '#education', icon: GraduationCap, subtitle: 'M.Tech & B.Tech' },
  { name: 'Honors', label: 'Achievements', href: '#achievements', icon: Award, subtitle: 'GATE & Awards' },
  { name: 'Certificates', label: 'Certifications', href: '#certificates', icon: FileCheck, subtitle: 'Verified Credentials' },
  { name: 'Leadership', label: 'Leadership', href: '#leadership', icon: Users, subtitle: 'Volunteer & Clubs' },
  { name: 'Contact', label: 'Get in Touch', href: '#contact', icon: Mail, subtitle: 'Direct Message' },
];

export const Navbar: React.FC = () => {
  const { data } = usePortfolio();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('about');
  const location = useLocation();

  const profile = data.profile;
  const resumeUrl = profile?.resume_url || '/resume.pdf';
  const emailAddress = profile?.email || 'bilalvpm2@gmail.com';
  const phoneNumber = profile?.phone || '+91-7306448145';
  const githubUrl =
    data.socialLinks?.find((l) => l.platform.toLowerCase() === 'github' && l.is_visible)?.url ||
    'https://github.com/bilalvpm4321';
  const linkedinUrl =
    data.socialLinks?.find((l) => l.platform.toLowerCase() === 'linkedin' && l.is_visible)?.url ||
    'https://www.linkedin.com/in/bilalvpm4321';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = NAV_LINKS.map((link) => link.href.substring(1));
      const scrollPosition = window.scrollY + 140;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll and handle Escape key when mobile sidebar is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileSidebarOpen(false);
      }
    };

    if (mobileSidebarOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileSidebarOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setMobileSidebarOpen(false);
    if (location.pathname === '/') {
      const targetId = href.replace('#', '');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', href);
      }
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          isScrolled
            ? 'bg-[#f7f8f4]/85 dark:bg-[#08080a]/85 backdrop-blur-md border-b border-[#738666]/15 dark:border-white/[0.08] py-2.5 sm:py-3 shadow-xs shadow-[#738666]/5 dark:shadow-black/50'
            : 'bg-transparent py-3.5 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between relative">
          {/* Left spacer for balance on desktop */}
          <div className="hidden xl:block w-10" />

          {/* Desktop Navigation Links (Strictly Desktop >= 1280px Floating Chrome Capsule) */}
          <nav className="hidden xl:flex items-center gap-1 chrome-glass-pill px-2.5 py-1.5 z-20 relative">
            {NAV_LINKS.map((link) => {
              const sectionId = link.href.substring(1);
              const isCurrentlyActive =
                (activeSection === sectionId || (!activeSection && sectionId === 'about')) &&
                location.pathname === '/';

              return (
                <a
                  key={link.name}
                  href={location.pathname === '/' ? link.href : `/${link.href}`}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="relative px-3.5 py-1.5 text-xs font-medium select-none group flex items-center justify-center rounded-full transition-colors duration-200"
                >
                  {/* Elastic Spring Bouncing Active Capsule */}
                  {isCurrentlyActive && (
                    <motion.div
                      layoutId="active-navbar-pill"
                      className="absolute inset-0 rounded-full bg-[#1b281c] dark:bg-white shadow-[0_4px_14px_rgba(0,0,0,0.28)] dark:shadow-[0_4px_20px_rgba(255,255,255,0.4)]"
                      transition={{
                        type: 'spring',
                        stiffness: 420,
                        damping: 24,
                        mass: 0.7,
                      }}
                    />
                  )}

                  <span
                    className={`relative z-10 transition-colors duration-200 ${
                      isCurrentlyActive
                        ? 'text-white dark:text-black font-extrabold'
                        : 'text-[#3b4e39] dark:text-zinc-400 group-hover:text-[#1b281c] dark:group-hover:text-white'
                    }`}
                  >
                    {link.name}
                  </span>
                </a>
              );
            })}
          </nav>

          {/* Right Action Area (Theme Switcher on Desktop) */}
          <div className="hidden xl:flex items-center justify-end z-20">
            <div className="chrome-glass-pill p-1">
              <ThemeToggle size="sm" />
            </div>
          </div>

          {/* Mobile & Tablet Header Bar: Brand + Theme Toggle + Professional Sidebar Menu Button */}
          <div className="flex items-center justify-between w-full xl:hidden">
            <Link
              to="/"
              className="flex items-center gap-2.5 group focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-[#738666] dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-sm shadow-sm transition-transform duration-200 group-hover:scale-105">
                B
              </div>
              <div className="flex flex-col">
                <span className="font-editorial text-lg font-bold tracking-tight text-[#1b281c] dark:text-white leading-tight">
                  Bilal Ahamed
                </span>
                <span className="text-[10px] tracking-wider uppercase text-[#556950] dark:text-zinc-400 font-semibold">
                  Portfolio
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              <div className="bg-white/80 dark:bg-[#121216]/80 backdrop-blur-md rounded-xl p-1 border border-[#738666]/15 dark:border-white/[0.08] shadow-2xs">
                <ThemeToggle size="sm" />
              </div>

              {/* Sleek Hamburger Sidebar Trigger Button */}
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-[#1b281c] dark:text-white bg-white/90 dark:bg-[#121216]/90 border border-[#738666]/25 dark:border-white/[0.12] shadow-xs hover:bg-[#738666]/10 dark:hover:bg-white/[0.08] transition-all cursor-pointer select-none"
                aria-label="Open sidebar menu"
              >
                <Menu className="w-4 h-4 text-[#738666] dark:text-zinc-200" />
                <span className="text-xs font-bold tracking-wider uppercase font-sans text-[#1b281c] dark:text-white">
                  Menu
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Out Glassmorphic Sidebar Drawer */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-[200] xl:hidden flex justify-end">
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/65 backdrop-blur-md"
            />

            {/* Sidebar Content Panel */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 320 }}
              className="relative w-[85%] max-w-[360px] h-full bg-[#f8faf6] dark:bg-[#0c0c10] border-l border-[#738666]/25 dark:border-white/[0.1] shadow-2xl flex flex-col justify-between p-5 sm:p-6 z-10 overflow-y-auto"
            >
              <div>
                {/* Sidebar Header with Profile Info */}
                <div className="flex items-center justify-between pb-4 border-b border-[#738666]/15 dark:border-white/[0.08] mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#738666] to-[#4e5e45] dark:from-white dark:to-zinc-300 text-white dark:text-black flex items-center justify-center font-bold text-base shadow-md">
                      B
                    </div>
                    <div className="flex flex-col">
                      <span className="font-editorial text-lg font-bold text-[#1b281c] dark:text-white leading-snug">
                        Bilal Ahamed
                      </span>
                      <span className="text-[10px] uppercase tracking-widest text-[#556950] dark:text-zinc-400 font-semibold">
                        AI & Full Stack Engineer
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setMobileSidebarOpen(false)}
                    className="p-2 rounded-xl text-[#3b4e39] dark:text-zinc-300 bg-white dark:bg-[#18181e] border border-[#738666]/20 dark:border-white/[0.1] hover:bg-[#738666]/15 dark:hover:bg-white/[0.1] transition-colors cursor-pointer"
                    aria-label="Close navigation sidebar"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Live Availability Badge */}
                <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#738666]/10 dark:bg-white/[0.06] border border-[#738666]/20 dark:border-white/[0.08] text-[11px] font-semibold text-[#2d4429] dark:text-zinc-300 w-full justify-between">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span>Available for Roles & Projects</span>
                  </div>
                  <Sparkles className="w-3.5 h-3.5 text-[#738666] dark:text-zinc-400" />
                </div>

                {/* Navigation Link Items */}
                <nav className="flex flex-col gap-1.5">
                  {NAV_LINKS.map((link) => {
                    const sectionId = link.href.substring(1);
                    const isCurrentlyActive =
                      (activeSection === sectionId || (!activeSection && sectionId === 'about')) &&
                      location.pathname === '/';
                    const IconComponent = link.icon;

                    return (
                      <a
                        key={link.name}
                        href={location.pathname === '/' ? link.href : `/${link.href}`}
                        onClick={(e) => handleNavClick(e, link.href)}
                        className={`group flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all duration-200 ${
                          isCurrentlyActive
                            ? 'bg-[#738666] dark:bg-white text-white dark:text-black shadow-md shadow-[#738666]/20 dark:shadow-white/10'
                            : 'text-[#2a3c28] dark:text-zinc-300 hover:text-[#1b281c] dark:hover:text-white hover:bg-[#738666]/10 dark:hover:bg-white/[0.06]'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`p-1.5 rounded-xl transition-colors ${
                              isCurrentlyActive
                                ? 'bg-white/20 dark:bg-black/10 text-white dark:text-black'
                                : 'bg-[#738666]/10 dark:bg-white/[0.06] text-[#738666] dark:text-zinc-400 group-hover:bg-[#738666]/20 dark:group-hover:bg-white/10 group-hover:text-[#1b281c] dark:group-hover:text-white'
                            }`}
                          >
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs sm:text-sm font-bold truncate">
                              {link.label}
                            </span>
                            <span
                              className={`text-[10px] truncate ${
                                isCurrentlyActive
                                  ? 'text-white/80 dark:text-black/70'
                                  : 'text-[#647960] dark:text-zinc-500'
                              }`}
                            >
                              {link.subtitle}
                            </span>
                          </div>
                        </div>

                        {isCurrentlyActive ? (
                          <span className="w-2 h-2 rounded-full bg-white dark:bg-black shrink-0" />
                        ) : (
                          <ArrowRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-80 group-hover:translate-x-0.5 transition-all shrink-0" />
                        )}
                      </a>
                    );
                  })}
                </nav>
              </div>

              {/* Sidebar Footer: Quick Action Buttons & Socials */}
              <div className="pt-4 border-t border-[#738666]/15 dark:border-white/[0.08] mt-4 space-y-3">
                {/* Resume Download CTA */}
                <a
                  href={resumeUrl}
                  download="Bilal_Ahamed_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1b281c] dark:bg-white text-white dark:text-black text-xs font-bold shadow-md hover:opacity-90 transition-opacity"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Resume (PDF)</span>
                </a>

                {/* Social Quick Links */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5">
                    {githubUrl && (
                      <a
                        href={githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-white dark:bg-[#18181e] border border-[#738666]/20 dark:border-white/[0.1] text-[#1b281c] dark:text-white hover:bg-[#738666]/10 dark:hover:bg-white/[0.08] transition-colors"
                        aria-label="GitHub"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {linkedinUrl && (
                      <a
                        href={linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-white dark:bg-[#18181e] border border-[#738666]/20 dark:border-white/[0.1] text-[#1b281c] dark:text-white hover:bg-[#738666]/10 dark:hover:bg-white/[0.08] transition-colors"
                        aria-label="LinkedIn"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                    {emailAddress && (
                      <a
                        href={`mailto:${emailAddress}`}
                        className="p-2 rounded-xl bg-white dark:bg-[#18181e] border border-[#738666]/20 dark:border-white/[0.1] text-[#1b281c] dark:text-white hover:bg-[#738666]/10 dark:hover:bg-white/[0.08] transition-colors"
                        aria-label="Email"
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    )}
                    {phoneNumber && (
                      <a
                        href={`tel:${phoneNumber.replace(/[^0-9+]/g, '')}`}
                        className="p-2 rounded-xl bg-white dark:bg-[#18181e] border border-[#738666]/20 dark:border-white/[0.1] text-[#1b281c] dark:text-white hover:bg-[#738666]/10 dark:hover:bg-white/[0.08] transition-colors"
                        aria-label="Phone"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  <span className="text-[10px] text-[#647960] dark:text-zinc-500 font-medium">
                    © {new Date().getFullYear()} Bilal
                  </span>
                </div>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

