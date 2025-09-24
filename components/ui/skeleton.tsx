import React from 'react';
import { cn } from '../../lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  animation?: 'pulse' | 'wave' | 'none';
  lines?: number;
}

const skeletonVariants = {
  text: 'h-4 w-full',
  circular: 'rounded-full',
  rectangular: 'rounded-md',
};

const skeletonAnimations = {
  pulse: 'animate-pulse',
  wave: 'animate-wave',
  none: '',
};

export default function Skeleton({
  className,
  variant = 'rectangular',
  animation = 'pulse',
  lines = 1,
  ...props
}: SkeletonProps) {
  if (lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              'bg-gray-200',
              skeletonVariants[variant],
              skeletonAnimations[animation],
              className
            )}
            {...props}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'bg-gray-200',
        skeletonVariants[variant],
        skeletonAnimations[animation],
        className
      )}
      {...props}
    />
  );
}

// Predefined skeleton components for common use cases
export function SkeletonCard() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="space-y-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex justify-between">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex space-x-4">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonList({ items = 3 }: { items?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center space-x-3">
          <Skeleton variant="circular" className="h-10 w-10" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
