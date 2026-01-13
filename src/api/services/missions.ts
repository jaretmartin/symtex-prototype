/**
 * Mission API Service
 */

import { api } from '../client';
import type {
  Mission,
  CreateMissionRequest,
  UpdateMissionRequest,
  PaginatedResponse,
} from '@/types';

export const missionService = {
  /**
   * Get all missions
   */
  list: async (params?: {
    page?: number;
    pageSize?: number;
    status?: string;
    priority?: string;
    search?: string;
  }): Promise<PaginatedResponse<Mission>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.pageSize) searchParams.set('pageSize', String(params.pageSize));
    if (params?.status) searchParams.set('status', params.status);
    if (params?.priority) searchParams.set('priority', params.priority);
    if (params?.search) searchParams.set('search', params.search);

    const query = searchParams.toString();
    return api.get(`/missions${query ? `?${query}` : ''}`);
  },

  /**
   * Get a single mission by ID
   */
  get: async (id: string): Promise<Mission> => {
    return api.get(`/missions/${id}`);
  },

  /**
   * Create a new mission
   */
  create: async (data: CreateMissionRequest): Promise<Mission> => {
    return api.post('/missions', data);
  },

  /**
   * Update an existing mission
   */
  update: async (id: string, data: UpdateMissionRequest): Promise<Mission> => {
    return api.patch(`/missions/${id}`, data);
  },

  /**
   * Delete a mission
   */
  delete: async (id: string): Promise<void> => {
    return api.delete(`/missions/${id}`);
  },

  /**
   * Update mission progress
   */
  updateProgress: async (id: string, progress: number): Promise<Mission> => {
    return api.patch(`/missions/${id}/progress`, { progress });
  },

  /**
   * Update mission status
   */
  updateStatus: async (
    id: string,
    status: Mission['status']
  ): Promise<Mission> => {
    return api.patch(`/missions/${id}/status`, { status });
  },

  /**
   * Add tags to a mission
   */
  addTags: async (id: string, tags: string[]): Promise<Mission> => {
    return api.post(`/missions/${id}/tags`, { tags });
  },

  /**
   * Remove a tag from a mission
   */
  removeTag: async (id: string, tag: string): Promise<Mission> => {
    return api.delete(`/missions/${id}/tags/${encodeURIComponent(tag)}`);
  },
};
