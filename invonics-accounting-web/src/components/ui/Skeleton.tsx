import React from 'react';
import { cn } from '../../utils/cn';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'line' | 'circle' | 'rect';
}

export function Skeleton({ className, variant = 'line', ...props }: SkeletonProps) {
  const variants = {
    line: 'h-4 w-full rounded',
    circle: 'rounded-full',
    rect: 'rounded-lg h-full w-full',
  };

  return (
    <div
      className={cn('bg-bg-elevated animate-pulse', variants[variant], className)}
      {...props}
    />
  );
}
