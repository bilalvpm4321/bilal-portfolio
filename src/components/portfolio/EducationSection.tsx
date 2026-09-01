import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { GraduationCap, Calendar, MapPin, Building, BookOpen } from 'lucide-react';

export const EducationSection: React.FC = () => {
  const { data } = usePortfolio();
  const educations = data.education;

  return (
    <section id="education" className="py-24 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <Badge variant="primary" size="md" className="mb-3" icon={<GraduationCap className="w-3.5 h-3.5" />}>
            Academic Background
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
            Education & Qualifications
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mt-2">
            Higher academic foundation in Artificial Intelligence, Data Science, and Information Technology.
          </p>
          <div className="w-12 h-1 bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full mt-3" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                className="p-6 sm:p-7 bg-[#0d0f17]/95 border-white/[0.08] flex flex-col justify-between h-full group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 group-hover:scale-105 transition-transform">
                      <GraduationCap className="w-6 h-6" />
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] text-xs font-mono font-medium text-slate-300 border border-white/[0.08]">
                        <Calendar className="w-3.5 h-3.5 text-sky-400" />
                        {edu.start_year} – {edu.end_year}
                      </span>
                      {edu.grade_or_status && (
                        <span className="text-[11px] font-semibold text-emerald-400 mt-1">
                          ● {edu.grade_or_status}
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-sky-300 transition-colors">
                    {edu.degree} in {edu.field_of_study}
                  </h3>

                  <div className="flex items-center gap-1.5 text-sm text-sky-400 font-semibold mb-3">
                    <Building className="w-4 h-4 text-sky-400" />
                    <span>{edu.institution}</span>
                  </div>
                </div>

                {edu.location && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-4 border-t border-white/[0.06]">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
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
