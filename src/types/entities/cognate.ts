/**
 * Cognate Entity Types
 *
 * A Cognate represents an AI agent or assistant with associated SOPs,
 * configurations, and behavioral rules.
 */

export type CognateStatus = 'draft' | 'active' | 'paused' | 'archived';

export interface Cognate {
  id: string;
  name: string;
  description: string;
  status: CognateStatus;
  avatar?: string;
  industry?: string;
  role?: string;
  createdAt: string;
  updatedAt: string;
  sopCount: number;
  activeSOPCount: number;
  tags: string[];
}

export interface CognateConfig {
  cognateId: string;
  tier: 'universal' | 'industry' | 'role' | 'organization' | 'instance';
  settings: Record<string, unknown>;
}

export type SOPStatus = 'draft' | 'active' | 'archived';
export type SOPPriority = 'low' | 'medium' | 'high' | 'critical';
export type TriggerType = 'message' | 'event' | 'schedule' | 'condition' | 'manual';
export type ConditionOperator = 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'matches' | 'exists' | 'not_exists';
export type ActionType = 'respond' | 'escalate' | 'log' | 'notify' | 'execute' | 'wait' | 'branch';

export interface SOPCondition {
  id: string;
  field: string;
  operator: ConditionOperator;
  value: string;
  namespace?: string;
}

export interface SOPAction {
  id: string;
  type: ActionType;
  config: Record<string, unknown>;
  label?: string;
}

export interface SOPRule {
  id: string;
  name: string;
  description?: string;
  trigger: {
    type: TriggerType;
    config: Record<string, unknown>;
  };
  conditions: SOPCondition[];
  thenActions: SOPAction[];
  elseActions?: SOPAction[];
  enabled: boolean;
  order: number;
}

export interface SOP {
  id: string;
  cognateId: string;
  name: string;
  description: string;
  status: SOPStatus;
  priority: SOPPriority;
  version: string;
  rules: SOPRule[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  lastTriggeredAt?: string;
  triggerCount: number;
  isValid: boolean;
  validationErrors?: string[];
}

export interface ExtendedSOP extends SOP {
  // Additional metadata for the editor
  author?: string;
  category?: string;
  estimatedDuration?: string;
}

export interface SOPPack {
  id: string;
  name: string;
  description: string;
  type: 'industry' | 'role' | 'compliance' | 'starter';
  sopCount: number;
  installCount: number;
  rating: number;
  tags: string[];
  author: string;
  version: string;
  createdAt: string;
  updatedAt: string;
  preview?: SOP[];
}

export interface BootstrapConfig {
  industry?: string;
  role?: string;
  selectedPacks: string[];
  customizations: Record<string, unknown>;
}

// Constants
export const SOP_STATUSES: Record<SOPStatus, { label: string; color: string }> = {
  draft: { label: 'Draft', color: 'yellow' },
  active: { label: 'Active', color: 'green' },
  archived: { label: 'Archived', color: 'gray' },
};

export const SOP_PRIORITIES: Record<SOPPriority, { label: string; color: string }> = {
  low: { label: 'Low', color: 'gray' },
  medium: { label: 'Medium', color: 'blue' },
  high: { label: 'High', color: 'orange' },
  critical: { label: 'Critical', color: 'red' },
};

export const TRIGGER_TYPES: Record<TriggerType, { label: string; icon: string }> = {
  message: { label: 'Message Received', icon: 'message-circle' },
  event: { label: 'Event Triggered', icon: 'zap' },
  schedule: { label: 'Scheduled', icon: 'clock' },
  condition: { label: 'Condition Met', icon: 'git-branch' },
  manual: { label: 'Manual Trigger', icon: 'hand' },
};

export const CONDITION_OPERATORS: Record<ConditionOperator, string> = {
  equals: 'equals',
  not_equals: 'does not equal',
  contains: 'contains',
  not_contains: 'does not contain',
  greater_than: 'is greater than',
  less_than: 'is less than',
  matches: 'matches pattern',
  exists: 'exists',
  not_exists: 'does not exist',
};

export const ACTION_TYPES: Record<ActionType, { label: string; icon: string }> = {
  respond: { label: 'Send Response', icon: 'message-square' },
  escalate: { label: 'Escalate', icon: 'arrow-up-right' },
  log: { label: 'Log Event', icon: 'file-text' },
  notify: { label: 'Send Notification', icon: 'bell' },
  execute: { label: 'Execute Action', icon: 'play' },
  wait: { label: 'Wait', icon: 'clock' },
  branch: { label: 'Branch', icon: 'git-branch' },
};
