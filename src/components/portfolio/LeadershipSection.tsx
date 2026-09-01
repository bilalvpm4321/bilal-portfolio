import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Users, Calendar, Award, Sparkles, Building } from 'lucide-react';

export const LeadershipSection: React.FC = () => {
  const { data } = usePortfolio();
  const leaderships = data.leadership.filter((l) => l.is_visible);

  return (
    <section id="leadership" className="py-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <Badge variant="purple" size="md" className="mb-3" icon={<Users className="w-3.5 h-3.5" />}>
            Impact & Community
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
            Leadership & Volunteering
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mt-2">
            Organizing developer communities, student branch chapters, technical events, and social outreach initiatives.
          </p>
          <div className="w-12 h-1 bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full mt-3" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {leaderships.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card
                hoverEffect
                className="p-6 bg-[#0d0f17]/95 border-white/[0.08] flex flex-col justify-between h-full group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium px-2.5 py-1 rounded-md bg-white/[0.04] text-sky-400 border border-white/[0.08]">
                      <Calendar className="w-3 h-3 text-sky-400" />
                      {item.period}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1 group-hover:text-sky-300 transition-colors">
                    {item.role}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-semibold mb-3">
                    <Building className="w-3.5 h-3.5" />
                    <span>{item.organization}</span>
                  </div>

                  {item.description && (
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
