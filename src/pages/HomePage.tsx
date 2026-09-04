import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../components/layout/Navbar';
import { HeroSection } from '../components/portfolio/HeroSection';
import { AboutSection } from '../components/portfolio/AboutSection';
import { ProjectsSection } from '../components/portfolio/ProjectsSection';
import { ExperienceSection } from '../components/portfolio/ExperienceSection';
import { EducationSection } from '../components/portfolio/EducationSection';
import { AchievementsSection } from '../components/portfolio/AchievementsSection';
import { CertificatesSection } from '../components/portfolio/CertificatesSection';
import { LeadershipSection } from '../components/portfolio/LeadershipSection';
import { ContactSection } from '../components/portfolio/ContactSection';
import { Footer } from '../components/layout/Footer';
import { PageBreakLoader } from '../components/portfolio/PageBreakLoader';
import { ScrollStackContainer, ScrollStackItem } from '../components/portfolio/ScrollStack';

export const HomePage: React.FC = () => {
  const [showLoader, setShowLoader] = useState(true);

  return (
    <>
      {showLoader && (
        <PageBreakLoader onComplete={() => setShowLoader(false)} />
      )}

      <motion.div
        className="min-h-screen bg-[#f7f8f4] text-[#1b281c] selection:bg-[#738666]/25 selection:text-[#1b281c]"
        initial={{ opacity: 0.85, scale: 0.985 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <Navbar />
        
        <main>
          {/* Cover Hero Section */}
          <HeroSection />

          {/* Pinned Card Scroll Deck */}
          <ScrollStackContainer>
            <ScrollStackItem id="about" index={0} totalCards={8}>
              <AboutSection />
            </ScrollStackItem>

            <ScrollStackItem id="projects" index={1} totalCards={8}>
              <ProjectsSection />
            </ScrollStackItem>

            <ScrollStackItem id="experience" index={2} totalCards={8}>
              <ExperienceSection />
            </ScrollStackItem>

            <ScrollStackItem id="education" index={3} totalCards={8}>
              <EducationSection />
            </ScrollStackItem>

            <ScrollStackItem id="achievements" index={4} totalCards={8}>
              <AchievementsSection />
            </ScrollStackItem>

            <ScrollStackItem id="certificates" index={5} totalCards={8}>
              <CertificatesSection />
            </ScrollStackItem>

            <ScrollStackItem id="leadership" index={6} totalCards={8}>
              <LeadershipSection />
            </ScrollStackItem>

            <ScrollStackItem id="contact" index={7} totalCards={8}>
              <ContactSection />
            </ScrollStackItem>
          </ScrollStackContainer>
        </main>
        
        <Footer />
      </motion.div>
    </>
  );
};
