import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'purple' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  icon,
}) => {
  const base =
    'inline-flex items-center font-medium rounded-full transition-colors duration-150';

  const variants = {
    primary:
      'bg-sky-500/10 text-sky-400 border border-sky-500/20 hover:bg-sky-500/15',
    secondary:
      'bg-slate-800/80 text-slate-300 border border-slate-700/60',
    accent:
      'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
    success:
      'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    warning:
      'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    purple:
      'bg-purple-500/10 text-purple-400 border border-purple-500/20',
    outline:
      'bg-transparent text-slate-300 border border-slate-700/80',
  };

  const sizes = {
    sm: 'text-[11px] px-2.5 py-0.5 gap-1',
    md: 'text-xs px-3 py-1 gap-1.5',
  };

  return (
    <span className={cn(base, variants[variant], sizes[size], className)}>
      {icon && <span className="inline-flex shrink-0 text-current">{icon}</span>}
      {children}
    </span>
  );
};
