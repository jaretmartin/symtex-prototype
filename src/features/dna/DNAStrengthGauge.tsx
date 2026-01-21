/**
 * DNAStrengthGauge Component
 *
 * Circular gauge showing individual DNA strand strength
 * with confidence indicator and data point count.
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Database,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DNAStrandData } from './dna-store';

interface DNAStrengthGaugeProps {
  strand: DNAStrandData;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  className?: string;
  onClick?: () => void;
}

const sizeConfig = {
  sm: { diameter: 80, strokeWidth: 6, fontSize: 'text-lg' },
  md: { diameter: 120, strokeWidth: 8, fontSize: 'text-2xl' },
  lg: { diameter: 160, strokeWidth: 10, fontSize: 'text-3xl' },
};

function getStrengthStatus(strength: number): {
  label: string;
  color: string;
  icon: React.ElementType;
} {
  if (strength >= 80) {
    return { label: 'Strong', color: 'text-green-400', icon: TrendingUp };
  }
  if (strength >= 60) {
    return { label: 'Moderate', color: 'text-yellow-400', icon: Minus };
  }
  return { label: 'Needs Work', color: 'text-orange-400', icon: TrendingDown };
}

function DNAStrengthGauge({
  strand,
  size = 'md',
  showLabels = true,
  className,
  onClick,
}: DNAStrengthGaugeProps): JSX.Element {
  const config = sizeConfig[size];
  const radius = (config.diameter - config.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strengthOffset = circumference - (strand.strength / 100) * circumference;
  const confidenceOffset = circumference - (strand.confidence / 100) * circumference;

  const status = getStrengthStatus(strand.strength);
  const StatusIcon = status.icon;

  return (
    <div
      className={cn(
        'flex flex-col items-center',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {/* Gauge */}
      <div className="relative" style={{ width: config.diameter, height: config.diameter }}>
        <svg
          width={config.diameter}
          height={config.diameter}
          className="transform -rotate-90"
        >
          {/* Background track */}
          <circle
            cx={config.diameter / 2}
            cy={config.diameter / 2}
            r={radius}
            fill="none"
            stroke="#1e293b"
            strokeWidth={config.strokeWidth}
          />

          {/* Confidence ring (outer, subtle) */}
          <motion.circle
            cx={config.diameter / 2}
            cy={config.diameter / 2}
            r={radius + config.strokeWidth / 2 + 4}
            fill="none"
            stroke={strand.color}
            strokeWidth={2}
            strokeDasharray={circumference * 1.1}
            strokeDashoffset={confidenceOffset * 1.1}
            strokeLinecap="round"
            opacity={0.3}
            initial={{ strokeDashoffset: circumference * 1.1 }}
            animate={{ strokeDashoffset: confidenceOffset * 1.1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />

          {/* Strength ring (main) */}
          <motion.circle
            cx={config.diameter / 2}
            cy={config.diameter / 2}
            r={radius}
            fill="none"
            stroke={strand.color}
            strokeWidth={config.strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strengthOffset}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: strengthOffset }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn('font-bold text-foreground', config.fontSize)}>
            {strand.strength}
          </span>
          {size !== 'sm' && (
            <span className="text-xs text-muted-foreground">strength</span>
          )}
        </div>
      </div>

      {/* Labels */}
      {showLabels && (
        <div className="mt-3 text-center">
          <p className="text-sm font-medium text-foreground">{strand.name}</p>
          <div className="flex items-center justify-center gap-1 mt-1">
            <StatusIcon className={cn('w-3 h-3', status.color)} />
            <span className={cn('text-xs', status.color)}>{status.label}</span>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-3 mt-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              <span>{strand.confidence}% conf.</span>
            </div>
            <div className="flex items-center gap-1">
              <Database className="w-3 h-3" />
              <span>{strand.dataPoints}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(DNAStrengthGauge);
