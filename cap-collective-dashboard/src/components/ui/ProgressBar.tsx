'use client';

import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  label?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const variants = {
  default: 'bg-cap-600',
  success: 'bg-cap-500',
  warning: 'bg-earth-500',
  danger: 'bg-red-500',
};

const sizes = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

const labelSizes = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

export function ProgressBar({ 
  value, 
  max = 100, 
  showLabel = true, 
  label, 
  variant = 'default', 
  size = 'md',
  className 
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));
  
  return (
    <div className={cn('w-full', className)}>
      {(showLabel || label) && (
        <div className="flex justify-between mb-1">
          <span className={cn('font-medium text-gray-700', labelSizes[size])}>
            {label || `${percentage}%`}
          </span>
          {showLabel && (
            <span className={cn('font-mono text-gray-500', labelSizes[size])}>
              {percentage}%
            </span>
          )}
        </div>
      )}
      <div className={cn('relative w-full bg-gray-100 rounded-full overflow-hidden', sizes[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out', variants[variant])}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}