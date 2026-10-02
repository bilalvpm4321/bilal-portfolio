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
    <section id="education" className="py-6 sm:py-8 relative overflow-hidden bg-[#f9faf7] dark:bg-[#090d0a] text-[#1b281c] dark:text-[#f1f5ee] transition-colors duration-300">
      {/* Ambient Olive Green Circles of Varied Sizes (Filled with Olive Green) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Center-Left Massive Blur Orb (660px) */}
        <div className="absolute -top-20 -left-44 w-[660px] h-[660px] bg-[#738666]/18 dark:bg-[#738666]/22 rounded-full blur-[140px]" />
        {/* Bottom-Right Medium Filled Circle (320px) */}
        <div className="absolute bottom-8 -right-16 w-[320px] h-[320px] bg-[#738666]/20 dark:bg-[#738666]/25 border border-[#738666]/30 rounded-full blur-xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-5 sm:mb-6">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-[#1b281c] dark:text-[#f1f5ee] font-display tracking-tight leading-none">
            Education & Qualifications
          </h2>
          <div className="w-20 sm:w-24 h-1.5 bg-[#738666] dark:bg-[#8eb383] rounded-full mt-4" />
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                className="p-6 sm:p-7 bg-white dark:bg-[#111713] border-[#738666]/20 dark:border-[#738666]/35 hover:border-[#738666]/50 dark:hover:border-[#8eb383]/50 flex flex-col justify-between h-full group shadow-xs hover:shadow-md dark:shadow-black/40"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="p-3.5 rounded-xl bg-[#738666]/12 dark:bg-[#738666]/22 text-[#738666] dark:text-[#8eb383] border border-[#738666]/25 dark:border-[#738666]/35 group-hover:scale-105 group-hover:bg-[#738666] group-hover:text-white transition-all">
                      <GraduationCap className="w-6 h-6" />
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f2f6ee] dark:bg-[#16201a] text-xs sm:text-sm font-mono font-bold text-[#2d4429] dark:text-[#c4d7c0] border border-[#738666]/30 dark:border-[#738666]/40 shadow-xs">
                        <Calendar className="w-4 h-4 text-[#738666] dark:text-[#8eb383]" />
                        {edu.start_year} – {edu.end_year}
                      </span>
                      {edu.grade_or_status && (
                        <span className="text-xs sm:text-sm font-bold text-[#455d3f] dark:text-[#a8bfa5] mt-1.5">
                          ● {edu.grade_or_status}
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-[#1b281c] dark:text-[#f1f5ee] mb-1.5 group-hover:text-[#556950] dark:group-hover:text-[#8eb383] transition-colors font-display">
                    {edu.degree} in {edu.field_of_study}
                  </h3>

                  <div className="flex items-center gap-2 text-[15px] sm:text-base text-[#32492f] dark:text-[#a8bfa5] font-semibold mb-3">
                    <Building className="w-4 h-4 text-[#738666] dark:text-[#8eb383] shrink-0" />
                    <span>{edu.institution}</span>
                  </div>
                </div>

                {edu.location && (
                  <div className="flex items-center gap-1.5 text-sm text-[#445b3f] dark:text-[#8ea48b] font-medium pt-4 border-t border-[#738666]/15 dark:border-[#738666]/25">
                    <MapPin className="w-4 h-4 text-[#738666] dark:text-[#8eb383] shrink-0" />
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
