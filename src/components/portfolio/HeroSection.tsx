import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';
import { Button } from '../common/Button';
import {
  ArrowRight,
  FileDown,
  Sparkles,
  Code2,
  Database,
  Brain,
  GraduationCap,
  Cpu,
  Trophy,
  Rocket,
  Users,
  Terminal,
} from 'lucide-react';

const HIGHLIGHT_ITEMS = [
  {
    id: 'hl-1',
    icon: 'brain',
    title: 'M.Tech AI & DS',
    subtitle: 'CUSAT 2025–2027',
  },
  {
    id: 'hl-2',
    icon: 'code',
    title: 'Full Stack & GenAI',
    subtitle: 'React • Python • FastAPI',
  },
  {
    id: 'hl-3',
    icon: 'database',
    title: 'Cloud & Realtime',
    subtitle: 'GCP • AWS • Supabase',
  },
  {
    id: 'hl-4',
    icon: 'sparkles',
    title: 'GATE 2024',
    subtitle: 'CS & IT Qualified',
  },
  {
    id: 'hl-5',
    icon: 'graduation',
    title: 'B.Tech IT Graduate',
    subtitle: 'GEC Idukki 2021–2025',
  },
  {
    id: 'hl-6',
    icon: 'cpu',
    title: 'Machine Learning',
    subtitle: 'PyTorch • LangChain • RAG',
  },
];

const getHighlightIcon = (iconName: string) => {
  switch (iconName?.toLowerCase()) {
    case 'brain':
      return <Brain className="w-4 h-4 text-[#738666]" />;
    case 'code':
      return <Code2 className="w-4 h-4 text-[#738666]" />;
    case 'database':
      return <Database className="w-4 h-4 text-[#738666]" />;
    case 'sparkles':
      return <Sparkles className="w-4 h-4 text-[#c8a869]" />;
    case 'graduation':
      return <GraduationCap className="w-4 h-4 text-[#738666]" />;
    case 'cpu':
      return <Cpu className="w-4 h-4 text-[#738666]" />;
    case 'trophy':
      return <Trophy className="w-4 h-4 text-[#c8a869]" />;
    case 'rocket':
      return <Rocket className="w-4 h-4 text-[#738666]" />;
    case 'users':
      return <Users className="w-4 h-4 text-[#738666]" />;
    case 'terminal':
      return <Terminal className="w-4 h-4 text-[#738666]" />;
    default:
      return <Sparkles className="w-4 h-4 text-[#738666]" />;
  }
};

export const HeroSection: React.FC = () => {
  const { data } = usePortfolio();
  const profile = data.profile;

  const headline = profile?.headline || 'AI & Data Science | Full Stack Developer';
  const bio =
    profile?.bio ||
    'M.Tech Computer Science and Engineering (AI & Data Science) student at CUSAT with hands-on experience in full-stack development, Generative AI, Machine Learning, cloud technologies, and real-time systems.';
  const resumeUrl = profile?.resume_url || '/resume.pdf';

  // Bilal's avatar image
  const avatarImage = profile?.avatar_url || '';

  // Dynamic flowing highlights configured from Admin Dashboard
  const highlightsList = data.siteSettings?.hero?.highlights && data.siteSettings.hero.highlights.length > 0
    ? data.siteSettings.hero.highlights
    : HIGHLIGHT_ITEMS;

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-between pt-24 pb-16 overflow-hidden bg-white text-[#1b281c]">
      {/* Subtle Ambient Sage Wash */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#738666]/[0.06] rounded-full blur-[160px]" />
      </div>

      {/* Main Magazine Cover Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 flex-1 flex flex-col justify-center">
        
        {/* Top Editorial Metadata Row - Matching Screenshot */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-start justify-between text-xs sm:text-sm font-bold uppercase tracking-tight mb-2 px-2 sm:px-6"
        >
          {/* Left Tag */}
          <div className="flex flex-col leading-tight text-left">
            <span className="text-[#1b281c] font-display">Creative</span>
            <span className="text-[#556950]">Developer</span>
          </div>

          {/* Right Tag */}
          <div className="flex flex-col leading-tight text-right">
            <span className="text-[#1b281c] font-display">AI & Full Stack</span>
            <span className="text-[#556950]">Developer</span>
          </div>
        </motion.div>

        {/* Magazine Masthead & Layered Portrait Stage */}
        <div className="relative w-full my-2 flex flex-col items-center justify-center">
          
          {/* LAYER 1: The Massive "Bilal" Masthead Display Typography */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full text-center select-none pointer-events-none"
          >
            <h1
              className="font-editorial text-[19vw] sm:text-[18vw] md:text-[16vw] lg:text-[180px] font-extrabold leading-[0.82] tracking-tighter text-[#738666] transition-all"
              style={{
                letterSpacing: '-0.05em',
              }}
            >
              Bilal
            </h1>
          </motion.div>

          {/* LAYER 2: Central Portrait overlapping the typography */}
          {avatarImage && (
            <div className="relative -mt-[18vw] sm:-mt-[17vw] md:-mt-[170px] lg:-mt-[195px] w-full max-w-lg sm:max-w-xl md:max-w-2xl mx-auto flex items-center justify-center">
              {/* Portrait Frame */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15 }}
                className="relative w-80 sm:w-96 md:w-[450px] lg:w-[490px] aspect-[4/5] group flex items-end justify-center"
              >
                <img
                  src={avatarImage}
                  alt="Bilal - AI & Full Stack Developer"
                  className="w-full h-full object-contain object-bottom transition-transform duration-700 group-hover:scale-105"
                />
              </motion.div>
            </div>
          )}
        </div>

        {/* Editorial Subheading & Bio */}
        <div className="text-center max-w-2xl mx-auto mt-6">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base sm:text-lg font-bold text-[#1b281c] mb-3"
          >
            {headline}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xs sm:text-sm text-[#4a5d46] leading-relaxed mb-6"
          >
            {bio}
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-8"
          >
            <Button
              variant="primary"
              size="lg"
              onClick={() => scrollToSection('projects')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto bg-[#738666] hover:bg-[#627456] text-white border border-[#738666] shadow-md shadow-[#738666]/25 font-semibold"
            >
              View Projects
            </Button>

            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="w-full sm:w-auto"
              >
                <Button
                  variant="secondary"
                  size="lg"
                  leftIcon={<FileDown className="w-4 h-4 text-[#738666]" />}
                  className="w-full sm:w-auto bg-white hover:bg-[#738666]/10 text-[#1b281c] border border-[#738666]/30 shadow-xs"
                >
                  Download Resume
                </Button>
              </a>
            )}
          </motion.div>
        </div>

        {/* Flowing Highlights Strip (Right to Left loop, pauses on hover) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="relative w-full max-w-5xl mx-auto pt-6 border-t border-[#738666]/20 overflow-hidden"
        >
          {/* Subtle Left & Right gradient edge fades for smooth entry/exit */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />

          {/* Marquee Track: flows continuously right-to-left, freezes on hover */}
          <div className="animate-marquee-flow flex items-center gap-3.5 py-1">
            {[...highlightsList, ...highlightsList].map((item: any, idx: number) => (
              <div
                key={idx}
                className="w-60 shrink-0 p-3 rounded-2xl bg-[#f8faf6] border border-[#738666]/20 hover:border-[#738666]/60 hover:bg-[#f1f4ed] backdrop-blur-sm flex items-center gap-3 transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer select-none"
              >
                <div className="w-9 h-9 rounded-xl bg-white border border-[#738666]/25 flex items-center justify-center shrink-0 shadow-xs">
                  {typeof item.icon === 'string' ? getHighlightIcon(item.icon) : item.icon}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-[#1b281c] font-display truncate">
                    {item.title}
                  </span>
                  <span className="text-[11px] text-[#556950] font-medium truncate">
                    {item.subtitle}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
