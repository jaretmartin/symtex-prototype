/**
 * AriaQuickActions Component
 *
 * Quick action suggestions from Aria that appear on hover.
 * Provides contextual suggestions based on the current page/space.
 *
 * Features:
 * - Contextual suggestions
 * - "Try saying..." examples
 * - One-click actions
 * - Smooth animations
 * - Keyboard accessible
 */

import { useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Plus,
  BarChart2,
  Search,
  Zap,
  MessageSquare,
  Settings,
  FileText,
  Users,
  Target,
} from 'lucide-react';
import clsx from 'clsx';

// ============================================================================
// Types
// ============================================================================

export type QuickActionIcon =
  | 'plus'
  | 'chart'
  | 'search'
  | 'zap'
  | 'message'
  | 'settings'
  | 'file'
  | 'users'
  | 'target';

export interface QuickAction {
  /** Unique identifier for the action */
  id: string;
  /** Display label for the action */
  label: string;
  /** Full message to send when clicked */
  message: string;
  /** Icon to display */
  icon?: QuickActionIcon;
  /** Optional category for grouping */
  category?: string;
}

export interface AriaQuickActionsProps {
  /** Array of quick actions to display */
  actions: QuickAction[];
  /** Callback when an action is selected */
  onSelect: (action: QuickAction) => void;
  /** Callback to close the quick actions panel */
  onClose: () => void;
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

function getIcon(icon?: QuickActionIcon): JSX.Element {
  const iconClass = 'w-4 h-4';

  switch (icon) {
    case 'plus':
      return <Plus className={iconClass} />;
    case 'chart':
      return <BarChart2 className={iconClass} />;
    case 'search':
      return <Search className={iconClass} />;
    case 'zap':
      return <Zap className={iconClass} />;
    case 'message':
      return <MessageSquare className={iconClass} />;
    case 'settings':
      return <Settings className={iconClass} />;
    case 'file':
      return <FileText className={iconClass} />;
    case 'users':
      return <Users className={iconClass} />;
    case 'target':
      return <Target className={iconClass} />;
    default:
      return <Zap className={iconClass} />;
  }
}

// ============================================================================
// Default Quick Actions
// ============================================================================

export const DEFAULT_QUICK_ACTIONS: Record<string, QuickAction[]> = {
  home: [
    {
      id: 'home-1',
      label: 'Create a new mission',
      message: 'Help me create a new mission.',
      icon: 'plus',
      category: 'Create',
    },
    {
      id: 'home-2',
      label: 'Check my progress',
      message: 'Show me my progress across all active missions.',
      icon: 'chart',
      category: 'Analytics',
    },
    {
      id: 'home-3',
      label: 'Find a Cognate',
      message: 'Help me find the right Cognate for my task.',
      icon: 'search',
      category: 'Navigate',
    },
    {
      id: 'home-4',
      label: 'Quick automation',
      message: 'Set up a quick automation for me.',
      icon: 'zap',
      category: 'Automate',
    },
  ],
  mission: [
    {
      id: 'mission-1',
      label: 'Update status',
      message: 'Help me update the status of this mission.',
      icon: 'target',
      category: 'Manage',
    },
    {
      id: 'mission-2',
      label: 'Add a task',
      message: 'Add a new task to this mission.',
      icon: 'plus',
      category: 'Create',
    },
    {
      id: 'mission-3',
      label: 'Generate report',
      message: 'Generate a progress report for this mission.',
      icon: 'file',
      category: 'Reports',
    },
    {
      id: 'mission-4',
      label: 'Assign Cognate',
      message: 'Help me assign a Cognate to this mission.',
      icon: 'users',
      category: 'Team',
    },
  ],
  project: [
    {
      id: 'project-1',
      label: 'Create mission',
      message: 'Create a new mission in this project.',
      icon: 'plus',
      category: 'Create',
    },
    {
      id: 'project-2',
      label: 'View analytics',
      message: 'Show me analytics for this project.',
      icon: 'chart',
      category: 'Analytics',
    },
    {
      id: 'project-3',
      label: 'Manage team',
      message: 'Help me manage the Cognates working on this project.',
      icon: 'users',
      category: 'Team',
    },
    {
      id: 'project-4',
      label: 'Configure settings',
      message: 'Show me the settings for this project.',
      icon: 'settings',
      category: 'Settings',
    },
  ],
};

// ============================================================================
// Sub-components
// ============================================================================

interface QuickActionButtonProps {
  action: QuickAction;
  onClick: () => void;
  index: number;
}

function QuickActionButton({
  action,
  onClick,
  index,
}: QuickActionButtonProps): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'group w-full flex items-center gap-3',
        'px-3 py-2.5 rounded-lg',
        'text-left transition-all duration-200',
        'hover:bg-violet-500/10',
        'focus:outline-none focus:ring-2 focus:ring-violet-400/50 focus:ring-inset',
        'animate-in slide-in-from-left fade-in'
      )}
      style={{ animationDelay: `${index * 50}ms` }}
      aria-label={`${action.label}: ${action.message}`}
    >
      {/* Icon */}
      <div
        className={clsx(
          'flex-shrink-0 w-8 h-8 rounded-lg',
          'bg-violet-500/10 border border-violet-500/20',
          'flex items-center justify-center',
          'text-violet-400',
          'transition-all duration-200',
          'group-hover:bg-violet-500/20 group-hover:border-violet-500/30',
          'group-hover:text-violet-300'
        )}
      >
        {getIcon(action.icon)}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p
          className={clsx(
            'text-sm font-medium text-slate-200',
            'group-hover:text-white',
            'transition-colors'
          )}
        >
          {action.label}
        </p>
        {action.category && (
          <p className="text-xs text-slate-500 truncate">{action.category}</p>
        )}
      </div>
    </button>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function AriaQuickActions({
  actions,
  onSelect,
  onClose,
  className,
}: AriaQuickActionsProps): JSX.Element {
  const panelRef = useRef<HTMLDivElement>(null);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Handle action selection
  const handleSelect = useCallback(
    (action: QuickAction): void => {
      onSelect(action);
    },
    [onSelect]
  );

  // Group actions by category
  const groupedActions = useMemo(() => {
    const groups: Record<string, QuickAction[]> = {};

    actions.forEach((action) => {
      const category = action.category || 'General';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(action);
    });

    return groups;
  }, [actions]);

  const hasCategories = Object.keys(groupedActions).length > 1;

  return (
    <div
      ref={panelRef}
      className={clsx(
        'px-2 py-3',
        'bg-slate-800/80 backdrop-blur-sm',
        'border-t border-violet-500/20',
        'animate-in slide-in-from-bottom-2 fade-in duration-200',
        className
      )}
      role="menu"
      aria-label="Quick actions"
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-3 pb-2 mb-2 border-b border-slate-700/50">
        <Zap className="w-4 h-4 text-violet-400" aria-hidden="true" />
        <span className="text-xs font-medium text-violet-300">
          Quick Actions
        </span>
        <span className="text-xs text-slate-500">- Try saying...</span>
      </div>

      {/* Actions */}
      <div className="space-y-1">
        {hasCategories ? (
          // Grouped by category
          Object.entries(groupedActions).map(([category, categoryActions]) => (
            <div key={category} className="mb-2 last:mb-0">
              <p className="px-3 py-1 text-[10px] uppercase tracking-wider text-slate-500 font-medium">
                {category}
              </p>
              {categoryActions.map((action, index) => (
                <QuickActionButton
                  key={action.id}
                  action={action}
                  onClick={(): void => handleSelect(action)}
                  index={index}
                />
              ))}
            </div>
          ))
        ) : (
          // Flat list
          actions.map((action, index) => (
            <QuickActionButton
              key={action.id}
              action={action}
              onClick={(): void => handleSelect(action)}
              index={index}
            />
          ))
        )}
      </div>

      {/* Example prompts */}
      <div className="mt-3 px-3 pt-3 border-t border-slate-700/50">
        <p className="text-xs text-slate-500 mb-2">Or try typing:</p>
        <div className="flex flex-wrap gap-2">
          {['Help me with...', 'Create a...', 'Show me...'].map((prompt) => (
            <span
              key={prompt}
              className={clsx(
                'px-2 py-1 rounded-md text-xs',
                'bg-slate-700/50 text-slate-400',
                'border border-slate-600/50'
              )}
            >
              "{prompt}"
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Hook for context-aware quick actions
// ============================================================================

export interface UseQuickActionsOptions {
  /** Current space type (home, mission, project, etc.) */
  spaceType?: string;
  /** Additional custom actions to include */
  customActions?: QuickAction[];
}

export function useQuickActions({
  spaceType = 'home',
  customActions = [],
}: UseQuickActionsOptions): QuickAction[] {
  return useMemo(() => {
    const defaultActions = DEFAULT_QUICK_ACTIONS[spaceType] || DEFAULT_QUICK_ACTIONS.home;
    return [...defaultActions, ...customActions];
  }, [spaceType, customActions]);
}

export default AriaQuickActions;
