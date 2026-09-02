import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Briefcase, Calendar, MapPin, CheckCircle2, Building2, ExternalLink } from 'lucide-react';

export const ExperienceSection: React.FC = () => {
  const { data } = usePortfolio();
  const experiences = data.experience;

  return (
    <section id="experience" className="py-24 relative overflow-hidden bg-white text-[#1b281c]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <Badge variant="primary" size="md" className="mb-3" icon={<Briefcase className="w-3.5 h-3.5 text-[#738666]" />}>
            Career Journey
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1b281c] font-display tracking-tight">
            Work Experience
          </h2>
          <p className="text-[#4a5d46] text-sm max-w-xl mt-2">
            Professional roles building full-stack web applications, integrating Generative AI, and developing cloud solutions.
          </p>
          <div className="w-12 h-1 bg-[#738666] rounded-full mt-3" />
        </div>

        {/* Timeline Container */}
        <div className="relative border-l-2 border-[#738666]/25 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-12">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative"
            >
              {/* Timeline Indicator Dot */}
              <div className="absolute -left-[35px] sm:-left-[51px] top-1.5 w-6 h-6 rounded-full bg-white border-2 border-[#738666] flex items-center justify-center shadow-xs">
                <div className="w-2 h-2 rounded-full bg-[#738666]" />
              </div>

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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
