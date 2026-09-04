import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { TiltCard } from '../common/TiltCard';
import { Briefcase, Calendar, MapPin, CheckCircle2, Building2, ExternalLink } from 'lucide-react';

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
    <section id="experience" className="py-24 relative overflow-hidden bg-white text-[#1b281c]">
      {/* Ambient Olive Green Circles of Varied Sizes (Filled with Olive Green) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top-Right Large Glow Orb (600px) */}
        <div className="absolute -top-28 -right-36 w-[600px] h-[600px] bg-[#738666]/16 rounded-full blur-[130px]" />
        {/* Center-Left Floating Filled Circle (400px) */}
        <div className="absolute top-1/3 -left-24 w-[400px] h-[400px] bg-[#738666]/20 border border-[#738666]/30 rounded-full animate-pulse blur-xl" />
        {/* Bottom-Right Small Glow (260px) */}
        <div className="absolute bottom-12 right-10 w-[260px] h-[260px] bg-[#738666]/22 rounded-full blur-[70px]" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-[#1b281c] font-display tracking-tight leading-none">
            Work Experience
          </h2>
          <div className="w-20 sm:w-24 h-1.5 bg-[#738666] rounded-full mt-4" />
        </div>


        {/* Timeline Container */}
        <div
          ref={timelineRef}
          className="relative border-l-2 border-[#738666]/25 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-12"
        >
          {/* Animated Concentric Circle Tracer Node that glides down on scroll */}
          <motion.div
            style={{ top: tracerTop }}
            className="absolute -left-[14px] sm:-left-[18px] -translate-y-1/2 z-20 pointer-events-none"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border-2 border-[#738666] flex items-center justify-center shadow-lg shadow-[#738666]/25">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#738666] animate-pulse" />
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
                <Card className="p-6 sm:p-7 bg-white border-[#738666]/20 hover:border-[#738666]/50 transition-all shadow-xs hover:shadow-md">
                  {/* Header Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-[#1b281c] tracking-tight font-display">{exp.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-[#738666] font-semibold mt-0.5">
                        <Building2 className="w-4 h-4" />
                        {exp.company_url ? (
                          <a
                            href={exp.company_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline flex items-center gap-1"
                          >
                            {exp.company}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span>{exp.company}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f8faf6] text-xs font-mono font-medium text-[#556950] border border-[#738666]/20">
                        <Calendar className="w-3.5 h-3.5 text-[#738666]" />
                        {exp.start_date} – {exp.is_current ? 'Present' : exp.end_date}
                      </span>
                    </div>
                  </div>

                  {/* Location */}
                  {exp.location && (
                    <div className="flex items-center gap-1.5 text-xs text-[#556950] mb-4">
                      <MapPin className="w-3.5 h-3.5 text-[#738666]" />
                      <span>{exp.location}</span>
                    </div>
                  )}

                  {/* Short summary */}
                  {exp.description && (
                    <p className="text-sm text-[#4a5d46] leading-relaxed mb-4">
                      {exp.description}
                    </p>
                  )}

                  {/* Responsibilities list */}
                  {exp.responsibilities && exp.responsibilities.length > 0 && (
                    <div className="space-y-2 mb-5">
                      {exp.responsibilities.map((resp, rIdx) => (
                        <div key={rIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#2d432b]">
                          <CheckCircle2 className="w-4 h-4 text-[#738666] shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{resp}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Technologies used */}
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-4 border-t border-[#738666]/15">
                      {exp.technologies.map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-[#f1f4ed] text-[#2d432b] border border-[#738666]/20"
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

