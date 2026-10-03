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
      'bg-[#738666]/12 dark:bg-white/10 text-[#3d5337] dark:text-zinc-200 border border-[#738666]/30 dark:border-white/15 font-semibold hover:bg-[#738666]/20 dark:hover:bg-white/15 [.theme-admin_&]:bg-sky-500/10 [.theme-admin_&]:text-sky-400 [.theme-admin_&]:border-sky-500/20',
    secondary:
      'bg-[#f8faf6] dark:bg-[#16161a] text-[#4a5d46] dark:text-zinc-400 border border-[#738666]/20 dark:border-white/10 [.theme-admin_&]:bg-slate-800/80 [.theme-admin_&]:text-slate-300 [.theme-admin_&]:border-slate-700/60',
    accent:
      'bg-[#738666] dark:bg-white text-white dark:text-black font-bold border border-[#738666] dark:border-white [.theme-admin_&]:bg-indigo-500/10 [.theme-admin_&]:text-indigo-400 [.theme-admin_&]:border-indigo-500/20',
    success:
      'bg-emerald-600/10 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-600/20 dark:border-emerald-500/30',
    warning:
      'bg-[#c8a869]/15 dark:bg-[#d8b874]/15 text-[#8d6d2b] dark:text-[#d8b874] border border-[#c8a869]/30 dark:border-[#d8b874]/30 [.theme-admin_&]:bg-amber-500/10 [.theme-admin_&]:text-amber-400 [.theme-admin_&]:border-amber-500/20',
    purple:
      'bg-[#738666]/15 dark:bg-white/10 text-[#3d5337] dark:text-zinc-200 border border-[#738666]/25 dark:border-white/10 [.theme-admin_&]:bg-purple-500/10 [.theme-admin_&]:text-purple-400',
    outline:
      'bg-transparent text-[#3d5337] dark:text-zinc-300 border border-[#738666]/30 dark:border-white/15 [.theme-admin_&]:border-slate-700/80',
  };

  const sizes = {
    sm: 'text-xs font-semibold px-3 py-1 gap-1.5',
    md: 'text-sm font-semibold px-3.5 py-1.5 gap-2',
  };

  return (
    <span className={cn(base, variants[variant], sizes[size], className)}>
      {icon && <span className="inline-flex shrink-0 text-current">{icon}</span>}
      {children}
    </span>
  );
};
