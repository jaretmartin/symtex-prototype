/**
 * SearchInput Component
 *
 * A search input with debounced onChange, loading state, and clear functionality.
 * Part of the Symtex Pro design system.
 */

import {
  forwardRef,
  useState,
  useEffect,
  useCallback,
  type InputHTMLAttributes,
  type KeyboardEvent,
} from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Search, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const searchInputVariants = cva(
  [
    'flex w-full rounded-lg border bg-background text-foreground',
    'transition-all duration-200',
    'placeholder:text-muted-foreground',
    'focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ],
  {
    variants: {
      size: {
        sm: 'h-8 text-xs',
        md: 'h-10 text-sm',
        lg: 'h-12 text-base',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

const iconSizeMap = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

const paddingMap = {
  sm: 'pl-8 pr-8',
  md: 'pl-10 pr-10',
  lg: 'pl-12 pr-12',
};

const iconLeftMap = {
  sm: 'left-2.5',
  md: 'left-3',
  lg: 'left-4',
};

const iconRightMap = {
  sm: 'right-2.5',
  md: 'right-3',
  lg: 'right-4',
};

export interface SearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'size'>,
    VariantProps<typeof searchInputVariants> {
  /** Current search value (controlled) */
  value?: string;
  /** Called when value changes */
  onChange?: (value: string) => void;
  /** Called on Enter key or after debounce delay */
  onSearch?: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Debounce delay in milliseconds */
  debounceMs?: number;
  /** Show loading spinner */
  loading?: boolean;
  /** Show clear button when value exists */
  clearable?: boolean;
  /** Additional class names */
  className?: string;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      value: controlledValue,
      onChange,
      onSearch,
      placeholder = 'Search...',
      debounceMs = 300,
      loading = false,
      clearable = true,
      size = 'md',
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    // Support both controlled and uncontrolled modes
    const [internalValue, setInternalValue] = useState(controlledValue ?? '');
    const isControlled = controlledValue !== undefined;
    const currentValue = isControlled ? controlledValue : internalValue;

    // Sync internal value when controlled value changes
    useEffect(() => {
      if (isControlled) {
        setInternalValue(controlledValue);
      }
    }, [controlledValue, isControlled]);

    // Debounced search effect
    useEffect(() => {
      if (!onSearch) return;

      const timer = setTimeout(() => {
        onSearch(currentValue);
      }, debounceMs);

      return () => clearTimeout(timer);
    }, [currentValue, debounceMs, onSearch]);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        if (!isControlled) {
          setInternalValue(newValue);
        }
        onChange?.(newValue);
      },
      [isControlled, onChange]
    );

    const handleClear = useCallback(() => {
      if (!isControlled) {
        setInternalValue('');
      }
      onChange?.('');
      onSearch?.('');
    }, [isControlled, onChange, onSearch]);

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && onSearch) {
          e.preventDefault();
          onSearch(currentValue);
        }
        if (e.key === 'Escape' && clearable && currentValue) {
          e.preventDefault();
          handleClear();
        }
      },
      [currentValue, onSearch, clearable, handleClear]
    );

    const sizeKey = size ?? 'md';
    const hasValue = currentValue.length > 0;
    const showClearButton = clearable && hasValue && !loading && !disabled;

    return (
      <div
        className={cn(
          searchInputVariants({ size }),
          'relative border-input',
          disabled && 'opacity-50',
          className
        )}
      >
        {/* Search Icon */}
        <span
          className={cn(
            'absolute top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none',
            iconLeftMap[sizeKey]
          )}
          aria-hidden="true"
        >
          <Search className={iconSizeMap[sizeKey]} />
        </span>

        {/* Input */}
        <input
          ref={ref}
          type="text"
          value={currentValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'w-full h-full bg-transparent outline-none',
            paddingMap[sizeKey]
          )}
          aria-label={placeholder}
          {...props}
        />

        {/* Right side: Loading spinner or Clear button */}
        <span
          className={cn(
            'absolute top-1/2 -translate-y-1/2 flex items-center',
            iconRightMap[sizeKey]
          )}
        >
          {loading ? (
            <Loader2
              className={cn(iconSizeMap[sizeKey], 'animate-spin text-muted-foreground')}
              aria-label="Searching"
            />
          ) : showClearButton ? (
            <button
              type="button"
              onClick={handleClear}
              className={cn(
                'text-muted-foreground hover:text-foreground transition-colors',
                'rounded-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
              )}
              aria-label="Clear search"
              tabIndex={-1}
            >
              <X className={iconSizeMap[sizeKey]} />
            </button>
          ) : null}
        </span>
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';
