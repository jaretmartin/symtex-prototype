/**
 * Validation Types and Constants
 *
 * Type definitions for the SOP validation system including scenarios,
 * edge cases, coverage metrics, and validation reports.
 *
 * @module cognate/validation/types
 */

// =============================================================================
// Validation Status
// =============================================================================

/**
 * Status of a validation scenario execution.
 */
export type ValidationStatus = 'passed' | 'failed' | 'warning' | 'pending' | 'skipped';

/**
 * Configuration for validation status display.
 */
export interface ValidationStatusConfig {
  label: string;
  color: 'green' | 'red' | 'amber' | 'neutral' | 'blue' | 'purple';
  icon: 'CheckCircle' | 'XCircle' | 'AlertTriangle' | 'Clock' | 'MinusCircle';
}

/**
 * All validation status configurations.
 */
export const VALIDATION_STATUSES: Record<ValidationStatus, ValidationStatusConfig> = {
  passed: { label: 'Passed', color: 'green', icon: 'CheckCircle' },
  failed: { label: 'Failed', color: 'red', icon: 'XCircle' },
  warning: { label: 'Warning', color: 'amber', icon: 'AlertTriangle' },
  pending: { label: 'Pending', color: 'neutral', icon: 'Clock' },
  skipped: { label: 'Skipped', color: 'neutral', icon: 'MinusCircle' },
};

// =============================================================================
// Scenario Types
// =============================================================================

/**
 * Types of validation scenarios.
 */
export type ScenarioType =
  | 'happy_path'
  | 'boundary'
  | 'negative'
  | 'edge_case'
  | 'stress'
  | 'integration';

/**
 * Scenario type configuration for display.
 */
export interface ScenarioTypeConfig {
  label: string;
  description: string;
  color: 'green' | 'amber' | 'red' | 'purple' | 'blue' | 'cyan';
}

/**
 * Configuration for scenario type display.
 */
export const SCENARIO_TYPES: Record<ScenarioType, ScenarioTypeConfig> = {
  happy_path: {
    label: 'Happy Path',
    description: 'Standard successful execution',
    color: 'green',
  },
  boundary: {
    label: 'Boundary',
    description: 'Edge of acceptable input ranges',
    color: 'amber',
  },
  negative: {
    label: 'Negative',
    description: 'Invalid or error conditions',
    color: 'red',
  },
  edge_case: {
    label: 'Edge Case',
    description: 'Unusual but valid scenarios',
    color: 'purple',
  },
  stress: {
    label: 'Stress',
    description: 'High volume or load conditions',
    color: 'blue',
  },
  integration: {
    label: 'Integration',
    description: 'Cross-system interactions',
    color: 'cyan',
  },
};

// =============================================================================
// Validation Scenario
// =============================================================================

/**
 * A validation scenario tests specific SOP behavior.
 */
export interface ValidationScenario {
  /** Unique identifier */
  id: string;
  /** SOP being tested */
  sopId: string;
  /** Specific rule being tested */
  ruleId: string;
  /** Human-readable name */
  name: string;
  /** Description of what this tests */
  description: string;
  /** Type of scenario */
  type: ScenarioType;
  /** Current status */
  status: ValidationStatus;
  /** Input values for the test */
  inputs: Record<string, unknown>;
  /** Expected output values */
  expectedOutputs: Record<string, unknown>;
  /** Actual output values (after execution) */
  actualOutputs?: Record<string, unknown>;
  /** The execution path taken through rules */
  executionPath: string[];
  /** How long execution took in milliseconds */
  executionTimeMs: number;
  /** When this scenario was last run */
  timestamp: Date;
  /** Reason for failure (if failed) */
  failureReason?: string;
  /** Reason for warning (if warning) */
  warningReason?: string;
}

// =============================================================================
// Edge Cases
// =============================================================================

/**
 * Edge case resolution option.
 */
export interface EdgeCaseOption {
  id: string;
  label: string;
  description: string;
  impact: string;
  recommended: boolean;
}

/**
 * Edge case resolution details.
 */
export interface EdgeCaseResolution {
  optionId: string;
  resolvedBy: string;
  resolvedAt: Date;
  notes?: string;
}

/**
 * An edge case that requires user decision.
 */
export interface EdgeCase {
  /** Unique identifier */
  id: string;
  /** Related SOP */
  sopId: string;
  /** Related rule */
  ruleId: string;
  /** Brief title */
  title: string;
  /** Detailed description of the situation */
  description: string;
  /** Example scenario demonstrating the edge case */
  scenario: {
    inputs: Record<string, unknown>;
    currentBehavior: string;
  };
  /** Current status */
  status: 'pending' | 'resolved';
  /** Available resolution options */
  options: EdgeCaseOption[];
  /** How it was resolved (if resolved) */
  resolution?: EdgeCaseResolution;
  /** When this was identified */
  createdAt: Date;
}

// =============================================================================
// Validation Statistics
// =============================================================================

/**
 * Aggregate validation statistics.
 */
export interface ValidationStats {
  /** Total scenarios */
  total: number;
  /** Passed scenarios */
  passed: number;
  /** Failed scenarios */
  failed: number;
  /** Warning scenarios */
  warnings: number;
  /** Pending edge cases */
  edgeCasesPending: number;
  /** Average execution time */
  avgExecutionTime: number;
}

// =============================================================================
// Coverage Metrics
// =============================================================================

/**
 * Coverage metrics for a specific aspect.
 */
export interface CoverageMetric {
  covered: number;
  total: number;
  percentage: number;
}

/**
 * Validation report coverage data.
 */
export interface ValidationCoverage {
  rules: CoverageMetric;
  conditions: CoverageMetric;
  branches: CoverageMetric;
}

// =============================================================================
// Static Analysis
// =============================================================================

/**
 * Static analysis results.
 */
export interface StaticAnalysisResult {
  syntaxErrors: number;
  unusedVariables: number;
  unreachableCode: number;
  potentialConflicts: number;
}

// =============================================================================
// Validation Issues
// =============================================================================

/**
 * Issue severity levels.
 */
export type IssueSeverity = 'error' | 'warning' | 'info';

/**
 * A validation issue found during analysis.
 */
export interface ValidationIssue {
  severity: IssueSeverity;
  ruleId: string;
  message: string;
  line: number;
  suggestion?: string;
}

// =============================================================================
// Validation Report
// =============================================================================

/**
 * Validation report summary statistics.
 */
export interface ValidationReportSummary {
  total: number;
  passed: number;
  failed: number;
  warnings: number;
  skipped: number;
}

/**
 * Full validation report structure.
 */
export interface ValidationReport {
  id: string;
  sopId: string;
  sopTitle: string;
  runAt: string;
  runBy: string;
  duration: number;
  summary: ValidationReportSummary;
  coverage: ValidationCoverage;
  staticAnalysis: StaticAnalysisResult;
  scenarios: string[];
  issues: ValidationIssue[];
}

// =============================================================================
// SOP Reference
// =============================================================================

/**
 * Extended SOP type for the dashboard.
 */
export interface ExtendedSOP {
  id: string;
  title: string;
  description?: string;
  ruleCount: number;
  status?: string;
}

// =============================================================================
// Dashboard Tab Types
// =============================================================================

/**
 * Tab identifiers for the dashboard views.
 */
export type DashboardTab = 'all' | 'passed' | 'failed' | 'edge-cases';

/**
 * Dashboard tab configuration.
 */
export interface DashboardTabConfig {
  id: DashboardTab;
  label: string;
  icon: 'List' | 'CheckCircle' | 'XCircle' | 'AlertTriangle';
}

/**
 * Available dashboard tabs.
 */
export const DASHBOARD_TABS: DashboardTabConfig[] = [
  { id: 'all', label: 'All Scenarios', icon: 'List' },
  { id: 'passed', label: 'Passed', icon: 'CheckCircle' },
  { id: 'failed', label: 'Failed', icon: 'XCircle' },
  { id: 'edge-cases', label: 'Edge Cases', icon: 'AlertTriangle' },
];

// =============================================================================
// Color Utilities
// =============================================================================

/**
 * Color class mappings for Tailwind.
 */
export const STATUS_COLOR_CLASSES: Record<ValidationStatusConfig['color'], { text: string; bg: string; border: string }> = {
  green: { text: 'text-green-500', bg: 'bg-green-500', border: 'border-green-500' },
  red: { text: 'text-red-500', bg: 'bg-red-500', border: 'border-red-500' },
  amber: { text: 'text-amber-500', bg: 'bg-amber-500', border: 'border-amber-500' },
  neutral: { text: 'text-muted-foreground', bg: 'bg-muted', border: 'border-border' },
  blue: { text: 'text-blue-500', bg: 'bg-blue-500', border: 'border-blue-500' },
  purple: { text: 'text-purple-500', bg: 'bg-purple-500', border: 'border-purple-500' },
};

/**
 * Scenario type color class mappings for Tailwind.
 */
export const SCENARIO_COLOR_CLASSES: Record<ScenarioTypeConfig['color'], { text: string; bg: string; bgLight: string }> = {
  green: { text: 'text-green-400', bg: 'bg-green-500', bgLight: 'bg-green-500/20' },
  amber: { text: 'text-amber-400', bg: 'bg-amber-500', bgLight: 'bg-amber-500/20' },
  red: { text: 'text-red-400', bg: 'bg-red-500', bgLight: 'bg-red-500/20' },
  purple: { text: 'text-purple-400', bg: 'bg-purple-500', bgLight: 'bg-purple-500/20' },
  blue: { text: 'text-blue-400', bg: 'bg-blue-500', bgLight: 'bg-blue-500/20' },
  cyan: { text: 'text-cyan-400', bg: 'bg-cyan-500', bgLight: 'bg-cyan-500/20' },
};
