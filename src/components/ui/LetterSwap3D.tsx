import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export interface LetterSwap3DProps {
  label: string;
  secondaryLabel?: string;
  className?: string;
  frontClassName?: string;
  backClassName?: string;
  staggerDuration?: number;
  duration?: number;
  reverse?: boolean;
  animateInView?: boolean;
  inViewDelay?: number;
  inViewOnce?: boolean;
  onClick?: () => void;
}

export const LetterSwap3D: React.FC<LetterSwap3DProps> = ({
  label,
  secondaryLabel,
  className = '',
  frontClassName = '',
  backClassName = '',
  staggerDuration = 0.025,
  duration = 0.42,
  reverse = false,
  animateInView = true,
  inViewDelay = 1000,
  inViewOnce = false,
  onClick,
}) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(containerRef, {
    amount: 0.4,
    once: inViewOnce,
  });

  const [isHovered, setIsHovered] = useState(false);
  const [isAutoFlipping, setIsAutoFlipping] = useState(false);

  // Auto-flip effect when scrolling and reaching the section after 1-second delay
  useEffect(() => {
    let startTimer: ReturnType<typeof setTimeout>;
    let endTimer: ReturnType<typeof setTimeout>;

    if (animateInView && isInView) {
      // Wait for specified delay (1s) before triggering the 3D swap wave
      startTimer = setTimeout(() => {
        setIsAutoFlipping(true);
        endTimer = setTimeout(() => {
          setIsAutoFlipping(false);
        }, 1100);
      }, inViewDelay);

      return () => {
        clearTimeout(startTimer);
        clearTimeout(endTimer);
      };
    } else if (!inViewOnce && !isInView) {
      setIsAutoFlipping(false);
    }
  }, [isInView, animateInView, inViewOnce, inViewDelay]);

  const active = isHovered || isAutoFlipping;

  // Split into words first to prevent mid-word wrapping
  const words = label.split(' ');
  const secondaryWords = (secondaryLabel || label).split(' ');

  return (
    <span
      ref={containerRef}
      className={`inline-flex flex-wrap items-center justify-center gap-x-[0.28em] cursor-pointer select-none font-display font-extrabold tracking-tight ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      style={{ perspective: '1200px' }}
    >
      {words.map((word, wordIdx) => {
        const secWord = secondaryWords[wordIdx] || word;
        const chars = word.split('');
        const secChars = secWord.split('');
        const maxLen = Math.max(chars.length, secChars.length);

        // Compute cumulative character offset for continuous smooth stagger across whole sentence
        let charOffset = 0;
        for (let w = 0; w < wordIdx; w++) {
          charOffset += words[w].length;
        }

        return (
          <span key={wordIdx} className="inline-flex whitespace-nowrap">
            {Array.from({ length: maxLen }).map((_, charIdx) => {
              const char1 = chars[charIdx] || '';
              const char2 = secChars[charIdx] || char1;
              const globalIdx = charOffset + charIdx;
              const totalChars = label.replace(/\s+/g, '').length;

              const delay = reverse
                ? (totalChars - 1 - globalIdx) * staggerDuration
                : globalIdx * staggerDuration;

              return (
                <span
                  key={charIdx}
                  className="relative inline-block overflow-hidden"
                  style={{
                    perspective: '800px',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Primary Character (Front Face) */}
                  <motion.span
                    className={`inline-block ${frontClassName}`}
                    initial={false}
                    animate={{
                      rotateX: active ? (reverse ? 90 : -90) : 0,
                      y: active ? (reverse ? '100%' : '-100%') : '0%',
                      opacity: active ? 0 : 1,
                    }}
                    transition={{
                      duration,
                      delay,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{
                      transformOrigin: '50% 50% -0.5em',
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                    }}
                  >
                    {char1}
                  </motion.span>

                  {/* Secondary Character (Back/Bottom Face) */}
                  <motion.span
                    className={`absolute inset-0 inline-block ${backClassName || frontClassName}`}
                    initial={false}
                    animate={{
                      rotateX: active ? 0 : (reverse ? -90 : 90),
                      y: active ? '0%' : (reverse ? '-100%' : '100%'),
                      opacity: active ? 1 : 0,
                    }}
                    transition={{
                      duration,
                      delay,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{
                      transformOrigin: '50% 50% -0.5em',
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                    }}
                    aria-hidden="true"
                  >
                    {char2}
                  </motion.span>
                </span>
              );
            })}
          </span>
        );
      })}
    </span>
  );
};

export default LetterSwap3D;
