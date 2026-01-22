/**
 * Cognate Store - Unified state management for Cognates, SOPs, and executions
 *
 * This store consolidates Cognate management (formerly split between CognateStore
 * and AgentStore). All "agent" functionality has been merged here using
 * proper Symtex terminology.
 *
 * Terminology:
 * - Cognate = AI assistant (NOT "agent")
 * - Cognate Template = Blueprint for a Cognate type
 * - Cognate Instance = Running instance of a Cognate
 * - Cognate Execution = A single execution/action by a Cognate
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type {
  Cognate,
  CognateStatus,
  SOP,
  SOPStatus,
  SOPPack,
  BootstrapConfig,
  CognateTemplate,
  CognateInstance,
  CognateExecution,
  CognateInstanceStatus,
} from '@/types';
import { cognates as canonicalCognates } from '@/mocks/cognates';

// Re-export types with Cognate naming for external use
export type { CognateTemplate, CognateInstance, CognateExecution, CognateInstanceStatus };

interface SOPFilters {
  search: string;
  statuses: SOPStatus[];
  tags: string[];
}

interface CognateState {
  // === Cognate Profile Data ===
  cognates: Cognate[];
  selectedCognate: Cognate | null;
  sops: SOP[];
  selectedSOP: SOP | null;
  packs: SOPPack[];

  // === Cognate Instance/Execution Data ===
  templates: CognateTemplate[];
  instances: Record<string, CognateInstance>;
  executions: Record<string, CognateExecution>;
  selectedTemplateId: string | null;
  selectedInstanceId: string | null;

  // === Bootstrap state ===
  bootstrapConfig: BootstrapConfig | null;
  bootstrapStep: number;

  // === Filters ===
  sopFilters: SOPFilters;
  viewMode: 'grid' | 'list';

  // === Loading states ===
  isLoading: boolean;
  error: string | null;

  // === Cognate Profile Actions ===
  setCognates: (cognates: Cognate[]) => void;
  addCognate: (cognate: Cognate) => void;
  updateCognate: (id: string, updates: Partial<Cognate>) => void;
  removeCognate: (id: string) => void;
  selectCognate: (cognate: Cognate | null) => void;
  setCognateStatus: (id: string, status: CognateStatus) => void;

  // === SOP Actions ===
  setSOPs: (sops: SOP[]) => void;
  addSOP: (sop: SOP) => void;
  updateSOP: (id: string, updates: Partial<SOP>) => void;
  removeSOP: (id: string) => void;
  selectSOP: (sop: SOP | null) => void;
  toggleSOPStatus: (id: string) => void;
  duplicateSOP: (id: string) => void;

  // === Pack Actions ===
  setPacks: (packs: SOPPack[]) => void;
  installPack: (packId: string) => void;

  // === Bootstrap Actions ===
  setBootstrapConfig: (config: Partial<BootstrapConfig>) => void;
  setBootstrapStep: (step: number) => void;
  resetBootstrap: () => void;

  // === Filter Actions ===
  setSOPFilters: (filters: Partial<SOPFilters>) => void;
  resetSOPFilters: () => void;
  setViewMode: (mode: 'grid' | 'list') => void;

  // === Template Actions (Cognate blueprints) ===
  setTemplates: (templates: CognateTemplate[]) => void;
  addTemplate: (template: CognateTemplate) => void;
  updateTemplate: (id: string, updates: Partial<CognateTemplate>) => void;
  removeTemplate: (id: string) => void;
  selectTemplate: (id: string | null) => void;

  // === Instance Actions (running Cognates) ===
  createInstance: (instance: CognateInstance) => void;
  updateInstance: (id: string, updates: Partial<CognateInstance>) => void;
  deleteInstance: (id: string) => void;
  selectInstance: (id: string | null) => void;

  // === Execution Actions ===
  startExecution: (execution: CognateExecution) => void;
  completeExecution: (id: string, output?: string, error?: string) => void;
  pauseCognate: (instanceId: string) => void;
  resumeCognate: (instanceId: string) => void;
  cancelExecution: (id: string) => void;
  updateExecution: (id: string, updates: Partial<CognateExecution>) => void;

  // === Loading Actions ===
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // === Reset ===
  reset: () => void;

  // === Computed - SOPs ===
  getFilteredSOPs: () => SOP[];
  getSOPStats: () => {
    total: number;
    active: number;
    draft: number;
    rulesCount: number;
    triggersCount: number;
  };
  getCognateSOPs: (cognateId: string) => SOP[];

  // === Computed - Instances ===
  getRunningCognates: () => CognateInstance[];
  getCognatesByMission: (missionId: string) => CognateInstance[];
  getCognatesByProject: (projectId: string) => CognateInstance[];
  getInstances: () => CognateInstance[];
  getExecutionsForInstance: (instanceId: string) => CognateExecution[];
  getCurrentExecution: (instanceId: string) => CognateExecution | null;
  getActiveTemplates: () => CognateTemplate[];
}

const defaultSOPFilters: SOPFilters = {
  search: '',
  statuses: [],
  tags: [],
};

const defaultBootstrapConfig: BootstrapConfig = {
  industry: undefined,
  role: undefined,
  selectedPacks: [],
  customizations: {},
};

/**
 * Adapt canonical mock cognates to the store's Cognate type.
 * The canonical mocks use a different schema (autonomyLevel, skills, stats, etc.)
 * so we map them to the store's expected format.
 */
const mockCognates: Cognate[] = canonicalCognates.map((cog) => ({
  id: cog.id,
  name: cog.name,
  description: cog.description,
  status: cog.status === 'idle' || cog.status === 'training' || cog.status === 'error'
    ? 'active' as CognateStatus // Map non-standard statuses to 'active'
    : cog.status as CognateStatus,
  avatar: cog.avatar,
  industry: cog.assignedSpaces[0]?.replace('space-', '').replace(/-/g, ' ') || 'Operations',
  role: cog.name.replace(' Cognate', '').replace('Cognate', ''),
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: new Date().toISOString(),
  sopCount: cog.sopCount,
  activeSOPCount: Math.floor(cog.sopCount * 0.75), // Approximate 75% active
  tags: cog.skills.slice(0, 3), // Use first 3 skills as tags
}));

const mockSOPs: SOP[] = [
  {
    id: 'sop-1',
    cognateId: 'cog-1',
    name: 'Greeting Protocol',
    description: 'Standard greeting for customer interactions',
    status: 'active',
    priority: 'high',
    version: '1.2.0',
    rules: [
      {
        id: 'rule-1',
        name: 'Initial Greeting',
        trigger: { type: 'message', config: { pattern: '*' } },
        conditions: [
          { id: 'cond-1', field: 'message.isFirst', operator: 'equals', value: 'true' },
        ],
        thenActions: [
          { id: 'action-1', type: 'respond', config: { template: 'greeting' } },
        ],
        enabled: true,
        order: 1,
      },
    ],
    tags: ['greeting', 'customer'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    lastTriggeredAt: '2024-01-20T14:25:00Z',
    triggerCount: 1523,
    isValid: true,
  },
  {
    id: 'sop-2',
    cognateId: 'cog-1',
    name: 'Escalation Handler',
    description: 'Handles escalation requests to human support',
    status: 'active',
    priority: 'critical',
    version: '2.0.1',
    rules: [
      {
        id: 'rule-2',
        name: 'Detect Escalation Request',
        trigger: { type: 'message', config: { pattern: 'escalate|human|support' } },
        conditions: [
          { id: 'cond-2', field: 'sentiment', operator: 'less_than', value: '0.3' },
        ],
        thenActions: [
          { id: 'action-2', type: 'escalate', config: { team: 'support' } },
          { id: 'action-3', type: 'notify', config: { channel: 'slack' } },
        ],
        enabled: true,
        order: 1,
      },
    ],
    tags: ['escalation', 'urgent'],
    createdAt: '2024-01-16T11:00:00Z',
    updatedAt: '2024-01-19T16:00:00Z',
    lastTriggeredAt: '2024-01-20T12:15:00Z',
    triggerCount: 287,
    isValid: true,
  },
  {
    id: 'sop-3',
    cognateId: 'cog-1',
    name: 'FAQ Response',
    description: 'Automated responses for frequently asked questions',
    status: 'draft',
    priority: 'medium',
    version: '0.5.0',
    rules: [],
    tags: ['faq', 'automation'],
    createdAt: '2024-01-18T09:00:00Z',
    updatedAt: '2024-01-18T09:00:00Z',
    triggerCount: 0,
    isValid: false,
    validationErrors: ['No rules defined'],
  },
];

const initialState = {
  // Cognate profile data
  cognates: mockCognates,
  selectedCognate: null as Cognate | null,
  sops: mockSOPs,
  selectedSOP: null as SOP | null,
  packs: [] as SOPPack[],

  // Instance/execution data
  templates: [] as CognateTemplate[],
  instances: {} as Record<string, CognateInstance>,
  executions: {} as Record<string, CognateExecution>,
  selectedTemplateId: null as string | null,
  selectedInstanceId: null as string | null,

  // Bootstrap
  bootstrapConfig: null as BootstrapConfig | null,
  bootstrapStep: 0,

  // Filters
  sopFilters: defaultSOPFilters,
  viewMode: 'grid' as const,

  // Loading
  isLoading: false,
  error: null as string | null,
};

export const useCognateStore = create<CognateState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        ...initialState,

        // ==========================================
        // Cognate Profile Actions
        // ==========================================

        setCognates: (cognates) => {
          set({ cognates, isLoading: false, error: null });
        },

        addCognate: (cognate) => {
          set((state) => ({
            cognates: [...state.cognates, cognate],
          }));
        },

        updateCognate: (id, updates) => {
          set((state) => ({
            cognates: state.cognates.map((c) =>
              c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
            ),
          }));
        },

        removeCognate: (id) => {
          set((state) => ({
            cognates: state.cognates.filter((c) => c.id !== id),
            selectedCognate: state.selectedCognate?.id === id ? null : state.selectedCognate,
            sops: state.sops.filter((s) => s.cognateId !== id),
          }));
        },

        selectCognate: (cognate) => {
          set({ selectedCognate: cognate });
        },

        setCognateStatus: (id, status) => {
          set((state) => ({
            cognates: state.cognates.map((c) =>
              c.id === id ? { ...c, status, updatedAt: new Date().toISOString() } : c
            ),
          }));
        },

        // ==========================================
        // SOP Actions
        // ==========================================

        setSOPs: (sops) => {
          set({ sops, isLoading: false, error: null });
        },

        addSOP: (sop) => {
          set((state) => ({
            sops: [...state.sops, sop],
          }));
        },

        updateSOP: (id, updates) => {
          set((state) => ({
            sops: state.sops.map((s) =>
              s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s
            ),
          }));
        },

        removeSOP: (id) => {
          set((state) => ({
            sops: state.sops.filter((s) => s.id !== id),
            selectedSOP: state.selectedSOP?.id === id ? null : state.selectedSOP,
          }));
        },

        selectSOP: (sop) => {
          set({ selectedSOP: sop });
        },

        toggleSOPStatus: (id) => {
          set((state) => ({
            sops: state.sops.map((s) =>
              s.id === id
                ? {
                    ...s,
                    status: s.status === 'active' ? 'draft' : 'active',
                    updatedAt: new Date().toISOString(),
                  }
                : s
            ),
          }));
        },

        duplicateSOP: (id) => {
          const state = get();
          const originalSOP = state.sops.find((s) => s.id === id);
          if (!originalSOP) return;

          const newSOP: SOP = {
            ...originalSOP,
            id: `sop-${Date.now()}`,
            name: `${originalSOP.name} (Copy)`,
            status: 'draft',
            version: '0.1.0',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            triggerCount: 0,
            lastTriggeredAt: undefined,
          };

          set((state) => ({
            sops: [...state.sops, newSOP],
          }));
        },

        // ==========================================
        // Pack Actions
        // ==========================================

        setPacks: (packs) => {
          set({ packs });
        },

        installPack: (packId) => {
          const state = get();
          const pack = state.packs.find((p) => p.id === packId);
          if (!pack || !pack.preview) return;

          const newSOPs = pack.preview.map((sop) => ({
            ...sop,
            id: `sop-${Date.now()}-${Math.random().toString(36).substring(7)}`,
            cognateId: state.selectedCognate?.id || '',
            status: 'draft' as SOPStatus,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            triggerCount: 0,
          }));

          set((state) => ({
            sops: [...state.sops, ...newSOPs],
          }));
        },

        // ==========================================
        // Bootstrap Actions
        // ==========================================

        setBootstrapConfig: (config) => {
          set((state) => ({
            bootstrapConfig: state.bootstrapConfig
              ? { ...state.bootstrapConfig, ...config }
              : { ...defaultBootstrapConfig, ...config },
          }));
        },

        setBootstrapStep: (step) => {
          set({ bootstrapStep: step });
        },

        resetBootstrap: () => {
          set({
            bootstrapConfig: null,
            bootstrapStep: 0,
          });
        },

        // ==========================================
        // Filter Actions
        // ==========================================

        setSOPFilters: (filters) => {
          set((state) => ({
            sopFilters: { ...state.sopFilters, ...filters },
          }));
        },

        resetSOPFilters: () => {
          set({ sopFilters: defaultSOPFilters });
        },

        setViewMode: (viewMode) => {
          set({ viewMode });
        },

        // ==========================================
        // Template Actions (Cognate blueprints)
        // ==========================================

        setTemplates: (templates) => {
          set({ templates });
        },

        addTemplate: (template) => {
          set((state) => ({
            templates: [...state.templates, template],
          }));
        },

        updateTemplate: (id, updates) => {
          set((state) => ({
            templates: state.templates.map((t) =>
              t.id === id
                ? { ...t, ...updates, updatedAt: new Date().toISOString() }
                : t
            ),
          }));
        },

        removeTemplate: (id) => {
          set((state) => ({
            templates: state.templates.filter((t) => t.id !== id),
            selectedTemplateId:
              state.selectedTemplateId === id ? null : state.selectedTemplateId,
          }));
        },

        selectTemplate: (id) => {
          set({ selectedTemplateId: id });
        },

        // ==========================================
        // Instance Actions (running Cognates)
        // ==========================================

        createInstance: (instance) => {
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

        updateInstance: (id, updates) => {
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

        deleteInstance: (id) => {
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

        selectInstance: (id) => {
          set({ selectedInstanceId: id });
        },

        // ==========================================
        // Execution Actions
        // ==========================================

        startExecution: (execution) => {
          set((state) => {
            // Update instance status and stats
            const instance = state.instances[execution.instanceId];
            const newInstances = instance
              ? {
                  ...state.instances,
                  [execution.instanceId]: {
                    ...instance,
                    status: 'busy' as CognateInstanceStatus,
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

        completeExecution: (id, output, error) => {
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
                status: newStatus as CognateExecution['status'],
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
                    status: 'idle' as CognateInstanceStatus,
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

        pauseCognate: (instanceId) => {
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
                  status: 'paused' as CognateInstanceStatus,
                  updatedAt: new Date().toISOString(),
                },
              },
              executions: newExecutions,
            };
          });
        },

        resumeCognate: (instanceId) => {
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

            const newStatus: CognateInstanceStatus = pausedExecution ? 'busy' : 'idle';

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

        cancelExecution: (id) => {
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
                    status: 'idle' as CognateInstanceStatus,
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

        updateExecution: (id, updates) => {
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

        // ==========================================
        // Loading Actions
        // ==========================================

        setLoading: (isLoading) => {
          set({ isLoading });
        },

        setError: (error) => {
          set({ error, isLoading: false });
        },

        // ==========================================
        // Reset
        // ==========================================

        reset: () => {
          set(initialState);
        },

        // ==========================================
        // Computed - SOPs
        // ==========================================

        getFilteredSOPs: () => {
          const { sops, sopFilters, selectedCognate } = get();
          const cognateSOPs = selectedCognate
            ? sops.filter((s) => s.cognateId === selectedCognate.id)
            : sops;

          return cognateSOPs.filter((sop) => {
            // Search filter
            if (sopFilters.search) {
              const searchLower = sopFilters.search.toLowerCase();
              const matchesSearch =
                sop.name.toLowerCase().includes(searchLower) ||
                sop.description.toLowerCase().includes(searchLower) ||
                sop.tags.some((tag) => tag.toLowerCase().includes(searchLower));
              if (!matchesSearch) return false;
            }

            // Status filter
            if (sopFilters.statuses.length > 0) {
              if (!sopFilters.statuses.includes(sop.status)) return false;
            }

            // Tag filter
            if (sopFilters.tags.length > 0) {
              const hasMatchingTag = sopFilters.tags.some((tag) => sop.tags.includes(tag));
              if (!hasMatchingTag) return false;
            }

            return true;
          });
        },

        getSOPStats: () => {
          const { sops, selectedCognate } = get();
          const cognateSOPs = selectedCognate
            ? sops.filter((s) => s.cognateId === selectedCognate.id)
            : sops;

          return {
            total: cognateSOPs.length,
            active: cognateSOPs.filter((s) => s.status === 'active').length,
            draft: cognateSOPs.filter((s) => s.status === 'draft').length,
            rulesCount: cognateSOPs.reduce((acc, s) => acc + s.rules.length, 0),
            triggersCount: cognateSOPs.reduce((acc, s) => acc + s.triggerCount, 0),
          };
        },

        getCognateSOPs: (cognateId) => {
          const { sops } = get();
          return sops.filter((s) => s.cognateId === cognateId);
        },

        // ==========================================
        // Computed - Instances
        // ==========================================

        getRunningCognates: () => {
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

        getCognatesByMission: (missionId) => {
          const { instances } = get();
          return Object.values(instances).filter((i) => i.missionId === missionId);
        },

        getCognatesByProject: (projectId) => {
          const { instances } = get();
          return Object.values(instances).filter((i) => i.projectId === projectId);
        },

        getInstances: () => {
          const { instances } = get();
          return Object.values(instances);
        },

        getExecutionsForInstance: (instanceId) => {
          const { executions } = get();
          return Object.values(executions)
            .filter((e) => e.instanceId === instanceId)
            .sort(
              (a, b) =>
                new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
            );
        },

        getCurrentExecution: (instanceId) => {
          const { executions } = get();
          const instanceExecutions = Object.values(executions)
            .filter((e) => e.instanceId === instanceId)
            .sort(
              (a, b) =>
                new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
            );

          return instanceExecutions[0] ?? null;
        },

        getActiveTemplates: () => {
          const { templates } = get();
          return templates.filter((t) => t.status === 'active');
        },
      }),
      {
        name: 'symtex-cognate-store',
        partialize: (state) => ({
          cognates: state.cognates,
          sops: state.sops,
          templates: state.templates,
          instances: state.instances,
          sopFilters: state.sopFilters,
          viewMode: state.viewMode,
        }),
      }
    ),
    { name: 'CognateStore' }
  )
);
