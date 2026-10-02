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
  // Efficient repeating patterns with minimal DOM overhead
  const patternA = 'CERTIFICATE • CERTIFICATE • CERTIFICATE • CERTIFICATE • CERTIFICATE • ';
  const patternB = 'CERTIFIED · ACCREDITED · VERIFIED · CREDENTIAL · EXCELLENCE · ';
  const patternC = 'CERTIFICATE ✦ CERTIFICATE ✦ CERTIFICATE ✦ CERTIFICATE ✦ ';

  // 7 clean, parallel, GPU-accelerated diagonal rows
  const rows = [
    { text: patternA, direction: 'left', speed: 'cert-marquee-speed-slow', size: 'text-5xl sm:text-6xl' },
    { text: patternB, direction: 'right', speed: 'cert-marquee-speed-mid', size: 'text-4xl sm:text-5xl' },
    { text: patternC, direction: 'left', speed: 'cert-marquee-speed-fast', size: 'text-5xl sm:text-6xl' },
    { text: patternA, direction: 'right', speed: 'cert-marquee-speed-slow', size: 'text-4xl sm:text-5xl' },
    { text: patternB, direction: 'left', speed: 'cert-marquee-speed-mid', size: 'text-5xl sm:text-6xl' },
    { text: patternC, direction: 'right', speed: 'cert-marquee-speed-fast', size: 'text-4xl sm:text-5xl' },
    { text: patternA, direction: 'left', speed: 'cert-marquee-speed-slow', size: 'text-5xl sm:text-6xl' },
  ];

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none z-0 cert-bg-mask ${className}`}
    >
      {/* Clean Single-Direction Parallel Diagonal Rows */}
      <div
        className="absolute -top-[20%] -left-[20%] w-[140%] h-[140%] flex flex-col justify-around py-4 rotate-[-8deg] transform-gpu origin-center will-change-transform"
      >
        {rows.map((row, idx) => (
          <div
            key={`row-${idx}`}
            className={`overflow-hidden whitespace-nowrap leading-none py-3 ${opacity} will-change-transform`}
          >
            <div
              className={`${
                row.direction === 'left' ? 'cert-marquee-track-left' : 'cert-marquee-track-right'
              } ${row.speed}`}
            >
              <span
                className={`${row.size} font-display font-black tracking-[0.25em] uppercase text-[#1b281c] dark:text-[#c4d7c0] shrink-0 pr-8`}
              >
                {row.text}
              </span>
              <span
                className={`${row.size} font-display font-black tracking-[0.25em] uppercase text-[#1b281c] dark:text-[#c4d7c0] shrink-0 pr-8`}
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

export default React.memo(CertificateBackgroundMarquee);

