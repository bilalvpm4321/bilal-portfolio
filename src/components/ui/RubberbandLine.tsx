import React, { useRef, useState, useEffect, useCallback } from 'react';

interface RubberbandLineProps {
  width?: number;
  height?: number;
  strokeWidth?: number;
  className?: string;
  color?: string;
}

export const RubberbandLine: React.FC<RubberbandLineProps> = ({
  width = 460,
  height = 90,
  strokeWidth = 5.5,
  className = '',
  color = '#738666',
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const animFrameRef = useRef<number | null>(null);

  const startX = 16;
  const startY = height / 2;
  const endX = width - 16;
  const endY = height / 2;
  const restX = width / 2;
  const restY = height / 2;

  // Control point state
  const [ctrlPoint, setCtrlPoint] = useState({ x: restX, y: restY });
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Physics state for spring oscillation
  const posRef = useRef({ x: restX, y: restY });
  const velRef = useRef({ x: 0, y: 0 });
  const draggingRef = useRef(false);

  // Sync ref with state
  useEffect(() => {
    draggingRef.current = isDragging;
  }, [isDragging]);

  // Physics loop for release vibration / oscillation
  const startOscillation = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }

    const stiffness = 0.16; // Hooke's spring constant
    const damping = 0.84; // Friction damping

    const step = () => {
      if (draggingRef.current) return;

      const fx = (restX - posRef.current.x) * stiffness;
      const fy = (restY - posRef.current.y) * stiffness;

      velRef.current.x = (velRef.current.x + fx) * damping;
      velRef.current.y = (velRef.current.y + fy) * damping;

      posRef.current.x += velRef.current.x;
      posRef.current.y += velRef.current.y;

      setCtrlPoint({ x: posRef.current.x, y: posRef.current.y });

      // Stop when energy has dissipated
      const isSettled =
        Math.abs(velRef.current.y) < 0.04 &&
        Math.abs(posRef.current.y - restY) < 0.04 &&
        Math.abs(velRef.current.x) < 0.04 &&
        Math.abs(posRef.current.x - restX) < 0.04;

      if (!isSettled) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        posRef.current = { x: restX, y: restY };
        velRef.current = { x: 0, y: 0 };
        setCtrlPoint({ x: restX, y: restY });
      }
    };

    animFrameRef.current = requestAnimationFrame(step);
  }, [restX, restY]);

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  // Convert client coordinates to SVG coordinates
  const getSvgCoords = (clientX: number, clientY: number) => {
    if (!svgRef.current) return { x: restX, y: restY };
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = width / rect.width;
    const scaleY = height / rect.height;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    return { x, y };
  };

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    setIsDragging(true);
    draggingRef.current = true;

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }

    const { x, y } = getSvgCoords(e.clientX, e.clientY);
    const clampedY = Math.max(6, Math.min(height - 6, y));
    const clampedX = Math.max(startX + 16, Math.min(endX - 16, x));

    posRef.current = { x: clampedX, y: clampedY };
    velRef.current = { x: 0, y: 0 };
    setCtrlPoint({ x: clampedX, y: clampedY });
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isDragging) return;

    const { x, y } = getSvgCoords(e.clientX, e.clientY);
    const clampedY = Math.max(4, Math.min(height - 4, y));
    const clampedX = Math.max(startX + 10, Math.min(endX - 10, x));

    posRef.current = { x: clampedX, y: clampedY };
    setCtrlPoint({ x: clampedX, y: clampedY });
  };

  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    setIsDragging(false);
    draggingRef.current = false;

    // Add initial release velocity proportional to displacement
    velRef.current = {
      x: (restX - posRef.current.x) * 0.18,
      y: (restY - posRef.current.y) * 0.32,
    };

    startOscillation();
  };

  // SVG Path description using Quadratic Bézier Curve: M start Q control end
  const pathD = `M ${startX} ${startY} Q ${ctrlPoint.x} ${ctrlPoint.y} ${endX} ${endY}`;

  // Tension calculation (0 = at rest, > 0 = stretched)
  const dy = ctrlPoint.y - restY;
  const dx = ctrlPoint.x - restX;
  const tension = Math.min(1, Math.sqrt(dx * dx + dy * dy) / (height * 0.45));

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center select-none ${className}`}
      style={{ touchAction: 'none' }}
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-[280px] sm:w-[380px] md:w-[460px] h-[64px] sm:h-[76px] overflow-visible cursor-grab active:cursor-grabbing transition-transform duration-150"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Ambient Glow Aura when pulled */}
        {tension > 0.05 && (
          <path
            d={pathD}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth + 6}
            strokeLinecap="round"
            className="dark:stroke-white"
            style={{
              opacity: tension * 0.4,
              filter: 'blur(4px)',
            }}
          />
        )}

        {/* The Solid Main Rubberband Elastic Line */}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className="dark:stroke-white/80 transition-[stroke-width] duration-75"
        />

        {/* Anchor End Caps */}
        <circle
          cx={startX}
          cy={startY}
          r={strokeWidth / 2}
          fill={color}
          className="dark:fill-white/80"
        />
        <circle
          cx={endX}
          cy={endY}
          r={strokeWidth / 2}
          fill={color}
          className="dark:fill-white/80"
        />

        {/* Interactive Center Grip Indicator on Drag / Hover */}
        {(isDragging || (isHovered && tension > 0.08)) && (
          <circle
            cx={ctrlPoint.x}
            cy={ctrlPoint.y}
            r={strokeWidth * 1.3}
            fill={color}
            className="dark:fill-white animate-pulse"
          />
        )}

        {/* Wide Invisible Hitbox for effortless grabbing */}
        <path
          d={pathD}
          fill="none"
          stroke="transparent"
          strokeWidth={44}
          strokeLinecap="round"
          className="pointer-events-auto cursor-grab active:cursor-grabbing"
        />
      </svg>

      {/* Subtle Micro-hint tooltip on hover */}
      {isHovered && !isDragging && (
        <span className="absolute -bottom-0.5 text-[10px] font-mono font-medium tracking-widest text-[#738666] dark:text-zinc-300 pointer-events-none opacity-80 uppercase">
          Drag & Pull
        </span>
      )}
    </div>
  );
};

export default RubberbandLine;
