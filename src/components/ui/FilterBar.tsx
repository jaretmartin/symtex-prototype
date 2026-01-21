/**
 * FilterBar Component
 *
 * A flexible filter bar supporting single and multi-select filter groups.
 * Part of the Symtex Pro design system.
 */

import { useCallback, useState } from 'react';
import { cva } from 'class-variance-authority';
import { X, ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

export interface FilterOption {
  /** Unique identifier for the option */
  id: string;
  /** Display label */
  label: string;
  /** Value to be used when selected */
  value: string;
  /** Optional count badge */
  count?: number;
  /** Whether the option is disabled */
  disabled?: boolean;
}

export interface FilterGroup {
  /** Unique identifier for the group */
  id: string;
  /** Display label for the group */
  label: string;
  /** Selection type: 'single' for radio, 'multi' for checkbox */
  type: 'single' | 'multi';
  /** Available options */
  options: FilterOption[];
}

export interface FilterBarProps {
  /** Filter groups to display */
  filters: FilterGroup[];
  /** Current filter values: groupId -> value (single) or values (multi) */
  values: Record<string, string | string[]>;
  /** Called when filter values change */
  onChange: (groupId: string, value: string | string[]) => void;
  /** Called when all filters are cleared */
  onClear?: () => void;
  /** Layout direction */
  layout?: 'horizontal' | 'vertical';
  /** Whether groups can be collapsed (only applies to vertical layout) */
  collapsible?: boolean;
  /** Show count badges on options */
  showCounts?: boolean;
  /** Show active filter count badge */
  showActiveCount?: boolean;
  /** Additional class names */
  className?: string;
}

// ============================================================================
// Variants
// ============================================================================

const filterBarVariants = cva('', {
  variants: {
    layout: {
      horizontal: 'flex flex-wrap items-center gap-3',
      vertical: 'flex flex-col gap-4',
    },
  },
  defaultVariants: {
    layout: 'horizontal',
  },
});

const filterGroupVariants = cva('', {
  variants: {
    layout: {
      horizontal: 'flex items-center gap-2',
      vertical: 'flex flex-col gap-2',
    },
  },
});

const filterChipVariants = cva(
  [
    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full',
    'text-sm font-medium transition-all duration-200 cursor-pointer',
    'border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  ],
  {
    variants: {
      active: {
        true: [
          'bg-symtex-primary/10 border-symtex-primary text-symtex-primary',
          'hover:bg-symtex-primary/20',
        ],
        false: [
          'bg-card border-border text-muted-foreground',
          'hover:bg-muted hover:text-foreground hover:border-muted-foreground/30',
        ],
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed pointer-events-none',
        false: '',
      },
    },
    defaultVariants: {
      active: false,
      disabled: false,
    },
  }
);

const filterListItemVariants = cva(
  [
    'flex items-center justify-between px-3 py-2 rounded-lg',
    'text-sm transition-all duration-200 cursor-pointer',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
  ],
  {
    variants: {
      active: {
        true: 'bg-symtex-primary/10 text-symtex-primary',
        false: 'text-muted-foreground hover:bg-muted hover:text-foreground',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed pointer-events-none',
        false: '',
      },
    },
    defaultVariants: {
      active: false,
      disabled: false,
    },
  }
);

// ============================================================================
// Sub-components
// ============================================================================

interface FilterChipProps {
  option: FilterOption;
  active: boolean;
  showCount: boolean;
  onClick: () => void;
}

function FilterChip({ option, active, showCount, onClick }: FilterChipProps): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={option.disabled}
      className={filterChipVariants({ active, disabled: option.disabled })}
      aria-pressed={active}
      role="option"
      aria-selected={active}
    >
      <span>{option.label}</span>
      {showCount && option.count !== undefined && (
        <span
          className={cn(
            'text-xs px-1.5 py-0.5 rounded-full',
            active
              ? 'bg-symtex-primary/20 text-symtex-primary'
              : 'bg-muted text-muted-foreground'
          )}
        >
          {option.count}
        </span>
      )}
    </button>
  );
}

interface FilterListItemProps {
  option: FilterOption;
  active: boolean;
  type: 'single' | 'multi';
  showCount: boolean;
  onClick: () => void;
}

function FilterListItem({
  option,
  active,
  type,
  showCount,
  onClick,
}: FilterListItemProps): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={option.disabled}
      className={filterListItemVariants({ active, disabled: option.disabled })}
      role={type === 'single' ? 'radio' : 'checkbox'}
      aria-checked={active}
    >
      <div className="flex items-center gap-2">
        {/* Selection indicator */}
        <span
          className={cn(
            'flex items-center justify-center w-4 h-4 border rounded transition-colors',
            type === 'single' ? 'rounded-full' : 'rounded',
            active
              ? 'bg-symtex-primary border-symtex-primary'
              : 'border-border bg-transparent'
          )}
        >
          {active && (
            <span
              className={cn(
                'bg-white',
                type === 'single' ? 'w-1.5 h-1.5 rounded-full' : 'w-2 h-2 rounded-sm'
              )}
            />
          )}
        </span>
        <span>{option.label}</span>
      </div>
      {showCount && option.count !== undefined && (
        <span className="text-xs text-muted-foreground">{option.count}</span>
      )}
    </button>
  );
}

interface CollapsibleGroupProps {
  group: FilterGroup;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function CollapsibleGroup({
  group,
  children,
  defaultOpen = true,
}: CollapsibleGroupProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 bg-muted/30 hover:bg-muted transition-colors"
        aria-expanded={isOpen}
      >
        <span className="text-sm font-medium text-foreground">{group.label}</span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      {isOpen && <div className="p-2">{children}</div>}
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function FilterBar({
  filters,
  values,
  onChange,
  onClear,
  layout = 'horizontal',
  collapsible = false,
  showCounts = true,
  showActiveCount = true,
  className,
}: FilterBarProps): JSX.Element {
  // Calculate active filter count
  const activeFilterCount = Object.values(values).reduce((count, value) => {
    if (Array.isArray(value)) {
      return count + value.length;
    }
    return value ? count + 1 : count;
  }, 0);

  const handleOptionClick = useCallback(
    (group: FilterGroup, option: FilterOption) => {
      if (group.type === 'single') {
        // Single select: replace value
        onChange(group.id, option.value);
      } else {
        // Multi select: toggle value in array
        const currentValues = (values[group.id] as string[]) || [];
        const isSelected = currentValues.includes(option.value);

        if (isSelected) {
          onChange(
            group.id,
            currentValues.filter((v) => v !== option.value)
          );
        } else {
          onChange(group.id, [...currentValues, option.value]);
        }
      }
    },
    [values, onChange]
  );

  const isOptionActive = useCallback(
    (group: FilterGroup, option: FilterOption): boolean => {
      const groupValue = values[group.id];
      if (group.type === 'single') {
        return groupValue === option.value;
      }
      return Array.isArray(groupValue) && groupValue.includes(option.value);
    },
    [values]
  );

  const renderHorizontalGroup = (group: FilterGroup): JSX.Element => (
    <div
      key={group.id}
      className={filterGroupVariants({ layout: 'horizontal' })}
      role={group.type === 'single' ? 'radiogroup' : 'group'}
      aria-label={group.label}
    >
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {group.label}:
      </span>
      {group.options.map((option) => (
        <FilterChip
          key={option.id}
          option={option}
          active={isOptionActive(group, option)}
          showCount={showCounts}
          onClick={() => handleOptionClick(group, option)}
        />
      ))}
    </div>
  );

  const renderVerticalGroup = (group: FilterGroup): JSX.Element => {
    const content = (
      <div
        className="flex flex-col gap-1"
        role={group.type === 'single' ? 'radiogroup' : 'group'}
        aria-label={group.label}
      >
        {group.options.map((option) => (
          <FilterListItem
            key={option.id}
            option={option}
            active={isOptionActive(group, option)}
            type={group.type}
            showCount={showCounts}
            onClick={() => handleOptionClick(group, option)}
          />
        ))}
      </div>
    );

    if (collapsible) {
      return (
        <CollapsibleGroup key={group.id} group={group}>
          {content}
        </CollapsibleGroup>
      );
    }

    return (
      <div key={group.id} className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-3">
          {group.label}
        </span>
        {content}
      </div>
    );
  };

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {/* Header with filter icon and clear button */}
      {(showActiveCount || onClear) && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Filters</span>
            {showActiveCount && activeFilterCount > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-symtex-primary/10 text-symtex-primary">
                {activeFilterCount} active
              </span>
            )}
          </div>
          {onClear && activeFilterCount > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-3 w-3" />
              Clear all
            </button>
          )}
        </div>
      )}

      {/* Filter groups */}
      <div className={filterBarVariants({ layout })}>
        {filters.map((group) =>
          layout === 'horizontal'
            ? renderHorizontalGroup(group)
            : renderVerticalGroup(group)
        )}
      </div>
    </div>
  );
}

FilterBar.displayName = 'FilterBar';
