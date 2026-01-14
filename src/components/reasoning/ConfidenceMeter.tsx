/**
 * ConfidenceMeter Component
 *
 * A visual indicator for confidence levels (0-1 or 0-100%).
 * Supports multiple display variants: progress bar, radial gauge, or simple badge.
 * Color coding: red (< 0.3), yellow (0.3-0.7), green (> 0.7)
 */

import clsx from 'clsx';

export interface ConfidenceMeterProps {
  /** Confidence value from 0 to 1 */
  value: number;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to show the percentage label */
  showLabel?: boolean;
  /** Display variant */
  variant?: 'bar' | 'radial' | 'badge';
  /** Additional CSS classes */
  className?: string;
}

/**
 * Get the color class based on confidence value
 */
function getColorClass(value: number): {
  text: string;
  bg: string;
  stroke: string;
  bgLight: string;
} {
  if (value < 0.3) {
    return {
      text: 'text-red-400',
      bg: 'bg-red-500',
      stroke: '#ef4444',
      bgLight: 'bg-red-500/20',
    };
  }
  if (value < 0.7) {
    return {
      text: 'text-yellow-400',
      bg: 'bg-yellow-500',
      stroke: '#eab308',
      bgLight: 'bg-yellow-500/20',
    };
  }
  return {
    text: 'text-green-400',
    bg: 'bg-green-500',
    stroke: '#22c55e',
    bgLight: 'bg-green-500/20',
  };
}

/**
 * Get size configurations
 */
function getSizeConfig(
  size: 'sm' | 'md' | 'lg'
): {
  height: string;
  radialSize: number;
  strokeWidth: number;
  textSize: string;
  padding: string;
} {
  const configs = {
    sm: {
      height: 'h-1.5',
      radialSize: 32,
      strokeWidth: 3,
      textSize: 'text-xs',
      padding: 'px-1.5 py-0.5',
    },
    md: {
      height: 'h-2',
      radialSize: 48,
      strokeWidth: 4,
      textSize: 'text-sm',
      padding: 'px-2 py-1',
    },
    lg: {
      height: 'h-3',
      radialSize: 64,
      strokeWidth: 5,
      textSize: 'text-base',
      padding: 'px-3 py-1.5',
    },
  };
  return configs[size];
}

/**
 * Progress bar variant
 */
function BarMeter({
  value,
  size,
  showLabel,
  className,
}: ConfidenceMeterProps): JSX.Element {
  const colors = getColorClass(value);
  const config = getSizeConfig(size || 'md');
  const percentage = Math.round(value * 100);

  return (
    <div className={clsx('flex items-center gap-2', className)}>
      <div
        className={clsx(
          'flex-1 bg-slate-700 rounded-full overflow-hidden',
          config.height
        )}
      >
        <div
          className={clsx(
            'h-full rounded-full transition-all duration-500 ease-out',
            colors.bg
          )}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Confidence: ${percentage}%`}
        />
      </div>
      {showLabel && (
        <span className={clsx('font-medium tabular-nums', config.textSize, colors.text)}>
          {percentage}%
        </span>
      )}
    </div>
  );
}

/**
 * Radial gauge variant
 */
function RadialMeter({
  value,
  size,
  showLabel,
  className,
}: ConfidenceMeterProps): JSX.Element {
  const colors = getColorClass(value);
  const config = getSizeConfig(size || 'md');
  const percentage = Math.round(value * 100);

  const radius = (config.radialSize - config.strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - value * circumference;

  return (
    <div
      className={clsx('relative inline-flex items-center justify-center', className)}
      role="progressbar"
      aria-valuenow={percentage}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Confidence: ${percentage}%`}
    >
      <svg
        width={config.radialSize}
        height={config.radialSize}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={config.radialSize / 2}
          cy={config.radialSize / 2}
          r={radius}
          stroke="#334155"
          strokeWidth={config.strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={config.radialSize / 2}
          cy={config.radialSize / 2}
          r={radius}
          stroke={colors.stroke}
          strokeWidth={config.strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {showLabel && (
        <span
          className={clsx(
            'absolute font-semibold tabular-nums',
            config.textSize,
            colors.text
          )}
        >
          {percentage}%
        </span>
      )}
    </div>
  );
}

/**
 * Badge variant
 */
function BadgeMeter({
  value,
  size,
  showLabel,
  className,
}: ConfidenceMeterProps): JSX.Element {
  const colors = getColorClass(value);
  const config = getSizeConfig(size || 'md');
  const percentage = Math.round(value * 100);

  const label = showLabel
    ? `${percentage}%`
    : value < 0.3
      ? 'Low'
      : value < 0.7
        ? 'Medium'
        : 'High';

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full font-medium',
        config.padding,
        config.textSize,
        colors.bgLight,
        colors.text,
        className
      )}
      role="status"
      aria-label={`Confidence: ${percentage}%`}
    >
      {label}
    </span>
  );
}

/**
 * ConfidenceMeter - Visual confidence indicator
 *
 * @example
 * // Progress bar with label
 * <ConfidenceMeter value={0.85} variant="bar" showLabel />
 *
 * // Radial gauge
 * <ConfidenceMeter value={0.45} variant="radial" size="lg" showLabel />
 *
 * // Simple badge
 * <ConfidenceMeter value={0.2} variant="badge" />
 */
export default function ConfidenceMeter({
  value,
  size = 'md',
  showLabel = true,
  variant = 'bar',
  className,
}: ConfidenceMeterProps): JSX.Element {
  // Clamp value between 0 and 1
  const clampedValue = Math.max(0, Math.min(1, value));

  const props = {
    value: clampedValue,
    size,
    showLabel,
    className,
  };

  switch (variant) {
    case 'radial':
      return <RadialMeter {...props} />;
    case 'badge':
      return <BadgeMeter {...props} />;
    case 'bar':
    default:
      return <BarMeter {...props} />;
  }
}
