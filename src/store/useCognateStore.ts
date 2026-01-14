/**
 * Cognate Store - State management for Cognates and SOPs
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  Cognate,
  CognateStatus,
  SOP,
  SOPStatus,
  SOPPack,
  BootstrapConfig,
} from '@/types';

interface SOPFilters {
  search: string;
  statuses: SOPStatus[];
  tags: string[];
}

interface CognateState {
  // Data
  cognates: Cognate[];
  selectedCognate: Cognate | null;
  sops: SOP[];
  selectedSOP: SOP | null;
  packs: SOPPack[];

  // Bootstrap state
  bootstrapConfig: BootstrapConfig | null;
  bootstrapStep: number;

  // Filters
  sopFilters: SOPFilters;
  viewMode: 'grid' | 'list';

  // Loading states
  isLoading: boolean;
  error: string | null;

  // Cognate Actions
  setCognates: (cognates: Cognate[]) => void;
  addCognate: (cognate: Cognate) => void;
  updateCognate: (id: string, updates: Partial<Cognate>) => void;
  removeCognate: (id: string) => void;
  selectCognate: (cognate: Cognate | null) => void;
  setCognateStatus: (id: string, status: CognateStatus) => void;

  // SOP Actions
  setSOPs: (sops: SOP[]) => void;
  addSOP: (sop: SOP) => void;
  updateSOP: (id: string, updates: Partial<SOP>) => void;
  removeSOP: (id: string) => void;
  selectSOP: (sop: SOP | null) => void;
  toggleSOPStatus: (id: string) => void;
  duplicateSOP: (id: string) => void;

  // Pack Actions
  setPacks: (packs: SOPPack[]) => void;
  installPack: (packId: string) => void;

  // Bootstrap Actions
  setBootstrapConfig: (config: Partial<BootstrapConfig>) => void;
  setBootstrapStep: (step: number) => void;
  resetBootstrap: () => void;

  // Filter Actions
  setSOPFilters: (filters: Partial<SOPFilters>) => void;
  resetSOPFilters: () => void;
  setViewMode: (mode: 'grid' | 'list') => void;

  // Loading Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Computed
  getFilteredSOPs: () => SOP[];
  getSOPStats: () => {
    total: number;
    active: number;
    draft: number;
    rulesCount: number;
    triggersCount: number;
  };
  getCognateSOPs: (cognateId: string) => SOP[];
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

// Mock data for initial state
const mockCognates: Cognate[] = [
  {
    id: 'cog-1',
    name: 'Customer Support Agent',
    description: 'Handles customer inquiries and support tickets',
    status: 'active',
    industry: 'Technology',
    role: 'Customer Support',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    sopCount: 12,
    activeSOPCount: 8,
    tags: ['support', 'customer-facing'],
  },
  {
    id: 'cog-2',
    name: 'Sales Assistant',
    description: 'Assists with sales outreach and lead qualification',
    status: 'draft',
    industry: 'Technology',
    role: 'Sales',
    createdAt: '2024-01-18T09:00:00Z',
    updatedAt: '2024-01-19T11:00:00Z',
    sopCount: 5,
    activeSOPCount: 0,
    tags: ['sales', 'outreach'],
  },
];

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
    description: 'Handles escalation requests to human agents',
    status: 'active',
    priority: 'critical',
    version: '2.0.1',
    rules: [
      {
        id: 'rule-2',
        name: 'Detect Escalation Request',
        trigger: { type: 'message', config: { pattern: 'escalate|human|agent' } },
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

export const useCognateStore = create<CognateState>()(
  devtools(
    (set, get) => ({
      // Initial state
      cognates: mockCognates,
      selectedCognate: null,
      sops: mockSOPs,
      selectedSOP: null,
      packs: [],
      bootstrapConfig: null,
      bootstrapStep: 0,
      sopFilters: defaultSOPFilters,
      viewMode: 'grid',
      isLoading: false,
      error: null,

      // Cognate actions
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

      // SOP actions
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

      // Pack actions
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

      // Bootstrap actions
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

      // Filter actions
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

      // Loading actions
      setLoading: (isLoading) => {
        set({ isLoading });
      },

      setError: (error) => {
        set({ error, isLoading: false });
      },

      // Computed
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
    }),
    { name: 'CognateStore' }
  )
);
