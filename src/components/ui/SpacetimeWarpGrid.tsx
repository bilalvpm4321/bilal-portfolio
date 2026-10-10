import React, { useRef, useEffect } from 'react';

interface Point {
  x0: number; // Rest X
  y0: number; // Rest Y
  x: number;  // Current X
  y: number;  // Current Y
  vx: number; // Velocity X
  vy: number; // Velocity Y
}

interface SpacetimeWarpGridProps {
  className?: string;
  gridSpacing?: number;
  influenceRadius?: number;
  gravityStrength?: number;
  dampening?: number;
  stiffness?: number;
}

export const SpacetimeWarpGrid: React.FC<SpacetimeWarpGridProps> = ({
  className = '',
  gridSpacing = 32,
  influenceRadius = 220,
  gravityStrength = 45,
  dampening = 0.86,
  stiffness = 0.12,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Grid points 2D array
    let cols = 0;
    let rows = 0;
    let points: Point[] = [];

    // Mouse coordinates relative to canvas
    let mouse = {
      x: -9999,
      y: -9999,
      active: false,
      targetX: -9999,
      targetY: -9999,
    };

    const initGrid = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      cols = Math.ceil(width / gridSpacing) + 2;
      rows = Math.ceil(height / gridSpacing) + 2;

      const offsetX = (width - (cols - 1) * gridSpacing) / 2;
      const offsetY = (height - (rows - 1) * gridSpacing) / 2;

      points = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x0 = offsetX + c * gridSpacing;
          const y0 = offsetY + r * gridSpacing;
          points.push({
            x0,
            y0,
            x: x0,
            y: y0,
            vx: 0,
            vy: 0,
          });
        }
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        mouse.targetX = e.clientX - rect.left;
        mouse.targetY = e.clientY - rect.top;
        mouse.active = true;
      } else {
        mouse.active = false;
      }
    };

    const handlePointerLeave = () => {
      mouse.active = false;
      mouse.targetX = -9999;
      mouse.targetY = -9999;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    container.addEventListener('pointerleave', handlePointerLeave);

    const resizeObserver = new ResizeObserver(() => {
      initGrid();
    });
    resizeObserver.observe(container);
    initGrid();

    // Render loop
    const render = () => {
      // Smooth mouse coordinate lerping
      if (mouse.active) {
        mouse.x += (mouse.targetX - mouse.x) * 0.35;
        mouse.y += (mouse.targetY - mouse.y) * 0.35;
      } else {
        mouse.x += (-9999 - mouse.x) * 0.2;
        mouse.y += (-9999 - mouse.y) * 0.2;
      }

      ctx.clearRect(0, 0, width, height);

      // 1. Update Physics for each grid point
      for (let i = 0; i < points.length; i++) {
        const p = points[i];

        // Gravitational warp pull towards cursor
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < influenceRadius && dist > 0.1) {
            // Non-linear gravitational pull (higher closer to center)
            const factor = Math.pow(1 - dist / influenceRadius, 1.8);
            const pull = factor * gravityStrength;
            const angle = Math.atan2(dy, dx);

            p.vx += Math.cos(angle) * pull * 0.15;
            p.vy += Math.sin(angle) * pull * 0.15;
          }
        }

        // Spring return force to rest position (x0, y0)
        const springX = (p.x0 - p.x) * stiffness;
        const springY = (p.y0 - p.y) * stiffness;

        p.vx = (p.vx + springX) * dampening;
        p.vy = (p.vy + springY) * dampening;

        p.x += p.vx;
        p.y += p.vy;
      }

      // Check if current theme is dark or light
      const isDark = document.documentElement.classList.contains('dark');
      const falloffRadius = influenceRadius * 1.8; // Smooth radial gradient distance

      // 2. Draw Horizontal & Vertical Grid Wireframe Lines with Radial Distance Opacity Falloff
      ctx.lineWidth = 1;

      // Draw horizontal line segments
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols - 1; c++) {
          const p1 = points[r * cols + c];
          const p2 = points[r * cols + c + 1];

          const midX = (p1.x + p2.x) * 0.5;
          const midY = (p1.y + p2.y) * 0.5;
          const distToMouse = mouse.active ? Math.hypot(mouse.x - midX, mouse.y - midY) : 9999;

          const proximity = Math.max(0, 1 - distToMouse / falloffRadius);
          const lineAlpha = mouse.active
            ? 0.015 + Math.pow(proximity, 1.6) * 0.24
            : 0.025;

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = isDark
            ? `rgba(255, 255, 255, ${lineAlpha})`
            : `rgba(115, 134, 102, ${lineAlpha * 1.3})`;
          ctx.stroke();
        }
      }

      // Draw vertical line segments
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows - 1; r++) {
          const p1 = points[r * cols + c];
          const p2 = points[(r + 1) * cols + c];

          const midX = (p1.x + p2.x) * 0.5;
          const midY = (p1.y + p2.y) * 0.5;
          const distToMouse = mouse.active ? Math.hypot(mouse.x - midX, mouse.y - midY) : 9999;

          const proximity = Math.max(0, 1 - distToMouse / falloffRadius);
          const lineAlpha = mouse.active
            ? 0.015 + Math.pow(proximity, 1.6) * 0.24
            : 0.025;

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = isDark
            ? `rgba(255, 255, 255, ${lineAlpha})`
            : `rgba(115, 134, 102, ${lineAlpha * 1.3})`;
          ctx.stroke();
        }
      }

      // 3. Draw Nodes / Intersection Dots with Distance-based Radial Opacity Falloff
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const distToRest = Math.hypot(p.x - p.x0, p.y - p.y0);
        const distToMouse = mouse.active ? Math.hypot(mouse.x - p.x, mouse.y - p.y) : 9999;

        const proximity = Math.max(0, 1 - distToMouse / falloffRadius);
        const intensity = Math.min(1, Math.pow(proximity, 1.4) + distToRest * 0.05);

        const dotAlpha = mouse.active
          ? 0.025 + intensity * 0.65
          : 0.035;

        const dotRadius = 0.75 + intensity * 1.7;

        ctx.beginPath();
        ctx.arc(p.x, p.y, dotRadius, 0, Math.PI * 2);

        if (intensity > 0.12 && mouse.active) {
          ctx.fillStyle = isDark
            ? `rgba(255, 255, 255, ${dotAlpha})`
            : `rgba(115, 134, 102, ${dotAlpha})`;
          ctx.shadowBlur = intensity > 0.4 ? 4 * intensity : 0;
          ctx.shadowColor = isDark ? 'rgba(255, 255, 255, 0.75)' : 'rgba(115, 134, 102, 0.55)';
        } else {
          ctx.fillStyle = isDark
            ? `rgba(255, 255, 255, ${dotAlpha})`
            : `rgba(115, 134, 102, ${dotAlpha * 1.2})`;
          ctx.shadowBlur = 0;
        }

        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);
      resizeObserver.disconnect();
    };
  }, [gridSpacing, influenceRadius, gravityStrength, dampening, stiffness]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full overflow-hidden pointer-events-auto select-none ${className}`}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};

export default SpacetimeWarpGrid;
