/**
 * CommandPalette Component
 *
 * A global command palette for quick navigation and actions.
 * Triggered by Cmd+K (Mac) or Ctrl+K (Windows/Linux).
 */

import { useState, useEffect, useCallback, memo } from 'react';
import { createPortal } from 'react-dom';
import { Search, X, Command } from 'lucide-react';
import clsx from 'clsx';
import { useCommandPalette, CATEGORY_ORDER } from '../../hooks/useCommandPalette';
import { CommandItem } from './CommandItem';
import { CommandGroup, CommandEmptyState, CommandLoadingState, CommandDefaultState } from './CommandGroup';

// ============================================================================
// Body Scroll Lock Hook
// ============================================================================

function useBodyScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isLocked]);
}

// ============================================================================
// Main Component
// ============================================================================

export const CommandPalette = memo(function CommandPalette() {
  const {
    isOpen,
    query,
    selectedIndex,
    isLoading,
    recentSearches,
    results,
    flattenedResults,
    totalResultsCount,
    setQuery,
    setSelectedIndex,
    close,
    selectItem,
    clearRecentSearches,
    handleKeyDown,
    inputRef,
    resultsContainerRef,
    selectedItemRef,
  } = useCommandPalette();

  useBodyScrollLock(isOpen);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        close();
      }
    },
    [close]
  );

  const handleClearInput = useCallback(() => {
    setQuery('');
    inputRef.current?.focus();
  }, [setQuery, inputRef]);

  const handleRecentClick = useCallback(
    (search: string) => {
      setQuery(search);
      inputRef.current?.focus();
    },
    [setQuery, inputRef]
  );

  const suggestions = [
    {
      id: 'browse-cognates',
      title: 'Browse Cognates',
      description: 'View and manage your AI workers',
      onClick: () =>
        selectItem({
          id: 'page-cognates',
          title: 'Cognates',
          category: 'pages',
          path: '/studio/cognates',
          score: 0,
          matchedFields: [],
        }),
    },
    {
      id: 'command-center',
      title: 'Command Center',
      description: 'System overview and controls',
      onClick: () =>
        selectItem({
          id: 'gov-command-center',
          title: 'Command Center',
          category: 'governance',
          path: '/governance/command',
          score: 0,
          matchedFields: [],
        }),
    },
    {
      id: 'create-sop',
      title: 'Create SOP',
      description: 'Standard Operating Procedure',
      onClick: () =>
        selectItem({
          id: 'action-new-sop',
          title: 'New SOP',
          category: 'actions',
          path: '/studio/sops/new',
          score: 0,
          matchedFields: [],
        }),
    },
  ];

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] sm:pt-[15vh]"
          onKeyDown={handleKeyDown}
          aria-modal="true"
          role="dialog"
          aria-labelledby="command-palette-title"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
            onClick={handleOverlayClick}
            aria-hidden="true"
          />

          {/* Modal */}
          <div
            className={clsx(
              'relative z-10 w-full max-w-xl mx-4',
              'bg-surface-base rounded-2xl shadow-2xl',
              'border border-border',
              'overflow-hidden flex flex-col',
              'max-h-[70vh]',
              'animate-in slide-in-from-top-4 fade-in duration-200'
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
              <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" aria-hidden="true" />
              <input
                ref={inputRef}
                id="command-palette-title"
                type="text"
                placeholder="Search pages, cognates, actions..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={clsx(
                  'flex-1 bg-transparent border-none outline-none',
                  'text-muted-foreground placeholder:text-muted-foreground',
                  'text-lg'
                )}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                aria-label="Search command palette"
              />

              {query && (
                <button
                  onClick={handleClearInput}
                  className="p-1 rounded transition-colors hover:bg-card"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}

              <button
                onClick={close}
                className="p-1.5 rounded-lg transition-colors hover:bg-card"
                aria-label="Close command palette"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Results */}
            <div ref={resultsContainerRef} className="flex-1 overflow-y-auto overscroll-contain">
              {isLoading && query && <CommandLoadingState />}

              {!isLoading && query && totalResultsCount > 0 && (
                <div className="py-2">
                  {CATEGORY_ORDER.map((category) => {
                    const categoryResults = results[category];
                    if (!categoryResults || categoryResults.length === 0) return null;

                    return (
                      <CommandGroup key={category} category={category} count={categoryResults.length}>
                        {categoryResults.map((item) => {
                          const globalIndex = flattenedResults.findIndex((f) => f.id === item.id);
                          const isSelected = globalIndex === selectedIndex;

                          return (
                            <CommandItem
                              key={item.id}
                              ref={isSelected ? selectedItemRef : undefined}
                              item={item}
                              isSelected={isSelected}
                              query={query}
                              onClick={() => selectItem(item)}
                              onMouseEnter={() => setSelectedIndex(globalIndex)}
                            />
                          );
                        })}
                      </CommandGroup>
                    );
                  })}
                </div>
              )}

              {!isLoading && query && totalResultsCount === 0 && <CommandEmptyState query={query} />}

              {!query && (
                <CommandDefaultState
                  recentSearches={recentSearches}
                  onRecentClick={handleRecentClick}
                  onClearRecent={clearRecentSearches}
                  suggestions={suggestions}
                />
              )}
            </div>

            {/* Footer */}
            <div
              className={clsx(
                'px-4 py-2.5 border-t border-border',
                'bg-card/50',
                'flex items-center justify-between text-xs text-muted-foreground'
              )}
            >
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <kbd className="inline-flex items-center px-1.5 py-0.5 bg-muted rounded text-[10px] font-medium text-muted-foreground">
                    <Command className="w-2.5 h-2.5 mr-0.5" aria-hidden="true" />K
                  </kbd>
                  <span className="hidden sm:inline">to open</span>
                </span>

                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-medium text-muted-foreground">
                    &#8593;
                  </kbd>
                  <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-medium text-muted-foreground">
                    &#8595;
                  </kbd>
                  <span className="hidden sm:inline">to navigate</span>
                </span>

                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-medium text-muted-foreground">
                    &#9166;
                  </kbd>
                  <span className="hidden sm:inline">to select</span>
                </span>
              </div>

              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-medium text-muted-foreground">
                  Esc
                </kbd>
                <span className="hidden sm:inline">to close</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </>,
    document.body
  );
});

export default CommandPalette;
