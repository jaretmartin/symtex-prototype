/**
 * ConversationList Component
 *
 * Displays a list of conversations with search, filtering, and selection.
 * Supports pinning, archiving, and conversation type filtering.
 */

import { useState, useMemo, useCallback } from 'react';
import {
  MessageSquare,
  Search,
  Pin,
  Archive,
  Trash2,
  MoreVertical,
  Target,
  Code2,
  Bug,
  ChevronDown,
  Plus,
} from 'lucide-react';
import type { Conversation, ConversationType } from '@/types';

interface ConversationListProps {
  /** Array of conversations to display */
  conversations: Conversation[];
  /** Currently selected conversation ID */
  selectedId?: string;
  /** Callback when a conversation is selected */
  onSelect: (conversation: Conversation) => void;
  /** Callback when a new conversation is requested */
  onNewConversation: () => void;
  /** Callback when a conversation is pinned/unpinned */
  onTogglePin?: (id: string) => void;
  /** Callback when a conversation is archived */
  onArchive?: (id: string) => void;
  /** Callback when a conversation is deleted */
  onDelete?: (id: string) => void;
  /** Whether to show archived conversations */
  showArchived?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Returns the icon for a conversation type
 */
function getTypeIcon(type: ConversationType): JSX.Element {
  const iconClass = 'w-4 h-4';

  switch (type) {
    case 'mission':
      return <Target className={iconClass} />;
    case 'review':
      return <Code2 className={iconClass} />;
    case 'debug':
      return <Bug className={iconClass} />;
    case 'chat':
    default:
      return <MessageSquare className={iconClass} />;
  }
}

/**
 * Returns a color class for conversation type
 */
function getTypeColor(type: ConversationType): string {
  switch (type) {
    case 'mission':
      return 'text-symtex-primary';
    case 'review':
      return 'text-purple-400';
    case 'debug':
      return 'text-orange-400';
    case 'chat':
    default:
      return 'text-muted-foreground';
  }
}

/**
 * Formats a timestamp to relative time
 */
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Individual conversation item
 */
function ConversationItem({
  conversation,
  isSelected,
  onSelect,
  onTogglePin,
  onArchive,
  onDelete,
}: {
  conversation: Conversation;
  isSelected: boolean;
  onSelect: () => void;
  onTogglePin?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
}): JSX.Element {
  const [showMenu, setShowMenu] = useState(false);

  const handleMenuToggle = useCallback(
    (e: React.MouseEvent): void => {
      e.stopPropagation();
      setShowMenu((prev) => !prev);
    },
    []
  );

  const handleAction = useCallback(
    (action?: () => void) => (e: React.MouseEvent): void => {
      e.stopPropagation();
      action?.();
      setShowMenu(false);
    },
    []
  );

  return (
    <div className="relative">
      <button
        onClick={onSelect}
        className={`w-full text-left p-3 rounded-lg transition-all duration-200 group ${
          isSelected
            ? 'bg-symtex-primary/10 border border-symtex-primary/30'
            : 'hover:bg-card/50 border border-transparent'
        }`}
      >
        <div className="flex items-start gap-3">
          {/* Type icon */}
          <div
            className={`flex-shrink-0 mt-0.5 ${getTypeColor(conversation.type)}`}
          >
            {getTypeIcon(conversation.type)}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4
                className={`font-medium truncate ${
                  isSelected ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {conversation.title}
              </h4>
              {conversation.isPinned && (
                <Pin className="w-3 h-3 text-symtex-accent flex-shrink-0" />
              )}
            </div>

            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {conversation.messageIds.length} messages
            </p>
          </div>

          {/* Time and menu */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <span className="text-xs text-muted-foreground">
              {formatRelativeTime(conversation.lastMessageAt || conversation.updatedAt)}
            </span>

            <button
              onClick={handleMenuToggle}
              className="p-1 text-muted-foreground hover:text-muted-foreground rounded opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Conversation options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      </button>

      {/* Dropdown menu */}
      {showMenu && (
        <>
          {/* Backdrop to close menu */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />

          <div className="absolute right-2 top-full mt-1 z-20 w-40 bg-card border border-border rounded-lg shadow-xl py-1">
            {onTogglePin && (
              <button
                onClick={handleAction(onTogglePin)}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 transition-colors"
              >
                <Pin className="w-4 h-4" />
                {conversation.isPinned ? 'Unpin' : 'Pin'}
              </button>
            )}
            {onArchive && (
              <button
                onClick={handleAction(onArchive)}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 transition-colors"
              >
                <Archive className="w-4 h-4" />
                Archive
              </button>
            )}
            {onDelete && (
              <button
                onClick={handleAction(onDelete)}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Displays a filterable list of conversations
 */
export function ConversationList({
  conversations,
  selectedId,
  onSelect,
  onNewConversation,
  onTogglePin,
  onArchive,
  onDelete,
  showArchived = false,
  className = '',
}: ConversationListProps): JSX.Element {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<ConversationType | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort conversations
  const filteredConversations = useMemo(() => {
    return conversations
      .filter((conv) => {
        // Filter archived
        if (!showArchived && conv.isArchived) return false;

        // Filter by type
        if (typeFilter !== 'all' && conv.type !== typeFilter) return false;

        // Filter by search
        if (search) {
          const searchLower = search.toLowerCase();
          return conv.title.toLowerCase().includes(searchLower);
        }

        return true;
      })
      .sort((a, b) => {
        // Pinned first
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;

        // Then by last message time
        const aTime = a.lastMessageAt || a.updatedAt;
        const bTime = b.lastMessageAt || b.updatedAt;
        return new Date(bTime).getTime() - new Date(aTime).getTime();
      });
  }, [conversations, search, typeFilter, showArchived]);

  const pinnedConversations = filteredConversations.filter((c) => c.isPinned);
  const unpinnedConversations = filteredConversations.filter((c) => !c.isPinned);

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground">Conversations</h2>
          <button
            onClick={onNewConversation}
            className="p-2 bg-symtex-primary/10 text-symtex-primary rounded-lg hover:bg-symtex-primary/20 transition-colors"
            aria-label="New conversation"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2 bg-card/50 border border-border rounded-lg text-sm text-muted-foreground placeholder-muted-foreground focus:outline-none focus:border-symtex-primary/50 transition-colors"
          />
        </div>

        {/* Type filter */}
        <div className="mt-2">
          <button
            onClick={() => setShowFilters((prev) => !prev)}
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-muted-foreground transition-colors"
          >
            <ChevronDown
              className={`w-3 h-3 transition-transform ${
                showFilters ? 'rotate-180' : ''
              }`}
            />
            Filter by type
          </button>

          {showFilters && (
            <div className="flex flex-wrap gap-2 mt-2">
              {(['all', 'chat', 'mission', 'review', 'debug'] as const).map(
                (type) => (
                  <button
                    key={type}
                    onClick={() => setTypeFilter(type)}
                    className={`px-2 py-1 text-xs rounded-full transition-colors ${
                      typeFilter === type
                        ? 'bg-symtex-primary/20 text-symtex-primary border border-symtex-primary/30'
                        : 'bg-card/50 text-muted-foreground border border-border hover:border-border'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {/* Pinned section */}
        {pinnedConversations.length > 0 && (
          <div className="mb-4">
            <h3 className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Pinned
            </h3>
            <div className="space-y-1">
              {pinnedConversations.map((conv) => (
                <ConversationItem
                  key={conv.id}
                  conversation={conv}
                  isSelected={conv.id === selectedId}
                  onSelect={() => onSelect(conv)}
                  onTogglePin={onTogglePin ? () => onTogglePin(conv.id) : undefined}
                  onArchive={onArchive ? () => onArchive(conv.id) : undefined}
                  onDelete={onDelete ? () => onDelete(conv.id) : undefined}
                />
              ))}
            </div>
          </div>
        )}

        {/* Recent section */}
        {unpinnedConversations.length > 0 && (
          <div>
            {pinnedConversations.length > 0 && (
              <h3 className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Recent
              </h3>
            )}
            <div className="space-y-1">
              {unpinnedConversations.map((conv) => (
                <ConversationItem
                  key={conv.id}
                  conversation={conv}
                  isSelected={conv.id === selectedId}
                  onSelect={() => onSelect(conv)}
                  onTogglePin={onTogglePin ? () => onTogglePin(conv.id) : undefined}
                  onArchive={onArchive ? () => onArchive(conv.id) : undefined}
                  onDelete={onDelete ? () => onDelete(conv.id) : undefined}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {filteredConversations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MessageSquare className="w-12 h-12 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No conversations found</p>
            <p className="text-sm text-muted-foreground mt-1">
              {search
                ? 'Try a different search term'
                : 'Start a new conversation to get started'}
            </p>
            {!search && (
              <button
                onClick={onNewConversation}
                className="mt-4 px-4 py-2 bg-symtex-primary text-foreground rounded-lg text-sm font-medium hover:bg-symtex-primary/80 transition-colors"
              >
                New Conversation
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
