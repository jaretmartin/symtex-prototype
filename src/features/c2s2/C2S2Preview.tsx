/**
 * C2S2 Preview Component
 *
 * Displays a side-by-side comparison of original JavaScript code
 * and its transformed S1 / Symtex Script equivalent with diff highlighting,
 * metrics summary, and action buttons.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import {
  Check,
  Edit3,
  Download,
  X,
  Code2,
  FileCode,
  TrendingDown,
  Shield,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
interface TransformationMetrics {
  linesOriginal: number;
  linesTransformed: number;
  complexityOriginal: number;
  complexityTransformed: number;
  auditPointsAdded: number;
}

interface C2S2PreviewProps {
  transformationId: string;
  onAccept?: () => void;
  onEdit?: () => void;
  onExport?: () => void;
  onCancel?: () => void;
  className?: string;
}

// Mock preview data for demonstration
const mockPreviewData = {
  originalCode: `function handleTicket(ticket, user) {
  if (ticket.priority === 'high') {
    return escalate(ticket, user);
  }
  if (ticket.status === 'pending') {
    if (user.role === 'admin') {
      return approve(ticket);
    }
    return queue(ticket);
  }
  return processNormal(ticket);
}`,
  transformedS1: `@rule handle_ticket
@input ticket: Ticket, user: User
@audit entry_point

@when ticket.priority == 'high'
  @action escalate
  @audit escalation_triggered

@when ticket.status == 'pending'
  @when user.role == 'admin'
    @action approve
    @audit admin_approval
  @otherwise
    @action queue
    @audit queued_for_review

@otherwise
  @action process_normal`,
  metrics: {
    linesOriginal: 45,
    linesTransformed: 28,
    complexityOriginal: 12,
    complexityTransformed: 5,
    auditPointsAdded: 8,
  } as TransformationMetrics,
};

// Helper to render code with diff-style highlighting
function CodeBlock({
  code,
  language,
  variant,
}: {
  code: string;
  language: string;
  variant: 'original' | 'transformed';
}): JSX.Element {
  const lines = code.trim().split('\n');
  const prefix = variant === 'original' ? '-' : '+';
  const bgColor = variant === 'original' ? 'bg-red-500/5' : 'bg-green-500/5';
  const lineColor = variant === 'original' ? 'text-red-400' : 'text-green-400';
  const borderColor = variant === 'original' ? 'border-red-500/20' : 'border-green-500/20';

  return (
    <div className={cn('rounded-lg border overflow-hidden', borderColor, bgColor)}>
      <div className="flex items-center justify-between px-3 py-2 border-b border-border/50 bg-muted/30">
        <div className="flex items-center gap-2">
          {variant === 'original' ? (
            <Code2 className="w-4 h-4 text-muted-foreground" />
          ) : (
            <FileCode className="w-4 h-4 text-symtex-primary" />
          )}
          <span className="text-xs font-medium text-muted-foreground">
            {language}
          </span>
        </div>
        <Badge
          variant="outline"
          className={cn(
            'text-xs',
            variant === 'original' ? 'text-red-400 border-red-500/30' : 'text-green-400 border-green-500/30'
          )}
        >
          {variant === 'original' ? 'Before' : 'After'}
        </Badge>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm font-mono">
          {lines.map((line, i) => (
            <div key={i} className="flex">
              <span className={cn('w-6 select-none opacity-50', lineColor)}>
                {prefix}
              </span>
              <span className={cn('flex-1', variant === 'transformed' && 'text-foreground')}>
                {line}
              </span>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}

// Metric display component
function MetricItem({
  icon: Icon,
  label,
  before,
  after,
  suffix = '',
  improvement,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  before: number;
  after: number;
  suffix?: string;
  improvement?: string;
}): JSX.Element {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
      <div className="p-2 rounded-lg bg-symtex-primary/10">
        <Icon className="w-4 h-4 text-symtex-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-mono text-red-400 line-through">
            {before}{suffix}
          </span>
          <span className="text-muted-foreground">→</span>
          <span className="text-sm font-mono text-green-400 font-medium">
            {after}{suffix}
          </span>
          {improvement && (
            <span className="text-xs text-green-400">({improvement})</span>
          )}
        </div>
      </div>
    </div>
  );
}

export function C2S2Preview({
  transformationId,
  onAccept,
  onEdit,
  onExport,
  onCancel,
  className,
}: C2S2PreviewProps): JSX.Element {
  const [isAccepting, setIsAccepting] = useState(false);

  // Calculate percentage reductions
  const linesReduction = Math.round(
    ((mockPreviewData.metrics.linesOriginal - mockPreviewData.metrics.linesTransformed) /
      mockPreviewData.metrics.linesOriginal) *
      100
  );
  const complexityReduction = Math.round(
    ((mockPreviewData.metrics.complexityOriginal - mockPreviewData.metrics.complexityTransformed) /
      mockPreviewData.metrics.complexityOriginal) *
      100
  );

  const handleAccept = (): void => {
    setIsAccepting(true);
    // Simulate async operation
    setTimeout(() => {
      setIsAccepting(false);
      onAccept?.();
    }, 1000);
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Demo Mode Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center gap-2 p-2 rounded-lg bg-symtex-gold/10 border border-symtex-gold/30"
      >
        <Sparkles className="w-4 h-4 text-symtex-gold" />
        <span className="text-sm font-medium text-symtex-gold">DEMO MODE</span>
        <span className="text-xs text-symtex-gold/70">
          - Transformation ID: {transformationId}
        </span>
      </motion.div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Transformation Preview
          </h2>
          <p className="text-sm text-muted-foreground">
            Review the code transformation before accepting
          </p>
        </div>
      </div>

      {/* Side-by-side Code Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <CodeBlock
            code={mockPreviewData.originalCode}
            language="Original JavaScript"
            variant="original"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <CodeBlock
            code={mockPreviewData.transformedS1}
            language="S1 / Symtex Script"
            variant="transformed"
          />
        </motion.div>
      </div>

      {/* Metrics Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-green-400" />
              Transformation Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MetricItem
                icon={Code2}
                label="Lines of Code"
                before={mockPreviewData.metrics.linesOriginal}
                after={mockPreviewData.metrics.linesTransformed}
                improvement={`-${linesReduction}%`}
              />
              <MetricItem
                icon={FileCode}
                label="Complexity Score"
                before={mockPreviewData.metrics.complexityOriginal}
                after={mockPreviewData.metrics.complexityTransformed}
                improvement={`-${complexityReduction}%`}
              />
              <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <Shield className="w-4 h-4 text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Audit Points</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-mono text-green-400 font-semibold">
                      +{mockPreviewData.metrics.auditPointsAdded}
                    </span>
                    <span className="text-xs text-green-400">added</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-wrap items-center gap-3 pt-4 border-t border-border"
      >
        <Button
          variant="primary"
          onClick={handleAccept}
          isLoading={isAccepting}
          leftIcon={<Check className="w-4 h-4" />}
        >
          Accept & Save
        </Button>
        <Button
          variant="secondary"
          onClick={onEdit}
          leftIcon={<Edit3 className="w-4 h-4" />}
        >
          Edit S1
        </Button>
        <Button
          variant="secondary"
          onClick={onExport}
          leftIcon={<Download className="w-4 h-4" />}
        >
          Export
        </Button>
        <div className="flex-1" />
        <Button
          variant="ghost"
          onClick={onCancel}
          leftIcon={<X className="w-4 h-4" />}
        >
          Cancel
        </Button>
      </motion.div>
    </div>
  );
}

// Export types for external use
export type { C2S2PreviewProps, TransformationMetrics };
