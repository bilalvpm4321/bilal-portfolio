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
    <section id="about" className="py-8 sm:py-12 lg:py-16 relative overflow-hidden bg-[#f9faf7] dark:bg-[#08080a] text-[#1b281c] dark:text-white transition-colors duration-300 w-full">
      {/* Ambient Atmospheric Lighting */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-24 -right-28 w-[640px] h-[640px] bg-[#738666]/14 dark:bg-white/[0.03] rounded-full blur-[140px]" />
        <div className="absolute -bottom-24 -left-28 w-[580px] h-[580px] bg-[#738666]/12 dark:bg-white/[0.02] rounded-full blur-[130px]" />
        <div className="absolute top-1/2 right-1/3 w-[420px] h-[420px] bg-[#738666]/10 dark:bg-white/[0.02] rounded-full blur-[100px]" />
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10 w-full">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-6 sm:mb-10">
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#1b281c] dark:text-white font-display tracking-tight leading-tight">
            About Me
          </h2>
          <div className="w-20 sm:w-24 h-1.5 bg-[#738666] dark:bg-white/40 rounded-full mt-3.5" />
          <p className="mt-3.5 text-sm sm:text-lg text-[#4a5e45] dark:text-zinc-400 max-w-2xl mx-auto font-medium leading-relaxed">
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
          <Card className="p-6 sm:p-10 lg:p-14 bg-white dark:bg-[#111114] border-[#738666]/25 dark:border-white/[0.08] hover:border-[#738666]/45 dark:hover:border-white/[0.18] shadow-sm hover:shadow-2xl hover:shadow-[#738666]/10 dark:hover:shadow-black/70 transition-all duration-300 rounded-[32px] sm:rounded-[40px] relative overflow-hidden group w-full">
            
            {/* Ambient subtle top edge gradient accent */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#738666]/45 dark:via-white/20 to-transparent pointer-events-none" />

            {/* Top Status & Context Pill Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f2f6ee] dark:bg-white/[0.06] border border-[#738666]/25 dark:border-white/[0.1] text-xs font-semibold text-[#2d4429] dark:text-zinc-300 shadow-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>{profile?.availability_status || 'Open to Opportunities & Collaborations'}</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f8faf6] dark:bg-white/[0.04] border border-[#738666]/20 dark:border-white/[0.08] text-xs font-medium text-[#4a5e45] dark:text-zinc-400">
                  <MapPin className="w-3.5 h-3.5 text-[#738666] dark:text-zinc-300" />
                  <span>{profile?.location || 'Kerala, India'}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f8faf6] dark:bg-white/[0.04] border border-[#738666]/20 dark:border-white/[0.08] text-xs font-medium text-[#4a5e45] dark:text-zinc-400">
                  <GraduationCap className="w-3.5 h-3.5 text-[#738666] dark:text-zinc-300" />
                  <span>CUSAT M.Tech Scholar</span>
                </div>
              </div>
            </div>

            {/* Main Catchy Headline */}
            <div className="space-y-2 mb-5">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#556950] dark:text-zinc-400">
                <Code2 className="w-4 h-4 text-[#738666] dark:text-white" />
                <span>Executive Profile & Vision</span>
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-[#1b281c] dark:text-white font-display tracking-tight leading-snug">
                Building Intelligent Web Systems & AI Solutions
              </h3>
            </div>

            {/* Bio Narrative Body */}
            <div className="relative">
              <p className="text-base sm:text-[17px] text-[#253922] dark:text-zinc-300 leading-[1.8] sm:leading-[1.85] font-normal">
                {aboutText}
              </p>
            </div>

            {/* Core Competencies & Specializations Tags */}
            <div className="mt-7 pt-5 border-t border-[#738666]/18 dark:border-white/[0.08]">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#556950] dark:text-zinc-400 font-bold mb-3 flex items-center gap-2">
                <span>Core Engineering Focus & Technologies</span>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                {coreFocusTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-xl bg-[#f2f6ee] dark:bg-white/[0.06] text-xs sm:text-[13px] font-semibold text-[#2d4429] dark:text-zinc-300 border border-[#738666]/25 dark:border-white/[0.08] hover:border-[#738666]/50 dark:hover:border-white/[0.2] hover:bg-[#e8f0e3] dark:hover:bg-white/[0.1] transition-all"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Bar & Credentials Footer */}
            <div className="mt-8 pt-6 border-t border-[#738666]/18 dark:border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-mono text-[#4a5e45] dark:text-zinc-400 text-center sm:text-left">
                <Terminal className="w-4 h-4 text-[#738666] dark:text-zinc-300 shrink-0" />
                <span>Full-Stack Engineer • Generative AI Specialist</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                {profile?.resume_url && (
                  <a
                    href={profile.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#738666]/12 dark:bg-white/[0.06] hover:bg-[#738666] dark:hover:bg-white/[0.14] text-[#2d4229] dark:text-zinc-200 hover:text-white dark:hover:text-white border border-[#738666]/30 dark:border-white/[0.12] text-xs sm:text-sm font-semibold transition-all duration-200 group/btn shadow-xs"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Curriculum Vitae</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-70 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </a>
                )}
                <a
                  href="#contact"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#738666] dark:bg-white hover:bg-[#5f7153] dark:hover:bg-zinc-200 text-white dark:text-black text-xs sm:text-sm font-bold transition-all duration-200 shadow-xs"
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

