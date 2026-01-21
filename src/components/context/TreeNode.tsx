/**
 * TreeNode Component
 *
 * Individual tree node component for the SpaceTree sidebar.
 * Renders hierarchical items with expand/collapse, selection, and hover states.
 */

import { useRef, useCallback } from 'react';
import {
  ChevronRight,
  ChevronDown,
  User,
  Folder,
  FileText,
  Target,
  Plus,
  Circle,
  Play,
  CheckCircle,
  XCircle,
  Pause,
  Clock,
} from 'lucide-react';
import clsx from 'clsx';
import type { ProjectStatus, SpaceMissionStatus } from '@/types';

export type TreeNodeType = 'personal' | 'domain' | 'project' | 'mission';

export interface TreeNodeProps {
  /** Node type in the hierarchy */
  type: TreeNodeType;
  /** Unique identifier for this node */
  id: string;
  /** Display name */
  name: string;
  /** Optional icon name (for domains) */
  icon?: string;
  /** Optional color (for domains) */
  color?: string;
  /** Count of children (for badge display) */
  childCount?: number;
  /** Status for projects/missions */
  status?: ProjectStatus | SpaceMissionStatus;
  /** Whether the node is expanded */
  isExpanded: boolean;
  /** Whether the node is currently selected */
  isSelected: boolean;
  /** Indentation level (0-3) */
  level: number;
  /** Whether this node has children */
  hasChildren: boolean;
  /** Callback when expand/collapse is toggled */
  onToggle: () => void;
  /** Callback when the node is selected */
  onSelect: () => void;
  /** Optional callback for quick add action */
  onQuickAdd?: () => void;
  /** Child nodes */
  children?: React.ReactNode;
  /** Whether the node is focused for keyboard navigation */
  isFocused?: boolean;
  /** Ref for keyboard navigation focus management */
  nodeRef?: React.RefObject<HTMLDivElement>;
}

/**
 * Get the appropriate icon for the node type
 */
function getNodeIcon(
  type: TreeNodeType,
  _status?: ProjectStatus | SpaceMissionStatus
): React.ElementType {
  switch (type) {
    case 'personal':
      return User;
    case 'domain':
      return Folder;
    case 'project':
      return FileText;
    case 'mission':
      return Target;
    default:
      return Circle;
  }
}

/**
 * Get status indicator icon and color
 */
function getStatusIndicator(
  type: TreeNodeType,
  status?: ProjectStatus | SpaceMissionStatus
): { icon: React.ElementType; colorClass: string } | null {
  if (type === 'project' && status) {
    switch (status as ProjectStatus) {
      case 'active':
        return { icon: Play, colorClass: 'text-green-500' };
      case 'paused':
        return { icon: Pause, colorClass: 'text-yellow-500' };
      case 'completed':
        return { icon: CheckCircle, colorClass: 'text-muted-foreground' };
    }
  }

  if (type === 'mission' && status) {
    switch (status as SpaceMissionStatus) {
      case 'queued':
        return { icon: Clock, colorClass: 'text-yellow-500' };
      case 'running':
        return { icon: Play, colorClass: 'text-green-500' };
      case 'completed':
        return { icon: CheckCircle, colorClass: 'text-muted-foreground' };
      case 'failed':
        return { icon: XCircle, colorClass: 'text-red-500' };
    }
  }

  return null;
}

/**
 * Calculate left padding based on level
 */
function getLevelPadding(level: number): string {
  const basePadding = 8; // px
  const indentPerLevel = 16; // px
  return `${basePadding + level * indentPerLevel}px`;
}

export function TreeNode({
  type,
  id: _id,
  name,
  icon: _icon,
  color,
  childCount,
  status,
  isExpanded,
  isSelected,
  level,
  hasChildren,
  onToggle,
  onSelect,
  onQuickAdd,
  children,
  isFocused = false,
  nodeRef,
}: TreeNodeProps): JSX.Element {
  const internalRef = useRef<HTMLDivElement>(null);
  const ref = nodeRef ?? internalRef;

  // Note: _id and _icon are used for future enhancements (data attributes, custom icons)
  const Icon = getNodeIcon(type, status);
  const statusIndicator = getStatusIndicator(type, status);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent): void => {
      switch (e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault();
          onSelect();
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (hasChildren && !isExpanded) {
            onToggle();
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (hasChildren && isExpanded) {
            onToggle();
          }
          break;
      }
    },
    [onSelect, onToggle, hasChildren, isExpanded]
  );

  const handleToggleClick = useCallback(
    (e: React.MouseEvent): void => {
      e.stopPropagation();
      onToggle();
    },
    [onToggle]
  );

  const handleQuickAddClick = useCallback(
    (e: React.MouseEvent): void => {
      e.stopPropagation();
      onQuickAdd?.();
    },
    [onQuickAdd]
  );

  // Determine what can be added to this node type
  const canAddChild = type !== 'mission';
  const addLabel = type === 'personal' ? 'domain' : type === 'domain' ? 'project' : 'mission';

  return (
    <div
      role="treeitem"
      aria-expanded={hasChildren ? isExpanded : undefined}
      aria-selected={isSelected}
      aria-level={level + 1}
    >
      <div
        ref={ref}
        className={clsx(
          'group flex items-center gap-1 py-1.5 pr-2 rounded-md cursor-pointer transition-all duration-150',
          'hover:bg-card/60',
          isSelected && 'bg-symtex-primary/20 text-symtex-primary',
          !isSelected && 'text-muted-foreground',
          isFocused && 'ring-2 ring-symtex-primary ring-offset-1 ring-offset-slate-900'
        )}
        style={{ paddingLeft: getLevelPadding(level) }}
        onClick={onSelect}
        onKeyDown={handleKeyDown}
        tabIndex={isFocused ? 0 : -1}
      >
        {/* Expand/Collapse Toggle */}
        <button
          type="button"
          className={clsx(
            'flex-shrink-0 w-4 h-4 flex items-center justify-center rounded transition-colors',
            hasChildren ? 'hover:bg-muted' : 'invisible'
          )}
          onClick={handleToggleClick}
          tabIndex={-1}
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
        >
          {hasChildren &&
            (isExpanded ? (
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
            ))}
        </button>

        {/* Domain Color Indicator */}
        {type === 'domain' && color && (
          <span
            className="flex-shrink-0 w-2 h-2 rounded-full"
            style={{ backgroundColor: color }}
            aria-hidden="true"
          />
        )}

        {/* Node Icon */}
        <Icon
          className={clsx(
            'flex-shrink-0 w-4 h-4',
            isSelected ? 'text-symtex-primary' : 'text-muted-foreground'
          )}
          aria-hidden="true"
        />

        {/* Node Name */}
        <span className="flex-1 truncate text-sm font-medium">{name}</span>

        {/* Status Indicator */}
        {statusIndicator && (
          <statusIndicator.icon
            className={clsx('flex-shrink-0 w-3.5 h-3.5', statusIndicator.colorClass)}
            aria-label={`Status: ${status}`}
          />
        )}

        {/* Child Count Badge */}
        {childCount !== undefined && childCount > 0 && (
          <span className="flex-shrink-0 text-xs text-muted-foreground bg-card px-1.5 py-0.5 rounded">
            {childCount}
          </span>
        )}

        {/* Quick Add Button (visible on hover) */}
        {canAddChild && onQuickAdd && (
          <button
            type="button"
            className={clsx(
              'flex-shrink-0 w-5 h-5 flex items-center justify-center rounded',
              'opacity-0 group-hover:opacity-100 transition-opacity',
              'hover:bg-muted text-muted-foreground hover:text-muted-foreground'
            )}
            onClick={handleQuickAddClick}
            tabIndex={-1}
            aria-label={`Add ${addLabel}`}
            title={`Add ${addLabel}`}
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Children (with animation) */}
      {hasChildren && (
        <div
          role="group"
          className={clsx(
            'overflow-hidden transition-all duration-200',
            isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export default TreeNode;
