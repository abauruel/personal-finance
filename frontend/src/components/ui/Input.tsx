import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-3.5 border rounded-2xl text-base',
            'focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent',
            'disabled:bg-slate-50 disabled:cursor-not-allowed',
            'transition-all duration-200 placeholder:text-slate-400',
            'bg-white hover:border-slate-300 shadow-sm',
            error
              ? 'border-red-300 focus:ring-red-500 bg-red-50/30'
              : 'border-slate-200',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
