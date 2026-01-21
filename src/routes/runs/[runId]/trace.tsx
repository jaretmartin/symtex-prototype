/**
 * Run Trace Page
 *
 * Displays the execution trace and reasoning timeline for a specific run.
 * Shows step-by-step execution details, confidence scores, and context sources.
 */

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  Brain,
  Play,
  Pause,
  RotateCcw,
  Download,
  Share2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ReasoningTracePanel from '@/components/reasoning/ReasoningTracePanel';
import { LedgerLink } from '@/components/ui/LedgerLink';
import type { ReasoningTrace, ReasoningStep, ContextSource } from '@/types/entities/reasoning';

interface RunDetails {
  id: string;
  name: string;
  status: 'completed' | 'running' | 'failed' | 'paused';
  startedAt: string;
  completedAt?: string;
  duration?: string;
  triggeredBy: string;
  cognateId?: string;
  cognateName?: string;
}

// Extended step type for the timeline display (includes extra fields not in base type)
interface TimelineStep extends ReasoningStep {
  title?: string;
  stepType?: string;
  inputs?: string[];
  outputs?: string[];
}

// Mock data for demonstration
const mockRunDetails: RunDetails = {
  id: 'run-001',
  name: 'Lead Qualification Flow',
  status: 'completed',
  startedAt: '2024-01-20T14:30:00Z',
  completedAt: '2024-01-20T14:32:15Z',
  duration: '2m 15s',
  triggeredBy: 'New Lead Webhook',
  cognateId: 'cog-sales-01',
  cognateName: 'Sales Assistant',
};

const mockTimelineSteps: TimelineStep[] = [
  {
    order: 1,
    stepType: 'analysis',
    title: 'Lead Data Analysis',
    description: 'Analyzed incoming lead data from webhook payload. Extracted company size, industry, and contact role.',
    confidence: 0.95,
    duration: 450,
    inputs: ['Webhook payload', 'Lead schema'],
    outputs: ['Structured lead object'],
  },
  {
    order: 2,
    stepType: 'retrieval',
    title: 'SOP Lookup',
    description: 'Retrieved relevant SOPs for lead qualification based on industry and company size.',
    confidence: 0.92,
    duration: 120,
    inputs: ['Industry: SaaS', 'Size: 50-200'],
    outputs: ['SOP-LQ-001', 'SOP-LQ-003'],
  },
  {
    order: 3,
    stepType: 'reasoning',
    title: 'Qualification Scoring',
    description: 'Applied scoring model to determine lead quality. Considered budget indicators, timeline, and authority level.',
    confidence: 0.84,
    duration: 890,
    inputs: ['Lead data', 'Scoring model v2.1'],
    outputs: ['Score: 78/100', 'Grade: A'],
  },
  {
    order: 4,
    stepType: 'decision',
    title: 'Routing Decision',
    description: 'Determined optimal sales rep assignment based on territory, expertise, and current workload.',
    confidence: 0.88,
    duration: 230,
    inputs: ['Lead grade', 'Rep availability matrix'],
    outputs: ['Assigned to: Sarah Chen'],
  },
  {
    order: 5,
    stepType: 'action',
    title: 'CRM Update',
    description: 'Created lead record in CRM with enriched data and assigned owner.',
    confidence: 0.99,
    duration: 340,
    inputs: ['Lead object', 'Assignment'],
    outputs: ['CRM ID: LD-4521'],
  },
];

const mockSources: ContextSource[] = [
  {
    id: 'src-1',
    type: 'space',
    name: 'Lead Qualification SOP',
    relevance: 0.95,
  },
  {
    id: 'src-2',
    type: 'external',
    name: 'Industry Best Practices',
    relevance: 0.78,
  },
  {
    id: 'src-3',
    type: 'history',
    name: 'Previous Lead Outcomes',
    relevance: 0.65,
  },
];

const mockTrace: ReasoningTrace = {
  id: 'trace-001',
  overallConfidence: 0.87,
  steps: mockTimelineSteps.map(step => ({
    order: step.order,
    description: step.description,
    confidence: step.confidence,
    duration: step.duration,
    input: step.inputs?.join(', '),
    output: step.outputs?.join(', '),
  })),
  sources: mockSources,
};

interface ExecutionTimelineProps {
  steps: TimelineStep[];
  className?: string;
}

function ExecutionTimeline({ steps, className }: ExecutionTimelineProps): JSX.Element {
  return (
    <div className={cn('space-y-4', className)}>
      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
        Execution Timeline
      </h3>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

        {/* Timeline items */}
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={step.order} className="relative pl-10">
              {/* Timeline dot */}
              <div
                className={cn(
                  'absolute left-2 w-5 h-5 rounded-full border-2 flex items-center justify-center',
                  'bg-card border-symtex-primary'
                )}
              >
                <span className="text-xs text-symtex-primary font-medium">{index + 1}</span>
              </div>

              {/* Content */}
              <div className="p-4 rounded-lg bg-card border border-border">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-sm font-medium text-foreground">{step.title || `Step ${step.order}`}</h4>
                    <span className="text-xs text-muted-foreground capitalize">{step.stepType || 'processing'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {step.duration}ms
                    </span>
                    <span
                      className={cn(
                        'text-xs px-2 py-0.5 rounded-full',
                        step.confidence >= 0.9
                          ? 'bg-green-500/20 text-green-400'
                          : step.confidence >= 0.7
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-red-500/20 text-red-400'
                      )}
                    >
                      {Math.round(step.confidence * 100)}%
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{step.description}</p>

                {/* Inputs/Outputs */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {step.inputs?.map((input: string, i: number) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    >
                      {input}
                    </span>
                  ))}
                  {step.outputs?.map((output: string, i: number) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20"
                    >
                      {output}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const statusConfig = {
  completed: {
    icon: CheckCircle2,
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    label: 'Completed',
  },
  running: {
    icon: Play,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    label: 'Running',
  },
  failed: {
    icon: AlertCircle,
    color: 'text-red-400',
    bgColor: 'bg-red-500/20',
    label: 'Failed',
  },
  paused: {
    icon: Pause,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/20',
    label: 'Paused',
  },
};

export default function RunTracePage(): JSX.Element {
  const { runId } = useParams<{ runId: string }>();
  const [run, setRun] = useState<RunDetails | null>(null);
  const [trace, setTrace] = useState<ReasoningTrace | null>(null);
  const [timelineSteps, setTimelineSteps] = useState<TimelineStep[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const loadData = async (): Promise<void> => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setRun({ ...mockRunDetails, id: runId || 'run-001' });
      setTrace({ ...mockTrace, id: `trace-${runId || '001'}` });
      setTimelineSteps(mockTimelineSteps);
      setIsLoading(false);
    };

    loadData();
  }, [runId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-6" />
          <div className="h-32 bg-muted rounded-xl mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-muted rounded-xl" />
            <div className="h-96 bg-muted rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!run || !trace) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Run Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The execution trace for this run could not be found.
          </p>
          <Link
            to="/runs"
            className="inline-flex items-center gap-2 px-4 py-2 bg-symtex-primary text-white rounded-lg hover:bg-symtex-primary/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Runs
          </Link>
        </div>
      </div>
    );
  }

  const statusInfo = statusConfig[run.status];
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/runs"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Runs
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
                <Brain className="w-7 h-7 text-symtex-primary" />
                Execution Trace
              </h1>
              <p className="text-muted-foreground mt-1">{run.name}</p>
            </div>

            <div className="flex items-center gap-2">
              <LedgerLink runId={run.id} label="Audit Trail" />
              <button
                className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                title="Retry run"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                title="Export trace"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                title="Share trace"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Run Summary Card */}
        <div className="bg-card rounded-xl border border-border p-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Status</p>
              <div className="flex items-center gap-2">
                <div className={cn('p-1.5 rounded-lg', statusInfo.bgColor)}>
                  <StatusIcon className={cn('w-4 h-4', statusInfo.color)} />
                </div>
                <span className={cn('font-medium', statusInfo.color)}>{statusInfo.label}</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Duration</p>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium text-foreground">{run.duration || 'In progress'}</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Trigger</p>
              <span className="font-medium text-foreground">{run.triggeredBy}</span>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Cognate</p>
              {run.cognateName ? (
                <Link
                  to={`/team/cognates/${run.cognateId}`}
                  className="font-medium text-symtex-primary hover:underline"
                >
                  {run.cognateName}
                </Link>
              ) : (
                <span className="text-muted-foreground">System</span>
              )}
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Confidence</p>
              <span
                className={cn(
                  'font-medium',
                  trace.overallConfidence >= 0.9
                    ? 'text-green-400'
                    : trace.overallConfidence >= 0.7
                    ? 'text-amber-400'
                    : 'text-red-400'
                )}
              >
                {Math.round(trace.overallConfidence * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Main Content - Two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Execution Timeline */}
          <div className="bg-card rounded-xl border border-border p-6">
            <ExecutionTimeline steps={timelineSteps} />
          </div>

          {/* Reasoning Trace Panel */}
          <div>
            <ReasoningTracePanel trace={trace} defaultExpanded />
          </div>
        </div>
      </div>
    </div>
  );
}
