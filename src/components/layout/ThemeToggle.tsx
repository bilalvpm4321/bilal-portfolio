import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun } from 'lucide-react';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Theme"
      className={`relative p-2 rounded-xl text-[#556950] hover:text-[#1b281c] bg-[#f8faf6] hover:bg-[#f1f4ed] border border-[#738666]/25 transition-all duration-200 cursor-pointer ${className}`}
    >
      <Sun className="w-4 h-4 text-[#738666]" />
    </button>
  );
};
