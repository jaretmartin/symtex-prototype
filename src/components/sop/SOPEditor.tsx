/**
 * SOP Editor Component
 *
 * Visual editor for creating and modifying SOPs.
 * Combines metadata form, RuleBuilder, and S1Preview.
 */

import { useState } from 'react';
import {
  Save,
  Plus,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  X,
  Tag,
} from 'lucide-react';
import { RuleBuilder } from './RuleBuilder';
import { S1Preview } from './S1Preview';
import type { ExtendedSOP, SOPRule, SOPStatus, SOPPriority } from '@/types';

export interface SOPEditorProps {
  sop: ExtendedSOP;
  onChange: (sop: ExtendedSOP) => void;
  onSave?: (sop: ExtendedSOP) => void;
  onCancel?: () => void;
  isNew?: boolean;
  className?: string;
}

const STATUS_OPTIONS: { value: SOPStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'archived', label: 'Archived' },
];

const PRIORITY_OPTIONS: { value: SOPPriority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

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
          className="flex items-center gap-1 px-2 py-0.5 bg-card text-muted-foreground rounded text-sm"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="text-muted-foreground hover:text-muted-foreground"
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

export function SOPEditor({
  sop,
  onChange,
  onSave,
  onCancel,
  isNew = false,
  className = '',
}: SOPEditorProps): JSX.Element {
  const [expandedRules, setExpandedRules] = useState<Set<string>>(
    new Set(sop.rules.map((r) => r.id))
  );
  const [showPreview, setShowPreview] = useState(true);

  const toggleRuleExpand = (ruleId: string): void => {
    const newExpanded = new Set(expandedRules);
    if (newExpanded.has(ruleId)) {
      newExpanded.delete(ruleId);
    } else {
      newExpanded.add(ruleId);
    }
    setExpandedRules(newExpanded);
  };

  const addRule = (): void => {
    const newRule: SOPRule = {
      id: `rule-${Date.now()}`,
      name: `Rule ${sop.rules.length + 1}`,
      trigger: { type: 'message', config: {} },
      conditions: [],
      thenActions: [],
      enabled: true,
      order: sop.rules.length + 1,
    };
    onChange({
      ...sop,
      rules: [...sop.rules, newRule],
    });
    setExpandedRules(new Set([...expandedRules, newRule.id]));
  };

  const updateRule = (index: number, rule: SOPRule): void => {
    const rules = [...sop.rules];
    rules[index] = rule;
    onChange({ ...sop, rules });
  };

  const removeRule = (index: number): void => {
    const ruleId = sop.rules[index].id;
    onChange({
      ...sop,
      rules: sop.rules.filter((_, i) => i !== index),
    });
    const newExpanded = new Set(expandedRules);
    newExpanded.delete(ruleId);
    setExpandedRules(newExpanded);
  };

  // Validate SOP
  const validationErrors: string[] = [];
  const validationWarnings: string[] = [];

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
    if (rule.thenActions.length === 0) {
      validationWarnings.push(`Rule "${rule.name}": No THEN actions defined`);
    }
  });

  const isValid = validationErrors.length === 0;

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header Actions */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-foreground">
            {isNew ? 'Create New SOP' : 'Edit SOP'}
          </h2>
          {!isValid && (
            <span className="flex items-center gap-1 px-2 py-1 text-xs text-red-400 bg-red-500/10 rounded">
              <AlertCircle className="w-3 h-3" />
              {validationErrors.length} error{validationErrors.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-card rounded-lg transition-colors"
            >
              Cancel
            </button>
          )}
          {onSave && (
            <button
              type="button"
              onClick={() => onSave(sop)}
              disabled={!isValid}
              className={`
                flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors
                ${isValid
                  ? 'bg-blue-600 text-foreground hover:bg-blue-500'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
                }
              `}
            >
              <Save className="w-4 h-4" />
              {isNew ? 'Create SOP' : 'Save Changes'}
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Editor Panel */}
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* Metadata Section */}
          <div className="space-y-4 p-4 bg-surface-base/50 border border-border rounded-lg">
            <h3 className="text-sm font-medium text-muted-foreground">SOP Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm text-muted-foreground">Name</label>
                <input
                  type="text"
                  value={sop.name}
                  onChange={(e) => onChange({ ...sop, name: e.target.value })}
                  placeholder="SOP name"
                  className="w-full px-3 py-2 text-sm bg-surface-base border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm text-muted-foreground">Version</label>
                <input
                  type="text"
                  value={sop.version}
                  onChange={(e) => onChange({ ...sop, version: e.target.value })}
                  placeholder="1.0.0"
                  className="w-full px-3 py-2 text-sm bg-surface-base border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm text-muted-foreground">Status</label>
                <select
                  value={sop.status}
                  onChange={(e) => onChange({ ...sop, status: e.target.value as SOPStatus })}
                  className="w-full px-3 py-2 text-sm bg-surface-base border border-border rounded-lg text-foreground focus:border-blue-500 focus:outline-none"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm text-muted-foreground">Priority</label>
                <select
                  value={sop.priority}
                  onChange={(e) => onChange({ ...sop, priority: e.target.value as SOPPriority })}
                  className="w-full px-3 py-2 text-sm bg-surface-base border border-border rounded-lg text-foreground focus:border-blue-500 focus:outline-none"
                >
                  {PRIORITY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm text-muted-foreground">Description</label>
                <textarea
                  value={sop.description}
                  onChange={(e) => onChange({ ...sop, description: e.target.value })}
                  placeholder="Describe what this SOP does..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm bg-surface-base border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-blue-500 focus:outline-none resize-none"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Tag className="w-4 h-4" />
                  Tags
                </label>
                <TagInput
                  tags={sop.tags}
                  onChange={(tags) => onChange({ ...sop, tags })}
                />
              </div>
            </div>
          </div>

          {/* Rules Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">
                Rules ({sop.rules.length})
              </h3>
              <button
                type="button"
                onClick={addRule}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Rule
              </button>
            </div>

            {sop.rules.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-border rounded-lg">
                <p className="text-muted-foreground mb-4">No rules defined yet</p>
                <button
                  type="button"
                  onClick={addRule}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-foreground rounded-lg hover:bg-blue-500 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Your First Rule
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {sop.rules.map((rule, index) => (
                  <RuleBuilder
                    key={rule.id}
                    rule={rule}
                    onChange={(r) => updateRule(index, r)}
                    onDelete={() => removeRule(index)}
                    isExpanded={expandedRules.has(rule.id)}
                    onToggleExpand={() => toggleRuleExpand(rule.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* S1 Preview Panel */}
        {showPreview && (
          <div className="w-[400px] flex-shrink-0 border-l border-border">
            <S1Preview
              rules={sop.rules}
              sopName={sop.name}
              sopVersion={sop.version}
              errors={validationErrors}
              warnings={validationWarnings}
              className="h-full rounded-none border-0"
            />
          </div>
        )}
      </div>

      {/* Toggle Preview Button */}
      <button
        type="button"
        onClick={() => setShowPreview(!showPreview)}
        className="fixed bottom-6 right-6 p-3 bg-card border border-border rounded-full shadow-lg hover:bg-muted transition-colors z-40"
        title={showPreview ? 'Hide S1 Preview' : 'Show S1 Preview'}
      >
        {showPreview ? (
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>
    </div>
  );
}

export default SOPEditor;
