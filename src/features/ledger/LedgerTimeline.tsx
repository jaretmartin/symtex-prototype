/**
 * LedgerTimeline Component
 *
 * Displays ledger entries in a vertical timeline view with
 * visual connectors and grouped by date.
 */

import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Bot,
  Server,
  Zap,
  Link2,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Flag,
} from 'lucide-react';
import type { LedgerEntry as LedgerEntryType, ActorType, LedgerSeverity } from '@/types';

interface LedgerTimelineProps {
  entries: LedgerEntryType[];
  selectedEntryId?: string;
  onSelectEntry?: (entry: LedgerEntryType) => void;
  className?: string;
}

// Actor type configuration
const actorConfig: Record<ActorType, { icon: typeof User; color: string; bg: string; border: string }> = {
  user: { icon: User, color: 'text-blue-400', bg: 'bg-blue-500', border: 'border-blue-500' },
  cognate: { icon: Bot, color: 'text-indigo-400', bg: 'bg-indigo-500', border: 'border-indigo-500' },
  system: { icon: Server, color: 'text-muted-foreground', bg: 'bg-muted', border: 'border-border' },
  automation: { icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500', border: 'border-amber-500' },
  integration: { icon: Link2, color: 'text-emerald-400', bg: 'bg-emerald-500', border: 'border-emerald-500' },
};

// Severity colors for the timeline line
const severityLineColor: Record<LedgerSeverity, string> = {
  debug: 'bg-muted',
  info: 'bg-blue-500',
  notice: 'bg-cyan-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
  critical: 'bg-red-600',
};

// Status icons
const statusIcons: Record<string, typeof CheckCircle2> = {
  completed: CheckCircle2,
  failed: XCircle,
  in_progress: Clock,
  initiated: Clock,
  cancelled: XCircle,
};

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDate(date: Date): string {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  }
}

interface TimelineEntryProps {
  entry: LedgerEntryType;
  isSelected?: boolean;
  isFirst: boolean;
  isLast: boolean;
  onSelect?: (entry: LedgerEntryType) => void;
}

function TimelineEntry({ entry, isSelected, isFirst, isLast, onSelect }: TimelineEntryProps) {
  const actor = actorConfig[entry.who.type];
  const ActorIcon = actor.icon;
  const StatusIcon = statusIcons[entry.what.status] || Clock;
  const lineColor = severityLineColor[entry.what.severity];

  return (
    <div
      className={cn(
        'relative flex gap-4 cursor-pointer group',
        isSelected && 'bg-indigo-500/5'
      )}
      onClick={() => onSelect?.(entry)}
    >
      {/* Timeline Column */}
      <div className="flex flex-col items-center w-10 flex-shrink-0">
        {/* Top Line */}
        {!isFirst && (
          <div className={cn('w-0.5 h-4', lineColor)} />
        )}
        {isFirst && <div className="h-4" />}

        {/* Node */}
        <div
          className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all',
            isSelected
              ? `${actor.bg} border-white`
              : `bg-card ${actor.border} group-hover:${actor.bg}`
          )}
        >
          <ActorIcon className={cn('w-4 h-4', isSelected ? 'text-foreground' : actor.color)} />
        </div>

        {/* Bottom Line */}
        {!isLast && (
          <div className={cn('w-0.5 flex-1 min-h-[40px]', lineColor)} />
        )}
      </div>

      {/* Content */}
      <div
        className={cn(
          'flex-1 pb-6 pt-1',
          !isLast && 'border-b border-border/30'
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground text-sm">{entry.who.name}</span>
            {entry.isFlagged && (
              <Flag className="w-3.5 h-3.5 text-amber-400" />
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <StatusIcon
              className={cn(
                'w-3.5 h-3.5',
                entry.what.status === 'completed'
                  ? 'text-emerald-400'
                  : entry.what.status === 'failed'
                    ? 'text-red-400'
                    : 'text-muted-foreground'
              )}
            />
            <span>{formatTime(entry.when)}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-2">{entry.what.description}</p>

        {/* Meta */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge
            variant="outline"
            className="text-xs border-border text-muted-foreground"
          >
            {entry.what.category}
          </Badge>
          {entry.where.spaceName && (
            <Badge
              variant="outline"
              className="text-xs border-border text-muted-foreground"
            >
              {entry.where.spaceName}
            </Badge>
          )}
          {entry.how.approach && (
            <Badge
              variant="outline"
              className={cn(
                'text-xs',
                entry.how.approach === 'symbolic'
                  ? 'border-indigo-500/30 text-indigo-400'
                  : entry.how.approach === 'neural'
                    ? 'border-purple-500/30 text-purple-400'
                    : 'border-border text-muted-foreground'
              )}
            >
              {entry.how.approach}
            </Badge>
          )}
        </div>

        {/* Warning/Error indicator */}
        {(entry.what.severity === 'warning' || entry.what.severity === 'error' || entry.what.severity === 'critical') && (
          <div
            className={cn(
              'flex items-center gap-1.5 mt-2 text-xs',
              entry.what.severity === 'warning' ? 'text-yellow-400' : 'text-red-400'
            )}
          >
            <AlertTriangle className="w-3 h-3" />
            <span className="capitalize">{entry.what.severity}</span>
            {entry.what.result && (
              <span className="text-muted-foreground">- {entry.what.result}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function LedgerTimeline({
  entries,
  selectedEntryId,
  onSelectEntry,
  className,
}: LedgerTimelineProps) {
  // Group entries by date
  const groupedEntries = useMemo(() => {
    const groups: { date: string; entries: LedgerEntryType[] }[] = [];

    entries.forEach((entry) => {
      const dateKey = formatDate(entry.when);
      const existingGroup = groups.find((g) => g.date === dateKey);

      if (existingGroup) {
        existingGroup.entries.push(entry);
      } else {
        groups.push({ date: dateKey, entries: [entry] });
      }
    });

    return groups;
  }, [entries]);

  if (entries.length === 0) {
    return (
      <div className={cn('text-center py-12', className)}>
        <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">No entries to display</p>
        <p className="text-sm text-muted-foreground mt-1">
          Adjust your filters to see more results
        </p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {groupedEntries.map((group, groupIndex) => (
        <div key={group.date}>
          {/* Date Header */}
          <div className="sticky top-0 z-10 bg-surface-base/95 backdrop-blur-sm py-2 mb-4">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-muted" />
              {group.date}
              <span className="text-muted-foreground">
                ({group.entries.length} {group.entries.length === 1 ? 'entry' : 'entries'})
              </span>
            </h3>
          </div>

          {/* Entries */}
          <div className="pl-2">
            {group.entries.map((entry, entryIndex) => (
              <TimelineEntry
                key={entry.id}
                entry={entry}
                isSelected={entry.id === selectedEntryId}
                isFirst={groupIndex === 0 && entryIndex === 0}
                isLast={
                  groupIndex === groupedEntries.length - 1 &&
                  entryIndex === group.entries.length - 1
                }
                onSelect={onSelectEntry}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default LedgerTimeline;
