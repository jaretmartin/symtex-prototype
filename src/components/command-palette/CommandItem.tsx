/**
 * CommandItem Component
 *
 * Renders an individual result item in the command palette.
 */

import { forwardRef, memo } from 'react';
import { ArrowRight, Command } from 'lucide-react';
import clsx from 'clsx';
import { highlightMatches } from '../../lib/fuzzy-search';
import type { CommandResult, CommandCategory } from '../../hooks/useCommandPalette';

// ============================================================================
// Types
// ============================================================================

export interface CommandItemProps {
  item: CommandResult;
  isSelected: boolean;
  query: string;
  onClick: () => void;
  onMouseEnter: () => void;
}

// ============================================================================
// Highlighted Text Component
// ============================================================================

interface HighlightedTextProps {
  text: string;
  query: string;
  className?: string;
}

function HighlightedText({ text, query, className }: HighlightedTextProps) {
  const segments = highlightMatches(text, query);

  return (
    <span className={className}>
      {segments.map((segment, index) =>
        segment.isMatch ? (
          <mark key={index} className="bg-purple-500/40 text-inherit rounded-sm px-0.5">
            {segment.text}
          </mark>
        ) : (
          <span key={index}>{segment.text}</span>
        )
      )}
    </span>
  );
}

// ============================================================================
// Keyboard Shortcut Badge
// ============================================================================

interface ShortcutBadgeProps {
  shortcut: string;
}

function ShortcutBadge({ shortcut }: ShortcutBadgeProps) {
  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  return (
    <kbd
      className={clsx(
        'hidden sm:inline-flex items-center gap-0.5',
        'px-1.5 py-0.5 text-[10px] font-mono font-medium',
        'bg-muted text-muted-foreground',
        'rounded border border-border'
      )}
    >
      {isMac && <Command className="w-2.5 h-2.5" aria-hidden="true" />}
      {!isMac && <span className="text-[9px]">Ctrl+</span>}
      {shortcut}
    </kbd>
  );
}

// ============================================================================
// Category Icon Component
// ============================================================================

interface CategoryIconProps {
  category: CommandCategory;
  isSelected: boolean;
}

function CategoryIcon({ category, isSelected }: CategoryIconProps) {
  const iconClass = clsx(
    'w-4 h-4',
    isSelected ? 'text-purple-400' : 'text-muted-foreground'
  );

  switch (category) {
    case 'actions':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="5,3 19,12 5,21" />
        </svg>
      );
    case 'pages':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="9" y1="21" x2="9" y2="9" />
        </svg>
      );
    case 'cognates':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <circle cx="9" cy="10" r="2" />
          <circle cx="15" cy="10" r="2" />
          <path d="M9 16 h6" />
        </svg>
      );
    case 'governance':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case 'settings':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      );
    default:
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
        </svg>
      );
  }
}

// ============================================================================
// Main CommandItem Component
// ============================================================================

export const CommandItem = memo(
  forwardRef<HTMLButtonElement, CommandItemProps>(
    ({ item, isSelected, query, onClick, onMouseEnter }, ref) => {
      return (
        <button
          ref={isSelected ? ref : undefined}
          role="option"
          aria-selected={isSelected}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          className={clsx(
            'w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors duration-150',
            'focus:outline-none focus-visible:outline-none',
            isSelected ? 'bg-purple-900/30' : 'hover:bg-card/50'
          )}
        >
          {/* Icon/Avatar */}
          <div
            className={clsx(
              'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm',
              isSelected ? 'bg-purple-800' : 'bg-card'
            )}
          >
            {item.icon ? (
              <span aria-hidden="true">{item.icon}</span>
            ) : (
              <CategoryIcon category={item.category} isSelected={isSelected} />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 text-left">
            <div
              className={clsx(
                'font-medium truncate',
                isSelected ? 'text-purple-200' : 'text-muted-foreground'
              )}
            >
              <HighlightedText text={item.title} query={query} />
            </div>

            {item.description && (
              <div className="text-xs text-muted-foreground truncate">
                <HighlightedText text={item.description} query={query} />
              </div>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {item.shortcut && <ShortcutBadge shortcut={item.shortcut} />}

            <ArrowRight
              className={clsx(
                'w-4 h-4 transition-colors',
                isSelected ? 'text-purple-400' : 'text-muted-foreground'
              )}
              aria-hidden="true"
            />
          </div>
        </button>
      );
    }
  )
);

CommandItem.displayName = 'CommandItem';

export default CommandItem;
