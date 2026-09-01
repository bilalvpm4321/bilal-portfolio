import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { usePortfolio } from '../../context/PortfolioContext';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '../common/Button';
import { Menu, X, FileDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Experience', href: '#experience' },
  { name: 'Education', href: '#education' },
  { name: 'Achievements', href: '#achievements' },
  { name: 'Leadership', href: '#leadership' },
  { name: 'Contact', href: '#contact' },
];

export const Navbar: React.FC = () => {
  const { data } = usePortfolio();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('about');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      // Scrollspy active section
      const sections = NAV_LINKS.map((link) => link.href.substring(1));
      const scrollPosition = window.scrollY + 150;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section) {
          const top = section.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const resumeUrl = data.profile?.resume_url || '/resume.pdf';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#08090d]/85 backdrop-blur-md border-b border-white/[0.08] py-3 shadow-xl shadow-black/20'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          to="/"
          className="group flex items-center gap-2.5 text-lg font-extrabold tracking-tight text-white focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-sky-500/25 group-hover:scale-105 transition-transform">
            BA
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-white group-hover:text-sky-400 transition-colors">
              Bilal Ahamed PT
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-sky-400/90 -mt-1 font-semibold">
              AI & Full Stack
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-white/[0.03] border border-white/[0.08] px-3 py-1.5 rounded-full backdrop-blur-md">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.href.substring(1) && location.pathname === '/';
            return (
              <a
                key={link.name}
                href={location.pathname === '/' ? link.href : `/${link.href}`}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
                  isActive
                    ? 'bg-sky-500/15 text-sky-400 font-semibold shadow-inner'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </a>
            );
          })}
        </nav>

        {/* Actions (Resume & Theme) */}
        <div className="hidden sm:flex items-center gap-2.5">
          <ThemeToggle />

          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
            >
              <Button
                variant="outline"
                size="sm"
                leftIcon={<FileDown className="w-3.5 h-3.5 text-sky-400" />}
                className="text-xs"
              >
                Resume
              </Button>
            </a>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 sm:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-300 hover:text-white bg-white/5 border border-white/10"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="sm:hidden border-b border-white/[0.08] bg-[#090a10]/95 backdrop-blur-xl px-4 pt-3 pb-6"
          >
            <div className="flex flex-col gap-1 mb-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={location.pathname === '/' ? link.href : `/${link.href}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg font-medium transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="flex flex-col gap-2 pt-3 border-t border-white/[0.08]">
              {resumeUrl && (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button variant="outline" size="sm" className="w-full justify-center" leftIcon={<FileDown className="w-4 h-4 text-sky-400" />}>
                    Download Resume
                  </Button>
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
