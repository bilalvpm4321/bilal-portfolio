import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';
import { PaperCrumple } from '../ui/PaperCrumple';

export const AboutSection: React.FC = () => {
  const { data } = usePortfolio();
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Desktop image (from Admin profile or fallback)
  const desktopImageSrc =
    data.profile?.about_image_url ||
    data.siteSettings?.about?.image_url ||
    '/assets/aged-green-profile.png';

  // Mobile image (from Admin profile or fallback to desktop image)
  const mobileImageSrc =
    data.profile?.about_mobile_image_url ||
    data.siteSettings?.about?.mobile_image_url ||
    desktopImageSrc;

  // Active image based on screen size
  const activeImageSrc = isMobile ? mobileImageSrc : desktopImageSrc;

  return (
    <section
      id="about"
      className="py-12 sm:py-16 lg:py-20 relative overflow-hidden bg-transparent text-[#1b281c] dark:text-white transition-colors duration-300 w-full"
    >
      {/* Ambient Atmospheric Lighting */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[760px] h-[760px] bg-[#738666]/16 dark:bg-white/[0.03] rounded-full blur-[150px]" />
        <div className="absolute -bottom-32 -left-32 w-[720px] h-[720px] bg-[#738666]/14 dark:bg-white/[0.02] rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[640px] bg-[#738666]/10 dark:bg-white/[0.02] rounded-full blur-[140px]" />
      </div>

      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#1b281c] dark:text-white font-display tracking-tight leading-tight">
            About Me
          </h2>
          <div className="w-20 sm:w-24 h-1.5 bg-[#738666] dark:bg-white/40 rounded-full mt-3.5" />
        </div>

        {/* Master Pure & Box-Free Interactive Paper Showcase (Increased Scale & Mobile Responsive) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[1500px] mx-auto flex items-center justify-center"
        >
          <PaperCrumple
            key={`${isMobile ? 'mobile' : 'desktop'}-${activeImageSrc}`}
            src={activeImageSrc}
            alt="Bilal Ahamed About Me"
            width={isMobile ? 380 : 1360}
            height={isMobile ? 540 : 765}
            sceneHeight={isMobile ? 580 : 860}
            imageFit="cover"
            releaseBehavior="restore"
            crumpleAmount={0.88}
            crumpleDuration={0.55}
            releaseDuration={0.45}
            foldCount={8}
            foldSharpness={0.65}
            wrinkleDepth={0.72}
            creaseStrength={0.22}
            paperColor="#e8ece4"
            paperTexture={0.07}
            draggable={true}
            returnToOrigin={true}
            rotation={isMobile ? 0 : -0.6}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
