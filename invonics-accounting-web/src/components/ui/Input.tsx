import React, { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export function Input({
  className,
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  id,
  ...props
}: InputProps) {
  const generatedId = React.useId();
  const inputId = id || generatedId;

  return (
    <div className="w-full flex flex-col">
      {label && (
        <label htmlFor={inputId} className="text-text-secondary text-sm mb-1 font-medium">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3 text-text-muted flex items-center justify-center">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          className={cn(
            'w-full bg-bg-elevated border rounded-lg px-3 py-2 text-text-primary placeholder:text-text-muted transition-colors focus:outline-none focus:ring-2',
            leftIcon ? 'pl-10' : '',
            rightIcon ? 'pr-10' : '',
            error
              ? 'border-danger focus:ring-danger focus:border-danger'
              : 'border-bg-border focus:ring-accent focus:border-transparent',
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 text-text-muted flex items-center justify-center">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <span className="text-danger text-xs mt-1">{error}</span>}
      {hint && !error && <span className="text-text-muted text-xs mt-1">{hint}</span>}
    </div>
  );
}
