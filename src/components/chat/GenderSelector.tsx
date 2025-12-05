import { motion } from 'framer-motion';
import { User } from 'lucide-react';

type Gender = 'male' | 'female' | 'non-binary';

interface GenderSelectorProps {
  selectedGender: Gender | null;
  onSelectGender: (gender: Gender) => void;
  disabled?: boolean;
}

const genderOptions: { value: Gender; label: string }[] = [
  { value: 'male', label: 'Man' },
  { value: 'female', label: 'Woman' },
  { value: 'non-binary', label: 'Non-Binary' },
];

const GenderSelector = ({ selectedGender, onSelectGender, disabled = false }: GenderSelectorProps) => {
  const needsSelection = !selectedGender && !disabled;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-primary/5 via-cream-50 to-primary/5 dark:from-primary/10 dark:via-surface-dark dark:to-primary/10 border-b border-cream-200 dark:border-surface-muted px-4 py-2.5"
    >
      <div className="max-w-[992px] mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
        <div className="flex items-center gap-2 text-text-dark dark:text-stone-200">
          <User className="w-4 h-4 text-primary" />
          <span className="text-sm font-inter font-medium">
            {disabled 
              ? 'Style preference:' 
              : needsSelection
                ? 'Select your style to start:'
                : 'Select your style:'}
          </span>
        </div>
        
        <div className="flex gap-1.5">
          {genderOptions.map((option) => {
            const isSelected = selectedGender === option.value;
            return (
              <motion.button
                key={option.value}
                whileHover={!disabled ? { scale: 1.03 } : {}}
                whileTap={!disabled ? { scale: 0.97 } : {}}
                onClick={() => !disabled && onSelectGender(option.value)}
                disabled={disabled}
                className={`
                  px-4 py-1.5 rounded-full text-sm font-inter font-medium
                  transition-all duration-200
                  ${isSelected
                    ? 'bg-primary text-white shadow-sm'
                    : disabled
                      ? 'bg-cream-100 dark:bg-surface-muted text-text-light dark:text-stone-500 cursor-not-allowed'
                      : needsSelection
                        ? 'bg-white dark:bg-surface-dark border-2 border-primary/50 dark:border-primary/40 text-text-dark dark:text-stone-200 hover:border-primary hover:bg-cream-50 dark:hover:bg-surface-muted cursor-pointer animate-pulse-subtle'
                        : 'bg-white dark:bg-surface-dark border border-cream-300 dark:border-surface-muted text-text-dark dark:text-stone-200 hover:border-primary hover:bg-cream-50 dark:hover:bg-surface-muted cursor-pointer'
                  }
                `}
              >
                {option.label}
              </motion.button>
            );
          })}
        </div>

        {disabled && (
          <span className="text-xs text-text-light dark:text-stone-500 italic">
            (start a new chat to change)
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default GenderSelector;
