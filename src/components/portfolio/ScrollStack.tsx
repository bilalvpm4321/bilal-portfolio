import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ScrollStackItemProps {
  children: React.ReactNode;
  index: number;
  totalCards: number;
  id?: string;
  className?: string;
}

export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({
  children,
  index,
  totalCards,
  id,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll tracking to trigger scaling and dimming as lower cards slide over this card
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Calculate dynamic sticky top position for stacked deck effect
  // Top navbar height is ~72px, so topOffset starts at 80px
  const topOffset = 80 + index * 8;
  const zIndex = (index + 1) * 10;

  // Scale down slightly (from 1.0 down to ~0.93) as cards stack over it
  const scale = useTransform(
    scrollYProgress,
    [0.4, 0.9],
    [1, Math.max(0.88, 0.96 - (totalCards - index) * 0.012)]
  );

  // Soft dimming to enhance 3D depth as card recedes into the background stack
  const opacity = useTransform(scrollYProgress, [0.45, 0.95], [1, 0.72]);

  return (
    <div
      ref={containerRef}
      id={id}
      className="relative mb-6 sm:mb-8 last:mb-0 w-full"
      style={{ zIndex }}
    >
      <motion.div
        className={`sticky min-h-[82vh] lg:min-h-[86vh] flex flex-col justify-center rounded-[32px] sm:rounded-[44px] lg:rounded-[52px] border border-[#738666]/20 dark:border-white/[0.08] bg-white dark:bg-[#08080a] shadow-2xl shadow-[#1b281c]/[0.08] dark:shadow-black/95 overflow-hidden will-change-transform transition-colors duration-300 ${className}`}
        style={{
          top: `${topOffset}px`,
          scale,
          opacity,
          transformOrigin: 'top center',
        }}
      >
        {/* Card Ambient Top Highlight Edge */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#738666]/30 dark:via-white/20 to-transparent pointer-events-none z-30" />
        
        {children}
      </motion.div>
    </div>
  );
};

export const ScrollStackContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="relative w-full max-w-[1840px] mx-auto px-1.5 sm:px-3 lg:px-4 pt-2 pb-16">{children}</div>;
};
