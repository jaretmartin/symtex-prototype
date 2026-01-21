/**
 * SOPEditor Component
 *
 * Full-featured visual editor for creating and modifying SOPs (Standard Operating Procedures).
 * Provides a form-based interface for metadata, a rule builder for TRIGGER/WHEN/THEN/ELSE
 * logic, and real-time S1 (Symtex Script) preview with syntax highlighting.
 *
 * @module components/cognate/sop/SOPEditor
 */

import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Code,
  Plus,
  Trash2,
  Loader2,
  FileText,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Copy,
  Eye,
  EyeOff,
  Sparkles,
  Tag,
  X,
  Zap,
  GitBranch,
  ArrowRight,
  ArrowRightLeft,
  GripVertical,
} from 'lucide-react';
import clsx from 'clsx';
import { useCognateStore } from '@/store';
import type {
  ExtendedSOP,
  SOPRule,
  SOPCondition,
  SOPAction,
  SOPStatus,
  SOPPriority,
  TriggerType,
  ConditionOperator,
  ActionType,
} from '@/types';

// ============================================================================
// Types & Interfaces
// ============================================================================

/**
 * Props for the SOPEditor component
 */
export interface SOPEditorProps {
  /** Initial SOP data (for editing existing SOPs) */
  initialSOP?: ExtendedSOP;
  /** Cognate ID this SOP belongs to */
  cognateId?: string;
  /** Whether this is a new SOP being created */
  isNew?: boolean;
  /** Callback when SOP is saved */
  onSave?: (sop: ExtendedSOP) => void;
  /** Callback when editing is cancelled */
  onCancel?: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Props for the RuleBuilder sub-component
 */
interface RuleBuilderProps {
  rule: SOPRule;
  index: number;
  onChange: (rule: SOPRule) => void;
  onDelete: () => void;
}

/**
 * Props for the S1SyntaxHighlight sub-component
 */
interface S1SyntaxHighlightProps {
  code: string;
}

/**
 * Props for the ConditionRow sub-component
 */
interface ConditionRowProps {
  condition: SOPCondition;
  onChange: (condition: SOPCondition) => void;
  onDelete: () => void;
}

/**
 * Props for the ActionRow sub-component
 */
interface ActionRowProps {
  action: SOPAction;
  onChange: (action: SOPAction) => void;
  onDelete: () => void;
}

/**
 * Props for the TagInput sub-component
 */
interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

// ============================================================================
// Constants
// ============================================================================

/** Status options for SOP status dropdown */
const STATUS_OPTIONS: Array<{ value: SOPStatus; label: string }> = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'archived', label: 'Archived' },
];

/** Priority options for SOP priority dropdown */
const PRIORITY_OPTIONS: Array<{ value: SOPPriority; label: string }> = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

/** Category options for SOP categorization */
const CATEGORY_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'customer', label: 'Customer Service' },
  { value: 'sales', label: 'Sales' },
  { value: 'support', label: 'Technical Support' },
  { value: 'compliance', label: 'Compliance' },
  { value: 'internal', label: 'Internal Operations' },
  { value: 'general', label: 'General' },
];

/** Trigger type options for rule triggers */
const TRIGGER_OPTIONS: Array<{ value: TriggerType; label: string }> = [
  { value: 'message', label: 'Message Received' },
  { value: 'event', label: 'Event Triggered' },
  { value: 'schedule', label: 'Scheduled' },
  { value: 'condition', label: 'Condition Met' },
  { value: 'manual', label: 'Manual Trigger' },
];

/** Operator options for conditions */
const OPERATOR_OPTIONS: Array<{ value: ConditionOperator; label: string }> = [
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

/** Action type options */
const ACTION_OPTIONS: Array<{ value: ActionType; label: string }> = [
  { value: 'respond', label: 'Send Response' },
  { value: 'escalate', label: 'Escalate' },
  { value: 'log', label: 'Log Event' },
  { value: 'notify', label: 'Send Notification' },
  { value: 'execute', label: 'Execute Action' },
  { value: 'wait', label: 'Wait' },
  { value: 'branch', label: 'Branch' },
];

/** Field options for condition fields */
const FIELD_OPTIONS: Array<{ value: string; label: string }> = [
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

/** S1 syntax tokens for highlighting */
const S1_SYNTAX_TOKENS = {
  keywords: ['TRIGGER', 'WHEN', 'THEN', 'ELSE', 'END', 'AND', 'OR', 'NOT', 'IF', 'ELIF', 'RULE', 'TRIGGERS', 'PRIORITY'],
  operators: ['==', '!=', '>', '<', '>=', '<=', '~=', '??', '&&', '||', 'IS', 'AND', 'OR'],
  functions: ['respond', 'escalate', 'log', 'notify', 'execute', 'wait', 'branch', 'apply_template', 'flag_for_review'],
  namespaces: ['message', 'context', 'user', 'session', 'system', 'sentiment', 'priority'],
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Creates a new empty SOP with default values
 */
function createEmptySOP(cognateId: string): ExtendedSOP {
  const now = new Date().toISOString();
  return {
    id: `sop-${Date.now()}`,
    cognateId,
    name: '',
    description: '',
    status: 'draft',
    priority: 'medium',
    version: '1.0.0',
    rules: [],
    tags: [],
    createdAt: now,
    updatedAt: now,
    triggerCount: 0,
    isValid: false,
    category: 'general',
  };
}

/**
 * Creates a new empty rule with default values
 */
function createEmptyRule(index: number): SOPRule {
  return {
    id: `rule-${Date.now()}-${index}`,
    name: `Rule ${index + 1}`,
    trigger: { type: 'message', config: {} },
    conditions: [],
    thenActions: [],
    enabled: true,
    order: index + 1,
  };
}

/**
 * Creates a new empty condition
 */
function createEmptyCondition(): SOPCondition {
  return {
    id: `cond-${Date.now()}`,
    field: 'message.content',
    operator: 'contains',
    value: '',
  };
}

/**
 * Creates a new empty action
 */
function createEmptyAction(): SOPAction {
  return {
    id: `action-${Date.now()}`,
    type: 'respond',
    config: {},
  };
}

/**
 * Compiles a condition to S1 syntax
 */
function compileConditionToS1(condition: SOPCondition): string {
  const operators: Record<ConditionOperator, string> = {
    equals: '==',
    not_equals: '!=',
    contains: '~=',
    not_contains: '!~=',
    greater_than: '>',
    less_than: '<',
    matches: '~=',
    exists: '??',
    not_exists: '!??',
  };

  const op = operators[condition.operator] || '==';

  if (condition.operator === 'exists' || condition.operator === 'not_exists') {
    return `${condition.field} ${op}`;
  }

  const value = isNaN(Number(condition.value)) ? `"${condition.value}"` : condition.value;
  return `${condition.field} ${op} ${value}`;
}

/**
 * Compiles an action to S1 syntax
 */
function compileActionToS1(action: SOPAction): string {
  const configStr = Object.keys(action.config).length > 0
    ? `(${Object.entries(action.config).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join(', ')})`
    : '()';

  return `    ${action.type}${configStr}`;
}

/**
 * Compiles a single rule to S1 syntax
 */
function compileRuleToS1(rule: SOPRule, sopName: string, index: number): string {
  const lines: string[] = [];

  lines.push(`// Rule ${index + 1}: ${rule.name || 'Untitled'}`);
  lines.push(`RULE "${sopName}_rule_${index + 1}" {`);
  lines.push(`  TRIGGERS: [${rule.trigger.type ? `"${rule.trigger.type}"` : ''}]`);

  if (rule.conditions.length > 0) {
    const conditionStr = rule.conditions.map(compileConditionToS1).join(' AND ');
    lines.push(`  WHEN: ${conditionStr}`);
  } else {
    lines.push('  WHEN: TRUE');
  }

  lines.push('  THEN: {');
  if (rule.thenActions.length > 0) {
    rule.thenActions.forEach((action) => {
      lines.push(compileActionToS1(action));
    });
  } else {
    lines.push('    // No actions defined');
  }
  lines.push('  }');

  if (rule.elseActions && rule.elseActions.length > 0) {
    lines.push('  ELSE: {');
    rule.elseActions.forEach((action) => {
      lines.push(compileActionToS1(action));
    });
    lines.push('  }');
  }

  lines.push(`  PRIORITY: ${rule.order * 10}`);
  lines.push('}');

  return lines.join('\n');
}

/**
 * Compiles all rules to S1 code
 */
function compileToS1(sop: ExtendedSOP): string {
  if (sop.rules.length === 0) {
    return '// No rules defined';
  }

  const enabledRules = sop.rules.filter((r) => r.enabled);
  return enabledRules.map((rule, index) => compileRuleToS1(rule, sop.name || 'untitled', index)).join('\n\n');
}

// ============================================================================
// Sub-Components
// ============================================================================

/**
 * S1 Syntax Highlighter Component
 * Renders S1 code with syntax highlighting
 */
function S1SyntaxHighlight({ code }: S1SyntaxHighlightProps): JSX.Element {
  const highlightLine = (line: string): JSX.Element => {
    // Check for comments
    if (line.trim().startsWith('//')) {
      return <span className="text-muted-foreground">{line}</span>;
    }

    // Split by spaces and operators while preserving them
    const tokens = line.split(/(\s+|==|!=|>=|<=|>|<|~=|\?\?|&&|\|\||\(|\)|,|:|"[^"]*"|\{|\}|\[|\])/);

    return (
      <>
        {tokens.map((token, index) => {
          // String literals
          if (token.startsWith('"') && token.endsWith('"')) {
            return <span key={index} className="text-green-400">{token}</span>;
          }
          // Keywords
          if (S1_SYNTAX_TOKENS.keywords.includes(token)) {
            return <span key={index} className="text-purple-400 font-medium">{token}</span>;
          }
          // Operators
          if (S1_SYNTAX_TOKENS.operators.includes(token)) {
            return <span key={index} className="text-yellow-400">{token}</span>;
          }
          // Functions
          if (S1_SYNTAX_TOKENS.functions.includes(token)) {
            return <span key={index} className="text-blue-400">{token}</span>;
          }
          // Namespaces (field references)
          if (S1_SYNTAX_TOKENS.namespaces.some((ns) => token.startsWith(ns + '.'))) {
            const [ns, ...rest] = token.split('.');
            return (
              <span key={index}>
                <span className="text-cyan-400">{ns}</span>
                <span className="text-muted-foreground">.</span>
                <span className="text-green-400">{rest.join('.')}</span>
              </span>
            );
          }
          // Numbers
          if (!isNaN(Number(token)) && token.trim() !== '') {
            return <span key={index} className="text-orange-400">{token}</span>;
          }

          return <span key={index} className="text-foreground">{token}</span>;
        })}
      </>
    );
  };

  const lines = code.split('\n');

  return (
    <pre className="text-sm font-mono overflow-x-auto p-4 bg-surface-base text-foreground rounded-lg">
      {lines.map((line, index) => (
        <div key={index} className="flex">
          <span className="w-8 text-right pr-3 text-muted-foreground select-none">
            {index + 1}
          </span>
          <code className="flex-1">{highlightLine(line)}</code>
        </div>
      ))}
    </pre>
  );
}

/**
 * Tag Input Component
 * Allows adding and removing tags from the SOP
 */
function TagInput({ tags, onChange }: TagInputProps): JSX.Element {
  const [inputValue, setInputValue] = useState('');

  const addTag = (): void => {
    const trimmed = inputValue.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInputValue('');
  };

  const removeTag = (tagToRemove: string): void => {
    onChange(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-2 bg-surface-base border border-border rounded-lg focus-within:border-blue-500">
      {tags.map((tag) => (
        <span
          key={tag}
          className="flex items-center gap-1 px-2 py-0.5 bg-card text-foreground rounded text-sm"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder={tags.length === 0 ? 'Add tags...' : ''}
        className="flex-1 min-w-[100px] bg-transparent border-none text-sm text-foreground placeholder-muted-foreground focus:outline-none"
      />
    </div>
  );
}

/**
 * Condition Row Component
 * Renders a single condition with field, operator, and value inputs
 */
function ConditionRow({ condition, onChange, onDelete }: ConditionRowProps): JSX.Element {
  return (
    <div className="flex items-center gap-2 p-2 rounded bg-muted/50 group">
      <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />

      <select
        value={condition.field}
        onChange={(e) => onChange({ ...condition, field: e.target.value })}
        className="flex-1 px-2 py-1.5 text-sm bg-surface-base border border-border rounded text-foreground focus:border-blue-500 focus:outline-none"
      >
        {FIELD_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      <select
        value={condition.operator}
        onChange={(e) => onChange({ ...condition, operator: e.target.value as ConditionOperator })}
        className="px-2 py-1.5 text-sm bg-surface-base border border-border rounded text-foreground focus:border-blue-500 focus:outline-none"
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
        className="flex-1 px-2 py-1.5 text-sm bg-surface-base border border-border rounded text-foreground placeholder-muted-foreground focus:border-blue-500 focus:outline-none"
      />

      <button
        type="button"
        onClick={onDelete}
        className="p-1.5 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded transition-colors opacity-0 group-hover:opacity-100"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

/**
 * Action Row Component
 * Renders a single action with type, label, and config inputs
 */
function ActionRow({ action, onChange, onDelete }: ActionRowProps): JSX.Element {
  return (
    <div className="flex items-center gap-2 p-2 rounded bg-muted/50 group">
      <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />

      <select
        value={action.type}
        onChange={(e) => onChange({ ...action, type: e.target.value as ActionType })}
        className="px-2 py-1.5 text-sm bg-surface-base border border-border rounded text-foreground focus:border-blue-500 focus:outline-none"
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
        className="flex-1 px-2 py-1.5 text-sm bg-surface-base border border-border rounded text-foreground placeholder-muted-foreground focus:border-blue-500 focus:outline-none"
      />

      <input
        type="text"
        value={JSON.stringify(action.config) === '{}' ? '' : JSON.stringify(action.config)}
        onChange={(e) => {
          try {
            const config = e.target.value ? JSON.parse(e.target.value) : {};
            onChange({ ...action, config });
          } catch {
            // Invalid JSON, keep current config
          }
        }}
        placeholder="Config (JSON)"
        className="flex-1 px-2 py-1.5 text-sm bg-surface-base border border-border rounded text-foreground placeholder-muted-foreground focus:border-blue-500 focus:outline-none font-mono text-xs"
      />

      <button
        type="button"
        onClick={onDelete}
        className="p-1.5 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded transition-colors opacity-0 group-hover:opacity-100"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

/**
 * Rule Builder Component
 * Visual builder for TRIGGER/WHEN/THEN/ELSE rule structure
 */
function RuleBuilder({ rule, index, onChange, onDelete }: RuleBuilderProps): JSX.Element {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showElse, setShowElse] = useState(rule.elseActions && rule.elseActions.length > 0);

  const addCondition = (): void => {
    onChange({
      ...rule,
      conditions: [...rule.conditions, createEmptyCondition()],
    });
  };

  const updateCondition = (condIndex: number, condition: SOPCondition): void => {
    const conditions = [...rule.conditions];
    conditions[condIndex] = condition;
    onChange({ ...rule, conditions });
  };

  const removeCondition = (condIndex: number): void => {
    onChange({
      ...rule,
      conditions: rule.conditions.filter((_, i) => i !== condIndex),
    });
  };

  const addThenAction = (): void => {
    onChange({
      ...rule,
      thenActions: [...rule.thenActions, createEmptyAction()],
    });
  };

  const updateThenAction = (actionIndex: number, action: SOPAction): void => {
    const thenActions = [...rule.thenActions];
    thenActions[actionIndex] = action;
    onChange({ ...rule, thenActions });
  };

  const removeThenAction = (actionIndex: number): void => {
    onChange({
      ...rule,
      thenActions: rule.thenActions.filter((_, i) => i !== actionIndex),
    });
  };

  const addElseAction = (): void => {
    onChange({
      ...rule,
      elseActions: [...(rule.elseActions || []), createEmptyAction()],
    });
    setShowElse(true);
  };

  const updateElseAction = (actionIndex: number, action: SOPAction): void => {
    const elseActions = [...(rule.elseActions || [])];
    elseActions[actionIndex] = action;
    onChange({ ...rule, elseActions });
  };

  const removeElseAction = (actionIndex: number): void => {
    const newElseActions = (rule.elseActions || []).filter((_, i) => i !== actionIndex);
    onChange({
      ...rule,
      elseActions: newElseActions,
    });
    if (newElseActions.length === 0) {
      setShowElse(false);
    }
  };

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 bg-muted/80 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
          <span className="font-medium text-sm text-foreground">Rule {index + 1}</span>
          {rule.trigger.type && (
            <span className="px-2 py-0.5 bg-blue-900/30 text-blue-400 rounded text-xs">
              {rule.trigger.type}
            </span>
          )}
          {!rule.enabled && (
            <span className="px-2 py-0.5 bg-muted text-muted-foreground rounded text-xs">
              Disabled
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm text-muted-foreground" onClick={(e) => e.stopPropagation()}>
            <input
              type="checkbox"
              checked={rule.enabled}
              onChange={(e) => onChange({ ...rule, enabled: e.target.checked })}
              className="w-4 h-4 rounded border-border bg-card text-blue-500 focus:ring-blue-500"
            />
            Enabled
          </label>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 text-muted-foreground hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Body */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Rule Name */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              RULE NAME
            </label>
            <input
              type="text"
              value={rule.name}
              onChange={(e) => onChange({ ...rule, name: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-surface-base border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-blue-500 focus:outline-none"
              placeholder="Give this rule a descriptive name"
            />
          </div>

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
              className="w-full px-3 py-2 text-sm bg-surface-base border border-border rounded-lg text-foreground focus:border-yellow-500 focus:outline-none"
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
                <p className="text-sm text-muted-foreground italic py-2">No conditions - rule will always match trigger</p>
              ) : (
                rule.conditions.map((condition, condIndex) => (
                  <ConditionRow
                    key={condition.id}
                    condition={condition}
                    onChange={(c) => updateCondition(condIndex, c)}
                    onDelete={() => removeCondition(condIndex)}
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
                <p className="text-sm text-muted-foreground italic py-2">No actions defined</p>
              ) : (
                rule.thenActions.map((action, actionIndex) => (
                  <ActionRow
                    key={action.id}
                    action={action}
                    onChange={(a) => updateThenAction(actionIndex, a)}
                    onDelete={() => removeThenAction(actionIndex)}
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
                <span className="text-xs text-muted-foreground">(optional)</span>
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
                  {(rule.elseActions || []).map((action, actionIndex) => (
                    <ActionRow
                      key={action.id}
                      action={action}
                      onChange={(a) => updateElseAction(actionIndex, a)}
                      onDelete={() => removeElseAction(actionIndex)}
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

// ============================================================================
// Main Component
// ============================================================================

/**
 * SOPEditor Component
 *
 * Full-featured visual editor for creating and modifying SOPs.
 * Supports both standalone usage (with initialSOP prop) and route-based usage
 * (reading cognateId and sopId from URL params).
 *
 * @example
 * // Standalone usage
 * <SOPEditor
 *   initialSOP={existingSOP}
 *   cognateId="cog-123"
 *   onSave={(sop) => console.log('Saved:', sop)}
 *   onCancel={() => navigate(-1)}
 * />
 *
 * @example
 * // Route-based usage (reads params from URL)
 * <SOPEditor isNew={true} />
 */
export function SOPEditor({
  initialSOP,
  cognateId: propCognateId,
  isNew: propIsNew,
  onSave,
  onCancel,
  className,
}: SOPEditorProps): JSX.Element {
  const { id: paramCognateId, sopId } = useParams<{ id: string; sopId: string }>();
  const navigate = useNavigate();
  const { cognates, sops, addSOP, updateSOP } = useCognateStore();

  // Determine cognate ID and whether this is a new SOP
  const cognateId = propCognateId || paramCognateId || '';
  const isNew = propIsNew ?? (!sopId || sopId === 'new');
  const cognate = cognates.find((c) => c.id === cognateId);
  const existingSOP = sopId && sopId !== 'new' ? sops.find((s) => s.id === sopId) : null;

  // Form state
  const [sop, setSOP] = useState<ExtendedSOP>(() => {
    if (initialSOP) return initialSOP;
    if (existingSOP) return { ...existingSOP };
    return createEmptySOP(cognateId);
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [showS1Preview, setShowS1Preview] = useState(false);
  const [compiledS1, setCompiledS1] = useState('');

  // Sync with existing SOP if it changes
  useEffect(() => {
    if (existingSOP && !initialSOP) {
      setSOP({ ...existingSOP });
    }
  }, [existingSOP, initialSOP]);

  // Validation
  const validationErrors: string[] = [];
  if (!sop.name.trim()) {
    validationErrors.push('SOP name is required');
  }
  if (sop.rules.length === 0) {
    validationErrors.push('At least one rule is required');
  }
  sop.rules.forEach((rule, index) => {
    if (!rule.name.trim()) {
      validationErrors.push(`Rule ${index + 1}: Name is required`);
    }
  });

  const isValid = validationErrors.length === 0;

  // Handlers
  const handleAddRule = useCallback((): void => {
    setSOP((prev) => ({
      ...prev,
      rules: [...prev.rules, createEmptyRule(prev.rules.length)],
    }));
  }, []);

  const handleUpdateRule = useCallback((index: number, rule: SOPRule): void => {
    setSOP((prev) => {
      const rules = [...prev.rules];
      rules[index] = rule;
      return { ...prev, rules };
    });
  }, []);

  const handleDeleteRule = useCallback((index: number): void => {
    setSOP((prev) => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index),
    }));
  }, []);

  const handleCompileToS1 = useCallback(async (): Promise<void> => {
    setIsCompiling(true);
    // Simulate compilation delay for UX
    await new Promise((resolve) => setTimeout(resolve, 500));
    const s1Code = compileToS1(sop);
    setCompiledS1(s1Code);
    setShowS1Preview(true);
    setIsCompiling(false);
  }, [sop]);

  const handleCopyS1 = useCallback(async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(compiledS1);
    } catch (err) {
      console.error('Failed to copy S1 code:', err);
    }
  }, [compiledS1]);

  const handleSave = useCallback(async (): Promise<void> => {
    if (!isValid) return;

    setIsSaving(true);
    const now = new Date().toISOString();
    const updatedSOP: ExtendedSOP = {
      ...sop,
      updatedAt: now,
      isValid: true,
      validationErrors: [],
    };

    // Simulate save delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (isNew) {
      addSOP(updatedSOP);
    } else {
      updateSOP(sop.id, updatedSOP);
    }

    setIsSaving(false);

    if (onSave) {
      onSave(updatedSOP);
    } else {
      navigate(`/studio/cognates/${cognateId}/sops`);
    }
  }, [sop, isValid, isNew, cognateId, addSOP, updateSOP, onSave, navigate]);

  const handleCancel = useCallback((): void => {
    if (onCancel) {
      onCancel();
    } else {
      navigate(`/studio/cognates/${cognateId}/sops`);
    }
  }, [onCancel, navigate, cognateId]);

  return (
    <div className={clsx('flex flex-col h-full bg-surface-base', className)}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-border">
        <Link
          to={`/studio/cognates/${cognateId}/sops`}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to SOPs
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <FileText className="w-7 h-7 text-purple-400" />
              {isNew ? 'Create SOP' : 'Edit SOP'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {cognate ? `For ${cognate.name}` : 'Define standard operating procedures that compile to S1 rules'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCompileToS1}
              disabled={isCompiling || sop.rules.length === 0}
              className={clsx(
                'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                sop.rules.length > 0
                  ? 'bg-card text-foreground hover:bg-muted border border-border'
                  : 'bg-card text-muted-foreground cursor-not-allowed border border-border'
              )}
            >
              {isCompiling ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Code className="w-4 h-4" />
              )}
              Compile to S1
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !isValid}
              className={clsx(
                'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                isValid
                  ? 'bg-blue-600 text-white hover:bg-blue-500'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              )}
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isNew ? 'Create SOP' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="mt-4 p-3 bg-red-900/20 border border-red-800 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-400">Please fix the following errors:</p>
                <ul className="mt-1 text-sm text-red-300 list-disc list-inside">
                  {validationErrors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Editor Panel */}
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* Basic Info Card */}
          <div className="bg-muted/50 border border-border rounded-xl p-6">
            <h2 className="font-semibold text-foreground mb-4">Basic Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-muted-foreground">Name *</label>
                <input
                  type="text"
                  value={sop.name}
                  onChange={(e) => setSOP({ ...sop, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-surface-base border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-blue-500 focus:outline-none"
                  placeholder="e.g., Customer Complaint Handling"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-muted-foreground">Version</label>
                <input
                  type="text"
                  value={sop.version}
                  onChange={(e) => setSOP({ ...sop, version: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-surface-base border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-blue-500 focus:outline-none"
                  placeholder="1.0.0"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-muted-foreground">Description</label>
                <textarea
                  value={sop.description}
                  onChange={(e) => setSOP({ ...sop, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-surface-base border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-blue-500 focus:outline-none resize-none min-h-[80px]"
                  placeholder="Describe what this SOP handles..."
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-muted-foreground">Category</label>
                <select
                  value={sop.category || 'general'}
                  onChange={(e) => setSOP({ ...sop, category: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-surface-base border border-border rounded-lg text-foreground focus:border-blue-500 focus:outline-none"
                >
                  {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-muted-foreground">Status</label>
                <select
                  value={sop.status}
                  onChange={(e) => setSOP({ ...sop, status: e.target.value as SOPStatus })}
                  className="w-full px-3 py-2 text-sm bg-surface-base border border-border rounded-lg text-foreground focus:border-blue-500 focus:outline-none"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-muted-foreground">Priority</label>
                <select
                  value={sop.priority}
                  onChange={(e) => setSOP({ ...sop, priority: e.target.value as SOPPriority })}
                  className="w-full px-3 py-2 text-sm bg-surface-base border border-border rounded-lg text-foreground focus:border-blue-500 focus:outline-none"
                >
                  {PRIORITY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
                  <Tag className="w-4 h-4" />
                  Tags
                </label>
                <TagInput
                  tags={sop.tags}
                  onChange={(tags) => setSOP({ ...sop, tags })}
                />
              </div>
            </div>
          </div>

          {/* Rules Builder Card */}
          <div className="bg-muted/50 border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                Rules ({sop.rules.length})
              </h2>
              <button
                onClick={handleAddRule}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Rule
              </button>
            </div>

            {sop.rules.length > 0 ? (
              <div className="space-y-4">
                {sop.rules.map((rule, index) => (
                  <RuleBuilder
                    key={rule.id}
                    rule={rule}
                    index={index}
                    onChange={(updated) => handleUpdateRule(index, updated)}
                    onDelete={() => handleDeleteRule(index)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border border-dashed border-border rounded-xl">
                <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="font-medium text-muted-foreground">No rules defined</p>
                <p className="text-sm text-muted-foreground mt-1">Add rules to define how this SOP should behave</p>
                <button
                  onClick={handleAddRule}
                  className="inline-flex items-center gap-2 mt-4 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Your First Rule
                </button>
              </div>
            )}
          </div>
        </div>

        {/* S1 Preview Sidebar */}
        <div className={clsx(
          'border-l border-border bg-surface-base/50 transition-all duration-300',
          showS1Preview ? 'w-[400px]' : 'w-0'
        )}>
          {showS1Preview && (
            <div className="flex flex-col h-full">
              {/* Preview Header */}
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-purple-400" />
                  <span className="font-semibold text-foreground">S1 Preview</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyS1}
                    className="flex items-center gap-1 px-2 py-1 text-xs text-purple-400 hover:bg-purple-500/10 rounded transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                    Copy
                  </button>
                  <button
                    onClick={() => setShowS1Preview(false)}
                    className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <EyeOff className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Compilation Status */}
              {compiledS1 && (
                <div className="px-4 py-2 border-b border-border flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Compiled successfully</span>
                </div>
              )}

              {/* S1 Code */}
              <div className="flex-1 overflow-auto p-4">
                {compiledS1 ? (
                  <S1SyntaxHighlight code={compiledS1} />
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Code className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Click "Compile to S1" to generate code</p>
                  </div>
                )}
              </div>

              {/* S1 Help */}
              <div className="p-4 border-t border-border bg-blue-900/10">
                <h3 className="font-semibold text-blue-300 mb-2 text-sm">S1 Rule Syntax</h3>
                <div className="text-xs text-blue-400/80 space-y-1">
                  <p><strong>TRIGGERS:</strong> Events that activate the rule</p>
                  <p><strong>WHEN:</strong> Conditions (==, ~=, AND, OR, etc.)</p>
                  <p><strong>THEN:</strong> Actions when conditions are met</p>
                  <p><strong>ELSE:</strong> Fallback actions (optional)</p>
                  <p><strong>PRIORITY:</strong> Higher = runs first</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toggle Preview Button (when hidden) */}
      {!showS1Preview && (
        <button
          onClick={() => {
            if (!compiledS1 && sop.rules.length > 0) {
              handleCompileToS1();
            } else {
              setShowS1Preview(true);
            }
          }}
          className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full shadow-lg hover:bg-muted transition-colors z-40"
          title="Show S1 Preview"
        >
          <Eye className="w-4 h-4 text-foreground" />
          <span className="text-sm text-foreground">S1 Preview</span>
        </button>
      )}
    </div>
  );
}

export default SOPEditor;
