import React, { useState, useEffect, useRef, useMemo, ReactNode } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import './Stack.css';

interface CardRotateProps {
  children: React.ReactNode;
  onSendToBack: () => void;
  sensitivity: number;
  disableDrag?: boolean;
}

function CardRotate({ children, onSendToBack, sensitivity, disableDrag = false }: CardRotateProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-80, 80], [25, -25]);
  const rotateY = useTransform(x, [-80, 80], [-25, 25]);
  const hasDraggedRef = useRef(false);

  function handleDragStart() {
    hasDraggedRef.current = true;
  }

  function handleDragEnd(_: any, info: PanInfo) {
    if (Math.abs(info.offset.x) > sensitivity || Math.abs(info.offset.y) > sensitivity) {
      onSendToBack();
    } else {
      x.set(0);
      y.set(0);
    }
    setTimeout(() => {
      hasDraggedRef.current = false;
    }, 120);
  }

  const handleClickCapture = (e: React.MouseEvent) => {
    if (hasDraggedRef.current) {
      e.stopPropagation();
    }
  };

  if (disableDrag) {
    return (
      <div className="card-rotate-disabled">
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className="card-rotate"
      style={{ x, y, rotateX, rotateY }}
      drag
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      dragElastic={0.4}
      whileTap={{ cursor: 'grabbing' }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClickCapture={handleClickCapture}
    >
      {children}
    </motion.div>
  );
}

export interface StackProps {
  randomRotation?: boolean;
  sensitivity?: number;
  cards?: ReactNode[];
  animationConfig?: { stiffness: number; damping: number };
  sendToBackOnClick?: boolean;
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  mobileClickOnly?: boolean;
  mobileBreakpoint?: number;
  className?: string;
  onCardChange?: (topCardId: number | string) => void;
}

// Stable deterministic rotation offsets based on index
const STABLE_ROTATIONS = [-2.5, 3.2, -1.8, 2.7, -3.1, 1.9, -2.2, 2.8];

export const Stack: React.FC<StackProps> = ({
  randomRotation = false,
  sensitivity = 120,
  cards = [],
  animationConfig = { stiffness: 320, damping: 24 },
  sendToBackOnClick = false,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = false,
  mobileClickOnly = false,
  mobileBreakpoint = 768,
  className = '',
  onCardChange,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < mobileBreakpoint);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [mobileBreakpoint]);

  const count = cards.length;
  const shouldDisableDrag = mobileClickOnly && isMobile;
  const shouldEnableClick = sendToBackOnClick || shouldDisableDrag;

  const sendToBack = (targetIndex: number) => {
    if (count <= 1) return;
    setCurrentIndex((prev) => {
      const next = (prev + 1) % count;
      if (onCardChange) {
        onCardChange(next);
      }
      return next;
    });
  };

  useEffect(() => {
    if (autoplay && count > 1 && !isPaused) {
      const interval = setInterval(() => {
        sendToBack(currentIndex);
      }, autoplayDelay);

      return () => clearInterval(interval);
    }
  }, [autoplay, autoplayDelay, count, isPaused, currentIndex]);

  if (!cards || cards.length === 0) {
    return null;
  }

  // Maximum visual depth: we only need to render the top 4 cards for a pristine stack effect
  const MAX_RENDER_DEPTH = Math.min(count, 4);
  
  // Create circular ordered slice for rendering
  const visibleCards = [];
  for (let i = 0; i < MAX_RENDER_DEPTH; i++) {
    const actualIndex = (currentIndex + (MAX_RENDER_DEPTH - 1 - i)) % count;
    visibleCards.push({
      key: `card-idx-${actualIndex}`,
      actualIndex,
      depthIndex: i, // 0 is bottom-most visible, MAX_RENDER_DEPTH - 1 is top card
      content: cards[actualIndex],
    });
  }

  return (
    <div
      className={`stack-container ${className}`}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      {visibleCards.map((item) => {
        const isTop = item.depthIndex === MAX_RENDER_DEPTH - 1;
        const depthFromTop = MAX_RENDER_DEPTH - 1 - item.depthIndex;
        const baseRotate = randomRotation
          ? STABLE_ROTATIONS[item.actualIndex % STABLE_ROTATIONS.length]
          : 0;

        const cardElement = (
          <motion.div
            className="card"
            onClick={() => isTop && shouldEnableClick && sendToBack(item.actualIndex)}
            animate={{
              rotateZ: depthFromTop * 3 + baseRotate,
              scale: 1 - depthFromTop * 0.045,
              y: depthFromTop * 8,
              transformOrigin: '90% 90%',
            }}
            initial={false}
            transition={{
              type: 'spring',
              stiffness: animationConfig.stiffness,
              damping: animationConfig.damping,
            }}
          >
            {item.content}
          </motion.div>
        );

        if (isTop && !shouldDisableDrag) {
          return (
            <CardRotate
              key={item.key}
              onSendToBack={() => sendToBack(item.actualIndex)}
              sensitivity={sensitivity}
              disableDrag={false}
            >
              {cardElement}
            </CardRotate>
          );
        }

        return (
          <div key={item.key} className="card-rotate-disabled pointer-events-none">
            {cardElement}
          </div>
        );
      })}
    </div>
  );
};

export default React.memo(Stack);

