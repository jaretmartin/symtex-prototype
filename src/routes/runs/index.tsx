/**
 * Runs Page
 *
 * Lists automations and their run history with the WF2 workflow:
 * Automation -> Plan -> Simulate -> Run -> Review -> Compile
 *
 * Features:
 * - Automation list with run history
 * - Explain Plan modal before running
 * - Simulate option
 * - Run execution
 * - Review results
 * - Pattern compilation trigger
 */

import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Play,
  Pause,
  History,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Zap,
  Search,
  Filter,
  Plus,
  FileText,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { ExplainPlan, type ExecutionPlan } from '@/components/runs/ExplainPlan';
import { SimulationPanel, type SimulationResult } from '@/components/runs/SimulationPanel';
import { RunReview, type RunResult } from '@/components/runs/RunReview';
import { PatternCompilationWidget } from '@/features/insights/PatternCompilationWidget';
import type { PatternCompilation } from '@/features/insights/insights-store';

// ============================================================================
// TYPES
// ============================================================================

interface AutomationRun {
  id: string;
  status: 'success' | 'failed' | 'partial' | 'running';
  startedAt: Date;
  completedAt?: Date;
  cost: number;
  stepsCompleted: number;
  totalSteps: number;
}

interface Automation {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'draft';
  triggerType: string;
  lastRun?: Date;
  totalRuns: number;
  recentRuns: AutomationRun[];
  estimatedCost: number;
}

type WF2Step = 'list' | 'plan' | 'simulate' | 'running' | 'review' | 'compile';

// ============================================================================
// MOCK DATA
// ============================================================================

const mockAutomations: Automation[] = [
  {
    id: 'auto-1',
    name: 'Lead Qualification Flow',
    description: 'Automatically scores and routes new leads based on criteria',
    status: 'active',
    triggerType: 'New Lead',
    lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000),
    totalRuns: 1247,
    estimatedCost: 0.05,
    recentRuns: [
      {
        id: 'run-1-1',
        status: 'success',
        startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 3400),
        cost: 0.048,
        stepsCompleted: 5,
        totalSteps: 5,
      },
      {
        id: 'run-1-2',
        status: 'success',
        startedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 5 * 60 * 60 * 1000 + 3200),
        cost: 0.052,
        stepsCompleted: 5,
        totalSteps: 5,
      },
      {
        id: 'run-1-3',
        status: 'partial',
        startedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 24 * 60 * 60 * 1000 + 4100),
        cost: 0.041,
        stepsCompleted: 4,
        totalSteps: 5,
      },
    ],
  },
  {
    id: 'auto-2',
    name: 'Welcome Email Sequence',
    description: 'Sends personalized welcome emails to new customers',
    status: 'active',
    triggerType: 'New Customer',
    lastRun: new Date(Date.now() - 30 * 60 * 1000),
    totalRuns: 3892,
    estimatedCost: 0.02,
    recentRuns: [
      {
        id: 'run-2-1',
        status: 'success',
        startedAt: new Date(Date.now() - 30 * 60 * 1000),
        completedAt: new Date(Date.now() - 30 * 60 * 1000 + 1200),
        cost: 0.018,
        stepsCompleted: 3,
        totalSteps: 3,
      },
    ],
  },
  {
    id: 'auto-3',
    name: 'Weekly Sales Report',
    description: 'Generates and emails weekly sales performance report',
    status: 'active',
    triggerType: 'Schedule',
    lastRun: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    totalRuns: 52,
    estimatedCost: 0.15,
    recentRuns: [
      {
        id: 'run-3-1',
        status: 'success',
        startedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 12000),
        cost: 0.142,
        stepsCompleted: 8,
        totalSteps: 8,
      },
    ],
  },
  {
    id: 'auto-4',
    name: 'Support Ticket Escalation',
    description: 'Escalates high-priority tickets to senior support',
    status: 'paused',
    triggerType: 'Ticket Created',
    lastRun: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    totalRuns: 156,
    estimatedCost: 0.08,
    recentRuns: [
      {
        id: 'run-4-1',
        status: 'failed',
        startedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 2300),
        cost: 0.032,
        stepsCompleted: 2,
        totalSteps: 6,
      },
    ],
  },
  {
    id: 'auto-5',
    name: 'Cart Abandonment Follow-up',
    description: 'Sends reminder emails for abandoned shopping carts',
    status: 'draft',
    triggerType: 'Cart Abandoned',
    totalRuns: 0,
    estimatedCost: 0.03,
    recentRuns: [],
  },
];

function createMockExecutionPlan(automation: Automation): ExecutionPlan {
  return {
    automationId: automation.id,
    automationName: automation.name,
    systems: [
      {
        id: 'sys-1',
        name: 'Salesforce CRM',
        type: 'crm',
        action: 'read',
        description: 'Read lead data and scoring criteria',
      },
      {
        id: 'sys-2',
        name: 'Email Service (SendGrid)',
        type: 'email',
        action: 'execute',
        description: 'Send personalized emails',
      },
      {
        id: 'sys-3',
        name: 'Analytics Database',
        type: 'database',
        action: 'write',
        description: 'Log execution metrics',
      },
    ],
    permissions: [
      { id: 'perm-1', scope: 'salesforce', level: 'read', granted: true },
      { id: 'perm-2', scope: 'sendgrid', level: 'write', granted: true },
      { id: 'perm-3', scope: 'analytics', level: 'write', granted: true },
      { id: 'perm-4', scope: 'contacts', level: 'read', granted: true },
      { id: 'perm-5', scope: 'email', level: 'write', granted: true },
    ],
    cost: {
      apiCalls: 12,
      estimatedCost: automation.estimatedCost,
      budgetCap: 50,
      budgetRemaining: 42.35,
      withinBudget: true,
    },
    estimatedDuration: 8,
    riskLevel: 'low',
  };
}

function createMockSimulationResult(automationId: string): SimulationResult {
  return {
    automationId,
    status: 'success',
    steps: [
      {
        id: 'step-1',
        name: 'Fetch Lead Data',
        status: 'success',
        duration: 245,
        input: { leadId: 'lead-123' },
        output: { name: 'John Doe', score: 85, email: 'john@example.com' },
        message: 'Successfully retrieved lead data from Salesforce',
      },
      {
        id: 'step-2',
        name: 'Evaluate Scoring Rules',
        status: 'success',
        duration: 32,
        input: { score: 85, threshold: 70 },
        output: { qualified: true, tier: 'high' },
        message: 'Lead qualifies for high-priority routing',
      },
      {
        id: 'step-3',
        name: 'Send Welcome Email',
        status: 'success',
        duration: 412,
        input: { template: 'welcome-high-tier', recipient: 'john@example.com' },
        output: { messageId: 'msg-abc123', delivered: true },
        message: 'Email queued for delivery',
      },
      {
        id: 'step-4',
        name: 'Log to Analytics',
        status: 'warning',
        duration: 89,
        input: { event: 'lead_qualified', leadId: 'lead-123' },
        output: { logged: true, latency: 89 },
        message: 'Logged successfully but latency above threshold',
      },
    ],
    warnings: [
      {
        id: 'warn-1',
        severity: 'warning',
        message: 'Analytics logging latency (89ms) exceeds recommended threshold (50ms)',
        suggestion: 'Consider batching analytics events for better performance',
      },
      {
        id: 'warn-2',
        severity: 'info',
        message: 'This automation has been simulated 5 times - consider compiling to S1 pattern',
      },
    ],
    totalDuration: 778,
    completedAt: new Date(),
  };
}

function createMockRunResult(automation: Automation): RunResult {
  const now = new Date();
  const startedAt = new Date(now.getTime() - 4500);
  return {
    runId: `run-${Date.now()}`,
    automationId: automation.id,
    automationName: automation.name,
    status: 'success',
    startedAt,
    completedAt: now,
    steps: [
      {
        id: 'step-1',
        name: 'Fetch Lead Data',
        status: 'success',
        startedAt,
        completedAt: new Date(startedAt.getTime() + 280),
        input: { leadId: 'lead-456' },
        output: { name: 'Jane Smith', score: 92, email: 'jane@example.com' },
        cognateId: 'cog-1',
        cognateName: 'Data Fetcher',
      },
      {
        id: 'step-2',
        name: 'Evaluate Scoring Rules',
        status: 'success',
        startedAt: new Date(startedAt.getTime() + 280),
        completedAt: new Date(startedAt.getTime() + 320),
        input: { score: 92, threshold: 70 },
        output: { qualified: true, tier: 'high' },
      },
      {
        id: 'step-3',
        name: 'Send Welcome Email',
        status: 'success',
        startedAt: new Date(startedAt.getTime() + 320),
        completedAt: new Date(startedAt.getTime() + 850),
        input: { template: 'welcome-high-tier', recipient: 'jane@example.com' },
        output: { messageId: 'msg-def456', delivered: true },
        cognateId: 'cog-2',
        cognateName: 'Email Sender',
      },
      {
        id: 'step-4',
        name: 'Log to Analytics',
        status: 'success',
        startedAt: new Date(startedAt.getTime() + 850),
        completedAt: new Date(startedAt.getTime() + 920),
        input: { event: 'lead_qualified', leadId: 'lead-456' },
        output: { logged: true },
      },
    ],
    totalCost: 0.047,
    outputSummary: 'Lead Jane Smith qualified and routed to high-priority queue. Welcome email sent successfully.',
    canCompilePattern: true,
    patternSuggestion: 'This run pattern has been executed 15 times with consistent success. Compiling to S1 could reduce cost by 60%.',
  };
}

const mockPatterns: PatternCompilation[] = [
  {
    id: 'pc-001',
    patternName: 'lead-qualification-v2',
    sourcePath: '/automations/leads/qualify',
    convertedFrom: 'neural',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    executionCount: 847,
    timeSaved: 1.2,
  },
  {
    id: 'pc-002',
    patternName: 'welcome-email-sequence',
    sourcePath: '/automations/emails/welcome',
    convertedFrom: 'neural',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    executionCount: 2341,
    timeSaved: 0.8,
  },
];

// ============================================================================
// COMPONENT
// ============================================================================

export default function RunsPage(): JSX.Element {
  // State
  const [automations, setAutomations] = useState<Automation[]>(mockAutomations);
  const [filter, setFilter] = useState<'all' | 'active' | 'paused' | 'draft'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // WF2 workflow state
  const [currentStep, setCurrentStep] = useState<WF2Step>('list');
  const [selectedAutomation, setSelectedAutomation] = useState<Automation | null>(null);
  const [executionPlan, setExecutionPlan] = useState<ExecutionPlan | null>(null);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [_showPatternCompilation, setShowPatternCompilation] = useState(false);

  // Loading states
  const [isSimulating, setIsSimulating] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);

  // Filtered automations
  const filteredAutomations = automations.filter((auto) => {
    const matchesFilter = filter === 'all' || auto.status === filter;
    const matchesSearch =
      auto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      auto.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // ============================================================================
  // WF2 WORKFLOW HANDLERS
  // ============================================================================

  const handleExplainPlan = useCallback((automation: Automation): void => {
    setSelectedAutomation(automation);
    setExecutionPlan(createMockExecutionPlan(automation));
    setCurrentStep('plan');
  }, []);

  const handleSimulate = useCallback((): void => {
    if (!selectedAutomation) return;
    setIsSimulating(true);

    // Simulate API call
    setTimeout(() => {
      setSimulationResult(createMockSimulationResult(selectedAutomation.id));
      setIsSimulating(false);
      setCurrentStep('simulate');
    }, 1500);
  }, [selectedAutomation]);

  const handleRun = useCallback((): void => {
    if (!selectedAutomation) return;
    setIsRunning(true);
    setCurrentStep('running');

    // Simulate run execution
    setTimeout(() => {
      const result = createMockRunResult(selectedAutomation);
      setRunResult(result);
      setIsRunning(false);
      setCurrentStep('review');

      // Update automation stats
      setAutomations((prev) =>
        prev.map((auto) =>
          auto.id === selectedAutomation.id
            ? {
                ...auto,
                lastRun: new Date(),
                totalRuns: auto.totalRuns + 1,
                recentRuns: [
                  {
                    id: result.runId,
                    status: result.status,
                    startedAt: result.startedAt,
                    completedAt: result.completedAt,
                    cost: result.totalCost,
                    stepsCompleted: result.steps.filter((s) => s.status === 'success').length,
                    totalSteps: result.steps.length,
                  },
                  ...auto.recentRuns.slice(0, 4),
                ],
              }
            : auto
        )
      );
    }, 3000);
  }, [selectedAutomation]);

  const handleCompilePattern = useCallback((): void => {
    setIsCompiling(true);

    // Simulate pattern compilation
    setTimeout(() => {
      setIsCompiling(false);
      setShowPatternCompilation(true);
      setCurrentStep('compile');
    }, 2000);
  }, []);

  const handleCancel = useCallback((): void => {
    setCurrentStep('list');
    setSelectedAutomation(null);
    setExecutionPlan(null);
    setSimulationResult(null);
    setRunResult(null);
    setShowPatternCompilation(false);
  }, []);

  const handleToggleStatus = useCallback((id: string): void => {
    setAutomations((prev) =>
      prev.map((auto) =>
        auto.id === id
          ? {
              ...auto,
              status: auto.status === 'active' ? 'paused' : 'active',
            }
          : auto
      )
    );
  }, []);

  // ============================================================================
  // HELPERS
  // ============================================================================

  function getStatusColor(status: Automation['status']): string {
    switch (status) {
      case 'active':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'paused':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'draft':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  }

  function getRunStatusIcon(status: AutomationRun['status']): React.ReactNode {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-3 h-3 text-emerald-400" />;
      case 'failed':
        return <XCircle className="w-3 h-3 text-red-400" />;
      case 'partial':
        return <AlertTriangle className="w-3 h-3 text-amber-400" />;
      case 'running':
        return <div className="w-3 h-3 rounded-full border-2 border-symtex-primary border-t-transparent animate-spin" />;
      default:
        return null;
    }
  }

  function formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  }

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-symtex-primary to-symtex-accent bg-clip-text text-transparent">
            Runs
          </h1>
          <p className="text-muted-foreground mt-1">
            Execute, monitor, and review your automations
          </p>
        </div>
        <Link to="/control/lux">
          <Button variant="primary">
            <Plus className="w-4 h-4" />
            Create Automation
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-symtex-primary/10">
                <Zap className="w-5 h-5 text-symtex-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {automations.length}
                </p>
                <p className="text-xs text-muted-foreground">Total Automations</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {automations.filter((a) => a.status === 'active').length}
                </p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <History className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {automations.reduce((sum, a) => sum + a.totalRuns, 0).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Total Runs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Clock className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">~48 hrs</p>
                <p className="text-xs text-muted-foreground">Time Saved</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search automations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-symtex-primary focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {(['all', 'active', 'paused', 'draft'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize',
                filter === f
                  ? 'bg-symtex-primary/10 text-symtex-primary border border-symtex-primary/30'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Automation List */}
      <div className="space-y-4">
        {filteredAutomations.map((automation) => (
          <Card key={automation.id} className="bg-card/50 border-border/50">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                {/* Left: Info */}
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-symtex-primary/20 to-symtex-accent/20">
                    <Zap className="w-6 h-6 text-symtex-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-foreground">
                        {automation.name}
                      </h3>
                      <Badge
                        variant="outline"
                        className={cn('capitalize', getStatusColor(automation.status))}
                      >
                        {automation.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {automation.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        Trigger: {automation.triggerType}
                      </span>
                      <span className="flex items-center gap-1">
                        <History className="w-3 h-3" />
                        {automation.totalRuns.toLocaleString()} runs
                      </span>
                      {automation.lastRun && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Last: {formatTimeAgo(automation.lastRun)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExplainPlan(automation)}
                    disabled={automation.status === 'draft'}
                  >
                    <FileText className="w-4 h-4" />
                    Explain Plan
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setSelectedAutomation(automation);
                      setExecutionPlan(createMockExecutionPlan(automation));
                      handleRun();
                    }}
                    disabled={automation.status !== 'active'}
                  >
                    <Play className="w-4 h-4" />
                    Run Now
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleToggleStatus(automation.id)}
                  >
                    {automation.status === 'active' ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </Button>
                  <Link to={`/control/lux?id=${automation.id}`}>
                    <Button variant="ghost" size="icon-sm">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Recent Runs */}
              {automation.recentRuns.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border/50">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    Recent Runs
                  </h4>
                  <div className="flex items-center gap-2">
                    {automation.recentRuns.slice(0, 5).map((run) => (
                      <Link
                        key={run.id}
                        to={`/runs/${run.id}`}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        {getRunStatusIcon(run.status)}
                        <span className="text-xs text-muted-foreground">
                          {formatTimeAgo(run.startedAt)}
                        </span>
                      </Link>
                    ))}
                    {automation.totalRuns > 5 && (
                      <Link
                        to={`/runs?automation=${automation.id}`}
                        className="text-xs text-symtex-primary hover:text-symtex-primary/80 transition-colors"
                      >
                        +{automation.totalRuns - 5} more
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {filteredAutomations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <Search className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-1">
              No automations found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>

      {/* WF2 Dialogs */}

      {/* Plan Dialog */}
      <Dialog open={currentStep === 'plan'} onOpenChange={() => handleCancel()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Execution Plan</DialogTitle>
          </DialogHeader>
          {executionPlan && (
            <ExplainPlan
              plan={executionPlan}
              onSimulate={handleSimulate}
              onRun={handleRun}
              onCancel={handleCancel}
              isSimulating={isSimulating}
              isRunning={isRunning}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Simulate Dialog */}
      <Dialog open={currentStep === 'simulate'} onOpenChange={() => handleCancel()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Simulation Results</DialogTitle>
          </DialogHeader>
          {simulationResult && (
            <SimulationPanel
              result={simulationResult}
              onRunForReal={handleRun}
              onReSimulate={handleSimulate}
              onCancel={handleCancel}
              isRunning={isRunning}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Running Dialog */}
      <Dialog open={currentStep === 'running'} onOpenChange={() => {}}>
        <DialogContent className="max-w-md">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 rounded-full border-4 border-symtex-primary border-t-transparent animate-spin mb-6" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Running Automation
            </h3>
            <p className="text-muted-foreground text-center">
              {selectedAutomation?.name}
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Please wait while the automation executes...
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={currentStep === 'review'} onOpenChange={() => handleCancel()}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Run Complete</DialogTitle>
          </DialogHeader>
          {runResult && (
            <RunReview
              result={runResult}
              onCompilePattern={handleCompilePattern}
              onRunAgain={() => {
                handleCancel();
                if (selectedAutomation) {
                  handleExplainPlan(selectedAutomation);
                }
              }}
              onClose={handleCancel}
              isCompiling={isCompiling}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Compile Dialog */}
      <Dialog open={currentStep === 'compile'} onOpenChange={() => handleCancel()}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              Pattern Compiled
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <PatternCompilationWidget
              patterns={mockPatterns}
              totalCompiled={mockPatterns.length + 1}
            />
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="secondary" onClick={handleCancel}>
                Close
              </Button>
              <Link to="/signals/roi">
                <Button variant="primary">
                  View ROI Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
