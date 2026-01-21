/**
 * ChatContextInfo Component
 *
 * Displays the current context (domain, project, mission) that the chat
 * conversation is associated with. Shows breadcrumb-style navigation info.
 */

import { MapPin, Folder, Target, Home, ChevronRight } from 'lucide-react';
import type { ContextState, SpaceType, BreadcrumbItem } from '@/types';

interface ChatContextInfoProps {
  /** The current context state to display */
  context: ContextState;
  /** Whether to show the full breadcrumb trail or just current */
  showFullBreadcrumb?: boolean;
  /** Callback when a breadcrumb item is clicked */
  onBreadcrumbClick?: (item: BreadcrumbItem) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Returns the appropriate icon for a space type
 */
function getSpaceIcon(type: SpaceType): JSX.Element {
  const iconClass = 'w-3.5 h-3.5';

  switch (type) {
    case 'personal':
      return <Home className={iconClass} />;
    case 'domain':
      return <MapPin className={iconClass} />;
    case 'project':
      return <Folder className={iconClass} />;
    case 'mission':
      return <Target className={iconClass} />;
    default:
      return <Home className={iconClass} />;
  }
}

/**
 * Returns a color class based on space type
 */
function getSpaceColor(type: SpaceType): string {
  switch (type) {
    case 'personal':
      return 'text-muted-foreground';
    case 'domain':
      return 'text-blue-400';
    case 'project':
      return 'text-purple-400';
    case 'mission':
      return 'text-symtex-primary';
    default:
      return 'text-muted-foreground';
  }
}

/**
 * Displays context information for the current chat conversation
 */
export function ChatContextInfo({
  context,
  showFullBreadcrumb = false,
  onBreadcrumbClick,
  className = '',
}: ChatContextInfoProps): JSX.Element {
  const { breadcrumb, currentSpaceType } = context;

  // Show only the last item if not showing full breadcrumb
  const displayItems = showFullBreadcrumb ? breadcrumb : breadcrumb.slice(-1);

  if (displayItems.length === 0) {
    return (
      <div className={`flex items-center gap-2 text-sm text-muted-foreground ${className}`}>
        <Home className="w-3.5 h-3.5" />
        <span>Personal Space</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1 text-sm ${className}`}>
      {displayItems.map((item, index) => {
        const isLast = index === displayItems.length - 1;
        const isClickable = !!onBreadcrumbClick && !isLast;

        return (
          <div key={`${item.type}-${item.id}`} className="flex items-center gap-1">
            {index > 0 && (
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
            )}
            <button
              onClick={() => isClickable && onBreadcrumbClick?.(item)}
              disabled={!isClickable}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors ${
                isClickable
                  ? 'hover:bg-muted/50 cursor-pointer'
                  : 'cursor-default'
              } ${isLast ? getSpaceColor(item.type) : 'text-muted-foreground'}`}
            >
              <span className={isLast ? getSpaceColor(item.type) : 'text-muted-foreground'}>
                {getSpaceIcon(item.type)}
              </span>
              <span
                className={`max-w-[120px] truncate ${
                  isLast ? 'font-medium' : 'font-normal'
                }`}
              >
                {item.name}
              </span>
            </button>
          </div>
        );
      })}

      {/* Context type badge */}
      <div
        className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-card/50 border border-border/50 ${getSpaceColor(
          currentSpaceType
        )}`}
      >
        {currentSpaceType.charAt(0).toUpperCase() + currentSpaceType.slice(1)}
      </div>
    </div>
  );
}

/**
 * Compact version for use in headers or tight spaces
 */
export function ChatContextBadge({
  context,
  className = '',
}: {
  context: ContextState;
  className?: string;
}): JSX.Element {
  const currentItem = context.breadcrumb[context.breadcrumb.length - 1];
  const colorClass = getSpaceColor(context.currentSpaceType);

  if (!currentItem) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-full bg-card/50 border border-border/50 text-muted-foreground ${className}`}
      >
        <Home className="w-3 h-3" />
        <span>Personal</span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-full bg-card/50 border border-border/50 ${colorClass} ${className}`}
    >
      {getSpaceIcon(currentItem.type)}
      <span className="max-w-[100px] truncate">{currentItem.name}</span>
    </div>
  );
}
