import React, { useEffect, useRef } from 'react';

interface SparkleParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  type: 'sparkle4' | 'diamond' | 'orb' | 'ring';
  scale: number;
}

interface ShockwaveRing {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
  lineWidth: number;
}

export const SparkleBurstField: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    let particles: SparkleParticle[] = [];
    let shockwaves: ShockwaveRing[] = [];

    // Rapid Shake & Speed Detection State
    const history: { x: number; y: number; time: number; vx: number; vy: number }[] = [];
    let lastBlastTime = 0;
    let fastSweepCount = 0;
    let lastDirection = 0; // 1 or -1 along primary axis

    // Resize handling with DPR
    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Trigger Luxury Supernova Sparkle Blast
    const triggerSupernovaBlast = (cx: number, cy: number, intensity = 1) => {
      const isDark = document.documentElement.classList.contains('dark');

      const palette = isDark
        ? [
            '#ffffff', // Brilliant Starlight White
            '#fffbeb', // Warm Gold Light
            '#fef08a', // Champagne Star
            '#c8a869', // Luxury Brass Gold
            '#93c5fd', // Celestial Diamond Blue
            '#a7f3d0', // Emerald Starlight
          ]
        : [
            '#c8a869', // Antique Gold
            '#d8b97a', // Warm Champagne
            '#738666', // Sage Green Highlight
            '#3a5438', // Deep Forest Sparkle
            '#ffffff', // Crisp White Shimmer
          ];

      // 1. Spawning Expanding Shockwave Rings
      shockwaves.push(
        {
          x: cx,
          y: cy,
          radius: 12,
          maxRadius: 160 * intensity,
          alpha: 0.95,
          color: isDark ? 'rgba(255, 255, 255, ' : 'rgba(200, 168, 105, ',
          lineWidth: 2.8,
        },
        {
          x: cx,
          y: cy,
          radius: 4,
          maxRadius: 110 * intensity,
          alpha: 0.8,
          color: isDark ? 'rgba(254, 240, 138, ' : 'rgba(115, 134, 102, ',
          lineWidth: 1.6,
        }
      );

      // 2. Spawn 48-60 High-End Sparkles, Diamonds, and Radiant Embers
      const count = Math.floor((48 + Math.random() * 16) * intensity);
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
        const speed = (3.5 + Math.random() * 8.5) * intensity;
        const color = palette[Math.floor(Math.random() * palette.length)];

        const types: ('sparkle4' | 'diamond' | 'orb')[] = ['sparkle4', 'diamond', 'orb'];
        const type = types[Math.floor(Math.random() * types.length)];

        particles.push({
          x: cx + (Math.random() - 0.5) * 10,
          y: cy + (Math.random() - 0.5) * 10,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - (Math.random() * 1.5), // slight upward buoyancy
          size: type === 'sparkle4' ? 9 + Math.random() * 8 : 4 + Math.random() * 5,
          alpha: 1,
          decay: 0.015 + Math.random() * 0.022,
          rotation: Math.random() * Math.PI,
          rotationSpeed: (Math.random() - 0.5) * 0.22,
          color,
          type,
          scale: 0.2,
        });
      }
    };

    // Fast movement & rapid continuous sweep detection
    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const now = performance.now();

      // Only track if cursor is within or near hero section
      if (x < -80 || x > width + 80 || y < -80 || y > height + 80) return;

      if (history.length > 0) {
        const last = history[history.length - 1];
        const dt = Math.max(now - last.time, 1);
        const vx = (x - last.x) / dt;
        const vy = (y - last.y) / dt;
        const speed = Math.hypot(vx, vy);

        // Fast movement threshold (> 2.8 px/ms is very fast sweep)
        if (speed > 2.8) {
          const currentDir = Math.sign(vx !== 0 ? vx : vy);

          // Detect direction flip / rapid continuous motion
          if (currentDir !== 0 && currentDir !== lastDirection) {
            fastSweepCount++;
            lastDirection = currentDir;

            // Trigger blast when moved fastly >= 3 times in rapid succession
            if (fastSweepCount >= 3 && now - lastBlastTime > 450) {
              triggerSupernovaBlast(x, y, 1.15);
              lastBlastTime = now;
              fastSweepCount = 0; // Reset after dazzling burst
            }
          }
        }
      }

      history.push({ x, y, time: now, vx: 0, vy: 0 });

      // Clean old history items older than 700ms
      while (history.length > 0 && now - history[0].time > 700) {
        history.shift();
      }

      // Reset sweep count if inactive for > 750ms
      if (history.length > 0 && now - history[history.length - 1].time > 750) {
        fastSweepCount = 0;
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    // Draw 4-Point Star Sparkle (✦)
    const drawSparkle4 = (ctx: CanvasRenderingContext2D, size: number, color: string, alpha: number) => {
      ctx.save();
      ctx.fillStyle = color;
      ctx.globalAlpha = alpha;
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;

      ctx.beginPath();
      const r = size;
      const inner = size * 0.18;
      for (let i = 0; i < 8; i++) {
        const rad = (i * Math.PI) / 4;
        const dist = i % 2 === 0 ? r : inner;
        const px = Math.cos(rad) * dist;
        const py = Math.sin(rad) * dist;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();

      // Center bright core
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, inner * 0.9, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    // Draw Diamond Sparkle (❖)
    const drawDiamond = (ctx: CanvasRenderingContext2D, size: number, color: string, alpha: number) => {
      ctx.save();
      ctx.fillStyle = color;
      ctx.globalAlpha = alpha;
      ctx.shadowColor = color;
      ctx.shadowBlur = 6;

      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(size * 0.6, 0);
      ctx.lineTo(0, size);
      ctx.lineTo(-size * 0.6, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    // Main Render Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Render Shockwave Expanding Rings
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const ring = shockwaves[i];
        ring.radius += (ring.maxRadius - ring.radius) * 0.14 + 1.2;
        ring.alpha *= 0.92;

        if (ring.alpha > 0.02) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
          ctx.strokeStyle = `${ring.color}${ring.alpha})`;
          ctx.lineWidth = ring.lineWidth * (ring.alpha * 1.2);
          ctx.shadowColor = ring.color.startsWith('rgba(255') ? '#ffffff' : '#c8a869';
          ctx.shadowBlur = 14;
          ctx.stroke();
          ctx.restore();
        } else {
          shockwaves.splice(i, 1);
        }
      }

      // 2. Render Sparkle Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Physics velocity & friction
        p.vx *= 0.94;
        p.vy *= 0.94;
        p.vy += 0.06; // delicate downward gravity drift
        p.x += p.vx;
        p.y += p.vy;

        p.rotation += p.rotationSpeed;
        p.alpha -= p.decay;
        p.scale = Math.min(1, p.scale + 0.15); // quick pop in

        if (p.alpha <= 0.01) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.scale(p.scale, p.scale);

        if (p.type === 'sparkle4') {
          drawSparkle4(ctx, p.size, p.color, p.alpha);
        } else if (p.type === 'diamond') {
          drawDiamond(ctx, p.size, p.color, p.alpha);
        } else {
          // Luminous Orb Glow
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
          ctx.fill();
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-25 ${className}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};
