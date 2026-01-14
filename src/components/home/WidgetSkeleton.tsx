import clsx from 'clsx'

interface WidgetSkeletonProps {
  /** Height of the skeleton in pixels or CSS value */
  height?: number | string
  /** Show header skeleton */
  showHeader?: boolean
  /** Number of content rows to show */
  rows?: number
  /** Additional className */
  className?: string
}

/**
 * WidgetSkeleton - Reusable loading skeleton for dashboard widgets
 *
 * Features:
 * - Configurable height
 * - Animated pulse effect
 * - Header skeleton option
 * - Content area skeleton with rows
 */
export default function WidgetSkeleton({
  height = 200,
  showHeader = true,
  rows = 3,
  className
}: WidgetSkeletonProps): JSX.Element {
  const heightStyle = typeof height === 'number' ? `${height}px` : height

  return (
    <div
      className={clsx(
        'bg-symtex-card rounded-xl border border-symtex-border overflow-hidden animate-pulse',
        className
      )}
      style={{ minHeight: heightStyle }}
    >
      {/* Header Skeleton */}
      {showHeader && (
        <div className="p-5 border-b border-symtex-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Icon placeholder */}
              <div className="w-10 h-10 bg-slate-700 rounded-lg" />
              <div className="space-y-2">
                {/* Title */}
                <div className="h-5 w-32 bg-slate-700 rounded" />
                {/* Subtitle */}
                <div className="h-3 w-48 bg-slate-700/60 rounded" />
              </div>
            </div>
            {/* Action button placeholder */}
            <div className="h-8 w-20 bg-slate-700/60 rounded-lg" />
          </div>
        </div>
      )}

      {/* Content Skeleton */}
      <div className="p-5 space-y-4">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="flex items-center gap-4">
            {/* Icon/avatar placeholder */}
            <div className="w-8 h-8 bg-slate-700 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2">
              {/* Primary text */}
              <div
                className="h-4 bg-slate-700 rounded"
                style={{ width: `${Math.random() * 30 + 60}%` }}
              />
              {/* Secondary text */}
              <div
                className="h-3 bg-slate-700/60 rounded"
                style={{ width: `${Math.random() * 20 + 40}%` }}
              />
            </div>
            {/* Action/value placeholder */}
            <div className="w-12 h-6 bg-slate-700/60 rounded flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  )
}

interface SkeletonTextProps {
  width?: string | number
  height?: number
  className?: string
}

/**
 * SkeletonText - Single line skeleton text placeholder
 */
export function SkeletonText({
  width = '100%',
  height = 16,
  className
}: SkeletonTextProps): JSX.Element {
  const widthStyle = typeof width === 'number' ? `${width}px` : width

  return (
    <div
      className={clsx('bg-slate-700 rounded animate-pulse', className)}
      style={{ width: widthStyle, height: `${height}px` }}
    />
  )
}

interface SkeletonCircleProps {
  size?: number
  className?: string
}

/**
 * SkeletonCircle - Circular skeleton placeholder (for avatars, icons)
 */
export function SkeletonCircle({
  size = 40,
  className
}: SkeletonCircleProps): JSX.Element {
  return (
    <div
      className={clsx('bg-slate-700 rounded-full animate-pulse', className)}
      style={{ width: `${size}px`, height: `${size}px` }}
    />
  )
}

interface SkeletonBoxProps {
  width?: string | number
  height?: string | number
  className?: string
}

/**
 * SkeletonBox - Rectangular skeleton placeholder
 */
export function SkeletonBox({
  width = '100%',
  height = 100,
  className
}: SkeletonBoxProps): JSX.Element {
  const widthStyle = typeof width === 'number' ? `${width}px` : width
  const heightStyle = typeof height === 'number' ? `${height}px` : height

  return (
    <div
      className={clsx('bg-slate-700 rounded-lg animate-pulse', className)}
      style={{ width: widthStyle, height: heightStyle }}
    />
  )
}
