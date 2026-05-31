import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  isFullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isFullWidth = false,
  className,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-violet-600 text-white hover:bg-violet-700 focus:ring-violet-500 shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 hover:-translate-y-0.5',
    secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-400 shadow-md',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-400 shadow-lg shadow-red-500/30',
    ghost: 'bg-transparent hover:bg-slate-50 text-slate-700 focus:ring-slate-300 shadow-none',
  };

  const sizes = {
    sm: 'px-5 py-2.5 text-sm h-10',
    md: 'px-7 py-3.5 text-base h-12',
    lg: 'px-9 py-4 text-lg h-14',
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        isFullWidth && 'w-full',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};
