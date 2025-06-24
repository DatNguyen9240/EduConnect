import type React from 'react';
import { cn } from '@/lib/utils';

interface SimpleLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  required?: boolean;
}

export function SimpleLabel({ children, required, className, ...props }: SimpleLabelProps) {
  return (
    <label className={cn('text-sm font-medium leading-none text-gray-900', className)} {...props}>
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}
