/**
 * API request payload types
 */

import type { MissionPriority, MissionStatus } from '../entities/mission';
import type { WorkflowStatus } from '../entities/workflow';

export interface CreateMissionRequest {
  title: string;
  description: string;
  priority: MissionPriority;
  dueDate?: string;
  tags?: string[];
}

export interface UpdateMissionRequest {
  title?: string;
  description?: string;
  priority?: MissionPriority;
  status?: MissionStatus;
  progress?: number;
  dueDate?: string;
  tags?: string[];
}

export interface CreateWorkflowRequest {
  name: string;
  description?: string;
  nodes: unknown[];
  edges: unknown[];
}

export interface UpdateWorkflowRequest {
  name?: string;
  description?: string;
  nodes?: unknown[];
  edges?: unknown[];
  status?: WorkflowStatus;
}

export interface ExecuteWorkflowRequest {
  triggerData?: Record<string, unknown>;
  dryRun?: boolean;
}

export interface GenerateWorkflowRequest {
  prompt: string;
  context?: string;
}

export interface TrackEventRequest {
  type: string;
  properties?: Record<string, unknown>;
  timestamp?: string;
  sessionId?: string;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
