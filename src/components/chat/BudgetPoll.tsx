
import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, ArrowRight } from 'lucide-react';
import type { BudgetOption } from '../../types';

interface BudgetPollProps {
    options: BudgetOption[];
    onSelect: (option: BudgetOption) => void;
    disabled?: boolean;
}

const BudgetPoll: React.FC<BudgetPollProps> = ({ options, onSelect, disabled }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 mb-2">
            {options.map((option, index) => (
                <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    onClick={() => onSelect(option)}
                    disabled={disabled}
                    className={`
            relative flex flex-col items-start p-4 rounded-xl border border-border dark:border-surface-muted
            bg-white dark:bg-surface-light text-left transition-all duration-200
            ${disabled
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:border-primary hover:shadow-md cursor-pointer group'
                        }
          `}
                >
                    <div className="flex items-center justify-between w-full mb-2">
                        <span className="text-sm font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-surface-muted px-2 py-1 rounded-md group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            {option.label}
                        </span>
                        <div className={`
              w-6 h-6 rounded-full flex items-center justify-center
              ${disabled ? 'bg-gray-100' : 'bg-primary/5 group-hover:bg-primary text-primary group-hover:text-white'}
              transition-all duration-200
            `}>
                            {disabled ? (
                                <CreditCard className="w-3.5 h-3.5 text-gray-400" />
                            ) : (
                                <ArrowRight className="w-3.5 h-3.5" />
                            )}
                        </div>
                    </div>

                    <p className="text-xs text-gray-500 dark:text-stone-400 leading-snug">
                        {option.description}
                    </p>

                    {/* Active indicator/border effect */}
                    <div className="absolute inset-0 rounded-xl border-2 border-primary opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity" />
                </motion.button>
            ))}
        </div>
    );
};

export default BudgetPoll;
