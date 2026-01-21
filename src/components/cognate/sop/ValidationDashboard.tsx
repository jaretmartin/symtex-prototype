/**
 * ValidationDashboard Component
 *
 * Validates SOP rules with test scenarios, displays coverage metrics,
 * and manages edge case resolution. Provides a comprehensive view of
 * SOP validation status including scenario runner UI and results display.
 *
 * @module cognate/sop/ValidationDashboard
 */

import { useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Play,
  ArrowLeft,
  BarChart3,
  Target,
  GitBranch,
  FileText,
  ChevronRight,
  RefreshCw,
  Download,
  Filter,
  Zap,
  MinusCircle,
} from 'lucide-react';
// ============================================================================
// Local Types (to be replaced with @symtex/types when package is linked)
// ============================================================================

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
  icon: string;
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

// ============================================================================
// Types
// ============================================================================

/**
 * Tab identifiers for the dashboard views.
 */
type DashboardTab = 'overview' | 'scenarios' | 'coverage' | 'issues';

/**
 * Scenario type configuration for display.
 */
interface ScenarioTypeConfig {
  label: string;
  description: string;
  color: 'green' | 'amber' | 'red' | 'purple' | 'blue' | 'cyan';
}

/**
 * Validation report summary statistics.
 */
interface ValidationReportSummary {
  total: number;
  passed: number;
  failed: number;
  warnings: number;
  skipped: number;
}

/**
 * Coverage metrics for a specific aspect.
 */
interface CoverageMetric {
  covered: number;
  total: number;
  percentage: number;
}

/**
 * Validation report coverage data.
 */
interface ValidationCoverage {
  rules: CoverageMetric;
  conditions: CoverageMetric;
  branches: CoverageMetric;
}

/**
 * Static analysis results.
 */
interface StaticAnalysisResult {
  syntaxErrors: number;
  unusedVariables: number;
  unreachableCode: number;
  potentialConflicts: number;
}

/**
 * Issue severity levels.
 */
type IssueSeverity = 'error' | 'warning' | 'info';

/**
 * A validation issue found during analysis.
 */
interface ValidationIssue {
  severity: IssueSeverity;
  ruleId: string;
  message: string;
  line: number;
  suggestion?: string;
}

/**
 * Full validation report structure.
 */
interface ValidationReport {
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

/**
 * Props for the ValidationDashboard component.
 */
export interface ValidationDashboardProps {
  /** Optional SOP data (if not using route params) */
  sop?: ExtendedSOP;
  /** Validation scenarios to display */
  scenarios?: ValidationScenario[];
  /** Edge cases requiring resolution */
  edgeCases?: EdgeCase[];
  /** Validation report data */
  report?: ValidationReport;
  /** Callback when validation run is triggered */
  onRunValidation?: () => Promise<void>;
  /** Callback when report is exported */
  onExportReport?: () => void;
  /** Whether component is in loading state */
  isLoading?: boolean;
  /** Error message to display */
  error?: string | null;
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Constants
// ============================================================================

/**
 * Configuration for scenario type display.
 */
const SCENARIO_TYPES: Record<ScenarioType, ScenarioTypeConfig> = {
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

/**
 * Dashboard tab configuration.
 */
const TABS: DashboardTab[] = ['overview', 'scenarios', 'coverage', 'issues'];

// ============================================================================
// Helper Components
// ============================================================================

/**
 * Returns the appropriate icon for a validation status.
 */
function StatusIcon({
  status,
  className = 'w-4 h-4',
}: {
  status: ValidationStatus;
  className?: string;
}): JSX.Element {
  const config = VALIDATION_STATUSES[status];
  const colorClass = {
    green: 'text-green-500',
    red: 'text-red-500',
    amber: 'text-amber-500',
    neutral: 'text-muted-foreground',
    blue: 'text-blue-500',
    purple: 'text-purple-500',
  }[config.color];

  switch (status) {
    case 'passed':
      return <CheckCircle className={`${className} ${colorClass}`} />;
    case 'failed':
      return <XCircle className={`${className} ${colorClass}`} />;
    case 'warning':
      return <AlertTriangle className={`${className} ${colorClass}`} />;
    case 'skipped':
      return <MinusCircle className={`${className} ${colorClass}`} />;
    default:
      return <Clock className={`${className} ${colorClass}`} />;
  }
}

/**
 * Stat card component for displaying validation metrics.
 */
function StatCard({
  label,
  value,
  colorClass = 'text-foreground',
}: {
  label: string;
  value: number | string;
  colorClass?: string;
}): JSX.Element {
  return (
    <div className="bg-surface-base/50 rounded-xl border border-border p-4">
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
    </div>
  );
}

/**
 * Progress bar component for coverage metrics.
 */
function CoverageBar({
  label,
  percentage,
  colorClass,
}: {
  label: string;
  percentage: number;
  colorClass: string;
}): JSX.Element {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium text-foreground">{percentage}%</span>
      </div>
      <div className="h-2 bg-card rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClass} rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

/**
 * Loading skeleton component.
 */
function LoadingSkeleton(): JSX.Element {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-card rounded-lg" />
        <div className="space-y-2">
          <div className="w-48 h-6 bg-card rounded" />
          <div className="w-32 h-4 bg-card rounded" />
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-24 bg-card rounded-xl" />
        ))}
      </div>
      <div className="h-64 bg-card rounded-xl" />
    </div>
  );
}

/**
 * Error display component.
 */
function ErrorDisplay({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
        <XCircle className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">Validation Error</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="px-4 py-2 bg-card text-foreground rounded-lg hover:bg-muted transition-colors flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      )}
    </div>
  );
}

/**
 * Empty state component for when no scenarios exist.
 */
function EmptyScenarios(): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-symtex-primary/10 flex items-center justify-center mb-6">
        <Shield className="w-8 h-8 text-symtex-primary" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">No Validation Scenarios</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        Create test scenarios to validate your SOP rules and ensure they behave as expected.
      </p>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

/**
 * ValidationDashboard provides comprehensive SOP validation with test scenarios,
 * coverage metrics, static analysis, and edge case management.
 */
export function ValidationDashboard({
  sop: propSop,
  scenarios: propScenarios = [],
  edgeCases: propEdgeCases = [],
  report: propReport,
  onRunValidation,
  onExportReport,
  isLoading = false,
  error = null,
  className = '',
}: ValidationDashboardProps): JSX.Element {
  const { id: cognateId, sopId } = useParams<{ id: string; sopId: string }>();
  const navigate = useNavigate();

  // Local state
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');

  // Use prop data or create defaults from route params
  const sop = propSop ?? {
    id: sopId ?? 'unknown',
    title: 'Customer Response Protocol',
    ruleCount: propScenarios.length > 0 ? Math.ceil(propScenarios.length / 2) : 4,
  } as ExtendedSOP;

  const scenarios = propScenarios;
  const edgeCases = propEdgeCases;
  const report = propReport;

  // Compute stats from scenarios
  const stats: ValidationStats = useMemo(() => {
    const passed = scenarios.filter((s) => s.status === 'passed').length;
    const failed = scenarios.filter((s) => s.status === 'failed').length;
    const warnings = scenarios.filter((s) => s.status === 'warning').length;
    const totalTime = scenarios.reduce((sum, s) => sum + s.executionTimeMs, 0);
    const edgeCasesPending = edgeCases.filter((e) => e.status === 'pending').length;

    return {
      total: scenarios.length,
      passed,
      failed,
      warnings,
      edgeCasesPending,
      avgExecutionTime: scenarios.length > 0 ? Math.round(totalTime / scenarios.length) : 0,
    };
  }, [scenarios, edgeCases]);

  // Group scenarios by type
  const scenariosByType = useMemo(() => {
    const grouped: Partial<Record<ScenarioType, ValidationScenario[]>> = {};
    scenarios.forEach((s) => {
      if (!grouped[s.type]) {
        grouped[s.type] = [];
      }
      grouped[s.type]!.push(s);
    });
    return grouped;
  }, [scenarios]);

  // Handle validation run
  const handleRunValidation = useCallback(async () => {
    setIsRunning(true);
    try {
      if (onRunValidation) {
        await onRunValidation();
      } else {
        // Simulate validation run
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    } finally {
      setIsRunning(false);
    }
  }, [onRunValidation]);

  // Handle navigation back
  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Handle scenario click
  const handleScenarioClick = useCallback(
    (scenarioId: string) => {
      navigate(`/cognates/${cognateId}/sops/${sopId}/scenarios/${scenarioId}`);
    },
    [navigate, cognateId, sopId]
  );

  // Pending edge cases count
  const pendingEdgeCases = useMemo(
    () => edgeCases.filter((e) => e.status === 'pending'),
    [edgeCases]
  );

  // Loading state
  if (isLoading) {
    return (
      <div className={`p-6 ${className}`}>
        <LoadingSkeleton />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`p-6 ${className}`}>
        <ErrorDisplay message={error} onRetry={handleRunValidation} />
      </div>
    );
  }

  // Empty state
  if (scenarios.length === 0 && !report) {
    return (
      <div className={`p-6 ${className}`}>
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            type="button"
            onClick={handleBack}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Shield className="w-7 h-7 text-symtex-primary" />
              Validation Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">{sop.title}</p>
          </div>
        </div>
        <EmptyScenarios />
      </div>
    );
  }

  return (
    <div className={`p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleBack}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Shield className="w-7 h-7 text-symtex-primary" />
              Validation Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              {sop.title} - {scenarios.length} scenarios, {sop.ruleCount} rules
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onExportReport}
            className="px-4 py-2 bg-surface-base border border-border rounded-xl hover:bg-muted transition-colors flex items-center gap-2 text-foreground"
          >
            <Download className="w-4 h-4" />
            Export Report
          </button>
          <button
            type="button"
            onClick={handleRunValidation}
            disabled={isRunning}
            className="px-4 py-2 bg-symtex-primary text-foreground rounded-xl hover:bg-symtex-primary/90 transition-colors flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Run Validation
              </>
            )}
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
        <StatCard
          label="Total Scenarios"
          value={report?.summary?.total ?? stats.total}
        />
        <StatCard
          label="Passed"
          value={report?.summary?.passed ?? stats.passed}
          colorClass="text-green-500"
        />
        <StatCard
          label="Failed"
          value={report?.summary?.failed ?? stats.failed}
          colorClass="text-red-500"
        />
        <StatCard
          label="Warnings"
          value={report?.summary?.warnings ?? stats.warnings}
          colorClass="text-amber-500"
        />
        <StatCard
          label="Edge Cases"
          value={pendingEdgeCases.length}
          colorClass="text-purple-500"
        />
        <StatCard
          label="Avg. Time"
          value={`${stats.avgExecutionTime}ms`}
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium capitalize transition-colors ${
              activeTab === tab
                ? 'text-symtex-primary border-b-2 border-symtex-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Scenario Breakdown */}
          <div className="lg:col-span-2 bg-surface-base/50 rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-symtex-primary" />
              Scenario Breakdown
            </h3>
            <div className="space-y-4">
              {(Object.entries(SCENARIO_TYPES) as [ScenarioType, ScenarioTypeConfig][]).map(
                ([type, config]) => {
                  const typeScenarios = scenariosByType[type] ?? [];
                  const passed = typeScenarios.filter((s) => s.status === 'passed').length;
                  const total = typeScenarios.length;
                  const percentage = total > 0 ? Math.round((passed / total) * 100) : 0;

                  const colorClasses = {
                    green: 'bg-green-500',
                    amber: 'bg-amber-500',
                    red: 'bg-red-500',
                    purple: 'bg-purple-500',
                    blue: 'bg-blue-500',
                    cyan: 'bg-cyan-500',
                  };

                  const badgeColorClasses = {
                    green: 'bg-green-500/20 text-green-400',
                    amber: 'bg-amber-500/20 text-amber-400',
                    red: 'bg-red-500/20 text-red-400',
                    purple: 'bg-purple-500/20 text-purple-400',
                    blue: 'bg-blue-500/20 text-blue-400',
                    cyan: 'bg-cyan-500/20 text-cyan-400',
                  };

                  return (
                    <div key={type} className="flex items-center gap-4">
                      <div className="w-32">
                        <span
                          className={`text-sm font-medium px-2 py-1 rounded-lg ${badgeColorClasses[config.color]}`}
                        >
                          {config.label}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="h-2 bg-card rounded-full overflow-hidden">
                          <div
                            className={`h-full ${colorClasses[config.color]} rounded-full transition-all`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                      <div className="w-20 text-right text-sm text-muted-foreground">
                        {passed}/{total} passed
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            {/* Edge Cases Alert */}
            {pendingEdgeCases.length > 0 && (
              <Link
                to={`/cognates/${cognateId}/sops/${sopId}/edge-cases`}
                className="block bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 hover:border-purple-500/50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-purple-300">Edge Cases Need Resolution</h4>
                    <p className="text-sm text-purple-400">
                      {pendingEdgeCases.length} cases require your decision
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-purple-400" />
                </div>
              </Link>
            )}

            {/* Coverage Card */}
            <div className="bg-surface-base/50 rounded-xl border border-border p-4">
              <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-symtex-primary" />
                Coverage Analysis
              </h4>
              <div className="space-y-3">
                <CoverageBar
                  label="Rules"
                  percentage={report?.coverage?.rules?.percentage ?? 100}
                  colorClass="bg-green-500"
                />
                <CoverageBar
                  label="Conditions"
                  percentage={report?.coverage?.conditions?.percentage ?? 85.7}
                  colorClass="bg-amber-500"
                />
                <CoverageBar
                  label="Branches"
                  percentage={report?.coverage?.branches?.percentage ?? 80}
                  colorClass="bg-blue-500"
                />
              </div>
            </div>

            {/* Static Analysis */}
            <div className="bg-surface-base/50 rounded-xl border border-border p-4">
              <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-symtex-primary" />
                Static Analysis
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Syntax Errors</span>
                  <span
                    className={`font-medium ${
                      (report?.staticAnalysis?.syntaxErrors ?? 0) > 0
                        ? 'text-red-500'
                        : 'text-green-500'
                    }`}
                  >
                    {report?.staticAnalysis?.syntaxErrors ?? 0}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Unused Variables</span>
                  <span
                    className={`font-medium ${
                      (report?.staticAnalysis?.unusedVariables ?? 0) > 0
                        ? 'text-amber-500'
                        : 'text-green-500'
                    }`}
                  >
                    {report?.staticAnalysis?.unusedVariables ?? 0}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Potential Conflicts</span>
                  <span
                    className={`font-medium ${
                      (report?.staticAnalysis?.potentialConflicts ?? 0) > 0
                        ? 'text-amber-500'
                        : 'text-green-500'
                    }`}
                  >
                    {report?.staticAnalysis?.potentialConflicts ?? 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'scenarios' && (
        <div className="bg-surface-base/50 rounded-xl border border-border">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Test Scenarios</h3>
            <button
              type="button"
              className="px-3 py-1.5 text-sm bg-card rounded-lg hover:bg-muted transition-colors flex items-center gap-2 text-foreground"
            >
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
          <div className="divide-y divide-zinc-800">
            {scenarios.map((scenario) => {
              const typeConfig = SCENARIO_TYPES[scenario.type];
              const badgeColorClasses = {
                green: 'bg-green-500/20 text-green-400',
                amber: 'bg-amber-500/20 text-amber-400',
                red: 'bg-red-500/20 text-red-400',
                purple: 'bg-purple-500/20 text-purple-400',
                blue: 'bg-blue-500/20 text-blue-400',
                cyan: 'bg-cyan-500/20 text-cyan-400',
              };

              return (
                <div
                  key={scenario.id}
                  className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => handleScenarioClick(scenario.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleScenarioClick(scenario.id);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div className="flex items-start gap-3">
                    <StatusIcon status={scenario.status} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-foreground">{scenario.name}</h4>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            badgeColorClasses[typeConfig?.color ?? 'blue']
                          }`}
                        >
                          {typeConfig?.label ?? scenario.type}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{scenario.description}</p>
                      {scenario.failureReason && (
                        <p className="text-sm text-red-400 mt-1">{scenario.failureReason}</p>
                      )}
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      {scenario.executionTimeMs}ms
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'coverage' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-surface-base/50 rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-symtex-primary" />
              Rule Coverage
            </h3>
            <div className="space-y-4">
              {[
                'customer_response_tone',
                'customer_personalization',
                'customer_next_steps',
                'customer_escalation_fallback',
              ].map((rule, idx) => (
                <div key={rule} className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="flex-1 font-mono text-sm text-foreground">{rule}</span>
                  <span className="text-sm text-muted-foreground">{[100, 100, 75, 50][idx]}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-base/50 rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-symtex-primary" />
              Uncovered Conditions
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/30">
                <p className="text-sm font-medium text-amber-300">sentiment.score == null</p>
                <p className="text-xs text-amber-400 mt-1">No scenario tests null sentiment</p>
              </div>
              <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/30">
                <p className="text-sm font-medium text-amber-300">response.attempts &gt; 2</p>
                <p className="text-xs text-amber-400 mt-1">Escalation fallback not fully tested</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'issues' && (
        <div className="bg-surface-base/50 rounded-xl border border-border">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Issues Found</h3>
          </div>
          <div className="divide-y divide-zinc-800">
            {(report?.issues ?? []).map((issue, idx) => (
              <div key={idx} className="p-4">
                <div className="flex items-start gap-3">
                  {issue.severity === 'error' ? (
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                  ) : issue.severity === 'warning' ? (
                    <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm bg-card px-2 py-0.5 rounded text-foreground">
                        {issue.ruleId}
                      </span>
                      <span className="text-sm text-muted-foreground">Line {issue.line}</span>
                    </div>
                    <p className="text-sm font-medium text-foreground">{issue.message}</p>
                    {issue.suggestion && (
                      <p className="text-sm text-muted-foreground mt-1">Suggestion: {issue.suggestion}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {(!report?.issues || report.issues.length === 0) && (
              <div className="p-8 text-center">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
                <p className="font-medium text-foreground">No issues found</p>
                <p className="text-sm text-muted-foreground mt-1">All validation checks passed</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ValidationDashboard;
