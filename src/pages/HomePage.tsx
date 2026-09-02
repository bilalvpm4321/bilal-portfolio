import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { HeroSection } from '../components/portfolio/HeroSection';
import { AboutSection } from '../components/portfolio/AboutSection';
import { ProjectsSection } from '../components/portfolio/ProjectsSection';
import { ExperienceSection } from '../components/portfolio/ExperienceSection';
import { EducationSection } from '../components/portfolio/EducationSection';
import { AchievementsSection } from '../components/portfolio/AchievementsSection';
import { LeadershipSection } from '../components/portfolio/LeadershipSection';
import { ContactSection } from '../components/portfolio/ContactSection';
import { Footer } from '../components/layout/Footer';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-[#1b281c] selection:bg-[#738666]/25 selection:text-[#1b281c]">
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
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
