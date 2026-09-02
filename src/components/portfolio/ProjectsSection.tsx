import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1);
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);

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
    <section id="projects" className="py-20 sm:py-24 relative overflow-hidden bg-[#f9faf7] text-[#1b281c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-10 sm:mb-14">
          <Badge variant="primary" size="md" className="mb-2.5" icon={<FolderGit2 className="w-3.5 h-3.5 text-[#738666]" />}>
            Featured Work
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#1b281c] font-display tracking-tight leading-tight">
            Projects & Technical Implementations
          </h2>
          <div className="w-14 h-1 bg-[#738666]/60 rounded-full mt-3.5" />
        </div>

        {/* Workstation Stage: Full, Grand, Crystal-Clear Laptop Screen Showcase */}
        <div 
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative max-w-5xl mx-auto w-full"
        >
          
          {/* Ambient Screen Glow */}
          <div className="absolute -inset-4 bg-[#738666]/12 rounded-3xl blur-2xl -z-10 pointer-events-none" />

          {/* Laptop Display Chassis */}
          <div className="bg-[#1c221e] border-2 border-[#333d35] rounded-t-2xl sm:rounded-t-3xl p-2.5 sm:p-3.5 shadow-2xl relative">
            
            {/* Top Bezel: Camera & Indicator */}
            <div className="flex items-center justify-center relative mb-2">
              <div className="w-2 h-2 rounded-full bg-[#0d120f] border border-[#3e4a40] flex items-center justify-center">
                <div className="w-0.5 h-0.5 rounded-full bg-[#738666]" />
              </div>
            </div>

            {/* Inner Screen Display */}
            <div className="relative bg-[#0d110e] rounded-xl sm:rounded-2xl overflow-hidden border border-[#2a342c] aspect-[16/10] flex flex-col group">
              
              {/* Browser OS Top Navigation Bar */}
              <div className="h-7 sm:h-9 bg-[#1b221d] border-b border-[#2d382f] px-3 sm:px-4 flex items-center justify-between shrink-0 select-none">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]/80 inline-block" />
                </div>

                {/* Browser URL Pill */}
                <div className="flex items-center gap-1.5 px-3 py-0.5 sm:py-1 rounded-md bg-[#0d120e]/80 border border-[#333e35] text-[10px] sm:text-xs font-mono text-[#a3b699] max-w-[200px] sm:max-w-xs truncate">
                  <Lock className="w-3 h-3 text-[#738666] shrink-0" />
                  <span className="truncate">bilal.dev/project/{currentProject.slug || 'architecture'}</span>
                </div>

                <button
                  onClick={() => setActiveModalProject(currentProject)}
                  title="Expand details"
                  className="text-[#738666] hover:text-white transition-colors cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Main Screen Canvas: Full Crystal-Clear Project Image */}
              <div 
                onClick={() => setActiveModalProject(currentProject)}
                className="relative flex-1 w-full h-full overflow-hidden cursor-pointer bg-[#121814]"
              >
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.div
                    key={currentProject.id}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute inset-0 w-full h-full flex items-center justify-center bg-[#0d120e]"
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

                {/* Subtle Floating Bottom Badge with Project Title & Category */}
                <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-5 bg-gradient-to-t from-black/85 via-black/45 to-transparent flex items-end justify-between pointer-events-none">
                  <div className="text-white drop-shadow-md">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#738666]/90 text-white text-[10px] sm:text-xs font-semibold mb-1">
                      {currentProject.category}
                    </span>
                    <h3 className="text-base sm:text-2xl font-bold tracking-tight">
                      {currentProject.title}
                    </h3>
                  </div>

                  <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-white/90 bg-black/50 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15">
                    <span>Click Screen to View Full Specs</span>
                    <Maximize2 className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Laptop Base / Keyboard Hinge Deck */}
          <div className="relative">
            <div className="h-4 sm:h-5 bg-gradient-to-b from-[#2b352d] to-[#1a211b] border-t border-[#3e4a40] rounded-b-xl sm:rounded-b-2xl shadow-md flex items-center justify-center">
              <div className="w-20 sm:w-28 h-1 sm:h-1.5 rounded-full bg-[#121713] border border-[#3e4a40]/50" />
            </div>
            <div className="h-2 w-[94%] mx-auto bg-black/20 blur-sm rounded-full" />
          </div>
        </div>

        {/* Controls Below the Entire Setup */}
        <div className="mt-8 sm:mt-10 flex flex-col items-center gap-4">
          
          {/* Main Action Bar: [ ← Prev ] [ View Complete Details ] [ Next → ] */}
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            
            {/* Left Arrow Button */}
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous project"
              className="w-12 h-12 rounded-2xl bg-white border border-[#738666]/20 hover:border-[#738666]/60 text-[#1b281c] hover:bg-[#f1f4ed] shadow-xs hover:shadow-sm transition-all duration-200 flex items-center justify-center cursor-pointer group"
            >
              <ChevronLeft className="w-5 h-5 text-[#556950] group-hover:text-[#1b281c] group-hover:-translate-x-0.5 transition-transform" />
            </button>

            {/* View Complete Details Button */}
            <Button
              type="button"
              onClick={() => setActiveModalProject(currentProject)}
              size="lg"
              className="px-6 sm:px-8 py-3 bg-[#738666] hover:bg-[#5f7053] text-white font-semibold rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-2.5 cursor-pointer"
            >
              <span>View Complete Details</span>
              <ExternalLink className="w-4 h-4" />
            </Button>

            {/* Right Arrow Button */}
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next project"
              className="w-12 h-12 rounded-2xl bg-white border border-[#738666]/20 hover:border-[#738666]/60 text-[#1b281c] hover:bg-[#f1f4ed] shadow-xs hover:shadow-sm transition-all duration-200 flex items-center justify-center cursor-pointer group"
            >
              <ChevronRight className="w-5 h-5 text-[#556950] group-hover:text-[#1b281c] group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Project Progress Count & Active Dot Indicators */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2.5 text-xs font-medium text-[#556950]">
              <span className="font-mono font-bold text-[#738666]">
                {String(currentIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
              </span>
              <span>•</span>
              <span className="font-bold text-[#1b281c]">{currentProject.title}</span>
            </div>

            {/* Pagination Indicator Dots */}
            <div className="flex items-center gap-1.5 mt-1">
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
                      ? 'w-7 bg-[#738666]'
                      : 'w-2 bg-[#738666]/25 hover:bg-[#738666]/50'
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
