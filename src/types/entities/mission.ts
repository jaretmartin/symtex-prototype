/**
 * Mission entity types
 */

export type MissionPriority = 'critical' | 'high' | 'medium' | 'low';

export type MissionStatus = 'active' | 'pending' | 'completed' | 'blocked';

export interface MissionSubtasks {
  completed: number;
  total: number;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  priority: MissionPriority;
  status: MissionStatus;
  progress: number;
  dueDate: string;
  assignees: number;
  automationLevel: number;
  tags: string[];
  subtasks: MissionSubtasks;
  createdAt: string;
  updatedAt: string;
}

export interface MissionFilters {
  search: string;
  priorities: MissionPriority[];
  statuses: MissionStatus[];
}

export type ViewMode = 'grid' | 'list' | 'kanban' | 'timeline';
