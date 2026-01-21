/**
 * MetricCard Component
 *
 * Displays individual ROI metrics with trend indicators.
 * Shows value, label, trend direction, and percentage change.
 */

import { Clock, DollarSign, TrendingDown, TrendingUp, Minus, Zap, Cpu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import type { ROIMetric, TrendDirection } from './insights-store';

interface MetricCardProps {
  metric: ROIMetric;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const iconMap = {
  clock: Clock,
  dollar: DollarSign,
  'dollar-off': DollarSign,
  multiply: X,
  zap: Zap,
  cpu: Cpu,
};

const trendConfig: Record<
  TrendDirection,
  {
    icon: typeof TrendingUp;
    color: string;
    bgColor: string;
  }
> = {
  up: {
    icon: TrendingUp,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
  },
  down: {
    icon: TrendingDown,
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
  },
  stable: {
    icon: Minus,
    color: 'text-muted-foreground',
    bgColor: 'bg-muted/10',
  },
};

export function MetricCard({ metric, className, size = 'md' }: MetricCardProps) {
  const Icon = iconMap[metric.icon] || DollarSign;
  const trendInfo = trendConfig[metric.trend];
  const TrendIcon = trendInfo.icon;

  // For "actual spend", down is good (green), up is bad (red)
  const isSpendMetric = metric.id === 'actual-spend';
  const effectiveTrend = isSpendMetric
    ? metric.trend === 'down'
      ? trendConfig.up
      : metric.trend === 'up'
        ? trendConfig.down
        : trendConfig.stable
    : trendInfo;

  const sizeClasses = {
    sm: {
      card: 'p-3',
      icon: 'w-8 h-8',
      iconInner: 'w-4 h-4',
      value: 'text-lg',
      label: 'text-xs',
      trend: 'text-xs',
    },
    md: {
      card: 'p-4',
      icon: 'w-10 h-10',
      iconInner: 'w-5 h-5',
      value: 'text-2xl',
      label: 'text-sm',
      trend: 'text-xs',
    },
    lg: {
      card: 'p-6',
      icon: 'w-12 h-12',
      iconInner: 'w-6 h-6',
      value: 'text-3xl',
      label: 'text-base',
      trend: 'text-sm',
    },
  };

  const sizes = sizeClasses[size];

  return (
    <Card
      className={cn(
        'bg-card/50 border-border/50 hover:border-border/50 transition-all duration-200',
        className
      )}
    >
      <CardContent className={cn('flex items-start justify-between', sizes.card)}>
        <div className="flex-1">
          {/* Icon and Label */}
          <div className="flex items-center gap-2 mb-2">
            <div
              className={cn(
                'rounded-lg flex items-center justify-center',
                sizes.icon,
                metric.icon === 'dollar-off' ? 'bg-emerald-500/10' : 'bg-indigo-500/10'
              )}
            >
              <Icon
                className={cn(
                  sizes.iconInner,
                  metric.icon === 'dollar-off' ? 'text-emerald-400' : 'text-indigo-400'
                )}
              />
            </div>
          </div>

          {/* Value */}
          <p className={cn('font-bold text-foreground mb-1', sizes.value)}>{metric.value}</p>

          {/* Label */}
          <p className={cn('text-muted-foreground font-medium', sizes.label)}>{metric.label}</p>

          {/* Description (if provided) */}
          {metric.description && size === 'lg' && (
            <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
          )}
        </div>

        {/* Trend Indicator */}
        {metric.trendPercent !== undefined && (
          <div
            className={cn('flex items-center gap-1 px-2 py-1 rounded-full', effectiveTrend.bgColor)}
          >
            <TrendIcon className={cn('w-3 h-3', effectiveTrend.color)} />
            <span className={cn('font-medium', sizes.trend, effectiveTrend.color)}>
              {Math.abs(metric.trendPercent)}%
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface MetricGridProps {
  metrics: ROIMetric[];
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function MetricGrid({ metrics, className, size = 'md' }: MetricGridProps) {
  return (
    <div
      className={cn('grid gap-4', 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4', className)}
    >
      {metrics.map((metric) => (
        <MetricCard key={metric.id} metric={metric} size={size} />
      ))}
    </div>
  );
}

export default MetricCard;
