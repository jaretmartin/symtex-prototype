/**
 * Skeleton Loading Components
 *
 * Used to show loading states while content is being fetched
 */

import clsx from 'clsx';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'shimmer' | 'none';
}

export function Skeleton({
  className,
  variant = 'rectangular',
  width,
  height,
  animation = 'shimmer',
}: SkeletonProps): JSX.Element {
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const animationClasses = {
    pulse: 'animate-pulse bg-symtex-card',
    shimmer: 'skeleton',
    none: 'bg-symtex-card',
  };

  return (
    <div
      className={clsx(
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
      aria-hidden="true"
    />
  );
}

// Common skeleton patterns

export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}): JSX.Element {
  return (
    <div className={clsx('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          height={16}
          width={i === lines - 1 ? '75%' : '100%'}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }): JSX.Element {
  return (
    <div
      className={clsx(
        'p-5 bg-symtex-card border border-symtex-border rounded-xl',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1 space-y-2">
          <Skeleton height={16} width="60%" />
          <Skeleton height={12} width="40%" />
        </div>
      </div>

      {/* Body */}
      <SkeletonText lines={2} className="mb-4" />

      {/* Footer */}
      <div className="flex items-center gap-2">
        <Skeleton height={24} width={80} className="rounded-full" />
        <Skeleton height={24} width={60} className="rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonMissionCard({ className }: { className?: string }): JSX.Element {
  return (
    <div
      className={clsx(
        'p-5 bg-symtex-card border border-symtex-border rounded-xl border-l-4 border-l-slate-600',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <Skeleton height={20} width="70%" className="mb-2" />
          <Skeleton height={14} width="90%" />
        </div>
        <Skeleton variant="circular" width={32} height={32} />
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <Skeleton height={12} width={60} />
          <Skeleton height={12} width={30} />
        </div>
        <Skeleton height={6} className="rounded-full" />
      </div>

      {/* Tags */}
      <div className="flex items-center gap-2">
        <Skeleton height={22} width={70} className="rounded-full" />
        <Skeleton height={22} width={50} className="rounded-full" />
        <Skeleton height={22} width={60} className="rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonStat({ className }: { className?: string }): JSX.Element {
  return (
    <div
      className={clsx(
        'p-4 bg-symtex-card border border-symtex-border rounded-xl',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1">
          <Skeleton height={24} width={60} className="mb-1" />
          <Skeleton height={14} width={80} />
        </div>
      </div>
    </div>
  );
}

export function SkeletonTable({
  rows = 5,
  columns = 4,
  className,
}: {
  rows?: number;
  columns?: number;
  className?: string;
}): JSX.Element {
  return (
    <div className={clsx('space-y-2', className)}>
      {/* Header */}
      <div className="flex items-center gap-4 p-3 bg-symtex-elevated rounded-lg">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} height={14} width={`${100 / columns}%`} />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="flex items-center gap-4 p-3 bg-symtex-card border border-symtex-border rounded-lg"
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              height={16}
              width={`${100 / columns}%`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
