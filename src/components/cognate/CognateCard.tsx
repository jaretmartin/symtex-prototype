/**
 * CognateCard Component
 *
 * Standalone card displaying Cognate information with XP, skills, and autonomy.
 * Features: Avatar, name, role, XP progress, skill badges, autonomy level, status.
 */

import { Brain } from 'lucide-react';
import clsx from 'clsx';
import type { ExtendedCognate, CognateAvailabilityStatus } from './types';
import { AVAILABILITY_STATUS_CONFIG } from './types';
import { XPProgressBar } from './XPProgressBar';
import { AutonomyBadge } from './AutonomyLevelIndicator';
import { SkillBadges } from './SkillBadges';

interface CognateCardProps {
  cognate: ExtendedCognate;
  onClick?: (cognate: ExtendedCognate) => void;
  selected?: boolean;
  className?: string;
  compact?: boolean;
}

export function CognateCard({
  cognate,
  onClick,
  selected = false,
  className,
  compact = false,
}: CognateCardProps): JSX.Element {
  const handleClick = (): void => {
    if (onClick) {
      onClick(cognate);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if ((e.key === 'Enter' || e.key === ' ') && onClick) {
      e.preventDefault();
      onClick(cognate);
    }
  };

  if (compact) {
    return (
      <CompactCognateCard
        cognate={cognate}
        onClick={onClick}
        selected={selected}
        className={className}
      />
    );
  }

  return (
    <div
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={clsx(
        'p-5 bg-zinc-900/50 border rounded-lg transition-all',
        onClick && 'cursor-pointer hover:border-zinc-600',
        selected
          ? 'border-symtex-primary bg-symtex-primary/5'
          : 'border-zinc-800',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          {cognate.avatar ? (
            <img
              src={cognate.avatar}
              alt={cognate.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
          )}
          <div>
            <h3 className="font-medium text-white">{cognate.name}</h3>
            <p className="text-sm text-zinc-400">
              {cognate.role || 'No role assigned'}
            </p>
          </div>
        </div>

        {/* Status indicator */}
        <StatusIndicator status={cognate.availability} />
      </div>

      {/* Description */}
      {cognate.description && (
        <p className="text-sm text-zinc-400 line-clamp-2 mb-4">
          {cognate.description}
        </p>
      )}

      {/* XP Progress */}
      <div className="mb-4">
        <XPProgressBar xp={cognate.xp} level={cognate.level} size="sm" />
      </div>

      {/* Skills */}
      {cognate.skills.length > 0 && (
        <div className="mb-4">
          <SkillBadges
            skills={cognate.skills}
            maxDisplay={3}
            size="sm"
            showProficiency={false}
          />
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
        <AutonomyBadge level={cognate.autonomyLevel} />
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <span>{cognate.tasksCompleted} tasks</span>
          <span className="text-zinc-700">|</span>
          <span>{Math.round(cognate.successRate)}% success</span>
        </div>
      </div>
    </div>
  );
}

// Compact variant for list views or selectors
function CompactCognateCard({
  cognate,
  onClick,
  selected,
  className,
}: CognateCardProps): JSX.Element {
  const handleClick = (): void => {
    if (onClick) {
      onClick(cognate);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if ((e.key === 'Enter' || e.key === ' ') && onClick) {
      e.preventDefault();
      onClick(cognate);
    }
  };

  return (
    <div
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={clsx(
        'p-3 bg-zinc-900/50 border rounded-lg transition-all',
        'flex items-center gap-3',
        onClick && 'cursor-pointer hover:border-zinc-600',
        selected
          ? 'border-symtex-primary bg-symtex-primary/5'
          : 'border-zinc-800',
        className
      )}
    >
      {/* Avatar */}
      {cognate.avatar ? (
        <img
          src={cognate.avatar}
          alt={cognate.name}
          className="w-10 h-10 rounded-lg object-cover"
        />
      ) : (
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          <Brain className="w-5 h-5 text-white" />
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-white truncate">{cognate.name}</h3>
          <StatusDot status={cognate.availability} />
        </div>
        <p className="text-xs text-zinc-400 truncate">
          {cognate.role || 'No role'}
        </p>
      </div>

      {/* Level Badge */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
          <span className="text-xs font-bold text-white">{cognate.level}</span>
        </div>
        <AutonomyBadge level={cognate.autonomyLevel} />
      </div>
    </div>
  );
}

// Status indicator component
interface StatusIndicatorProps {
  status: CognateAvailabilityStatus;
  className?: string;
}

function StatusIndicator({ status, className }: StatusIndicatorProps): JSX.Element {
  const config = AVAILABILITY_STATUS_CONFIG[status];

  return (
    <div
      className={clsx(
        'flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium',
        config.color,
        'bg-slate-800/50',
        className
      )}
    >
      <span className={clsx('w-2 h-2 rounded-full animate-pulse', config.dotColor)} />
      {config.label}
    </div>
  );
}

// Status dot for compact views
function StatusDot({ status }: { status: CognateAvailabilityStatus }): JSX.Element {
  const config = AVAILABILITY_STATUS_CONFIG[status];

  return (
    <span
      className={clsx('w-2 h-2 rounded-full flex-shrink-0', config.dotColor)}
      title={config.label}
    />
  );
}

export default CognateCard;
