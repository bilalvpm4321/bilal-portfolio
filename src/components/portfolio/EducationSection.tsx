import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { GraduationCap, Calendar, MapPin, Building } from 'lucide-react';

export const EducationSection: React.FC = () => {
  const { data } = usePortfolio();
  const educations = data.education;

  return (
    <section id="education" className="py-4 sm:py-6 lg:py-8 relative overflow-hidden bg-transparent text-[#1b281c] dark:text-white transition-colors duration-300 w-full">
      {/* Ambient Atmospheric Glows */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-20 -left-44 w-[680px] h-[680px] bg-[#738666]/18 dark:bg-white/[0.03] rounded-full blur-[140px]" />
        <div className="absolute bottom-8 -right-16 w-[420px] h-[420px] bg-[#738666]/20 dark:bg-white/[0.02] border border-[#738666]/30 dark:border-white/[0.04] rounded-full blur-xl" />
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10 w-full">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-4 sm:mb-6">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-[#1b281c] dark:text-white font-display tracking-tight leading-none">
            Education & Qualifications
          </h2>
          <div className="w-20 sm:w-24 h-1.5 bg-[#738666] dark:bg-white/40 rounded-full mt-3 sm:mt-4" />
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {educations.map((edu, index) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <Card
                hoverEffect
                className="p-6 sm:p-8 lg:p-10 rounded-[28px] sm:rounded-3xl bg-white dark:bg-[#111114] border-[#738666]/20 dark:border-white/[0.08] hover:border-[#738666]/50 dark:hover:border-white/[0.2] flex flex-col justify-between h-full group shadow-xs hover:shadow-xl dark:shadow-black/60"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="p-3.5 rounded-xl bg-[#738666]/12 dark:bg-white/[0.06] text-[#738666] dark:text-white border border-[#738666]/25 dark:border-white/[0.08] group-hover:scale-105 group-hover:bg-[#738666] dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black transition-all">
                      <GraduationCap className="w-6 h-6" />
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f2f6ee] dark:bg-white/[0.06] text-xs sm:text-sm font-mono font-bold text-[#2d4429] dark:text-zinc-300 border border-[#738666]/30 dark:border-white/[0.1] shadow-xs">
                        <Calendar className="w-4 h-4 text-[#738666] dark:text-zinc-300" />
                        {edu.start_year} – {edu.end_year}
                      </span>
                      {edu.grade_or_status && (
                        <span className="text-xs sm:text-sm font-bold text-[#455d3f] dark:text-zinc-400 mt-1.5">
                          ● {edu.grade_or_status}
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-[#1b281c] dark:text-white mb-1.5 group-hover:text-[#556950] dark:group-hover:text-zinc-300 transition-colors font-display">
                    {edu.degree} in {edu.field_of_study}
                  </h3>

                  <div className="flex items-center gap-2 text-[15px] sm:text-base text-[#32492f] dark:text-zinc-300 font-semibold mb-3">
                    <Building className="w-4 h-4 text-[#738666] dark:text-zinc-300 shrink-0" />
                    <span>{edu.institution}</span>
                  </div>
                </div>

                {edu.location && (
                  <div className="flex items-center gap-1.5 text-sm text-[#445b3f] dark:text-zinc-400 font-medium pt-4 border-t border-[#738666]/15 dark:border-white/[0.08]">
                    <MapPin className="w-4 h-4 text-[#738666] dark:text-zinc-400 shrink-0" />
                    <span>{edu.location}</span>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
