import { cn } from '@/lib/utils';
import { forwardRef, ComponentPropsWithoutRef } from 'react';

export const FocusRing = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
      'rounded-md transition-shadow',
      className
    )}
    {...props}
  />
));
FocusRing.displayName = 'FocusRing';
