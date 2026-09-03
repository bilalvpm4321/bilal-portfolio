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

  const rawHeadline = profile?.headline || 'Generative AI | Full Stack Developer';
  const headline = rawHeadline.replace(/AI\s*&\s*Data\s*Science/gi, 'Generative AI');
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
      {/* Clean background without circles */}

      {/* Main Magazine Cover Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 flex-1 flex flex-col justify-center">
        

        {/* Magazine Masthead & Layered Portrait Stage */}
        <div className="relative w-full my-2 flex flex-col items-center justify-center">
          
          {/* LAYER 1: The Massive "BILAL AHAMED" Dual Stroke & Solid Display Typography */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full text-center select-none pointer-events-none z-0"
          >
            <h1 className="font-display text-[11.5vw] sm:text-[10.5vw] md:text-[9.8vw] lg:text-[120px] xl:text-[138px] font-black leading-[0.85] uppercase tracking-[0.06em] sm:tracking-[0.08em] flex items-center justify-center gap-3 sm:gap-6 md:gap-8 whitespace-nowrap">
              {/* Outlined Stroke Text for BILAL */}
              <span
                className="text-transparent"
                style={{
                  WebkitTextStroke: '2.8px #738666',
                }}
              >
                BILAL
              </span>

              {/* Solid Fill Text for AHAMED - Olive Green */}
              <span className="text-[#738666]">
                AHAMED
              </span>
            </h1>
          </motion.div>

          {/* LAYER 2: Central Portrait with Flowing Role Stream across exact Center */}
          {avatarImage && (
            <div className="relative -mt-[12.5vw] sm:-mt-[11.5vw] md:-mt-[125px] lg:-mt-[150px] w-full max-w-lg sm:max-w-xl md:max-w-2xl mx-auto flex items-center justify-center z-10">
              
              {/* Flowing Role Stream Passing 3cm Below Center Behind Photo */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-[60px] sm:translate-y-[85px] lg:translate-y-[110px] w-screen z-0 overflow-hidden select-none pointer-events-none">
                <div className="animate-marquee-flow flex items-center whitespace-nowrap gap-10 text-[#738666]/30 font-display font-black text-5xl sm:text-7xl md:text-8xl lg:text-[105px] xl:text-[124px] tracking-[0.16em] uppercase">


                  <span>CLOUD ENGINEER</span>
                  <span className="text-[#c8a869]">•</span>
                  <span>FULL STACK DEVELOPER</span>
                  <span className="text-[#c8a869]">•</span>
                  <span>AI & ML ENGINEER</span>
                  <span className="text-[#c8a869]">•</span>
                  <span>PROMPT ENGINEER</span>
                  <span className="text-[#c8a869]">•</span>
                  <span>GENERATIVE AI ARCHITECT</span>
                  <span className="text-[#c8a869]">•</span>
                  <span>CLOUD ENGINEER</span>
                  <span className="text-[#c8a869]">•</span>
                  <span>FULL STACK DEVELOPER</span>
                  <span className="text-[#c8a869]">•</span>
                  <span>AI & ML ENGINEER</span>
                  <span className="text-[#c8a869]">•</span>
                  <span>PROMPT ENGINEER</span>
                  <span className="text-[#c8a869]">•</span>
                  <span>GENERATIVE AI ARCHITECT</span>
                </div>
              </div>

              {/* Portrait Frame */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15 }}
                className="relative z-10 w-80 sm:w-96 md:w-[450px] lg:w-[490px] aspect-[4/5] group flex items-end justify-center"
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
            className="flex flex-col sm:flex-row items-center justify-center gap-3.5"
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
      </div>
    </section>

  );
};
