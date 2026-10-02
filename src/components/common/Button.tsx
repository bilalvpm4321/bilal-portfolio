import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#738666] [.theme-admin_&]:focus-visible:ring-sky-400 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-xl active:scale-[0.98] select-none cursor-pointer';

    const variants = {
      primary:
        'bg-[#738666] hover:bg-[#627456] dark:bg-[#738666] dark:hover:bg-[#8eb383] text-white font-semibold shadow-md shadow-[#738666]/20 dark:shadow-black/40 hover:-translate-y-0.5 border border-[#738666] dark:border-[#8eb383]/40 [.theme-admin_&]:bg-sky-500 [.theme-admin_&]:hover:bg-sky-400 [.theme-admin_&]:text-slate-950 [.theme-admin_&]:border-transparent [.theme-admin_&]:shadow-sky-500/25',
      secondary:
        'bg-[#f8faf6] dark:bg-[#16201a] hover:bg-[#f1f4ed] dark:hover:bg-[#1f2c23] text-[#1b281c] dark:text-[#f1f5ee] border border-[#738666]/30 dark:border-[#738666]/40 hover:border-[#738666] dark:hover:border-[#8eb383] [.theme-admin_&]:bg-slate-800/80 [.theme-admin_&]:hover:bg-slate-700/80 [.theme-admin_&]:text-gray-100 [.theme-admin_&]:border-slate-700/80',
      outline:
        'border border-[#738666]/35 dark:border-[#738666]/40 hover:border-[#738666] dark:hover:border-[#8eb383] bg-white dark:bg-[#121814] text-[#1b281c] dark:text-[#f1f5ee] hover:bg-[#738666]/10 dark:hover:bg-[#738666]/20 [.theme-admin_&]:border-slate-700 [.theme-admin_&]:hover:border-sky-400/60 [.theme-admin_&]:text-gray-200 [.theme-admin_&]:hover:bg-sky-500/10',
      ghost:
        'text-[#3b4e39] dark:text-[#a8bfa5] hover:text-[#1b281c] dark:hover:text-white hover:bg-[#738666]/10 dark:hover:bg-[#738666]/20 [.theme-admin_&]:text-slate-300 [.theme-admin_&]:hover:text-white [.theme-admin_&]:hover:bg-white/5',
      danger:
        'bg-rose-600/90 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20',
      gradient:
        'bg-gradient-to-r from-[#738666] to-[#556950] dark:from-[#738666] dark:to-[#40543c] text-white font-semibold shadow-md shadow-[#738666]/20 hover:-translate-y-0.5 border border-[#738666]/30 [.theme-admin_&]:from-sky-500 [.theme-admin_&]:via-blue-600 [.theme-admin_&]:to-indigo-600',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 gap-1.5',
      md: 'text-sm px-4 py-2.5 gap-2',
      lg: 'text-base px-6 py-3 gap-2.5 font-medium',
      icon: 'h-10 w-10 p-0',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && (
          <span className="inline-flex shrink-0 transition-transform group-hover:translate-x-0.5">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
