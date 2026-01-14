/**
 * ContextSummaryPill Component
 *
 * A floating pill that displays contextual information about the user's current
 * position in the space hierarchy. Provides quick access to navigation context,
 * active cognate info, and running automations.
 *
 * Features:
 * - Collapsed pill showing project name, cognate avatar, and running count
 * - Expanded panel with full context details and quick navigation
 * - Glass-morphism styling with smooth animations
 * - Keyboard accessible with focus trap when expanded
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  X,
  Bot,
  Play,
  Folder,
  Home,
  Layers,
  Target,
  Clock,
  Gauge,
} from 'lucide-react';
import clsx from 'clsx';
import { useContextStore, useSpaceStore, useCognateStore } from '@/store';
import type { SpaceType, BreadcrumbItem, Cognate, SpaceMission } from '@/types';

// ============================================================================
// Types
// ============================================================================

interface ContextSummaryPillProps {
  className?: string;
}

interface CollapsedPillProps {
  projectName: string;
  cognateAvatar?: string;
  cognateName?: string;
  runningCount: number;
  onClick: () => void;
}

interface ExpandedPanelProps {
  breadcrumb: BreadcrumbItem[];
  currentProjectName: string;
  activeCognate: Cognate | null;
  runningMissions: SpaceMission[];
  recentSpaces: BreadcrumbItem[];
  dnaProgress?: number;
  onClose: () => void;
  onNavigate: (type: SpaceType, id: string) => void;
}

// ============================================================================
// Helper Functions
// ============================================================================

function getIconForSpaceType(type: SpaceType): React.ElementType {
  switch (type) {
    case 'personal':
      return Home;
    case 'domain':
      return Layers;
    case 'project':
      return Folder;
    case 'mission':
      return Target;
    default:
      return Folder;
  }
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

// ============================================================================
// Collapsed Pill Component
// ============================================================================

function CollapsedPill({
  projectName,
  cognateAvatar,
  cognateName,
  runningCount,
  onClick,
}: CollapsedPillProps): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'flex items-center gap-2 px-3 py-2 rounded-full',
        'bg-slate-800/80 backdrop-blur-md border border-slate-700/50',
        'shadow-lg shadow-black/20',
        'hover:bg-slate-700/80 hover:border-slate-600/50',
        'transition-all duration-200 ease-out',
        'focus:outline-none focus:ring-2 focus:ring-symtex-primary/50'
      )}
      aria-expanded={false}
      aria-haspopup="dialog"
      aria-label={`Context: ${projectName}. Click to expand for more details.`}
    >
      {/* Project Name */}
      <span className="text-sm font-medium text-slate-200 max-w-[120px] truncate">
        {truncateText(projectName, 16)}
      </span>

      {/* Divider */}
      <span className="w-px h-4 bg-slate-600" aria-hidden="true" />

      {/* Cognate Avatar */}
      <div
        className={clsx(
          'w-6 h-6 rounded-full flex items-center justify-center',
          'bg-gradient-to-br from-symtex-primary to-purple-600'
        )}
        title={cognateName || 'No active cognate'}
      >
        {cognateAvatar ? (
          <span className="text-xs">{cognateAvatar}</span>
        ) : (
          <Bot className="w-3.5 h-3.5 text-white" aria-hidden="true" />
        )}
      </div>

      {/* Running Automations Count */}
      {runningCount > 0 && (
        <>
          <span className="w-px h-4 bg-slate-600" aria-hidden="true" />
          <div
            className={clsx(
              'flex items-center gap-1 px-1.5 py-0.5 rounded-full',
              'bg-green-500/20 text-green-400'
            )}
          >
            <Play className="w-3 h-3" aria-hidden="true" />
            <span className="text-xs font-medium">{runningCount}</span>
          </div>
        </>
      )}

      {/* Expand Indicator */}
      <ChevronRight
        className="w-4 h-4 text-slate-400"
        aria-hidden="true"
      />
    </button>
  );
}

// ============================================================================
// Expanded Panel Component
// ============================================================================

function ExpandedPanel({
  breadcrumb,
  currentProjectName,
  activeCognate,
  runningMissions,
  recentSpaces,
  dnaProgress,
  onClose,
  onNavigate,
}: ExpandedPanelProps): JSX.Element {
  const panelRef = useRef<HTMLDivElement>(null);

  // Focus trap - keep focus within the panel
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const focusableElements = panel.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus the close button when panel opens
    firstElement?.focus();

    function handleTabKey(e: KeyboardEvent): void {
      if (e.key !== 'Tab') return;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    }

    panel.addEventListener('keydown', handleTabKey);
    return () => panel.removeEventListener('keydown', handleTabKey);
  }, []);

  const autonomyLabels: Record<number, string> = {
    1: 'Minimal',
    2: 'Guided',
    3: 'Balanced',
    4: 'Full',
  };

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Context details panel"
      className={clsx(
        'w-80 max-h-[70vh] overflow-hidden',
        'bg-slate-800/95 backdrop-blur-xl border border-slate-700/50',
        'rounded-lg shadow-2xl shadow-black/30',
        'animate-in slide-in-from-bottom-4 fade-in duration-200'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-700/50">
        <h2 className="text-sm font-semibold text-white">Context Details</h2>
        <button
          type="button"
          onClick={onClose}
          className={clsx(
            'p-1 rounded-md text-slate-400',
            'hover:text-white hover:bg-slate-700/50',
            'focus:outline-none focus:ring-2 focus:ring-symtex-primary/50',
            'transition-colors'
          )}
          aria-label="Close panel"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="overflow-y-auto max-h-[calc(70vh-3rem)]">
        {/* Breadcrumb Path */}
        <div className="p-3 border-b border-slate-700/30">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
            Current Path
          </h3>
          <nav aria-label="Breadcrumb navigation">
            <ol className="flex flex-wrap items-center gap-1">
              {breadcrumb.map((item, index) => {
                const IconComponent = getIconForSpaceType(item.type);
                const isLast = index === breadcrumb.length - 1;

                return (
                  <li key={`${item.type}-${item.id}`} className="flex items-center">
                    <button
                      type="button"
                      onClick={() => onNavigate(item.type, item.id)}
                      disabled={isLast}
                      className={clsx(
                        'flex items-center gap-1 px-2 py-1 rounded-md text-xs',
                        'transition-colors',
                        isLast
                          ? 'bg-symtex-primary/20 text-symtex-primary cursor-default'
                          : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                      )}
                      aria-current={isLast ? 'page' : undefined}
                    >
                      <IconComponent className="w-3 h-3" aria-hidden="true" />
                      <span>{truncateText(item.name, 14)}</span>
                    </button>
                    {!isLast && (
                      <ChevronRight
                        className="w-3 h-3 text-slate-600 mx-0.5"
                        aria-hidden="true"
                      />
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>

        {/* Current Project */}
        <div className="p-3 border-b border-slate-700/30">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
            Current Project
          </h3>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Folder className="w-4 h-4 text-white" aria-hidden="true" />
            </div>
            <span className="text-sm font-medium text-white">
              {currentProjectName || 'No project selected'}
            </span>
          </div>
        </div>

        {/* Active Cognate */}
        <div className="p-3 border-b border-slate-700/30">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
            Active Cognate
          </h3>
          {activeCognate ? (
            <div className="flex items-center gap-3">
              <div
                className={clsx(
                  'w-10 h-10 rounded-full flex items-center justify-center',
                  'bg-gradient-to-br from-symtex-primary to-purple-600'
                )}
              >
                {activeCognate.avatar ? (
                  <span className="text-lg">{activeCognate.avatar}</span>
                ) : (
                  <Bot className="w-5 h-5 text-white" aria-hidden="true" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {activeCognate.name}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Gauge className="w-3 h-3 text-slate-400" aria-hidden="true" />
                  <span className="text-xs text-slate-400">
                    Autonomy: {autonomyLabels[2] || 'Unknown'}
                  </span>
                </div>
              </div>
              <span
                className={clsx(
                  'px-2 py-0.5 rounded-full text-xs font-medium',
                  activeCognate.status === 'active'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-slate-600/50 text-slate-400'
                )}
              >
                {activeCognate.status}
              </span>
            </div>
          ) : (
            <p className="text-sm text-slate-500 italic">No cognate assigned</p>
          )}
        </div>

        {/* Running Missions/Automations */}
        <div className="p-3 border-b border-slate-700/30">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
            Running Automations
          </h3>
          {runningMissions.length > 0 ? (
            <ul className="space-y-2">
              {runningMissions.slice(0, 3).map((mission, index) => (
                <li
                  key={mission.id}
                  className={clsx(
                    'flex items-center gap-2 p-2 rounded-md',
                    'bg-slate-700/30',
                    'animate-in fade-in slide-in-from-left-2',
                    index === 0 && 'animation-delay-0',
                    index === 1 && 'animation-delay-100',
                    index === 2 && 'animation-delay-200'
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Play className="w-3 h-3 text-green-400" aria-hidden="true" />
                  </div>
                  <span className="text-sm text-slate-300 truncate flex-1">
                    {mission.name}
                  </span>
                  <Clock className="w-3 h-3 text-slate-500" aria-hidden="true" />
                </li>
              ))}
              {runningMissions.length > 3 && (
                <li className="text-xs text-slate-500 text-center py-1">
                  +{runningMissions.length - 3} more running
                </li>
              )}
            </ul>
          ) : (
            <p className="text-sm text-slate-500 italic">No automations running</p>
          )}
        </div>

        {/* DNA Progress */}
        {dnaProgress !== undefined && (
          <div className="p-3 border-b border-slate-700/30">
            <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
              DNA Completion
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-symtex-primary to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${dnaProgress}%` }}
                  role="progressbar"
                  aria-valuenow={dnaProgress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`DNA completion ${dnaProgress}%`}
                />
              </div>
              <span className="text-sm font-medium text-slate-300">
                {dnaProgress}%
              </span>
            </div>
          </div>
        )}

        {/* Quick Navigation */}
        {recentSpaces.length > 0 && (
          <div className="p-3">
            <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
              Recent Spaces
            </h3>
            <div className="space-y-1">
              {recentSpaces.slice(0, 4).map((space, index) => {
                const IconComponent = getIconForSpaceType(space.type);

                return (
                  <button
                    key={`${space.type}-${space.id}`}
                    type="button"
                    onClick={() => onNavigate(space.type, space.id)}
                    className={clsx(
                      'w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left',
                      'text-slate-400 hover:text-white hover:bg-slate-700/50',
                      'transition-colors',
                      'animate-in fade-in slide-in-from-left-2'
                    )}
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <IconComponent className="w-4 h-4" aria-hidden="true" />
                    <span className="text-sm truncate">{space.name}</span>
                    <span className="text-xs text-slate-600 capitalize ml-auto">
                      {space.type}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function ContextSummaryPill({
  className,
}: ContextSummaryPillProps): JSX.Element | null {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Store selectors
  const breadcrumb = useContextStore((state) => state.breadcrumb);
  const historyStack = useContextStore((state) => state.historyStack);
  const currentSpaceType = useContextStore((state) => state.currentSpaceType);
  const currentId = useContextStore((state) => state.currentId);
  const navigateTo = useContextStore((state) => state.navigateTo);

  const missions = useSpaceStore((state) => state.getMissions());
  const projects = useSpaceStore((state) => state.getProjects());
  const domains = useSpaceStore((state) => state.getDomains());

  const cognates = useCognateStore((state) => state.cognates);
  const selectedCognate = useCognateStore((state) => state.selectedCognate);

  // Derived state
  const runningMissions = missions.filter((m) => m.status === 'running');

  // Get current project name from breadcrumb or context
  const currentProject = breadcrumb.find((item) => item.type === 'project');
  const projectName = currentProject?.name || 'Symtex';

  // Get active cognate (prefer selected, fall back to first active)
  const activeCognate =
    selectedCognate ||
    cognates.find((c) => c.status === 'active') ||
    null;

  // Get recent spaces from history (excluding current)
  const recentSpaces = historyStack
    .filter((item) => !(item.type === currentSpaceType && item.id === currentId))
    .slice(-5)
    .reverse();

  // Calculate DNA progress (placeholder - would come from actual DNA store)
  const dnaProgress = 68;

  // Handle close
  const handleClose = useCallback((): void => {
    setIsExpanded(false);
  }, []);

  // Handle navigation
  const handleNavigate = useCallback(
    (type: SpaceType, id: string): void => {
      // Find the item name
      let name = id;
      if (type === 'domain') {
        const domain = domains.find((d) => d.id === id);
        name = domain?.name || id;
      } else if (type === 'project') {
        const project = projects.find((p) => p.id === id);
        name = project?.name || id;
      } else if (type === 'mission') {
        const mission = missions.find((m) => m.id === id);
        name = mission?.name || id;
      }

      navigateTo(type, id, name);
      setIsExpanded(false);

      // Navigate to the appropriate route
      if (type === 'mission') {
        navigate(`/missions/${id}`);
      } else if (type === 'project') {
        navigate(`/projects/${id}`);
      }
    },
    [navigate, navigateTo, domains, projects, missions]
  );

  // Handle click outside
  useEffect(() => {
    if (!isExpanded) return;

    function handleClickOutside(event: MouseEvent): void {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isExpanded]);

  // Handle escape key
  useEffect(() => {
    if (!isExpanded) return;

    function handleEscape(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        setIsExpanded(false);
      }
    }

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isExpanded]);

  // Announce state changes to screen readers
  useEffect(() => {
    const announcement = isExpanded
      ? 'Context panel expanded'
      : 'Context panel collapsed';
    const ariaLive = document.createElement('div');
    ariaLive.setAttribute('aria-live', 'polite');
    ariaLive.setAttribute('aria-atomic', 'true');
    ariaLive.className = 'sr-only';
    ariaLive.textContent = announcement;
    document.body.appendChild(ariaLive);

    return () => {
      document.body.removeChild(ariaLive);
    };
  }, [isExpanded]);

  // Don't render if there's no context
  if (!currentSpaceType && breadcrumb.length === 0) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={clsx(
        'fixed bottom-6 right-6 z-50',
        'flex flex-col items-end gap-2',
        className
      )}
    >
      {/* Expanded Panel */}
      {isExpanded && (
        <ExpandedPanel
          breadcrumb={
            breadcrumb.length > 0
              ? breadcrumb
              : [{ type: 'personal', id: 'personal', name: 'Home' }]
          }
          currentProjectName={projectName}
          activeCognate={activeCognate}
          runningMissions={runningMissions}
          recentSpaces={recentSpaces}
          dnaProgress={dnaProgress}
          onClose={handleClose}
          onNavigate={handleNavigate}
        />
      )}

      {/* Collapsed Pill */}
      {!isExpanded && (
        <CollapsedPill
          projectName={projectName}
          cognateAvatar={activeCognate?.avatar}
          cognateName={activeCognate?.name}
          runningCount={runningMissions.length}
          onClick={() => setIsExpanded(true)}
        />
      )}
    </div>
  );
}
