/**
 * ReasoningTracePanel Component
 *
 * A comprehensive panel for displaying AI reasoning traces.
 * Shows overall confidence, step-by-step reasoning, context sources,
 * and optional user feedback collection.
 */

import { useState } from 'react';
import {
  Brain,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Layers,
} from 'lucide-react';
import clsx from 'clsx';
import type { ReasoningTrace, Feedback } from '@/types/entities/reasoning';
import ConfidenceMeter from './ConfidenceMeter';
import ContextSourceBadge from './ContextSourceBadge';
import ReasoningStep, { EmptyReasoningSteps } from './ReasoningStep';
import FeedbackWidget, { FeedbackTrigger } from './FeedbackWidget';

export interface ReasoningTracePanelProps {
  /** The reasoning trace to display */
  trace: ReasoningTrace;
  /** Whether the panel is expanded by default */
  defaultExpanded?: boolean;
  /** Handler for feedback submission */
  onFeedbackSubmit?: (feedback: Feedback) => void;
  /** Handler for navigating to a context source */
  onSourceClick?: (sourceId: string) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Header component with confidence and controls
 */
function PanelHeader({
  trace,
  isExpanded,
  onToggle,
}: {
  trace: ReasoningTrace;
  isExpanded: boolean;
  onToggle: () => void;
}): JSX.Element {
  const ChevronIcon = isExpanded ? ChevronUp : ChevronDown;

  return (
    <button
      type="button"
      onClick={onToggle}
      className={clsx(
        'w-full flex items-center justify-between p-4',
        'transition-colors duration-200 hover:bg-card/30'
      )}
      aria-expanded={isExpanded}
      aria-controls="reasoning-content"
    >
      <div className="flex items-center gap-3">
        {/* Brain icon with thinking animation when expanded */}
        <div
          className={clsx(
            'p-2 rounded-lg transition-all duration-300',
            isExpanded
              ? 'bg-symtex-primary/20 text-symtex-primary'
              : 'bg-muted/50 text-muted-foreground'
          )}
        >
          <Brain
            className={clsx('w-5 h-5', isExpanded && 'animate-pulse')}
            aria-hidden="true"
          />
        </div>

        <div className="text-left">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            AI Reasoning Trace
            <span className="text-xs font-normal text-muted-foreground">
              ({trace.steps.length} step{trace.steps.length !== 1 ? 's' : ''})
            </span>
          </h3>
          <p className="text-xs text-muted-foreground">
            {isExpanded ? 'Click to collapse' : 'Click to see how this decision was made'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Overall confidence */}
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Confidence</span>
          <ConfidenceMeter
            value={trace.overallConfidence}
            size="sm"
            variant="badge"
            showLabel
          />
        </div>

        <ChevronIcon
          className={clsx(
            'w-5 h-5 text-muted-foreground transition-transform duration-200',
            isExpanded && 'text-muted-foreground'
          )}
          aria-hidden="true"
        />
      </div>
    </button>
  );
}

/**
 * Why this decision tooltip trigger
 */
function WhyTooltip({ className }: { className?: string }): JSX.Element {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className={clsx('relative inline-block', className)}>
      <button
        type="button"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className="text-muted-foreground hover:text-muted-foreground transition-colors"
        aria-label="Why this decision?"
      >
        <HelpCircle className="w-4 h-4" />
      </button>

      {/* Tooltip */}
      <div
        className={clsx(
          'absolute bottom-full right-0 mb-2 z-50',
          'w-64 p-3 rounded-lg shadow-lg',
          'bg-card border border-border',
          'transition-all duration-200',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 pointer-events-none'
        )}
        role="tooltip"
      >
        <p className="text-xs text-muted-foreground">
          <strong className="text-foreground">Why this decision?</strong>
          <br />
          <br />
          This panel shows the step-by-step reasoning process the AI used to reach its
          conclusion. Each step includes a confidence score and the context sources
          that informed the decision.
        </p>
      </div>
    </div>
  );
}

/**
 * Context sources section
 */
function ContextSourcesSection({
  sources,
  onSourceClick,
}: {
  sources: ReasoningTrace['sources'];
  onSourceClick?: (sourceId: string) => void;
}): JSX.Element {
  if (sources.length === 0) {
    return (
      <div className="text-xs text-muted-foreground py-2">
        No context sources recorded
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {sources.map((source) => (
        <ContextSourceBadge
          key={source.id}
          source={source}
          showRelevance
          onClick={onSourceClick ? () => onSourceClick(source.id) : undefined}
        />
      ))}
    </div>
  );
}

/**
 * ReasoningTracePanel - Complete reasoning transparency display
 *
 * @example
 * // Basic usage
 * <ReasoningTracePanel trace={trace} />
 *
 * // With feedback and navigation
 * <ReasoningTracePanel
 *   trace={trace}
 *   defaultExpanded
 *   onFeedbackSubmit={handleFeedback}
 *   onSourceClick={navigateToSource}
 * />
 */
export default function ReasoningTracePanel({
  trace,
  defaultExpanded = false,
  onFeedbackSubmit,
  onSourceClick,
  className,
}: ReasoningTracePanelProps): JSX.Element {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set());
  const [showFeedback, setShowFeedback] = useState(false);

  const toggleStep = (order: number): void => {
    setExpandedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(order)) {
        next.delete(order);
      } else {
        next.add(order);
      }
      return next;
    });
  };

  const handleFeedbackSubmit = (feedback: Feedback): void => {
    onFeedbackSubmit?.(feedback);
    setShowFeedback(false);
  };

  return (
    <div
      className={clsx(
        'rounded-xl border border-border bg-card overflow-hidden',
        'transition-all duration-300',
        className
      )}
    >
      {/* Header */}
      <PanelHeader
        trace={trace}
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
      />

      {/* Expandable Content */}
      <div
        id="reasoning-content"
        className={clsx(
          'overflow-hidden transition-all duration-300 ease-in-out',
          isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="px-4 pb-4 space-y-4">
          {/* Divider */}
          <div className="border-t border-border" />

          {/* Overall Confidence (visible on mobile) */}
          <div className="sm:hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Overall Confidence</span>
              <ConfidenceMeter
                value={trace.overallConfidence}
                size="md"
                variant="bar"
                showLabel
                className="w-32"
              />
            </div>
          </div>

          {/* Context Sources */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-3.5 h-3.5" />
                Context Sources
              </h4>
              <WhyTooltip />
            </div>
            <ContextSourcesSection
              sources={trace.sources}
              onSourceClick={onSourceClick}
            />
          </div>

          {/* Reasoning Steps */}
          <div>
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
              <Brain className="w-3.5 h-3.5" />
              Reasoning Steps
            </h4>

            {trace.steps.length === 0 ? (
              <EmptyReasoningSteps />
            ) : (
              <div className="space-y-2">
                {trace.steps.map((step) => (
                  <ReasoningStep
                    key={step.order}
                    step={step}
                    isExpanded={expandedSteps.has(step.order)}
                    onToggle={() => toggleStep(step.order)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Feedback Section */}
          {onFeedbackSubmit && (
            <div className="pt-2 border-t border-border">
              {showFeedback ? (
                <FeedbackWidget
                  onSubmit={handleFeedbackSubmit}
                  existingFeedback={trace.userFeedback}
                />
              ) : (
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    Was this reasoning helpful?
                  </p>
                  <FeedbackTrigger
                    onClick={() => setShowFeedback(true)}
                    hasFeedback={Boolean(trace.userFeedback)}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Loading state for ReasoningTracePanel
 */
export function LoadingReasoningTracePanel({
  className,
}: {
  className?: string;
}): JSX.Element {
  return (
    <div
      className={clsx(
        'rounded-xl border border-border bg-card overflow-hidden',
        className
      )}
    >
      <div className="p-4 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted rounded w-40" />
            <div className="h-3 bg-muted rounded w-60" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Empty state when no trace is available
 */
export function EmptyReasoningTracePanel({
  className,
}: {
  className?: string;
}): JSX.Element {
  return (
    <div
      className={clsx(
        'rounded-xl border border-dashed border-border bg-card/50',
        'p-8 text-center',
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
        <Brain className="w-6 h-6 text-muted-foreground" />
      </div>
      <h4 className="text-sm font-medium text-muted-foreground mb-1">
        No Reasoning Trace
      </h4>
      <p className="text-xs text-muted-foreground">
        Reasoning transparency data will appear here when available.
      </p>
    </div>
  );
}
