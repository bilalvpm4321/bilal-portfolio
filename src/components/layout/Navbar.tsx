import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';
import { ThemeToggle } from './ThemeToggle';
import {
  X,
  ArrowRight,
  Sparkles,
  Mail,
  Download,
} from 'lucide-react';
import { Github, Linkedin } from '../common/BrandIcons';

interface NavItem {
  name: string;
  href: string;
  offsetClass: string;
}

const FULLSCREEN_NAV_LINKS: NavItem[] = [
  { name: 'Home', href: '#hero', offsetClass: 'ml-0' },
  { name: 'About', href: '#about', offsetClass: 'ml-6 sm:ml-12 md:ml-16' },
  { name: 'Projects', href: '#projects', offsetClass: 'ml-0' },
  { name: 'Experience', href: '#experience', offsetClass: 'ml-6 sm:ml-12 md:ml-16' },
  { name: 'Skills', href: '#skills', offsetClass: 'ml-0' },
  { name: 'Education', href: '#education', offsetClass: 'ml-6 sm:ml-12 md:ml-16' },
  { name: 'Certifications', href: '#certificates', offsetClass: 'ml-0' },
  { name: 'Leadership', href: '#leadership', offsetClass: 'ml-6 sm:ml-12 md:ml-16' },
  { name: 'Contact', href: '#contact', offsetClass: 'ml-8 sm:ml-16 md:ml-20' },
];

export const Navbar: React.FC = () => {
  const { data } = usePortfolio();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isCursorHovering, setIsCursorHovering] = useState(false);
  const [scrollYOffset, setScrollYOffset] = useState(0);

  const springY = useSpring(0, {
    stiffness: 180,
    damping: 24,
    mass: 0.4,
  });

  useEffect(() => {
    springY.set(scrollYOffset);
  }, [scrollYOffset, springY]);

  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const profile = data.profile;
  const resumeUrl = profile?.resume_url || '/resume.pdf';
  const emailAddress = profile?.email || 'bilalvpm2@gmail.com';
  const githubUrl =
    data.socialLinks?.find((l) => l.platform.toLowerCase() === 'github' && l.is_visible)?.url ||
    'https://github.com/bilalvpm4321';
  const linkedinUrl =
    data.socialLinks?.find((l) => l.platform.toLowerCase() === 'linkedin' && l.is_visible)?.url ||
    'https://www.linkedin.com/in/bilalvpm4321';

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll and handle Escape key when fullscreen overlay is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setScrollYOffset(0);
      setHoveredIndex(null);
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Handle hover on specific item to automatically scroll contents smoothly
  const handleItemHover = (index: number) => {
    setHoveredIndex(index);
    setIsCursorHovering(true);

    if (containerRef.current && listRef.current) {
      const containerH = containerRef.current.clientHeight;
      const listH = listRef.current.scrollHeight;
      const maxScroll = Math.max(0, listH - containerH + 30);

      if (maxScroll > 0) {
        const ratio = index / (FULLSCREEN_NAV_LINKS.length - 1);
        setScrollYOffset(-ratio * maxScroll);
      }
    }
  };

  // Continuous smooth auto-scroll tracking mouse vertical position
  const handleContainerMouseMove = (e: React.MouseEvent) => {
    setCursorPos({ x: e.clientX, y: e.clientY });

    if (containerRef.current && listRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const relativeY = e.clientY - rect.top;
      const containerH = rect.height;
      const listH = listRef.current.scrollHeight;
      const maxScroll = Math.max(0, listH - containerH + 40);

      if (maxScroll > 0) {
        const ratio = Math.max(0, Math.min(1, (relativeY - 40) / (containerH - 80)));
        setScrollYOffset(-ratio * maxScroll);
      }
    }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setIsOpen(false);
    setIsCursorHovering(false);

    if (location.pathname === '/') {
      if (href === '#hero') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        window.history.pushState(null, '', '/');
        return;
      }

      const targetId = href.replace('#', '');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', href);
      }
    }
  };

  // Fullscreen Backdrop Clip-Path Animation Variants (Halal Studio / Awwwards Style)
  const menuOverlayVariants: any = {
    initial: {
      clipPath: 'circle(0% at calc(100% - 40px) 40px)',
      opacity: 0,
    },
    animate: {
      clipPath: 'circle(150% at calc(100% - 40px) 40px)',
      opacity: 1,
      transition: {
        duration: 0.75,
        ease: [0.76, 0, 0.24, 1],
      },
    },
    exit: {
      clipPath: 'circle(0% at calc(100% - 40px) 40px)',
      opacity: 0,
      transition: {
        duration: 0.55,
        ease: [0.76, 0, 0.24, 1],
      },
    },
  };

  const linkContainerVariants: any = {
    animate: {
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.15,
      },
    },
    exit: {
      transition: {
        staggerChildren: 0.025,
        staggerDirection: -1,
      },
    },
  };

  const linkItemVariants: any = {
    initial: {
      y: '100%',
      opacity: 0,
      rotateX: 25,
    },
    animate: {
      y: 0,
      opacity: 1,
      rotateX: 0,
      transition: {
        duration: 0.6,
        ease: [0.76, 0, 0.24, 1],
      },
    },
    exit: {
      y: '100%',
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: [0.76, 0, 0.24, 1],
      },
    },
  };

  return (
    <>
      {/* Default Top Fixed Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          isScrolled
            ? 'bg-[#f7f8f4]/85 dark:bg-[#08080a]/85 backdrop-blur-md border-b border-[#738666]/15 dark:border-white/[0.08] py-3 sm:py-4 shadow-xs shadow-[#738666]/5 dark:shadow-black/50'
            : 'bg-transparent py-4 sm:py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo (Halal Studio Style) */}
          <Link
            to="/"
            className="flex items-center gap-3 group select-none focus:outline-none"
          >
            {/* Round Minimalist Logo Badge */}
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#738666] text-white flex items-center justify-center font-black text-sm sm:text-base tracking-tighter shadow-md transition-transform duration-300 group-hover:scale-105">
              B.
            </div>

            {/* Typography */}
            <div className="flex items-center gap-1.5">
              <span className="font-display font-extrabold text-base sm:text-lg tracking-wider uppercase text-[#1b281c] dark:text-white transition-colors">
                BILAL AHAMED
              </span>
            </div>
          </Link>

          {/* Right Area: Theme Toggle + Sleek 3-Line Hamburger Menu Icon */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Theme Toggle Button */}
            <div className="p-1 rounded-full bg-white/70 dark:bg-[#141418]/70 backdrop-blur-md border border-[#738666]/20 dark:border-white/10 shadow-2xs">
              <ThemeToggle size="sm" />
            </div>

            {/* Minimalist 3-Line Hamburger Trigger Button */}
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="flex flex-col items-end justify-center gap-1.5 w-11 h-11 p-2.5 rounded-full bg-transparent hover:bg-[#738666]/10 dark:hover:bg-white/[0.08] text-[#1b281c] dark:text-white transition-all cursor-pointer group select-none"
              aria-label="Open fullscreen navigation menu"
            >
              <span className="w-6 h-0.5 bg-current rounded-full transition-all duration-300 group-hover:w-7" />
              <span className="w-6 h-0.5 bg-current rounded-full transition-all duration-300 group-hover:w-4.5" />
              <span className="w-6 h-0.5 bg-current rounded-full transition-all duration-300 group-hover:w-7" />
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen Overlay Navigation (Halal Studio / Awwwards Fullscreen Experience) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuOverlayVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 z-[200] bg-[#0d1117] dark:bg-[#08080a] text-white flex flex-col justify-between p-4 sm:p-8 lg:p-10 overflow-hidden select-none"
          >
            {/* Top Bar inside Fullscreen Overlay - Distinct Clean Pinned Header */}
            <div className="w-full max-w-7xl mx-auto flex items-center justify-between pb-3 sm:pb-4 border-b border-white/10 relative z-30 shrink-0">
              {/* Brand Logo inside overlay */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#738666] text-white flex items-center justify-center font-black text-sm sm:text-base tracking-tighter shadow-md">
                  B.
                </div>
                <span className="font-display font-extrabold text-base sm:text-lg tracking-wider uppercase text-white">
                  BILAL AHAMED
                </span>
              </div>

              {/* Top-Right: Outlined Circle Close Button (✕) */}
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15">
                  <ThemeToggle size="sm" />
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full border border-white/30 hover:border-white text-white flex items-center justify-center transition-all duration-300 hover:scale-105 hover:rotate-90 cursor-pointer group"
                  aria-label="Close navigation menu"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5] group-hover:stroke-2 transition-all" />
                </button>
              </div>
            </div>

            {/* Center Area: Auto-Scrolling Staggered Editorial Menu Links */}
            <div
              ref={containerRef}
              onMouseMove={handleContainerMouseMove}
              className="flex-1 w-full max-w-7xl mx-auto overflow-hidden relative z-10 flex flex-col justify-start pt-6 sm:pt-8 pb-4"
            >
              <motion.nav
                ref={listRef}
                variants={linkContainerVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ y: springY }}
                className="flex flex-col space-y-1 sm:space-y-2 py-2"
              >
                {FULLSCREEN_NAV_LINKS.map((link, index) => {
                  const isHovered = hoveredIndex === index;
                  const isAnyHovered = hoveredIndex !== null;

                  return (
                    <div
                      key={link.name}
                      className={`overflow-hidden ${link.offsetClass}`}
                    >
                      <motion.div variants={linkItemVariants}>
                        <a
                          href={location.pathname === '/' ? link.href : `/${link.href}`}
                          onClick={(e) => handleNavClick(e, link.href)}
                          onMouseEnter={() => handleItemHover(index)}
                          onMouseLeave={() => {
                            setHoveredIndex(null);
                            setIsCursorHovering(false);
                          }}
                          className={`inline-block font-sans font-light text-3xl sm:text-5xl md:text-6xl lg:text-[68px] xl:text-[76px] leading-[1.12] tracking-tight transition-all duration-300 cursor-pointer ${
                            isHovered
                              ? 'opacity-100 text-white font-normal translate-x-1 sm:translate-x-3'
                              : isAnyHovered
                              ? 'opacity-25 text-white/40'
                              : 'opacity-90 text-white hover:opacity-100'
                          }`}
                        >
                          {link.name}
                        </a>
                      </motion.div>
                    </div>
                  );
                })}
              </motion.nav>
            </div>

            {/* Bottom Footer Row inside Fullscreen Overlay */}
            <div className="w-full max-w-7xl mx-auto pt-3 sm:pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-zinc-400 relative z-20 shrink-0">
              {/* Availability Status */}
              <div className="flex items-center gap-2 font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>Available for GenAI & Full-Stack Roles</span>
              </div>

              {/* Social & Contact Channels */}
              <div className="flex items-center gap-4 sm:gap-6">
                {githubUrl && (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <Github className="w-4 h-4" />
                    <span>GitHub</span>
                  </a>
                )}
                {linkedinUrl && (
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span>LinkedIn</span>
                  </a>
                )}
                {emailAddress && (
                  <a
                    href={`mailto:${emailAddress}`}
                    className="hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Email</span>
                  </a>
                )}
                {resumeUrl && (
                  <a
                    href={resumeUrl}
                    download="Bilal_Ahamed_Resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#738666] dark:hover:text-white transition-colors font-bold flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Resume</span>
                  </a>
                )}
              </div>
            </div>

            {/* Custom Follower Cursor Badge with Arrow (Halal Studio Style) */}
            <AnimatePresence>
              {isCursorHovering && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    x: cursorPos.x - 26,
                    y: cursorPos.y - 26,
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 550,
                    damping: 32,
                    mass: 0.4,
                  }}
                  className="fixed top-0 left-0 w-13 h-13 rounded-full bg-[#738666]/90 backdrop-blur-md text-white border border-white/20 flex items-center justify-center pointer-events-none shadow-2xl z-[300] hidden md:flex"
                >
                  <ArrowRight className="w-5 h-5 stroke-[2]" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
