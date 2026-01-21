/**
 * ColorPicker Component
 *
 * Reusable color selection component for space hierarchy.
 * Features: Preset color palette (12 colors), custom color option, selected indicator.
 */

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Palette } from 'lucide-react';
import clsx from 'clsx';

// Preset color palette - curated for dark UI
const PRESET_COLORS = [
  { name: 'Blue', value: '#3B82F6', class: 'bg-blue-500' },
  { name: 'Indigo', value: '#6366F1', class: 'bg-indigo-500' },
  { name: 'Purple', value: '#8B5CF6', class: 'bg-purple-500' },
  { name: 'Pink', value: '#EC4899', class: 'bg-pink-500' },
  { name: 'Rose', value: '#F43F5E', class: 'bg-rose-500' },
  { name: 'Red', value: '#EF4444', class: 'bg-red-500' },
  { name: 'Orange', value: '#F97316', class: 'bg-orange-500' },
  { name: 'Amber', value: '#F59E0B', class: 'bg-amber-500' },
  { name: 'Yellow', value: '#EAB308', class: 'bg-yellow-500' },
  { name: 'Lime', value: '#84CC16', class: 'bg-lime-500' },
  { name: 'Green', value: '#22C55E', class: 'bg-green-500' },
  { name: 'Teal', value: '#14B8A6', class: 'bg-teal-500' },
  { name: 'Cyan', value: '#06B6D4', class: 'bg-cyan-500' },
  { name: 'Sky', value: '#0EA5E9', class: 'bg-sky-500' },
] as const;

interface ColorPickerProps {
  value?: string;
  onChange?: (color: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  showCustom?: boolean;
}

export function ColorPicker({
  value,
  onChange,
  placeholder = 'Select a color...',
  className,
  disabled = false,
  showCustom = true,
}: ColorPickerProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [customColor, setCustomColor] = useState(value || '#6366F1');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Find the matching preset color
  const selectedPreset = PRESET_COLORS.find((c) => c.value.toLowerCase() === value?.toLowerCase());

  // Close dropdown when clicking outside
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

  const handleSelectPreset = (color: string): void => {
    if (onChange) {
      onChange(color);
    }
    setCustomColor(color);
    setIsOpen(false);
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const color = e.target.value;
    setCustomColor(color);
    if (onChange) {
      onChange(color);
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
          'px-4 py-3 bg-surface-base border border-border rounded-lg',
          'text-left transition-colors',
          disabled
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:border-border focus:border-symtex-primary focus:outline-none'
        )}
      >
        {value ? (
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg border border-border"
              style={{ backgroundColor: value }}
            />
            <span className="text-foreground">
              {selectedPreset?.name || value.toUpperCase()}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Palette className="w-5 h-5 text-muted-foreground" />
            <span className="text-muted-foreground">{placeholder}</span>
          </div>
        )}
        <ChevronDown
          className={clsx(
            'w-5 h-5 text-muted-foreground transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={clsx(
            'absolute z-50 w-full mt-2',
            'bg-surface-base border border-border rounded-lg shadow-xl',
            'overflow-hidden'
          )}
        >
          {/* Preset Colors */}
          <div className="p-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
              Preset Colors
            </p>
            <div className="grid grid-cols-7 gap-2">
              {PRESET_COLORS.map((color) => {
                const isSelected = value?.toLowerCase() === color.value.toLowerCase();

                return (
                  <button
                    key={color.value}
                    type="button"
                    onClick={(): void => handleSelectPreset(color.value)}
                    title={color.name}
                    aria-label={`Select ${color.name} color`}
                    aria-pressed={isSelected}
                    className={clsx(
                      'relative w-8 h-8 rounded-lg transition-all',
                      'border-2',
                      isSelected
                        ? 'border-white scale-110'
                        : 'border-transparent hover:scale-105'
                    )}
                    style={{ backgroundColor: color.value }}
                  >
                    {isSelected && (
                      <Check className="absolute inset-0 m-auto w-4 h-4 text-foreground drop-shadow-md" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Color */}
          {showCustom && (
            <div className="p-3 border-t border-border">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
                Custom Color
              </p>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    type="color"
                    value={customColor}
                    onChange={handleCustomColorChange}
                    className="absolute inset-0 w-10 h-10 opacity-0 cursor-pointer"
                    title="Pick custom color"
                    aria-label="Pick custom color"
                  />
                  <div
                    className="w-10 h-10 rounded-lg border border-border cursor-pointer"
                    style={{ backgroundColor: customColor }}
                  />
                </div>
                <input
                  type="text"
                  value={customColor.toUpperCase()}
                  onChange={(e): void => {
                    const val = e.target.value;
                    if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                      setCustomColor(val);
                      if (val.length === 7 && onChange) {
                        onChange(val);
                      }
                    }
                  }}
                  placeholder="#6366F1"
                  aria-label="Custom color hex value"
                  className="flex-1 px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm font-mono placeholder-muted-foreground focus:border-symtex-primary focus:outline-none"
                />
                <button
                  type="button"
                  onClick={(): void => handleSelectPreset(customColor)}
                  className="px-3 py-2 bg-card hover:bg-muted border border-border rounded-lg text-sm text-foreground transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          )}

          {/* Selected Preview */}
          {value && (
            <div className="p-3 border-t border-border flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Selected:</span>
              <div className="flex items-center gap-2">
                <div
                  className="w-5 h-5 rounded border border-border"
                  style={{ backgroundColor: value }}
                />
                <span className="text-sm text-foreground font-mono">
                  {value.toUpperCase()}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ColorPicker;
