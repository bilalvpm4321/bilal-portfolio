import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';
import { Card } from '../common/Card';
import { TiltCard } from '../common/TiltCard';
import {
  Calendar,
  MapPin,
  CheckCircle2,
  Building2,
  ExternalLink,
} from 'lucide-react';

export const ExperienceSection: React.FC = () => {
  const { data } = usePortfolio();
  const experiences = data.experience;
  const timelineRef = useRef<HTMLDivElement>(null);

  // Scroll tracking to drive the concentric tracer ring node down the vertical line
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 65%', 'end 75%'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 25,
    restDelta: 0.001,
  });

  // Map progress (0 to 1) to vertical percentage (0% to 100%)
  const tracerTop = useTransform(smoothProgress, [0, 1], ['0%', '100%']);

  return (
    <section id="experience" className="py-8 sm:py-12 lg:py-16 relative overflow-hidden bg-white dark:bg-[#08080a] text-[#1b281c] dark:text-white transition-colors duration-300 w-full">
      {/* Ambient Atmospheric Glows */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-28 -right-36 w-[680px] h-[680px] bg-[#738666]/16 dark:bg-white/[0.03] rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -left-24 w-[480px] h-[480px] bg-[#738666]/20 dark:bg-white/[0.02] border border-[#738666]/30 dark:border-white/[0.04] rounded-full blur-xl" />
        <div className="absolute bottom-12 right-10 w-[320px] h-[320px] bg-[#738666]/22 dark:bg-white/[0.02] rounded-full blur-[80px]" />
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10 w-full">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6 sm:mb-10">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-[#1b281c] dark:text-white font-display tracking-tight leading-none">
            Work Experience
          </h2>
          <div className="w-20 sm:w-24 h-1.5 bg-[#738666] dark:bg-white/40 rounded-full mt-4" />
        </div>

        {/* Timeline Container */}
        <div
          ref={timelineRef}
          className="relative border-l-2 border-[#738666]/25 dark:border-white/[0.1] ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-4"
        >
          {/* Animated Concentric Circle Tracer Node that glides down on scroll */}
          <motion.div
            style={{ top: tracerTop }}
            className="absolute -left-[14px] sm:-left-[18px] -translate-y-1/2 z-20 pointer-events-none"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white dark:bg-[#121215] border-2 border-[#738666] dark:border-white flex items-center justify-center shadow-lg shadow-[#738666]/25 dark:shadow-black/70">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#738666] dark:bg-white animate-pulse" />
            </div>
          </motion.div>

          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative"
            >
              {/* 3D Tilt Card Wrapper */}
              <TiltCard maxTilt={8} scale={1.015}>
                <Card className="p-6 sm:p-8 bg-white dark:bg-[#111114] border-[#738666]/20 dark:border-white/[0.08] hover:border-[#738666]/50 dark:hover:border-white/[0.2] transition-all shadow-xs hover:shadow-md dark:shadow-black/60">
                  {/* Header Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3.5">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-[#1b281c] dark:text-white tracking-tight font-display">
                        {exp.title}
                      </h3>
                      <div className="flex items-center gap-2 text-[15px] sm:text-base text-[#4f6749] dark:text-zinc-300 font-bold mt-1">
                        <Building2 className="w-4 h-4 text-[#738666] dark:text-zinc-300" />
                        {exp.company_url ? (
                          <a
                            href={exp.company_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline flex items-center gap-1.5"
                          >
                            {exp.company}
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <span>{exp.company}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f2f6ee] dark:bg-white/[0.06] text-xs sm:text-sm font-mono font-bold text-[#2d4429] dark:text-zinc-300 border border-[#738666]/30 dark:border-white/[0.1] shadow-xs">
                        <Calendar className="w-4 h-4 text-[#738666] dark:text-zinc-300" />
                        {exp.start_date} – {exp.is_current ? 'Present' : exp.end_date}
                      </span>
                    </div>
                  </div>

                  {/* Location */}
                  {exp.location && (
                    <div className="flex items-center gap-1.5 text-sm text-[#445b3f] dark:text-zinc-400 font-medium mb-4">
                      <MapPin className="w-4 h-4 text-[#738666] dark:text-zinc-400" />
                      <span>{exp.location}</span>
                    </div>
                  )}

                  {/* Short summary */}
                  {exp.description && (
                    <p className="text-[15px] sm:text-base text-[#2c4028] dark:text-zinc-300 leading-relaxed mb-5 font-normal">
                      {exp.description}
                    </p>
                  )}

                  {/* Responsibilities list */}
                  {exp.responsibilities && exp.responsibilities.length > 0 && (
                    <div className="space-y-2.5 mb-6">
                      {exp.responsibilities.map((resp, rIdx) => (
                        <div
                          key={rIdx}
                          className="flex items-start gap-2.5 text-sm sm:text-[15px] text-[#1e2e1d] dark:text-zinc-300"
                        >
                          <CheckCircle2 className="w-4 h-4 text-[#738666] dark:text-white shrink-0 mt-1" />
                          <span className="leading-relaxed font-normal">{resp}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Technologies used */}
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-[#738666]/15 dark:border-white/[0.08]">
                      {exp.technologies.map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-xs sm:text-sm font-semibold px-3 py-1 rounded-lg bg-[#f0f4ec] dark:bg-white/[0.06] text-[#22381f] dark:text-zinc-300 border border-[#738666]/25 dark:border-white/[0.08] shadow-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </Card>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

