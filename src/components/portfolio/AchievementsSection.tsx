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
    <section id="achievements" className="py-20 sm:py-24 relative overflow-hidden bg-white text-[#1b281c]">
      {/* Ambient Olive Green Circles of Varied Sizes (Filled with Olive Green) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top-Center Stage Glow Circle (540px) */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[540px] h-[540px] bg-[#738666]/18 rounded-full blur-[120px]" />
        {/* Bottom-Left Outer Filled Circle (380px) */}
        <div className="absolute -bottom-20 -left-20 w-[380px] h-[380px] bg-[#738666]/20 border border-[#738666]/30 rounded-full blur-xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10 sm:mb-14">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-[#1b281c] font-display tracking-tight leading-none">
            Achievements & Awards
          </h2>
          <div className="w-20 sm:w-24 h-1.5 bg-[#738666] rounded-full mt-4" />
        </div>


        {/* 3D Circular Orbital Carousel */}
        <Orbital3DCarousel items={achievements} />
      </div>
    </section>
  );
};

