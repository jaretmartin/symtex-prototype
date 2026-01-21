/**
 * AutonomyLevelIndicator Component
 *
 * Displays the autonomy level badge (L1-L4) with icon, label, and description tooltip.
 * Level 1: Apprentice (asks before every action)
 * Level 2: Collaborator (handles routine tasks)
 * Level 3: Expert (handles complex tasks with review)
 * Level 4: Master (full autonomy with post-hoc review)
 */

import { useState } from 'react';
import { Sprout, Award, Crown, Users } from 'lucide-react';
import clsx from 'clsx';
import type { AutonomyLevel } from './types';
import { AUTONOMY_LEVELS } from './types';

interface AutonomyLevelIndicatorProps {
  level: AutonomyLevel;
  className?: string;
  showLabel?: boolean;
  showDescription?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const iconMap = {
  seedling: Sprout,
  handshake: Users,
  award: Award,
  crown: Crown,
};

export function AutonomyLevelIndicator({
  level,
  className,
  showLabel = true,
  showDescription = false,
  size = 'md',
}: AutonomyLevelIndicatorProps): JSX.Element {
  const [showTooltip, setShowTooltip] = useState(false);
  const config = AUTONOMY_LEVELS[level];
  const Icon = iconMap[config.icon];

  const sizeConfig = {
    sm: {
      iconSize: 'w-3 h-3',
      fontSize: 'text-xs',
      padding: 'px-1.5 py-0.5',
      gap: 'gap-1',
    },
    md: {
      iconSize: 'w-4 h-4',
      fontSize: 'text-sm',
      padding: 'px-2 py-1',
      gap: 'gap-1.5',
    },
    lg: {
      iconSize: 'w-5 h-5',
      fontSize: 'text-base',
      padding: 'px-3 py-1.5',
      gap: 'gap-2',
    },
  };

  const styleConfig = sizeConfig[size];

  return (
    <div
      className={clsx('relative inline-flex', className)}
      onMouseEnter={(): void => setShowTooltip(true)}
      onMouseLeave={(): void => setShowTooltip(false)}
    >
      <div
        className={clsx(
          'inline-flex items-center rounded-lg font-medium',
          'border transition-colors cursor-default',
          config.bgColor,
          config.color,
          config.borderColor,
          styleConfig.padding,
          styleConfig.gap
        )}
      >
        <Icon className={styleConfig.iconSize} />
        {showLabel && (
          <span className={styleConfig.fontSize}>
            L{level}: {config.name}
          </span>
        )}
        {!showLabel && (
          <span className={styleConfig.fontSize}>L{level}</span>
        )}
      </div>

      {/* Inline description (optional) */}
      {showDescription && (
        <p className="text-xs text-muted-foreground mt-1">{config.description}</p>
      )}

      {/* Tooltip */}
      {showTooltip && !showDescription && (
        <div
          className={clsx(
            'absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2',
            'px-3 py-2 rounded-lg bg-surface-card border border-border',
            'shadow-xl whitespace-nowrap'
          )}
        >
          <div className="flex items-center gap-2 mb-1">
            <Icon className="w-4 h-4 text-amber-400" />
            <span className="font-medium text-foreground">{config.name}</span>
          </div>
          <p className="text-xs text-muted-foreground">{config.description}</p>
          <div
            className={clsx(
              'absolute top-full left-1/2 -translate-x-1/2',
              'border-4 border-transparent border-t-surface-card'
            )}
          />
        </div>
      )}
    </div>
  );
}

// Compact variant for inline use
interface AutonomyBadgeProps {
  level: AutonomyLevel;
  className?: string;
}

export function AutonomyBadge({ level, className }: AutonomyBadgeProps): JSX.Element {
  const config = AUTONOMY_LEVELS[level];
  const Icon = iconMap[config.icon];

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
        config.bgColor,
        config.color,
        className
      )}
    >
      <Icon className="w-3 h-3" />
      L{level}
    </span>
  );
}

export default AutonomyLevelIndicator;
