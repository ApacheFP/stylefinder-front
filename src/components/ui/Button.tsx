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
    const baseStyles = 'inline-flex items-center justify-center font-inter font-bold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation';
    
    const variants = {
      primary: 'bg-primary text-white hover:bg-primary-hover hover:brightness-110 focus:ring-primary active:brightness-90',
      secondary: 'bg-gray-200 text-text-dark hover:bg-gray-300 hover:brightness-95 focus:ring-gray-500 active:brightness-90',
      outline: 'border border-border-input text-text-dark hover:bg-gray-50 hover:border-gray-400 focus:ring-gray-500 active:bg-gray-100',
      ghost: 'text-text-medium hover:bg-gray-50 hover:text-text-dark focus:ring-gray-500 active:bg-gray-100',
    };
    
    const sizes = {
      sm: 'px-4 py-2 min-h-[44px] text-[13px]',
      md: 'px-5 py-2.5 min-h-[44px] text-[14px]',
      lg: 'px-6 py-3 min-h-[48px] text-[14px]',
    };

    return (
      <motion.button
        ref={ref as any}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        whileTap={!disabled && !isLoading ? tapScale : undefined}
        whileHover={!disabled && !isLoading ? { scale: 1.02 } : undefined}
        type={props.type}
        onClick={props.onClick}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
