import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverEffect?: boolean;
  glow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hoverEffect = false,
  glow = false,
  ...props
}) => {
  return (
    <div
      className={cn(
        'relative bg-white dark:bg-[#121814] text-[#1b281c] dark:text-[#f1f5ee] rounded-2xl border border-[#738666]/20 dark:border-[#738666]/30 p-6 transition-all duration-300 shadow-xs dark:shadow-black/40 [.theme-admin_&]:bg-[#0f111a]/80 [.theme-admin_&]:border-white/[0.07]',
        hoverEffect &&
          'hover:border-[#738666]/50 dark:hover:border-[#8eb383]/50 hover:bg-[#fcfdfa] dark:hover:bg-[#16201a] hover:shadow-lg hover:shadow-[#738666]/10 dark:hover:shadow-black/60 hover:-translate-y-1 [.theme-admin_&]:hover:border-sky-500/30 [.theme-admin_&]:hover:bg-[#131622]/90',
        glow &&
          'before:absolute before:inset-0 before:-z-10 before:rounded-2xl before:bg-gradient-to-b before:from-[#738666]/10 dark:before:from-[#8eb383]/15 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500 [.theme-admin_&]:before:from-sky-500/10',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
