/**
 * SymbiosSuggestions Component
 *
 * Quick action suggestions displayed in the Symbios chat interface.
 * Helps users discover capabilities and take quick actions.
 */

import {
  Sparkles,
  Mail,
  FileText,
  BarChart3,
  Zap,
  Calendar,
  Search,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SymbiosSuggestion } from './symbios-store';

interface SymbiosSuggestionsProps {
  suggestions: SymbiosSuggestion[];
  onSelect: (suggestion: SymbiosSuggestion) => void;
  className?: string;
  variant?: 'horizontal' | 'grid' | 'chips';
}

export function SymbiosSuggestions({
  suggestions,
  onSelect,
  className,
  variant = 'horizontal',
}: SymbiosSuggestionsProps): JSX.Element {
  if (suggestions.length === 0) return <></>;

  // Get icon for action
  const getIcon = (action: string): JSX.Element => {
    const iconClass = 'w-3.5 h-3.5';
    switch (action) {
      case 'draft_email':
        return <Mail className={iconClass} />;
      case 'show_tasks':
        return <FileText className={iconClass} />;
      case 'create_automation':
        return <Zap className={iconClass} />;
      case 'view_analytics':
        return <BarChart3 className={iconClass} />;
      case 'schedule':
        return <Calendar className={iconClass} />;
      case 'search':
        return <Search className={iconClass} />;
      case 'elaborate':
        return <MessageSquare className={iconClass} />;
      default:
        return <Sparkles className={iconClass} />;
    }
  };

  // Get category color
  const getCategoryColor = (category?: string): string => {
    switch (category) {
      case 'quick':
        return 'border-indigo-500/30 hover:border-indigo-500/50 hover:bg-indigo-500/5';
      case 'contextual':
        return 'border-emerald-500/30 hover:border-emerald-500/50 hover:bg-emerald-500/5';
      case 'follow-up':
        return 'border-amber-500/30 hover:border-amber-500/50 hover:bg-amber-500/5';
      default:
        return 'border-border hover:border-border hover:bg-card/50';
    }
  };

  if (variant === 'chips') {
    return (
      <div className={cn('flex flex-wrap gap-2', className)}>
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.id}
            onClick={() => onSelect(suggestion)}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full',
              'text-xs text-muted-foreground border transition-all',
              getCategoryColor(suggestion.category)
            )}
          >
            {getIcon(suggestion.action)}
            <span>{suggestion.label}</span>
          </button>
        ))}
      </div>
    );
  }

  if (variant === 'grid') {
    return (
      <div className={cn('grid grid-cols-2 gap-2', className)}>
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.id}
            onClick={() => onSelect(suggestion)}
            className={cn(
              'flex items-center gap-2 p-3 rounded-lg',
              'text-left text-sm text-muted-foreground border transition-all',
              getCategoryColor(suggestion.category)
            )}
          >
            <div
              className={cn(
                'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center',
                suggestion.category === 'quick'
                  ? 'bg-indigo-500/10 text-indigo-400'
                  : suggestion.category === 'contextual'
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'bg-amber-500/10 text-amber-400'
              )}
            >
              {getIcon(suggestion.action)}
            </div>
            <span className="flex-1">{suggestion.label}</span>
            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        ))}
      </div>
    );
  }

  // Default: horizontal scroll
  return (
    <div className={cn('overflow-x-auto scrollbar-hide', className)}>
      <div className="flex gap-2 pb-1">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.id}
            onClick={() => onSelect(suggestion)}
            className={cn(
              'flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg',
              'text-xs text-muted-foreground border transition-all whitespace-nowrap',
              getCategoryColor(suggestion.category)
            )}
          >
            {getIcon(suggestion.action)}
            <span>{suggestion.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * SymbiosSuggestionCard - Larger suggestion card with description
 */
interface SymbiosSuggestionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'featured';
  className?: string;
}

export function SymbiosSuggestionCard({
  title,
  description,
  icon,
  onClick,
  variant = 'default',
  className,
}: SymbiosSuggestionCardProps): JSX.Element {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-start gap-3 p-4 rounded-xl text-left transition-all',
        variant === 'featured'
          ? 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 hover:border-indigo-500/40'
          : 'bg-card/50 border border-border hover:border-border hover:bg-card',
        className
      )}
    >
      <div
        className={cn(
          'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
          variant === 'featured'
            ? 'bg-indigo-500/20 text-indigo-400'
            : 'bg-muted text-muted-foreground'
        )}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-foreground mb-0.5">{title}</h4>
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
      </div>
      <ArrowRight className="flex-shrink-0 w-4 h-4 text-muted-foreground mt-1" />
    </button>
  );
}

/**
 * SymbiosEmptyState - Shown when chat is empty
 */
interface SymbiosEmptyStateProps {
  onSuggestionSelect: (text: string) => void;
  className?: string;
}

export function SymbiosEmptyState({
  onSuggestionSelect,
  className,
}: SymbiosEmptyStateProps): JSX.Element {
  const featuredActions = [
    {
      title: 'Draft an email',
      description: 'Compose professional emails quickly using templates',
      icon: <Mail className="w-5 h-5" />,
      prompt: 'Help me draft an email',
    },
    {
      title: 'Create an automation',
      description: 'Set up automated tasks to save time',
      icon: <Zap className="w-5 h-5" />,
      prompt: 'I want to create an automation for',
    },
    {
      title: 'Analyze data',
      description: 'Get insights from your business data',
      icon: <BarChart3 className="w-5 h-5" />,
      prompt: 'Can you help me analyze',
    },
    {
      title: 'Schedule a meeting',
      description: 'Coordinate calendars and send invites',
      icon: <Calendar className="w-5 h-5" />,
      prompt: 'Schedule a meeting with',
    },
  ];

  return (
    <div className={cn('flex flex-col items-center justify-center p-6', className)}>
      {/* Welcome message */}
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-4">
        <Sparkles className="w-8 h-8 text-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">
        Welcome to Symbios
      </h3>
      <p className="text-sm text-muted-foreground text-center mb-6 max-w-sm">
        I'm Aria, your assistant. I can help you with tasks, answer questions,
        and coordinate with your Cognates.
      </p>

      {/* Featured actions */}
      <div className="w-full max-w-md space-y-2">
        <p className="text-xs text-muted-foreground font-medium mb-2">Try asking me to:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {featuredActions.map((action) => (
            <button
              key={action.title}
              onClick={() => onSuggestionSelect(action.prompt)}
              className="flex items-center gap-3 p-3 rounded-lg text-left bg-card/50 border border-border hover:border-border hover:bg-card transition-all"
            >
              <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                {action.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-foreground">{action.title}</h4>
                <p className="text-xs text-muted-foreground truncate">{action.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SymbiosSuggestions;
