/**
 * CognateStatusWidget Component
 *
 * Shows status of all active Cognates in a compact widget format.
 * Features:
 * - Current status for each Cognate
 * - Active action/progress display
 * - Health indicators (green/yellow/red)
 * - Last activity timestamps
 */

import { useEffect } from 'react';
import { Brain, Activity, Loader2, BookOpen, Pause, AlertCircle } from 'lucide-react';
import clsx from 'clsx';
import {
  useCollaborationStore,
  type CognateStatusItem,
  type CognateStatus,
  type CognateHealth,
} from './collaboration-store';

interface CognateStatusWidgetProps {
  className?: string;
}

const statusConfig: Record<
  CognateStatus,
  { icon: React.ElementType; label: string; color: string; animate?: boolean }
> = {
  working: {
    icon: Loader2,
    label: 'Working',
    color: 'text-green-400',
    animate: true,
  },
  idle: {
    icon: Pause,
    label: 'Idle',
    color: 'text-muted-foreground',
  },
  training: {
    icon: BookOpen,
    label: 'Training',
    color: 'text-purple-400',
    animate: true,
  },
  waiting: {
    icon: Pause,
    label: 'Waiting',
    color: 'text-amber-400',
  },
  error: {
    icon: AlertCircle,
    label: 'Error',
    color: 'text-red-400',
  },
};

const healthConfig: Record<
  CognateHealth,
  { color: string; bgColor: string; label: string }
> = {
  healthy: {
    color: 'bg-green-400',
    bgColor: 'bg-green-500/20',
    label: 'Healthy',
  },
  warning: {
    color: 'bg-amber-400',
    bgColor: 'bg-amber-500/20',
    label: 'Warning',
  },
  critical: {
    color: 'bg-red-400',
    bgColor: 'bg-red-500/20',
    label: 'Critical',
  },
};

function formatLastActivity(isoTime: string): string {
  const date = new Date(isoTime);
  const now = new Date();
  const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function CognateStatusWidget({
  className,
}: CognateStatusWidgetProps): JSX.Element {
  const { cognateStatuses, loadMockData, isLoading } = useCollaborationStore();

  useEffect(() => {
    if (cognateStatuses.length === 0) {
      loadMockData();
    }
  }, [cognateStatuses.length, loadMockData]);

  // Count by status
  const workingCount = cognateStatuses.filter((c) => c.status === 'working').length;
  const warningCount = cognateStatuses.filter((c) => c.health !== 'healthy').length;

  if (isLoading) {
    return (
      <div className={clsx('bg-surface-base/50 border border-border rounded-lg', className)}>
        <div className="p-4 border-b border-border">
          <div className="h-5 w-32 bg-card rounded animate-pulse" />
        </div>
        <div className="p-4 space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-14 bg-card/50 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'bg-surface-base/50 border border-border rounded-lg overflow-hidden',
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Brain className="w-4 h-4 text-symtex-primary" />
          Cognate Status
        </h3>
        <div className="flex items-center gap-2">
          {workingCount > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 flex items-center gap-1">
              <Activity className="w-3 h-3" />
              {workingCount} active
            </span>
          )}
          {warningCount > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
              {warningCount} warning
            </span>
          )}
        </div>
      </div>

      {/* Cognates List */}
      <div className="divide-y divide-zinc-800/50">
        {cognateStatuses.map((cognate) => (
          <CognateStatusRow key={cognate.id} cognate={cognate} />
        ))}

        {cognateStatuses.length === 0 && (
          <div className="p-8 text-center">
            <Brain className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No Cognates configured</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface CognateStatusRowProps {
  cognate: CognateStatusItem;
}

function CognateStatusRow({ cognate }: CognateStatusRowProps): JSX.Element {
  const status = statusConfig[cognate.status];
  const health = healthConfig[cognate.health];
  const StatusIcon = status.icon;

  return (
    <div className="p-4 hover:bg-card/30 transition-colors">
      <div className="flex items-center gap-3">
        {/* Avatar / Health Indicator */}
        <div className="relative">
          {cognate.avatar ? (
            <img
              src={cognate.avatar}
              alt={cognate.name}
              className="w-10 h-10 rounded-lg object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-symtex-primary to-purple-600 flex items-center justify-center">
              <Brain className="w-5 h-5 text-foreground" />
            </div>
          )}
          {/* Health dot */}
          <span
            className={clsx(
              'absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-surface-base',
              health.color
            )}
            title={health.label}
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-foreground text-sm">{cognate.name}</h4>
            <div className={clsx('flex items-center gap-1 text-xs', status.color)}>
              <StatusIcon
                className={clsx('w-3 h-3', status.animate && 'animate-spin')}
              />
              <span>{status.label}</span>
            </div>
          </div>

          {/* Current Action */}
          {cognate.currentAction && (
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {cognate.currentAction}
            </p>
          )}

          {/* Progress Bar (if working/training) */}
          {cognate.progress !== undefined &&
            (cognate.status === 'working' || cognate.status === 'training') && (
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className={clsx(
                      'h-full rounded-full transition-all duration-500',
                      cognate.status === 'training'
                        ? 'bg-purple-500'
                        : 'bg-green-500'
                    )}
                    style={{ width: `${cognate.progress}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{cognate.progress}%</span>
              </div>
            )}
        </div>

        {/* Last Activity */}
        <div className="text-xs text-muted-foreground flex-shrink-0">
          {formatLastActivity(cognate.lastActivity)}
        </div>
      </div>
    </div>
  );
}

export default CognateStatusWidget;
