/**
 * Unified Button Component
 *
 * Replaces all button variants across the application with a single,
 * consistent, accessible component.
 */

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import clsx from 'clsx';

const buttonVariants = cva(
  // Base styles
  [
    'inline-flex items-center justify-center gap-2 font-medium',
    'transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-symtex-dark',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-gradient-to-r from-symtex-primary to-symtex-accent',
          'text-white',
          'shadow-lg shadow-symtex-primary/25',
          'hover:opacity-90 hover:shadow-xl hover:shadow-symtex-primary/30',
          'focus-visible:ring-symtex-primary',
        ],
        secondary: [
          'bg-symtex-card border border-symtex-border',
          'text-slate-300',
          'hover:text-white hover:border-slate-500 hover:bg-symtex-elevated',
          'focus-visible:ring-slate-500',
        ],
        ghost: [
          'bg-transparent',
          'text-slate-400',
          'hover:text-white hover:bg-slate-800/50',
          'focus-visible:ring-slate-500',
        ],
        outline: [
          'bg-transparent border-2 border-symtex-primary',
          'text-symtex-primary',
          'hover:bg-symtex-primary/10',
          'focus-visible:ring-symtex-primary',
        ],
        danger: [
          'bg-error/10 border border-error/30',
          'text-error',
          'hover:bg-error/20',
          'focus-visible:ring-error',
        ],
        success: [
          'bg-success/10 border border-success/30',
          'text-success',
          'hover:bg-success/20',
          'focus-visible:ring-success',
        ],
        warning: [
          'bg-warning/10 border border-warning/30',
          'text-warning',
          'hover:bg-warning/20',
          'focus-visible:ring-warning',
        ],
        gold: [
          'bg-gradient-to-r from-symtex-gold to-symtex-gold-dark',
          'text-gray-900',
          'shadow-lg shadow-symtex-gold/25',
          'hover:opacity-90',
          'focus-visible:ring-symtex-gold',
        ],
      },
      size: {
        xs: 'h-7 px-2.5 text-xs rounded-md',
        sm: 'h-8 px-3 text-sm rounded-lg',
        md: 'h-10 px-4 text-sm rounded-xl',
        lg: 'h-12 px-6 text-base rounded-xl',
        xl: 'h-14 px-8 text-lg rounded-2xl',
        icon: 'h-10 w-10 rounded-xl',
        'icon-sm': 'h-8 w-8 rounded-lg',
        'icon-lg': 'h-12 w-12 rounded-xl',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const isIconOnly = size?.toString().startsWith('icon');

    return (
      <button
        ref={ref}
        className={clsx(buttonVariants({ variant, size, fullWidth }), className)}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        aria-disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span
            className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"
            aria-hidden="true"
          />
        ) : (
          leftIcon
        )}

        {!isIconOnly && children}

        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';

// Export variants for external use
export { buttonVariants };
