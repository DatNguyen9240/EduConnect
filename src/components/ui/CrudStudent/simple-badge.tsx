import type React from 'react';
import { cn } from '@/lib/utils';

interface SimpleBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger';
  className?: string;
}

export function SimpleBadge({ children, variant = 'default', className }: SimpleBadgeProps) {
  const baseClasses = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium';

  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    secondary: 'bg-blue-100 text-blue-800',
    outline: 'border border-gray-200 bg-white text-gray-700',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
  };

  return <span className={cn(baseClasses, variantClasses[variant], className)}>{children}</span>;
}
