import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';
import { Card } from '../common/Card';
import {
  MapPin,
  GraduationCap,
  FileText,
  ArrowRight,
  ArrowUpRight,
  Terminal,
  Code2,
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { data } = usePortfolio();
  const profile = data.profile;

  const aboutText =
    profile?.about ||
    profile?.bio ||
    'M.Tech Computer Science and Engineering (AI & Data Science) student at Cochin University of Science and Technology with hands-on experience in full-stack development, Artificial Intelligence, Machine Learning, cloud technologies, and real-time applications. Skilled in Python, React, Firebase, AWS, and Google Cloud Platform, with experience developing AI-powered applications using OpenAI technologies. Proficient in AI coding tools, prompt engineering, database integration, debugging, testing, deployment, and collaborative software development.';

  const coreFocusTags = [
    'Generative AI & LLMs',
    'Python & FastAPI',
    'React & Next.js',
    'TypeScript',
    'PyTorch & LangChain',
    'Cloud Architecture (GCP / AWS)',
    'Realtime Systems & Firebase',
    'Prompt Engineering',
  ];

  return (
    <section id="about" className="py-8 sm:py-12 lg:py-14 relative overflow-hidden bg-[#f9faf7] dark:bg-[#090d0a] text-[#1b281c] dark:text-[#f1f5ee] transition-colors duration-300">
      {/* Ambient Olive Green Atmospheric Lighting */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-24 -right-28 w-[540px] h-[540px] bg-[#738666]/14 dark:bg-[#738666]/20 rounded-full blur-[130px]" />
        <div className="absolute -bottom-24 -left-28 w-[480px] h-[480px] bg-[#738666]/12 dark:bg-[#738666]/18 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 right-1/3 w-[320px] h-[320px] bg-[#738666]/10 dark:bg-[#738666]/15 rounded-full blur-[90px]" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1b281c] dark:text-[#f1f5ee] font-display tracking-tight leading-tight">
            About Me
          </h2>
          <div className="w-20 sm:w-24 h-1.5 bg-[#738666] dark:bg-[#8eb383] rounded-full mt-3.5" />
          <p className="mt-3.5 text-sm sm:text-base text-[#4a5e45] dark:text-[#a8bfa5] max-w-xl mx-auto font-medium leading-relaxed">
            Bridging cutting-edge Artificial Intelligence with production-grade full-stack systems.
          </p>
        </div>

        {/* Master Showcase Box: Building Intelligent Web Systems & AI Solutions */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full"
        >
          <Card className="p-6 sm:p-9 lg:p-11 bg-white dark:bg-[#111713] border-[#738666]/25 dark:border-[#738666]/35 hover:border-[#738666]/45 dark:hover:border-[#8eb383]/50 shadow-sm hover:shadow-xl hover:shadow-[#738666]/10 dark:hover:shadow-black/60 transition-all duration-300 rounded-[28px] sm:rounded-3xl relative overflow-hidden group">
            
            {/* Ambient subtle top edge gradient accent */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#738666]/45 dark:via-[#8eb383]/50 to-transparent pointer-events-none" />

            {/* Top Status & Context Pill Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f2f6ee] dark:bg-[#16201a] border border-[#738666]/25 dark:border-[#738666]/35 text-xs font-semibold text-[#2d4429] dark:text-[#c4d7c0] shadow-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>{profile?.availability_status || 'Open to Opportunities & Collaborations'}</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f8faf6] dark:bg-[#18231d] border border-[#738666]/20 dark:border-[#738666]/30 text-xs font-medium text-[#4a5e45] dark:text-[#a8bfa5]">
                  <MapPin className="w-3.5 h-3.5 text-[#738666] dark:text-[#8eb383]" />
                  <span>{profile?.location || 'Kerala, India'}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f8faf6] dark:bg-[#18231d] border border-[#738666]/20 dark:border-[#738666]/30 text-xs font-medium text-[#4a5e45] dark:text-[#a8bfa5]">
                  <GraduationCap className="w-3.5 h-3.5 text-[#738666] dark:text-[#8eb383]" />
                  <span>CUSAT M.Tech Scholar</span>
                </div>
              </div>
            </div>

            {/* Main Catchy Headline */}
            <div className="space-y-2 mb-5">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#556950] dark:text-[#8ea48b]">
                <Code2 className="w-4 h-4 text-[#738666] dark:text-[#8eb383]" />
                <span>Executive Profile & Vision</span>
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-[#1b281c] dark:text-[#f1f5ee] font-display tracking-tight leading-snug">
                Building Intelligent Web Systems & AI Solutions
              </h3>
            </div>

            {/* Bio Narrative Body */}
            <div className="relative">
              <p className="text-base sm:text-[17px] text-[#253922] dark:text-[#c7d8c4] leading-[1.8] sm:leading-[1.85] font-normal">
                {aboutText}
              </p>
            </div>

            {/* Core Competencies & Specializations Tags */}
            <div className="mt-7 pt-5 border-t border-[#738666]/18 dark:border-[#738666]/25">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#556950] dark:text-[#8ea48b] font-bold mb-3 flex items-center gap-2">
                <span>Core Engineering Focus & Technologies</span>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                {coreFocusTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-xl bg-[#f2f6ee] dark:bg-[#18231d] text-xs sm:text-[13px] font-semibold text-[#2d4429] dark:text-[#b8ceb4] border border-[#738666]/25 dark:border-[#738666]/35 hover:border-[#738666]/50 dark:hover:border-[#8eb383]/50 hover:bg-[#e8f0e3] dark:hover:bg-[#202e26] transition-all"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Bar & Credentials Footer */}
            <div className="mt-8 pt-6 border-t border-[#738666]/18 dark:border-[#738666]/25 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-mono text-[#4a5e45] dark:text-[#8ea48b] text-center sm:text-left">
                <Terminal className="w-4 h-4 text-[#738666] dark:text-[#8eb383] shrink-0" />
                <span>Full-Stack Engineer • Generative AI Specialist</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                {profile?.resume_url && (
                  <a
                    href={profile.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#738666]/12 dark:bg-[#738666]/20 hover:bg-[#738666] dark:hover:bg-[#738666] text-[#2d4429] dark:text-[#d2e3ce] hover:text-white dark:hover:text-white border border-[#738666]/30 dark:border-[#738666]/40 text-xs sm:text-sm font-semibold transition-all duration-200 group/btn shadow-xs"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Curriculum Vitae</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-70 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </a>
                )}
                <a
                  href="#contact"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#738666] hover:bg-[#5f7153] text-white text-xs sm:text-sm font-semibold transition-all duration-200 shadow-xs"
                >
                  <span>Let's Connect</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </Card>
        </motion.div>
      </div>
    </section>
  );
};

