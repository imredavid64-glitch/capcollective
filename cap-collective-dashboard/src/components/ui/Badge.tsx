'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', dot, children, ...props }, ref) => {
    const variants = {
      default: 'bg-gray-100 text-gray-700',
      success: 'bg-cap-100 text-cap-700',
      warning: 'bg-earth-100 text-earth-700',
      danger: 'bg-red-100 text-red-700',
      info: 'bg-blue-100 text-blue-700',
      outline: 'border border-gray-300 text-gray-600 bg-transparent',
    };
    
    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
      lg: 'px-3 py-1.5 text-base',
    };
    
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1 font-medium rounded-full',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {dot && <span className="relative w-1.5 h-1.5 rounded-full bg-current" />}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';