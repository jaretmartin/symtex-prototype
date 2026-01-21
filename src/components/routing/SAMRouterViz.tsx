/**
 * SAMRouterViz Component
 *
 * Visual indicator of SAM (Symbolic AI Model) routing decisions.
 * Shows: Query -> Decision -> Target with confidence and cost comparison.
 */

import { memo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Brain,
  ArrowRight,
  DollarSign,
  Target,
  Sparkles,
  Clock,
  ChevronDown,
  Info,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Routing target types
type RoutingTarget = 'symbolic' | 'neural' | 'hybrid';

interface RoutingDecision {
  id: string;
  query: string;
  target: RoutingTarget;
  confidence: number;
  pattern?: string;
  symbolicCost: number;
  neuralCost: number;
  latency: number;
  reasoning?: string;
  timestamp: string;
}

interface SAMRouterVizProps {
  decision?: RoutingDecision;
  className?: string;
  compact?: boolean;
  showHistory?: boolean;
}

// Target configuration
const targetConfig = {
  symbolic: {
    label: 'SYMBOLIC (Core)',
    icon: Zap,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/20',
    borderColor: 'border-amber-500/30',
    description: 'Pattern-based S1 execution',
  },
  neural: {
    label: 'NEURAL (LLM)',
    icon: Brain,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500/30',
    description: 'Large language model inference',
  },
  hybrid: {
    label: 'HYBRID',
    icon: Sparkles,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/20',
    borderColor: 'border-cyan-500/30',
    description: 'Combined symbolic + neural approach',
  },
};

// Mock routing decision for demo
const mockDecision: RoutingDecision = {
  id: 'route-1',
  query: 'Draft email to John about project update',
  target: 'symbolic',
  confidence: 94,
  pattern: 'email_draft_v2',
  symbolicCost: 0.001,
  neuralCost: 0.15,
  latency: 45,
  reasoning: 'Query matches email draft pattern with high confidence. Symbolic execution is 150x more cost-effective.',
  timestamp: new Date().toISOString(),
};

// Mock history for demo
const mockHistory: RoutingDecision[] = [
  mockDecision,
  {
    id: 'route-2',
    query: 'Explain quantum computing concepts',
    target: 'neural',
    confidence: 88,
    symbolicCost: 0.002,
    neuralCost: 0.12,
    latency: 1200,
    reasoning: 'Complex explanation requires nuanced language generation. Neural routing recommended.',
    timestamp: new Date(Date.now() - 60000).toISOString(),
  },
  {
    id: 'route-3',
    query: 'Schedule meeting with Sarah next Tuesday',
    target: 'symbolic',
    confidence: 97,
    pattern: 'calendar_schedule_v3',
    symbolicCost: 0.0008,
    neuralCost: 0.10,
    latency: 32,
    reasoning: 'Calendar scheduling pattern detected. Symbolic execution optimal.',
    timestamp: new Date(Date.now() - 120000).toISOString(),
  },
];

function SAMRouterViz({
  decision = mockDecision,
  className,
  compact = false,
  showHistory = false,
}: SAMRouterVizProps): JSX.Element {
  const [showDetails, setShowDetails] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<'query' | 'router' | 'target'>('query');
  const [history] = useState(mockHistory);

  const config = targetConfig[decision.target];
  const TargetIcon = config.icon;
  const costSavings = ((decision.neuralCost - decision.symbolicCost) / decision.neuralCost * 100).toFixed(0);

  // Animate through phases
  useEffect(() => {
    const timer1 = setTimeout(() => setAnimationPhase('router'), 300);
    const timer2 = setTimeout(() => setAnimationPhase('target'), 800);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [decision.id]);

  if (compact) {
    return (
      <div className={cn('flex items-center gap-2 px-3 py-2 bg-card rounded-lg border border-border', className)}>
        <TargetIcon className={cn('w-4 h-4', config.color)} />
        <span className="text-sm text-foreground">{config.label}</span>
        <span className={cn('text-xs px-1.5 py-0.5 rounded', config.bgColor, config.color)}>
          {decision.confidence}%
        </span>
      </div>
    );
  }

  return (
    <div className={cn('bg-card rounded-xl border border-border overflow-hidden', className)}>
      {/* Header */}
      <div className="p-4 border-b border-border bg-card/30">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Target className="w-4 h-4 text-symtex-primary" />
            SAM ROUTING DECISION
          </h3>
          <span className="text-xs text-muted-foreground">
            {new Date(decision.timestamp).toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Main Visualization */}
      <div className="p-6">
        {/* Flow Diagram */}
        <div className="flex items-center justify-between gap-4 mb-6">
          {/* Query Box */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: animationPhase !== 'query' ? 1 : 0.5, x: 0 }}
            className="flex-1 p-3 bg-card/50 rounded-lg border border-border"
          >
            <p className="text-xs text-muted-foreground mb-1">Query</p>
            <p className="text-sm text-foreground line-clamp-2">{decision.query}</p>
          </motion.div>

          {/* Arrow */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: animationPhase === 'router' || animationPhase === 'target' ? 1 : 0.3, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <ArrowRight className="w-5 h-5 text-muted-foreground" />
          </motion.div>

          {/* SAM Router */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: animationPhase !== 'query' ? 1 : 0.5, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="p-4 bg-symtex-primary/20 rounded-xl border border-symtex-primary/30 text-center"
          >
            <div className="p-2 bg-symtex-primary/30 rounded-lg inline-block mb-2">
              <Sparkles className="w-5 h-5 text-symtex-primary" />
            </div>
            <p className="text-xs text-muted-foreground">SAM Router</p>
            <p className="text-lg font-bold text-symtex-primary">{decision.confidence}%</p>
          </motion.div>

          {/* Arrow */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: animationPhase === 'target' ? 1 : 0.3, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <ArrowRight className="w-5 h-5 text-muted-foreground" />
          </motion.div>

          {/* Target */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: animationPhase === 'target' ? 1 : 0.3, x: 0 }}
            transition={{ delay: 0.6 }}
            className={cn('flex-1 p-4 rounded-xl border text-center', config.bgColor, config.borderColor)}
          >
            <TargetIcon className={cn('w-6 h-6 mx-auto mb-2', config.color)} />
            <p className={cn('text-sm font-semibold', config.color)}>{config.label}</p>
            {decision.pattern && (
              <p className="text-xs text-muted-foreground mt-1">Pattern: {decision.pattern}</p>
            )}
          </motion.div>
        </div>

        {/* Cost Comparison */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="p-3 bg-card/50 rounded-lg text-center">
            <DollarSign className="w-4 h-4 text-green-400 mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Symbolic Cost</p>
            <p className="text-lg font-bold text-green-400">~${decision.symbolicCost.toFixed(4)}</p>
          </div>
          <div className="p-3 bg-card/50 rounded-lg text-center">
            <DollarSign className="w-4 h-4 text-red-400 mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Neural Cost</p>
            <p className="text-lg font-bold text-red-400">~${decision.neuralCost.toFixed(2)}</p>
          </div>
          <div className="p-3 bg-card/50 rounded-lg text-center">
            <TrendingUp className="w-4 h-4 text-symtex-primary mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Savings</p>
            <p className="text-lg font-bold text-symtex-primary">{costSavings}%</p>
          </div>
        </div>

        {/* Latency */}
        <div className="flex items-center justify-between p-3 bg-card/30 rounded-lg mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Expected Latency</span>
          </div>
          <span className="text-sm font-semibold text-foreground">{decision.latency}ms</span>
        </div>

        {/* Expandable Details */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-card/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Routing Reasoning</span>
          </div>
          <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform', showDetails && 'rotate-180')} />
        </button>

        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 bg-card/30 rounded-lg mt-2">
                <p className="text-sm text-muted-foreground">{decision.reasoning}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* History */}
      {showHistory && (
        <div className="border-t border-border">
          <div className="p-4">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Recent Routing Decisions
            </h4>
            <div className="space-y-2">
              {history.slice(1).map((item) => {
                const itemConfig = targetConfig[item.target];
                const ItemIcon = itemConfig.icon;
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-card/50 transition-colors"
                  >
                    <ItemIcon className={cn('w-4 h-4 flex-shrink-0', itemConfig.color)} />
                    <p className="text-sm text-muted-foreground truncate flex-1">{item.query}</p>
                    <span className={cn('text-xs px-1.5 py-0.5 rounded', itemConfig.bgColor, itemConfig.color)}>
                      {item.confidence}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(SAMRouterViz);

// Export types for external use
export type { RoutingDecision, RoutingTarget };
