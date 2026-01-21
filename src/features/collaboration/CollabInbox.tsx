/**
 * CollabInbox Component
 *
 * Unified message center showing all communications.
 * Features:
 * - Filter by Cognate, type, priority
 * - Quick reply capability
 * - Read/unread status
 * - Action indicators
 */

import { useState, useMemo, useEffect } from 'react';
import {
  Inbox,
  Filter,
  Search,
  X,
  Bell,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Brain,
  ExternalLink,
  CheckCheck,
} from 'lucide-react';
import clsx from 'clsx';
import {
  useCollaborationStore,
  type InboxItem,
  type InboxItemType,
  type InboxPriority,
} from './collaboration-store';

interface CollabInboxProps {
  className?: string;
}

const typeConfig: Record<
  InboxItemType,
  { icon: React.ElementType; label: string; color: string; bgColor: string }
> = {
  approval: {
    icon: CheckCircle2,
    label: 'Approval',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/20',
  },
  notification: {
    icon: Bell,
    label: 'Notification',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
  },
  message: {
    icon: MessageSquare,
    label: 'Message',
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
  },
  alert: {
    icon: AlertTriangle,
    label: 'Alert',
    color: 'text-red-400',
    bgColor: 'bg-red-500/20',
  },
};

const priorityConfig: Record<
  InboxPriority,
  { color: string; bgColor: string; label: string }
> = {
  low: { color: 'text-muted-foreground', bgColor: 'bg-muted/20', label: 'Low' },
  normal: { color: 'text-muted-foreground', bgColor: 'bg-muted/20', label: 'Normal' },
  high: { color: 'text-amber-400', bgColor: 'bg-amber-500/20', label: 'High' },
  urgent: { color: 'text-red-400', bgColor: 'bg-red-500/20', label: 'Urgent' },
};

function formatTimestamp(isoTime: string): string {
  const date = new Date(isoTime);
  const now = new Date();
  const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

type FilterType = InboxItemType | 'all';
type FilterPriority = InboxPriority | 'all';
type FilterRead = 'all' | 'unread' | 'read';

export function CollabInbox({ className }: CollabInboxProps): JSX.Element {
  const {
    inboxItems,
    loadMockData,
    markInboxAsRead,
    markAllInboxAsRead,
  } = useCollaborationStore();

  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [filterPriority, setFilterPriority] = useState<FilterPriority>('all');
  const [filterRead, setFilterRead] = useState<FilterRead>('all');
  const [filterCognate, setFilterCognate] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (inboxItems.length === 0) {
      loadMockData();
    }
  }, [inboxItems.length, loadMockData]);

  // Get unique Cognates
  const uniqueCognates = useMemo(() => {
    const cognates = new Map<string, string>();
    inboxItems.forEach((item) => {
      if (item.cognateId && item.cognateName) {
        cognates.set(item.cognateId, item.cognateName);
      }
    });
    return Array.from(cognates.entries());
  }, [inboxItems]);

  // Filter items
  const filteredItems = useMemo(() => {
    let result = [...inboxItems];

    // Type filter
    if (filterType !== 'all') {
      result = result.filter((item) => item.type === filterType);
    }

    // Priority filter
    if (filterPriority !== 'all') {
      result = result.filter((item) => item.priority === filterPriority);
    }

    // Read filter
    if (filterRead !== 'all') {
      result = result.filter((item) =>
        filterRead === 'unread' ? !item.read : item.read
      );
    }

    // Cognate filter
    if (filterCognate) {
      result = result.filter((item) => item.cognateId === filterCognate);
    }

    // Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.preview.toLowerCase().includes(query) ||
          item.cognateName?.toLowerCase().includes(query)
      );
    }

    // Sort by timestamp (newest first)
    result.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return result;
  }, [
    inboxItems,
    filterType,
    filterPriority,
    filterRead,
    filterCognate,
    searchQuery,
  ]);

  const unreadCount = inboxItems.filter((i) => !i.read).length;
  const actionRequiredCount = inboxItems.filter((i) => i.actionRequired).length;

  const hasActiveFilters =
    filterType !== 'all' ||
    filterPriority !== 'all' ||
    filterRead !== 'all' ||
    filterCognate ||
    searchQuery;

  const clearFilters = (): void => {
    setFilterType('all');
    setFilterPriority('all');
    setFilterRead('all');
    setFilterCognate(null);
    setSearchQuery('');
  };

  const handleItemClick = (item: InboxItem): void => {
    if (!item.read) {
      markInboxAsRead(item.id);
    }
    // Could navigate to related approval or detail view
  };

  return (
    <div className={clsx('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Inbox className="w-6 h-6 text-symtex-primary" />
            Collab Inbox
          </h1>
          <p className="text-muted-foreground mt-1">
            All messages and notifications from your Cognates
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Stats */}
          <div className="hidden sm:flex items-center gap-4 text-sm">
            {unreadCount > 0 && (
              <span className="text-symtex-primary">
                {unreadCount} unread
              </span>
            )}
            {actionRequiredCount > 0 && (
              <span className="text-amber-400">
                {actionRequiredCount} action{actionRequiredCount !== 1 ? 's' : ''} needed
              </span>
            )}
          </div>

          {/* Mark All Read */}
          {unreadCount > 0 && (
            <button
              onClick={markAllInboxAsRead}
              className={clsx(
                'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm',
                'border border-border text-muted-foreground',
                'hover:border-border hover:text-foreground hover:bg-card/50',
                'transition-colors'
              )}
            >
              <CheckCheck className="w-4 h-4" />
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-surface-base/50 border border-border rounded-lg p-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search inbox..."
              className={clsx(
                'w-full pl-10 pr-4 py-2 rounded-lg bg-card border border-border',
                'text-foreground placeholder-zinc-500 text-sm',
                'focus:outline-none focus:border-symtex-primary focus:ring-1 focus:ring-symtex-primary'
              )}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Type Filters */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setFilterType('all')}
              className={clsx(
                'px-3 py-1.5 rounded text-sm',
                filterType === 'all'
                  ? 'bg-symtex-primary/20 text-symtex-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-card'
              )}
            >
              All
            </button>
            {(Object.keys(typeConfig) as InboxItemType[]).map((type) => {
              const config = typeConfig[type];
              const Icon = config.icon;
              return (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={clsx(
                    'px-3 py-1.5 rounded text-sm flex items-center gap-1.5',
                    filterType === type
                      ? clsx(config.bgColor, config.color)
                      : 'text-muted-foreground hover:text-foreground hover:bg-card'
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">{config.label}</span>
                </button>
              );
            })}
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={clsx(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm',
              showFilters || hasActiveFilters
                ? 'bg-symtex-primary/20 text-symtex-primary border border-symtex-primary/30'
                : 'text-muted-foreground hover:text-foreground hover:bg-card border border-border'
            )}
          >
            <Filter className="w-4 h-4" />
            More
          </button>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-border flex flex-wrap items-center gap-4">
            {/* Priority Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Priority:</span>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value as FilterPriority)}
                className={clsx(
                  'px-2 py-1 rounded text-sm bg-card border border-border',
                  'text-muted-foreground focus:outline-none focus:border-symtex-primary'
                )}
              >
                <option value="all">All</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="normal">Normal</option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* Read Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Status:</span>
              {(['all', 'unread', 'read'] as FilterRead[]).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterRead(status)}
                  className={clsx(
                    'px-2 py-1 rounded text-xs capitalize',
                    filterRead === status
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Cognate Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Cognate:</span>
              <select
                value={filterCognate || ''}
                onChange={(e) => setFilterCognate(e.target.value || null)}
                className={clsx(
                  'px-2 py-1 rounded text-sm bg-card border border-border',
                  'text-muted-foreground focus:outline-none focus:border-symtex-primary'
                )}
              >
                <option value="">All Cognates</option>
                {uniqueCognates.map(([id, name]) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Showing <strong className="text-foreground">{filteredItems.length}</strong>{' '}
          {filteredItems.length === 1 ? 'message' : 'messages'}
          {hasActiveFilters && ' (filtered)'}
        </span>
      </div>

      {/* Messages List */}
      <div className="bg-surface-base/50 border border-border rounded-lg overflow-hidden divide-y divide-zinc-800/50">
        {filteredItems.map((item) => (
          <InboxRow
            key={item.id}
            item={item}
            onClick={() => handleItemClick(item)}
          />
        ))}

        {filteredItems.length === 0 && (
          <div className="p-12 text-center">
            {hasActiveFilters ? (
              <>
                <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No matching messages
                </h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters to see more results
                </p>
                <button
                  onClick={clearFilters}
                  className="text-symtex-primary hover:underline"
                >
                  Clear all filters
                </button>
              </>
            ) : (
              <>
                <Inbox className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Inbox empty
                </h3>
                <p className="text-muted-foreground">
                  No messages from your Cognates yet
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface InboxRowProps {
  item: InboxItem;
  onClick: () => void;
}

function InboxRow({ item, onClick }: InboxRowProps): JSX.Element {
  const config = typeConfig[item.type];
  const prioConfig = priorityConfig[item.priority];
  const Icon = config.icon;

  return (
    <div
      onClick={onClick}
      className={clsx(
        'p-4 hover:bg-card/30 transition-colors cursor-pointer group',
        !item.read && 'bg-card/20'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Type Icon */}
        <div className={clsx('p-2 rounded-lg flex-shrink-0', config.bgColor)}>
          <Icon className={clsx('w-4 h-4', config.color)} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {/* Unread indicator */}
            {!item.read && (
              <span className="w-2 h-2 rounded-full bg-symtex-primary flex-shrink-0" />
            )}

            <h4
              className={clsx(
                'font-medium text-sm truncate',
                item.read ? 'text-muted-foreground' : 'text-foreground'
              )}
            >
              {item.title}
            </h4>

            {/* Priority badge */}
            {(item.priority === 'high' || item.priority === 'urgent') && (
              <span
                className={clsx(
                  'text-xs px-1.5 py-0.5 rounded',
                  prioConfig.bgColor,
                  prioConfig.color
                )}
              >
                {prioConfig.label}
              </span>
            )}

            {/* Action required indicator */}
            {item.actionRequired && (
              <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">
                Action needed
              </span>
            )}
          </div>

          {/* Preview */}
          <p
            className={clsx(
              'text-sm truncate',
              item.read ? 'text-muted-foreground' : 'text-muted-foreground'
            )}
          >
            {item.preview}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            {/* Cognate */}
            {item.cognateName && (
              <span className="flex items-center gap-1">
                <Brain className="w-3 h-3" />
                {item.cognateName}
              </span>
            )}

            {/* Timestamp */}
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTimestamp(item.timestamp)}
            </span>
          </div>
        </div>

        {/* Link indicator */}
        {item.relatedApprovalId && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <ExternalLink className="w-4 h-4 text-muted-foreground" />
          </div>
        )}
      </div>
    </div>
  );
}

export default CollabInbox;
