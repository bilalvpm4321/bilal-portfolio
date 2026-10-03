import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { usePortfolio } from '../../context/PortfolioContext';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';

const NAV_LINKS = [
  { name: 'About', href: '#about' },
  { name: 'Projects', href: '#projects' },
  { name: 'Experience', href: '#experience' },
  { name: 'Skills', href: '#skills' },
  { name: 'Education', href: '#education' },
  { name: 'Honors', href: '#achievements' },
  { name: 'Certificates', href: '#certificates' },
  { name: 'Leadership', href: '#leadership' },
  { name: 'Contact', href: '#contact' },
];

export const Navbar: React.FC = () => {
  const { data } = usePortfolio();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = NAV_LINKS.map((link) => link.href.substring(1));
      const scrollPosition = window.scrollY + 100;

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

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        isScrolled
          ? 'bg-white/85 dark:bg-[#08080a]/85 backdrop-blur-md border-b border-[#738666]/15 dark:border-white/[0.08] py-3 shadow-sm shadow-[#738666]/5 dark:shadow-black/50'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between relative">
        {/* Left spacer for balance on desktop */}
        <div className="hidden lg:block w-10" />

        {/* Desktop Navigation Links (Floating Chrome Glassmorphism Capsule with Spring Bounce Transition) */}
        <nav className="hidden lg:flex items-center gap-1 chrome-glass-pill px-2.5 py-1.5 z-20 relative">
          {NAV_LINKS.map((link) => {
            const sectionId = link.href.substring(1);
            const isCurrentlyActive =
              (activeSection === sectionId || (!activeSection && sectionId === 'about')) &&
              location.pathname === '/';

            return (
              <a
                key={link.name}
                href={location.pathname === '/' ? link.href : `/${link.href}`}
                className="relative px-3.5 py-1.5 text-xs sm:text-sm rounded-full transition-colors duration-200 font-medium select-none group flex items-center justify-center"
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
        <div className="hidden lg:flex items-center justify-end z-20">
          <div className="chrome-glass-pill p-1">
            <ThemeToggle size="sm" />
          </div>
        </div>

        {/* Mobile Header Bar: Theme Toggle + Menu Hamburger */}
        <div className="flex items-center justify-between w-full lg:hidden">
          <a
            href="/"
            className="font-editorial text-xl font-bold tracking-tight text-[#1b281c] dark:text-white"
          >
            Bilal Ahamed
          </a>
          <div className="flex items-center gap-2">
            <ThemeToggle size="sm" />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#1b281c] dark:text-white bg-[#738666]/10 dark:bg-white/[0.08] border border-[#738666]/20 dark:border-white/[0.12] cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-b border-[#738666]/20 dark:border-white/[0.1] bg-white/98 dark:bg-[#0c0c0f]/98 backdrop-blur-xl px-4 pt-3 pb-6 shadow-xl"
          >
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={location.pathname === '/' ? link.href : `/${link.href}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3.5 py-2.5 text-sm text-[#3b4e39] dark:text-zinc-300 hover:text-[#1b281c] dark:hover:text-white hover:bg-[#738666]/10 dark:hover:bg-white/[0.08] rounded-xl font-medium transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
