/**
 * Active Cognates Panel Component
 *
 * Displays currently running Cognate instances with status indicators,
 * progress, and action controls.
 */

import {
  Bot,
  Pause,
  Play,
  Square,
  Eye,
  Clock,
  Target,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import clsx from 'clsx';
import type { AgentInstance, AgentStatus, AgentExecution } from '@/types';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/empty/EmptyState';
import ProgressRing from '@/components/ui/ProgressRing';

interface ActiveCognatesPanelProps {
  cognates: AgentInstance[];
  executions?: Record<string, AgentExecution>;
  templateNames?: Record<string, string>;
  missionNames?: Record<string, string>;
  onPause?: (id: string) => void;
  onResume?: (id: string) => void;
  onStop?: (id: string) => void;
  onViewDetails?: (id: string) => void;
}

// Status configuration with icons and colors
const statusConfig: Record<
  AgentStatus,
  {
    label: string;
    color: string;
    bgColor: string;
    icon: React.ElementType;
    animate?: boolean;
  }
> = {
  running: {
    label: 'Running',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    icon: Loader2,
    animate: true,
  },
  busy: {
    label: 'Busy',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    icon: Loader2,
    animate: true,
  },
  idle: {
    label: 'Idle',
    color: 'text-muted-foreground',
    bgColor: 'bg-muted/20',
    icon: Bot,
  },
  paused: {
    label: 'Paused',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20',
    icon: Pause,
  },
  completed: {
    label: 'Completed',
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    icon: CheckCircle2,
  },
  failed: {
    label: 'Failed',
    color: 'text-red-400',
    bgColor: 'bg-red-500/20',
    icon: AlertCircle,
  },
};

interface CognateItemProps {
  cognate: AgentInstance;
  execution?: AgentExecution;
  templateName?: string;
  missionName?: string;
  onPause?: () => void;
  onResume?: () => void;
  onStop?: () => void;
  onViewDetails?: () => void;
}

function CognateItem({
  cognate,
  execution,
  templateName,
  missionName,
  onPause,
  onResume,
  onStop,
  onViewDetails,
}: CognateItemProps): JSX.Element {
  const status = statusConfig[cognate.status];
  const StatusIcon = status.icon;

  // Calculate progress from execution data
  const progress = execution?.duration
    ? Math.min(100, (execution.duration / 60000) * 100) // Placeholder: use time-based progress
    : 0;

  // Format elapsed time
  const getElapsedTime = (): string => {
    if (!cognate.startedAt) return '--';
    const started = new Date(cognate.startedAt).getTime();
    const now = Date.now();
    const elapsed = Math.floor((now - started) / 1000);

    if (elapsed < 60) return `${elapsed}s`;
    if (elapsed < 3600) return `${Math.floor(elapsed / 60)}m ${elapsed % 60}s`;
    return `${Math.floor(elapsed / 3600)}h ${Math.floor((elapsed % 3600) / 60)}m`;
  };

  const isActive = cognate.status === 'running' || cognate.status === 'busy';
  const isPaused = cognate.status === 'paused';
  const canPause = isActive;
  const canResume = isPaused;
  const canStop = isActive || isPaused;

  return (
    <div
      className={clsx(
        'bg-card rounded-xl p-4 border border-border',
        'transition-all duration-200',
        'hover:border-border'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Status indicator with progress */}
          <div className="relative">
            {isActive ? (
              <ProgressRing
                progress={progress}
                size={40}
                strokeWidth={3}
                showPercentage={false}
                color="#6366f1"
              />
            ) : (
              <div
                className={clsx(
                  'w-10 h-10 rounded-full flex items-center justify-center',
                  status.bgColor
                )}
              >
                <StatusIcon
                  className={clsx(
                    'w-5 h-5',
                    status.color,
                    status.animate && 'animate-spin'
                  )}
                />
              </div>
            )}
            {isActive && (
              <div className="absolute inset-0 flex items-center justify-center">
                <StatusIcon
                  className={clsx(
                    'w-4 h-4',
                    status.color,
                    status.animate && 'animate-spin'
                  )}
                />
              </div>
            )}
          </div>

          <div>
            <h4 className="font-medium text-foreground">
              {templateName || `Cognate ${cognate.id.slice(0, 8)}`}
            </h4>
            <div className="flex items-center gap-2">
              <span
                className={clsx(
                  'text-xs px-2 py-0.5 rounded',
                  status.bgColor,
                  status.color
                )}
              >
                {status.label}
              </span>
            </div>
          </div>
        </div>

        {/* Elapsed time */}
        {(isActive || isPaused) && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            {getElapsedTime()}
          </div>
        )}
      </div>

      {/* Current mission/task */}
      {missionName && (
        <div className="flex items-center gap-2 mb-3 p-2 rounded-lg bg-card/50">
          <Target className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground truncate">{missionName}</span>
        </div>
      )}

      {/* Current execution input preview */}
      {execution?.input && (
        <div className="mb-3">
          <p className="text-xs text-muted-foreground mb-1">Current Action</p>
          <p className="text-sm text-muted-foreground line-clamp-2">{execution.input}</p>
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center gap-4 mb-3 text-xs text-muted-foreground">
        <div>
          <span className="text-muted-foreground">Total:</span>{' '}
          <span className="text-muted-foreground">{cognate.totalExecutions}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Success:</span>{' '}
          <span className="text-green-400">{cognate.successfulExecutions}</span>
        </div>
        {cognate.totalExecutions > 0 && (
          <div>
            <span className="text-muted-foreground">Rate:</span>{' '}
            <span className="text-muted-foreground">
              {Math.round(
                (cognate.successfulExecutions / cognate.totalExecutions) * 100
              )}
              %
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-3 border-t border-border">
        {canPause && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onPause}
            leftIcon={<Pause className="w-4 h-4" />}
          >
            Pause
          </Button>
        )}
        {canResume && (
          <Button
            variant="primary"
            size="sm"
            onClick={onResume}
            leftIcon={<Play className="w-4 h-4" />}
          >
            Resume
          </Button>
        )}
        {canStop && (
          <Button
            variant="danger"
            size="sm"
            onClick={onStop}
            leftIcon={<Square className="w-4 h-4" />}
          >
            Stop
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onViewDetails}
          leftIcon={<Eye className="w-4 h-4" />}
        >
          Details
        </Button>
      </div>
    </div>
  );
}

export default function ActiveCognatesPanel({
  cognates,
  executions = {},
  templateNames = {},
  missionNames = {},
  onPause,
  onResume,
  onStop,
  onViewDetails,
}: ActiveCognatesPanelProps): JSX.Element {
  // Sort Cognates: running first, then paused, then others
  const sortedCognates = [...cognates].sort((a, b) => {
    const order: Record<AgentStatus, number> = {
      running: 0,
      busy: 1,
      paused: 2,
      idle: 3,
      completed: 4,
      failed: 5,
    };
    return order[a.status] - order[b.status];
  });

  // Get current execution for each Cognate
  const getCurrentExecution = (instanceId: string): AgentExecution | undefined => {
    return Object.values(executions).find(
      (e) =>
        e.instanceId === instanceId &&
        (e.status === 'running' || e.status === 'paused')
    );
  };

  const activeCount = cognates.filter(
    (a) => a.status === 'running' || a.status === 'busy'
  ).length;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Active Cognates</h2>
          <p className="text-sm text-muted-foreground">
            {activeCount} running, {cognates.length} total
          </p>
        </div>

        {activeCount > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-green-400">{activeCount} active</span>
          </div>
        )}
      </div>

      {/* Cognate List */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {sortedCognates.length > 0 ? (
          sortedCognates.map((cognate) => (
            <CognateItem
              key={cognate.id}
              cognate={cognate}
              execution={getCurrentExecution(cognate.id)}
              templateName={templateNames[cognate.templateId]}
              missionName={cognate.missionId ? missionNames[cognate.missionId] : undefined}
              onPause={onPause ? () => onPause(cognate.id) : undefined}
              onResume={onResume ? () => onResume(cognate.id) : undefined}
              onStop={onStop ? () => onStop(cognate.id) : undefined}
              onViewDetails={
                onViewDetails ? () => onViewDetails(cognate.id) : undefined
              }
            />
          ))
        ) : (
          <EmptyState
            icon={<Bot className="w-8 h-8" />}
            title="No active Cognates"
            description="Deploy a Cognate from the roster to get started."
          />
        )}
      </div>
    </div>
  );
}
