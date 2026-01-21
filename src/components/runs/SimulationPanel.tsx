/**
 * SimulationPanel Component
 *
 * Shows simulation results before actually running an automation.
 * Displays:
 * - Simulated execution steps
 * - Expected outputs
 * - Potential issues/warnings
 * - Dry-run data transformations
 *
 * Part of WF2: Automation -> Plan -> Simulate -> Run -> Review -> Compile
 */

import { useState, useEffect } from 'react';
import {
  FlaskConical,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Play,
  RotateCcw,
  ChevronDown,
  ChevronRight,
  FileText,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

// Types for simulation
export interface SimulationStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'success' | 'warning' | 'error';
  duration?: number; // milliseconds
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
  message?: string;
}

export interface SimulationWarning {
  id: string;
  severity: 'info' | 'warning' | 'error';
  message: string;
  suggestion?: string;
}

export interface SimulationResult {
  automationId: string;
  status: 'pending' | 'running' | 'success' | 'partial' | 'failed';
  steps: SimulationStep[];
  warnings: SimulationWarning[];
  totalDuration: number;
  completedAt?: Date;
}

interface SimulationPanelProps {
  result: SimulationResult;
  onRunForReal: () => void;
  onReSimulate: () => void;
  onCancel: () => void;
  isRunning?: boolean;
  className?: string;
}

const statusIcons: Record<SimulationStep['status'], React.ReactNode> = {
  pending: <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />,
  running: (
    <div className="w-4 h-4 rounded-full border-2 border-symtex-primary border-t-transparent animate-spin" />
  ),
  success: <CheckCircle className="w-4 h-4 text-emerald-400" />,
  warning: <AlertTriangle className="w-4 h-4 text-amber-400" />,
  error: <XCircle className="w-4 h-4 text-red-400" />,
};

const severityColors: Record<SimulationWarning['severity'], string> = {
  info: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  error: 'bg-red-500/10 text-red-400 border-red-500/30',
};

const severityIcons: Record<SimulationWarning['severity'], React.ReactNode> = {
  info: <FileText className="w-4 h-4 text-blue-400" />,
  warning: <AlertTriangle className="w-4 h-4 text-amber-400" />,
  error: <XCircle className="w-4 h-4 text-red-400" />,
};

export function SimulationPanel({
  result,
  onRunForReal,
  onReSimulate,
  onCancel,
  isRunning = false,
  className,
}: SimulationPanelProps): JSX.Element {
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());
  const [progress, setProgress] = useState(0);

  // Calculate progress
  useEffect(() => {
    const completedSteps = result.steps.filter(
      (s) => s.status === 'success' || s.status === 'warning' || s.status === 'error'
    ).length;
    const totalSteps = result.steps.length;
    setProgress(totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0);
  }, [result.steps]);

  const toggleStep = (stepId: string): void => {
    setExpandedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(stepId)) {
        next.delete(stepId);
      } else {
        next.add(stepId);
      }
      return next;
    });
  };

  const canRunForReal =
    result.status === 'success' ||
    (result.status === 'partial' &&
      result.warnings.filter((w) => w.severity === 'error').length === 0);

  const errorCount = result.warnings.filter((w) => w.severity === 'error').length;
  const warningCount = result.warnings.filter((w) => w.severity === 'warning').length;

  function formatDuration(ms: number): string {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  }

  return (
    <Card className={cn('bg-card/50 border-border/50', className)}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-purple-400" />
              Simulation Results
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Dry-run completed - review before executing
            </p>
          </div>
          <Badge
            variant="outline"
            className={cn(
              'capitalize',
              result.status === 'success' && 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
              result.status === 'partial' && 'bg-amber-500/10 text-amber-400 border-amber-500/30',
              result.status === 'failed' && 'bg-red-500/10 text-red-400 border-red-500/30',
              result.status === 'running' && 'bg-symtex-primary/10 text-symtex-primary border-symtex-primary/30',
              result.status === 'pending' && 'bg-muted text-muted-foreground border-border'
            )}
          >
            {result.status}
          </Badge>
        </div>

        {/* Progress bar */}
        {(result.status === 'running' || result.status === 'pending') && (
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round(progress)}% complete
            </p>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Execution Steps */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">
            Execution Steps
          </h4>
          <div className="space-y-2">
            {result.steps.map((step, index) => (
              <div key={step.id} className="border border-border/50 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleStep(step.id)}
                  className="w-full flex items-center justify-between p-3 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-6">
                      {index + 1}.
                    </span>
                    {statusIcons[step.status]}
                    <span className="text-sm font-medium text-foreground">
                      {step.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {step.duration !== undefined && (
                      <span className="text-xs text-muted-foreground">
                        {formatDuration(step.duration)}
                      </span>
                    )}
                    {expandedSteps.has(step.id) ? (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {expandedSteps.has(step.id) && (
                  <div className="px-3 pb-3 border-t border-border/50 bg-surface-base/30">
                    {step.message && (
                      <p className="text-sm text-muted-foreground mt-3">
                        {step.message}
                      </p>
                    )}
                    {(step.input || step.output) && (
                      <div className="mt-3 flex items-start gap-4">
                        {step.input && (
                          <div className="flex-1">
                            <p className="text-xs font-medium text-muted-foreground mb-1">
                              Input
                            </p>
                            <pre className="text-xs bg-muted/50 p-2 rounded overflow-x-auto">
                              {JSON.stringify(step.input, null, 2)}
                            </pre>
                          </div>
                        )}
                        {step.input && step.output && (
                          <ArrowRight className="w-4 h-4 text-muted-foreground mt-6" />
                        )}
                        {step.output && (
                          <div className="flex-1">
                            <p className="text-xs font-medium text-muted-foreground mb-1">
                              Output
                            </p>
                            <pre className="text-xs bg-muted/50 p-2 rounded overflow-x-auto">
                              {JSON.stringify(step.output, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Warnings and Errors */}
        {result.warnings.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2 mb-3">
              Issues Found
              {errorCount > 0 && (
                <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/30 text-xs">
                  {errorCount} error{errorCount > 1 ? 's' : ''}
                </Badge>
              )}
              {warningCount > 0 && (
                <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30 text-xs">
                  {warningCount} warning{warningCount > 1 ? 's' : ''}
                </Badge>
              )}
            </h4>
            <div className="space-y-2">
              {result.warnings.map((warning) => (
                <div
                  key={warning.id}
                  className={cn(
                    'p-3 rounded-lg border',
                    severityColors[warning.severity]
                  )}
                >
                  <div className="flex items-start gap-3">
                    {severityIcons[warning.severity]}
                    <div>
                      <p className="text-sm">{warning.message}</p>
                      {warning.suggestion && (
                        <p className="text-xs mt-1 opacity-80">
                          Suggestion: {warning.suggestion}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-surface-base/50 border border-border/50">
          <span className="text-sm text-muted-foreground">
            Total Simulation Time
          </span>
          <span className="text-sm font-medium text-foreground">
            {formatDuration(result.totalDuration)}
          </span>
        </div>
      </CardContent>

      <CardFooter className="flex gap-3 pt-4 border-t border-border/50">
        <Button variant="ghost" onClick={onCancel} disabled={isRunning}>
          Cancel
        </Button>
        <div className="flex-1" />
        <Button
          variant="secondary"
          onClick={onReSimulate}
          disabled={isRunning || result.status === 'running'}
        >
          <RotateCcw className="w-4 h-4" />
          Re-simulate
        </Button>
        <Button
          variant="primary"
          onClick={onRunForReal}
          disabled={!canRunForReal || isRunning}
          isLoading={isRunning}
        >
          <Play className="w-4 h-4" />
          Run For Real
        </Button>
      </CardFooter>
    </Card>
  );
}

export default SimulationPanel;
