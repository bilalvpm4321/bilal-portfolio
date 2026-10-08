import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';
import { Project } from '../../types/database';
import { ProjectModal } from './ProjectModal';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import {
  FolderGit2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Lock,
  Maximize2,
} from 'lucide-react';

export const ProjectsSection: React.FC = () => {
  const { data } = usePortfolio();
  const sectionRef = useRef<HTMLElement>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1);
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Track scroll progression relative to this section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 85%', 'center 45%'],
  });

  // Transform scroll (0 to 1) into percentage for the horizontal clip reveal
  const clipWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const clipPathStyle = useTransform(clipWidth, (val) => `polygon(0 0, ${val} 0, ${val} 100%, 0% 100%)`);

  // Filter only published projects
  const publishedProjects = useMemo(() => {
    return data.projects.filter((p) => p.is_published);
  }, [data.projects]);

  const total = publishedProjects.length;

  // Safe current project
  const currentProject = publishedProjects[currentIndex] || publishedProjects[0];

  const handleNext = useCallback(() => {
    if (total === 0) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    if (total === 0) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Automatically scroll every 3 seconds
  useEffect(() => {
    if (total <= 1 || isPaused || activeModalProject) return;

    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 3000);

    return () => clearInterval(timer);
  }, [total, isPaused, activeModalProject]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeModalProject) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, activeModalProject]);

  if (total === 0) {
    return (
      <section id="projects" className="py-24 relative bg-[#f9faf7] text-[#1b281c]">
        <div className="max-w-md mx-auto text-center p-8 rounded-2xl bg-white border border-[#738666]/20 shadow-xs">
          <FolderGit2 className="w-10 h-10 text-[#738666] mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#1b281c] mb-1">No Projects Found</h3>
          <p className="text-xs text-[#556950]">Check back soon for new project releases.</p>
        </div>
      </section>
    );
  }

  const slideVariants: any = {
    enter: (dir: number) => ({
      x: dir > 0 ? 160 : -160,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.38, ease: 'easeOut' },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -160 : 160,
      opacity: 0,
      scale: 0.98,
      transition: { duration: 0.28, ease: 'easeIn' },
    }),
  };

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="py-4 sm:py-6 lg:py-8 relative overflow-hidden bg-transparent text-[#1b281c] dark:text-white transition-colors duration-300 w-full"
    >
      {/* Ambient Atmospheric Glows */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-20 -left-28 w-[580px] h-[580px] bg-[#738666]/16 dark:bg-white/[0.03] rounded-full blur-[130px]" />
        <div className="absolute top-1/4 -right-40 w-[600px] h-[600px] bg-[#738666]/16 dark:bg-white/[0.02] border-2 border-[#738666]/20 dark:border-white/[0.04] rounded-full blur-2xl" />
        <div className="absolute -bottom-16 left-1/3 w-[360px] h-[360px] bg-[#738666]/18 dark:bg-white/[0.02] rounded-full blur-[80px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col items-center">
        
        {/* Outlined & Scroll-Fill "Projects" Heading (r and t aligned to edges, subtle monitor alignment) */}
        <div className="relative z-0 mb-[2px] sm:mb-0 md:mb-[-2px] lg:mb-[-4px] select-none w-full max-w-[1040px] sm:max-w-[1130px] lg:max-w-[1190px] mx-auto px-2">
          {/* Subtle Ambient Backlight Glow behind the title */}
          <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[360px] sm:w-[500px] h-[180px] bg-[#738666]/15 dark:bg-white/[0.08] rounded-full blur-[60px] sm:blur-[80px] pointer-events-none -z-10" />

          <div className="relative w-full">
            {/* Layer 1: Base Outlined (Hollow) Text */}
            <h2
              className="text-7xl sm:text-9xl md:text-[130px] lg:text-[136px] xl:text-[150px] font-black leading-none font-sans text-transparent flex justify-between items-baseline w-full"
            >
              {['P', 'r', 'o', 'j', 'e', 'c', 't', 's'].map((char, i) => (
                <span key={i} className="inline-block">
                  <span className="dark:hidden" style={{ WebkitTextStroke: '1.5px rgba(27, 40, 28, 0.35)' }}>{char}</span>
                  <span className="hidden dark:inline" style={{ WebkitTextStroke: '1.5px rgba(255, 255, 255, 0.4)' }}>{char}</span>
                </span>
              ))}
            </h2>

            {/* Layer 2: Filled Text Overlay Clipped by Scroll Progress */}
            <motion.h2
              className="text-7xl sm:text-9xl md:text-[130px] lg:text-[136px] xl:text-[150px] font-black leading-none font-sans absolute inset-0 text-[#1b281c] dark:text-white select-none pointer-events-none flex justify-between items-baseline w-full"
              style={{
                clipPath: clipPathStyle,
              }}
              aria-hidden="true"
            >
              {['P', 'r', 'o', 'j', 'e', 'c', 't', 's'].map((char, i) => (
                <span key={i} className="inline-block">{char}</span>
              ))}
            </motion.h2>
          </div>
        </div>

        {/* Laptop Showcase Stage: Compact, Ultra-Crisp MacBook Display */}
        <div 
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative z-10 max-w-[760px] sm:max-w-[820px] lg:max-w-[860px] w-full mx-auto"
        >
          {/* Ambient Screen Glow */}
          <div className="absolute -inset-3 bg-[#738666]/10 dark:bg-white/[0.03] rounded-3xl blur-xl -z-10 pointer-events-none" />

          {/* Laptop Lid & Screen Bezel */}
          <div className="bg-[#121614] dark:bg-[#111114] border-[4px] sm:border-[6px] border-[#d8dce2] dark:border-[#27272a] rounded-t-2xl sm:rounded-t-3xl p-1.5 sm:p-2.5 shadow-xl relative overflow-hidden">
            
            {/* Glossy Screen Glass Sheen */}
            <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-bl from-white/[0.07] via-transparent to-transparent pointer-events-none z-20" />

            {/* Top Bezel Web Camera */}
            <div className="flex items-center justify-center relative mb-1 z-10">
              <div className="w-1.5 h-1.5 rounded-full bg-[#0a0d0b] border border-[#d1d5db]/40 flex items-center justify-center">
                <div className="w-0.5 h-0.5 rounded-full bg-[#738666] dark:bg-white" />
              </div>
            </div>

            {/* Inner Screen Display */}
            <div className="relative bg-[#0d110e] dark:bg-[#0c0c0e] rounded-lg sm:rounded-xl overflow-hidden border border-[#2a342c] dark:border-[#27272a] aspect-[16/10] flex flex-col group">
              
              {/* Browser OS Top Navigation Bar */}
              <div className="h-6 sm:h-7.5 bg-[#1b221d] dark:bg-[#141418] border-b border-[#2d382f] dark:border-white/[0.08] px-2.5 sm:px-3 flex items-center justify-between shrink-0 select-none z-10">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#ff5f56]/80 inline-block" />
                  <span className="w-2 h-2 rounded-full bg-[#ffbd2e]/80 inline-block" />
                  <span className="w-2 h-2 rounded-full bg-[#27c93f]/80 inline-block" />
                </div>

                {/* Browser URL Pill */}
                <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#0d120e]/80 dark:bg-white/[0.06] border border-[#333e35] dark:border-white/[0.1] text-[11px] sm:text-xs font-mono text-[#b2c6a8] dark:text-zinc-300 max-w-[200px] sm:max-w-xs truncate">
                  <Lock className="w-3 h-3 text-[#738666] dark:text-zinc-300 shrink-0" />
                  <span className="truncate">bilal.dev/project/{currentProject.slug || 'architecture'}</span>
                </div>

                <button
                  onClick={() => setActiveModalProject(currentProject)}
                  title="Expand details"
                  className="text-[#738666] dark:text-zinc-400 hover:text-white transition-colors cursor-pointer p-0.5"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Main Screen Canvas: Full Project Preview Image */}
              <div 
                onClick={() => setActiveModalProject(currentProject)}
                className="relative flex-1 w-full h-full overflow-hidden cursor-pointer bg-[#121814] dark:bg-[#0c0c0e]"
              >
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.div
                    key={currentProject.id}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute inset-0 w-full h-full flex items-center justify-center bg-[#0d120e] dark:bg-[#0c0c0e]"
                  >
                    <img
                      src={
                        currentProject.image_url ||
                        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80'
                      }
                      alt={currentProject.title}
                      className="w-full h-full object-cover object-top select-none transition-transform duration-700 group-hover:scale-[1.01]"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Floating Bottom Badge with Project Title & Category */}
                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4.5 bg-gradient-to-t from-black/85 via-black/45 to-transparent flex items-end justify-between pointer-events-none z-10">
                  <div className="text-white drop-shadow-md">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#738666] dark:bg-white text-white dark:text-black text-[10px] sm:text-xs font-bold mb-1 shadow-xs">
                      {currentProject.category}
                    </span>
                    <h3 className="text-base sm:text-xl lg:text-2xl font-extrabold tracking-tight">
                      {currentProject.title}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Realistic Laptop Base & Bottom Chassis */}
          <div className="relative w-[103%] -ml-[1.5%] pointer-events-none flex flex-col items-center z-10">
            {/* Front Lip with Center Opening Notch */}
            <div className="w-full h-3 sm:h-4 bg-gradient-to-b from-[#e3e6eb] via-[#caced6] to-[#999ea7] dark:from-[#2a2a30] dark:via-[#1e1e24] dark:to-[#141418] rounded-b-xl sm:rounded-b-2xl shadow-lg border-t border-white/90 dark:border-white/10 flex items-start justify-center">
              <div className="w-14 sm:w-20 h-1 sm:h-1.5 bg-[#8b919d] dark:bg-[#0c0c0e] rounded-b-md shadow-inner" />
            </div>
            
            {/* Subtle Laptop Bottom Drop Shadow */}
            <div className="h-2 w-[85%] bg-black/20 dark:bg-black/70 blur-md rounded-full mt-0.5" />
          </div>

        </div>

        {/* Controls Below the Entire Setup - Compact & Seamless */}
        <div className="mt-5 sm:mt-6 flex flex-col items-center gap-3 w-full">
          
          {/* Main Action Bar: [ ← Prev ] [ View Complete Details ] [ Next → ] */}
          <div className="flex items-center justify-center gap-2.5 sm:gap-3.5">
            
            {/* Left Arrow Button */}
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous project"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-white dark:bg-[#141418] border border-[#738666]/20 dark:border-white/[0.1] hover:border-[#738666]/60 dark:hover:border-white/30 text-[#1b281c] dark:text-white hover:bg-[#f1f4ed] dark:hover:bg-[#1c1c22] shadow-xs hover:shadow-sm transition-all duration-200 flex items-center justify-center cursor-pointer group"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-[#556950] dark:text-zinc-400 group-hover:text-[#1b281c] dark:group-hover:text-white group-hover:-translate-x-0.5 transition-transform" />
            </button>

            {/* View Complete Details Button */}
            <Button
              type="button"
              onClick={() => setActiveModalProject(currentProject)}
              size="md"
              className="px-5 sm:px-7 py-2.5 sm:py-3 bg-[#738666] dark:bg-white hover:bg-[#5f7053] dark:hover:bg-zinc-200 text-white dark:text-black text-xs sm:text-sm font-bold rounded-xl sm:rounded-2xl shadow-xs hover:shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>View Complete Details</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Button>

            {/* Right Arrow Button */}
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next project"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-white dark:bg-[#141418] border border-[#738666]/20 dark:border-white/[0.1] hover:border-[#738666]/60 dark:hover:border-white/30 text-[#1b281c] dark:text-white hover:bg-[#f1f4ed] dark:hover:bg-[#1c1c22] shadow-xs hover:shadow-sm transition-all duration-200 flex items-center justify-center cursor-pointer group"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#556950] dark:text-zinc-400 group-hover:text-[#1b281c] dark:group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Project Progress Count & Active Dot Indicators */}
          <div className="flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#3b5237] dark:text-zinc-400">
              <span className="font-mono font-bold text-[#738666] dark:text-white">
                {String(currentIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
              </span>
              <span>•</span>
              <span className="font-bold text-[#1b281c] dark:text-white truncate max-w-[240px] sm:max-w-md">{currentProject.title}</span>
            </div>

            {/* Pagination Indicator Dots */}
            <div className="flex items-center gap-1.5 mt-0.5">
              {publishedProjects.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setDirection(idx > currentIndex ? 1 : -1);
                    setCurrentIndex(idx);
                  }}
                  aria-label={`Jump to project ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentIndex
                      ? 'w-6 bg-[#738666] dark:bg-white'
                      : 'w-2 bg-[#738666]/30 dark:bg-white/20 hover:bg-[#738666]/60 dark:hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Complete Project Details Modal */}
      {activeModalProject && (
        <ProjectModal
          project={activeModalProject}
          onClose={() => setActiveModalProject(null)}
        />
      )}
    </section>
  );
};
