/**
 * RunReview Component
 *
 * Shows run results after execution:
 * - Execution summary
 * - Step-by-step trace
 * - Output data
 * - Pattern compilation trigger
 *
 * Part of WF2: Automation -> Plan -> Simulate -> Run -> Review -> Compile
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  ExternalLink,
  FileText,
  Sparkles,
  BookOpen,
  ChevronDown,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Types for run results
export interface RunStep {
  id: string;
  name: string;
  status: 'success' | 'warning' | 'error' | 'skipped';
  startedAt: Date;
  completedAt: Date;
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
  error?: string;
  cognateId?: string;
  cognateName?: string;
}

export interface RunResult {
  runId: string;
  automationId: string;
  automationName: string;
  status: 'success' | 'partial' | 'failed';
  startedAt: Date;
  completedAt: Date;
  steps: RunStep[];
  totalCost: number;
  outputSummary?: string;
  canCompilePattern: boolean;
  patternSuggestion?: string;
}

interface RunReviewProps {
  result: RunResult;
  onCompilePattern: () => void;
  onRunAgain: () => void;
  onClose: () => void;
  isCompiling?: boolean;
  className?: string;
}

const statusConfig = {
  success: {
    icon: <CheckCircle className="w-5 h-5 text-emerald-400" />,
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    label: 'Completed',
  },
  partial: {
    icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    label: 'Partial Success',
  },
  failed: {
    icon: <XCircle className="w-5 h-5 text-red-400" />,
    badge: 'bg-red-500/10 text-red-400 border-red-500/30',
    label: 'Failed',
  },
};

const stepStatusIcons: Record<RunStep['status'], React.ReactNode> = {
  success: <CheckCircle className="w-4 h-4 text-emerald-400" />,
  warning: <AlertTriangle className="w-4 h-4 text-amber-400" />,
  error: <XCircle className="w-4 h-4 text-red-400" />,
  skipped: <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />,
};

export function RunReview({
  result,
  onCompilePattern,
  onRunAgain,
  onClose,
  isCompiling = false,
  className,
}: RunReviewProps): JSX.Element {
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());
  const config = statusConfig[result.status];

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

  function formatDuration(start: Date, end: Date): string {
    const ms = end.getTime() - start.getTime();
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    const mins = Math.floor(ms / 60000);
    const secs = Math.round((ms % 60000) / 1000);
    return `${mins}m ${secs}s`;
  }

  function formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 4,
    }).format(amount);
  }

  const successCount = result.steps.filter((s) => s.status === 'success').length;
  const errorCount = result.steps.filter((s) => s.status === 'error').length;

  return (
    <Card className={cn('bg-card/50 border-border/50', className)}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {config.icon}
            <div>
              <CardTitle className="text-lg font-semibold text-foreground">
                Run Complete
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {result.automationName}
              </p>
            </div>
          </div>
          <Badge variant="outline" className={cn('capitalize', config.badge)}>
            {config.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="p-3 rounded-lg bg-surface-base/50 border border-border/50">
            <p className="text-xs text-muted-foreground">Duration</p>
            <p className="text-lg font-semibold text-foreground">
              {formatDuration(result.startedAt, result.completedAt)}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-surface-base/50 border border-border/50">
            <p className="text-xs text-muted-foreground">Steps</p>
            <p className="text-lg font-semibold text-foreground">
              {successCount}/{result.steps.length}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-surface-base/50 border border-border/50">
            <p className="text-xs text-muted-foreground">Cost</p>
            <p className="text-lg font-semibold text-foreground">
              {formatCurrency(result.totalCost)}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-surface-base/50 border border-border/50">
            <p className="text-xs text-muted-foreground">Errors</p>
            <p
              className={cn(
                'text-lg font-semibold',
                errorCount > 0 ? 'text-red-400' : 'text-emerald-400'
              )}
            >
              {errorCount}
            </p>
          </div>
        </div>

        {/* Output Summary */}
        {result.outputSummary && (
          <div className="p-4 rounded-lg bg-surface-base/50 border border-border/50">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              Output Summary
            </h4>
            <p className="text-sm text-muted-foreground">{result.outputSummary}</p>
          </div>
        )}

        {/* Execution Steps */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">
            Execution Trace
          </h4>
          <div className="space-y-2">
            {result.steps.map((step, index) => (
              <div
                key={step.id}
                className="border border-border/50 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleStep(step.id)}
                  className="w-full flex items-center justify-between p-3 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-6">
                      {index + 1}.
                    </span>
                    {stepStatusIcons[step.status]}
                    <div className="text-left">
                      <span className="text-sm font-medium text-foreground">
                        {step.name}
                      </span>
                      {step.cognateName && (
                        <span className="text-xs text-muted-foreground ml-2">
                          via {step.cognateName}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {formatDuration(step.startedAt, step.completedAt)}
                    </span>
                    {expandedSteps.has(step.id) ? (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {expandedSteps.has(step.id) && (
                  <div className="px-3 pb-3 border-t border-border/50 bg-surface-base/30">
                    <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Started: {formatTime(step.startedAt)}</span>
                      <span>Completed: {formatTime(step.completedAt)}</span>
                    </div>

                    {step.error && (
                      <div className="mt-3 p-2 rounded bg-red-500/10 border border-red-500/30">
                        <p className="text-sm text-red-400">{step.error}</p>
                      </div>
                    )}

                    {(step.input || step.output) && (
                      <div className="mt-3 grid grid-cols-2 gap-4">
                        {step.input && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">
                              Input
                            </p>
                            <pre className="text-xs bg-muted/50 p-2 rounded overflow-x-auto max-h-32">
                              {JSON.stringify(step.input, null, 2)}
                            </pre>
                          </div>
                        )}
                        {step.output && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">
                              Output
                            </p>
                            <pre className="text-xs bg-muted/50 p-2 rounded overflow-x-auto max-h-32">
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

        {/* Pattern Compilation Suggestion */}
        {result.canCompilePattern && (
          <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/30">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-purple-300">
                  Pattern Compilation Available
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {result.patternSuggestion ||
                    'This run can be compiled into a deterministic S1 pattern for faster, cheaper execution.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Links */}
        <div className="flex items-center gap-4">
          <Link
            to={`/runs/${result.runId}/trace`}
            className="flex items-center gap-2 text-sm text-symtex-primary hover:text-symtex-primary/80 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View Full Trace
          </Link>
          <Link
            to="/control/ledger"
            className="flex items-center gap-2 text-sm text-symtex-primary hover:text-symtex-primary/80 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            View in Ledger
          </Link>
        </div>
      </CardContent>

      <CardFooter className="flex gap-3 pt-4 border-t border-border/50">
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
        <div className="flex-1" />
        <Button variant="secondary" onClick={onRunAgain}>
          <RotateCcw className="w-4 h-4" />
          Run Again
        </Button>
        {result.canCompilePattern && (
          <Button
            variant="primary"
            onClick={onCompilePattern}
            isLoading={isCompiling}
          >
            <Sparkles className="w-4 h-4" />
            Compile Pattern
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default RunReview;
