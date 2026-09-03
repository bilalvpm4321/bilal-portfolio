import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageBreakLoaderProps {
  onComplete?: () => void;
}

// Normalized coordinate vertices along the jagged creased line
const FRACTURE_PATH =
  'M 50 0 L 52.5 8 L 49.5 16 L 48 24 L 50.5 33 L 47.8 43 L 48.2 50 L 52 57 L 48.5 67 L 52.2 78 L 49 88 L 50 100';

// Precise clip-path polygons for the two splitting halves
const LEFT_CLIP =
  'polygon(0% 0%, 50% 0%, 52.5% 8%, 49.5% 16%, 48% 24%, 50.5% 33%, 47.8% 43%, 48.2% 50%, 52% 57%, 48.5% 67%, 52.2% 78%, 49% 88%, 50% 100%, 0% 100%)';

const RIGHT_CLIP =
  'polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%, 49% 88%, 52.2% 78%, 48.5% 67%, 52% 57%, 48.2% 50%, 47.8% 43%, 50.5% 33%, 48% 24%, 49.5% 16%, 52.5% 8%)';

// Reusable Circular Gauge matching the user's reference design
const CircularGauge: React.FC<{ progress: number }> = ({ progress }) => {
  return (
    <div className="relative w-36 h-36 flex items-center justify-center select-none pointer-events-none">
      {/* Subtle circular background mask for high contrast & legibility */}
      <div className="absolute inset-3 rounded-full bg-[#f4f2ee]/85 backdrop-blur-[2px] shadow-sm" />

      {/* SVG concentric dashed rotating rings */}
      <svg className="w-full h-full absolute inset-0 overflow-visible" viewBox="0 0 120 120">
        {/* Outer dashed ring - rotates clockwise */}
        <circle
          cx="60"
          cy="60"
          r="52"
          fill="none"
          stroke="#1e2022"
          strokeWidth="1.6"
          strokeDasharray="6 7"
          className="animate-spin-slow-cw origin-center"
        />

        {/* Inner dashed ring - rotates counter-clockwise */}
        <circle
          cx="60"
          cy="60"
          r="42"
          fill="none"
          stroke="#3d4248"
          strokeWidth="1.4"
          strokeDasharray="4 6"
          className="animate-spin-slow-ccw origin-center"
        />
      </svg>

      {/* Numerical percentage display */}
      <span className="relative z-10 text-3xl font-extrabold font-display text-[#111315] tracking-tight tabular-nums">
        {Math.round(progress)}%
      </span>
    </div>
  );
};

export const PageBreakLoader: React.FC<PageBreakLoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'drawing' | 'splitting' | 'done'>('drawing');
  const animFrameRef = useRef<number | null>(null);

  // Prevent background scrolling while loading
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Smooth drawing & counting animation loop (3 seconds)
  useEffect(() => {
    const duration = 3000; // Exactly 3 seconds
    const startTime = performance.now();


    const update = (now: number) => {
      const elapsed = now - startTime;
      const rawProgress = Math.min(elapsed / duration, 1);

      // Smooth progression allowing a natural, steady countdown from 0 to 100%
      const eased = rawProgress;

      const currentPercent = eased * 100;
      setProgress(currentPercent);

      if (rawProgress < 1) {
        animFrameRef.current = requestAnimationFrame(update);
      } else {
        setProgress(100);
        // Clean settle at 100% when line reaches bottom before the page breaks open
        setTimeout(() => {
          setPhase('splitting');

          // After split animation finishes, notify parent to reveal portfolio
          setTimeout(() => {
            setPhase('done');
            if (onComplete) onComplete();
          }, 1520);
        }, 120);
      }
    };

    animFrameRef.current = requestAnimationFrame(update);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [onComplete]);

  if (phase === 'done') return null;

  return (
    <div className="fixed inset-0 z-[99999] pointer-events-auto select-none overflow-hidden bg-[#f5f3ec]">
      {/* PHASE 1: DRAWING (0% -> 100%) */}
      {phase === 'drawing' && (
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: 'url(/paper-texture.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: '#f5f3ec',
          }}
        >
          {/* Subtle crumpled paper ambient vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/[0.04] via-transparent to-stone-900/[0.05] pointer-events-none" />

          {/* Progressive Jagged Fracture Line */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {/* Subtle diffuse shadow underneath line for paper crease depth */}
            <path
              d={FRACTURE_PATH}
              fill="none"
              stroke="rgba(0, 0, 0, 0.14)"
              strokeWidth="4"
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength="100"
              strokeDasharray="100"
              strokeDashoffset={Math.max(0, 100 - progress)}
            />

            {/* Crisp dark ink jagged line */}
            <path
              d={FRACTURE_PATH}
              fill="none"
              stroke="#1a1c1e"
              strokeWidth="2.5"
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength="100"
              strokeDasharray="100"
              strokeDashoffset={Math.max(0, 100 - progress)}
            />
          </svg>

          {/* Center Rotating Circular Gauge */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <CircularGauge progress={progress} />
          </div>
        </div>
      )}

      {/* PHASE 2: SPLITTING (100% -> OPENING TO 2 SIDES) */}
      {phase === 'splitting' && (
        <div className="relative w-full h-full">
          {/* LEFT FLAP - Slides to the Left */}
          <motion.div
            className="absolute inset-0 w-full h-full will-change-transform"
            style={{
              clipPath: LEFT_CLIP,
              WebkitClipPath: LEFT_CLIP,
              backgroundImage: 'url(/paper-texture.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: '#f5f3ec',
              filter: 'drop-shadow(12px 0 24px rgba(0, 0, 0, 0.35))',
            }}
            initial={{ x: 0, rotate: 0 }}
            animate={{ x: '-102%', rotate: -1.2 }}
            transition={{
              duration: 1.4,
              ease: [0.22, 1, 0.36, 1], // Silky smooth deceleration
            }}
          >
            {/* Dark torn edge border line on Left Flap */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path
                d={FRACTURE_PATH}
                fill="none"
                stroke="#1a1c1e"
                strokeWidth="3.2"
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* Left half of the Circular Gauge moving with Left Flap */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <CircularGauge progress={100} />
            </div>
          </motion.div>

          {/* RIGHT FLAP - Slides to the Right */}
          <motion.div
            className="absolute inset-0 w-full h-full will-change-transform"
            style={{
              clipPath: RIGHT_CLIP,
              WebkitClipPath: RIGHT_CLIP,
              backgroundImage: 'url(/paper-texture.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: '#f5f3ec',
              filter: 'drop-shadow(-14px 0 28px rgba(0, 0, 0, 0.28))',
            }}
            initial={{ x: 0, rotate: 0 }}
            animate={{ x: '102%', rotate: 1.2 }}
            transition={{
              duration: 1.4,
              ease: [0.22, 1, 0.36, 1], // Silky smooth deceleration
            }}
          >
            {/* Dark torn edge border line on Right Flap */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path
                d={FRACTURE_PATH}
                fill="none"
                stroke="#1a1c1e"
                strokeWidth="3.2"
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* Right half of the Circular Gauge (with 100%) moving with Right Flap */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <CircularGauge progress={100} />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
