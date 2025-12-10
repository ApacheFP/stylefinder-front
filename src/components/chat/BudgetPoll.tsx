
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, ArrowRight } from 'lucide-react';
import type { BudgetOption } from '../../types';

interface BudgetPollProps {
    options: BudgetOption[];
    onSelect: (option: BudgetOption) => void;
    disabled?: boolean;
}

const BudgetPoll: React.FC<BudgetPollProps> = ({ options, onSelect, disabled }) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 mb-2">
            {options.map((option, index) => {
                const isHovered = hoveredIndex === index && !disabled;
                return (
                    <motion.button
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{
                            opacity: 1,
                            y: isHovered ? -3 : 0,
                            scale: 1
                        }}
                        whileTap={!disabled ? { scale: 0.97 } : undefined}
                        transition={{
                            duration: 0.2,
                            delay: index * 0.1,
                            y: { duration: 0.15 }
                        }}
                        onClick={() => onSelect(option)}
                        disabled={disabled}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        className={`
                            relative flex flex-col items-start p-4 rounded-xl border backdrop-blur-sm
                            text-left overflow-hidden
                            ${disabled
                                ? 'opacity-50 cursor-not-allowed border-cream-300 dark:border-surface-border bg-cream-100/80 dark:bg-surface-darker/80'
                                : isHovered
                                    ? 'border-primary cursor-pointer bg-gradient-to-br from-cream-50 via-cream-100 to-primary/5 dark:from-surface-dark dark:via-surface-darker dark:to-primary/10'
                                    : 'border-cream-300 dark:border-surface-border cursor-pointer bg-cream-100/90 dark:bg-surface-darker/90'
                            }
                        `}
                        style={isHovered && !disabled ? {
                            boxShadow: '0 0 25px rgba(166, 124, 82, 0.4), 0 8px 20px rgba(0, 0, 0, 0.1)'
                        } : {}}
                    >
                        {/* Subtle shimmer overlay on hover */}
                        {isHovered && !disabled && (
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
                                initial={{ x: '-100%' }}
                                animate={{ x: '100%' }}
                                transition={{ duration: 0.6, ease: 'easeInOut' }}
                            />
                        )}

                        <div className="flex items-center justify-between w-full mb-2 relative z-10">
                            <span className={`
                                text-sm font-bold px-2.5 py-1 rounded-lg transition-all duration-200
                                ${isHovered
                                    ? 'bg-primary/15 text-primary shadow-sm'
                                    : 'text-text-dark dark:text-white bg-cream-200/80 dark:bg-surface-muted/80'
                                }
                            `}>
                                {option.label}
                            </span>
                            <motion.div
                                className={`
                                    w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200
                                    ${disabled
                                        ? 'bg-cream-200 dark:bg-surface-muted'
                                        : isHovered
                                            ? 'bg-primary text-white shadow-md'
                                            : 'bg-primary/10 text-primary'
                                    }
                                `}
                                animate={isHovered ? { x: 2 } : { x: 0 }}
                                transition={{ duration: 0.15 }}
                            >
                                {disabled ? (
                                    <CreditCard className="w-3.5 h-3.5 text-text-muted dark:text-stone-500" />
                                ) : (
                                    <ArrowRight className="w-4 h-4" />
                                )}
                            </motion.div>
                        </div>

                        <p className="text-xs text-text-muted dark:text-stone-400 leading-snug relative z-10">
                            {option.description}
                        </p>
                    </motion.button>
                );
            })}
        </div>
    );
};

export default BudgetPoll;
