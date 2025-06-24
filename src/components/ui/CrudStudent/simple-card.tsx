import type React from 'react';
import { cn } from '@/lib/utils';

interface SimpleCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface SimpleCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface SimpleCardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

interface SimpleCardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

interface SimpleCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface SimpleCardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function SimpleCard({ children, className, ...props }: SimpleCardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-gray-200 bg-white text-gray-950 shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function SimpleCardHeader({ children, className, ...props }: SimpleCardHeaderProps) {
  return (
    <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props}>
      {children}
    </div>
  );
}

export function SimpleCardTitle({ children, className, ...props }: SimpleCardTitleProps) {
  return (
    <h3 className={cn('text-2xl font-semibold leading-none tracking-tight', className)} {...props}>
      {children}
    </h3>
  );
}

export function SimpleCardDescription({
  children,
  className,
  ...props
}: SimpleCardDescriptionProps) {
  return (
    <p className={cn('text-sm text-gray-500', className)} {...props}>
      {children}
    </p>
  );
}

export function SimpleCardContent({ children, className, ...props }: SimpleCardContentProps) {
  return (
    <div className={cn('p-6 pt-0', className)} {...props}>
      {children}
    </div>
  );
}

export function SimpleCardFooter({ children, className, ...props }: SimpleCardFooterProps) {
  return (
    <div className={cn('flex items-center p-6 pt-0', className)} {...props}>
      {children}
    </div>
  );
}
