/**
 * Simulation Modal Component
 *
 * Displays simulation results in a modal with before/after diff visualization,
 * impact metrics, and actions to approve/reject changes.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  GitCompare,
  CheckCircle,
  XCircle,
  ArrowRight,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Minus,
  DollarSign,
  Clock,
  Shield,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SimulationDiff, type SimulationStep } from '@/features/simulation';
import type { Cognate } from '@/types';

interface SimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  cognate: Cognate;
  sopCount: number;
}

interface ImpactMetric {
  label: string;
  before: number;
  after: number;
  unit: string;
  icon: React.ReactNode;
  isBetterWhenHigher: boolean;
}

// Mock simulation steps for demonstration
const MOCK_SIMULATION_STEPS: SimulationStep[] = [
  {
    id: 'step-1',
    label: 'Customer Greeting',
    before: { value: 'Generic template', status: 'warning' },
    after: { value: 'Personalized greeting', status: 'improved' },
    impact: 'Improved customer satisfaction by 23%',
  },
  {
    id: 'step-2',
    label: 'Intent Classification',
    before: { value: '3 categories', status: 'neutral' },
    after: { value: '8 categories', status: 'success' },
    impact: 'Better routing reduces escalations by 40%',
  },
  {
    id: 'step-3',
    label: 'Response Time',
    before: { value: '2.4s avg', status: 'warning' },
    after: { value: '0.8s avg', status: 'success' },
    impact: '67% faster response improves engagement',
  },
  {
    id: 'step-4',
    label: 'Compliance Check',
    before: { value: '85% coverage', status: 'warning' },
    after: { value: '99% coverage', status: 'success' },
    impact: 'Near-complete compliance coverage',
  },
];

// Mock impact metrics
const MOCK_IMPACT_METRICS: ImpactMetric[] = [
  {
    label: 'Response Time',
    before: 2.4,
    after: 0.8,
    unit: 's',
    icon: <Clock className="w-4 h-4" />,
    isBetterWhenHigher: false,
  },
  {
    label: 'Accuracy',
    before: 87,
    after: 94,
    unit: '%',
    icon: <CheckCircle className="w-4 h-4" />,
    isBetterWhenHigher: true,
  },
  {
    label: 'Cost per Request',
    before: 0.012,
    after: 0.008,
    unit: '$',
    icon: <DollarSign className="w-4 h-4" />,
    isBetterWhenHigher: false,
  },
  {
    label: 'Compliance Score',
    before: 85,
    after: 99,
    unit: '%',
    icon: <Shield className="w-4 h-4" />,
    isBetterWhenHigher: true,
  },
];

function MetricCard({ metric }: { metric: ImpactMetric }): JSX.Element {
  const change = metric.after - metric.before;
  const percentChange = ((change / metric.before) * 100).toFixed(1);
  const isImproved = metric.isBetterWhenHigher ? change > 0 : change < 0;

  return (
    <div className="p-3 bg-surface-base border border-border rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-muted-foreground">{metric.icon}</span>
        <span className="text-sm text-muted-foreground">{metric.label}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-lg font-mono text-muted-foreground line-through">
          {metric.unit === '$' ? `$${metric.before.toFixed(3)}` : `${metric.before}${metric.unit}`}
        </span>
        <ArrowRight className="w-4 h-4 text-muted-foreground" />
        <span className="text-lg font-mono text-foreground font-medium">
          {metric.unit === '$' ? `$${metric.after.toFixed(3)}` : `${metric.after}${metric.unit}`}
        </span>
      </div>
      <div className={`flex items-center gap-1 mt-2 text-xs ${isImproved ? 'text-green-400' : 'text-red-400'}`}>
        {isImproved ? (
          <TrendingUp className="w-3 h-3" />
        ) : change === 0 ? (
          <Minus className="w-3 h-3" />
        ) : (
          <TrendingDown className="w-3 h-3" />
        )}
        <span>
          {change > 0 ? '+' : ''}{percentChange}% {isImproved ? 'improvement' : 'regression'}
        </span>
      </div>
    </div>
  );
}

export function SimulationModal({ isOpen, onClose, cognate, sopCount }: SimulationModalProps): JSX.Element | null {
  const [activeTab, setActiveTab] = useState<'diff' | 'metrics' | 'summary'>('diff');

  if (!isOpen) return null;

  const handleApprove = (): void => {
    // In a real app, this would apply the simulation changes
    onClose();
  };

  const handleReject = (): void => {
    // In a real app, this would discard the simulation
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-4 md:inset-10 lg:inset-20 bg-card border border-border rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <GitCompare className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Simulation Complete</h2>
                  <p className="text-sm text-muted-foreground">
                    {cognate.name} - {sopCount} SOPs analyzed
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 px-6 py-2 border-b border-border bg-surface-base/50">
              <button
                type="button"
                onClick={() => setActiveTab('diff')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'diff'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <GitCompare className="w-4 h-4 inline mr-2" />
                Diff View
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('metrics')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'metrics'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Zap className="w-4 h-4 inline mr-2" />
                Impact Metrics
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('summary')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'summary'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <CheckCircle className="w-4 h-4 inline mr-2" />
                Summary
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6">
              {activeTab === 'diff' && (
                <div className="max-w-3xl mx-auto">
                  <SimulationDiff
                    title="Before / After Comparison"
                    steps={MOCK_SIMULATION_STEPS}
                    autoPlay
                  />
                </div>
              )}

              {activeTab === 'metrics' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                  {MOCK_IMPACT_METRICS.map((metric) => (
                    <MetricCard key={metric.label} metric={metric} />
                  ))}
                </div>
              )}

              {activeTab === 'summary' && (
                <div className="max-w-2xl mx-auto space-y-6">
                  {/* Overall Score */}
                  <div className="text-center p-8 bg-green-500/10 border border-green-500/30 rounded-xl">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                      <CheckCircle className="w-10 h-10 text-green-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      Simulation Passed
                    </h3>
                    <p className="text-muted-foreground">
                      All {sopCount} SOPs passed validation with improved metrics
                    </p>
                  </div>

                  {/* Key Findings */}
                  <div className="p-4 bg-surface-base border border-border rounded-lg">
                    <h4 className="font-medium text-foreground mb-3">Key Findings</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm text-muted-foreground">
                        <TrendingUp className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        Response time improved by 67% (2.4s to 0.8s)
                      </li>
                      <li className="flex items-start gap-2 text-sm text-muted-foreground">
                        <TrendingUp className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        Accuracy increased from 87% to 94%
                      </li>
                      <li className="flex items-start gap-2 text-sm text-muted-foreground">
                        <TrendingUp className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        Cost per request reduced by 33%
                      </li>
                      <li className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Shield className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        Compliance coverage now at 99%
                      </li>
                    </ul>
                  </div>

                  {/* Recommendations */}
                  <div className="p-4 bg-surface-base border border-border rounded-lg">
                    <h4 className="font-medium text-foreground mb-3">Recommendations</h4>
                    <p className="text-sm text-muted-foreground">
                      Based on this simulation, we recommend approving these changes.
                      The improvements in response time and accuracy will significantly
                      enhance user experience while reducing operational costs.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-surface-base/50">
              <a
                href="/control/ledger"
                className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
              >
                View in Ledger
                <ExternalLink className="w-3 h-3" />
              </a>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={handleReject}>
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject Changes
                </Button>
                <Button variant="primary" onClick={handleApprove}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve & Apply
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default SimulationModal;
