/**
 * ConcordSessionSetup Component
 *
 * Configuration wizard for AI-to-AI collaboration sessions.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Plus,
  X,
  Target,
  Scale,
  Lightbulb,
  ClipboardCheck,
  Calendar,
  RotateCcw,
  Play,
  Sliders,
  ChevronRight,
  DollarSign,
  Clock,
  CheckSquare,
  Trash2,
} from 'lucide-react';
import clsx from 'clsx';
import { useConcordStore } from './concordStore';
import { SESSION_TYPES, SESSION_TEMPLATES, type CognateForConcord } from './types';

// ============================================================================
// Icon Map
// ============================================================================

const ICON_MAP: Record<string, typeof Target> = {
  Target,
  Scale,
  Lightbulb,
  ClipboardCheck,
  Calendar,
  RotateCcw,
};

// ============================================================================
// Participant Card Component
// ============================================================================

interface ParticipantCardProps {
  participant: {
    cognateId: string;
    name: string;
    role: string;
    avatar: string;
    represents: string;
    goal: string;
    assertiveness: number;
    flexibility: number;
  };
  onRemove: () => void;
  onUpdateGoal: (goal: string) => void;
  onUpdateAssertiveness: (value: number) => void;
  onUpdateFlexibility: (value: number) => void;
}

function ParticipantCard({
  participant,
  onRemove,
  onUpdateGoal,
  onUpdateAssertiveness,
  onUpdateFlexibility,
}: ParticipantCardProps) {
  return (
    <div className="p-4 bg-surface-base rounded-xl">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-2xl">
          {participant.avatar}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-muted-foreground">
                {participant.name} ({participant.role})
              </p>
              <p className="text-sm text-muted-foreground">Represents: {participant.represents}</p>
            </div>
            <button
              onClick={onRemove}
              className="p-1.5 text-muted-foreground hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3">
            <label className="text-xs text-muted-foreground mb-1 block">Goal</label>
            <input
              type="text"
              value={participant.goal}
              onChange={(e) => onUpdateGoal(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-card rounded-lg border border-border focus:border-purple-500 outline-none text-muted-foreground"
            />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">Assertiveness</span>
                <span className="font-medium text-muted-foreground">{participant.assertiveness}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={participant.assertiveness}
                onChange={(e) => onUpdateAssertiveness(parseInt(e.target.value))}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
            </div>
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">Flexibility</span>
                <span className="font-medium text-muted-foreground">{participant.flexibility}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={participant.flexibility}
                onChange={(e) => onUpdateFlexibility(parseInt(e.target.value))}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Add Participant Modal
// ============================================================================

interface AddParticipantModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableCognates: CognateForConcord[];
  existingParticipantIds: string[];
  onAdd: (cognate: CognateForConcord) => void;
}

function AddParticipantModal({
  isOpen,
  onClose,
  availableCognates,
  existingParticipantIds,
  onAdd,
}: AddParticipantModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-surface-base rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden border border-border">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-muted-foreground">Add Cognate to Session</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-card rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableCognates.map((cognate) => {
              const isAdded = existingParticipantIds.includes(cognate.id);
              return (
                <button
                  key={cognate.id}
                  onClick={() => {
                    if (!isAdded) {
                      onAdd(cognate);
                      onClose();
                    }
                  }}
                  disabled={isAdded}
                  className={clsx(
                    'p-4 text-left rounded-xl border-2 transition-all',
                    isAdded
                      ? 'border-border bg-card/50 opacity-50 cursor-not-allowed'
                      : 'border-border hover:border-purple-500 hover:bg-purple-500/10'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-2xl">
                      {cognate.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-muted-foreground">{cognate.name}</p>
                      <p className="text-sm text-muted-foreground">{cognate.role}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Represents: {cognate.represents}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {cognate.expertise.slice(0, 2).map((exp) => (
                          <span
                            key={exp}
                            className="text-xs px-2 py-0.5 bg-card rounded-full text-muted-foreground"
                          >
                            {exp}
                          </span>
                        ))}
                      </div>
                    </div>
                    {isAdded && (
                      <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-lg">
                        Added
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function ConcordSessionSetup() {
  const navigate = useNavigate();
  const [showAddParticipant, setShowAddParticipant] = useState(false);

  const {
    sessionType,
    topic,
    participants,
    constraints,
    availableCognates,
    setSessionType,
    setTopic,
    setConstraints,
    addParticipant,
    removeParticipant,
    updateParticipant,
    loadTemplate,
    startSession,
  } = useConcordStore();

  const handleStartSession = () => {
    if (!topic.trim()) {
      alert('Please enter a session topic');
      return;
    }
    if (participants.length < 2) {
      alert('Please add at least 2 Cognates to the session');
      return;
    }
    startSession();
    navigate('/governance/concord/live');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-muted-foreground">
            <Users className="w-7 h-7 text-purple-400" />
            Concord Session Setup
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure AI-to-AI collaboration sessions
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Session Type */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2 text-muted-foreground">
              <Target className="w-5 h-5 text-purple-400" />
              Session Type
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {SESSION_TYPES.map((type) => {
                const Icon = ICON_MAP[type.icon] || Target;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSessionType(type.id)}
                    className={clsx(
                      'p-4 rounded-xl border-2 text-left transition-all',
                      sessionType === type.id
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-border hover:border-border'
                    )}
                  >
                    <div className={clsx('w-10 h-10 rounded-lg flex items-center justify-center mb-2', type.color)}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <p className="font-medium text-muted-foreground">{type.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{type.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Topic */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold mb-4 text-muted-foreground">Session Topic</h2>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Q1 Marketing Budget Allocation"
              className="w-full px-4 py-3 bg-surface-base rounded-xl border border-border focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all text-muted-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Participants */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold flex items-center gap-2 text-muted-foreground">
                <Users className="w-5 h-5 text-purple-400" />
                Participants ({participants.length})
              </h2>
              <button
                onClick={() => setShowAddParticipant(true)}
                className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Cognate
              </button>
            </div>

            {participants.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No participants added yet</p>
                <p className="text-sm">Add at least 2 Cognates to start</p>
              </div>
            ) : (
              <div className="space-y-4">
                {participants.map((participant) => (
                  <ParticipantCard
                    key={participant.cognateId}
                    participant={participant}
                    onRemove={() => removeParticipant(participant.cognateId)}
                    onUpdateGoal={(goal) =>
                      updateParticipant(participant.cognateId, { goal })
                    }
                    onUpdateAssertiveness={(assertiveness) =>
                      updateParticipant(participant.cognateId, { assertiveness })
                    }
                    onUpdateFlexibility={(flexibility) =>
                      updateParticipant(participant.cognateId, { flexibility })
                    }
                  />
                ))}
              </div>
            )}
          </div>

          {/* Constraints */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2 text-muted-foreground">
              <Sliders className="w-5 h-5 text-purple-400" />
              Constraints
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  Total Budget (optional)
                </label>
                <input
                  type="text"
                  value={constraints.totalBudget}
                  onChange={(e) => setConstraints({ totalBudget: e.target.value })}
                  placeholder="$150,000"
                  className="w-full px-3 py-2 bg-surface-base rounded-lg border border-border focus:border-purple-500 outline-none text-muted-foreground"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Time Limit: {constraints.timeLimit} min
                </label>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={constraints.timeLimit}
                  onChange={(e) => setConstraints({ timeLimit: parseInt(e.target.value) })}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block flex items-center gap-1">
                  <CheckSquare className="w-4 h-4" />
                  Consensus Mode
                </label>
                <button
                  onClick={() =>
                    setConstraints({ consensusRequired: !constraints.consensusRequired })
                  }
                  className={clsx(
                    'w-full px-3 py-2 rounded-lg border text-left transition-colors',
                    constraints.consensusRequired
                      ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                      : 'bg-surface-base border-border text-muted-foreground'
                  )}
                >
                  {constraints.consensusRequired ? 'Consensus Required' : 'Majority Wins'}
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => navigate('/governance/concord')}
              className="px-4 py-2 bg-card border border-border rounded-xl hover:bg-muted transition-colors text-muted-foreground"
            >
              Cancel
            </button>
            <button
              onClick={handleStartSession}
              className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors flex items-center gap-2 font-medium"
            >
              <Play className="w-4 h-4" />
              Start Session
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Templates */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-semibold mb-4 text-muted-foreground">Quick Templates</h3>
            <div className="space-y-2">
              {SESSION_TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  onClick={() => loadTemplate(template.id)}
                  className="w-full p-3 text-left rounded-lg border border-border hover:border-purple-500 hover:bg-purple-500/10 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm text-muted-foreground">{template.name}</p>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* How it works */}
          <div className="bg-gradient-to-br from-purple-900/20 to-zinc-800 rounded-xl border border-purple-700/50 p-5">
            <h3 className="font-semibold mb-3 text-muted-foreground">How Concord Works</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              {[
                'Each Cognate represents a stakeholder\'s interests',
                'Cognates discuss and negotiate autonomously',
                'Watch in real-time and intervene if needed',
                'Full transparency: view reasoning traces',
              ].map((step, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-purple-400">{idx + 1}</span>
                  </div>
                  <p>{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Participant Modal */}
      <AddParticipantModal
        isOpen={showAddParticipant}
        onClose={() => setShowAddParticipant(false)}
        availableCognates={availableCognates}
        existingParticipantIds={participants.map((p) => p.cognateId)}
        onAdd={addParticipant}
      />
    </div>
  );
}

export default ConcordSessionSetup;
