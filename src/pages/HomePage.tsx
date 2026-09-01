import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { HeroSection } from '../components/portfolio/HeroSection';
import { AboutSection } from '../components/portfolio/AboutSection';
import { SkillsSection } from '../components/portfolio/SkillsSection';
import { ProjectsSection } from '../components/portfolio/ProjectsSection';
import { ExperienceSection } from '../components/portfolio/ExperienceSection';
import { EducationSection } from '../components/portfolio/EducationSection';
import { AchievementsSection } from '../components/portfolio/AchievementsSection';
import { LeadershipSection } from '../components/portfolio/LeadershipSection';
import { ContactSection } from '../components/portfolio/ContactSection';
import { Footer } from '../components/layout/Footer';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#08090d] text-gray-100 selection:bg-sky-500/30 selection:text-sky-200">
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <ExperienceSection />
        <EducationSection />
        <AchievementsSection />
        <LeadershipSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};
