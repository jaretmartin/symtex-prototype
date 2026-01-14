/**
 * IconPicker Component
 *
 * Reusable icon selection component for space hierarchy.
 * Features: Curated Lucide icon grid, search/filter, selected indicator, preview.
 */

import { useState, useRef, useEffect, useMemo } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import clsx from 'clsx';

// Curated list of icons suitable for domains/spaces
const CURATED_ICONS = [
  // Work & Business
  'Briefcase', 'Building2', 'Target', 'TrendingUp', 'BarChart3', 'PieChart',
  'DollarSign', 'CreditCard', 'Wallet', 'Receipt', 'FileText', 'FolderOpen',
  'ClipboardList', 'CheckSquare', 'ListTodo', 'Calendar', 'Clock', 'Timer',

  // Health & Wellness
  'Heart', 'Activity', 'Dumbbell', 'Apple', 'Salad', 'Pill', 'Stethoscope',
  'Brain', 'Smile', 'Moon', 'Sun', 'Sunrise', 'CloudSun',

  // Learning & Education
  'GraduationCap', 'BookOpen', 'Book', 'Library', 'Lightbulb', 'Pencil',
  'PenTool', 'School', 'Languages', 'Code', 'Terminal', 'Cpu',

  // Personal & Life
  'Home', 'Users', 'User', 'Baby', 'Dog', 'Cat', 'Flower2', 'TreePine',
  'Mountain', 'Palmtree', 'Plane', 'Car', 'Bike', 'MapPin',

  // Creative & Media
  'Camera', 'Video', 'Music', 'Mic', 'Palette', 'Brush', 'Image', 'Film',
  'Gamepad2', 'Headphones', 'Radio', 'Tv',

  // Communication
  'Mail', 'MessageSquare', 'Phone', 'Send', 'Share2', 'Globe', 'Link',
  'Rss', 'Bell', 'Megaphone',

  // Technology
  'Laptop', 'Monitor', 'Smartphone', 'Tablet', 'Watch', 'Wifi', 'Cloud',
  'Database', 'Server', 'HardDrive', 'Zap', 'Shield', 'Lock', 'Key',

  // Nature & Environment
  'Leaf', 'Sprout', 'Trees', 'Waves', 'Droplet', 'Wind', 'Snowflake',
  'Flame', 'Sparkles', 'Star', 'Gem',

  // Tools & Actions
  'Settings', 'Wrench', 'Hammer', 'Scissors', 'Tool', 'Package', 'Archive',
  'Trash2', 'Download', 'Upload', 'RefreshCw', 'RotateCw',
] as const;

// type IconName is used implicitly via the CURATED_ICONS array

interface IconPickerProps {
  value?: string;
  onChange?: (icon: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function IconPicker({
  value,
  onChange,
  placeholder = 'Select an icon...',
  className,
  disabled = false,
}: IconPickerProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter icons based on search
  const filteredIcons = useMemo(() => {
    if (!searchQuery) return CURATED_ICONS;
    const query = searchQuery.toLowerCase();
    return CURATED_ICONS.filter((icon) =>
      icon.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Get the Icon component for a given name
  const getIconComponent = (name: string): React.ComponentType<{ className?: string }> | null => {
    const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name];
    return IconComponent || null;
  };

  const SelectedIcon = value ? getIconComponent(value) : null;

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

  const handleSelect = (iconName: string): void => {
    if (onChange) {
      onChange(iconName);
    }
    setIsOpen(false);
    setSearchQuery('');
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
        {SelectedIcon ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
              <SelectedIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-white">{value}</span>
          </div>
        ) : (
          <span className="text-zinc-400">{placeholder}</span>
        )}
        <ChevronDown
          className={clsx(
            'w-5 h-5 text-zinc-400 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={clsx(
            'absolute z-50 w-full mt-2',
            'bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl',
            'max-h-96 overflow-hidden'
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
                placeholder="Search icons..."
                className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm placeholder-zinc-500 focus:border-symtex-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Icon Grid */}
          <div className="overflow-y-auto max-h-72 p-3">
            {filteredIcons.length > 0 ? (
              <div className="grid grid-cols-6 gap-2">
                {filteredIcons.map((iconName) => {
                  const IconComponent = getIconComponent(iconName);
                  if (!IconComponent) return null;

                  const isSelected = value === iconName;

                  return (
                    <button
                      key={iconName}
                      type="button"
                      onClick={(): void => handleSelect(iconName)}
                      title={iconName}
                      aria-label={`Select ${iconName} icon`}
                      aria-pressed={isSelected}
                      className={clsx(
                        'relative p-3 rounded-lg transition-colors',
                        'flex items-center justify-center',
                        isSelected
                          ? 'bg-symtex-primary/20 border border-symtex-primary'
                          : 'bg-zinc-800 hover:bg-zinc-700 border border-transparent'
                      )}
                    >
                      <IconComponent
                        className={clsx(
                          'w-5 h-5',
                          isSelected ? 'text-symtex-primary' : 'text-zinc-300'
                        )}
                      />
                      {isSelected && (
                        <Check className="absolute top-1 right-1 w-3 h-3 text-symtex-primary" />
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center">
                <Search className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                <p className="text-zinc-400 text-sm">No icons found</p>
              </div>
            )}
          </div>

          {/* Preview */}
          {value && (
            <div className="p-3 border-t border-zinc-800 flex items-center justify-between">
              <span className="text-sm text-zinc-400">Selected:</span>
              <div className="flex items-center gap-2">
                {SelectedIcon && <SelectedIcon className="w-5 h-5 text-white" />}
                <span className="text-sm text-white">{value}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default IconPicker;
