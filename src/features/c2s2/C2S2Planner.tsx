/**
 * C2S2Planner Component
 *
 * Transformation planner showing step-by-step code-to-S1 transformation plan
 * with confidence scores, warnings, and apply functionality.
 */

import { useState, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitBranch,
  Play,
  RotateCcw,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Zap,
  Shield,
  Code2,
  FileCode,
  Sparkles,
  SkipForward,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/progress';

// ============================================================================
// Types
// ============================================================================

type StepStatus = 'pending' | 'applied' | 'skipped' | 'in_progress' | 'error';

interface TransformationStep {
  id: string;
  name: string;
  description: string;
  inputPattern: string;
  outputPattern: string;
  confidence: number;
  warnings: string[];
  suggestions?: string[];
  status: StepStatus;
  estimatedTime?: string;
  affectedLines?: number;
}

interface C2S2PlannerProps {
  projectId?: string;
  className?: string;
  onApply?: (stepId: string) => void;
  onApplyAll?: () => void;
}

// ============================================================================
// Mock Data
// ============================================================================

const mockTransformationSteps: TransformationStep[] = [
  {
    id: 'step-1',
    name: 'Extract Function Signatures',
    description: 'Identify all function definitions and their parameters, converting them to S1 rule declarations with typed parameters.',
    inputPattern: 'function handleTicket(ticket, user) { ... }',
    outputPattern: '@rule handle_ticket(ticket: Ticket, user: User)',
    confidence: 95,
    warnings: [],
    suggestions: ['Consider adding return type annotation'],
    status: 'applied',
    estimatedTime: '0.3s',
    affectedLines: 12,
  },
  {
    id: 'step-2',
    name: 'Convert Control Flow to Rules',
    description: 'Transform if/else statements, loops, and conditional logic into S1 control flow directives.',
    inputPattern: 'if (priority === "high") { return ... }',
    outputPattern: '@if priority == "high" { @return ... }',
    confidence: 88,
    warnings: ['Complex nested conditions detected - review recommended'],
    suggestions: ['Consider extracting nested logic into separate rules'],
    status: 'applied',
    estimatedTime: '0.5s',
    affectedLines: 18,
  },
  {
    id: 'step-3',
    name: 'Map Variables to State',
    description: 'Convert variable declarations and assignments to S1 state bindings with proper scoping.',
    inputPattern: 'const priority = calculatePriority(ticket);',
    outputPattern: 'priority := @call calculate_priority(ticket)',
    confidence: 92,
    warnings: [],
    status: 'in_progress',
    estimatedTime: '0.4s',
    affectedLines: 8,
  },
  {
    id: 'step-4',
    name: 'Generate Audit Points',
    description: 'Automatically insert audit logging directives at key decision points and state changes.',
    inputPattern: 'await createAuditLog({ action: "ticket_created", ... })',
    outputPattern: '@audit action="ticket_created" ticketId=ticket.id ...',
    confidence: 100,
    warnings: [],
    suggestions: ['All audit points will be automatically traced in the Ledger'],
    status: 'pending',
    estimatedTime: '0.2s',
    affectedLines: 4,
  },
  {
    id: 'step-5',
    name: 'Transform Async Operations',
    description: 'Convert async/await patterns to S1 asynchronous execution directives with proper error handling.',
    inputPattern: 'const queue = await routeToQueue(priority, user.tier);',
    outputPattern: 'queue := @call route_to_queue(priority, user.tier)',
    confidence: 90,
    warnings: ['Async error handling will use default S1 patterns'],
    status: 'pending',
    estimatedTime: '0.6s',
    affectedLines: 6,
  },
  {
    id: 'step-6',
    name: 'Add Validation Directives',
    description: 'Generate @validate and @requires directives from existing validation logic.',
    inputPattern: 'if (!ticket.subject || !ticket.body) { throw ... }',
    outputPattern: '@requires ticket.subject != null\n@requires ticket.body != null',
    confidence: 96,
    warnings: [],
    status: 'pending',
    estimatedTime: '0.3s',
    affectedLines: 5,
  },
  {
    id: 'step-7',
    name: 'Generate Namespace & Metadata',
    description: 'Create S1 namespace declarations, version info, and documentation headers.',
    inputPattern: '// Customer Support Ticket Handler',
    outputPattern: '@namespace customer_support\n@version 1.0\n@description "..."',
    confidence: 100,
    warnings: [],
    status: 'pending',
    estimatedTime: '0.1s',
    affectedLines: 3,
  },
];

// ============================================================================
// Sub-components
// ============================================================================

interface StepCardProps {
  step: TransformationStep;
  isExpanded: boolean;
  onToggle: () => void;
  onApply: () => void;
  onSkip: () => void;
  isRunning: boolean;
}

const StepCard = memo(function StepCard({
  step,
  isExpanded,
  onToggle,
  onApply,
  onSkip,
  isRunning,
}: StepCardProps): JSX.Element {
  const getStatusIcon = (): JSX.Element => {
    switch (step.status) {
      case 'applied':
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      case 'skipped':
        return <SkipForward className="w-5 h-5 text-muted-foreground" />;
      case 'in_progress':
        return (
          <div className="w-5 h-5 rounded-full border-2 border-symtex-primary border-t-transparent animate-spin" />
        );
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-error" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (): JSX.Element => {
    switch (step.status) {
      case 'applied':
        return <Badge className="bg-success/20 text-success border-success/30">Applied</Badge>;
      case 'skipped':
        return <Badge variant="outline" className="text-muted-foreground">Skipped</Badge>;
      case 'in_progress':
        return <Badge className="bg-symtex-primary/20 text-symtex-primary border-symtex-primary/30">In Progress</Badge>;
      case 'error':
        return <Badge className="bg-error/20 text-error border-error/30">Error</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 95) return 'text-success';
    if (confidence >= 85) return 'text-symtex-primary';
    if (confidence >= 70) return 'text-warning';
    return 'text-error';
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'border rounded-xl overflow-hidden transition-colors',
        step.status === 'in_progress' && 'border-symtex-primary/50 bg-symtex-primary/5',
        step.status === 'applied' && 'border-success/30 bg-success/5',
        step.status === 'error' && 'border-error/30 bg-error/5',
        step.status === 'pending' && 'border-border',
        step.status === 'skipped' && 'border-border opacity-60'
      )}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted/30 transition-colors"
      >
        {getStatusIcon()}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">{step.name}</span>
            {getStatusBadge()}
          </div>
          <p className="text-sm text-muted-foreground truncate mt-0.5">
            {step.description}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className={cn('text-sm font-medium', getConfidenceColor(step.confidence))}>
              {step.confidence}%
            </p>
            <p className="text-xs text-muted-foreground">confidence</p>
          </div>
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 pb-4 space-y-4 border-t border-border pt-4">
              {/* Pattern Transformation */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FileCode className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Input Pattern
                    </span>
                  </div>
                  <pre className="text-xs font-mono text-foreground whitespace-pre-wrap">
                    {step.inputPattern}
                  </pre>
                </div>
                <div className="p-3 bg-symtex-primary/10 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Code2 className="w-4 h-4 text-symtex-primary" />
                    <span className="text-xs font-medium text-symtex-primary uppercase tracking-wider">
                      Output Pattern
                    </span>
                  </div>
                  <pre className="text-xs font-mono text-foreground whitespace-pre-wrap">
                    {step.outputPattern}
                  </pre>
                </div>
              </div>

              {/* Warnings */}
              {step.warnings.length > 0 && (
                <div className="p-3 bg-warning/10 border border-warning/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-warning" />
                    <span className="text-xs font-medium text-warning uppercase tracking-wider">
                      Warnings
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {step.warnings.map((warning, idx) => (
                      <li key={idx} className="text-sm text-foreground flex items-start gap-2">
                        <span className="text-warning mt-0.5">-</span>
                        {warning}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Suggestions */}
              {step.suggestions && step.suggestions.length > 0 && (
                <div className="p-3 bg-symtex-accent/10 border border-symtex-accent/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-symtex-accent" />
                    <span className="text-xs font-medium text-symtex-accent uppercase tracking-wider">
                      Suggestions
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {step.suggestions.map((suggestion, idx) => (
                      <li key={idx} className="text-sm text-foreground flex items-start gap-2">
                        <span className="text-symtex-accent mt-0.5">-</span>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Meta Info */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  {step.estimatedTime && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Est. {step.estimatedTime}
                    </span>
                  )}
                  {step.affectedLines && (
                    <span className="flex items-center gap-1">
                      <FileCode className="w-3.5 h-3.5" />
                      {step.affectedLines} lines affected
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              {step.status === 'pending' && (
                <div className="flex items-center gap-2 pt-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={onApply}
                    disabled={isRunning}
                    leftIcon={<Play className="w-4 h-4" />}
                  >
                    Apply Step
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onSkip}
                    disabled={isRunning}
                    leftIcon={<SkipForward className="w-4 h-4" />}
                  >
                    Skip
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

// ============================================================================
// Main Component
// ============================================================================

function C2S2Planner({
  projectId: _projectId,
  className,
  onApply,
  onApplyAll,
}: C2S2PlannerProps): JSX.Element {
  const [steps, setSteps] = useState<TransformationStep[]>(mockTransformationSteps);
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set(['step-3']));
  const [isRunning, setIsRunning] = useState(false);
  const [isAutoMode, setIsAutoMode] = useState(false);

  const appliedCount = steps.filter((s) => s.status === 'applied').length;
  const pendingCount = steps.filter((s) => s.status === 'pending').length;
  const totalSteps = steps.length;
  const overallProgress = Math.round((appliedCount / totalSteps) * 100);
  const avgConfidence = Math.round(
    steps.reduce((sum, s) => sum + s.confidence, 0) / totalSteps
  );

  const handleToggleStep = useCallback((stepId: string) => {
    setExpandedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(stepId)) {
        next.delete(stepId);
      } else {
        next.add(stepId);
      }
      return next;
    });
  }, []);

  const handleApplyStep = useCallback(async (stepId: string) => {
    setIsRunning(true);
    setSteps((prev) =>
      prev.map((s) =>
        s.id === stepId ? { ...s, status: 'in_progress' as StepStatus } : s
      )
    );

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setSteps((prev) =>
      prev.map((s) =>
        s.id === stepId ? { ...s, status: 'applied' as StepStatus } : s
      )
    );
    setIsRunning(false);
    onApply?.(stepId);
  }, [onApply]);

  const handleSkipStep = useCallback((stepId: string) => {
    setSteps((prev) =>
      prev.map((s) =>
        s.id === stepId ? { ...s, status: 'skipped' as StepStatus } : s
      )
    );
  }, []);

  const handleApplyAll = useCallback(async () => {
    setIsAutoMode(true);
    setIsRunning(true);

    for (const step of steps) {
      if (step.status === 'pending') {
        setSteps((prev) =>
          prev.map((s) =>
            s.id === step.id ? { ...s, status: 'in_progress' as StepStatus } : s
          )
        );
        await new Promise((resolve) => setTimeout(resolve, 800));
        setSteps((prev) =>
          prev.map((s) =>
            s.id === step.id ? { ...s, status: 'applied' as StepStatus } : s
          )
        );
      }
    }

    setIsRunning(false);
    setIsAutoMode(false);
    onApplyAll?.();
  }, [steps, onApplyAll]);

  const handleReset = useCallback(() => {
    setSteps(mockTransformationSteps);
    setIsRunning(false);
    setIsAutoMode(false);
  }, []);

  return (
    <div className={cn('flex flex-col h-full bg-card rounded-xl border border-border overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-symtex-primary" />
            <h2 className="text-sm font-semibold text-foreground">Transformation Planner</h2>
          </div>
          <Badge className="bg-symtex-accent/20 text-symtex-accent border-symtex-accent/30 text-[10px]">
            DEMO MODE
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleReset}
            disabled={isRunning}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon-sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="px-4 py-3 border-b border-border bg-muted/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            Transformation Progress
          </span>
          <span className="text-sm text-muted-foreground">
            {appliedCount} of {totalSteps} steps completed
          </span>
        </div>
        <Progress value={overallProgress} className="h-2" />
        <div className="flex items-center justify-between mt-3 text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-success" />
              <span className="text-muted-foreground">{appliedCount} Applied</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">{pendingCount} Pending</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-symtex-primary" />
            <span className="text-muted-foreground">
              Avg. Confidence: <span className="text-symtex-primary font-medium">{avgConfidence}%</span>
            </span>
          </div>
        </div>
      </div>

      {/* Steps List */}
      <div className="flex-1 overflow-auto p-4 space-y-3">
        {steps.map((step) => (
          <StepCard
            key={step.id}
            step={step}
            isExpanded={expandedSteps.has(step.id)}
            onToggle={() => handleToggleStep(step.id)}
            onApply={() => handleApplyStep(step.id)}
            onSkip={() => handleSkipStep(step.id)}
            isRunning={isRunning}
          />
        ))}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {isAutoMode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-symtex-primary animate-pulse" />
              <span>Auto-applying transformations...</span>
            </motion.div>
          )}
          {!isAutoMode && (
            <span>
              <Zap className="w-3.5 h-3.5 inline mr-1" />
              {pendingCount} step{pendingCount !== 1 ? 's' : ''} remaining
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleApplyAll}
            disabled={isRunning || pendingCount === 0}
            leftIcon={isRunning ? undefined : <Play className="w-4 h-4" />}
            isLoading={isRunning}
          >
            {isRunning ? 'Applying...' : 'Apply All Steps'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default memo(C2S2Planner);
export type { C2S2PlannerProps, TransformationStep, StepStatus };
