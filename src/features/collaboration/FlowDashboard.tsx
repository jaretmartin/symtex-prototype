/**
 * FlowDashboard Component
 *
 * Daily overview dashboard showing Today's Flow with three main widgets:
 * - Upcoming events (calendar)
 * - Pending reviews (approvals needing attention)
 * - Cognate status (active Cognates overview)
 *
 * Layout: 3-column responsive grid
 */

import { useEffect } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import clsx from 'clsx';
import { useCollaborationStore } from './collaboration-store';
import { UpcomingWidget } from './UpcomingWidget';
import { PendingReviewsWidget } from './PendingReviewsWidget';
import { CognateStatusWidget } from './CognateStatusWidget';

interface FlowDashboardProps {
  className?: string;
}

function formatGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function FlowDashboard({ className }: FlowDashboardProps): JSX.Element {
  const {
    loadMockData,
    pendingApprovals,
    cognateStatuses,
    isLoading,
  } = useCollaborationStore();

  useEffect(() => {
    // Load data on mount if empty
    if (pendingApprovals.length === 0 || cognateStatuses.length === 0) {
      loadMockData();
    }
  }, [pendingApprovals.length, cognateStatuses.length, loadMockData]);

  const handleRefresh = (): void => {
    loadMockData();
  };

  // Calculate summary stats
  const pendingCount = pendingApprovals.filter((a) => a.status === 'pending').length;
  const activeCount = cognateStatuses.filter(
    (c) => c.status === 'working' || c.status === 'training'
  ).length;

  return (
    <div className={clsx('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-symtex-primary" />
            Today's Flow
          </h1>
          <p className="text-muted-foreground mt-1">
            {formatGreeting()}! Here's what needs your attention.
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">{formatDate()}</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Stats */}
          <div className="hidden sm:flex items-center gap-4 text-sm">
            {pendingCount > 0 && (
              <span className="text-amber-400">
                {pendingCount} pending review{pendingCount !== 1 ? 's' : ''}
              </span>
            )}
            {activeCount > 0 && (
              <span className="text-green-400">
                {activeCount} Cognate{activeCount !== 1 ? 's' : ''} active
              </span>
            )}
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className={clsx(
              'p-2 rounded-lg border border-border text-muted-foreground',
              'hover:border-border hover:text-foreground hover:bg-card/50',
              'transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            title="Refresh"
          >
            <RefreshCw
              className={clsx('w-4 h-4', isLoading && 'animate-spin')}
            />
          </button>
        </div>
      </div>

      {/* Main Grid - 3 columns on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Upcoming Events */}
        <UpcomingWidget className="lg:col-span-1" maxItems={5} />

        {/* Column 2: Pending Reviews */}
        <PendingReviewsWidget className="lg:col-span-1" maxItems={4} />

        {/* Column 3: Cognate Status */}
        <CognateStatusWidget className="lg:col-span-1" />
      </div>

      {/* Summary Banner */}
      <div
        className={clsx(
          'p-4 rounded-lg border',
          pendingCount > 3
            ? 'bg-amber-500/10 border-amber-500/30'
            : 'bg-card/50 border-border'
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={clsx(
                'w-2 h-2 rounded-full',
                pendingCount > 0 ? 'bg-amber-400 animate-pulse' : 'bg-green-400'
              )}
            />
            <span className="text-sm text-muted-foreground">
              {pendingCount > 0 ? (
                <>
                  <strong className="text-foreground">{pendingCount} items</strong> need your
                  attention today
                </>
              ) : (
                <>
                  <strong className="text-green-400">All clear!</strong> No pending
                  actions required
                </>
              )}
            </span>
          </div>

          {/* Quick Action Shortcut */}
          <div className="hidden sm:flex items-center gap-2">
            <kbd className="px-2 py-1 text-xs bg-card border border-border rounded text-muted-foreground">
              Cmd+K
            </kbd>
            <span className="text-xs text-muted-foreground">Command palette</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlowDashboard;
