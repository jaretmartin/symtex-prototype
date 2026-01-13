/**
 * Workflow entity types for LUX Builder
 */

import type { Node, Edge } from 'reactflow';

export type WorkflowStatus = 'draft' | 'published' | 'archived';

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  nodes: Node[];
  edges: Edge[];
  version: number;
  status: WorkflowStatus;
  createdAt: string;
  updatedAt: string;
  lastExecutedAt?: string;
}

export interface WorkflowMetadata {
  tags?: string[];
  category?: string;
  executionCount?: number;
}

// Node data types for each node type
export interface TriggerNodeData {
  label: string;
  description?: string;
  icon?: string;
  triggerType?: 'manual' | 'schedule' | 'webhook' | 'event';
  config?: Record<string, unknown>;
}

export interface ConditionNodeData {
  label: string;
  description?: string;
  icon?: string;
  expression?: string;
  operator?: 'equals' | 'contains' | 'greater' | 'less' | 'exists';
  leftOperand?: string;
  rightOperand?: string;
}

export interface ActionNodeData {
  label: string;
  description?: string;
  icon?: string;
  actionType?: 'email' | 'sms' | 'api' | 'notification' | 'update' | 'create';
  config?: Record<string, unknown>;
}

export interface DelayNodeData {
  label: string;
  description?: string;
  duration?: string;
  unit?: 'seconds' | 'minutes' | 'hours' | 'days';
}

export type NodeData = TriggerNodeData | ConditionNodeData | ActionNodeData | DelayNodeData;

// Execution types
export type ExecutionStatus = 'pending' | 'running' | 'paused' | 'completed' | 'failed' | 'cancelled';

export interface ExecutionLog {
  nodeId: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  data?: unknown;
}

export interface ExecutionContext {
  workflowId: string;
  runId: string;
  variables: Record<string, unknown>;
  status: ExecutionStatus;
  currentNodeId: string | null;
  logs: ExecutionLog[];
  startedAt: string;
  completedAt?: string;
  error?: string;
}

export interface ExecutionResult {
  success: boolean;
  context: ExecutionContext;
  duration: number;
}

// History for undo/redo
export interface HistorySnapshot {
  nodes: Node[];
  edges: Edge[];
  timestamp: number;
}
