/**
 * TrainingDashboard Component
 *
 * Main dashboard for Shadow Mode Training featuring boot camp progress,
 * personality configuration, style library, and session management.
 */

import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  GraduationCap,
  Sliders,
  BookOpen,
  Activity,
  ChevronLeft,
  TrendingUp,
  Clock,
  Target,
  Zap,
} from 'lucide-react';
import clsx from 'clsx';
import { useTrainingStore } from './trainingStore';
import { BootCampProgress } from './BootCampProgress';
import { PersonalitySliders } from './PersonalitySliders';
import { StyleLibrary } from './StyleLibrary';
import { SessionLog } from './SessionLog';

// ============================================================================
// Types
// ============================================================================

type TrainingTab = 'bootcamp' | 'personality' | 'styles' | 'sessions';

// ============================================================================
// Tab Configuration
// ============================================================================

const TABS: { id: TrainingTab; label: string; icon: typeof GraduationCap }[] = [
  { id: 'bootcamp', label: 'Boot Camp', icon: GraduationCap },
  { id: 'personality', label: 'Personality', icon: Sliders },
  { id: 'styles', label: 'Style Library', icon: BookOpen },
  { id: 'sessions', label: 'Sessions', icon: Activity },
];

// ============================================================================
// Stats Overview Component
// ============================================================================

function StatsOverview() {
  const { getTrainingStats, getSelectedCognate } = useTrainingStore();
  const stats = getTrainingStats();
  const cognate = getSelectedCognate();

  if (!stats || !cognate) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-4 h-4 text-purple-400" />
          <span className="text-xs text-muted-foreground">Progress</span>
        </div>
        <p className="text-2xl font-bold text-muted-foreground">{stats.overallProgress}%</p>
      </div>
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-4 h-4 text-blue-400" />
          <span className="text-xs text-muted-foreground">Hours Trained</span>
        </div>
        <p className="text-2xl font-bold text-muted-foreground">{stats.totalHours.toFixed(1)}</p>
      </div>
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-4 h-4 text-green-400" />
          <span className="text-xs text-muted-foreground">Patterns Learned</span>
        </div>
        <p className="text-2xl font-bold text-muted-foreground">{stats.patternsLearned}</p>
      </div>
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <span className="text-xs text-muted-foreground">Sessions</span>
        </div>
        <p className="text-2xl font-bold text-muted-foreground">{stats.totalSessions}</p>
      </div>
    </div>
  );
}

// ============================================================================
// Cognate Selector Component
// ============================================================================

function CognateSelector() {
  const { cognates, selectedCognateId, selectCognate } = useTrainingStore();

  return (
    <div className="bg-card border border-border rounded-xl p-4 mb-6">
      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
        Select Cognate
      </h3>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {cognates.map((cognate) => (
          <button
            key={cognate.id}
            onClick={() => selectCognate(cognate.id)}
            className={clsx(
              'flex items-center gap-3 px-4 py-3 rounded-lg border transition-all whitespace-nowrap',
              selectedCognateId === cognate.id
                ? 'bg-purple-600/20 border-purple-500'
                : 'bg-surface-base border-border hover:border-border'
            )}
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-bold">
              {cognate.avatar}
            </div>
            <div className="text-left">
              <p className="font-medium text-muted-foreground">{cognate.name}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Week {cognate.currentWeek}</span>
                <span>•</span>
                <span>{cognate.shadowProgress}%</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function TrainingDashboard() {
  const { id: cognateId } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<TrainingTab>('bootcamp');
  const { selectCognate, getSelectedCognate } = useTrainingStore();

  // Select cognate from URL param if provided
  if (cognateId) {
    selectCognate(cognateId);
  }

  const selectedCognate = getSelectedCognate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link to="/studio/cognates" className="hover:text-muted-foreground flex items-center gap-1">
              <ChevronLeft className="w-4 h-4" />
              Cognates
            </Link>
            <span>/</span>
            <span>{selectedCognate?.name ?? 'Training'}</span>
          </div>
          <h1 className="text-2xl font-bold text-muted-foreground flex items-center gap-2">
            <GraduationCap className="w-7 h-7 text-purple-400" />
            Shadow Mode Training
          </h1>
          <p className="text-muted-foreground mt-1">
            Train your Cognate through the 6-week boot camp program
          </p>
        </div>
      </div>

      {/* Cognate Selector */}
      <CognateSelector />

      {/* Stats Overview */}
      <StatsOverview />

      {/* Tab Navigation */}
      <div className="border-b border-border">
        <div className="flex gap-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  'px-4 py-3 flex items-center gap-2 text-sm font-medium transition-colors border-b-2 -mb-px',
                  activeTab === tab.id
                    ? 'text-purple-400 border-purple-400'
                    : 'text-muted-foreground border-transparent hover:text-muted-foreground'
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[500px]">
        {activeTab === 'bootcamp' && <BootCampProgress />}
        {activeTab === 'personality' && <PersonalitySliders />}
        {activeTab === 'styles' && <StyleLibrary />}
        {activeTab === 'sessions' && <SessionLog />}
      </div>
    </div>
  );
}

export default TrainingDashboard;
