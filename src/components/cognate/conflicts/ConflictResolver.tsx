/**
 * ConflictResolver Component
 *
 * Guides users through resolving conflicts between SOP rules.
 * Shows conflicting rules side-by-side, overlap scenarios, and resolution strategies.
 *
 * @module ConflictResolver
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  AlertOctagon,
  ArrowLeft,
  GitMerge,
  ArrowUp,
  Target,
  Scissors,
  Link,
  Power,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Code,
  Eye,
  History,
  Star,
  Layers,
} from 'lucide-react';
import clsx from 'clsx';
import { ConflictCard } from './ConflictCard';
import type {
  SOPConflict,
  ConflictSeverity,
  ResolutionStrategy,
  ConflictHistoryEntry,
} from './types';
import {
  CONFLICT_SEVERITIES,
  CONFLICT_TYPES,
  RESOLUTION_STRATEGIES,
} from './types';

// =============================================================================
// Mock Data (replace with store)
// =============================================================================

const mockConflict: SOPConflict = {
  id: 'conflict-001',
  type: 'trigger_overlap',
  severity: 'warning',
  status: 'active',
  title: 'Response Tone Conflict',
  description: 'Two rules with overlapping triggers specify different response tones.',
  createdAt: '2026-01-15',
  detectedBy: 'static_analysis',
  affectedSOPs: [
    { id: 'sop-001', title: 'Customer Response Protocol', rules: ['tone_formal', 'tone_friendly'] },
  ],
  conflictingRules: [
    {
      ruleId: 'response_tone_formal',
      sopId: 'sop-001',
      trigger: 'message.channel == "email"',
      action: 'tone.set("formal")',
      priority: 80,
      code: 'RULE response_tone_formal\n  TRIGGER message.received\n  WHEN message.channel == "email"\n  THEN tone.set("formal")\n  PRIORITY 80',
    },
    {
      ruleId: 'response_tone_friendly',
      sopId: 'sop-001',
      trigger: 'customer.tier == "vip"',
      action: 'tone.set("friendly")',
      priority: 75,
      code: 'RULE response_tone_friendly\n  TRIGGER message.received\n  WHEN customer.tier == "vip"\n  THEN tone.set("friendly")\n  PRIORITY 75',
    },
  ],
  overlapScenario: {
    description: 'A VIP customer sends an email message',
    inputs: { 'message.channel': 'email', 'customer.tier': 'vip' },
    potentialOutcomes: [
      'Formal tone applied (higher priority)',
      'VIP customer may expect friendlier tone',
      'Inconsistent experience based on rule evaluation order',
    ],
  },
  suggestedResolutions: [
    {
      strategy: 'priority_override',
      description: 'Set explicit priorities so VIP rule always wins',
      preview: 'RULE response_tone_friendly\n  PRIORITY 85  // Increased from 75',
      impact: 'VIP customers always get friendly tone, even in email',
      recommended: false,
    },
    {
      strategy: 'merge_with_conditionals',
      description: 'Merge both rules with conditional logic',
      preview: 'RULE response_tone_merged\n  TRIGGER message.received\n  WHEN customer.tier == "vip"\n    THEN tone.set("friendly")\n  ELSE WHEN message.channel == "email"\n    THEN tone.set("formal")',
      impact: 'Clear hierarchy: VIP status takes precedence over channel',
      recommended: true,
    },
    {
      strategy: 'condition_partitioning',
      description: 'Add mutual exclusion conditions',
      preview: 'RULE response_tone_formal\n  WHEN message.channel == "email" AND customer.tier != "vip"\n\nRULE response_tone_friendly\n  WHEN customer.tier == "vip"',
      impact: 'Rules no longer overlap; each handles distinct cases',
      recommended: false,
    },
  ],
};

const mockHistory: ConflictHistoryEntry[] = [
  { id: 'h1', conflictId: 'conflict-001', action: 'detected', timestamp: '2026-01-15T09:30:00Z', user: 'System' },
];

// =============================================================================
// Strategy Icon Helper
// =============================================================================

function getStrategyIcon(strategy: ResolutionStrategy) {
  const icons: Record<ResolutionStrategy, JSX.Element> = {
    priority_override: <ArrowUp className="w-5 h-5" />,
    specificity_selection: <Target className="w-5 h-5" />,
    condition_partitioning: <Scissors className="w-5 h-5" />,
    rule_chaining: <Link className="w-5 h-5" />,
    merge_with_conditionals: <GitMerge className="w-5 h-5" />,
    disable_rule: <Power className="w-5 h-5" />,
  };
  return icons[strategy] || <AlertOctagon className="w-5 h-5" />;
}

function getSeverityIcon(severity: ConflictSeverity) {
  if (severity === 'blocking') return <XCircle className="w-6 h-6 text-red-500" />;
  if (severity === 'warning') return <AlertTriangle className="w-6 h-6 text-amber-500" />;
  return <AlertOctagon className="w-6 h-6 text-blue-500" />;
}

// =============================================================================
// ConflictResolver Component
// =============================================================================

export interface ConflictResolverProps {
  conflictId?: string;
}

export function ConflictResolver({ conflictId: _propConflictId }: ConflictResolverProps) {
  const { id: cognateId, conflictId: _paramConflictId } = useParams<{ id: string; conflictId: string }>();
  const navigate = useNavigate();

  // TODO: Use _propConflictId || _paramConflictId to look up conflict from store
  const conflict = mockConflict; // Replace with store lookup
  const history = mockHistory;

  const [selectedResolution, setSelectedResolution] = useState<number | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [notes, setNotes] = useState('');

  const handleApplyResolution = () => {
    if (selectedResolution === null) return;
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      navigate(`/studio/cognates/${cognateId}/conflicts`);
    }, 1500);
  };

  if (!conflict) {
    return (
      <div className="p-12 text-center">
        <AlertOctagon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-semibold text-foreground">Conflict Not Found</h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-xl"
        >
          Go Back
        </button>
      </div>
    );
  }

  const severityConfig = CONFLICT_SEVERITIES[conflict.severity];
  const typeConfig = CONFLICT_TYPES[conflict.type];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-card rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2 text-foreground">
              <AlertOctagon className="w-7 h-7 text-purple-400" />
              Resolve Conflict
            </h1>
            <p className="text-muted-foreground mt-1">{conflict.title}</p>
          </div>
        </div>
        <span className={clsx(
          'px-3 py-1 text-sm font-medium rounded-full',
          conflict.severity === 'blocking' && 'bg-red-900/30 text-red-400',
          conflict.severity === 'warning' && 'bg-amber-900/30 text-amber-400',
          conflict.severity === 'info' && 'bg-blue-900/30 text-blue-400'
        )}>
          {severityConfig?.label}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Conflict Overview */}
          <div className={clsx(
            'rounded-2xl border p-6',
            conflict.severity === 'blocking' && 'bg-red-900/10 border-red-800',
            conflict.severity === 'warning' && 'bg-amber-900/10 border-amber-800',
            conflict.severity === 'info' && 'bg-blue-900/10 border-blue-800'
          )}>
            <div className="flex items-start gap-4">
              {getSeverityIcon(conflict.severity)}
              <div>
                <h2 className="text-lg font-semibold text-foreground">{conflict.title}</h2>
                <p className="text-muted-foreground mt-1">{conflict.description}</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Layers className="w-4 h-4" />
                    {typeConfig?.label}
                  </span>
                  <span>|</span>
                  <span>Detected {new Date(conflict.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Conflicting Rules */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2 text-foreground">
              <Code className="w-5 h-5 text-purple-400" />
              Conflicting Rules
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {conflict.conflictingRules.map((rule, idx) => (
                <ConflictCard key={rule.ruleId} rule={rule} index={idx} />
              ))}
            </div>
          </div>

          {/* Overlap Scenario */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2 text-foreground">
              <Eye className="w-5 h-5 text-purple-400" />
              Overlap Scenario
            </h3>
            <p className="text-muted-foreground mb-4">{conflict.overlapScenario.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-surface-base rounded-xl">
                <p className="text-sm font-medium mb-2 text-foreground">When these conditions occur:</p>
                <pre className="text-sm font-mono bg-card p-3 rounded-lg border border-border text-foreground">
                  {JSON.stringify(conflict.overlapScenario.inputs, null, 2)}
                </pre>
              </div>
              <div className="p-4 bg-amber-900/20 rounded-xl border border-amber-800">
                <p className="text-sm font-medium mb-2 text-amber-300">Potential Outcomes:</p>
                <ul className="space-y-2">
                  {conflict.overlapScenario.potentialOutcomes.map((outcome, idx) => (
                    <li key={idx} className="text-sm text-amber-400 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2" />
                      {outcome}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Resolution Options */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-semibold mb-4 text-foreground">Choose Resolution Strategy</h3>
            <div className="space-y-4">
              {conflict.suggestedResolutions?.map((resolution, idx) => (
                <label
                  key={idx}
                  className={clsx(
                    'block p-4 rounded-xl border-2 cursor-pointer transition-all',
                    selectedResolution === idx
                      ? 'border-purple-500 bg-purple-900/20'
                      : 'border-border hover:border-border'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="resolution"
                      value={idx}
                      checked={selectedResolution === idx}
                      onChange={() => {
                        setSelectedResolution(idx);
                        setShowPreview(true);
                      }}
                      className="mt-1 text-purple-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getStrategyIcon(resolution.strategy)}
                        <span className="font-medium text-foreground">
                          {RESOLUTION_STRATEGIES[resolution.strategy]?.label || resolution.strategy}
                        </span>
                        {resolution.recommended && (
                          <span className="px-2 py-0.5 bg-green-900/30 text-green-400 text-xs rounded-full flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{resolution.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        <span className="font-medium">Impact:</span> {resolution.impact}
                      </p>

                      {selectedResolution === idx && showPreview && resolution.preview && (
                        <div className="mt-4 bg-surface-base rounded-lg p-4 overflow-x-auto">
                          <p className="text-xs text-muted-foreground mb-2">Preview:</p>
                          <pre className="text-sm text-green-400 font-mono whitespace-pre">
                            {resolution.preview}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-semibold mb-4 text-foreground">Resolution Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add context or reasoning for this resolution..."
              className="w-full px-4 py-3 bg-surface-base rounded-xl border border-border focus:border-purple-500 outline-none transition-all resize-none text-foreground placeholder-muted-foreground"
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-card border border-border rounded-xl hover:bg-muted transition-colors text-foreground"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyResolution}
              disabled={selectedResolution === null || isApplying}
              className="px-6 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isApplying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Applying...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Apply Resolution
                </>
              )}
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Affected SOPs */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <h4 className="font-medium mb-4 text-foreground">Affected SOPs</h4>
            <div className="space-y-3">
              {conflict.affectedSOPs.map((sop) => (
                <div key={sop.id} className="p-3 bg-surface-base rounded-lg">
                  <p className="font-medium text-sm text-foreground">{sop.title}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {sop.rules.map((rule) => (
                      <span
                        key={rule}
                        className="px-2 py-0.5 bg-card rounded text-xs font-mono border border-border text-muted-foreground"
                      >
                        {rule}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="bg-card border border-border rounded-2xl p-4">
              <h4 className="font-medium mb-4 flex items-center gap-2 text-foreground">
                <History className="w-4 h-4 text-purple-400" />
                History
              </h4>
              <div className="space-y-3">
                {history.map((entry) => (
                  <div key={entry.id} className="flex items-start gap-3">
                    <div className={clsx(
                      'w-2 h-2 rounded-full mt-2',
                      entry.action === 'resolved' && 'bg-green-500',
                      entry.action === 'detected' && 'bg-amber-500',
                      entry.action === 'acknowledged' && 'bg-blue-500'
                    )} />
                    <div className="flex-1">
                      <p className="text-sm text-foreground">
                        <span className="font-medium capitalize">{entry.action}</span> by {entry.user}
                      </p>
                      {entry.notes && (
                        <p className="text-xs text-muted-foreground mt-1">{entry.notes}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {entry.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ConflictResolver;
