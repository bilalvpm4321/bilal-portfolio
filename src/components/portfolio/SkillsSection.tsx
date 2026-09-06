import React from 'react';
import { AutoRotatingSkillsCard } from './AutoRotatingSkillsCard';

export const SkillsSection: React.FC = () => {
  return (
    <section id="skills" className="py-24 relative overflow-hidden bg-white text-[#1b281c]">
      {/* Ambient Olive Green Circles matching Experience and Contact sections */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-28 -right-36 w-[600px] h-[600px] bg-[#738666]/16 rounded-full blur-[130px]" />
        <div className="absolute top-1/3 -left-24 w-[400px] h-[400px] bg-[#738666]/20 border border-[#738666]/30 rounded-full animate-pulse blur-xl" />
        <div className="absolute bottom-12 right-10 w-[260px] h-[260px] bg-[#738666]/22 rounded-full blur-[70px]" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header matching Work Experience and other section cards */}
        <div className="flex flex-col items-center text-center mb-14">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-[#1b281c] font-display tracking-tight leading-none">
            Skills & Stack
          </h2>
          <div className="w-20 sm:w-24 h-1.5 bg-[#738666] rounded-full mt-4" />
        </div>

        {/* Auto-Rotating Unified Multi-Area Skills Card */}
        <AutoRotatingSkillsCard />
      </div>
    </section>
  );
};
