import React from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'income' | 'expense' | 'drawing' | 'success' | 'warning' | 'neutral';
}

export function Badge({ className, variant = 'neutral', children, ...props }: BadgeProps) {
  const variants = {
    income: 'bg-accent-subtle text-accent',
    expense: 'bg-danger-subtle text-danger',
    drawing: 'bg-warning-subtle text-warning',
    success: 'bg-accent-subtle text-accent',
    warning: 'bg-warning-subtle text-warning',
    neutral: 'bg-bg-elevated text-text-secondary',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
