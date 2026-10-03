import React, { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import {
  Calendar,
  Building,
  Users,
  Award,
  Sparkles,
  HeartHandshake,
  Cpu,
  Globe,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import './AccordionGallery.css';

export interface AccordionGalleryItem {
  id: string;
  role: string;
  organization: string;
  period: string;
  description?: string | null;
  tags?: string[];
  badge?: string;
  shortOrg?: string;
  themeColor?: string;
}

interface AccordionGalleryProps {
  items: AccordionGalleryItem[];
  defaultIndex?: number;
  height?: number;
  gap?: number;
  radius?: number;
  expandRatio?: number;
  orientation?: 'horizontal' | 'vertical';
  duration?: number;
  ease?: string;
  tilt?: number;
  trigger?: 'hover' | 'click';
  className?: string;
}

// Icon selector based on role or organization
const getRoleIcon = (org: string, role: string) => {
  const combined = `${org} ${role}`.toLowerCase();
  if (combined.includes('ieee') || combined.includes('robotics')) {
    return <Cpu className="w-4 h-4 text-[#738666] dark:text-white" />;
  }
  if (combined.includes('gdsc') || combined.includes('google') || combined.includes('media')) {
    return <Globe className="w-4 h-4 text-[#556950] dark:text-white" />;
  }
  if (combined.includes('palliative') || combined.includes('healthcare') || combined.includes('nss')) {
    return <HeartHandshake className="w-4 h-4 text-[#8a7258] dark:text-white" />;
  }
  if (combined.includes('chairperson') || combined.includes('lead') || combined.includes('council')) {
    return <ShieldCheck className="w-4 h-4 text-[#738666] dark:text-white" />;
  }
  return <Users className="w-4 h-4 text-[#738666] dark:text-white" />;
};

export const AccordionGallery: React.FC<AccordionGalleryProps> = ({
  items,
  defaultIndex = 0,
  height = 490,
  gap = 12,
  radius = 24,
  expandRatio = 0.54,
  orientation = 'horizontal',
  duration = 0.38,
  ease = 'power3.out',
  tilt = 1.2,
  trigger = 'hover',
  className = '',
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const collapsedRefs = useRef<(HTMLDivElement | null)[]>([]);
  const expandedRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const firstRunRef = useRef(true);

  const count = items.length;
  const [active, setActive] = useState(
    Math.min(Math.max(defaultIndex, 0), Math.max(0, count - 1))
  );

  const prefersReduced =
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  const applyLayout = useCallback(
    (animate: boolean) => {
      const panels = panelRefs.current;
      if (!panels.length) return;

      const r = Math.min(Math.max(expandRatio, 0.25), 0.85);
      const grow = count > 1 ? (r * (count - 1)) / (1 - r) : 1;
      const dur = animate && !prefersReduced ? duration : 0;

      panels.forEach((panel, i) => {
        if (!panel) return;
        const isActive = i === active;
        const collapsedEl = collapsedRefs.current[i];
        const expandedEl = expandedRefs.current[i];

        const rot = isActive ? 0 : i < active ? tilt : -tilt;

        if (!animate) {
          gsap.set(panel, { flexGrow: isActive ? grow : 1, rotateY: rot });
          if (collapsedEl) {
            gsap.set(collapsedEl, {
              opacity: isActive ? 0 : 1,
              display: isActive ? 'none' : 'flex',
              visibility: isActive ? 'hidden' : 'visible',
            });
          }
          if (expandedEl) {
            gsap.set(expandedEl, {
              opacity: isActive ? 1 : 0,
              y: isActive ? 0 : 8,
              display: isActive ? 'flex' : 'none',
              visibility: isActive ? 'visible' : 'hidden',
            });
          }
          return;
        }

        // Cancel previous competing tweens
        gsap.killTweensOf(panel);
        if (collapsedEl) gsap.killTweensOf(collapsedEl);
        if (expandedEl) gsap.killTweensOf(expandedEl);

        // Apply flexGrow and subtle 3D perspective with liquid momentum blending
        gsap.to(panel, {
          flexGrow: isActive ? grow : 1,
          rotateY: rot,
          duration: dur,
          ease: 'power3.out',
          overwrite: 'auto',
        });

        // Animate Collapsed indicator strip
        if (collapsedEl) {
          if (isActive) {
            // Instantly hide collapsed strip on the expanding card so it NEVER overlaps
            gsap.to(collapsedEl, {
              opacity: 0,
              duration: 0.08,
              ease: 'power2.out',
              overwrite: 'auto',
              onComplete: () => {
                if (collapsedEl) {
                  collapsedEl.style.display = 'none';
                  collapsedEl.style.visibility = 'hidden';
                }
              },
            });
          } else {
            // On the closing card: Wait briefly, then smoothly reveal the vertical strip
            collapsedEl.style.display = 'flex';
            collapsedEl.style.visibility = 'visible';
            gsap.to(collapsedEl, {
              opacity: 1,
              scale: 1,
              duration: 0.22,
              ease: 'power2.out',
              delay: 0.08,
              overwrite: 'auto',
            });
          }
        }

        // Animate Expanded Rich Card Content
        if (expandedEl) {
          if (isActive) {
            // Expand cleanly, then glide in rich content onto the clean canvas
            expandedEl.style.display = 'flex';
            expandedEl.style.visibility = 'visible';
            gsap.fromTo(
              expandedEl,
              { opacity: 0, y: 8 },
              {
                opacity: 1,
                y: 0,
                duration: 0.26,
                ease: 'power2.out',
                delay: 0.08,
                overwrite: 'auto',
              }
            );
          } else {
            // Instantly vanish rich content on closing card so text never squishes
            gsap.to(expandedEl, {
              opacity: 0,
              y: 4,
              duration: 0.08,
              ease: 'power1.out',
              overwrite: 'auto',
              onComplete: () => {
                if (expandedEl) {
                  expandedEl.style.display = 'none';
                  expandedEl.style.visibility = 'hidden';
                }
              },
            });
          }
        }
      });
    },
    [active, count, expandRatio, duration, ease, tilt, prefersReduced]
  );

  useEffect(() => {
    applyLayout(!firstRunRef.current);
    firstRunRef.current = false;
  }, [applyLayout]);

  useEffect(() => {
    return () => {
      tlRef.current?.kill();
    };
  }, []);

  const handleEnter = (i: number) => {
    if (trigger === 'hover') setActive(i);
  };

  const handleClick = (i: number) => {
    setActive(i);
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i + 1) % count);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i - 1 + count) % count);
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <div
      ref={rootRef}
      className={`accordion-gallery ${className}`}
      style={{
        '--ag-gap': `${gap}px`,
        '--ag-radius': `${radius}px`,
        height: `${height}px`,
      } as React.CSSProperties}
      role="list"
      aria-label="Leadership and volunteering accordion"
    >
      {items.map((item, i) => {
        const isActive = i === active;
        const icon = getRoleIcon(item.organization, item.role);

        return (
          <div
            key={item.id || i}
            ref={(el) => {
              panelRefs.current[i] = el;
            }}
            className={`ag-panel ${isActive ? 'ag-panel--active' : ''}`}
            onClick={() => handleClick(i)}
            onMouseEnter={() => handleEnter(i)}
            onFocus={() => setActive(i)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            role="listitem"
            tabIndex={0}
            aria-current={isActive ? 'true' : undefined}
            aria-label={`${item.role} at ${item.organization}`}
          >
            <div className="ag-panel__frame">
              {/* Card Ambient Background with delicate gradients */}
              <div
                className={`absolute inset-0 transition-opacity duration-500 ${
                  isActive
                    ? 'bg-gradient-to-br from-white via-[#fbfcf9] to-[#f4f7f1] dark:from-[#16161a] dark:via-[#131316] dark:to-[#0f0f12]'
                    : 'bg-[#fafbfa] dark:bg-[#111114] hover:bg-[#f5f8f2] dark:hover:bg-[#16161a]'
                }`}
              />

              {/* Decorative Subtle Geometric Emblem in Background of Active Card */}
              <div
                className={`absolute -right-12 -bottom-12 w-64 h-64 rounded-full pointer-events-none transition-opacity duration-700 ${
                  isActive ? 'opacity-[0.06] dark:opacity-[0.05]' : 'opacity-0'
                } bg-radial from-[#738666] dark:from-white to-transparent`}
              />

              {/* ============================================================ */}
              {/* 1. COLLAPSED SLICE (Visible when not active)                */}
              {/* ============================================================ */}
              <div
                ref={(el) => {
                  collapsedRefs.current[i] = el;
                }}
                className="ag-panel__collapsed-bar"
                style={{
                  opacity: isActive ? 0 : 1,
                  display: isActive ? 'none' : 'flex',
                  visibility: isActive ? 'hidden' : 'visible',
                }}
              >
                {/* Top: Icon in soft badge */}
                <div className="w-10 h-10 rounded-2xl bg-white dark:bg-[#18181c] border border-[#738666]/20 dark:border-white/10 shadow-xs flex items-center justify-center shrink-0">
                  {icon}
                </div>

                {/* Middle: Vertical Title - Only Role Heading */}
                <div className="ag-panel__vertical-text">
                  <span>{item.role}</span>
                </div>

                {/* Bottom: Period Tag */}
                <div className="text-xs font-mono font-bold text-[#2d4429] dark:text-zinc-300 bg-[#738666]/15 dark:bg-white/10 px-2.5 py-1 rounded-full border border-[#738666]/25 dark:border-white/10 shrink-0">
                  {item.period}
                </div>
              </div>

              {/* ============================================================ */}
              {/* 2. EXPANDED RICH CONTENT (Visible when active)              */}
              {/* ============================================================ */}
              <div
                ref={(el) => {
                  expandedRefs.current[i] = el;
                }}
                className="ag-panel__expanded-content"
                style={{
                  opacity: isActive ? 1 : 0,
                  display: isActive ? 'flex' : 'none',
                  visibility: isActive ? 'visible' : 'hidden',
                }}
              >
                <div className="ag-panel__inner-wrap">
                  {/* Header: Meta Bar with Period & Badge */}
                  <div className="flex items-center justify-between gap-3 pb-3.5 border-b border-[#738666]/15 dark:border-white/[0.08]">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-mono font-bold px-3.5 py-1.5 rounded-full bg-[#738666]/12 dark:bg-white/10 text-[#23422e] dark:text-zinc-200 border border-[#738666]/30 dark:border-white/15 shadow-xs">
                        <Calendar className="w-4 h-4 text-[#738666] dark:text-white" />
                        {item.period}
                      </span>

                      {item.badge && (
                        <span className="text-xs sm:text-sm font-bold px-3 py-1 rounded-full bg-[#1b281c] dark:bg-white text-white dark:text-black tracking-wide shadow-xs">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    <div className="w-10 h-10 rounded-xl bg-[#738666]/15 dark:bg-white/10 border border-[#738666]/25 dark:border-white/15 flex items-center justify-center text-[#23422e] dark:text-white shrink-0">
                      {icon}
                    </div>
                  </div>

                  {/* Main Body: Role, Organization, and Narrative */}
                  <div className="my-auto py-3.5">
                    <h3 className="text-xl sm:text-2xl lg:text-[28px] font-extrabold text-[#1b281c] dark:text-white font-display tracking-tight leading-snug mb-2">
                      {item.role}
                    </h3>

                    <div className="flex items-center gap-2 text-[15px] sm:text-base font-semibold text-[#3a5237] dark:text-zinc-400 mb-4">
                      <Building className="w-4 h-4 text-[#738666] dark:text-zinc-400 shrink-0" />
                      <span>{item.organization}</span>
                    </div>

                    {item.description && (
                      <p className="text-base sm:text-[17px] text-[#223620] dark:text-zinc-300 leading-relaxed font-normal line-clamp-4">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Footer: Tags & Competencies */}
                  <div className="pt-3.5 border-t border-[#738666]/15 dark:border-white/[0.08] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      {(item.tags || ['Leadership', 'Event Management', 'Community']).map(
                        (tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-xs sm:text-sm font-semibold px-3 py-1 rounded-lg bg-white dark:bg-[#18181c] text-[#2b4129] dark:text-zinc-300 border border-[#738666]/25 dark:border-white/10 shadow-xs"
                          >
                            #{tag}
                          </span>
                        )
                      )}
                    </div>

                    <span className="text-xs sm:text-sm font-bold text-[#556c50] dark:text-white inline-flex items-center gap-1 shrink-0">
                      <span>Key Role</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AccordionGallery;
