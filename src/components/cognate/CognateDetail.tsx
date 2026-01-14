/**
 * CognateDetail Component
 *
 * Full detail view for a selected Cognate.
 * Displays all card info expanded, full skill list, personality sliders,
 * assigned SOPs, recent activity/performance stats, and edit button.
 */

import { useState } from 'react';
import {
  Brain,
  Settings,
  FileText,
  Activity,
  Clock,
  CheckCircle,
  TrendingUp,
  Calendar,
  X,
} from 'lucide-react';
import clsx from 'clsx';
import type { ExtendedCognate, PersonalityTrait } from './types';
import { AVAILABILITY_STATUS_CONFIG } from './types';
import { XPProgressBar } from './XPProgressBar';
import { AutonomyLevelIndicator } from './AutonomyLevelIndicator';
import { SkillList } from './SkillBadges';
import { PersonalitySliders } from './PersonalitySliders';

interface CognateDetailProps {
  cognate: ExtendedCognate;
  onClose?: () => void;
  onEdit?: (cognate: ExtendedCognate) => void;
  onPersonalityChange?: (cognate: ExtendedCognate, trait: PersonalityTrait, value: number) => void;
  className?: string;
  isEditable?: boolean;
}

export function CognateDetail({
  cognate,
  onClose,
  onEdit,
  onPersonalityChange,
  className,
  isEditable = false,
}: CognateDetailProps): JSX.Element {
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'personality' | 'sops' | 'activity'>('overview');

  const handlePersonalityChange = (trait: PersonalityTrait, value: number): void => {
    if (onPersonalityChange) {
      onPersonalityChange(cognate, trait, value);
    }
  };

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: Brain },
    { id: 'skills' as const, label: 'Skills', icon: TrendingUp },
    { id: 'personality' as const, label: 'Personality', icon: Activity },
    { id: 'sops' as const, label: 'SOPs', icon: FileText },
    { id: 'activity' as const, label: 'Activity', icon: Clock },
  ];

  return (
    <div
      className={clsx(
        'bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden',
        className
      )}
    >
      {/* Header */}
      <div className="p-6 border-b border-zinc-800">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            {cognate.avatar ? (
              <img
                src={cognate.avatar}
                alt={cognate.name}
                className="w-16 h-16 rounded-xl object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Brain className="w-8 h-8 text-white" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-white">{cognate.name}</h2>
                <StatusBadge status={cognate.availability} />
              </div>
              <p className="text-zinc-400">{cognate.role || 'No role assigned'}</p>
              {cognate.industry && (
                <p className="text-sm text-zinc-500">{cognate.industry}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                type="button"
                onClick={(): void => onEdit(cognate)}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
              >
                <Settings className="w-4 h-4" />
                Configure
              </button>
            )}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Description */}
        {cognate.description && (
          <p className="mt-4 text-zinc-400">{cognate.description}</p>
        )}

        {/* Autonomy Level */}
        <div className="mt-4">
          <AutonomyLevelIndicator level={cognate.autonomyLevel} showDescription />
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-zinc-800">
        <nav className="flex px-6" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={(): void => setActiveTab(tab.id)}
              className={clsx(
                'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                activeTab === tab.id
                  ? 'text-symtex-primary border-symtex-primary'
                  : 'text-zinc-400 border-transparent hover:text-white'
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <OverviewTab cognate={cognate} />
        )}
        {activeTab === 'skills' && (
          <SkillsTab cognate={cognate} />
        )}
        {activeTab === 'personality' && (
          <PersonalityTab
            cognate={cognate}
            isEditable={isEditable}
            onPersonalityChange={handlePersonalityChange}
          />
        )}
        {activeTab === 'sops' && (
          <SOPsTab cognate={cognate} />
        )}
        {activeTab === 'activity' && (
          <ActivityTab cognate={cognate} />
        )}
      </div>
    </div>
  );
}

// Status badge component
interface StatusBadgeProps {
  status: ExtendedCognate['availability'];
}

function StatusBadge({ status }: StatusBadgeProps): JSX.Element {
  const config = AVAILABILITY_STATUS_CONFIG[status];
  return (
    <span
      className={clsx(
        'flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium',
        config.color,
        'bg-slate-800/50'
      )}
    >
      <span className={clsx('w-2 h-2 rounded-full', config.dotColor)} />
      {config.label}
    </span>
  );
}

// Tab content components
function OverviewTab({ cognate }: { cognate: ExtendedCognate }): JSX.Element {
  return (
    <div className="space-y-6">
      {/* XP Progress */}
      <div>
        <h3 className="text-sm font-medium text-zinc-400 mb-3">Experience Progress</h3>
        <XPProgressBar
          xp={cognate.xp}
          level={cognate.level}
          size="lg"
          showMilestones
        />
      </div>

      {/* Quick Stats */}
      <div>
        <h3 className="text-sm font-medium text-zinc-400 mb-3">Performance</h3>
        <div className="grid grid-cols-3 gap-4">
          <StatCard
            icon={CheckCircle}
            label="Tasks Completed"
            value={cognate.tasksCompleted.toString()}
          />
          <StatCard
            icon={TrendingUp}
            label="Success Rate"
            value={`${Math.round(cognate.successRate)}%`}
          />
          <StatCard
            icon={FileText}
            label="Assigned SOPs"
            value={cognate.assignedSOPs.length.toString()}
          />
        </div>
      </div>

      {/* Timestamps */}
      <div>
        <h3 className="text-sm font-medium text-zinc-400 mb-3">Activity</h3>
        <div className="space-y-2">
          {cognate.lastActiveAt && (
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Clock className="w-4 h-4" />
              <span>Last active: {new Date(cognate.lastActiveAt).toLocaleString()}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Calendar className="w-4 h-4" />
            <span>Created: {new Date(cognate.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SkillsTab({ cognate }: { cognate: ExtendedCognate }): JSX.Element {
  return (
    <div>
      <h3 className="text-sm font-medium text-zinc-400 mb-3">
        Skills ({cognate.skills.length})
      </h3>
      {cognate.skills.length > 0 ? (
        <SkillList skills={cognate.skills} />
      ) : (
        <p className="text-zinc-500 text-sm">No skills configured yet.</p>
      )}
    </div>
  );
}

interface PersonalityTabProps {
  cognate: ExtendedCognate;
  isEditable: boolean;
  onPersonalityChange: (trait: PersonalityTrait, value: number) => void;
}

function PersonalityTab({ cognate, isEditable, onPersonalityChange }: PersonalityTabProps): JSX.Element {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-zinc-400">Personality Configuration</h3>
        {isEditable && (
          <span className="text-xs text-zinc-500">Click and drag sliders to adjust</span>
        )}
      </div>
      <PersonalitySliders
        values={cognate.personality}
        onChange={isEditable ? onPersonalityChange : undefined}
        readOnly={!isEditable}
      />
    </div>
  );
}

function SOPsTab({ cognate }: { cognate: ExtendedCognate }): JSX.Element {
  return (
    <div>
      <h3 className="text-sm font-medium text-zinc-400 mb-3">
        Assigned SOPs ({cognate.assignedSOPs.length})
      </h3>
      {cognate.assignedSOPs.length > 0 ? (
        <div className="space-y-2">
          {cognate.assignedSOPs.map((sopId) => (
            <div
              key={sopId}
              className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/50"
            >
              <FileText className="w-4 h-4 text-zinc-400" />
              <span className="text-sm text-white">{sopId}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-zinc-500 text-sm">No SOPs assigned yet.</p>
      )}
    </div>
  );
}

function ActivityTab({ cognate }: { cognate: ExtendedCognate }): JSX.Element {
  return (
    <div>
      <h3 className="text-sm font-medium text-zinc-400 mb-3">Recent Activity</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            icon={CheckCircle}
            label="Total Tasks"
            value={cognate.tasksCompleted.toString()}
          />
          <StatCard
            icon={TrendingUp}
            label="Success Rate"
            value={`${Math.round(cognate.successRate)}%`}
          />
        </div>
        <p className="text-zinc-500 text-sm text-center py-8">
          Detailed activity log coming soon...
        </p>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: typeof CheckCircle;
  label: string;
  value: string;
}

function StatCard({ icon: Icon, label, value }: StatCardProps): JSX.Element {
  return (
    <div className="p-4 rounded-lg bg-zinc-800/50">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-zinc-400" />
        <span className="text-xs text-zinc-400">{label}</span>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

export default CognateDetail;
