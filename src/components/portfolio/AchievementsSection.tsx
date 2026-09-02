import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Trophy, Calendar } from 'lucide-react';

export const AchievementsSection: React.FC = () => {
  const { data } = usePortfolio();
  const achievements = data.achievements.filter((a) => a.is_visible);

  return (
    <section id="achievements" className="py-24 relative overflow-hidden bg-white text-[#1b281c]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <Badge variant="warning" size="md" className="mb-3" icon={<Trophy className="w-3.5 h-3.5 text-[#c8a869]" />}>
            Honors & Milestones
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1b281c] font-display tracking-tight">
            Achievements & Awards
          </h2>
          <p className="text-[#4a5d46] text-sm max-w-xl mt-2">
            Recognitions for academic excellence, software development performance, and community leadership.
          </p>
          <div className="w-12 h-1 bg-[#738666] rounded-full mt-3" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {achievements.map((ach, index) => (
            <motion.div
              key={ach.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <Card
                hoverEffect
                className="p-6 bg-white border-[#738666]/20 hover:border-[#c8a869]/60 flex flex-col justify-between h-full group shadow-xs hover:shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-[#c8a869]/15 text-[#8d6d2b] border border-[#c8a869]/30 group-hover:scale-105 group-hover:bg-[#738666] group-hover:text-white transition-all">
                      <Trophy className="w-6 h-6" />
                    </div>

                    {ach.badge && (
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#c8a869]/15 text-[#8d6d2b] border border-[#c8a869]/30 font-mono">
                        {ach.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-[#1b281c] mb-1 group-hover:text-[#738666] transition-colors font-display">
                    {ach.title}
                  </h3>

                  {ach.subtitle && (
                    <p className="text-xs font-semibold text-[#738666] mb-3">
                      {ach.subtitle}
                    </p>
                  )}

                  {ach.description && (
                    <p className="text-xs sm:text-sm text-[#4a5d46] leading-relaxed">
                      {ach.description}
                    </p>
                  )}
                </div>

                {ach.date_or_year && (
                  <div className="flex items-center gap-1.5 text-xs text-[#556950] font-mono pt-4 mt-4 border-t border-[#738666]/15">
                    <Calendar className="w-3.5 h-3.5 text-[#c8a869]" />
                    <span>{ach.date_or_year}</span>
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
