/**
 * Active Agents Panel Component
 *
 * Displays currently running agent instances with status indicators,
 * progress, and action controls.
 */

import {
  Bot,
  Pause,
  Play,
  Square,
  Eye,
  Clock,
  Target,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import clsx from 'clsx';
import type { AgentInstance, AgentStatus, AgentExecution } from '@/types';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/empty/EmptyState';
import ProgressRing from '@/components/ui/ProgressRing';

interface ActiveAgentsPanelProps {
  agents: AgentInstance[];
  executions?: Record<string, AgentExecution>;
  templateNames?: Record<string, string>;
  missionNames?: Record<string, string>;
  onPause?: (id: string) => void;
  onResume?: (id: string) => void;
  onStop?: (id: string) => void;
  onViewDetails?: (id: string) => void;
}

// Status configuration with icons and colors
const statusConfig: Record<
  AgentStatus,
  {
    label: string;
    color: string;
    bgColor: string;
    icon: React.ElementType;
    animate?: boolean;
  }
> = {
  running: {
    label: 'Running',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    icon: Loader2,
    animate: true,
  },
  busy: {
    label: 'Busy',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    icon: Loader2,
    animate: true,
  },
  idle: {
    label: 'Idle',
    color: 'text-slate-400',
    bgColor: 'bg-slate-500/20',
    icon: Bot,
  },
  paused: {
    label: 'Paused',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20',
    icon: Pause,
  },
  completed: {
    label: 'Completed',
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    icon: CheckCircle2,
  },
  failed: {
    label: 'Failed',
    color: 'text-red-400',
    bgColor: 'bg-red-500/20',
    icon: AlertCircle,
  },
};

interface AgentItemProps {
  agent: AgentInstance;
  execution?: AgentExecution;
  templateName?: string;
  missionName?: string;
  onPause?: () => void;
  onResume?: () => void;
  onStop?: () => void;
  onViewDetails?: () => void;
}

function AgentItem({
  agent,
  execution,
  templateName,
  missionName,
  onPause,
  onResume,
  onStop,
  onViewDetails,
}: AgentItemProps): JSX.Element {
  const status = statusConfig[agent.status];
  const StatusIcon = status.icon;

  // Calculate progress from execution data
  const progress = execution?.duration
    ? Math.min(100, (execution.duration / 60000) * 100) // Placeholder: use time-based progress
    : 0;

  // Format elapsed time
  const getElapsedTime = (): string => {
    if (!agent.startedAt) return '--';
    const started = new Date(agent.startedAt).getTime();
    const now = Date.now();
    const elapsed = Math.floor((now - started) / 1000);

    if (elapsed < 60) return `${elapsed}s`;
    if (elapsed < 3600) return `${Math.floor(elapsed / 60)}m ${elapsed % 60}s`;
    return `${Math.floor(elapsed / 3600)}h ${Math.floor((elapsed % 3600) / 60)}m`;
  };

  const isActive = agent.status === 'running' || agent.status === 'busy';
  const isPaused = agent.status === 'paused';
  const canPause = isActive;
  const canResume = isPaused;
  const canStop = isActive || isPaused;

  return (
    <div
      className={clsx(
        'bg-symtex-card rounded-xl p-4 border border-symtex-border',
        'transition-all duration-200',
        'hover:border-slate-600'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Status indicator with progress */}
          <div className="relative">
            {isActive ? (
              <ProgressRing
                progress={progress}
                size={40}
                strokeWidth={3}
                showPercentage={false}
                color="#6366f1"
              />
            ) : (
              <div
                className={clsx(
                  'w-10 h-10 rounded-full flex items-center justify-center',
                  status.bgColor
                )}
              >
                <StatusIcon
                  className={clsx(
                    'w-5 h-5',
                    status.color,
                    status.animate && 'animate-spin'
                  )}
                />
              </div>
            )}
            {isActive && (
              <div className="absolute inset-0 flex items-center justify-center">
                <StatusIcon
                  className={clsx(
                    'w-4 h-4',
                    status.color,
                    status.animate && 'animate-spin'
                  )}
                />
              </div>
            )}
          </div>

          <div>
            <h4 className="font-medium text-white">
              {templateName || `Agent ${agent.id.slice(0, 8)}`}
            </h4>
            <div className="flex items-center gap-2">
              <span
                className={clsx(
                  'text-xs px-2 py-0.5 rounded',
                  status.bgColor,
                  status.color
                )}
              >
                {status.label}
              </span>
            </div>
          </div>
        </div>

        {/* Elapsed time */}
        {(isActive || isPaused) && (
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Clock className="w-3 h-3" />
            {getElapsedTime()}
          </div>
        )}
      </div>

      {/* Current mission/task */}
      {missionName && (
        <div className="flex items-center gap-2 mb-3 p-2 rounded-lg bg-slate-800/50">
          <Target className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-300 truncate">{missionName}</span>
        </div>
      )}

      {/* Current execution input preview */}
      {execution?.input && (
        <div className="mb-3">
          <p className="text-xs text-slate-500 mb-1">Current Task</p>
          <p className="text-sm text-slate-400 line-clamp-2">{execution.input}</p>
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center gap-4 mb-3 text-xs text-slate-400">
        <div>
          <span className="text-slate-500">Total:</span>{' '}
          <span className="text-slate-300">{agent.totalExecutions}</span>
        </div>
        <div>
          <span className="text-slate-500">Success:</span>{' '}
          <span className="text-green-400">{agent.successfulExecutions}</span>
        </div>
        {agent.totalExecutions > 0 && (
          <div>
            <span className="text-slate-500">Rate:</span>{' '}
            <span className="text-slate-300">
              {Math.round(
                (agent.successfulExecutions / agent.totalExecutions) * 100
              )}
              %
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-3 border-t border-symtex-border">
        {canPause && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onPause}
            leftIcon={<Pause className="w-4 h-4" />}
          >
            Pause
          </Button>
        )}
        {canResume && (
          <Button
            variant="primary"
            size="sm"
            onClick={onResume}
            leftIcon={<Play className="w-4 h-4" />}
          >
            Resume
          </Button>
        )}
        {canStop && (
          <Button
            variant="danger"
            size="sm"
            onClick={onStop}
            leftIcon={<Square className="w-4 h-4" />}
          >
            Stop
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onViewDetails}
          leftIcon={<Eye className="w-4 h-4" />}
        >
          Details
        </Button>
      </div>
    </div>
  );
}

export default function ActiveAgentsPanel({
  agents,
  executions = {},
  templateNames = {},
  missionNames = {},
  onPause,
  onResume,
  onStop,
  onViewDetails,
}: ActiveAgentsPanelProps): JSX.Element {
  // Sort agents: running first, then paused, then others
  const sortedAgents = [...agents].sort((a, b) => {
    const order: Record<AgentStatus, number> = {
      running: 0,
      busy: 1,
      paused: 2,
      idle: 3,
      completed: 4,
      failed: 5,
    };
    return order[a.status] - order[b.status];
  });

  // Get current execution for each agent
  const getCurrentExecution = (instanceId: string): AgentExecution | undefined => {
    return Object.values(executions).find(
      (e) =>
        e.instanceId === instanceId &&
        (e.status === 'running' || e.status === 'paused')
    );
  };

  const activeCount = agents.filter(
    (a) => a.status === 'running' || a.status === 'busy'
  ).length;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Active Agents</h2>
          <p className="text-sm text-slate-400">
            {activeCount} running, {agents.length} total
          </p>
        </div>

        {activeCount > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-green-400">{activeCount} active</span>
          </div>
        )}
      </div>

      {/* Agent List */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {sortedAgents.length > 0 ? (
          sortedAgents.map((agent) => (
            <AgentItem
              key={agent.id}
              agent={agent}
              execution={getCurrentExecution(agent.id)}
              templateName={templateNames[agent.templateId]}
              missionName={agent.missionId ? missionNames[agent.missionId] : undefined}
              onPause={onPause ? () => onPause(agent.id) : undefined}
              onResume={onResume ? () => onResume(agent.id) : undefined}
              onStop={onStop ? () => onStop(agent.id) : undefined}
              onViewDetails={
                onViewDetails ? () => onViewDetails(agent.id) : undefined
              }
            />
          ))
        ) : (
          <EmptyState
            icon={<Bot className="w-8 h-8" />}
            title="No active agents"
            description="Deploy an agent from the roster to get started."
          />
        )}
      </div>
    </div>
  );
}
