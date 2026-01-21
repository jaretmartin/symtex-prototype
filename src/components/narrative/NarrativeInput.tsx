/**
 * Narrative Input Component
 *
 * A rich text input component for entering story content with AI-assisted
 * suggestions and formatting options for narrative-driven workflows.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  Sparkles,
  Wand2,
  Type,
  AlignLeft,
  Send,
  X,
  Loader2,
  ChevronDown,
} from 'lucide-react';
import clsx from 'clsx';
import { Button } from '@/components/ui/Button';

interface NarrativeInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  label?: string;
  helperText?: string;
  error?: string;
  maxLength?: number;
  showCharCount?: boolean;
  showAiAssist?: boolean;
  aiSuggestions?: string[];
  onRequestAiSuggestion?: () => Promise<void>;
  isGenerating?: boolean;
  disabled?: boolean;
  rows?: number;
  className?: string;
}

interface FormatOption {
  id: string;
  label: string;
  icon: React.ElementType;
  format: (text: string) => string;
}

const formatOptions: FormatOption[] = [
  {
    id: 'capitalize',
    label: 'Capitalize',
    icon: Type,
    format: (text) => text.charAt(0).toUpperCase() + text.slice(1),
  },
  {
    id: 'formal',
    label: 'Make Formal',
    icon: AlignLeft,
    format: (text) => text.replace(/gonna/gi, 'going to').replace(/wanna/gi, 'want to'),
  },
];

export function NarrativeInput({
  value,
  onChange,
  onSubmit,
  placeholder = 'Tell your story...',
  label,
  helperText,
  error,
  maxLength = 2000,
  showCharCount = true,
  showAiAssist = true,
  aiSuggestions = [],
  onRequestAiSuggestion,
  isGenerating = false,
  disabled = false,
  rows = 4,
  className,
}: NarrativeInputProps): JSX.Element {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFormatMenu, setShowFormatMenu] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formatMenuRef = useRef<HTMLDivElement>(null);

  const charCount = value.length;
  const isOverLimit = charCount > maxLength;
  const charPercentage = Math.min((charCount / maxLength) * 100, 100);

  // Close format menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (formatMenuRef.current && !formatMenuRef.current.contains(event.target as Node)) {
        setShowFormatMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
      onChange(e.target.value);
    },
    [onChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
      // Submit on Cmd/Ctrl + Enter
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && onSubmit) {
        e.preventDefault();
        onSubmit();
      }
    },
    [onSubmit]
  );

  const handleApplySuggestion = useCallback(
    (suggestion: string): void => {
      onChange(suggestion);
      setShowSuggestions(false);
      textareaRef.current?.focus();
    },
    [onChange]
  );

  const handleApplyFormat = useCallback(
    (formatFn: (text: string) => string): void => {
      onChange(formatFn(value));
      setShowFormatMenu(false);
    },
    [value, onChange]
  );

  const handleRequestSuggestion = useCallback(async (): Promise<void> => {
    if (onRequestAiSuggestion) {
      await onRequestAiSuggestion();
      setShowSuggestions(true);
    }
  }, [onRequestAiSuggestion]);

  return (
    <div className={clsx('relative', className)}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">{label}</label>
      )}

      {/* Input Container */}
      <div
        className={clsx(
          'relative rounded-xl bg-background border transition-all duration-200',
          isFocused && !error
            ? 'border-symtex-primary ring-2 ring-symtex-primary/20'
            : error
              ? 'border-error ring-2 ring-error/20'
              : 'border-border hover:bg-muted',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          className={clsx(
            'w-full px-4 py-3 bg-transparent text-foreground placeholder-muted-foreground',
            'text-sm leading-relaxed resize-none',
            'focus:outline-none',
            disabled && 'cursor-not-allowed'
          )}
          aria-invalid={!!error}
          aria-describedby={error ? 'narrative-input-error' : undefined}
        />

        {/* Bottom Toolbar */}
        <div className="flex items-center justify-between px-3 py-2 border-t border-symtex-border/50">
          {/* Left Actions */}
          <div className="flex items-center gap-1">
            {/* AI Assist Button */}
            {showAiAssist && onRequestAiSuggestion && (
              <Button
                variant="ghost"
                size="xs"
                onClick={handleRequestSuggestion}
                disabled={disabled || isGenerating}
                className="text-symtex-primary hover:text-symtex-primary"
              >
                {isGenerating ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span className="text-xs">AI Assist</span>
              </Button>
            )}

            {/* Format Menu */}
            <div className="relative" ref={formatMenuRef}>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => setShowFormatMenu(!showFormatMenu)}
                disabled={disabled || !value}
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span className="text-xs">Format</span>
                <ChevronDown className="w-3 h-3" />
              </Button>

              {/* Format Dropdown */}
              {showFormatMenu && (
                <div className="absolute bottom-full left-0 mb-1 w-40 bg-symtex-elevated rounded-lg border border-symtex-border shadow-xl z-10">
                  {formatOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.id}
                        onClick={() => handleApplyFormat(option.format)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 first:rounded-t-lg last:rounded-b-lg transition-colors"
                      >
                        <Icon className="w-4 h-4" />
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Info */}
          <div className="flex items-center gap-3">
            {/* Character Count */}
            {showCharCount && (
              <div className="flex items-center gap-2">
                <div className="relative w-16 h-1 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={clsx(
                      'absolute inset-y-0 left-0 rounded-full transition-all duration-300',
                      isOverLimit
                        ? 'bg-error'
                        : charPercentage > 80
                          ? 'bg-warning'
                          : 'bg-symtex-primary'
                    )}
                    style={{ width: `${charPercentage}%` }}
                  />
                </div>
                <span
                  className={clsx(
                    'text-xs font-medium tabular-nums',
                    isOverLimit ? 'text-error' : 'text-slate-500'
                  )}
                >
                  {charCount}/{maxLength}
                </span>
              </div>
            )}

            {/* Submit Button */}
            {onSubmit && (
              <Button
                variant="primary"
                size="xs"
                onClick={onSubmit}
                disabled={disabled || !value || isOverLimit}
              >
                <Send className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Helper Text / Error */}
      {(helperText || error) && (
        <div className="mt-1.5">
          {error ? (
            <p id="narrative-input-error" className="text-xs text-error">
              {error}
            </p>
          ) : (
            <p className="text-xs text-slate-500">{helperText}</p>
          )}
        </div>
      )}

      {/* AI Suggestions Dropdown */}
      {showSuggestions && aiSuggestions.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 bg-symtex-elevated rounded-xl border border-symtex-border shadow-xl z-20">
          <div className="flex items-center justify-between px-4 py-2 border-b border-symtex-border">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-symtex-primary" />
              <span className="text-sm font-medium text-white">AI Suggestions</span>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setShowSuggestions(false)}
              aria-label="Close suggestions"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="max-h-60 overflow-y-auto">
            {aiSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleApplySuggestion(suggestion)}
                className="w-full px-4 py-3 text-left text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors border-b border-symtex-border/50 last:border-b-0"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default NarrativeInput;
