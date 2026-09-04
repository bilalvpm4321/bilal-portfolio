import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { usePortfolio } from '../../context/PortfolioContext';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


const NAV_LINKS = [
  { name: 'About', href: '#about' },
  { name: 'Projects', href: '#projects' },
  { name: 'Experience', href: '#experience' },
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

  const resumeUrl = data.profile?.resume_url || '/resume.pdf';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md border-b border-[#738666]/15 py-3 shadow-sm shadow-[#738666]/5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center relative">
        {/* Desktop Navigation Links (Centered) */}
        <nav className="hidden lg:flex items-center gap-1 bg-white/80 border border-[#738666]/20 px-3 py-1.5 rounded-full backdrop-blur-md shadow-xs">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.href.substring(1) && location.pathname === '/';
            return (
              <a
                key={link.name}
                href={location.pathname === '/' ? link.href : `/${link.href}`}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
                  isActive
                    ? 'bg-[#738666] text-white font-semibold shadow-xs'
                    : 'text-[#3b4e39] hover:text-[#1b281c] hover:bg-[#738666]/10'
                }`}
              >
                {link.name}
              </a>
            );
          })}
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center justify-end w-full sm:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-[#1b281c] bg-[#738666]/10 border border-[#738666]/20"
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
            className="sm:hidden border-b border-[#738666]/20 bg-white/98 backdrop-blur-xl px-4 pt-3 pb-6 shadow-lg"
          >
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={location.pathname === '/' ? link.href : `/${link.href}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm text-[#3b4e39] hover:text-[#1b281c] hover:bg-[#738666]/10 rounded-lg font-medium transition-colors"
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
