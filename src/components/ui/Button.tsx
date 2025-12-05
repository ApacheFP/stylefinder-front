import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { tapScale } from '../../utils/animations';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center font-inter font-bold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation ripple-effect';

    const variants = {
      primary: 'bg-primary text-white hover:bg-primary-hover hover:brightness-110 focus:ring-primary/30 active:brightness-90 shadow-sm hover:shadow-md',
      secondary: 'bg-cream-300 dark:bg-surface-muted text-text-dark dark:text-white hover:bg-cream-400 dark:hover:bg-surface-border hover:brightness-95 focus:ring-primary/30 active:brightness-90',
      outline: 'border-2 border-cream-400 dark:border-surface-border text-text-dark dark:text-stone-200 hover:bg-cream-200 dark:hover:bg-surface-muted hover:border-primary/50 dark:hover:border-gray-500 focus:ring-primary/30 active:bg-cream-300 dark:active:bg-gray-600',
      ghost: 'text-text-medium dark:text-stone-300 hover:bg-cream-200 dark:hover:bg-surface-darker hover:text-text-dark dark:hover:text-white focus:ring-primary/30 active:bg-cream-300 dark:active:bg-gray-700',
    };

    const sizes = {
      sm: 'px-4 py-2 min-h-[44px] text-[13px] rounded-lg',
      md: 'px-5 py-2.5 min-h-[44px] text-[14px] rounded-xl',
      lg: 'px-6 py-3 min-h-[48px] text-[15px] rounded-xl',
    };

    return (
      <motion.button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        whileTap={!disabled && !isLoading ? tapScale : undefined}
        whileHover={!disabled && !isLoading ? { scale: 1.02 } : undefined}
        type={props.type}
        onClick={props.onClick}
        onSubmit={props.onSubmit}
        form={props.form}
        name={props.name}
        value={props.value}
        aria-label={props['aria-label']}
        aria-describedby={props['aria-describedby']}
        aria-disabled={disabled || isLoading}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
