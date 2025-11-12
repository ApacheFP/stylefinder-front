import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-[13px] md:text-[14px] font-roboto font-bold text-text-medium mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-3 min-h-[44px] font-inter text-[13px] md:text-[14px] border rounded-[20px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 hover:border-gray-400 touch-manipulation ${
            error ? 'border-red-500 focus:ring-red-500' : 'border-border-input'
          } ${className}`}
          style={{
            boxShadow: error ? undefined : 'none',
          }}
          onFocus={(e) => {
            if (!error) {
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(13, 110, 253, 0.1)';
            }
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = 'none';
          }}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm font-inter text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
