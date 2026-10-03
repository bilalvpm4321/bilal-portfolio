import React from 'react';
import { AutoRotatingSkillsCard } from './AutoRotatingSkillsCard';

export const SkillsSection: React.FC = () => {
  return (
    <section id="skills" className="py-8 sm:py-12 lg:py-16 relative overflow-hidden bg-white dark:bg-[#08080a] text-[#1b281c] dark:text-white transition-colors duration-300 w-full">
      {/* Ambient Atmospheric Glows */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-28 -right-36 w-[680px] h-[680px] bg-[#738666]/16 dark:bg-white/[0.03] rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -left-24 w-[480px] h-[480px] bg-[#738666]/20 dark:bg-white/[0.02] border border-[#738666]/30 dark:border-white/[0.04] rounded-full blur-xl" />
        <div className="absolute bottom-12 right-10 w-[320px] h-[320px] bg-[#738666]/22 dark:bg-white/[0.02] rounded-full blur-[80px]" />
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10 w-full">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6 sm:mb-10">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-[#1b281c] dark:text-white font-display tracking-tight leading-none">
            Skills & Stack
          </h2>
          <div className="w-20 sm:w-24 h-1.5 bg-[#738666] dark:bg-white/40 rounded-full mt-4" />
        </div>

        {/* Auto-Rotating Unified Multi-Area Skills Card */}
        <AutoRotatingSkillsCard />
      </div>
    </section>
  );
};
