import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
}

const badgeVariants = {
  default: 'bg-blue-100 text-blue-800 border-blue-200',
  secondary: 'bg-gray-100 text-gray-800 border-gray-200',
  destructive: 'bg-red-100 text-red-800 border-red-200',
  outline: 'border border-gray-300 text-gray-700 bg-white',
  success: 'bg-green-100 text-green-800 border-green-200',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  info: 'bg-blue-100 text-blue-800 border-blue-200',
};

const badgeSizes = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-2.5 py-1.5 text-sm',
  lg: 'px-3 py-2 text-base',
};

function Badge({
  className,
  variant = 'default',
  size = 'md',
  dot = false,
  children,
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium',
        badgeVariants[variant],
        badgeSizes[size],
        className
      )}
      {...props}
    >
      {dot && (
        <div
          className={cn(
            'h-1.5 w-1.5 rounded-full',
            variant === 'default' && 'bg-blue-600',
            variant === 'secondary' && 'bg-gray-600',
            variant === 'destructive' && 'bg-red-600',
            variant === 'outline' && 'bg-gray-600',
            variant === 'success' && 'bg-green-600',
            variant === 'warning' && 'bg-yellow-600',
            variant === 'info' && 'bg-blue-600'
          )}
        />
      )}
      {children}
    </div>
  );
}

export { Badge };
export default Badge;
