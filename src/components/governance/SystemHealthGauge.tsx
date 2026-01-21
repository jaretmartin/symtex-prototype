/**
 * SystemHealthGauge Component
 *
 * Circular gauge displaying system health percentage with status indicator.
 * Used in the Command Center dashboard for real-time system monitoring.
 */

import clsx from 'clsx';
import type { SystemHealthGaugeProps, SystemStatus } from './types';
import { SYSTEM_STATUS_CONFIG } from './types';

const getGaugeColor = (health: number): string => {
  if (health < 70) return 'stroke-red-500';
  if (health < 85) return 'stroke-amber-500';
  return 'stroke-green-500';
};

const getStatusTextColor = (status: SystemStatus): string => {
  return SYSTEM_STATUS_CONFIG[status].color;
};

export function SystemHealthGauge({
  health,
  status,
  className,
}: SystemHealthGaugeProps): JSX.Element {
  const circumference = 2 * Math.PI * 45;
  const progress = (health / 100) * circumference;

  return (
    <div className={clsx('relative w-32 h-32', className)}>
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          className="text-muted-foreground"
          strokeWidth="8"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          className={getGaugeColor(health)}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${progress} ${circumference}`}
          style={{
            transition: 'stroke-dasharray 0.5s ease-out',
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={clsx('text-3xl font-bold', getStatusTextColor(status))}>
          {health}%
        </span>
        <span className="text-xs text-muted-foreground capitalize">{status}</span>
      </div>
    </div>
  );
}

export default SystemHealthGauge;
