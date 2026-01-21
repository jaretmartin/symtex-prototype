/**
 * CommandCenter Component
 *
 * Admin governance dashboard showing system health, active missions,
 * Cognate distribution, and emergency controls.
 *
 * @module CommandCenter
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Bot,
  Coins,
  Pause,
  AlertTriangle,
  RefreshCw,
  Settings,
  Download,
  Zap,
  Users,
  Power,
} from 'lucide-react';
import clsx from 'clsx';
import { SystemHealthGauge } from './SystemHealthGauge';
import { LiveMissionFeed } from './LiveMissionFeed';

/** Autonomy level identifiers (L0-L4) */
type AutonomyLevelId = 'L0' | 'L1' | 'L2' | 'L3' | 'L4';

// =============================================================================
// Types
// =============================================================================

interface QuickStat {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: 'purple' | 'green' | 'blue' | 'amber' | 'red';
  trend?: { positive: boolean; value: string };
}

// =============================================================================
// Mock Data
// =============================================================================

const mockSystemHealth = {
  health: 94,
  status: 'healthy' as const,
  lastUpdated: new Date(),
};

const mockQuickStats: QuickStat[] = [
  { label: 'Active Cognates', value: 12, icon: Bot, color: 'purple', trend: { positive: true, value: '+2 this week' } },
  { label: 'Missions Today', value: 1234, icon: Zap, color: 'green', trend: { positive: true, value: '+15%' } },
  { label: 'Token Usage', value: '$45.20', icon: Coins, color: 'blue' },
  { label: 'Stuck Missions', value: 3, icon: AlertTriangle, color: 'amber' },
];

const mockCognateDistribution: Record<AutonomyLevelId, number> = {
  L0: 2,
  L1: 3,
  L2: 5,
  L3: 4,
  L4: 1,
};

const mockMissions: import('./types').LiveMission[] = [
  {
    id: 'mission-001',
    name: 'Customer Outreach Campaign',
    cognateName: 'Sales Assistant',
    cognateAvatar: '🤖',
    autonomyLevel: 2,
    owner: 'Sarah Chen',
    status: 'running',
    progress: 65,
    actionsCompleted: 23,
    actionsPending: 12,
    startedAt: '2026-01-20T09:00:00Z',
    estimatedCompletion: '2026-01-20T14:00:00Z',
  },
  {
    id: 'mission-002',
    name: 'Data Analysis Report',
    cognateName: 'Research Analyst',
    cognateAvatar: '📊',
    autonomyLevel: 3,
    owner: 'Mike Johnson',
    status: 'paused',
    progress: 45,
    actionsCompleted: 15,
    actionsPending: 18,
    pauseReason: 'Awaiting data source access',
    startedAt: '2026-01-20T08:30:00Z',
  },
  {
    id: 'mission-003',
    name: 'Invoice Processing Batch',
    cognateName: 'Finance Bot',
    cognateAvatar: '💰',
    autonomyLevel: 4,
    owner: 'Emily Davis',
    status: 'stuck',
    progress: 78,
    actionsCompleted: 42,
    actionsPending: 12,
    stuckReason: 'Duplicate invoice detected, needs human review',
    startedAt: '2026-01-20T07:00:00Z',
  },
];

// =============================================================================
// StatCard Component
// =============================================================================

interface StatCardProps {
  stat: QuickStat;
  onClick?: () => void;
}

function StatCard({ stat, onClick }: StatCardProps) {
  const Icon = stat.icon;
  const colorClasses = {
    purple: 'bg-purple-900/30 text-purple-400',
    green: 'bg-green-900/30 text-green-400',
    blue: 'bg-blue-900/30 text-blue-400',
    amber: 'bg-amber-900/30 text-amber-400',
    red: 'bg-red-900/30 text-red-400',
  };

  return (
    <div
      className={clsx(
        'bg-card border border-border rounded-xl p-5',
        onClick && 'cursor-pointer hover:border-purple-500 transition-colors'
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <div className={clsx('w-12 h-12 rounded-xl flex items-center justify-center', colorClasses[stat.color])}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">{stat.label}</p>
          <p className="text-2xl font-bold text-muted-foreground">{stat.value}</p>
          {stat.trend && (
            <p className={clsx('text-sm mt-1', stat.trend.positive ? 'text-green-400' : 'text-red-400')}>
              {stat.trend.positive ? '↑' : '↓'} {stat.trend.value}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// CognateDistribution Component
// =============================================================================

function CognateDistribution({ distribution }: { distribution: Record<AutonomyLevelId, number> }) {
  const levels: { id: AutonomyLevelId; name: string; color: string }[] = [
    { id: 'L0', name: 'Observer', color: 'bg-muted' },
    { id: 'L1', name: 'Suggester', color: 'bg-blue-500' },
    { id: 'L2', name: 'Drafter', color: 'bg-amber-500' },
    { id: 'L3', name: 'Executor', color: 'bg-orange-500' },
    { id: 'L4', name: 'Chief of Staff', color: 'bg-green-500' },
  ];

  const total = Object.values(distribution).reduce((a, b) => a + b, 0);

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="font-semibold mb-4 flex items-center gap-2 text-muted-foreground">
        <Users className="w-5 h-5 text-purple-400" />
        Cognates by Level
      </h3>
      <div className="space-y-3">
        {levels.map((level) => {
          const count = distribution[level.id] || 0;
          const percentage = total > 0 ? (count / total) * 100 : 0;
          return (
            <div key={level.id} className="flex items-center gap-3">
              <span className="w-8 text-sm font-medium text-muted-foreground">{level.id}</span>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={clsx('h-full rounded-full transition-all', level.color)}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-8 text-sm text-muted-foreground text-right">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// =============================================================================
// QuickActions Component
// =============================================================================

interface QuickActionsProps {
  onPauseAll: () => void;
  onEmergencyStop: () => void;
  onExportAudit: () => void;
}

function QuickActions({ onPauseAll, onEmergencyStop, onExportAudit }: QuickActionsProps) {
  const [showEmergencyConfirm, setShowEmergencyConfirm] = useState(false);

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="font-semibold mb-4 flex items-center gap-2 text-muted-foreground">
        <Settings className="w-5 h-5 text-purple-400" />
        Quick Actions
      </h3>
      <div className="space-y-3">
        <button
          onClick={onPauseAll}
          className="w-full px-4 py-3 bg-amber-900/20 border border-amber-800 rounded-xl hover:bg-amber-900/30 transition-colors flex items-center gap-3 text-amber-400"
        >
          <Pause className="w-5 h-5" />
          <span className="font-medium">Pause All Missions</span>
        </button>
        
        {showEmergencyConfirm ? (
          <div className="p-4 bg-red-900/20 border border-red-800 rounded-xl">
            <p className="text-sm text-red-400 mb-3">Are you sure? This will halt all Cognate activity.</p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onEmergencyStop();
                  setShowEmergencyConfirm(false);
                }}
                className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Confirm Stop
              </button>
              <button
                onClick={() => setShowEmergencyConfirm(false)}
                className="flex-1 px-3 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowEmergencyConfirm(true)}
            className="w-full px-4 py-3 bg-red-900/20 border border-red-800 rounded-xl hover:bg-red-900/30 transition-colors flex items-center gap-3 text-red-400"
          >
            <Power className="w-5 h-5" />
            <span className="font-medium">Emergency Stop</span>
          </button>
        )}
        
        <button
          onClick={onExportAudit}
          className="w-full px-4 py-3 bg-surface-base border border-border rounded-xl hover:bg-muted transition-colors flex items-center gap-3 text-muted-foreground"
        >
          <Download className="w-5 h-5" />
          <span className="font-medium">Export Audit Log</span>
        </button>
      </div>
    </div>
  );
}

// =============================================================================
// CommandCenter Component
// =============================================================================

export function CommandCenter() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdated(new Date());
    }, 1000);
  };

  const handlePauseAll = () => {
    // TODO: Implement pause all missions functionality
  };

  const handleEmergencyStop = () => {
    // TODO: Implement emergency stop functionality
  };

  const handleExportAudit = () => {
    // TODO: Implement export audit log functionality
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-muted-foreground">
            <Shield className="w-7 h-7 text-purple-400" />
            Command Center
          </h1>
          <p className="text-muted-foreground mt-1">
            System overview and governance controls
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            Updated {lastUpdated.toLocaleTimeString()}
          </span>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 bg-card border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
          >
            <RefreshCw className={clsx('w-5 h-5 text-muted-foreground', isRefreshing && 'animate-spin')} />
          </button>
          <Link
            to="/governance"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Governance
          </Link>
        </div>
      </div>

      {/* System Health + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* System Health Gauge */}
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col items-center justify-center">
          <h3 className="font-semibold mb-4 text-muted-foreground">System Health</h3>
          <SystemHealthGauge health={mockSystemHealth.health} status={mockSystemHealth.status} />
        </div>

        {/* Quick Stats */}
        <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {mockQuickStats.map((stat, idx) => (
            <StatCard key={idx} stat={stat} />
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Mission Feed */}
        <div className="lg:col-span-2">
          <LiveMissionFeed missions={mockMissions} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <CognateDistribution distribution={mockCognateDistribution} />
          <QuickActions
            onPauseAll={handlePauseAll}
            onEmergencyStop={handleEmergencyStop}
            onExportAudit={handleExportAudit}
          />
        </div>
      </div>
    </div>
  );
}

export default CommandCenter;
