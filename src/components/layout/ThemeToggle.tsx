import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC<{ className?: string; size?: 'sm' | 'md' }> = ({
  className = '',
  size = 'md',
}) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.05 }}
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}
      title={isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}
      className={`relative inline-flex items-center justify-center rounded-full transition-colors duration-300 cursor-pointer overflow-hidden border ${
        size === 'sm' ? 'w-8 h-8 p-1' : 'w-9 h-9 sm:w-10 sm:h-10 p-2'
      } ${
        isDark
          ? 'bg-[#141418]/90 border-white/15 text-white hover:bg-[#1c1c22] hover:border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.08)]'
          : 'bg-white/90 border-[#738666]/30 text-[#556950] hover:text-[#1b281c] hover:bg-[#f1f4ed] hover:border-[#738666]/60 shadow-xs'
      } ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ rotate: -90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center"
          >
            <Moon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4 sm:w-4.5 sm:h-4.5'} />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ rotate: 90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center"
          >
            <Sun className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#738666]'} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

