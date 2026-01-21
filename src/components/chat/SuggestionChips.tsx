/**
 * SuggestionChips Component
 *
 * Displays clickable suggestion chips for quick message options.
 * Used to provide contextual suggestions to the user.
 */

import { useState, useMemo } from 'react';
import {
  Sparkles,
  MessageSquare,
  HelpCircle,
  Lightbulb,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

interface Suggestion {
  /** Unique identifier for the suggestion */
  id: string;
  /** Display text for the chip */
  label: string;
  /** Full message text to send when clicked */
  message: string;
  /** Optional icon to display */
  icon?: 'sparkles' | 'message' | 'help' | 'lightbulb' | 'arrow';
  /** Optional category for grouping */
  category?: string;
}

interface SuggestionChipsProps {
  /** Array of suggestions to display */
  suggestions: Suggestion[];
  /** Callback when a suggestion is clicked */
  onSelect: (message: string) => void;
  /** Whether the chips are disabled */
  disabled?: boolean;
  /** Maximum number of suggestions to show */
  maxVisible?: number;
  /** Whether to show a refresh button for more suggestions */
  showRefresh?: boolean;
  /** Callback when refresh is clicked */
  onRefresh?: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Returns the appropriate icon component
 */
function getIcon(icon?: Suggestion['icon']): JSX.Element | null {
  const iconClass = 'w-3.5 h-3.5';

  switch (icon) {
    case 'sparkles':
      return <Sparkles className={iconClass} />;
    case 'message':
      return <MessageSquare className={iconClass} />;
    case 'help':
      return <HelpCircle className={iconClass} />;
    case 'lightbulb':
      return <Lightbulb className={iconClass} />;
    case 'arrow':
      return <ArrowRight className={iconClass} />;
    default:
      return null;
  }
}

/**
 * Displays a row of clickable suggestion chips
 */
export function SuggestionChips({
  suggestions,
  onSelect,
  disabled = false,
  maxVisible = 4,
  showRefresh = false,
  onRefresh,
  className = '',
}: SuggestionChipsProps): JSX.Element {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const visibleSuggestions = useMemo(
    () => suggestions.slice(0, maxVisible),
    [suggestions, maxVisible]
  );

  if (visibleSuggestions.length === 0) {
    return <></>;
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {visibleSuggestions.map((suggestion) => {
        const isHovered = hoveredId === suggestion.id;
        const icon = getIcon(suggestion.icon);

        return (
          <button
            key={suggestion.id}
            onClick={() => !disabled && onSelect(suggestion.message)}
            onMouseEnter={() => setHoveredId(suggestion.id)}
            onMouseLeave={() => setHoveredId(null)}
            disabled={disabled}
            className={`
              group flex items-center gap-2 px-3 py-1.5 text-sm rounded-full
              border transition-all duration-200
              ${
                disabled
                  ? 'opacity-50 cursor-not-allowed bg-card/30 border-border/30 text-muted-foreground'
                  : isHovered
                  ? 'bg-symtex-primary/10 border-symtex-primary/50 text-symtex-primary shadow-sm shadow-symtex-primary/20'
                  : 'bg-card/50 border-border/50 text-muted-foreground hover:bg-muted/50'
              }
            `}
            aria-label={`Send: ${suggestion.message}`}
          >
            {icon && (
              <span
                className={`transition-colors ${
                  isHovered ? 'text-symtex-primary' : 'text-muted-foreground'
                }`}
              >
                {icon}
              </span>
            )}
            <span className="truncate max-w-[200px]">{suggestion.label}</span>
          </button>
        );
      })}

      {/* Refresh button */}
      {showRefresh && onRefresh && suggestions.length > maxVisible && (
        <button
          onClick={onRefresh}
          disabled={disabled}
          className="p-2 text-muted-foreground hover:text-muted-foreground rounded-full hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Show more suggestions"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

/**
 * Predefined suggestion sets for common scenarios
 */
export const DEFAULT_SUGGESTIONS: Record<string, Suggestion[]> = {
  greeting: [
    {
      id: 'greeting-1',
      label: 'Help me get started',
      message: 'Can you help me get started with this project?',
      icon: 'sparkles',
    },
    {
      id: 'greeting-2',
      label: 'What can you do?',
      message: 'What capabilities do you have and how can you help me?',
      icon: 'help',
    },
    {
      id: 'greeting-3',
      label: 'Review my work',
      message: 'Can you review my recent work and provide feedback?',
      icon: 'message',
    },
    {
      id: 'greeting-4',
      label: 'Suggest improvements',
      message: 'What improvements would you suggest for this project?',
      icon: 'lightbulb',
    },
  ],
  mission: [
    {
      id: 'mission-1',
      label: 'Check status',
      message: "What's the current status of this mission?",
      icon: 'help',
    },
    {
      id: 'mission-2',
      label: 'Next steps',
      message: 'What are the next steps for this mission?',
      icon: 'arrow',
    },
    {
      id: 'mission-3',
      label: 'Show blockers',
      message: 'Are there any blockers or issues I should know about?',
      icon: 'message',
    },
    {
      id: 'mission-4',
      label: 'Generate report',
      message: 'Generate a progress report for this mission.',
      icon: 'sparkles',
    },
  ],
  project: [
    {
      id: 'project-1',
      label: 'Project overview',
      message: 'Give me an overview of this project.',
      icon: 'help',
    },
    {
      id: 'project-2',
      label: 'Active missions',
      message: 'What missions are currently active in this project?',
      icon: 'message',
    },
    {
      id: 'project-3',
      label: 'Recent changes',
      message: 'What are the most recent changes or updates?',
      icon: 'arrow',
    },
    {
      id: 'project-4',
      label: 'Suggest tasks',
      message: 'What tasks should I focus on next?',
      icon: 'lightbulb',
    },
  ],
  followUp: [
    {
      id: 'followup-1',
      label: 'Tell me more',
      message: 'Can you elaborate on that?',
      icon: 'help',
    },
    {
      id: 'followup-2',
      label: 'Give examples',
      message: 'Can you provide some specific examples?',
      icon: 'lightbulb',
    },
    {
      id: 'followup-3',
      label: 'How do I implement this?',
      message: 'How would I implement this in practice?',
      icon: 'arrow',
    },
    {
      id: 'followup-4',
      label: 'Any alternatives?',
      message: 'Are there any alternative approaches?',
      icon: 'sparkles',
    },
  ],
};

/**
 * Hook to manage suggestion state with rotation
 */
export function useSuggestions(
  initialSuggestions: Suggestion[],
  maxVisible = 4
): {
  suggestions: Suggestion[];
  visibleSuggestions: Suggestion[];
  rotate: () => void;
  reset: () => void;
} {
  const [offset, setOffset] = useState(0);

  const visibleSuggestions = useMemo(() => {
    const start = offset % initialSuggestions.length;
    const result: Suggestion[] = [];

    for (let i = 0; i < maxVisible && i < initialSuggestions.length; i++) {
      const index = (start + i) % initialSuggestions.length;
      result.push(initialSuggestions[index]);
    }

    return result;
  }, [initialSuggestions, offset, maxVisible]);

  const rotate = (): void => {
    setOffset((prev) => prev + maxVisible);
  };

  const reset = (): void => {
    setOffset(0);
  };

  return {
    suggestions: initialSuggestions,
    visibleSuggestions,
    rotate,
    reset,
  };
}
