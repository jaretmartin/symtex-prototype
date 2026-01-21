/**
 * SymbiosRoutingIndicator Component
 *
 * Visual indicator showing whether a message was routed through the
 * symbolic Core (fast, pattern-based) or neural Conductor (LLM).
 * This is a key differentiator for Symtex, showing cost and latency benefits.
 */

import { Zap, Brain, Clock, DollarSign, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SymbiosRouting } from './symbios-store';

interface SymbiosRoutingIndicatorProps {
  routing: SymbiosRouting;
  className?: string;
  variant?: 'default' | 'compact' | 'detailed';
}

export function SymbiosRoutingIndicator({
  routing,
  className,
  variant = 'default',
}: SymbiosRoutingIndicatorProps): JSX.Element {
  const isSymbolic = routing.type === 'symbolic';

  // Format cost for display
  const formatCost = (cost: number): string => {
    if (cost < 0.01) {
      return `~$${cost.toFixed(3)}`;
    }
    return `~$${cost.toFixed(2)}`;
  };

  // Format latency for display
  const formatLatency = (ms: number): string => {
    if (ms < 1000) {
      return `${Math.round(ms)}ms`;
    }
    return `${(ms / 1000).toFixed(1)}s`;
  };

  if (variant === 'compact') {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-1 text-xs',
          isSymbolic ? 'text-emerald-400' : 'text-violet-400',
          className
        )}
        title={isSymbolic ? 'Routed via Core (Symbolic)' : 'Routed via Conductor (Neural)'}
      >
        {isSymbolic ? (
          <Zap className="w-3 h-3" />
        ) : (
          <Brain className="w-3 h-3" />
        )}
        <span>{isSymbolic ? 'Core' : 'Conductor'}</span>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div
        className={cn(
          'rounded-lg border p-3 space-y-2',
          isSymbolic
            ? 'bg-emerald-500/5 border-emerald-500/20'
            : 'bg-violet-500/5 border-violet-500/20',
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div
            className={cn(
              'flex items-center gap-2 font-medium',
              isSymbolic ? 'text-emerald-400' : 'text-violet-400'
            )}
          >
            {isSymbolic ? (
              <>
                <Zap className="w-4 h-4" />
                <span>Core (Symbolic)</span>
              </>
            ) : (
              <>
                <Brain className="w-4 h-4" />
                <span>Conductor (Neural)</span>
              </>
            )}
          </div>
          {routing.confidence && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <CheckCircle2 className="w-3 h-3" />
              <span>{Math.round(routing.confidence * 100)}% confidence</span>
            </div>
          )}
        </div>

        {/* Pattern info */}
        {routing.patternId && (
          <div className="text-xs text-muted-foreground">
            <span className="text-muted-foreground">Pattern: </span>
            <span className="font-mono text-foreground">{routing.patternId}</span>
            {routing.patternName && (
              <span className="text-muted-foreground"> ({routing.patternName})</span>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1 text-muted-foreground">
            <DollarSign className="w-3 h-3" />
            <span>{formatCost(routing.estimatedCost)}</span>
          </div>
          {routing.latencyMs && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>{formatLatency(routing.latencyMs)}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-2 py-1 rounded-md text-xs',
        isSymbolic
          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
          : 'bg-violet-500/10 text-violet-400 border border-violet-500/20',
        className
      )}
    >
      {/* Routing type */}
      <div className="flex items-center gap-1 font-medium">
        {isSymbolic ? (
          <>
            <Zap className="w-3.5 h-3.5" />
            <span>Core</span>
          </>
        ) : (
          <>
            <Brain className="w-3.5 h-3.5" />
            <span>Conductor</span>
          </>
        )}
      </div>

      {/* Divider */}
      <div className="w-px h-3 bg-current opacity-30" />

      {/* Pattern ID (for symbolic) or cost (for neural) */}
      {isSymbolic && routing.patternId ? (
        <span className="font-mono text-[10px] opacity-70">
          {routing.patternId}
        </span>
      ) : (
        <span className="opacity-70">{formatCost(routing.estimatedCost)}</span>
      )}
    </div>
  );
}

/**
 * SymbiosRoutingBadge - Minimal badge for inline use
 */
interface SymbiosRoutingBadgeProps {
  type: 'symbolic' | 'neural';
  className?: string;
}

export function SymbiosRoutingBadge({
  type,
  className,
}: SymbiosRoutingBadgeProps): JSX.Element {
  const isSymbolic = type === 'symbolic';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium',
        isSymbolic
          ? 'bg-emerald-500/10 text-emerald-400'
          : 'bg-violet-500/10 text-violet-400',
        className
      )}
    >
      {isSymbolic ? (
        <Zap className="w-2.5 h-2.5" />
      ) : (
        <Brain className="w-2.5 h-2.5" />
      )}
      {isSymbolic ? 'Symbolic' : 'Neural'}
    </span>
  );
}

/**
 * SymbiosRoutingStats - Summary stats display
 */
interface SymbiosRoutingStatsProps {
  symbolic: number;
  neural: number;
  totalCost: number;
  className?: string;
}

export function SymbiosRoutingStats({
  symbolic,
  neural,
  totalCost,
  className,
}: SymbiosRoutingStatsProps): JSX.Element {
  const total = symbolic + neural;
  const symbolicPercent = total > 0 ? Math.round((symbolic / total) * 100) : 0;

  return (
    <div
      className={cn(
        'flex items-center gap-4 px-3 py-2 rounded-lg bg-card/50 border border-border/50 text-xs',
        className
      )}
    >
      {/* Symbolic vs Neural ratio */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 text-emerald-400">
          <Zap className="w-3 h-3" />
          <span>{symbolic}</span>
        </div>
        <span className="text-muted-foreground">/</span>
        <div className="flex items-center gap-1 text-violet-400">
          <Brain className="w-3 h-3" />
          <span>{neural}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
          style={{ width: `${symbolicPercent}%` }}
        />
      </div>

      {/* Percentage */}
      <span className="text-emerald-400 font-medium">{symbolicPercent}%</span>

      {/* Total cost */}
      <div className="flex items-center gap-1 text-muted-foreground pl-2 border-l border-border">
        <DollarSign className="w-3 h-3" />
        <span>{totalCost.toFixed(2)}</span>
      </div>
    </div>
  );
}

export default SymbiosRoutingIndicator;
