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
      className="relative mb-12 sm:mb-20 last:mb-0 w-full"
      style={{ zIndex }}
    >
      <motion.div
        className={`sticky rounded-[32px] sm:rounded-[40px] border border-[#738666]/20 bg-white shadow-2xl shadow-[#1b281c]/[0.08] overflow-hidden will-change-transform ${className}`}
        style={{
          top: `${topOffset}px`,
          scale,
          opacity,
          transformOrigin: 'top center',
        }}
      >
        {/* Card Ambient Top Highlight Edge */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#738666]/30 to-transparent pointer-events-none z-30" />
        
        {children}
      </motion.div>
    </div>
  );
};

export const ScrollStackContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="relative w-full max-w-[1360px] mx-auto px-3 sm:px-6 lg:px-8 pt-4 pb-16">{children}</div>;
};
