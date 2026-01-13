/**
 * Workflow API Service
 */

import { api } from '../client';
import type {
  Workflow,
  ExecutionResult,
  CreateWorkflowRequest,
  UpdateWorkflowRequest,
  ExecuteWorkflowRequest,
  GenerateWorkflowRequest,
  PaginatedResponse,
} from '@/types';

export const workflowService = {
  /**
   * Get all workflows
   */
  list: async (params?: {
    page?: number;
    pageSize?: number;
    status?: string;
  }): Promise<PaginatedResponse<Workflow>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.pageSize) searchParams.set('pageSize', String(params.pageSize));
    if (params?.status) searchParams.set('status', params.status);

    const query = searchParams.toString();
    return api.get(`/workflows${query ? `?${query}` : ''}`);
  },

  /**
   * Get a single workflow by ID
   */
  get: async (id: string): Promise<Workflow> => {
    return api.get(`/workflows/${id}`);
  },

  /**
   * Create a new workflow
   */
  create: async (data: CreateWorkflowRequest): Promise<Workflow> => {
    return api.post('/workflows', data);
  },

  /**
   * Update an existing workflow
   */
  update: async (id: string, data: UpdateWorkflowRequest): Promise<Workflow> => {
    return api.put(`/workflows/${id}`, data);
  },

  /**
   * Delete a workflow
   */
  delete: async (id: string): Promise<void> => {
    return api.delete(`/workflows/${id}`);
  },

  /**
   * Execute a workflow
   */
  execute: async (
    id: string,
    data?: ExecuteWorkflowRequest
  ): Promise<ExecutionResult> => {
    return api.post(`/workflows/${id}/execute`, data);
  },

  /**
   * Get workflow execution history
   */
  getExecutions: async (
    id: string,
    params?: { page?: number; pageSize?: number }
  ): Promise<PaginatedResponse<ExecutionResult>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.pageSize) searchParams.set('pageSize', String(params.pageSize));

    const query = searchParams.toString();
    return api.get(`/workflows/${id}/executions${query ? `?${query}` : ''}`);
  },

  /**
   * Generate workflow from natural language
   */
  generate: async (
    data: GenerateWorkflowRequest
  ): Promise<{ nodes: unknown[]; edges: unknown[] }> => {
    return api.post('/workflows/generate', data);
  },

  /**
   * Duplicate a workflow
   */
  duplicate: async (id: string): Promise<Workflow> => {
    return api.post(`/workflows/${id}/duplicate`);
  },

  /**
   * Publish a workflow (change status to published)
   */
  publish: async (id: string): Promise<Workflow> => {
    return api.post(`/workflows/${id}/publish`);
  },

  /**
   * Archive a workflow
   */
  archive: async (id: string): Promise<Workflow> => {
    return api.post(`/workflows/${id}/archive`);
  },
};
