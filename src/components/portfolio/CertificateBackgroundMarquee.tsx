import React from 'react';
import './CertificateBackgroundMarquee.css';

interface CertificateBackgroundMarqueeProps {
  className?: string;
  opacity?: string;
}

export const CertificateBackgroundMarquee: React.FC<CertificateBackgroundMarqueeProps> = ({
  className = '',
  opacity = 'opacity-[0.038]',
}) => {
  // Pure seamless repeating "CERTIFICATE • CERTIFICATE • " streams
  const patternA = Array(20).fill('CERTIFICATE • ').join('');
  const patternB = Array(20).fill('CERTIFICATE · ').join('');
  const patternC = Array(20).fill('CERTIFICATE ✦ ').join('');

  // Clean parallel diagonal rows — evenly spaced with ZERO overlaps
  const rows = [
    { text: patternA, direction: 'left', speed: 'cert-marquee-speed-slow', size: 'text-5xl sm:text-6xl lg:text-7xl' },
    { text: patternB, direction: 'right', speed: 'cert-marquee-speed-mid', size: 'text-4xl sm:text-5xl lg:text-6xl' },
    { text: patternC, direction: 'left', speed: 'cert-marquee-speed-fast', size: 'text-5xl sm:text-6xl lg:text-7xl' },
    { text: patternA, direction: 'right', speed: 'cert-marquee-speed-slow', size: 'text-5xl sm:text-6xl lg:text-7xl' },
    { text: patternB, direction: 'left', speed: 'cert-marquee-speed-mid', size: 'text-4xl sm:text-5xl lg:text-6xl' },
    { text: patternC, direction: 'right', speed: 'cert-marquee-speed-fast', size: 'text-5xl sm:text-6xl lg:text-7xl' },
    { text: patternA, direction: 'left', speed: 'cert-marquee-speed-mid', size: 'text-5xl sm:text-6xl lg:text-7xl' },
    { text: patternB, direction: 'right', speed: 'cert-marquee-speed-slow', size: 'text-4xl sm:text-5xl lg:text-6xl' },
    { text: patternC, direction: 'left', speed: 'cert-marquee-speed-fast', size: 'text-5xl sm:text-6xl lg:text-7xl' },
    { text: patternA, direction: 'right', speed: 'cert-marquee-speed-mid', size: 'text-5xl sm:text-6xl lg:text-7xl' },
    { text: patternB, direction: 'left', speed: 'cert-marquee-speed-slow', size: 'text-4xl sm:text-5xl lg:text-6xl' },
    { text: patternC, direction: 'right', speed: 'cert-marquee-speed-mid', size: 'text-5xl sm:text-6xl lg:text-7xl' },
    { text: patternA, direction: 'left', speed: 'cert-marquee-speed-fast', size: 'text-5xl sm:text-6xl lg:text-7xl' },
    { text: patternB, direction: 'right', speed: 'cert-marquee-speed-slow', size: 'text-4xl sm:text-5xl lg:text-6xl' },
    { text: patternC, direction: 'left', speed: 'cert-marquee-speed-mid', size: 'text-5xl sm:text-6xl lg:text-7xl' },
    { text: patternA, direction: 'right', speed: 'cert-marquee-speed-fast', size: 'text-5xl sm:text-6xl lg:text-7xl' },
    { text: patternB, direction: 'left', speed: 'cert-marquee-speed-slow', size: 'text-4xl sm:text-5xl lg:text-6xl' },
    { text: patternC, direction: 'right', speed: 'cert-marquee-speed-mid', size: 'text-5xl sm:text-6xl lg:text-7xl' },
    { text: patternA, direction: 'left', speed: 'cert-marquee-speed-fast', size: 'text-5xl sm:text-6xl lg:text-7xl' },
    { text: patternB, direction: 'right', speed: 'cert-marquee-speed-slow', size: 'text-4xl sm:text-5xl lg:text-6xl' },
  ];

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none z-0 cert-bg-mask ${className}`}
    >
      {/* Clean Single-Direction Parallel Diagonal Rows (No Crossing / Zero Overlap) */}
      <div
        className="absolute -top-[40%] -left-[40%] w-[180%] h-[180%] flex flex-col justify-around py-8 rotate-[-10deg] transform-gpu origin-center"
      >
        {rows.map((row, idx) => (
          <div
            key={`row-${idx}`}
            className={`overflow-hidden whitespace-nowrap leading-tight py-2 ${opacity}`}
          >
            <div
              className={`${
                row.direction === 'left' ? 'cert-marquee-track-left' : 'cert-marquee-track-right'
              } ${row.speed}`}
            >
              <span
                className={`${row.size} font-display font-black tracking-[0.28em] uppercase text-[#1b281c] shrink-0 pr-12`}
              >
                {row.text}
              </span>
              <span
                className={`${row.size} font-display font-black tracking-[0.28em] uppercase text-[#1b281c] shrink-0 pr-12`}
              >
                {row.text}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CertificateBackgroundMarquee;
