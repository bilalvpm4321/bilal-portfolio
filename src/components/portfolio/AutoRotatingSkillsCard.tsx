import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';
import { getTechIcon } from './TechIcons';
import { Sparkles, Pause, Play, ChevronRight, ChevronLeft } from 'lucide-react';

interface SkillItem {
  id: string;
  name: string;
  category: string;
  level: string;
}

interface AreaSection {
  id: string;
  title: string;
  shortLabel: string;
  subtitle: string;
  skills: SkillItem[];
}

export const AutoRotatingSkillsCard: React.FC = () => {
  const { data } = usePortfolio();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Group portfolio skills into the 6 major sessions
  const visibleSkills = (data?.skills || []).filter((s) => s.is_visible);

  // Fallback / curated lists to guarantee full beautiful grids even if DB is sparse
  const areas: AreaSection[] = [
    {
      id: 'frontend',
      title: 'FRONTEND DEVELOPMENT',
      shortLabel: 'FRONTEND',
      subtitle: 'Modern component architectures, design systems & reactive UIs',
      skills: [
        { id: 'fe-1', name: 'HTML5', category: 'Frontend', level: 'Expert' },
        { id: 'fe-2', name: 'CSS3', category: 'Frontend', level: 'Expert' },
        { id: 'fe-3', name: 'JavaScript', category: 'Frontend', level: 'Expert' },
        { id: 'fe-4', name: 'TypeScript', category: 'Frontend', level: 'Advanced' },
        { id: 'fe-5', name: 'React.js', category: 'Frontend', level: 'Expert' },
        { id: 'fe-6', name: 'Next.js', category: 'Frontend', level: 'Advanced' },
        { id: 'fe-7', name: 'Tailwind CSS', category: 'Frontend', level: 'Expert' },
        { id: 'fe-8', name: 'Vite & PWA', category: 'Frontend', level: 'Advanced' },
      ],
    },
    {
      id: 'backend',
      title: 'BACKEND & CLOUD',
      shortLabel: 'BACKEND',
      subtitle: 'High-throughput APIs, cloud microservices & real-time sync',
      skills: [
        { id: 'be-1', name: 'FastAPI', category: 'Backend', level: 'Advanced' },
        { id: 'be-2', name: 'Python', category: 'Backend', level: 'Expert' },
        { id: 'be-3', name: 'Node.js', category: 'Backend', level: 'Proficient' },
        { id: 'be-4', name: 'Firebase', category: 'Backend', level: 'Advanced' },
        { id: 'be-5', name: 'Supabase', category: 'Backend', level: 'Advanced' },
        { id: 'be-6', name: 'Google Cloud (GCP)', category: 'Backend', level: 'Proficient' },
        { id: 'be-7', name: 'AWS Lambda', category: 'Backend', level: 'Proficient' },
        { id: 'be-8', name: 'PostgreSQL', category: 'Backend', level: 'Advanced' },
      ],
    },
    {
      id: 'ai-ml',
      title: 'AI & MACHINE LEARNING',
      shortLabel: 'AI & ML',
      subtitle: 'Generative AI, Large Language Models, RAG & Computer Vision',
      skills: [
        { id: 'ai-1', name: 'Generative AI', category: 'AI & ML', level: 'Advanced' },
        { id: 'ai-2', name: 'OpenAI GPT & Prompt Eng', category: 'AI & ML', level: 'Advanced' },
        { id: 'ai-3', name: 'Machine Learning', category: 'AI & ML', level: 'Advanced' },
        { id: 'ai-4', name: 'Deep Learning', category: 'AI & ML', level: 'Proficient' },
        { id: 'ai-5', name: 'Natural Language Processing', category: 'AI & ML', level: 'Advanced' },
        { id: 'ai-6', name: 'Computer Vision', category: 'AI & ML', level: 'Proficient' },
        { id: 'ai-7', name: 'PyTorch', category: 'AI & ML', level: 'Proficient' },
        { id: 'ai-8', name: 'Scikit-Learn', category: 'AI & ML', level: 'Advanced' },
      ],
    },
    {
      id: 'programming',
      title: 'PROGRAMMING LANGUAGES',
      shortLabel: 'PROGRAMMING',
      subtitle: 'Core systems programming, data structures & algorithms',
      skills: [
        { id: 'pr-1', name: 'Python', category: 'Programming', level: 'Expert' },
        { id: 'pr-2', name: 'TypeScript', category: 'Programming', level: 'Advanced' },
        { id: 'pr-3', name: 'JavaScript (ES6+)', category: 'Programming', level: 'Expert' },
        { id: 'pr-4', name: 'C / C++', category: 'Programming', level: 'Proficient' },
        { id: 'pr-5', name: 'SQL', category: 'Programming', level: 'Advanced' },
      ],
    },
    {
      id: 'databases',
      title: 'DATABASES & STORAGE',
      shortLabel: 'DATABASES',
      subtitle: 'Relational databases, document stores & distributed caching',
      skills: [
        { id: 'db-1', name: 'PostgreSQL', category: 'Databases', level: 'Advanced' },
        { id: 'db-2', name: 'MongoDB', category: 'Databases', level: 'Advanced' },
        { id: 'db-3', name: 'Firebase Realtime DB', category: 'Databases', level: 'Advanced' },
        { id: 'db-4', name: 'AWS DynamoDB', category: 'Databases', level: 'Proficient' },
        { id: 'db-5', name: 'SQL', category: 'Databases', level: 'Advanced' },
      ],
    },
    {
      id: 'devops',
      title: 'DEVOPS & TOOLS',
      shortLabel: 'DEVOPS',
      subtitle: 'Containerization, version control, networking & developer toolchains',
      skills: [
        { id: 'do-1', name: 'Docker', category: 'DevOps', level: 'Proficient' },
        { id: 'do-2', name: 'Git & GitHub', category: 'DevOps', level: 'Advanced' },
        { id: 'do-3', name: 'Linux / Bash', category: 'DevOps', level: 'Proficient' },
        { id: 'do-4', name: 'Postman', category: 'DevOps', level: 'Advanced' },
        { id: 'do-5', name: 'Vite', category: 'DevOps', level: 'Advanced' },
      ],
    },
  ];

  // Auto-rotate every 3 seconds (3000ms)
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % areas.length);
    }, 3000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, areas.length]);

  const activeArea = areas[activeIndex];

  const handleSelectArea = (index: number) => {
    setActiveIndex(index);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + areas.length) % areas.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % areas.length);
  };

  return (
    <div
      className="w-full relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Main Container Card (matching Work & Contact card aesthetic) */}
      <div className="relative rounded-3xl bg-white border border-[#738666]/20 shadow-lg shadow-[#1b281c]/[0.04] overflow-hidden p-6 sm:p-10 text-[#1b281c]">
        {/* Subtle Ambient Radial Glow */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 bg-[#738666]/8 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 w-80 h-80 bg-[#738666]/10 rounded-full blur-3xl" />

        {/* 3-Second Auto Progress Timer Bar at Top */}
        <div className="absolute top-0 inset-x-0 h-1 bg-[#738666]/10 overflow-hidden">
          <motion.div
            key={activeIndex}
            initial={{ width: '0%' }}
            animate={{ width: isPaused ? '100%' : '100%' }}
            transition={{ duration: isPaused ? 0 : 3, ease: 'linear' }}
            className="h-full bg-gradient-to-r from-[#738666]/60 via-[#738666] to-[#556950]"
          />
        </div>

        <div className="flex flex-col md:flex-row items-stretch gap-6 sm:gap-8 relative z-10 min-h-[380px]">
          {/* LEFT COLUMN: Vertical rotated Area Label with olive accent line */}
          <div className="hidden md:flex flex-col items-center justify-center pr-2 sm:pr-4 border-r border-[#738666]/15 select-none">
            <div className="flex items-center gap-3 py-6 [writing-mode:vertical-lr] rotate-180">
              {/* Olive accent bar matching our UI theme */}
              <div className="w-1.5 h-10 rounded-full bg-[#738666] shadow-sm shadow-[#738666]/35" />
              <span className="font-display font-extrabold text-sm sm:text-base tracking-[0.25em] text-[#738666] uppercase whitespace-nowrap">
                {activeArea.shortLabel}
              </span>
            </div>
          </div>

          {/* Mobile Top Header (only on small screens) */}
          <div className="flex md:hidden items-center justify-between gap-3 pb-4 border-b border-[#738666]/15">
            <div className="flex items-center gap-2.5">
              <div className="w-1.5 h-6 rounded-full bg-[#738666]" />
              <span className="font-display font-extrabold text-base tracking-widest text-[#738666] uppercase">
                {activeArea.shortLabel}
              </span>
            </div>
            <span className="text-xs text-[#556950] font-mono font-bold">
              0{activeIndex + 1} / 0{areas.length}
            </span>
          </div>

          {/* CENTER: Grid of Skills with Authentic Logos */}
          <div className="flex-1 flex flex-col justify-between">
            {/* Area Title & Subtitle */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-[#1b281c] flex items-center gap-2.5">
                  <span>{activeArea.title}</span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#738666]/12 text-[#2d4229] border border-[#738666]/25">
                    {activeArea.skills.length} Tools
                  </span>
                </h4>
                <p className="text-xs sm:text-sm text-[#556950] mt-1 font-normal">
                  {activeArea.subtitle}
                </p>
              </div>

              {/* Pause/Play & Nav arrows */}
              <div className="flex items-center gap-1.5 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => setIsPaused(!isPaused)}
                  className="p-2 rounded-xl bg-[#f8faf6] hover:bg-[#f0f4ec] border border-[#738666]/20 text-[#3d5337] hover:text-[#1b281c] transition-colors cursor-pointer shadow-2xs"
                  title={isPaused ? 'Resume 3s auto-change' : 'Pause auto-change'}
                >
                  {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="p-2 rounded-xl bg-[#f8faf6] hover:bg-[#f0f4ec] border border-[#738666]/20 text-[#3d5337] hover:text-[#1b281c] transition-colors cursor-pointer shadow-2xs"
                  title="Previous area"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="p-2 rounded-xl bg-[#f8faf6] hover:bg-[#f0f4ec] border border-[#738666]/20 text-[#3d5337] hover:text-[#1b281c] transition-colors cursor-pointer shadow-2xs"
                  title="Next area"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* The Skill Tiles Grid (Matching clean UI theme) */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeArea.id}
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.98 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3.5 sm:gap-4 my-auto"
              >
                {activeArea.skills.map((skill, index) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.03, duration: 0.2 }}
                    className="p-4 sm:p-5 rounded-2xl bg-[#f8faf6] hover:bg-[#f1f5ec] border border-[#738666]/20 hover:border-[#738666]/50 transition-all duration-200 flex flex-col items-center justify-center gap-2.5 group shadow-2xs hover:shadow-md hover:-translate-y-1 cursor-pointer select-none"
                  >
                    {/* Authentic Colorful Brand SVG Icon */}
                    <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 drop-shadow-xs">
                      {getTechIcon(skill.name, 'w-10 h-10 sm:w-12 sm:h-12')}
                    </div>

                    {/* Uppercase Skill Name in Dark High-Contrast Text */}
                    <span className="text-xs sm:text-[13px] font-extrabold uppercase tracking-wider text-[#1b281c] group-hover:text-[#2d4229] text-center leading-tight">
                      {skill.name}
                    </span>

                    {/* Level Badge indicator */}
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#455c41] border border-[#738666]/20 group-hover:border-[#738666]/40 shadow-2xs">
                      {skill.level}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT COLUMN: Vertical Dash Indicators (Theme matched) */}
          <div className="hidden sm:flex flex-col items-center justify-center pl-2 sm:pl-4 border-l border-[#738666]/15 gap-2.5 select-none">
            {areas.map((_, idx) => {
              const isActive = activeIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectArea(idx)}
                  className="p-1 group cursor-pointer focus:outline-hidden"
                  title={`Go to ${areas[idx].shortLabel}`}
                  aria-label={`Slide ${idx + 1}`}
                >
                  <div
                    className={`transition-all duration-300 rounded-full ${
                      isActive
                        ? 'w-1.5 h-9 bg-[#738666] shadow-sm shadow-[#738666]/40'
                        : 'w-1 h-6 bg-[#738666]/20 group-hover:bg-[#738666]/50'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
