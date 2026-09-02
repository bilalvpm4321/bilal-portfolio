import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Users, Calendar, Building } from 'lucide-react';

export const LeadershipSection: React.FC = () => {
  const { data } = usePortfolio();
  const leaderships = data.leadership.filter((l) => l.is_visible);

  return (
    <section id="leadership" className="py-24 relative overflow-hidden bg-[#f9faf7] text-[#1b281c]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <Badge variant="primary" size="md" className="mb-3" icon={<Users className="w-3.5 h-3.5 text-[#738666]" />}>
            Impact & Community
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1b281c] font-display tracking-tight">
            Leadership & Volunteering
          </h2>
          <p className="text-[#4a5d46] text-sm max-w-xl mt-2">
            Organizing developer communities, student branch chapters, technical events, and social outreach initiatives.
          </p>
          <div className="w-12 h-1 bg-[#738666] rounded-full mt-3" />
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
                className="p-6 bg-white border-[#738666]/20 hover:border-[#738666]/50 flex flex-col justify-between h-full group shadow-xs hover:shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium px-2.5 py-1 rounded-md bg-[#f8faf6] text-[#556950] border border-[#738666]/20">
                      <Calendar className="w-3 h-3 text-[#738666]" />
                      {item.period}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#1b281c] mb-1 group-hover:text-[#738666] transition-colors font-display">
                    {item.role}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-[#738666] font-semibold mb-3">
                    <Building className="w-3.5 h-3.5 text-[#738666]" />
                    <span>{item.organization}</span>
                  </div>

                  {item.description && (
                    <p className="text-xs text-[#4a5d46] leading-relaxed">
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
