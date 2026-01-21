/**
 * Library Components - Shared UI components for the Library section
 *
 * This file exports reusable components used across Templates and Knowledge pages.
 */

import React from 'react';

// ============================================================================
// BADGE COMPONENT
// ============================================================================

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'purple' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  icon,
  className = '',
}) => {
  const variantClasses = {
    default: 'bg-gray-800 text-gray-300',
    primary: 'bg-blue-500/20 text-blue-400',
    success: 'bg-emerald-500/20 text-emerald-400',
    warning: 'bg-amber-500/20 text-amber-400',
    danger: 'bg-red-500/20 text-red-400',
    purple: 'bg-symtex-purple/20 text-symtex-purple',
    gold: 'bg-symtex-gold/20 text-symtex-gold',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {icon}
      {children}
    </span>
  );
};

// ============================================================================
// CARD COMPONENT
// ============================================================================

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  onClick,
}) => {
  const variantClasses = {
    default: 'bg-gray-900/50 backdrop-blur-sm border border-gray-800',
    elevated: 'bg-gray-900/70 backdrop-blur-sm border border-gray-800 shadow-xl',
    outlined: 'bg-transparent border border-gray-800',
    interactive:
      'bg-gray-900/50 backdrop-blur-sm border border-gray-800 hover:border-symtex-purple/50 hover:shadow-xl hover:shadow-symtex-purple/10 transition-all duration-300 cursor-pointer',
  };

  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-6',
  };

  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      className={`rounded-xl ${variantClasses[variant]} ${paddingClasses[padding]} ${className}`}
      onClick={onClick}
    >
      {children}
    </Component>
  );
};

// ============================================================================
// SEARCH INPUT COMPONENT
// ============================================================================

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
}) => {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
        <SearchIcon />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-symtex-purple focus:ring-1 focus:ring-symtex-purple transition-all"
      />
    </div>
  );
};

// ============================================================================
// TOGGLE BUTTON GROUP
// ============================================================================

interface ToggleOption<T extends string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

interface ToggleButtonGroupProps<T extends string> {
  options: ToggleOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function ToggleButtonGroup<T extends string>({
  options,
  value,
  onChange,
  className = '',
}: ToggleButtonGroupProps<T>) {
  return (
    <div className={`flex items-center gap-1 bg-gray-800/50 rounded-lg p-1 ${className}`}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
            value === option.value
              ? 'bg-symtex-purple text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          {option.icon}
          <span className="text-sm font-medium">{option.label}</span>
        </button>
      ))}
    </div>
  );
}

// ============================================================================
// FILTER CHIP COMPONENT
// ============================================================================

interface FilterChipProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  color?: string;
  className?: string;
}

export const FilterChip: React.FC<FilterChipProps> = ({
  label,
  isActive,
  onClick,
  icon,
  color,
  className = '',
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
        isActive
          ? color
            ? `bg-gradient-to-r ${color} text-white shadow-lg`
            : 'bg-symtex-purple text-white shadow-lg shadow-symtex-purple/25'
          : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white'
      } ${className}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

// ============================================================================
// STAT DISPLAY COMPONENT
// ============================================================================

interface StatDisplayProps {
  icon?: React.ReactNode;
  value: string | number;
  label?: string;
  className?: string;
}

export const StatDisplay: React.FC<StatDisplayProps> = ({
  icon,
  value,
  label,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-1.5 text-sm text-gray-500 ${className}`}>
      {icon}
      <span>
        {value}
        {label && ` ${label}`}
      </span>
    </div>
  );
};

// ============================================================================
// GRADIENT BUTTON COMPONENT
// ============================================================================

interface GradientButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  className?: string;
  disabled?: boolean;
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  fullWidth = false,
  className = '',
  disabled = false,
}) => {
  const variantClasses = {
    primary:
      'bg-gradient-to-r from-symtex-purple to-purple-600 hover:from-purple-600 hover:to-symtex-purple text-white shadow-lg shadow-symtex-purple/25',
    secondary:
      'bg-gradient-to-r from-symtex-gold to-amber-500 hover:from-amber-500 hover:to-symtex-gold text-gray-900 shadow-lg shadow-symtex-gold/25',
    outline:
      'bg-transparent border-2 border-symtex-purple text-symtex-purple hover:bg-symtex-purple/10',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
        variantClasses[variant]
      } ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {icon && iconPosition === 'left' && icon}
      {children}
      {icon && iconPosition === 'right' && icon}
    </button>
  );
};

// ============================================================================
// EMPTY STATE COMPONENT
// ============================================================================

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div className={`text-center py-16 ${className}`}>
      {icon && (
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center text-gray-500">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-foreground mb-2">{title}</h3>
      {description && <p className="text-gray-500 mb-4">{description}</p>}
      {action}
    </div>
  );
};

// ============================================================================
// SECTION HEADER COMPONENT
// ============================================================================

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  icon,
  action,
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-between mb-6 ${className}`}>
      <div className="flex items-center gap-3">
        {icon && (
          <div className="p-2 bg-symtex-purple/20 rounded-lg text-symtex-purple">{icon}</div>
        )}
        <div>
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
};
