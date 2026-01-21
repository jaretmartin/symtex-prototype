/**
 * UpcomingWidget Component
 *
 * Shows upcoming calendar events in a compact widget format.
 * Features:
 * - Next 5 calendar events
 * - Time, title, participants display
 * - Join button for meetings
 * - Event type indicators
 */

import { useEffect } from 'react';
import {
  Calendar,
  Clock,
  Video,
  Phone,
  FileCheck,
  AlertTriangle,
  Users,
  ExternalLink,
  MapPin,
} from 'lucide-react';
import clsx from 'clsx';
import { useCollaborationStore, type CalendarEvent } from './collaboration-store';

interface UpcomingWidgetProps {
  className?: string;
  maxItems?: number;
}

const eventTypeConfig: Record<
  CalendarEvent['type'],
  { icon: React.ElementType; color: string; bgColor: string }
> = {
  meeting: { icon: Video, color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
  call: { icon: Phone, color: 'text-green-400', bgColor: 'bg-green-500/20' },
  review: { icon: FileCheck, color: 'text-purple-400', bgColor: 'bg-purple-500/20' },
  deadline: { icon: AlertTriangle, color: 'text-amber-400', bgColor: 'bg-amber-500/20' },
};

function formatEventTime(isoTime: string): string {
  const date = new Date(isoTime);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function formatEventDate(isoTime: string): string {
  const date = new Date(isoTime);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  }
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function isToday(isoTime: string): boolean {
  const date = new Date(isoTime);
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

export function UpcomingWidget({
  className,
  maxItems = 5,
}: UpcomingWidgetProps): JSX.Element {
  const { upcomingEvents, loadMockData, isLoading } = useCollaborationStore();

  useEffect(() => {
    if (upcomingEvents.length === 0) {
      loadMockData();
    }
  }, [upcomingEvents.length, loadMockData]);

  const displayEvents = upcomingEvents.slice(0, maxItems);

  // Group events by date
  const groupedEvents = displayEvents.reduce<Record<string, CalendarEvent[]>>((acc, event) => {
    const dateKey = formatEventDate(event.time);
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(event);
    return acc;
  }, {});

  if (isLoading) {
    return (
      <div className={clsx('bg-surface-base/50 border border-border rounded-lg', className)}>
        <div className="p-4 border-b border-border">
          <div className="h-5 w-32 bg-card rounded animate-pulse" />
        </div>
        <div className="p-4 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-card/50 rounded animate-pulse" />
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
          <Calendar className="w-4 h-4 text-symtex-primary" />
          Upcoming
        </h3>
        <span className="text-xs text-muted-foreground">{displayEvents.length} events</span>
      </div>

      {/* Events List */}
      <div className="divide-y divide-zinc-800/50">
        {Object.entries(groupedEvents).map(([dateLabel, events]) => (
          <div key={dateLabel}>
            {/* Date Header */}
            <div className="px-4 py-2 bg-card/30">
              <span
                className={clsx(
                  'text-xs font-medium',
                  dateLabel === 'Today' ? 'text-symtex-primary' : 'text-muted-foreground'
                )}
              >
                {dateLabel}
              </span>
            </div>

            {/* Events for this date */}
            {events.map((event) => {
              const config = eventTypeConfig[event.type];
              const Icon = config.icon;

              return (
                <div
                  key={event.id}
                  className="p-4 hover:bg-card/30 transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div
                      className={clsx(
                        'p-2 rounded-lg flex-shrink-0',
                        config.bgColor
                      )}
                    >
                      <Icon className={clsx('w-4 h-4', config.color)} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-foreground text-sm truncate">
                          {event.title}
                        </h4>
                        {event.cognateAssigned && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-symtex-primary/20 text-symtex-primary">
                            {event.cognateAssigned}
                          </span>
                        )}
                      </div>

                      {/* Time and Duration */}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatEventTime(event.time)}
                        </span>
                        {event.duration > 0 && (
                          <span>{event.duration} min</span>
                        )}
                      </div>

                      {/* Participants & Location */}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {event.participants.length > 0 && (
                          <span className="flex items-center gap-1 truncate">
                            <Users className="w-3 h-3 flex-shrink-0" />
                            {event.participants.slice(0, 2).join(', ')}
                            {event.participants.length > 2 && (
                              <span> +{event.participants.length - 2}</span>
                            )}
                          </span>
                        )}
                        {event.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {event.location}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Join Button */}
                    {event.meetingUrl && isToday(event.time) && (
                      <a
                        href={event.meetingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={clsx(
                          'flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium',
                          'bg-symtex-primary/20 text-symtex-primary',
                          'hover:bg-symtex-primary hover:text-foreground',
                          'transition-colors opacity-0 group-hover:opacity-100'
                        )}
                      >
                        Join
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {displayEvents.length === 0 && (
          <div className="p-8 text-center">
            <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No upcoming events</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default UpcomingWidget;
