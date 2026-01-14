/**
 * XPProgressBar Component
 *
 * Displays XP progress with level indicator and milestone markers.
 * Features animated progress bar and gamification visuals.
 */

import { Star, TrendingUp } from 'lucide-react';
import clsx from 'clsx';
import { calculateLevelProgress, getXPThresholds } from './types';

interface XPProgressBarProps {
  xp: number;
  level: number;
  className?: string;
  showMilestones?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function XPProgressBar({
  xp,
  level,
  className,
  showMilestones = false,
  size = 'md',
}: XPProgressBarProps): JSX.Element {
  const progress = calculateLevelProgress(xp, level);
  const { current, next } = getXPThresholds(level);
  const xpToNextLevel = next - xp;

  const sizeConfig = {
    sm: {
      barHeight: 'h-1.5',
      levelBadgeSize: 'w-6 h-6 text-xs',
      fontSize: 'text-xs',
      iconSize: 'w-3 h-3',
      padding: 'p-2',
    },
    md: {
      barHeight: 'h-2',
      levelBadgeSize: 'w-8 h-8 text-sm',
      fontSize: 'text-sm',
      iconSize: 'w-4 h-4',
      padding: 'p-3',
    },
    lg: {
      barHeight: 'h-3',
      levelBadgeSize: 'w-10 h-10 text-base',
      fontSize: 'text-base',
      iconSize: 'w-5 h-5',
      padding: 'p-4',
    },
  };

  const config = sizeConfig[size];

  // Calculate milestone positions (25%, 50%, 75%)
  const milestones = [25, 50, 75];

  return (
    <div className={clsx('rounded-lg bg-slate-800/50', config.padding, className)}>
      {/* Header with level badge and XP info */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {/* Level Badge */}
          <div
            className={clsx(
              'rounded-lg bg-gradient-to-br from-amber-500 to-amber-600',
              'flex items-center justify-center font-bold text-white shadow-lg shadow-amber-500/25',
              config.levelBadgeSize
            )}
          >
            {level}
          </div>
          <div>
            <span className={clsx('font-medium text-white', config.fontSize)}>
              Level {level}
            </span>
            {xpToNextLevel > 0 && (
              <p className="text-xs text-slate-400">
                {xpToNextLevel.toLocaleString()} XP to next level
              </p>
            )}
          </div>
        </div>

        {/* XP Display */}
        <div className="text-right">
          <div className={clsx('flex items-center gap-1', config.fontSize)}>
            <Star className={clsx('text-amber-400', config.iconSize)} />
            <span className="font-semibold text-amber-400">
              {xp.toLocaleString()} XP
            </span>
          </div>
          <p className="text-xs text-slate-500">
            {current.toLocaleString()} / {next.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <div
          className={clsx(
            'w-full bg-slate-700 rounded-full overflow-hidden',
            config.barHeight
          )}
        >
          {/* Animated progress fill */}
          <div
            className={clsx(
              'h-full rounded-full transition-all duration-700 ease-out',
              'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400'
            )}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Milestone markers */}
        {showMilestones && (
          <div className="absolute inset-0 flex items-center">
            {milestones.map((milestone) => (
              <div
                key={milestone}
                className="absolute w-0.5 h-full bg-slate-600"
                style={{ left: `${milestone}%` }}
              >
                <div
                  className={clsx(
                    'absolute -top-4 left-1/2 -translate-x-1/2',
                    'w-2 h-2 rounded-full',
                    progress >= milestone ? 'bg-amber-400' : 'bg-slate-600'
                  )}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Progress percentage */}
      <div className="flex items-center justify-between mt-1">
        <span className="text-xs text-slate-500">{progress}% complete</span>
        {progress > 0 && (
          <span className="flex items-center gap-1 text-xs text-green-400">
            <TrendingUp className="w-3 h-3" />
            Progressing
          </span>
        )}
      </div>
    </div>
  );
}

export default XPProgressBar;
