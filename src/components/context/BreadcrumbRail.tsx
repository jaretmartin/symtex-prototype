/**
 * BreadcrumbRail Component
 *
 * An always-visible top navigation bar showing the user's current position
 * within the space hierarchy: Personal -> Domain -> Project -> Mission
 *
 * Features:
 * - Clickable segments for navigation
 * - Keyboard navigation with arrow keys
 * - Active segment highlighting with subtle pulse animation
 * - Accessible with proper ARIA attributes
 */

import { useCallback, useRef, useEffect, type KeyboardEvent } from 'react';
import { Home, Folder, FolderKanban, Target, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { useContextStore } from '@/store/useContextStore';
import type { SpaceType, BreadcrumbItem } from '@/types';

interface BreadcrumbRailProps {
  className?: string;
}

interface BreadcrumbSegmentProps {
  item: BreadcrumbItem;
  isActive: boolean;
  isFirst: boolean;
  onNavigate: () => void;
  onKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => void;
  segmentRef: (el: HTMLButtonElement | null) => void;
}

/**
 * Returns the appropriate icon component for a space type
 */
function getSpaceIcon(type: SpaceType): React.ElementType {
  switch (type) {
    case 'personal':
      return Home;
    case 'domain':
      return Folder;
    case 'project':
      return FolderKanban;
    case 'mission':
      return Target;
    default:
      return Home;
  }
}

/**
 * Individual breadcrumb segment component
 */
function BreadcrumbSegment({
  item,
  isActive,
  isFirst,
  onNavigate,
  onKeyDown,
  segmentRef,
}: BreadcrumbSegmentProps): JSX.Element {
  const Icon = getSpaceIcon(item.type);

  return (
    <li className="flex items-center">
      {!isFirst && (
        <ChevronRight
          className="w-4 h-4 mx-2 text-muted-foreground flex-shrink-0"
          aria-hidden="true"
        />
      )}
      <button
        ref={segmentRef}
        type="button"
        onClick={onNavigate}
        onKeyDown={onKeyDown}
        aria-current={isActive ? 'page' : undefined}
        className={clsx(
          'flex items-center gap-2 px-3 py-1.5 rounded-lg',
          'text-sm font-medium transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-symtex-primary focus-visible:ring-offset-2 focus-visible:ring-offset-symtex-dark',
          isActive
            ? [
                'bg-symtex-primary/20 text-symtex-primary border border-symtex-primary/30',
                'animate-pulse-subtle',
              ]
            : [
                'text-muted-foreground hover:text-white hover:bg-card/50',
                'border border-transparent',
              ]
        )}
      >
        <Icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
        <span className="truncate max-w-[120px]">{item.name}</span>
      </button>
    </li>
  );
}

/**
 * BreadcrumbRail - Navigation bar showing current position in space hierarchy
 */
export function BreadcrumbRail({ className }: BreadcrumbRailProps): JSX.Element {
  const { breadcrumb, currentSpaceType, currentId, navigateTo } = useContextStore();
  const segmentRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Default breadcrumb when none exists (always show Personal)
  const displayBreadcrumb: BreadcrumbItem[] =
    breadcrumb.length > 0
      ? breadcrumb
      : [{ type: 'personal', id: 'personal', name: 'Personal Space' }];

  // Find the index of the active segment
  const activeIndex = displayBreadcrumb.findIndex(
    (item) => item.type === currentSpaceType && item.id === currentId
  );

  // Handle navigation to a segment
  const handleNavigate = useCallback(
    (item: BreadcrumbItem): void => {
      navigateTo(item.type, item.id, item.name, item.icon);
    },
    [navigateTo]
  );

  // Handle keyboard navigation between segments
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>, index: number): void => {
      let nextIndex: number | null = null;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        nextIndex = Math.min(index + 1, displayBreadcrumb.length - 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        nextIndex = Math.max(index - 1, 0);
      } else if (e.key === 'Home') {
        e.preventDefault();
        nextIndex = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        nextIndex = displayBreadcrumb.length - 1;
      }

      if (nextIndex !== null && segmentRefs.current[nextIndex]) {
        segmentRefs.current[nextIndex]?.focus();
      }
    },
    [displayBreadcrumb.length]
  );

  // Update refs array size when breadcrumb changes
  useEffect(() => {
    segmentRefs.current = segmentRefs.current.slice(0, displayBreadcrumb.length);
  }, [displayBreadcrumb.length]);

  return (
    <nav
      aria-label="Breadcrumb navigation"
      className={clsx(
        'h-12 px-4 flex items-center',
        'bg-card/80 backdrop-blur-sm',
        'border-b border-border',
        className
      )}
    >
      <ol
        className="flex items-center flex-wrap gap-y-1"
        role="list"
      >
        {displayBreadcrumb.map((item, index) => (
          <BreadcrumbSegment
            key={`${item.type}-${item.id}`}
            item={item}
            isActive={
              activeIndex === -1
                ? index === displayBreadcrumb.length - 1 // Default to last item if no active
                : index === activeIndex
            }
            isFirst={index === 0}
            onNavigate={() => handleNavigate(item)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            segmentRef={(el) => {
              segmentRefs.current[index] = el;
            }}
          />
        ))}
      </ol>
    </nav>
  );
}

export default BreadcrumbRail;
