import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';
import { Button } from '../common/Button';
import { ArrowRight, FileDown, Sparkles, Mail, Code2, Database, Brain } from 'lucide-react';
import { Github, Linkedin } from '../common/BrandIcons';

export const HeroSection: React.FC = () => {
  const { data } = usePortfolio();
  const profile = data.profile;

  const fullName = profile?.full_name || 'Bilal Ahamed PT';
  const headline = profile?.headline || 'AI & Data Science | Full Stack Developer';
  const bio =
    profile?.bio ||
    'M.Tech Computer Science and Engineering (AI & Data Science) student at CUSAT with hands-on experience in full-stack development, Generative AI, Machine Learning, cloud technologies, and real-time systems.';
  const resumeUrl = profile?.resume_url || '/resume.pdf';
  const availabilityStatus = profile?.availability_status || 'Open to Opportunities & Collaborations';

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-20 overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        {/* Subtle radial ambient gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-[100px]" />
        
        {/* Modern Dot/Grid background */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px)`,
            backgroundSize: '28px 28px',
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Availability Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold mb-8 shadow-sm backdrop-blur-md"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{availabilityStatus}</span>
        </motion.div>

        {/* Hero Name & Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white font-display leading-[1.1] mb-6"
        >
          Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400">{fullName}</span>
        </motion.h1>

        {/* Professional Subheading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl md:text-2xl font-medium text-slate-300 mb-6 flex items-center justify-center gap-2 flex-wrap"
        >
          <span>{headline}</span>
        </motion.div>

        {/* Professional Bio */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-3xl mx-auto text-base sm:text-lg text-slate-400 leading-relaxed mb-10"
        >
          {bio}
        </motion.p>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
        >
          <Button
            variant="primary"
            size="lg"
            onClick={() => scrollToSection('projects')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="w-full sm:w-auto"
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
                leftIcon={<FileDown className="w-4 h-4 text-sky-400" />}
                className="w-full sm:w-auto"
              >
                Download Resume
              </Button>
            </a>
          )}
        </motion.div>

        {/* Quick Highlights / Metrics Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
        >
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm flex flex-col items-center">
            <Brain className="w-5 h-5 text-sky-400 mb-2" />
            <span className="text-xl font-bold text-white">M.Tech AI & DS</span>
            <span className="text-xs text-slate-400 mt-0.5">CUSAT 2025–2027</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm flex flex-col items-center">
            <Code2 className="w-5 h-5 text-indigo-400 mb-2" />
            <span className="text-xl font-bold text-white">Full Stack & GenAI</span>
            <span className="text-xs text-slate-400 mt-0.5">React • Python • FastAPIs</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm flex flex-col items-center">
            <Database className="w-5 h-5 text-cyan-400 mb-2" />
            <span className="text-xl font-bold text-white">Cloud & Realtime</span>
            <span className="text-xs text-slate-400 mt-0.5">GCP • AWS • Supabase</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm flex flex-col items-center">
            <Sparkles className="w-5 h-5 text-amber-400 mb-2" />
            <span className="text-xl font-bold text-white">GATE 2024</span>
            <span className="text-xs text-slate-400 mt-0.5">CS & IT Qualified</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
