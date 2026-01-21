/**
 * SpaceSwitcher Component
 *
 * Dropdown component for switching between Spaces in the header.
 * Shows current Space with icon, recent Spaces, favorites, and create option.
 */

import { useState, useRef, useEffect, memo, useCallback, useMemo } from 'react';
import {
  ChevronDown,
  Plus,
  Star,
  Clock,
  Briefcase,
  Home,
  Code,
  Palette,
  BookOpen,
  Rocket,
  Search,
  Command,
  Check,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSpaceStore } from '@/store/useSpaceStore';

// Space icon mapping
const SPACE_ICONS: Record<string, React.ElementType> = {
  home: Home,
  work: Briefcase,
  code: Code,
  design: Palette,
  learning: BookOpen,
  projects: Rocket,
  default: Briefcase,
};

interface Space {
  id: string;
  name: string;
  icon: string;
  color: string;
  description?: string;
  isFavorite?: boolean;
  lastAccessed?: string;
}

interface SpaceSwitcherProps {
  className?: string;
  onSpaceChange?: (spaceId: string) => void;
  onCreateSpace?: () => void;
}

// Mock data for Spaces
const mockSpaces: Space[] = [
  {
    id: 'personal',
    name: 'Personal',
    icon: 'home',
    color: '#6366f1',
    description: 'Personal tasks and projects',
    isFavorite: true,
    lastAccessed: '2 minutes ago',
  },
  {
    id: 'work',
    name: 'Work',
    icon: 'work',
    color: '#8b5cf6',
    description: 'Work-related projects',
    isFavorite: true,
    lastAccessed: '1 hour ago',
  },
  {
    id: 'engineering',
    name: 'Engineering',
    icon: 'code',
    color: '#22c55e',
    description: 'Engineering and development',
    isFavorite: false,
    lastAccessed: '3 hours ago',
  },
  {
    id: 'design',
    name: 'Design',
    icon: 'design',
    color: '#ec4899',
    description: 'Design and creative work',
    isFavorite: false,
    lastAccessed: '1 day ago',
  },
  {
    id: 'learning',
    name: 'Learning',
    icon: 'learning',
    color: '#f59e0b',
    description: 'Courses and learning materials',
    isFavorite: false,
    lastAccessed: '2 days ago',
  },
];

function SpaceSwitcher({
  className,
  onSpaceChange,
  onCreateSpace,
}: SpaceSwitcherProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSpaceId, setCurrentSpaceId] = useState('personal');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Get spaces from store - transform domains to Space format
  const personal = useSpaceStore((state) => state.personal);
  const domainsRecord = useSpaceStore((state) => state.domains);

  // Transform store data to Space format, with fallback to mock data
  const spaces = useMemo((): Space[] => {
    const storeDomains = Object.values(domainsRecord);

    // If we have store data, use it
    if (storeDomains.length > 0 || personal) {
      const storeSpaces: Space[] = [];

      // Add personal space first
      if (personal) {
        storeSpaces.push({
          id: 'personal',
          name: personal.name,
          icon: 'home',
          color: '#6366f1',
          description: 'Personal tasks and projects',
          isFavorite: true,
          lastAccessed: 'now',
        });
      }

      // Add domains as spaces
      storeDomains.forEach((domain) => {
        storeSpaces.push({
          id: domain.id,
          name: domain.name,
          icon: domain.icon?.toLowerCase() || 'default',
          color: domain.color || '#8b5cf6',
          description: `Domain: ${domain.name}`,
          isFavorite: false,
        });
      });

      return storeSpaces;
    }

    // Fallback to mock data if no store data
    return mockSpaces;
  }, [personal, domainsRecord]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens and reset focused index
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
      setFocusedIndex(-1);
    }
  }, [isOpen]);

  // Get all selectable spaces for keyboard navigation
  const allSelectableSpaces = useMemo(() => {
    const filtered = spaces.filter((space) =>
      space.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return filtered;
  }, [spaces, searchQuery]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          setSearchQuery('');
          triggerRef.current?.focus();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex((prev) =>
            Math.min(prev + 1, allSelectableSpaces.length - 1)
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex((prev) => Math.max(prev - 1, -1));
          break;
        case 'Enter':
          e.preventDefault();
          if (focusedIndex >= 0 && focusedIndex < allSelectableSpaces.length) {
            handleSpaceSelect(allSelectableSpaces[focusedIndex].id);
          }
          break;
      }
    },
    [isOpen, focusedIndex, allSelectableSpaces]
  );

  // Keyboard shortcut hint: Cmd/Ctrl + K followed by 'space' handled by command palette

  const currentSpace = spaces.find((s) => s.id === currentSpaceId) || spaces[0];
  const CurrentIcon = SPACE_ICONS[currentSpace?.icon || 'default'] || SPACE_ICONS.default;

  // Filter and sort spaces
  const filteredSpaces = spaces.filter((space) =>
    space.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const favoriteSpaces = filteredSpaces.filter((s) => s.isFavorite);
  const recentSpaces = filteredSpaces
    .filter((s) => !s.isFavorite && s.id !== currentSpaceId)
    .slice(0, 3);

  const handleSpaceSelect = useCallback(
    (spaceId: string) => {
      setCurrentSpaceId(spaceId);
      onSpaceChange?.(spaceId);
      setIsOpen(false);
      setSearchQuery('');
    },
    [onSpaceChange]
  );

  const handleCreateSpace = useCallback(() => {
    onCreateSpace?.();
    setIsOpen(false);
    setSearchQuery('');
  }, [onCreateSpace]);

  return (
    <div ref={dropdownRef} className={cn('relative', className)} onKeyDown={handleKeyDown}>
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Current space: ${currentSpace?.name || 'None'}. Click to switch spaces`}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg',
          'bg-card/50 border border-border',
          'hover:bg-muted/50 transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-symtex-primary focus:ring-offset-2 focus:ring-offset-symtex-dark',
          isOpen && 'bg-muted/50'
        )}
      >
        <div
          className="p-1.5 rounded-md"
          style={{ backgroundColor: `${currentSpace?.color || '#6366f1'}20` }}
        >
          <CurrentIcon
            className="w-4 h-4"
            style={{ color: currentSpace?.color || '#6366f1' }}
          />
        </div>
        <span className="text-sm font-medium text-foreground max-w-[120px] truncate">
          {currentSpace?.name || 'Select Space'}
        </span>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-muted-foreground transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          aria-label="Select a space"
          aria-activedescendant={
            focusedIndex >= 0 ? `space-option-${allSelectableSpaces[focusedIndex]?.id}` : undefined
          }
          className={cn(
            'absolute left-0 top-full mt-2 w-72',
            'bg-card border border-border rounded-xl shadow-2xl',
            'z-50 overflow-hidden',
            'animate-in slide-in-from-top-2 duration-200'
          )}
        >
          {/* Search */}
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search Spaces..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  'w-full pl-9 pr-3 py-2 rounded-lg',
                  'bg-card/50 border border-border',
                  'text-sm text-foreground placeholder-muted-foreground',
                  'focus:outline-none focus:border-symtex-primary'
                )}
              />
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
              <Command className="w-3 h-3" />
              <span>K then type "space" to switch</span>
            </div>
          </div>

          {/* Current Space */}
          {currentSpace && (
            <div className="p-2 border-b border-border">
              <p className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Current
              </p>
              <SpaceItem
                space={currentSpace}
                isSelected={true}
                isFocused={allSelectableSpaces[focusedIndex]?.id === currentSpace.id}
                onClick={() => setIsOpen(false)}
              />
            </div>
          )}

          {/* Favorites */}
          {favoriteSpaces.length > 0 && (
            <div className="p-2 border-b border-border">
              <p className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Star className="w-3 h-3" />
                Favorites
              </p>
              {favoriteSpaces
                .filter((s) => s.id !== currentSpaceId)
                .map((space) => (
                  <SpaceItem
                    key={space.id}
                    space={space}
                    isFocused={allSelectableSpaces[focusedIndex]?.id === space.id}
                    onClick={() => handleSpaceSelect(space.id)}
                  />
                ))}
            </div>
          )}

          {/* Recent */}
          {recentSpaces.length > 0 && (
            <div className="p-2 border-b border-border">
              <p className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Recent
              </p>
              {recentSpaces.map((space) => (
                <SpaceItem
                  key={space.id}
                  space={space}
                  isFocused={allSelectableSpaces[focusedIndex]?.id === space.id}
                  onClick={() => handleSpaceSelect(space.id)}
                />
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="p-2">
            <button
              onClick={handleCreateSpace}
              className={cn(
                'w-full flex items-center gap-2 px-2 py-2 rounded-lg',
                'text-sm text-muted-foreground hover:bg-card/50 transition-colors'
              )}
            >
              <Plus className="w-4 h-4 text-symtex-primary" />
              Create new Space
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                // Navigate to space settings
              }}
              className={cn(
                'w-full flex items-center gap-2 px-2 py-2 rounded-lg',
                'text-sm text-muted-foreground hover:bg-card/50 transition-colors'
              )}
            >
              <Settings className="w-4 h-4 text-muted-foreground" />
              Manage Spaces
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Space Item Component
interface SpaceItemProps {
  space: Space;
  isSelected?: boolean;
  isFocused?: boolean;
  onClick: () => void;
}

function SpaceItem({ space, isSelected, isFocused, onClick }: SpaceItemProps): JSX.Element {
  const Icon = SPACE_ICONS[space.icon] || SPACE_ICONS.default;

  return (
    <button
      id={`space-option-${space.id}`}
      role="option"
      aria-selected={isSelected}
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-2 py-2 rounded-lg',
        'hover:bg-card/50 transition-colors',
        isSelected && 'bg-symtex-primary/10',
        isFocused && 'bg-muted/70 ring-1 ring-symtex-primary'
      )}
    >
      <div
        className="p-2 rounded-lg flex-shrink-0"
        style={{ backgroundColor: `${space.color}20` }}
      >
        <Icon
          className="w-4 h-4"
          style={{ color: space.color }}
        />
      </div>
      <div className="flex-1 text-left min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{space.name}</p>
        {space.description && (
          <p className="text-xs text-muted-foreground truncate">{space.description}</p>
        )}
      </div>
      {space.isFavorite && (
        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 flex-shrink-0" />
      )}
      {isSelected && (
        <Check className="w-4 h-4 text-symtex-primary flex-shrink-0" />
      )}
    </button>
  );
}

export default memo(SpaceSwitcher);
