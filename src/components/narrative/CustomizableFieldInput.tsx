/**
 * Customizable Field Input Component
 *
 * Renders dynamic input fields based on field type for narrative chapter customization.
 * Supports text, select, number, and boolean field types.
 */

import { useCallback } from 'react';
import { AlertCircle } from 'lucide-react';
import clsx from 'clsx';
import type { CustomizableField } from '@/types';

interface CustomizableFieldInputProps {
  field: CustomizableField;
  onChange: (fieldId: string, value: string | number | boolean) => void;
  error?: string;
  className?: string;
}

interface FieldWrapperProps {
  label: string;
  required: boolean;
  error?: string;
  children: React.ReactNode;
}

function FieldWrapper({ label, required, error, children }: FieldWrapperProps): JSX.Element {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
        {label}
        {required && <span className="text-error text-xs">*</span>}
      </label>
      {children}
      {error && (
        <div className="flex items-center gap-1.5 text-xs text-error">
          <AlertCircle className="w-3 h-3" />
          {error}
        </div>
      )}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  hasError,
}: {
  value: string;
  onChange: (value: string) => void;
  hasError: boolean;
}): JSX.Element {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={clsx(
        'w-full px-3 py-2 rounded-lg bg-symtex-dark border text-foreground',
        'placeholder-muted-foreground text-sm',
        'transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-symtex-primary focus:border-transparent',
        hasError ? 'border-error' : 'border-border hover:border-border'
      )}
    />
  );
}

function SelectInput({
  value,
  options,
  onChange,
  hasError,
}: {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  hasError: boolean;
}): JSX.Element {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={clsx(
        'w-full px-3 py-2 rounded-lg bg-symtex-dark border text-foreground',
        'text-sm cursor-pointer',
        'transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-symtex-primary focus:border-transparent',
        hasError ? 'border-error' : 'border-border hover:border-border'
      )}
    >
      <option value="" className="bg-symtex-dark">
        Select an option...
      </option>
      {options.map((option) => (
        <option key={option} value={option} className="bg-symtex-dark">
          {option}
        </option>
      ))}
    </select>
  );
}

function NumberInput({
  value,
  onChange,
  hasError,
}: {
  value: number;
  onChange: (value: number) => void;
  hasError: boolean;
}): JSX.Element {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      className={clsx(
        'w-full px-3 py-2 rounded-lg bg-symtex-dark border text-foreground',
        'placeholder-muted-foreground text-sm',
        'transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-symtex-primary focus:border-transparent',
        hasError ? 'border-error' : 'border-border hover:border-border'
      )}
    />
  );
}

function BooleanInput({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (value: boolean) => void;
}): JSX.Element {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div
        role="checkbox"
        aria-checked={value}
        tabIndex={0}
        onClick={() => onChange(!value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onChange(!value);
          }
        }}
        className={clsx(
          'w-10 h-6 rounded-full relative transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-symtex-primary focus:ring-offset-2 focus:ring-offset-symtex-dark',
          value ? 'bg-symtex-primary' : 'bg-muted group-hover:bg-muted'
        )}
      >
        <span
          className={clsx(
            'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200',
            value ? 'translate-x-5' : 'translate-x-1'
          )}
        />
      </div>
      <span className="text-sm text-muted-foreground">{value ? 'Enabled' : 'Disabled'}</span>
    </label>
  );
}

export function CustomizableFieldInput({
  field,
  onChange,
  error,
  className,
}: CustomizableFieldInputProps): JSX.Element {
  const handleChange = useCallback(
    (value: string | number | boolean): void => {
      onChange(field.id, value);
    },
    [field.id, onChange]
  );

  const renderInput = (): JSX.Element => {
    switch (field.type) {
      case 'text':
        return (
          <TextInput
            value={field.value as string}
            onChange={handleChange}
            hasError={!!error}
          />
        );
      case 'select':
        return (
          <SelectInput
            value={field.value as string}
            options={field.options ?? []}
            onChange={handleChange}
            hasError={!!error}
          />
        );
      case 'number':
        return (
          <NumberInput
            value={field.value as number}
            onChange={handleChange}
            hasError={!!error}
          />
        );
      case 'boolean':
        return (
          <BooleanInput
            value={field.value as boolean}
            onChange={handleChange}
          />
        );
      default:
        return (
          <div className="text-sm text-muted-foreground">
            Unsupported field type: {field.type}
          </div>
        );
    }
  };

  // Boolean fields render differently - no wrapper needed
  if (field.type === 'boolean') {
    return (
      <div className={className}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            {field.label}
            {field.required && <span className="text-error text-xs ml-1">*</span>}
          </span>
          {renderInput()}
        </div>
        {error && (
          <div className="flex items-center gap-1.5 text-xs text-error mt-1">
            <AlertCircle className="w-3 h-3" />
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      <FieldWrapper label={field.label} required={field.required} error={error}>
        {renderInput()}
      </FieldWrapper>
    </div>
  );
}

export default CustomizableFieldInput;
