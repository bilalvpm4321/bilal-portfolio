import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CurtainWindowLoaderProps {
  onComplete?: () => void;
}

export const CurtainWindowLoader: React.FC<CurtainWindowLoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'opening' | 'revealed' | 'done'>('loading');
  const animFrameRef = useRef<number | null>(null);

  // Prevent background scrolling while loading
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Smooth loading animation loop (2.8 seconds)
  useEffect(() => {
    const duration = 2800; // 2.8 seconds for smooth anticipation
    const startTime = performance.now();

    const update = (now: number) => {
      const elapsed = now - startTime;
      const rawProgress = Math.min(elapsed / duration, 1);
      
      // Gentle easeInOut progression
      const eased =
        rawProgress < 0.5
          ? 2 * rawProgress * rawProgress
          : 1 - Math.pow(-2 * rawProgress + 2, 2) / 2;

      const currentPercent = eased * 100;
      setProgress(currentPercent);

      if (rawProgress < 1) {
        animFrameRef.current = requestAnimationFrame(update);
      } else {
        setProgress(100);
        // Momentary settle at 100% before opening the curtains
        setTimeout(() => {
          handleOpen();
        }, 220);
      }
    };

    animFrameRef.current = requestAnimationFrame(update);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const handleOpen = () => {
    setPhase('opening');

    // Trigger scenery reveal
    setTimeout(() => {
      setPhase('revealed');
    }, 1200);

    // Complete transition and unmount loader
    setTimeout(() => {
      setPhase('done');
      if (onComplete) onComplete();
    }, 1900);
  };

  const handleSkip = () => {
    setProgress(100);
    handleOpen();
  };

  if (phase === 'done') return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] select-none overflow-hidden transition-opacity duration-700 ${
        phase === 'revealed' ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
      }`}
      style={{
        perspective: '1400px',
      }}
    >
      {/* =========================================================================
          WINDOW ARCHITECTURAL FRAME & CASING
          ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none z-40 border-[10px] sm:border-[18px] md:border-[26px] border-[#14120e] shadow-[inset_0_0_60px_rgba(0,0,0,0.85)]">
        {/* Outer wood/bronze molding bevel highlight */}
        <div className="absolute inset-0 border border-[#44382c]/40" />

        {/* Window Sill at the bottom */}
        <div className="absolute -bottom-1 left-0 right-0 h-4 md:h-6 bg-gradient-to-t from-[#0e0c0a] via-[#241c15] to-[#382d23] shadow-2xl border-t border-[#4d3d2e]/60" />
      </div>

      {/* =========================================================================
          CURTAIN ROD & METALLIC HARDWARE (Top)
          ========================================================================= */}
      <div className="absolute top-2 sm:top-4 md:top-6 left-2 sm:left-6 md:left-10 right-2 sm:right-6 md:right-10 z-50 pointer-events-none flex items-center justify-between">
        {/* Left Finial (Turned Antique Brass Acorn / Ball) */}
        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-[#ffe5a3] via-[#c8a869] to-[#684e20] shadow-[0_4px_12px_rgba(0,0,0,0.6)] border border-[#ffe5a3]/50 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-[#f8ebce]/70" />
        </div>

        {/* Main Curtain Rod */}
        <div className="relative flex-1 mx-[-3px] h-3 sm:h-4 rounded-full bg-gradient-to-b from-[#ffe5a3] via-[#c8a869] to-[#4e3a18] shadow-[0_6px_16px_rgba(0,0,0,0.7)] border-y border-[#ffeab5]/40 flex items-center justify-around px-4 sm:px-8">
          {/* Subtle hanging curtain rings */}
          {Array.from({ length: 18 }).map((_, i) => (
            <div
              key={i}
              className="w-3.5 h-6 sm:w-4 sm:h-8 rounded-full border-2 border-[#f0d48f]/90 bg-black/10 shadow-sm transform -translate-y-1"
            />
          ))}

          {/* Center Rod Bracket */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-4 sm:w-6 h-6 sm:h-8 bg-gradient-to-b from-[#d8b97a] via-[#8c6f37] to-[#4a3616] rounded shadow-md border-x border-[#ffeab5]/40" />
        </div>

        {/* Right Finial */}
        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-[#ffe5a3] via-[#c8a869] to-[#684e20] shadow-[0_4px_12px_rgba(0,0,0,0.6)] border border-[#ffe5a3]/50 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-[#f8ebce]/70" />
        </div>
      </div>

      {/* Top Valance / Pelmet Shadow */}
      <div className="absolute top-0 left-0 right-0 h-16 sm:h-20 bg-gradient-to-b from-black/80 via-black/40 to-transparent z-30 pointer-events-none" />

      {/* =========================================================================
          SUNBEAM & SCENERY LIGHT FILTERING (Behind Curtains)
          ========================================================================= */}
      {/* Warm volumetric morning sunshine blooming between the curtains */}
      <div
        className={`absolute inset-0 pointer-events-none z-10 transition-opacity duration-1000 ${
          phase === 'opening' ? 'opacity-100' : 'opacity-45'
        }`}
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(255, 235, 185, 0.45) 0%, rgba(245, 205, 130, 0.15) 45%, transparent 75%)',
        }}
      />

      {/* Center sunlight slit visible while curtains are closed */}
      {phase === 'loading' && (
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 sm:w-16 z-20 pointer-events-none flex items-center justify-center">
          <motion.div
            className="w-1.5 sm:w-2.5 h-full bg-gradient-to-b from-[#fff6d6] via-[#ffdf8f] to-[#ffe5a3] shadow-[0_0_24px_#ffdf8f,0_0_60px_#ffae42]"
            animate={{
              opacity: [0.65, 0.95, 0.65],
              scaleX: [1, 1.3, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 2.2,
              ease: 'easeInOut',
            }}
          />
        </div>
      )}

      {/* =========================================================================
          LEFT CURTAIN PANEL (Draws and pleats to the Left)
          ========================================================================= */}
      <motion.div
        className="absolute top-0 bottom-0 left-0 w-1/2 z-20 will-change-transform origin-left overflow-visible shadow-[15px_0_35px_rgba(0,0,0,0.65)]"
        initial={{ x: 0, scaleX: 1 }}
        animate={
          phase === 'loading'
            ? { x: 0, scaleX: 1 }
            : {
                x: '-84%',
                scaleX: 0.2,
                transition: {
                  duration: 1.55,
                  ease: [0.25, 1, 0.35, 1], // Natural curtain gathering deceleration
                },
              }
        }
      >
        {/* Realistic 3D Draped Pleats (Forest Velvet / Deep Sage Weave) */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundColor: '#1b2c1e',
            backgroundImage: `
              repeating-linear-gradient(
                90deg,
                #0d160f 0px,
                #18271a 14px,
                #29402e 32px,
                #3a5940 48px,
                #486b50 56px,
                #2b4330 68px,
                #142017 84px,
                #0a110b 96px
              )
            `,
            backgroundSize: '96px 100%',
          }}
        >
          {/* Subtle silk/velvet surface sheen */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/60 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/40 pointer-events-none" />

          {/* Vertical fabric fold depth shadows */}
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#fff 0.75px, transparent 0.75px)',
              backgroundSize: '8px 8px',
            }}
          />

          {/* Bottom Hem & Weighted Trim */}
          <div className="absolute bottom-0 left-0 right-0 h-6 sm:h-8 bg-gradient-to-t from-black/70 to-transparent border-b-4 border-[#c8a869]/60 flex items-center justify-around px-2">
            {Array.from({ length: 14 }).map((_, idx) => (
              <div
                key={idx}
                className="w-2.5 h-3 sm:w-3 sm:h-4 rounded-b-full bg-[#162418] border-b border-[#c8a869]/40 shadow-sm"
              />
            ))}
          </div>

          {/* Right Edge Overlap with Center Seam Trim */}
          <div className="absolute top-0 bottom-0 right-0 w-3 bg-gradient-to-l from-[#c8a869]/40 via-[#0a110b] to-transparent shadow-lg" />
        </div>

        {/* Left Curtain Tieback (Appears when curtains gather) */}
        <motion.div
          className="absolute top-1/2 left-3 sm:left-4 -translate-y-1/2 pointer-events-none z-30"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={
            phase === 'loading'
              ? { opacity: 0, scale: 0.6 }
              : {
                  opacity: 1,
                  scale: 1,
                  transition: { delay: 0.45, duration: 0.7 },
                }
          }
        >
          <div className="w-8 sm:w-10 h-24 sm:h-28 border-r-4 border-y-2 border-[#d8b97a] rounded-r-3xl bg-[#c8a869]/25 shadow-xl flex items-center justify-end pr-1">
            <div className="w-2.5 sm:w-3 h-8 sm:h-10 bg-gradient-to-b from-[#ffe5a3] via-[#b6924b] to-[#6e5425] rounded-full shadow-md" />
          </div>
        </motion.div>
      </motion.div>

      {/* =========================================================================
          RIGHT CURTAIN PANEL (Draws and pleats to the Right)
          ========================================================================= */}
      <motion.div
        className="absolute top-0 bottom-0 right-0 w-1/2 z-20 will-change-transform origin-right overflow-visible shadow-[-15px_0_35px_rgba(0,0,0,0.65)]"
        initial={{ x: 0, scaleX: 1 }}
        animate={
          phase === 'loading'
            ? { x: 0, scaleX: 1 }
            : {
                x: '84%',
                scaleX: 0.2,
                transition: {
                  duration: 1.55,
                  ease: [0.25, 1, 0.35, 1],
                },
              }
        }
      >
        {/* Realistic 3D Draped Pleats (Mirrored) */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundColor: '#1b2c1e',
            backgroundImage: `
              repeating-linear-gradient(
                90deg,
                #0a110b 0px,
                #142017 12px,
                #2b4330 28px,
                #486b50 40px,
                #3a5940 48px,
                #29402e 64px,
                #18271a 82px,
                #0d160f 96px
              )
            `,
            backgroundSize: '96px 100%',
          }}
        >
          {/* Subtle silk/velvet surface sheen */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/60 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-l from-black/50 via-transparent to-black/40 pointer-events-none" />

          {/* Vertical fabric fold depth shadows */}
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#fff 0.75px, transparent 0.75px)',
              backgroundSize: '8px 8px',
            }}
          />

          {/* Bottom Hem & Weighted Trim */}
          <div className="absolute bottom-0 left-0 right-0 h-6 sm:h-8 bg-gradient-to-t from-black/70 to-transparent border-b-4 border-[#c8a869]/60 flex items-center justify-around px-2">
            {Array.from({ length: 14 }).map((_, idx) => (
              <div
                key={idx}
                className="w-2.5 h-3 sm:w-3 sm:h-4 rounded-b-full bg-[#162418] border-b border-[#c8a869]/40 shadow-sm"
              />
            ))}
          </div>

          {/* Left Edge Overlap with Center Seam Trim */}
          <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-[#c8a869]/40 via-[#0a110b] to-transparent shadow-lg" />
        </div>

        {/* Right Curtain Tieback (Appears when curtains gather) */}
        <motion.div
          className="absolute top-1/2 right-3 sm:right-4 -translate-y-1/2 pointer-events-none z-30"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={
            phase === 'loading'
              ? { opacity: 0, scale: 0.6 }
              : {
                  opacity: 1,
                  scale: 1,
                  transition: { delay: 0.45, duration: 0.7 },
                }
          }
        >
          <div className="w-8 sm:w-10 h-24 sm:h-28 border-l-4 border-y-2 border-[#d8b97a] rounded-l-3xl bg-[#c8a869]/25 shadow-xl flex items-center justify-start pl-1">
            <div className="w-2.5 sm:w-3 h-8 sm:h-10 bg-gradient-to-b from-[#ffe5a3] via-[#b6924b] to-[#6e5425] rounded-full shadow-md" />
          </div>
        </motion.div>
      </motion.div>

      {/* =========================================================================
          CENTER EMBLEM & LOADING VIEWPORT BADGE
          ========================================================================= */}
      <AnimatePresence>
        {phase === 'loading' && (
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center justify-center text-center px-4 pointer-events-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{
              opacity: 0,
              scale: 1.08,
              filter: 'blur(8px)',
              transition: { duration: 0.4, ease: 'easeIn' },
            }}
          >
            {/* Elegant Brass & Frosted Glass Plaque */}
            <div className="relative p-6 sm:p-8 md:p-9 rounded-3xl bg-[#121a14]/90 backdrop-blur-md border border-[#c8a869]/40 shadow-[0_20px_50px_rgba(0,0,0,0.7),0_0_30px_rgba(200,168,105,0.2)] max-w-[340px] sm:max-w-md flex flex-col items-center">
              {/* Corner brass accents */}
              <div className="absolute top-2.5 left-2.5 w-3 h-3 border-t-2 border-l-2 border-[#d8b97a]" />
              <div className="absolute top-2.5 right-2.5 w-3 h-3 border-t-2 border-r-2 border-[#d8b97a]" />
              <div className="absolute bottom-2.5 left-2.5 w-3 h-3 border-b-2 border-l-2 border-[#d8b97a]" />
              <div className="absolute bottom-2.5 right-2.5 w-3 h-3 border-b-2 border-r-2 border-[#d8b97a]" />

              {/* Tag / Header */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c8a869]/15 border border-[#c8a869]/30 text-[#d8b97a] text-[10px] sm:text-[11px] font-mono tracking-widest uppercase mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c8a869] animate-pulse" />
                WINDOW TO PORTFOLIO
              </div>

              {/* Circular Brass Gauge with Rotating Rings */}
              <div className="relative w-28 h-28 sm:w-34 sm:h-34 flex items-center justify-center my-1 select-none">
                {/* Golden ambient halo */}
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-[#c8a869]/20 to-transparent blur-md" />

                {/* SVG Concentric Dashed Brass Rings */}
                <svg className="w-full h-full absolute inset-0 overflow-visible" viewBox="0 0 120 120">
                  {/* Outer glowing track */}
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke="#3a2f1b"
                    strokeWidth="2"
                    opacity="0.6"
                  />
                  {/* Outer animated dashed ring (Clockwise) */}
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke="#c8a869"
                    strokeWidth="2"
                    strokeDasharray="6 7"
                    className="animate-spin-slow-cw origin-center"
                  />
                  {/* Inner counter-rotating ring */}
                  <circle
                    cx="60"
                    cy="60"
                    r="43"
                    fill="none"
                    stroke="#d8b97a"
                    strokeWidth="1.5"
                    strokeDasharray="4 6"
                    className="animate-spin-slow-ccw origin-center"
                  />
                </svg>

                {/* Percentage Display */}
                <div className="relative z-10 flex flex-col items-center">
                  <span className="text-3xl sm:text-4xl font-extrabold font-display text-[#f5ebd7] tracking-tight tabular-nums drop-shadow-md">
                    {Math.round(progress)}%
                  </span>
                  <span className="text-[10px] font-mono text-[#c8a869] uppercase tracking-wider mt-0.5">
                    LOADED
                  </span>
                </div>
              </div>

              {/* Caption */}
              <h2 className="text-base sm:text-xl font-display font-medium text-[#f5ebd7] tracking-tight mt-2">
                Bilal's Portfolio
              </h2>
              <p className="text-[11px] sm:text-xs text-[#d8b97a]/90 mt-1 text-center max-w-[280px] font-sans flex items-center justify-center gap-1">
                <span>Wait a minute, preparing something special</span>
                <span className="inline-flex tracking-widest animate-pulse">...</span>
              </p>

              {/* Skip / Enter Now Button */}
              <button
                type="button"
                onClick={handleSkip}
                className="mt-4 px-4 py-1 rounded-full text-xs font-mono text-[#d8b97a] hover:text-[#fbf5e6] bg-[#233527]/70 hover:bg-[#233527] border border-[#c8a869]/40 hover:border-[#c8a869] transition-all duration-200 cursor-pointer shadow-sm active:scale-95 flex items-center gap-1.5"
              >
                <span>Enter Now</span>
                <span className="text-[10px]">&rarr;</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          SUNLIGHT BURST / LENS FLARE (Expands when curtains split open)
          ========================================================================= */}
      {phase === 'opening' && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-30"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: [0, 0.75, 0],
            scale: [0.95, 1.05, 1.1],
          }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(255, 248, 220, 0.85) 0%, rgba(245, 215, 140, 0.45) 35%, transparent 70%)',
          }}
        />
      )}
    </div>
  );
};
