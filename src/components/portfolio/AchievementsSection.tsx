import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Badge } from '../common/Badge';
import { Trophy } from 'lucide-react';
import { Orbital3DCarousel, AchievementItem } from './Orbital3DCarousel';

export const AchievementsSection: React.FC = () => {
  const { data } = usePortfolio();
  const rawAchievements = data.achievements.filter((a) => a.is_visible);

  // Map to AchievementItem
  const achievements: AchievementItem[] = rawAchievements.map((ach) => ({
    id: ach.id,
    title: ach.title,
    subtitle: ach.subtitle,
    description: ach.description,
    date_or_year: ach.date_or_year,
    badge: ach.badge || 'Honor',
    image_url: (ach as any).image_url,
    credential_url: (ach as any).credential_url,
  }));

  return (
    <section id="achievements" className="py-4 sm:py-6 lg:py-8 relative overflow-hidden bg-transparent text-[#1b281c] dark:text-white transition-colors duration-300 w-full">
      {/* Ambient Atmospheric Glows */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[640px] h-[640px] bg-[#738666]/18 dark:bg-white/[0.03] rounded-full blur-[140px]" />
        <div className="absolute -bottom-20 -left-20 w-[440px] h-[440px] bg-[#738666]/20 dark:bg-white/[0.02] border border-[#738666]/30 dark:border-white/[0.04] rounded-full blur-xl" />
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10 w-full">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-4 sm:mb-6">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-[#1b281c] dark:text-white font-display tracking-tight leading-none">
            Achievements & Awards
          </h2>
          <div className="w-20 sm:w-24 h-1.5 bg-[#738666] dark:bg-white/40 rounded-full mt-3 sm:mt-4" />
        </div>

        {/* 3D Circular Orbital Carousel */}
        <Orbital3DCarousel items={achievements} />
      </div>
    </section>
  );
};

