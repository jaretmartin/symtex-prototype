/**
 * CommandGroup Component
 *
 * Renders a category group header with icon.
 */

import { memo } from 'react';
import { Play, Layout, Bot, Shield, Settings, type LucideIcon } from 'lucide-react';
import clsx from 'clsx';
import type { CommandCategory } from '../../hooks/useCommandPalette';

// ============================================================================
// Types
// ============================================================================

export interface CommandGroupProps {
  category: CommandCategory;
  count: number;
  children: React.ReactNode;
}

// ============================================================================
// Category Configuration
// ============================================================================

interface CategoryConfig {
  icon: LucideIcon;
  label: string;
  color: string;
}

const CATEGORY_CONFIG: Record<CommandCategory, CategoryConfig> = {
  actions: { icon: Play, label: 'Actions', color: 'text-green-400' },
  pages: { icon: Layout, label: 'Pages', color: 'text-blue-400' },
  cognates: { icon: Bot, label: 'Cognates', color: 'text-purple-400' },
  governance: { icon: Shield, label: 'Governance', color: 'text-amber-400' },
  settings: { icon: Settings, label: 'Settings', color: 'text-muted-foreground' },
};

// ============================================================================
// CommandGroup Component
// ============================================================================

export const CommandGroup = memo(function CommandGroup({
  category,
  count,
  children,
}: CommandGroupProps) {
  const config = CATEGORY_CONFIG[category];
  const Icon = config.icon;

  return (
    <div className="mb-2" role="group" aria-labelledby={`group-${category}`}>
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-2">
          <Icon className={clsx('w-4 h-4', config.color)} aria-hidden="true" />
          <span
            id={`group-${category}`}
            className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
          >
            {config.label}
          </span>
          <span className="text-xs text-muted-foreground">({count})</span>
        </div>
      </div>

      <div role="listbox" aria-label={`${config.label} results`}>
        {children}
      </div>
    </div>
  );
});

// ============================================================================
// Empty State Component
// ============================================================================

export interface EmptyStateProps {
  query: string;
}

export const CommandEmptyState = memo(function CommandEmptyState({ query }: EmptyStateProps) {
  return (
    <div className="px-4 py-12 text-center">
      <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-card flex items-center justify-center">
        <svg
          className="w-6 h-6 text-muted-foreground"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>
      <p className="text-sm font-medium text-muted-foreground mb-1">No results found</p>
      <p className="text-xs text-muted-foreground">No matches for "{query}". Try a different search term.</p>
    </div>
  );
});

// ============================================================================
// Loading State Component
// ============================================================================

export const CommandLoadingState = memo(function CommandLoadingState() {
  return (
    <div className="px-4 py-12 text-center">
      <div
        className="w-8 h-8 mx-auto mb-3 rounded-full border-2 border-purple-800 border-t-purple-400 animate-spin"
        role="status"
        aria-label="Loading search results"
      />
      <p className="text-sm text-muted-foreground">Searching...</p>
    </div>
  );
});

// ============================================================================
// Default State Component
// ============================================================================

export interface CommandDefaultStateProps {
  recentSearches: string[];
  onRecentClick: (search: string) => void;
  onClearRecent: () => void;
  suggestions: Array<{
    id: string;
    title: string;
    description?: string;
    onClick: () => void;
  }>;
}

export const CommandDefaultState = memo(function CommandDefaultState({
  recentSearches,
  onRecentClick,
  onClearRecent,
  suggestions,
}: CommandDefaultStateProps) {
  return (
    <div className="px-2 py-3">
      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
              <svg
                className="w-3 h-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12,6 12,12 16,14" />
              </svg>
              Recent Searches
            </span>
            <button
              onClick={onClearRecent}
              className="text-xs text-muted-foreground hover:text-muted-foreground transition-colors"
            >
              Clear
            </button>
          </div>
          <ul className="space-y-1" role="list">
            {recentSearches.map((search, idx) => (
              <li key={idx}>
                <button
                  onClick={() => onRecentClick(search)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-muted-foreground hover:bg-card transition-colors"
                >
                  <svg
                    className="w-4 h-4 text-muted-foreground"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12,6 12,12 16,14" />
                  </svg>
                  <span className="flex-1 text-left truncate">{search}</span>
                  <svg
                    className="w-4 h-4 text-muted-foreground"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12,5 19,12 12,19" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggestions */}
      <div>
        <div className="px-2 mb-2">
          <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
            <svg
              className="w-3 h-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polygon points="12,2 15,8 22,9 17,14 18,21 12,18 6,21 7,14 2,9 9,8" />
            </svg>
            Suggestions
          </span>
        </div>
        <ul className="space-y-1" role="list">
          {suggestions.map((suggestion) => (
            <li key={suggestion.id}>
              <button
                onClick={suggestion.onClick}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-muted-foreground hover:bg-card transition-colors"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-card">
                  <Play className="w-4 h-4 text-green-400" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium">{suggestion.title}</div>
                  {suggestion.description && (
                    <div className="text-xs text-muted-foreground">{suggestion.description}</div>
                  )}
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
});

export default CommandGroup;
