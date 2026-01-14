/**
 * Reasoning and transparency types
 *
 * Defines the structure for reasoning traces, steps, and context sources
 * used to provide transparency into AI decision-making.
 */

/**
 * Types of context sources that inform reasoning
 */
export type ContextSourceType = 'space' | 'cognate' | 'history' | 'external';

/**
 * A source of context used in reasoning
 */
export interface ContextSource {
  /** The type of context source */
  type: ContextSourceType;
  /** Unique identifier for the source */
  id: string;
  /** Display name for the source */
  name: string;
  /** Relevance score (0-1) indicating how relevant this source was */
  relevance: number;
}

/**
 * A single step in the reasoning process
 */
export interface ReasoningStep {
  /** The order of this step in the sequence */
  order: number;
  /** Description of what happened in this step */
  description: string;
  /** Input data or context for this step */
  input?: string;
  /** Output or result from this step */
  output?: string;
  /** Confidence level for this step (0-1) */
  confidence: number;
  /** Duration of this step in milliseconds */
  duration?: number;
}

/**
 * User feedback on a reasoning trace
 */
export interface Feedback {
  /** Rating from 1-5 */
  rating: 1 | 2 | 3 | 4 | 5;
  /** Optional comment explaining the rating */
  comment?: string;
  /** Suggested improvements for future reasoning */
  improvements?: string[];
}

/**
 * A complete trace of the reasoning process for transparency
 */
export interface ReasoningTrace {
  /** Unique identifier for the trace */
  id: string;
  /** ID of the mission this trace is associated with */
  missionId?: string;
  /** The ordered steps in the reasoning process */
  steps: ReasoningStep[];
  /** Overall confidence in the reasoning outcome (0-1) */
  overallConfidence: number;
  /** Context sources that informed the reasoning */
  sources: ContextSource[];
  /** User feedback on this reasoning trace */
  userFeedback?: Feedback;
}

/**
 * Summary of a reasoning trace for list views
 */
export interface ReasoningTraceSummary {
  /** Unique identifier for the trace */
  id: string;
  /** ID of the mission this trace is associated with */
  missionId?: string;
  /** Number of steps in the trace */
  stepCount: number;
  /** Overall confidence score */
  overallConfidence: number;
  /** Whether user feedback has been provided */
  hasFeedback: boolean;
  /** Creation timestamp */
  createdAt: string;
  /** Total duration in milliseconds */
  totalDuration?: number;
}

/**
 * Configuration for reasoning trace display
 */
export interface ReasoningDisplayConfig {
  /** Whether to show confidence scores */
  showConfidence: boolean;
  /** Whether to show timing information */
  showTiming: boolean;
  /** Whether to expand step details by default */
  expandStepsByDefault: boolean;
  /** Whether to show source attribution */
  showSources: boolean;
  /** Maximum number of steps to show before collapsing */
  maxVisibleSteps: number;
}

/**
 * Filter options for reasoning traces
 */
export interface ReasoningTraceFilters {
  /** Filter by minimum confidence */
  minConfidence?: number;
  /** Filter by maximum confidence */
  maxConfidence?: number;
  /** Filter by associated mission IDs */
  missionIds?: string[];
  /** Filter by feedback status */
  hasFeedback?: boolean;
  /** Filter by date range start */
  startDate?: string;
  /** Filter by date range end */
  endDate?: string;
}
