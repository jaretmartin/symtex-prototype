/**
 * ContextSourceBadge Component
 *
 * Displays a badge for context sources that informed AI reasoning.
 * Shows source type, name, relevance score, and provides interactivity.
 */

import { useState } from 'react';
import {
  Layers,
  Brain,
  History,
  ExternalLink,
  Info,
} from 'lucide-react';
import clsx from 'clsx';
import type { ContextSource, ContextSourceType } from '@/types/entities/reasoning';

export interface ContextSourceBadgeProps {
  /** The context source to display */
  source: ContextSource;
  /** Click handler for navigation */
  onClick?: () => void;
  /** Whether to show the relevance score */
  showRelevance?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Get icon and color configuration for each source type
 */
function getSourceConfig(type: ContextSourceType): {
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
  label: string;
} {
  const configs: Record<
    ContextSourceType,
    {
      icon: React.ElementType;
      color: string;
      bgColor: string;
      borderColor: string;
      label: string;
    }
  > = {
    space: {
      icon: Layers,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      label: 'Space',
    },
    cognate: {
      icon: Brain,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      label: 'Cognate',
    },
    history: {
      icon: History,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      label: 'History',
    },
    external: {
      icon: ExternalLink,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/30',
      label: 'External',
    },
  };
  return configs[type];
}

/**
 * Tooltip component for displaying additional details
 */
function Tooltip({
  source,
  visible,
}: {
  source: ContextSource;
  visible: boolean;
}): JSX.Element {
  const config = getSourceConfig(source.type);
  const relevancePercent = Math.round(source.relevance * 100);

  return (
    <div
      className={clsx(
        'absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50',
        'w-64 p-3 rounded-lg shadow-lg',
        'bg-card border border-border',
        'transition-all duration-200 pointer-events-none',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
      )}
      role="tooltip"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <config.icon className={clsx('w-4 h-4', config.color)} />
        <span className="font-medium text-foreground text-sm">{source.name}</span>
      </div>

      {/* Details */}
      <div className="space-y-1.5 text-xs">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Type</span>
          <span className={config.color}>{config.label}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">ID</span>
          <span className="text-muted-foreground font-mono truncate max-w-[120px]">
            {source.id}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Relevance</span>
          <div className="flex items-center gap-2">
            <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={clsx(
                  'h-full rounded-full',
                  source.relevance >= 0.7
                    ? 'bg-green-500'
                    : source.relevance >= 0.3
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                )}
                style={{ width: `${relevancePercent}%` }}
              />
            </div>
            <span className="text-muted-foreground tabular-nums">{relevancePercent}%</span>
          </div>
        </div>
      </div>

      {/* Arrow */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
        <div className="border-8 border-transparent border-t-card" />
      </div>
    </div>
  );
}

/**
 * ContextSourceBadge - Displays context source information
 *
 * @example
 * // Basic badge
 * <ContextSourceBadge source={source} />
 *
 * // With relevance and click handler
 * <ContextSourceBadge
 *   source={source}
 *   showRelevance
 *   onClick={() => navigateToSource(source.id)}
 * />
 */
export default function ContextSourceBadge({
  source,
  onClick,
  showRelevance = false,
  className,
}: ContextSourceBadgeProps): JSX.Element {
  const [showTooltip, setShowTooltip] = useState(false);
  const config = getSourceConfig(source.type);
  const Icon = config.icon;
  const relevancePercent = Math.round(source.relevance * 100);

  const isClickable = Boolean(onClick);

  const badgeContent = (
    <>
      {/* Type Icon */}
      <Icon className={clsx('w-3.5 h-3.5', config.color)} aria-hidden="true" />

      {/* Source Name */}
      <span className="text-muted-foreground text-xs font-medium truncate max-w-[120px]">
        {source.name}
      </span>

      {/* Relevance Score */}
      {showRelevance && (
        <span
          className={clsx(
            'text-xs tabular-nums px-1.5 py-0.5 rounded',
            source.relevance >= 0.7
              ? 'text-green-400 bg-green-500/10'
              : source.relevance >= 0.3
                ? 'text-yellow-400 bg-yellow-500/10'
                : 'text-red-400 bg-red-500/10'
          )}
        >
          {relevancePercent}%
        </span>
      )}

      {/* Info indicator for tooltip */}
      <Info
        className="w-3 h-3 text-muted-foreground group-hover:text-muted-foreground transition-colors"
        aria-hidden="true"
      />
    </>
  );

  const baseClasses = clsx(
    'group relative inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg',
    'border transition-all duration-200',
    config.bgColor,
    config.borderColor,
    isClickable && 'cursor-pointer hover:border-opacity-60 hover:bg-opacity-20',
    className
  );

  // Render as button if clickable, otherwise as span
  if (isClickable) {
    return (
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        className={baseClasses}
        aria-label={`View ${source.name} (${config.label}, ${relevancePercent}% relevance)`}
      >
        {badgeContent}
        <Tooltip source={source} visible={showTooltip} />
      </button>
    );
  }

  return (
    <span
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      className={baseClasses}
      role="status"
      aria-label={`${source.name} (${config.label}, ${relevancePercent}% relevance)`}
    >
      {badgeContent}
      <Tooltip source={source} visible={showTooltip} />
    </span>
  );
}
