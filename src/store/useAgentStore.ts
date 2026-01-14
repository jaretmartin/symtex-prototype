/**
 * Agent Store - Agent roster state management
 *
 * Manages AI agent templates, instances, and their executions.
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { AgentTemplate, AgentInstance, AgentExecution, AgentStatus } from '@/types';

interface AgentState {
  // Data
  templates: AgentTemplate[];
  instances: Record<string, AgentInstance>;
  executions: Record<string, AgentExecution>;

  // Selection state
  selectedTemplateId: string | null;
  selectedInstanceId: string | null;

  // Loading states
  isLoading: boolean;
  error: string | null;

  // Actions - Template management
  /** Sets all templates */
  setTemplates: (templates: AgentTemplate[]) => void;
  /** Adds a new template */
  addTemplate: (template: AgentTemplate) => void;
  /** Updates an existing template */
  updateTemplate: (id: string, updates: Partial<AgentTemplate>) => void;
  /** Removes a template */
  removeTemplate: (id: string) => void;
  /** Selects a template */
  selectTemplate: (id: string | null) => void;

  // Actions - Instance CRUD
  /** Creates a new agent instance */
  createInstance: (instance: AgentInstance) => void;
  /** Updates an existing instance */
  updateInstance: (id: string, updates: Partial<AgentInstance>) => void;
  /** Deletes an instance and its executions */
  deleteInstance: (id: string) => void;
  /** Selects an instance */
  selectInstance: (id: string | null) => void;

  // Actions - Execution management
  /** Starts a new execution */
  startExecution: (execution: AgentExecution) => void;
  /** Completes an execution */
  completeExecution: (id: string, output?: string, error?: string) => void;
  /** Pauses an agent (marks instance and current execution as paused) */
  pauseAgent: (instanceId: string) => void;
  /** Resumes an agent from paused state */
  resumeAgent: (instanceId: string) => void;
  /** Cancels an execution */
  cancelExecution: (id: string) => void;
  /** Updates an execution */
  updateExecution: (id: string, updates: Partial<AgentExecution>) => void;

  // Actions - Loading
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;

  // Computed
  /** Gets all running agents (instances with 'running' executions) */
  getRunningAgents: () => AgentInstance[];
  /** Gets all agents assigned to a specific mission */
  getAgentsByMission: (missionId: string) => AgentInstance[];
  /** Gets all agents assigned to a specific project */
  getAgentsByProject: (projectId: string) => AgentInstance[];
  /** Gets all instances as an array */
  getInstances: () => AgentInstance[];
  /** Gets executions for a specific instance */
  getExecutionsForInstance: (instanceId: string) => AgentExecution[];
  /** Gets the current/latest execution for an instance */
  getCurrentExecution: (instanceId: string) => AgentExecution | null;
  /** Gets active templates */
  getActiveTemplates: () => AgentTemplate[];
}

const initialState = {
  templates: [] as AgentTemplate[],
  instances: {} as Record<string, AgentInstance>,
  executions: {} as Record<string, AgentExecution>,
  selectedTemplateId: null as string | null,
  selectedInstanceId: null as string | null,
  isLoading: false,
  error: null as string | null,
};

export const useAgentStore = create<AgentState>()(
  devtools(
    (set, get) => ({
      // Initial state
      ...initialState,

      // Template management
      setTemplates: (templates): void => {
        set({ templates });
      },

      addTemplate: (template): void => {
        set((state) => ({
          templates: [...state.templates, template],
        }));
      },

      updateTemplate: (id, updates): void => {
        set((state) => ({
          templates: state.templates.map((t) =>
            t.id === id
              ? { ...t, ...updates, updatedAt: new Date().toISOString() }
              : t
          ),
        }));
      },

      removeTemplate: (id): void => {
        set((state) => ({
          templates: state.templates.filter((t) => t.id !== id),
          selectedTemplateId:
            state.selectedTemplateId === id ? null : state.selectedTemplateId,
        }));
      },

      selectTemplate: (id): void => {
        set({ selectedTemplateId: id });
      },

      // Instance CRUD
      createInstance: (instance): void => {
        set((state) => ({
          instances: {
            ...state.instances,
            [instance.id]: instance,
          },
        }));

        // Update template instance count if the template tracks it
        const template = get().templates.find((t) => t.id === instance.templateId);
        if (template && template.instanceCount !== undefined) {
          get().updateTemplate(template.id, {
            instanceCount: (template.instanceCount ?? 0) + 1,
          });
        }
      },

      updateInstance: (id, updates): void => {
        set((state) => {
          const existing = state.instances[id];
          if (!existing) return state;

          return {
            instances: {
              ...state.instances,
              [id]: {
                ...existing,
                ...updates,
                updatedAt: new Date().toISOString(),
              },
            },
          };
        });
      },

      deleteInstance: (id): void => {
        set((state) => {
          const instance = state.instances[id];
          if (!instance) return state;

          // Remove instance
          const newInstances = { ...state.instances };
          delete newInstances[id];

          // Remove associated executions
          const newExecutions = { ...state.executions };
          Object.values(state.executions)
            .filter((e) => e.instanceId === id)
            .forEach((e) => delete newExecutions[e.id]);

          return {
            instances: newInstances,
            executions: newExecutions,
            selectedInstanceId:
              state.selectedInstanceId === id ? null : state.selectedInstanceId,
          };
        });
      },

      selectInstance: (id): void => {
        set({ selectedInstanceId: id });
      },

      // Execution management
      startExecution: (execution): void => {
        set((state) => {
          // Update instance status and stats
          const instance = state.instances[execution.instanceId];
          const newInstances = instance
            ? {
                ...state.instances,
                [execution.instanceId]: {
                  ...instance,
                  status: 'busy' as AgentStatus,
                  totalExecutions: (instance.totalExecutions ?? 0) + 1,
                  lastActiveAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                },
              }
            : state.instances;

          return {
            executions: {
              ...state.executions,
              [execution.id]: execution,
            },
            instances: newInstances,
          };
        });
      },

      completeExecution: (id, output, error): void => {
        set((state) => {
          const execution = state.executions[id];
          if (!execution) return state;

          const now = new Date().toISOString();
          const startTime = new Date(execution.startedAt).getTime();
          const duration = Date.now() - startTime;

          const isSuccess = !error;
          const newStatus = error ? 'failed' : 'completed';

          // Update execution
          const newExecutions = {
            ...state.executions,
            [id]: {
              ...execution,
              status: newStatus as AgentExecution['status'],
              output: output ?? execution.output,
              error: error ?? execution.error,
              completedAt: now,
              duration,
            },
          };

          // Update instance
          const instance = state.instances[execution.instanceId];
          const newInstances = instance
            ? {
                ...state.instances,
                [execution.instanceId]: {
                  ...instance,
                  status: 'idle' as AgentStatus,
                  successfulExecutions: isSuccess
                    ? (instance.successfulExecutions ?? 0) + 1
                    : (instance.successfulExecutions ?? 0),
                  lastActiveAt: now,
                  updatedAt: now,
                },
              }
            : state.instances;

          return {
            executions: newExecutions,
            instances: newInstances,
          };
        });
      },

      pauseAgent: (instanceId): void => {
        set((state) => {
          const instance = state.instances[instanceId];
          if (!instance) return state;

          // Find running execution for this instance
          const runningExecution = Object.values(state.executions).find(
            (e) => e.instanceId === instanceId && e.status === 'running'
          );

          const newExecutions = runningExecution
            ? {
                ...state.executions,
                [runningExecution.id]: {
                  ...runningExecution,
                  status: 'paused' as const,
                },
              }
            : state.executions;

          return {
            instances: {
              ...state.instances,
              [instanceId]: {
                ...instance,
                status: 'paused' as AgentStatus,
                updatedAt: new Date().toISOString(),
              },
            },
            executions: newExecutions,
          };
        });
      },

      resumeAgent: (instanceId): void => {
        set((state) => {
          const instance = state.instances[instanceId];
          if (!instance || instance.status !== 'paused') return state;

          // Find paused execution for this instance
          const pausedExecution = Object.values(state.executions).find(
            (e) => e.instanceId === instanceId && e.status === 'paused'
          );

          const newExecutions = pausedExecution
            ? {
                ...state.executions,
                [pausedExecution.id]: {
                  ...pausedExecution,
                  status: 'running' as const,
                },
              }
            : state.executions;

          const newStatus: AgentStatus = pausedExecution ? 'busy' : 'idle';

          return {
            instances: {
              ...state.instances,
              [instanceId]: {
                ...instance,
                status: newStatus,
                updatedAt: new Date().toISOString(),
              },
            },
            executions: newExecutions,
          };
        });
      },

      cancelExecution: (id): void => {
        set((state) => {
          const execution = state.executions[id];
          if (!execution) return state;

          const now = new Date().toISOString();

          // Update execution
          const newExecutions = {
            ...state.executions,
            [id]: {
              ...execution,
              status: 'cancelled' as const,
              completedAt: now,
            },
          };

          // Update instance
          const instance = state.instances[execution.instanceId];
          const newInstances = instance
            ? {
                ...state.instances,
                [execution.instanceId]: {
                  ...instance,
                  status: 'idle' as AgentStatus,
                  lastActiveAt: now,
                  updatedAt: now,
                },
              }
            : state.instances;

          return {
            executions: newExecutions,
            instances: newInstances,
          };
        });
      },

      updateExecution: (id, updates): void => {
        set((state) => {
          const existing = state.executions[id];
          if (!existing) return state;

          return {
            executions: {
              ...state.executions,
              [id]: { ...existing, ...updates },
            },
          };
        });
      },

      // Loading actions
      setLoading: (isLoading): void => {
        set({ isLoading });
      },

      setError: (error): void => {
        set({ error, isLoading: false });
      },

      reset: (): void => {
        set(initialState);
      },

      // Computed
      getRunningAgents: (): AgentInstance[] => {
        const { instances, executions } = get();
        const runningExecutionInstanceIds = new Set(
          Object.values(executions)
            .filter((e) => e.status === 'running')
            .map((e) => e.instanceId)
        );

        return Object.values(instances).filter((instance) =>
          runningExecutionInstanceIds.has(instance.id)
        );
      },

      getAgentsByMission: (missionId): AgentInstance[] => {
        const { instances } = get();
        return Object.values(instances).filter((i) => i.missionId === missionId);
      },

      getAgentsByProject: (projectId): AgentInstance[] => {
        const { instances } = get();
        return Object.values(instances).filter((i) => i.projectId === projectId);
      },

      getInstances: (): AgentInstance[] => {
        const { instances } = get();
        return Object.values(instances);
      },

      getExecutionsForInstance: (instanceId): AgentExecution[] => {
        const { executions } = get();
        return Object.values(executions)
          .filter((e) => e.instanceId === instanceId)
          .sort((a, b) =>
            new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
          );
      },

      getCurrentExecution: (instanceId): AgentExecution | null => {
        const { executions } = get();
        const instanceExecutions = Object.values(executions)
          .filter((e) => e.instanceId === instanceId)
          .sort((a, b) =>
            new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
          );

        return instanceExecutions[0] ?? null;
      },

      getActiveTemplates: (): AgentTemplate[] => {
        const { templates } = get();
        return templates.filter((t) => t.status === 'active');
      },
    }),
    { name: 'AgentStore' }
  )
);
