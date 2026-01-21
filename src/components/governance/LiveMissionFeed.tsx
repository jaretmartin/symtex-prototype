/**
 * LiveMissionFeed Component
 *
 * Displays a real-time feed of active missions with status, progress,
 * and action controls (pause, resume, stop, view).
 */

import { useState } from 'react';
import {
  Play,
  Pause,
  Square,
  Eye,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  AlertTriangle,
  ChevronRight,
  Bot,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { AutonomyBadge } from '../cognate/AutonomyLevelIndicator';
import type { LiveMission, LiveMissionStatus, LiveMissionFeedProps, MissionFilter } from './types';
import { MISSION_STATUS_CONFIG } from './types';

// =============================================================================
// Mission Status Badge
// =============================================================================

interface MissionStatusBadgeProps {
  status: LiveMissionStatus;
}

function MissionStatusBadge({ status }: MissionStatusBadgeProps): JSX.Element {
  const config = MISSION_STATUS_CONFIG[status];

  const iconMap = {
    running: Play,
    paused: Pause,
    complete: CheckCircle,
    stuck: AlertTriangle,
    queued: Clock,
  };

  const Icon = iconMap[status];

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium',
        config.bgColor,
        config.color
      )}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
}

// =============================================================================
// Mission Card
// =============================================================================

interface MissionCardProps {
  mission: LiveMission;
  onPause?: (missionId: string) => void;
  onResume?: (missionId: string) => void;
  onStop?: (missionId: string) => void;
  onView?: (missionId: string) => void;
}

function MissionCard({
  mission,
  onPause,
  onResume,
  onStop,
  onView,
}: MissionCardProps): JSX.Element {
  const showProgressBar = ['running', 'paused', 'stuck'].includes(mission.status);

  const getProgressBarColor = (): string => {
    switch (mission.status) {
      case 'stuck':
        return 'bg-red-500';
      case 'paused':
        return 'bg-amber-500';
      default:
        return 'bg-green-500';
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-card/50 rounded-xl border border-border/50">
      {/* Cognate Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 bg-symtex-primary/20 rounded-xl flex items-center justify-center text-xl">
          {mission.cognateAvatar}
        </div>
        <div className="absolute -bottom-1 -right-1">
          <AutonomyBadge level={mission.autonomyLevel} />
        </div>
      </div>

      {/* Mission Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium text-foreground truncate">{mission.name}</h4>
          <MissionStatusBadge status={mission.status} />
        </div>
        <p className="text-sm text-muted-foreground truncate">
          {mission.cognateName} - {mission.owner}
        </p>

        {/* Progress Bar */}
        {showProgressBar && (
          <div className="mt-2">
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={clsx('h-full rounded-full transition-all', getProgressBarColor())}
                style={{ width: `${mission.progress}%` }}
              />
            </div>
            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
              <span>{mission.progress}%</span>
              <span>
                {mission.actionsCompleted}/{mission.actionsCompleted + mission.actionsPending}{' '}
                actions
              </span>
            </div>
          </div>
        )}

        {/* Stuck Reason */}
        {mission.status === 'stuck' && mission.stuckReason && (
          <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {mission.stuckReason}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {mission.status === 'running' && (
          <button
            onClick={() => onPause?.(mission.id)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            title="Pause Mission"
            aria-label="Pause Mission"
          >
            <Pause className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
        {mission.status === 'paused' && (
          <button
            onClick={() => onResume?.(mission.id)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            title="Resume Mission"
            aria-label="Resume Mission"
          >
            <Play className="w-4 h-4 text-green-400" />
          </button>
        )}
        {mission.status === 'stuck' && (
          <button
            onClick={() => onResume?.(mission.id)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            title="Retry Mission"
            aria-label="Retry Mission"
          >
            <RefreshCw className="w-4 h-4 text-amber-400" />
          </button>
        )}
        <button
          onClick={() => onView?.(mission.id)}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          title="View Details"
          aria-label="View Details"
        >
          <Eye className="w-4 h-4 text-muted-foreground" />
        </button>
        {['running', 'paused', 'stuck'].includes(mission.status) && (
          <button
            onClick={() => onStop?.(mission.id)}
            className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
            title="Stop Mission"
            aria-label="Stop Mission"
          >
            <Square className="w-4 h-4 text-red-400" />
          </button>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// Filter Buttons
// =============================================================================

const FILTER_OPTIONS: Array<{ value: MissionFilter['status']; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'running', label: 'Running' },
  { value: 'paused', label: 'Paused' },
  { value: 'stuck', label: 'Stuck' },
];

// =============================================================================
// Main Component
// =============================================================================

export function LiveMissionFeed({
  missions,
  onPause,
  onResume,
  onStop,
  onView,
  className,
}: LiveMissionFeedProps): JSX.Element {
  const [filter, setFilter] = useState<MissionFilter['status']>('all');

  const filteredMissions = missions.filter((mission) => {
    if (filter === 'all') return true;
    return mission.status === filter;
  });

  const activeMissionCount = missions.filter((m) =>
    ['running', 'paused', 'stuck', 'queued'].includes(m.status)
  ).length;

  return (
    <div className={clsx('bg-card rounded-xl border border-border p-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Play className="w-5 h-5" />
          Live Mission Feed
          <span className="text-sm font-normal text-muted-foreground">({activeMissionCount} active)</span>
        </h3>
        <Link
          to="/missions"
          className="text-sm text-symtex-primary hover:underline flex items-center gap-1"
        >
          View All
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        {FILTER_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value)}
            className={clsx(
              'px-3 py-1.5 text-sm rounded-lg transition-colors',
              filter === option.value
                ? 'bg-symtex-primary/20 text-symtex-primary border border-symtex-primary/30'
                : 'bg-card text-muted-foreground hover:bg-muted border border-transparent'
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Mission List */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        {filteredMissions.map((mission) => (
          <MissionCard
            key={mission.id}
            mission={mission}
            onPause={onPause}
            onResume={onResume}
            onStop={onStop}
            onView={onView}
          />
        ))}
        {filteredMissions.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Bot className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No {filter === 'all' ? 'active' : filter} missions</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default LiveMissionFeed;
