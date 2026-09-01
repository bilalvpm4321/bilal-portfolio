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
        'relative bg-[#0f111a]/80 backdrop-blur-md rounded-2xl border border-white/[0.07] p-6 transition-all duration-300',
        hoverEffect &&
          'hover:border-sky-500/30 hover:bg-[#131622]/90 hover:shadow-xl hover:shadow-sky-500/5 hover:-translate-y-1',
        glow &&
          'before:absolute before:inset-0 before:-z-10 before:rounded-2xl before:bg-gradient-to-b before:from-sky-500/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
