import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ThemeToggleProps {
  size?: 'sm' | 'md' | 'lg';
}

const ThemeToggle = ({ size = 'md' }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const sizeClasses = {
    sm: 'w-12 h-6',
    md: 'w-14 h-7',
    lg: 'w-16 h-8',
  };

  const knobSizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-7 h-7',
  };

  const iconSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  const iconPaddingClasses = {
    sm: 'px-2',
    md: 'px-2',
    lg: 'px-2.5',
  };

  const translateClasses = {
    sm: 'translate-x-6',
    md: 'translate-x-7',
    lg: 'translate-x-8',
  };

  return (
    <button
      onClick={toggleTheme}
      data-theme-toggle
      className={`
        relative ${sizeClasses[size]} rounded-full p-0.5
        bg-gradient-to-r transition-all duration-300 ease-out ring-1 ring-inset
        ${isDark 
          ? 'from-surface-darker to-surface-dark ring-surface-border shadow-inner' 
          : 'from-cream-200 to-cream-300 ring-cream-300 shadow-inner'
        }
        hover:scale-105 active:scale-95
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
        dark:focus-visible:ring-offset-gray-900
      `}
      role="switch"
      aria-checked={isDark}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Track background icons */}
      <div className={`absolute inset-0 flex items-center justify-between ${iconPaddingClasses[size]}`}>
        <Sun className={`${iconSizeClasses[size]} text-primary opacity-50 transition-opacity ${isDark ? 'opacity-100' : 'opacity-0'}`} />
        <Moon className={`${iconSizeClasses[size]} text-primary opacity-50 transition-opacity ${isDark ? 'opacity-0' : 'opacity-100'}`} />
      </div>

      {/* Sliding knob */}
      <div
        className={`
          ${knobSizeClasses[size]} rounded-full
          bg-primary shadow-md
          transform transition-all duration-300 ease-out
          flex items-center justify-center
          ${isDark ? translateClasses[size] : 'translate-x-0'}
        `}
      >
        {/* Animated icon inside knob */}
        <div className="relative">
          <Sun
            className={`
              ${iconSizeClasses[size]} text-cream-100 absolute inset-0
              transition-all duration-300
              ${isDark ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}
            `}
          />
          <Moon
            className={`
              ${iconSizeClasses[size]} text-cream-100
              transition-all duration-300
              ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}
            `}
          />
        </div>
      </div>
    </button>
  );
};

export default ThemeToggle;
