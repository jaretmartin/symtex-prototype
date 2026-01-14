/**
 * SpaceSettingsPanel Component
 *
 * Panel for viewing and editing space settings (communication, autonomy, rules).
 * Supports settings inheritance visualization and override toggles.
 * Used in domain/project settings pages.
 */

import { useState } from 'react';
import {
  Settings,
  MessageSquare,
  Bot,
  FileText,
  Plus,
  Trash2,
  Info,
  ChevronDown,
  Save,
  RotateCcw,
  Link2,
  Unlink,
} from 'lucide-react';
import clsx from 'clsx';
import type { SpaceSettings, CommunicationSettings, AutonomySettings, AutonomyLevel } from '@/types';

interface SpaceSettingsPanelProps {
  /** Current settings for this space */
  settings: SpaceSettings;
  /** Parent settings for inheritance comparison */
  parentSettings?: SpaceSettings;
  /** Callback when settings are saved */
  onSave?: (settings: SpaceSettings) => void;
  /** Whether this panel is read-only */
  readOnly?: boolean;
  /** Label for this space (e.g., "Domain", "Project") */
  spaceLabel?: string;
  /** Whether to show inheritance toggle */
  showInheritanceToggle?: boolean;
  className?: string;
}

// Tone options for communication settings
const TONE_OPTIONS = [
  { value: 'formal', label: 'Formal', description: 'Professional and structured' },
  { value: 'casual', label: 'Casual', description: 'Friendly and approachable' },
  { value: 'technical', label: 'Technical', description: 'Precise and detailed' },
  { value: 'concise', label: 'Concise', description: 'Brief and to the point' },
];

// Verbosity options
const VERBOSITY_OPTIONS = [
  { value: 'minimal', label: 'Minimal', description: 'Just the essentials' },
  { value: 'balanced', label: 'Balanced', description: 'Moderate detail level' },
  { value: 'detailed', label: 'Detailed', description: 'Comprehensive explanations' },
  { value: 'comprehensive', label: 'Comprehensive', description: 'Full context always' },
];

// Proactivity options
const PROACTIVITY_OPTIONS = [
  { value: 'reactive', label: 'Reactive', description: 'Only responds when asked' },
  { value: 'balanced', label: 'Balanced', description: 'Suggests when relevant' },
  { value: 'proactive', label: 'Proactive', description: 'Actively offers suggestions' },
];

// Autonomy level descriptions
const AUTONOMY_LEVELS: { level: AutonomyLevel; label: string; description: string }[] = [
  { level: 1, label: 'Supervised', description: 'All actions require approval' },
  { level: 2, label: 'Guided', description: 'Most actions need confirmation' },
  { level: 3, label: 'Autonomous', description: 'Routine tasks auto-approved' },
  { level: 4, label: 'Full Autonomy', description: 'All actions auto-approved' },
];

export function SpaceSettingsPanel({
  settings,
  parentSettings,
  onSave,
  readOnly = false,
  spaceLabel = 'Space',
  showInheritanceToggle = true,
  className,
}: SpaceSettingsPanelProps): JSX.Element {
  const [editedSettings, setEditedSettings] = useState<SpaceSettings>(settings);
  const [hasChanges, setHasChanges] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['communication', 'autonomy', 'rules'])
  );
  const [newRule, setNewRule] = useState('');

  // Toggle section expansion
  const toggleSection = (section: string): void => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  // Update communication settings
  const updateCommunication = (updates: Partial<CommunicationSettings>): void => {
    const newSettings = {
      ...editedSettings,
      communication: { ...editedSettings.communication, ...updates },
    };
    setEditedSettings(newSettings);
    setHasChanges(true);
  };

  // Update autonomy settings
  const updateAutonomy = (updates: Partial<AutonomySettings>): void => {
    const newSettings = {
      ...editedSettings,
      autonomy: { ...editedSettings.autonomy, ...updates },
    };
    setEditedSettings(newSettings);
    setHasChanges(true);
  };

  // Toggle inheritance
  const toggleInheritance = (): void => {
    const newSettings = {
      ...editedSettings,
      inheritFromParent: !editedSettings.inheritFromParent,
    };
    setEditedSettings(newSettings);
    setHasChanges(true);
  };

  // Add a new rule
  const addRule = (): void => {
    if (newRule.trim()) {
      const newSettings = {
        ...editedSettings,
        rules: [...editedSettings.rules, newRule.trim()],
      };
      setEditedSettings(newSettings);
      setNewRule('');
      setHasChanges(true);
    }
  };

  // Remove a rule
  const removeRule = (index: number): void => {
    const newSettings = {
      ...editedSettings,
      rules: editedSettings.rules.filter((_, i) => i !== index),
    };
    setEditedSettings(newSettings);
    setHasChanges(true);
  };

  // Save changes
  const handleSave = (): void => {
    if (onSave) {
      onSave(editedSettings);
      setHasChanges(false);
    }
  };

  // Reset to original
  const handleReset = (): void => {
    setEditedSettings(settings);
    setHasChanges(false);
  };

  // Check if a setting differs from parent
  const isDifferentFromParent = (
    category: 'communication' | 'autonomy',
    key: string
  ): boolean => {
    if (!parentSettings) return false;
    const parentValue = parentSettings[category][key as keyof typeof parentSettings[typeof category]];
    const currentValue = editedSettings[category][key as keyof typeof editedSettings[typeof category]];
    return parentValue !== currentValue;
  };

  return (
    <div className={clsx('bg-zinc-900 rounded-xl border border-zinc-700', className)}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
            <Settings className="w-5 h-5 text-zinc-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{spaceLabel} Settings</h3>
            <p className="text-sm text-zinc-400">Configure AI behavior and preferences</p>
          </div>
        </div>

        {/* Inheritance Toggle */}
        {showInheritanceToggle && parentSettings && (
          <button
            type="button"
            onClick={toggleInheritance}
            disabled={readOnly}
            className={clsx(
              'flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors',
              editedSettings.inheritFromParent
                ? 'bg-symtex-primary/10 border-symtex-primary text-symtex-primary'
                : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600',
              readOnly && 'opacity-50 cursor-not-allowed'
            )}
          >
            {editedSettings.inheritFromParent ? (
              <>
                <Link2 className="w-4 h-4" />
                <span className="text-sm">Inheriting</span>
              </>
            ) : (
              <>
                <Unlink className="w-4 h-4" />
                <span className="text-sm">Override</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Inheritance Notice */}
      {editedSettings.inheritFromParent && parentSettings && (
        <div className="mx-6 mt-4 p-3 bg-symtex-primary/10 border border-symtex-primary/30 rounded-lg flex items-start gap-3">
          <Info className="w-5 h-5 text-symtex-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-white">Settings inherited from parent space</p>
            <p className="text-xs text-zinc-400 mt-1">
              Changes here will override inherited values. Toggle off inheritance to customize all settings.
            </p>
          </div>
        </div>
      )}

      {/* Settings Sections */}
      <div className="p-6 space-y-4">
        {/* Communication Section */}
        <div className="border border-zinc-800 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={(): void => toggleSection('communication')}
            aria-expanded={expandedSections.has('communication')}
            aria-controls="communication-section"
            className="w-full px-4 py-3 bg-zinc-800/50 flex items-center justify-between hover:bg-zinc-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-blue-400" />
              <span className="font-medium text-white">Communication</span>
            </div>
            <ChevronDown
              className={clsx(
                'w-5 h-5 text-zinc-400 transition-transform',
                expandedSections.has('communication') && 'rotate-180'
              )}
            />
          </button>

          {expandedSections.has('communication') && (
            <div id="communication-section" className="p-4 space-y-4">
              {/* Tone */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Tone
                  {isDifferentFromParent('communication', 'tone') && (
                    <span className="ml-2 text-xs text-amber-400">(overridden)</span>
                  )}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {TONE_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={(): void => updateCommunication({ tone: option.value })}
                      disabled={readOnly}
                      className={clsx(
                        'p-3 rounded-lg border text-left transition-all',
                        editedSettings.communication.tone === option.value
                          ? 'bg-blue-500/10 border-blue-500 text-white'
                          : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-600',
                        readOnly && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      <span className="block font-medium">{option.label}</span>
                      <span className="block text-xs text-zinc-500 mt-1">{option.description}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Verbosity */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Verbosity
                  {isDifferentFromParent('communication', 'verbosity') && (
                    <span className="ml-2 text-xs text-amber-400">(overridden)</span>
                  )}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {VERBOSITY_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={(): void => updateCommunication({ verbosity: option.value })}
                      disabled={readOnly}
                      className={clsx(
                        'p-3 rounded-lg border text-left transition-all',
                        editedSettings.communication.verbosity === option.value
                          ? 'bg-blue-500/10 border-blue-500 text-white'
                          : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-600',
                        readOnly && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      <span className="block font-medium">{option.label}</span>
                      <span className="block text-xs text-zinc-500 mt-1">{option.description}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Proactivity */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Proactivity
                  {isDifferentFromParent('communication', 'proactivity') && (
                    <span className="ml-2 text-xs text-amber-400">(overridden)</span>
                  )}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {PROACTIVITY_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={(): void => updateCommunication({ proactivity: option.value })}
                      disabled={readOnly}
                      className={clsx(
                        'p-3 rounded-lg border text-left transition-all',
                        editedSettings.communication.proactivity === option.value
                          ? 'bg-blue-500/10 border-blue-500 text-white'
                          : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-600',
                        readOnly && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      <span className="block font-medium text-sm">{option.label}</span>
                      <span className="block text-xs text-zinc-500 mt-1">{option.description}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Autonomy Section */}
        <div className="border border-zinc-800 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={(): void => toggleSection('autonomy')}
            aria-expanded={expandedSections.has('autonomy')}
            aria-controls="autonomy-section"
            className="w-full px-4 py-3 bg-zinc-800/50 flex items-center justify-between hover:bg-zinc-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Bot className="w-5 h-5 text-purple-400" />
              <span className="font-medium text-white">Autonomy</span>
            </div>
            <ChevronDown
              className={clsx(
                'w-5 h-5 text-zinc-400 transition-transform',
                expandedSections.has('autonomy') && 'rotate-180'
              )}
            />
          </button>

          {expandedSections.has('autonomy') && (
            <div id="autonomy-section" className="p-4 space-y-4">
              {/* Autonomy Level */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Autonomy Level
                  {isDifferentFromParent('autonomy', 'level') && (
                    <span className="ml-2 text-xs text-amber-400">(overridden)</span>
                  )}
                </label>
                <div className="space-y-2">
                  {AUTONOMY_LEVELS.map((item) => (
                    <button
                      key={item.level}
                      type="button"
                      onClick={(): void => updateAutonomy({ level: item.level })}
                      disabled={readOnly}
                      className={clsx(
                        'w-full p-4 rounded-lg border text-left transition-all flex items-center gap-4',
                        editedSettings.autonomy.level === item.level
                          ? 'bg-purple-500/10 border-purple-500'
                          : 'bg-zinc-900 border-zinc-700 hover:border-zinc-600',
                        readOnly && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      <div
                        className={clsx(
                          'w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg',
                          editedSettings.autonomy.level === item.level
                            ? 'bg-purple-500 text-white'
                            : 'bg-zinc-800 text-zinc-500'
                        )}
                      >
                        {item.level}
                      </div>
                      <div>
                        <span
                          className={clsx(
                            'block font-medium',
                            editedSettings.autonomy.level === item.level
                              ? 'text-white'
                              : 'text-zinc-400'
                          )}
                        >
                          {item.label}
                        </span>
                        <span className="block text-xs text-zinc-500 mt-0.5">
                          {item.description}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Auto-Approve Toggle */}
              <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-zinc-300">Auto-Approve Actions</p>
                  <p className="text-xs text-zinc-500 mt-1">
                    Allow AI to execute routine actions without confirmation
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editedSettings.autonomy.autoApprove}
                    onChange={(e): void => updateAutonomy({ autoApprove: e.target.checked })}
                    disabled={readOnly}
                    className="sr-only peer"
                    aria-label="Auto-approve actions"
                  />
                  <div
                    className={clsx(
                      'w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[\'\'] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500',
                      readOnly && 'opacity-50 cursor-not-allowed'
                    )}
                  />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Rules Section */}
        <div className="border border-zinc-800 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={(): void => toggleSection('rules')}
            aria-expanded={expandedSections.has('rules')}
            aria-controls="rules-section"
            className="w-full px-4 py-3 bg-zinc-800/50 flex items-center justify-between hover:bg-zinc-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-green-400" />
              <span className="font-medium text-white">Custom Rules</span>
              <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">
                {editedSettings.rules.length}
              </span>
            </div>
            <ChevronDown
              className={clsx(
                'w-5 h-5 text-zinc-400 transition-transform',
                expandedSections.has('rules') && 'rotate-180'
              )}
            />
          </button>

          {expandedSections.has('rules') && (
            <div id="rules-section" className="p-4 space-y-3">
              {/* Existing Rules */}
              {editedSettings.rules.length > 0 ? (
                <ul className="space-y-2">
                  {editedSettings.rules.map((rule, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 p-3 bg-zinc-800/50 rounded-lg group"
                    >
                      <span className="text-green-400 font-mono text-xs mt-1">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="flex-1 text-sm text-zinc-300">{rule}</span>
                      {!readOnly && (
                        <button
                          type="button"
                          onClick={(): void => removeRule(index)}
                          className="p-1 text-zinc-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                          aria-label="Remove rule"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-6">
                  <FileText className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                  <p className="text-sm text-zinc-400">No custom rules defined</p>
                  <p className="text-xs text-zinc-500 mt-1">
                    Add rules to guide AI behavior in this space
                  </p>
                </div>
              )}

              {/* Add New Rule */}
              {!readOnly && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newRule}
                    onChange={(e): void => setNewRule(e.target.value)}
                    onKeyDown={(e): void => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addRule();
                      }
                    }}
                    placeholder="Add a new rule..."
                    className="flex-1 px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-green-500"
                  />
                  <button
                    type="button"
                    onClick={addRule}
                    disabled={!newRule.trim()}
                    className={clsx(
                      'px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors',
                      newRule.trim()
                        ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                        : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    )}
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      {!readOnly && (
        <div className="px-6 py-4 border-t border-zinc-800 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            disabled={!hasChanges}
            className={clsx(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors',
              hasChanges
                ? 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                : 'text-zinc-600 cursor-not-allowed'
            )}
          >
            <RotateCcw className="w-4 h-4" />
            Reset Changes
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!hasChanges}
            className={clsx(
              'flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-all',
              hasChanges
                ? 'bg-gradient-to-r from-symtex-primary to-symtex-accent text-white hover:opacity-90'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            )}
          >
            <Save className="w-4 h-4" />
            Save Settings
          </button>
        </div>
      )}
    </div>
  );
}

export default SpaceSettingsPanel;
