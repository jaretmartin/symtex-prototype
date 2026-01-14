/**
 * CognateSelector Component
 *
 * Searchable dropdown for Cognate assignment.
 * Shows cognate avatar, name, and level.
 * Filter by available status.
 * Used when assigning cognates to missions/projects.
 */

import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, Brain, X } from 'lucide-react';
import clsx from 'clsx';
import type { ExtendedCognate, CognateAvailabilityStatus } from './types';
import { AVAILABILITY_STATUS_CONFIG } from './types';
import { AutonomyBadge } from './AutonomyLevelIndicator';

interface CognateSelectorProps {
  cognates: ExtendedCognate[];
  value?: string | null;
  onChange?: (cognateId: string | null) => void;
  placeholder?: string;
  className?: string;
  filterByAvailability?: boolean;
  disabled?: boolean;
  allowClear?: boolean;
}

export function CognateSelector({
  cognates,
  value,
  onChange,
  placeholder = 'Select a Cognate...',
  className,
  filterByAvailability = true,
  disabled = false,
  allowClear = true,
}: CognateSelectorProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedCognate = cognates.find((c) => c.id === value);

  // Filter cognates based on search and availability
  const filteredCognates = cognates.filter((cognate) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        cognate.name.toLowerCase().includes(query) ||
        (cognate.role && cognate.role.toLowerCase().includes(query));
      if (!matchesSearch) return false;
    }

    // Availability filter (only show available if filtering is enabled)
    if (filterByAvailability && cognate.availability === 'offline') {
      return false;
    }

    return true;
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (cognate: ExtendedCognate): void => {
    if (onChange) {
      onChange(cognate.id);
    }
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClear = (e: React.MouseEvent): void => {
    e.stopPropagation();
    if (onChange) {
      onChange(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <div ref={dropdownRef} className={clsx('relative', className)}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={(): void => {
          if (!disabled) {
            setIsOpen(!isOpen);
          }
        }}
        disabled={disabled}
        className={clsx(
          'w-full flex items-center justify-between gap-2',
          'px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg',
          'text-left transition-colors',
          disabled
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:border-zinc-600 focus:border-symtex-primary focus:outline-none'
        )}
      >
        {selectedCognate ? (
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {selectedCognate.avatar ? (
              <img
                src={selectedCognate.avatar}
                alt={selectedCognate.name}
                className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <Brain className="w-4 h-4 text-white" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-white font-medium truncate">
                  {selectedCognate.name}
                </span>
                <StatusDot status={selectedCognate.availability} />
              </div>
              <span className="text-xs text-zinc-400 truncate block">
                {selectedCognate.role || 'No role'} | Level {selectedCognate.level}
              </span>
            </div>
          </div>
        ) : (
          <span className="text-zinc-400">{placeholder}</span>
        )}

        <div className="flex items-center gap-1 flex-shrink-0">
          {selectedCognate && allowClear && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-zinc-400 hover:text-white rounded-md hover:bg-zinc-700 transition-colors"
              aria-label="Clear selection"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <ChevronDown
            className={clsx(
              'w-5 h-5 text-zinc-400 transition-transform',
              isOpen && 'rotate-180'
            )}
          />
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={clsx(
            'absolute z-50 w-full mt-2',
            'bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl',
            'max-h-80 overflow-hidden'
          )}
        >
          {/* Search Input */}
          <div className="p-2 border-b border-zinc-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e): void => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search cognates..."
                className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm placeholder-zinc-500 focus:border-symtex-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Cognate List */}
          <div className="overflow-y-auto max-h-60">
            {filteredCognates.length > 0 ? (
              filteredCognates.map((cognate) => (
                <CognateSelectorOption
                  key={cognate.id}
                  cognate={cognate}
                  isSelected={cognate.id === value}
                  onClick={(): void => handleSelect(cognate)}
                />
              ))
            ) : (
              <div className="px-4 py-8 text-center">
                <Brain className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                <p className="text-zinc-400 text-sm">
                  {searchQuery ? 'No cognates found' : 'No cognates available'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface CognateSelectorOptionProps {
  cognate: ExtendedCognate;
  isSelected: boolean;
  onClick: () => void;
}

function CognateSelectorOption({
  cognate,
  isSelected,
  onClick,
}: CognateSelectorOptionProps): JSX.Element {
  const isBusy = cognate.availability === 'busy';

  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'w-full flex items-center gap-3 px-4 py-3 text-left',
        'transition-colors',
        isSelected
          ? 'bg-symtex-primary/10'
          : 'hover:bg-zinc-800'
      )}
    >
      {/* Avatar */}
      {cognate.avatar ? (
        <img
          src={cognate.avatar}
          alt={cognate.name}
          className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          <Brain className="w-5 h-5 text-white" />
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-white font-medium truncate">{cognate.name}</span>
          <StatusDot status={cognate.availability} />
          {isBusy && (
            <span className="text-xs text-yellow-400">(Busy)</span>
          )}
        </div>
        <span className="text-xs text-zinc-400 truncate block">
          {cognate.role || 'No role assigned'}
        </span>
      </div>

      {/* Level and Autonomy */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="w-6 h-6 rounded bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
          <span className="text-xs font-bold text-white">{cognate.level}</span>
        </div>
        <AutonomyBadge level={cognate.autonomyLevel} />
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <Check className="w-5 h-5 text-symtex-primary flex-shrink-0" />
      )}
    </button>
  );
}

// Status dot component
function StatusDot({ status }: { status: CognateAvailabilityStatus }): JSX.Element {
  const config = AVAILABILITY_STATUS_CONFIG[status];
  return (
    <span
      className={clsx('w-2 h-2 rounded-full flex-shrink-0', config.dotColor)}
      title={config.label}
    />
  );
}

// Multi-select variant
interface CognateMultiSelectorProps {
  cognates: ExtendedCognate[];
  value: string[];
  onChange?: (cognateIds: string[]) => void;
  placeholder?: string;
  className?: string;
  maxSelections?: number;
}

export function CognateMultiSelector({
  cognates,
  value,
  onChange,
  placeholder = 'Select cognates...',
  className,
  maxSelections,
}: CognateMultiSelectorProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCognates = cognates.filter((c) => value.includes(c.id));

  const filteredCognates = cognates.filter((cognate) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        cognate.name.toLowerCase().includes(query) ||
        (cognate.role && cognate.role.toLowerCase().includes(query))
      );
    }
    return true;
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleCognate = (cognateId: string): void => {
    if (!onChange) return;

    if (value.includes(cognateId)) {
      onChange(value.filter((id) => id !== cognateId));
    } else {
      if (maxSelections && value.length >= maxSelections) return;
      onChange([...value, cognateId]);
    }
  };

  const removeSelection = (cognateId: string, e: React.MouseEvent): void => {
    e.stopPropagation();
    if (onChange) {
      onChange(value.filter((id) => id !== cognateId));
    }
  };

  return (
    <div ref={dropdownRef} className={clsx('relative', className)}>
      {/* Selected items and trigger */}
      <button
        type="button"
        onClick={(): void => setIsOpen(!isOpen)}
        className="w-full min-h-[48px] px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-left hover:border-zinc-600 focus:border-symtex-primary focus:outline-none"
      >
        {selectedCognates.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {selectedCognates.map((cognate) => (
              <span
                key={cognate.id}
                className="inline-flex items-center gap-1 px-2 py-1 bg-zinc-800 rounded-md text-sm"
              >
                <span className="text-white">{cognate.name}</span>
                <button
                  type="button"
                  onClick={(e): void => removeSelection(cognate.id, e)}
                  className="text-zinc-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <span className="text-zinc-400">{placeholder}</span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl max-h-80 overflow-hidden">
          <div className="p-2 border-b border-zinc-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e): void => setSearchQuery(e.target.value)}
                placeholder="Search cognates..."
                className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm placeholder-zinc-500 focus:border-symtex-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-y-auto max-h-60">
            {filteredCognates.map((cognate) => (
              <button
                key={cognate.id}
                type="button"
                onClick={(): void => toggleCognate(cognate.id)}
                disabled={maxSelections !== undefined && value.length >= maxSelections && !value.includes(cognate.id)}
                className={clsx(
                  'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors',
                  value.includes(cognate.id) ? 'bg-symtex-primary/10' : 'hover:bg-zinc-800',
                  maxSelections !== undefined && value.length >= maxSelections && !value.includes(cognate.id) && 'opacity-50 cursor-not-allowed'
                )}
              >
                <div className="w-4 h-4 border rounded flex items-center justify-center flex-shrink-0">
                  {value.includes(cognate.id) && (
                    <Check className="w-3 h-3 text-symtex-primary" />
                  )}
                </div>
                <span className="text-white flex-1 truncate">{cognate.name}</span>
                <span className="text-xs text-zinc-400">L{cognate.level}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CognateSelector;
