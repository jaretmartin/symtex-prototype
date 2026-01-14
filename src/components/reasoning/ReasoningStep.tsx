/**
 * ReasoningStep Component
 *
 * Displays an individual step in the AI reasoning process.
 * Shows step number, description, confidence, duration, and optionally input/output.
 */

import { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Clock,
} from 'lucide-react';
import clsx from 'clsx';
import type { ReasoningStep as ReasoningStepType } from '@/types/entities/reasoning';
import ConfidenceMeter from './ConfidenceMeter';

export interface ReasoningStepProps {
  /** The reasoning step data */
  step: ReasoningStepType;
  /** Whether the step is expanded */
  isExpanded?: boolean;
  /** Toggle expand/collapse handler */
  onToggle?: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Format duration in milliseconds to human-readable string
 */
function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  if (ms < 60000) {
    return `${(ms / 1000).toFixed(1)}s`;
  }
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.round((ms % 60000) / 1000);
  return `${minutes}m ${seconds}s`;
}

/**
 * Input/Output visualization panel
 */
function InputOutputPanel({
  input,
  output,
}: {
  input?: string;
  output?: string;
}): JSX.Element | null {
  if (!input && !output) {
    return null;
  }

  return (
    <div className="mt-3 flex items-stretch gap-2">
      {/* Input */}
      {input && (
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
            Input
          </div>
          <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-700/50">
            <p className="text-xs text-slate-300 font-mono whitespace-pre-wrap break-words">
              {input}
            </p>
          </div>
        </div>
      )}

      {/* Arrow */}
      {input && output && (
        <div className="flex items-center justify-center px-2">
          <ArrowRight
            className="w-4 h-4 text-slate-600"
            aria-hidden="true"
          />
        </div>
      )}

      {/* Output */}
      {output && (
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
            Output
          </div>
          <div className="p-3 rounded-lg bg-symtex-primary/5 border border-symtex-primary/20">
            <p className="text-xs text-slate-300 font-mono whitespace-pre-wrap break-words">
              {output}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * ReasoningStep - Individual step in reasoning process
 *
 * @example
 * // Basic step display
 * <ReasoningStep step={step} />
 *
 * // Expandable step
 * <ReasoningStep
 *   step={step}
 *   isExpanded={expanded}
 *   onToggle={() => setExpanded(!expanded)}
 * />
 */
export default function ReasoningStep({
  step,
  isExpanded: controlledExpanded,
  onToggle,
  className,
}: ReasoningStepProps): JSX.Element {
  const [internalExpanded, setInternalExpanded] = useState(false);

  // Use controlled state if provided, otherwise use internal state
  const isExpanded = controlledExpanded ?? internalExpanded;
  const handleToggle = onToggle ?? (() => setInternalExpanded(!internalExpanded));

  const hasExpandableContent = Boolean(step.input || step.output);
  const ChevronIcon = isExpanded ? ChevronDown : ChevronRight;

  return (
    <div
      className={clsx(
        'border border-symtex-border rounded-lg overflow-hidden',
        'transition-all duration-200',
        isExpanded && 'bg-slate-800/30',
        className
      )}
    >
      {/* Step Header */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={!hasExpandableContent}
        className={clsx(
          'w-full flex items-center gap-3 p-3 text-left',
          'transition-colors duration-200',
          hasExpandableContent && 'hover:bg-slate-800/50 cursor-pointer',
          !hasExpandableContent && 'cursor-default'
        )}
        aria-expanded={hasExpandableContent ? isExpanded : undefined}
      >
        {/* Step Number */}
        <div
          className={clsx(
            'flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center',
            'text-xs font-bold',
            step.confidence >= 0.7
              ? 'bg-green-500/20 text-green-400'
              : step.confidence >= 0.3
                ? 'bg-yellow-500/20 text-yellow-400'
                : 'bg-red-500/20 text-red-400'
          )}
        >
          {step.order}
        </div>

        {/* Description */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-200 line-clamp-2">{step.description}</p>
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Duration */}
          {step.duration !== undefined && (
            <div
              className="flex items-center gap-1 text-xs text-slate-500"
              title={`Duration: ${formatDuration(step.duration)}`}
            >
              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="tabular-nums">{formatDuration(step.duration)}</span>
            </div>
          )}

          {/* Confidence */}
          <div className="w-20">
            <ConfidenceMeter value={step.confidence} size="sm" variant="bar" showLabel />
          </div>

          {/* Expand/Collapse indicator */}
          {hasExpandableContent && (
            <ChevronIcon
              className={clsx(
                'w-4 h-4 text-slate-500 transition-transform duration-200',
                isExpanded && 'text-slate-400'
              )}
              aria-hidden="true"
            />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {hasExpandableContent && (
        <div
          className={clsx(
            'overflow-hidden transition-all duration-300 ease-in-out',
            isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <div className="px-3 pb-3">
            <InputOutputPanel input={step.input} output={step.output} />
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Empty state for when no steps are available
 */
export function EmptyReasoningSteps({ className }: { className?: string }): JSX.Element {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center py-8 text-center',
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-slate-700/50 flex items-center justify-center mb-3">
        <span className="text-slate-500 text-xl">?</span>
      </div>
      <p className="text-sm text-slate-400">No reasoning steps recorded</p>
      <p className="text-xs text-slate-500 mt-1">
        Reasoning trace will appear here when available
      </p>
    </div>
  );
}

/**
 * Loading state for reasoning steps
 */
export function LoadingReasoningSteps({ className }: { className?: string }): JSX.Element {
  return (
    <div className={clsx('space-y-2', className)}>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="border border-symtex-border rounded-lg p-3 animate-pulse"
        >
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-slate-700" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-700 rounded w-3/4" />
            </div>
            <div className="w-20 h-2 bg-slate-700 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
