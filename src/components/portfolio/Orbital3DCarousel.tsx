import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, Calendar, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface AchievementItem {
  id: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  date_or_year?: string | null;
  badge?: string | null;
  image_url?: string | null;
  credential_url?: string | null;
}

interface Orbital3DCarouselProps {
  items: AchievementItem[];
}

export const Orbital3DCarousel: React.FC<Orbital3DCarouselProps> = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const total = items.length;

  // Responsive breakpoint check
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNext = useCallback(() => {
    if (total === 0) return;
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    if (total === 0) return;
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  const handleCardHover = useCallback((targetIndex: number) => {
    if (targetIndex !== activeIndex) {
      setActiveIndex(targetIndex);
    }
  }, [activeIndex]);

  // Compute 3D orbital ring transform styles for a given offset from active card
  const getCardTransformStyle = (index: number) => {
    // Calculate circular shortest distance offset
    let diff = (index - activeIndex) % total;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    const absDiff = Math.abs(diff);

    // Orbital angle step along the 3D circular ring (in degrees)
    const angleStepDeg = isMobile ? 50 : 58;
    const thetaDeg = diff * angleStepDeg;
    const thetaRad = (thetaDeg * Math.PI) / 180;

    // 3D Orbital Radius
    const radiusX = isMobile ? 185 : 285;
    const radiusZ = isMobile ? 135 : 195;

    // Trigonometric 3D ring positioning: X = R*sin(theta), Z = R*(cos(theta)-1)
    let translateX = Math.sin(thetaRad) * radiusX;
    let translateZ = diff === 0 ? 35 : (Math.cos(thetaRad) - 1) * radiusZ - absDiff * 15;
    let rotateY = -thetaDeg * 0.72; // Card faces front viewer while sitting on ring arc
    let scale = diff === 0 ? 1.05 : Math.max(0.68, 1 - absDiff * 0.16);
    let opacity = 1;
    let zIndex = diff === 0 ? 100 : Math.round(50 + Math.cos(thetaRad) * 40);
    let pointerEvents: 'auto' | 'none' = 'auto';

    if (absDiff > 2) {
      opacity = 0;
      pointerEvents = 'none';
      zIndex = 0;
    } else if (absDiff === 2) {
      opacity = 0.45;
    } else if (absDiff === 1) {
      opacity = 0.85;
    } else {
      opacity = 1;
    }

    return {
      transform: `translateX(${translateX.toFixed(2)}px) translateZ(${translateZ.toFixed(2)}px) rotateY(${rotateY.toFixed(2)}deg) scale(${scale.toFixed(2)})`,
      opacity,
      zIndex,
      pointerEvents,
      transition: 'transform 600ms cubic-bezier(0.22, 1, 0.36, 1), opacity 500ms ease, box-shadow 500ms ease',
    };
  };

  const activeItem = items[activeIndex];

  return (
    <div className="w-full relative flex flex-col items-center py-6 select-none">
      {/* 3D Orbit Stage Container */}
      <div
        className="w-full relative h-[400px] sm:h-[470px] flex items-center justify-center overflow-hidden group"
        style={{
          perspective: '1000px',
          perspectiveOrigin: '50% 50%',
        }}
      >
        {/* Left Side Card Hover Target Zone */}
        <div
          onClick={handlePrev}
          onMouseEnter={handlePrev}
          title="View Previous Achievement"
          className="absolute left-0 top-0 bottom-0 w-1/4 sm:w-1/3 z-30 cursor-pointer"
        />

        {/* Right Side Card Hover Target Zone */}
        <div
          onClick={handleNext}
          onMouseEnter={handleNext}
          title="View Next Achievement"
          className="absolute right-0 top-0 bottom-0 w-1/4 sm:w-1/3 z-30 cursor-pointer"
        />

        <div
          className="relative w-full h-full flex items-center justify-center"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {items.map((item, index) => {
            const isActive = index === activeIndex;
            const cardStyle = getCardTransformStyle(index);

            return (
              <div
                key={item.id}
                onClick={() => setActiveIndex(index)}
                onMouseEnter={() => handleCardHover(index)}
                style={cardStyle}
                className={`absolute w-[245px] sm:w-[300px] h-[340px] sm:h-[410px] rounded-3xl p-5 sm:p-7 flex flex-col justify-between cursor-pointer text-left transition-all duration-500 ${
                  isActive
                    ? 'bg-white border-2 border-[#c8a869] shadow-[0_25px_60px_rgba(200,168,105,0.3)]'
                    : 'bg-[#f9faf7] border border-[#738666]/20 hover:border-[#738666]/50 shadow-xl'
                }`}
              >
                {/* Top Row: Trophy Icon Badge + Honor Badge */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <div className={`p-3 rounded-2xl border transition-all ${
                      isActive
                        ? 'bg-[#738666] text-white border-[#738666] scale-105'
                        : 'bg-[#c8a869]/15 text-[#8d6d2b] border-[#c8a869]/30'
                    }`}>
                      <Trophy className="w-6 h-6" />
                    </div>

                    {item.badge && (
                      <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#c8a869]/15 text-[#8d6d2b] border border-[#c8a869]/30 font-mono">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-xl font-extrabold text-[#1b281c] mb-1 font-display leading-snug">
                    {item.title}
                  </h3>

                  {/* Subtitle / Issuer */}
                  {item.subtitle && (
                    <p className="text-xs font-semibold text-[#738666] mb-2.5">
                      {item.subtitle}
                    </p>
                  )}

                  {/* Description Narrative - Full text on active, line-clamp on side cards */}
                  {item.description && (
                    <p className={`text-xs sm:text-sm text-[#4a5d46] leading-relaxed ${
                      isActive ? 'line-clamp-none' : 'line-clamp-3'
                    }`}>
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Bottom Row: Date / Year Tag */}
                {item.date_or_year && (
                  <div className="flex items-center gap-2 text-xs font-mono font-medium text-[#556950] pt-3 border-t border-[#738666]/15 shrink-0">
                    <Calendar className="w-3.5 h-3.5 text-[#c8a869]" />
                    <span>{item.date_or_year}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Optional Verified Credential Link */}
      {activeItem.credential_url && (
        <div className="mt-3 text-center">
          <a
            href={activeItem.credential_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#738666] hover:text-[#1b281c] transition-colors"
          >
            <span>View Verified Credential</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* Dash Pagination Indicators - Strictly CLICK ONLY (hover removed per request) */}
      <div className="mt-8 flex items-center justify-center gap-2 px-2 py-2 z-20">
        {items.map((_, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
                isActive
                  ? 'w-7 bg-[#1b281c]'
                  : 'w-2.5 bg-[#738666]/30 hover:bg-[#738666]/70'
              }`}
            />
          );
        })}
      </div>
    </div>
  );

};

