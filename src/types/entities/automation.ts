/**
 * Automation entity types
 */

export type AutomationStatus = 'active' | 'paused' | 'draft' | 'error';

export interface Automation {
  id: string;
  name: string;
  description: string;
  status: AutomationStatus;
  trigger: string;
  lastRun?: string;
  nextRun?: string;
  executionCount: number;
  successRate: number;
  averageDuration: number;
  createdAt: string;
  updatedAt: string;
}

export interface AutomationTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  popularity: number;
  triggers: string[];
  actions: string[];
  estimatedSetupTime: string;
}

export interface AutomationRun {
  id: string;
  automationId: string;
  status: 'success' | 'failure' | 'running' | 'cancelled';
  startedAt: string;
  completedAt?: string;
  duration?: number;
  errorMessage?: string;
  logs: AutomationLog[];
}

export interface AutomationLog {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  step: string;
  message: string;
  data?: unknown;
}
