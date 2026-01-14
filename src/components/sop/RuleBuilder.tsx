/**
 * Rule Builder Component
 *
 * Visual builder for TRIGGER/WHEN/THEN/ELSE rule structure.
 * Allows users to construct SOP rules through a drag-and-drop interface.
 */

import { useState } from 'react';
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  GripVertical,
  Zap,
  GitBranch,
  ArrowRight,
  ArrowRightLeft,
} from 'lucide-react';
import type {
  SOPRule,
  SOPCondition,
  SOPAction,
  TriggerType,
  ConditionOperator,
  ActionType,
} from '@/types';

export interface RuleBuilderProps {
  rule: SOPRule;
  onChange: (rule: SOPRule) => void;
  onDelete?: () => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  className?: string;
}

// Options for dropdowns
const TRIGGER_OPTIONS: { value: TriggerType; label: string }[] = [
  { value: 'message', label: 'Message Received' },
  { value: 'event', label: 'Event Triggered' },
  { value: 'schedule', label: 'Scheduled' },
  { value: 'condition', label: 'Condition Met' },
  { value: 'manual', label: 'Manual Trigger' },
];

const OPERATOR_OPTIONS: { value: ConditionOperator; label: string }[] = [
  { value: 'equals', label: 'equals' },
  { value: 'not_equals', label: 'does not equal' },
  { value: 'contains', label: 'contains' },
  { value: 'not_contains', label: 'does not contain' },
  { value: 'greater_than', label: 'is greater than' },
  { value: 'less_than', label: 'is less than' },
  { value: 'matches', label: 'matches pattern' },
  { value: 'exists', label: 'exists' },
  { value: 'not_exists', label: 'does not exist' },
];

const ACTION_OPTIONS: { value: ActionType; label: string }[] = [
  { value: 'respond', label: 'Send Response' },
  { value: 'escalate', label: 'Escalate' },
  { value: 'log', label: 'Log Event' },
  { value: 'notify', label: 'Send Notification' },
  { value: 'execute', label: 'Execute Action' },
  { value: 'wait', label: 'Wait' },
  { value: 'branch', label: 'Branch' },
];

const FIELD_OPTIONS = [
  { value: 'message.content', label: 'Message Content' },
  { value: 'message.sender', label: 'Sender' },
  { value: 'message.channel', label: 'Channel' },
  { value: 'message.isFirst', label: 'Is First Message' },
  { value: 'context.intent', label: 'Intent' },
  { value: 'context.sentiment', label: 'Sentiment' },
  { value: 'context.language', label: 'Language' },
  { value: 'user.role', label: 'User Role' },
  { value: 'user.tier', label: 'User Tier' },
  { value: 'session.duration', label: 'Session Duration' },
];

interface ConditionRowProps {
  condition: SOPCondition;
  onChange: (condition: SOPCondition) => void;
  onDelete: () => void;
}

function ConditionRow({ condition, onChange, onDelete }: ConditionRowProps): JSX.Element {
  return (
    <div className="flex items-center gap-2 p-2 rounded bg-zinc-800/50 group">
      <GripVertical className="w-4 h-4 text-zinc-600 cursor-grab" />

      <select
        value={condition.field}
        onChange={(e) => onChange({ ...condition, field: e.target.value })}
        className="flex-1 px-2 py-1.5 text-sm bg-zinc-900 border border-zinc-700 rounded text-white focus:border-blue-500 focus:outline-none"
      >
        {FIELD_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      <select
        value={condition.operator}
        onChange={(e) => onChange({ ...condition, operator: e.target.value as ConditionOperator })}
        className="px-2 py-1.5 text-sm bg-zinc-900 border border-zinc-700 rounded text-white focus:border-blue-500 focus:outline-none"
      >
        {OPERATOR_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      <input
        type="text"
        value={condition.value}
        onChange={(e) => onChange({ ...condition, value: e.target.value })}
        placeholder="Value"
        className="flex-1 px-2 py-1.5 text-sm bg-zinc-900 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
      />

      <button
        type="button"
        onClick={onDelete}
        className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors opacity-0 group-hover:opacity-100"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

interface ActionRowProps {
  action: SOPAction;
  onChange: (action: SOPAction) => void;
  onDelete: () => void;
}

function ActionRow({ action, onChange, onDelete }: ActionRowProps): JSX.Element {
  return (
    <div className="flex items-center gap-2 p-2 rounded bg-zinc-800/50 group">
      <GripVertical className="w-4 h-4 text-zinc-600 cursor-grab" />

      <select
        value={action.type}
        onChange={(e) => onChange({ ...action, type: e.target.value as ActionType })}
        className="px-2 py-1.5 text-sm bg-zinc-900 border border-zinc-700 rounded text-white focus:border-blue-500 focus:outline-none"
      >
        {ACTION_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      <input
        type="text"
        value={action.label || ''}
        onChange={(e) => onChange({ ...action, label: e.target.value })}
        placeholder="Label (optional)"
        className="flex-1 px-2 py-1.5 text-sm bg-zinc-900 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
      />

      <input
        type="text"
        value={JSON.stringify(action.config) === '{}' ? '' : JSON.stringify(action.config)}
        onChange={(e) => {
          try {
            const config = e.target.value ? JSON.parse(e.target.value) : {};
            onChange({ ...action, config });
          } catch {
            // Invalid JSON, ignore
          }
        }}
        placeholder="Config (JSON)"
        className="flex-1 px-2 py-1.5 text-sm bg-zinc-900 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none font-mono text-xs"
      />

      <button
        type="button"
        onClick={onDelete}
        className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors opacity-0 group-hover:opacity-100"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

export function RuleBuilder({
  rule,
  onChange,
  onDelete,
  isExpanded = true,
  onToggleExpand,
  className = '',
}: RuleBuilderProps): JSX.Element {
  const [showElse, setShowElse] = useState(rule.elseActions && rule.elseActions.length > 0);

  const addCondition = (): void => {
    const newCondition: SOPCondition = {
      id: `cond-${Date.now()}`,
      field: 'message.content',
      operator: 'contains',
      value: '',
    };
    onChange({
      ...rule,
      conditions: [...rule.conditions, newCondition],
    });
  };

  const updateCondition = (index: number, condition: SOPCondition): void => {
    const conditions = [...rule.conditions];
    conditions[index] = condition;
    onChange({ ...rule, conditions });
  };

  const removeCondition = (index: number): void => {
    onChange({
      ...rule,
      conditions: rule.conditions.filter((_, i) => i !== index),
    });
  };

  const addThenAction = (): void => {
    const newAction: SOPAction = {
      id: `action-${Date.now()}`,
      type: 'respond',
      config: {},
    };
    onChange({
      ...rule,
      thenActions: [...rule.thenActions, newAction],
    });
  };

  const updateThenAction = (index: number, action: SOPAction): void => {
    const thenActions = [...rule.thenActions];
    thenActions[index] = action;
    onChange({ ...rule, thenActions });
  };

  const removeThenAction = (index: number): void => {
    onChange({
      ...rule,
      thenActions: rule.thenActions.filter((_, i) => i !== index),
    });
  };

  const addElseAction = (): void => {
    const newAction: SOPAction = {
      id: `action-${Date.now()}`,
      type: 'respond',
      config: {},
    };
    onChange({
      ...rule,
      elseActions: [...(rule.elseActions || []), newAction],
    });
    setShowElse(true);
  };

  const updateElseAction = (index: number, action: SOPAction): void => {
    const elseActions = [...(rule.elseActions || [])];
    elseActions[index] = action;
    onChange({ ...rule, elseActions });
  };

  const removeElseAction = (index: number): void => {
    const newElseActions = (rule.elseActions || []).filter((_, i) => i !== index);
    onChange({
      ...rule,
      elseActions: newElseActions,
    });
    if (newElseActions.length === 0) {
      setShowElse(false);
    }
  };

  return (
    <div className={`border border-zinc-800 rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-zinc-900/80 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          {onToggleExpand && (
            <button
              type="button"
              onClick={onToggleExpand}
              className="p-1 hover:bg-zinc-700 rounded transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-zinc-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-zinc-400" />
              )}
            </button>
          )}
          <input
            type="text"
            value={rule.name}
            onChange={(e) => onChange({ ...rule, name: e.target.value })}
            placeholder="Rule name"
            className="px-2 py-1 text-sm font-medium bg-transparent border-none text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm text-zinc-400">
            <input
              type="checkbox"
              checked={rule.enabled}
              onChange={(e) => onChange({ ...rule, enabled: e.target.checked })}
              className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-blue-500 focus:ring-blue-500"
            />
            Enabled
          </label>
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* TRIGGER Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium text-yellow-400">TRIGGER</span>
            </div>
            <select
              value={rule.trigger.type}
              onChange={(e) =>
                onChange({
                  ...rule,
                  trigger: { ...rule.trigger, type: e.target.value as TriggerType },
                })
              }
              className="w-full px-3 py-2 text-sm bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
            >
              {TRIGGER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* WHEN Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-400">WHEN</span>
              </div>
              <button
                type="button"
                onClick={addCondition}
                className="flex items-center gap-1 px-2 py-1 text-xs text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
              >
                <Plus className="w-3 h-3" />
                Add Condition
              </button>
            </div>
            <div className="space-y-2 pl-6 border-l-2 border-blue-500/30">
              {rule.conditions.length === 0 ? (
                <p className="text-sm text-zinc-500 italic py-2">No conditions - rule will always match trigger</p>
              ) : (
                rule.conditions.map((condition, index) => (
                  <ConditionRow
                    key={condition.id}
                    condition={condition}
                    onChange={(c) => updateCondition(index, c)}
                    onDelete={() => removeCondition(index)}
                  />
                ))
              )}
            </div>
          </div>

          {/* THEN Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium text-green-400">THEN</span>
              </div>
              <button
                type="button"
                onClick={addThenAction}
                className="flex items-center gap-1 px-2 py-1 text-xs text-green-400 hover:bg-green-500/10 rounded transition-colors"
              >
                <Plus className="w-3 h-3" />
                Add Action
              </button>
            </div>
            <div className="space-y-2 pl-6 border-l-2 border-green-500/30">
              {rule.thenActions.length === 0 ? (
                <p className="text-sm text-zinc-500 italic py-2">No actions defined</p>
              ) : (
                rule.thenActions.map((action, index) => (
                  <ActionRow
                    key={action.id}
                    action={action}
                    onChange={(a) => updateThenAction(index, a)}
                    onDelete={() => removeThenAction(index)}
                  />
                ))
              )}
            </div>
          </div>

          {/* ELSE Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-medium text-orange-400">ELSE</span>
                <span className="text-xs text-zinc-500">(optional)</span>
              </div>
              {!showElse && (
                <button
                  type="button"
                  onClick={addElseAction}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-orange-400 hover:bg-orange-500/10 rounded transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  Add Else Action
                </button>
              )}
            </div>
            {showElse && (
              <>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={addElseAction}
                    className="flex items-center gap-1 px-2 py-1 text-xs text-orange-400 hover:bg-orange-500/10 rounded transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    Add Action
                  </button>
                </div>
                <div className="space-y-2 pl-6 border-l-2 border-orange-500/30">
                  {(rule.elseActions || []).map((action, index) => (
                    <ActionRow
                      key={action.id}
                      action={action}
                      onChange={(a) => updateElseAction(index, a)}
                      onDelete={() => removeElseAction(index)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default RuleBuilder;
