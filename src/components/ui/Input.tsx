import { forwardRef, useState } from 'react';
import type { InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', type = 'text', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';

    return (
      <div className="w-full">
        {label && (
          <label className="block text-[13px] md:text-[14px] font-roboto font-bold text-text-medium mb-1.5 dark:text-gray-300">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            type={isPassword ? (showPassword ? 'text' : 'password') : type}
            className={`w-full px-4 py-3 min-h-[44px] font-inter text-[13px] md:text-[14px] border rounded-[20px] focus-ring hover:border-gray-400 touch-manipulation dark:bg-gray-800 dark:border-gray-700 dark:text-white ${error ? 'border-red-500 focus:ring-red-500' : 'border-border-input'
              } ${className} ${isPassword ? 'pr-12' : ''}`}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm font-inter text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
