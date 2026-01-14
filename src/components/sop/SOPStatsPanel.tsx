/**
 * SOP Stats Panel Component
 *
 * Displays statistics cards for SOPs including total count,
 * active/draft breakdown, rules count, and trigger metrics.
 */

import { FileText, CheckCircle, Clock, Zap, GitBranch } from 'lucide-react';

export interface SOPStatsData {
  total: number;
  active: number;
  draft: number;
  rulesCount: number;
  triggersCount: number;
}

export interface SOPStatsPanelProps {
  stats: SOPStatsData;
  onStatClick?: (stat: keyof SOPStatsData) => void;
  className?: string;
}

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  onClick?: () => void;
}

function StatCard({ label, value, icon, color, onClick }: StatCardProps): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`
        flex items-center gap-3 p-4 rounded-lg border border-zinc-800 bg-zinc-900/50
        transition-all duration-200
        ${onClick ? 'hover:bg-zinc-800/50 hover:border-zinc-700 cursor-pointer' : 'cursor-default'}
      `}
    >
      <div className={`p-2 rounded-lg ${color}`}>
        {icon}
      </div>
      <div className="text-left">
        <p className="text-2xl font-semibold text-white">{value.toLocaleString()}</p>
        <p className="text-sm text-zinc-400">{label}</p>
      </div>
    </button>
  );
}

export function SOPStatsPanel({ stats, onStatClick, className = '' }: SOPStatsPanelProps): JSX.Element {
  const statCards = [
    {
      key: 'total' as const,
      label: 'Total SOPs',
      value: stats.total,
      icon: <FileText className="w-5 h-5 text-blue-400" />,
      color: 'bg-blue-500/10',
    },
    {
      key: 'active' as const,
      label: 'Active',
      value: stats.active,
      icon: <CheckCircle className="w-5 h-5 text-green-400" />,
      color: 'bg-green-500/10',
    },
    {
      key: 'draft' as const,
      label: 'Draft',
      value: stats.draft,
      icon: <Clock className="w-5 h-5 text-yellow-400" />,
      color: 'bg-yellow-500/10',
    },
    {
      key: 'rulesCount' as const,
      label: 'Total Rules',
      value: stats.rulesCount,
      icon: <GitBranch className="w-5 h-5 text-purple-400" />,
      color: 'bg-purple-500/10',
    },
    {
      key: 'triggersCount' as const,
      label: 'Triggers Fired',
      value: stats.triggersCount,
      icon: <Zap className="w-5 h-5 text-orange-400" />,
      color: 'bg-orange-500/10',
    },
  ];

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 ${className}`}>
      {statCards.map((card) => (
        <StatCard
          key={card.key}
          label={card.label}
          value={card.value}
          icon={card.icon}
          color={card.color}
          onClick={onStatClick ? () => onStatClick(card.key) : undefined}
        />
      ))}
    </div>
  );
}

export default SOPStatsPanel;
