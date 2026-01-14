/**
 * Agent Instance Detail Component
 *
 * Displays comprehensive information about a running agent instance
 * including status, execution details, logs, and performance metrics.
 */

import { useState } from 'react';
import {
  Bot,
  X,
  Clock,
  Target,
  Activity,
  Terminal,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Pause,
  Play,
  Square,
  RefreshCw,
  Copy,
  ExternalLink,
} from 'lucide-react';
import clsx from 'clsx';
import type { AgentInstance, AgentExecution, AgentStatus, AgentTemplate } from '@/types';
import { Button } from '@/components/ui/Button';
import ProgressRing from '@/components/ui/ProgressRing';

interface AgentInstanceDetailProps {
  instance: AgentInstance;
  template?: AgentTemplate;
  executions?: AgentExecution[];
  missionName?: string;
  projectName?: string;
  onClose?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onStop?: () => void;
  onRestart?: () => void;
  onViewMission?: () => void;
}

type DetailTab = 'overview' | 'executions' | 'logs' | 'metrics';

// Status configuration
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

const tabs: { id: DetailTab; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: Bot },
  { id: 'executions', label: 'Executions', icon: Activity },
  { id: 'logs', label: 'Logs', icon: Terminal },
  { id: 'metrics', label: 'Metrics', icon: BarChart3 },
];

export default function AgentInstanceDetail({
  instance,
  template,
  executions = [],
  missionName,
  projectName,
  onClose,
  onPause,
  onResume,
  onStop,
  onRestart,
  onViewMission,
}: AgentInstanceDetailProps): JSX.Element {
  const [activeTab, setActiveTab] = useState<DetailTab>('overview');

  const status = statusConfig[instance.status];
  const StatusIcon = status.icon;
  const isActive = instance.status === 'running' || instance.status === 'busy';
  const isPaused = instance.status === 'paused';

  // Calculate metrics
  const successRate =
    instance.totalExecutions > 0
      ? Math.round((instance.successfulExecutions / instance.totalExecutions) * 100)
      : 0;

  const avgDuration =
    executions.length > 0
      ? Math.round(
          executions
            .filter((e) => e.duration)
            .reduce((sum, e) => sum + (e.duration || 0), 0) /
            executions.filter((e) => e.duration).length
        )
      : 0;

  // Format duration
  const formatDuration = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  // Format timestamp
  const formatTime = (iso?: string): string => {
    if (!iso) return '--';
    return new Date(iso).toLocaleString();
  };

  // Get current execution
  const currentExecution = executions.find(
    (e) => e.status === 'running' || e.status === 'paused'
  );

  const renderOverview = (): JSX.Element => (
    <div className="space-y-6">
      {/* Status Card */}
      <div className="bg-slate-800/50 rounded-xl p-4">
        <h4 className="text-sm font-medium text-slate-400 mb-3">Current Status</h4>
        <div className="flex items-center gap-4">
          <div className="relative">
            <ProgressRing
              progress={isActive ? 50 : 100}
              size={60}
              strokeWidth={4}
              showPercentage={false}
              color={isActive ? '#6366f1' : status.color.replace('text-', '#').replace('-400', '')}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <StatusIcon
                className={clsx(
                  'w-6 h-6',
                  status.color,
                  status.animate && 'animate-spin'
                )}
              />
            </div>
          </div>
          <div>
            <div
              className={clsx(
                'inline-flex items-center gap-2 px-3 py-1 rounded-full',
                status.bgColor
              )}
            >
              <span className={clsx('font-medium', status.color)}>
                {status.label}
              </span>
            </div>
            {instance.startedAt && (
              <p className="text-sm text-slate-400 mt-1">
                Started: {formatTime(instance.startedAt)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Mission Info */}
      {missionName && (
        <div className="bg-slate-800/50 rounded-xl p-4">
          <h4 className="text-sm font-medium text-slate-400 mb-3">
            Assigned Mission
          </h4>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-symtex-primary" />
              <div>
                <p className="font-medium text-white">{missionName}</p>
                {projectName && (
                  <p className="text-sm text-slate-400">{projectName}</p>
                )}
              </div>
            </div>
            {onViewMission && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onViewMission}
                rightIcon={<ExternalLink className="w-4 h-4" />}
              >
                View
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Current Task */}
      {currentExecution?.input && (
        <div className="bg-slate-800/50 rounded-xl p-4">
          <h4 className="text-sm font-medium text-slate-400 mb-3">
            Current Task
          </h4>
          <p className="text-white">{currentExecution.input}</p>
        </div>
      )}

      {/* Template Info */}
      {template && (
        <div className="bg-slate-800/50 rounded-xl p-4">
          <h4 className="text-sm font-medium text-slate-400 mb-3">
            Agent Template
          </h4>
          <div className="flex items-center gap-3 mb-3">
            <Bot className="w-5 h-5 text-symtex-primary" />
            <span className="font-medium text-white">{template.name}</span>
          </div>
          <p className="text-sm text-slate-400 mb-3">{template.description}</p>
          <div className="flex flex-wrap gap-2">
            {template.capabilities.map((cap) => (
              <span
                key={cap}
                className="text-xs px-2 py-1 rounded bg-slate-700/50 text-slate-300"
              >
                {cap}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-800/50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-white">
            {instance.totalExecutions}
          </p>
          <p className="text-sm text-slate-400">Total Runs</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-green-400">{successRate}%</p>
          <p className="text-sm text-slate-400">Success Rate</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-white">
            {formatDuration(avgDuration)}
          </p>
          <p className="text-sm text-slate-400">Avg Duration</p>
        </div>
      </div>
    </div>
  );

  const renderExecutions = (): JSX.Element => (
    <div className="space-y-3">
      {executions.length > 0 ? (
        executions.map((execution) => {
          const execStatus =
            execution.status === 'completed'
              ? 'success'
              : execution.status === 'failed'
                ? 'error'
                : 'running';

          return (
            <div
              key={execution.id}
              className="bg-slate-800/50 rounded-lg p-4 border border-slate-700"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {execStatus === 'success' && (
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                  )}
                  {execStatus === 'error' && (
                    <AlertCircle className="w-4 h-4 text-red-400" />
                  )}
                  {execStatus === 'running' && (
                    <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                  )}
                  <span className="text-sm text-slate-300">
                    {execution.id.slice(0, 8)}
                  </span>
                </div>
                <span className="text-xs text-slate-500">
                  {formatTime(execution.startedAt)}
                </span>
              </div>
              {execution.input && (
                <p className="text-sm text-slate-400 mb-2 line-clamp-2">
                  {execution.input}
                </p>
              )}
              {execution.duration && (
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Clock className="w-3 h-3" />
                  {formatDuration(execution.duration)}
                </div>
              )}
              {execution.error && (
                <p className="text-sm text-red-400 mt-2">{execution.error}</p>
              )}
            </div>
          );
        })
      ) : (
        <div className="text-center py-8 text-slate-400">
          No executions recorded yet.
        </div>
      )}
    </div>
  );

  const renderLogs = (): JSX.Element => (
    <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-slate-400">Output Log</span>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => {
            navigator.clipboard.writeText(
              executions.map((e) => e.output || '').join('\n')
            );
          }}
        >
          <Copy className="w-4 h-4" />
        </Button>
      </div>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {executions.length > 0 ? (
          executions.map((execution, idx) => (
            <div key={execution.id} className="text-slate-300">
              <span className="text-slate-600">[{idx + 1}] </span>
              {execution.output || '(no output)'}
            </div>
          ))
        ) : (
          <div className="text-slate-500">No logs available.</div>
        )}
      </div>
    </div>
  );

  const renderMetrics = (): JSX.Element => {
    const completedExecutions = executions.filter(
      (e) => e.status === 'completed' || e.status === 'failed'
    );
    const recentExecutions = completedExecutions.slice(0, 10);

    return (
      <div className="space-y-6">
        {/* Performance Overview */}
        <div className="bg-slate-800/50 rounded-xl p-4">
          <h4 className="text-sm font-medium text-slate-400 mb-4">
            Performance Overview
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                Success Rate
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${successRate}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-white">
                  {successRate}%
                </span>
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                Avg Response Time
              </p>
              <p className="text-lg font-semibold text-white">
                {formatDuration(avgDuration)}
              </p>
            </div>
          </div>
        </div>

        {/* Recent Execution Times */}
        {recentExecutions.length > 0 && (
          <div className="bg-slate-800/50 rounded-xl p-4">
            <h4 className="text-sm font-medium text-slate-400 mb-4">
              Recent Execution Times
            </h4>
            <div className="flex items-end gap-1 h-24">
              {recentExecutions.map((execution, idx) => {
                const maxDuration = Math.max(
                  ...recentExecutions.map((e) => e.duration || 1)
                );
                const height = ((execution.duration || 0) / maxDuration) * 100;
                const isSuccess = execution.status === 'completed';

                return (
                  <div
                    key={execution.id}
                    className="flex-1 flex flex-col justify-end"
                    title={`${formatDuration(execution.duration || 0)}`}
                  >
                    <div
                      className={clsx(
                        'rounded-t transition-all',
                        isSuccess ? 'bg-green-500' : 'bg-red-500'
                      )}
                      style={{ height: `${Math.max(height, 5)}%` }}
                    />
                    <span className="text-xs text-slate-500 text-center mt-1">
                      {idx + 1}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Timestamps */}
        <div className="bg-slate-800/50 rounded-xl p-4">
          <h4 className="text-sm font-medium text-slate-400 mb-3">
            Activity Timeline
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Created</span>
              <span className="text-white">{formatTime(instance.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Last Active</span>
              <span className="text-white">
                {formatTime(instance.lastActiveAt)}
              </span>
            </div>
            {instance.completedAt && (
              <div className="flex justify-between">
                <span className="text-slate-400">Completed</span>
                <span className="text-white">
                  {formatTime(instance.completedAt)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-symtex-card border-l border-symtex-border">
      {/* Header */}
      <div className="p-4 border-b border-symtex-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-symtex-primary/10 flex items-center justify-center">
              <Bot className="w-5 h-5 text-symtex-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-white">
                {template?.name || `Agent ${instance.id.slice(0, 8)}`}
              </h3>
              <span className="text-sm text-slate-400">
                ID: {instance.id.slice(0, 12)}...
              </span>
            </div>
          </div>
          {onClose && (
            <Button variant="ghost" size="icon-sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {isActive && onPause && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onPause}
              leftIcon={<Pause className="w-4 h-4" />}
            >
              Pause
            </Button>
          )}
          {isPaused && onResume && (
            <Button
              variant="primary"
              size="sm"
              onClick={onResume}
              leftIcon={<Play className="w-4 h-4" />}
            >
              Resume
            </Button>
          )}
          {(isActive || isPaused) && onStop && (
            <Button
              variant="danger"
              size="sm"
              onClick={onStop}
              leftIcon={<Square className="w-4 h-4" />}
            >
              Stop
            </Button>
          )}
          {onRestart && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRestart}
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              Restart
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-symtex-border">
        {tabs.map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                'flex-1 flex items-center justify-center gap-2 px-4 py-3',
                'transition-colors duration-200',
                isActive
                  ? 'text-symtex-primary border-b-2 border-symtex-primary'
                  : 'text-slate-400 hover:text-white'
              )}
              aria-selected={isActive}
            >
              <TabIcon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'executions' && renderExecutions()}
        {activeTab === 'logs' && renderLogs()}
        {activeTab === 'metrics' && renderMetrics()}
      </div>
    </div>
  );
}
