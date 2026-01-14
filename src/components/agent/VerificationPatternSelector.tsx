/**
 * Verification Pattern Selector Component
 *
 * Allows selection of multi-agent verification patterns:
 * - Sibling: Multiple agents work independently, compare results
 * - Debate: Agents argue positions, reach consensus
 * - Family: Hierarchical with supervisor agent
 * - Waves: Sequential validation layers
 */

import { Users, MessageSquare, Network, Layers, Check } from 'lucide-react';
import clsx from 'clsx';
import type { VerificationPattern } from '@/types';

interface VerificationPatternSelectorProps {
  value: VerificationPattern;
  onChange: (pattern: VerificationPattern) => void;
  disabled?: boolean;
  showDescriptions?: boolean;
  layout?: 'grid' | 'list';
}

interface PatternConfig {
  id: VerificationPattern;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
  diagram: React.ReactNode;
}

// Pattern configuration with visual diagrams
const patterns: PatternConfig[] = [
  {
    id: 'sibling',
    name: 'Sibling',
    description:
      'Multiple agents work independently on the same task, then results are compared for consensus.',
    icon: Users,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500',
    diagram: (
      <svg viewBox="0 0 80 50" className="w-full h-12">
        {/* Three parallel agents */}
        <circle cx="15" cy="15" r="6" fill="currentColor" opacity="0.3" />
        <circle cx="40" cy="15" r="6" fill="currentColor" opacity="0.3" />
        <circle cx="65" cy="15" r="6" fill="currentColor" opacity="0.3" />
        {/* Arrows down */}
        <line x1="15" y1="23" x2="15" y2="32" stroke="currentColor" strokeWidth="1.5" />
        <line x1="40" y1="23" x2="40" y2="32" stroke="currentColor" strokeWidth="1.5" />
        <line x1="65" y1="23" x2="65" y2="32" stroke="currentColor" strokeWidth="1.5" />
        {/* Converge to result */}
        <line x1="15" y1="32" x2="40" y2="42" stroke="currentColor" strokeWidth="1.5" />
        <line x1="40" y1="32" x2="40" y2="42" stroke="currentColor" strokeWidth="1.5" />
        <line x1="65" y1="32" x2="40" y2="42" stroke="currentColor" strokeWidth="1.5" />
        {/* Result */}
        <rect x="32" y="38" width="16" height="10" rx="2" fill="currentColor" opacity="0.5" />
      </svg>
    ),
  },
  {
    id: 'debate',
    name: 'Debate',
    description:
      'Agents argue different positions and work through disagreements to reach a verified consensus.',
    icon: MessageSquare,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500',
    diagram: (
      <svg viewBox="0 0 80 50" className="w-full h-12">
        {/* Two agents */}
        <circle cx="20" cy="25" r="8" fill="currentColor" opacity="0.3" />
        <circle cx="60" cy="25" r="8" fill="currentColor" opacity="0.3" />
        {/* Bidirectional arrows */}
        <line x1="30" y1="20" x2="50" y2="20" stroke="currentColor" strokeWidth="1.5" />
        <polygon points="48,17 52,20 48,23" fill="currentColor" />
        <line x1="50" y1="30" x2="30" y2="30" stroke="currentColor" strokeWidth="1.5" />
        <polygon points="32,27 28,30 32,33" fill="currentColor" />
        {/* Speech bubbles */}
        <rect x="5" y="5" width="12" height="8" rx="2" fill="currentColor" opacity="0.2" />
        <rect x="63" y="5" width="12" height="8" rx="2" fill="currentColor" opacity="0.2" />
      </svg>
    ),
  },
  {
    id: 'family',
    name: 'Family',
    description:
      'A supervisor agent coordinates child agents and validates their outputs hierarchically.',
    icon: Network,
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500',
    diagram: (
      <svg viewBox="0 0 80 50" className="w-full h-12">
        {/* Supervisor at top */}
        <circle cx="40" cy="10" r="8" fill="currentColor" opacity="0.5" />
        {/* Lines to children */}
        <line x1="40" y1="18" x2="15" y2="35" stroke="currentColor" strokeWidth="1.5" />
        <line x1="40" y1="18" x2="40" y2="35" stroke="currentColor" strokeWidth="1.5" />
        <line x1="40" y1="18" x2="65" y2="35" stroke="currentColor" strokeWidth="1.5" />
        {/* Child agents */}
        <circle cx="15" cy="40" r="6" fill="currentColor" opacity="0.3" />
        <circle cx="40" cy="40" r="6" fill="currentColor" opacity="0.3" />
        <circle cx="65" cy="40" r="6" fill="currentColor" opacity="0.3" />
      </svg>
    ),
  },
  {
    id: 'waves',
    name: 'Waves',
    description:
      'Output passes through sequential validation layers, each adding verification and refinement.',
    icon: Layers,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500',
    diagram: (
      <svg viewBox="0 0 80 50" className="w-full h-12">
        {/* Wave layers */}
        <rect x="10" y="5" width="60" height="10" rx="3" fill="currentColor" opacity="0.2" />
        <rect x="10" y="20" width="60" height="10" rx="3" fill="currentColor" opacity="0.35" />
        <rect x="10" y="35" width="60" height="10" rx="3" fill="currentColor" opacity="0.5" />
        {/* Arrow through layers */}
        <line x1="40" y1="3" x2="40" y2="47" stroke="currentColor" strokeWidth="2" strokeDasharray="3,2" />
        <polygon points="37,45 40,50 43,45" fill="currentColor" />
      </svg>
    ),
  },
];

export default function VerificationPatternSelector({
  value,
  onChange,
  disabled = false,
  showDescriptions = true,
  layout = 'grid',
}: VerificationPatternSelectorProps): JSX.Element {
  const handleSelect = (patternId: VerificationPattern): void => {
    if (!disabled) {
      onChange(patternId);
    }
  };

  if (layout === 'list') {
    return (
      <div className="space-y-2">
        {patterns.map((pattern) => {
          const isSelected = value === pattern.id;
          const PatternIcon = pattern.icon;

          return (
            <button
              key={pattern.id}
              type="button"
              onClick={() => handleSelect(pattern.id)}
              disabled={disabled}
              className={clsx(
                'w-full flex items-center gap-4 p-3 rounded-lg border text-left',
                'transition-all duration-200',
                isSelected
                  ? `${pattern.bgColor} ${pattern.borderColor} border-2`
                  : 'bg-symtex-card border-symtex-border hover:border-slate-600',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
              aria-pressed={isSelected}
            >
              <div
                className={clsx(
                  'w-10 h-10 rounded-lg flex items-center justify-center',
                  pattern.bgColor
                )}
              >
                <PatternIcon className={clsx('w-5 h-5', pattern.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white">{pattern.name}</span>
                  {isSelected && (
                    <Check className={clsx('w-4 h-4', pattern.color)} />
                  )}
                </div>
                {showDescriptions && (
                  <p className="text-sm text-slate-400 truncate">
                    {pattern.description}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  // Grid layout
  return (
    <div className="grid grid-cols-2 gap-4">
      {patterns.map((pattern) => {
        const isSelected = value === pattern.id;
        const PatternIcon = pattern.icon;

        return (
          <button
            key={pattern.id}
            type="button"
            onClick={() => handleSelect(pattern.id)}
            disabled={disabled}
            className={clsx(
              'relative flex flex-col items-center p-4 rounded-xl border text-center',
              'transition-all duration-200',
              isSelected
                ? `${pattern.bgColor} ${pattern.borderColor} border-2 ring-2 ring-offset-2 ring-offset-symtex-dark`
                : 'bg-symtex-card border-symtex-border hover:border-slate-600',
              disabled && 'opacity-50 cursor-not-allowed',
              isSelected && pattern.id === 'sibling' && 'ring-blue-500/30',
              isSelected && pattern.id === 'debate' && 'ring-purple-500/30',
              isSelected && pattern.id === 'family' && 'ring-green-500/30',
              isSelected && pattern.id === 'waves' && 'ring-orange-500/30'
            )}
            aria-pressed={isSelected}
          >
            {/* Selection indicator */}
            {isSelected && (
              <div
                className={clsx(
                  'absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center',
                  pattern.bgColor
                )}
              >
                <Check className={clsx('w-3 h-3', pattern.color)} />
              </div>
            )}

            {/* Icon */}
            <div
              className={clsx(
                'w-12 h-12 rounded-xl flex items-center justify-center mb-3',
                pattern.bgColor
              )}
            >
              <PatternIcon className={clsx('w-6 h-6', pattern.color)} />
            </div>

            {/* Name */}
            <h4 className="font-semibold text-white mb-1">{pattern.name}</h4>

            {/* Diagram */}
            <div className={clsx('w-full mb-2', pattern.color)}>
              {pattern.diagram}
            </div>

            {/* Description */}
            {showDescriptions && (
              <p className="text-xs text-slate-400 line-clamp-2">
                {pattern.description}
              </p>
            )}
          </button>
        );
      })}
    </div>
  );
}

// Export pattern configuration for use elsewhere
export { patterns as verificationPatterns };
