import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Trophy, Award, Star, Calendar } from 'lucide-react';

export const AchievementsSection: React.FC = () => {
  const { data } = usePortfolio();
  const achievements = data.achievements.filter((a) => a.is_visible);

  return (
    <section id="achievements" className="py-24 relative overflow-hidden bg-[#07080c]/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <Badge variant="warning" size="md" className="mb-3" icon={<Trophy className="w-3.5 h-3.5" />}>
            Honors & Milestones
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
            Achievements & Awards
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mt-2">
            Recognitions for academic excellence, software development performance, and community leadership.
          </p>
          <div className="w-12 h-1 bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full mt-3" />
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
                className="p-6 bg-[#0d0f17]/95 border-white/[0.08] flex flex-col justify-between h-full group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-105 transition-transform">
                      <Trophy className="w-6 h-6" />
                    </div>

                    {ach.badge && (
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        {ach.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-amber-300 transition-colors">
                    {ach.title}
                  </h3>

                  {ach.subtitle && (
                    <p className="text-xs font-semibold text-sky-400 mb-3">
                      {ach.subtitle}
                    </p>
                  )}

                  {ach.description && (
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {ach.description}
                    </p>
                  )}
                </div>

                {ach.date_or_year && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono pt-4 mt-4 border-t border-white/[0.06]">
                    <Calendar className="w-3.5 h-3.5 text-amber-400/80" />
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
