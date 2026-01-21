/**
 * ScenarioCard Component
 *
 * Displays a single validation scenario with its status, type, description,
 * and execution details. Supports click interaction for detailed view.
 *
 * @module cognate/validation/ScenarioCard
 */

import { useCallback } from 'react';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  MinusCircle,
} from 'lucide-react';
import type {
  ValidationScenario,
  ValidationStatus,
  ScenarioType,
} from './types';
import {
  VALIDATION_STATUSES,
  SCENARIO_TYPES,
  SCENARIO_COLOR_CLASSES,
  STATUS_COLOR_CLASSES,
} from './types';

// =============================================================================
// Types
// =============================================================================

/**
 * Props for the ScenarioCard component.
 */
export interface ScenarioCardProps {
  /** The validation scenario to display */
  scenario: ValidationScenario;
  /** Callback when card is clicked */
  onClick?: (scenarioId: string) => void;
  /** Whether the card is in a compact view */
  compact?: boolean;
  /** Whether to show execution time */
  showExecutionTime?: boolean;
  /** Additional CSS classes */
  className?: string;
}

// =============================================================================
// Helper Components
// =============================================================================

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
  const colorClasses = STATUS_COLOR_CLASSES[config.color];

  switch (status) {
    case 'passed':
      return <CheckCircle className={`${className} ${colorClasses.text}`} />;
    case 'failed':
      return <XCircle className={`${className} ${colorClasses.text}`} />;
    case 'warning':
      return <AlertTriangle className={`${className} ${colorClasses.text}`} />;
    case 'skipped':
      return <MinusCircle className={`${className} ${colorClasses.text}`} />;
    default:
      return <Clock className={`${className} ${colorClasses.text}`} />;
  }
}

/**
 * Badge displaying the scenario type.
 */
function TypeBadge({
  type,
  className = '',
}: {
  type: ScenarioType;
  className?: string;
}): JSX.Element {
  const config = SCENARIO_TYPES[type];
  const colorClasses = SCENARIO_COLOR_CLASSES[config.color];

  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full ${colorClasses.bgLight} ${colorClasses.text} ${className}`}
    >
      {config.label}
    </span>
  );
}

// =============================================================================
// Main Component
// =============================================================================

/**
 * ScenarioCard displays a validation scenario with status, type, and details.
 *
 * @example
 * ```tsx
 * <ScenarioCard
 *   scenario={myScenario}
 *   onClick={(id) => navigate(`/scenarios/${id}`)}
 *   showExecutionTime
 * />
 * ```
 */
export function ScenarioCard({
  scenario,
  onClick,
  compact = false,
  showExecutionTime = true,
  className = '',
}: ScenarioCardProps): JSX.Element {
  const handleClick = useCallback(() => {
    onClick?.(scenario.id);
  }, [onClick, scenario.id]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick?.(scenario.id);
      }
    },
    [onClick, scenario.id]
  );

  const isClickable = !!onClick;

  return (
    <div
      className={`
        p-4 transition-colors
        ${isClickable ? 'hover:bg-muted/50 cursor-pointer' : ''}
        ${className}
      `}
      onClick={isClickable ? handleClick : undefined}
      onKeyDown={isClickable ? handleKeyDown : undefined}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
    >
      <div className="flex items-start gap-3">
        <StatusIcon status={scenario.status} className={compact ? 'w-4 h-4' : 'w-5 h-5'} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h4 className={`font-medium text-foreground truncate ${compact ? 'text-sm' : ''}`}>
              {scenario.name}
            </h4>
            <TypeBadge type={scenario.type} />
          </div>

          {!compact && (
            <p className="text-sm text-muted-foreground line-clamp-2">{scenario.description}</p>
          )}

          {scenario.failureReason && (
            <p className={`text-red-400 mt-1 ${compact ? 'text-xs' : 'text-sm'}`}>
              {scenario.failureReason}
            </p>
          )}

          {scenario.warningReason && !scenario.failureReason && (
            <p className={`text-amber-400 mt-1 ${compact ? 'text-xs' : 'text-sm'}`}>
              {scenario.warningReason}
            </p>
          )}
        </div>

        {showExecutionTime && (
          <div className={`text-right text-muted-foreground whitespace-nowrap ${compact ? 'text-xs' : 'text-sm'}`}>
            {scenario.executionTimeMs}ms
          </div>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// List Component
// =============================================================================

/**
 * Props for the ScenarioList component.
 */
export interface ScenarioListProps {
  /** Scenarios to display */
  scenarios: ValidationScenario[];
  /** Callback when a scenario is clicked */
  onScenarioClick?: (scenarioId: string) => void;
  /** Filter by status */
  statusFilter?: ValidationStatus;
  /** Whether to use compact view */
  compact?: boolean;
  /** Empty state message */
  emptyMessage?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * ScenarioList renders a list of scenario cards with optional filtering.
 */
export function ScenarioList({
  scenarios,
  onScenarioClick,
  statusFilter,
  compact = false,
  emptyMessage = 'No scenarios found',
  className = '',
}: ScenarioListProps): JSX.Element {
  const filteredScenarios = statusFilter
    ? scenarios.filter((s) => s.status === statusFilter)
    : scenarios;

  if (filteredScenarios.length === 0) {
    return (
      <div className={`p-8 text-center ${className}`}>
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`divide-y divide-border ${className}`}>
      {filteredScenarios.map((scenario) => (
        <ScenarioCard
          key={scenario.id}
          scenario={scenario}
          onClick={onScenarioClick}
          compact={compact}
        />
      ))}
    </div>
  );
}

export default ScenarioCard;
