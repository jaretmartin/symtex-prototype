/**
 * Ledger Store - State Management for Audit Trail
 *
 * Manages ledger entries that record all significant events
 * using the 6 W's framework (Who, What, When, Where, Why, How).
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  LedgerEntry,
  LedgerFilter,
  LedgerCategory,
  LedgerSeverity,
  ActorType,
} from '@/types';
import { mockLedgerEntries } from '@/mocks/ledger';

// ============================================================================
// EXTENDED TYPES FOR UI
// ============================================================================

export interface LedgerPaginationState {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface LedgerSortState {
  field: 'when' | 'sequence' | 'severity' | 'category';
  direction: 'asc' | 'desc';
}

// ============================================================================
// STATE INTERFACE
// ============================================================================

interface LedgerState {
  // Data
  entries: LedgerEntry[];
  selectedEntry: LedgerEntry | null;

  // Filters
  filters: LedgerFilter;
  sort: LedgerSortState;
  pagination: LedgerPaginationState;

  // UI State
  isLoading: boolean;
  error: string | null;
  isEvidencePanelOpen: boolean;

  // Actions - Data
  setEntries: (entries: LedgerEntry[]) => void;
  selectEntry: (entry: LedgerEntry | null) => void;

  // Actions - Filters
  setFilters: (filters: Partial<LedgerFilter>) => void;
  resetFilters: () => void;
  setSort: (sort: LedgerSortState) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;

  // Actions - UI
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  toggleEvidencePanel: () => void;
  openEvidencePanel: () => void;
  closeEvidencePanel: () => void;

  // Actions - Data Loading
  loadMockData: () => void;

  // Computed
  getFilteredEntries: () => LedgerEntry[];
  getPaginatedEntries: () => LedgerEntry[];
  getCategoryCount: (category: LedgerCategory) => number;
  getActorTypeCount: (actorType: ActorType) => number;
}

// ============================================================================
// DEFAULT VALUES
// ============================================================================

const defaultFilters: LedgerFilter = {
  actorType: [],
  actorId: [],
  category: [],
  severity: [],
  status: [],
  spaceId: [],
  projectId: [],
  tags: [],
  flaggedOnly: false,
};

// ============================================================================
// STORE
// ============================================================================

export const useLedgerStore = create<LedgerState>()(
  devtools(
    (set, get) => ({
      // Initial state
      entries: [],
      selectedEntry: null,
      filters: defaultFilters,
      sort: { field: 'when', direction: 'desc' },
      pagination: { page: 1, pageSize: 10, totalCount: 0, totalPages: 0 },
      isLoading: false,
      error: null,
      isEvidencePanelOpen: false,

      // Data actions
      setEntries: (entries) => {
        const { pagination } = get();
        set({
          entries,
          pagination: {
            ...pagination,
            totalCount: entries.length,
            totalPages: Math.ceil(entries.length / pagination.pageSize),
          },
        });
      },

      selectEntry: (entry) => {
        set({ selectedEntry: entry, isEvidencePanelOpen: entry !== null });
      },

      // Filter actions
      setFilters: (filters) => {
        set((state) => ({
          filters: { ...state.filters, ...filters },
          pagination: { ...state.pagination, page: 1 },
        }));
      },

      resetFilters: () => {
        set({ filters: defaultFilters, pagination: { ...get().pagination, page: 1 } });
      },

      setSort: (sort) => {
        set({ sort });
      },

      setPage: (page) => {
        set((state) => ({ pagination: { ...state.pagination, page } }));
      },

      setPageSize: (pageSize) => {
        const { pagination } = get();
        set({
          pagination: {
            ...pagination,
            pageSize,
            page: 1,
            totalPages: Math.ceil(pagination.totalCount / pageSize),
          },
        });
      },

      // UI actions
      setLoading: (isLoading) => {
        set({ isLoading });
      },

      setError: (error) => {
        set({ error, isLoading: false });
      },

      toggleEvidencePanel: () => {
        set((state) => ({ isEvidencePanelOpen: !state.isEvidencePanelOpen }));
      },

      openEvidencePanel: () => {
        set({ isEvidencePanelOpen: true });
      },

      closeEvidencePanel: () => {
        set({ isEvidencePanelOpen: false });
      },

      // Load mock data from centralized mocks (25 events)
      loadMockData: () => {
        set({
          entries: mockLedgerEntries,
          pagination: {
            page: 1,
            pageSize: 10,
            totalCount: mockLedgerEntries.length,
            totalPages: Math.ceil(mockLedgerEntries.length / 10),
          },
          isLoading: false,
          error: null,
        });
      },

      // Computed
      getFilteredEntries: () => {
        const { entries, filters, sort } = get();

        let filtered = [...entries];

        // Apply filters
        if (filters.actorType && filters.actorType.length > 0) {
          filtered = filtered.filter((e) => filters.actorType!.includes(e.who.type));
        }
        if (filters.category && filters.category.length > 0) {
          filtered = filtered.filter((e) => filters.category!.includes(e.what.category));
        }
        if (filters.severity && filters.severity.length > 0) {
          filtered = filtered.filter((e) => filters.severity!.includes(e.what.severity));
        }
        if (filters.spaceId && filters.spaceId.length > 0) {
          filtered = filtered.filter((e) => e.where.spaceId && filters.spaceId!.includes(e.where.spaceId));
        }
        if (filters.flaggedOnly) {
          filtered = filtered.filter((e) => e.isFlagged);
        }
        if (filters.search) {
          const search = filters.search.toLowerCase();
          filtered = filtered.filter(
            (e) =>
              e.what.description.toLowerCase().includes(search) ||
              e.who.name.toLowerCase().includes(search) ||
              e.tags.some((t) => t.toLowerCase().includes(search))
          );
        }
        if (filters.dateRange) {
          filtered = filtered.filter(
            (e) => e.when >= filters.dateRange!.from && e.when <= filters.dateRange!.to
          );
        }

        // Apply sorting
        filtered.sort((a, b) => {
          let comparison = 0;
          switch (sort.field) {
            case 'when':
              comparison = a.when.getTime() - b.when.getTime();
              break;
            case 'sequence':
              comparison = a.sequence - b.sequence;
              break;
            case 'severity': {
              const severityOrder: Record<LedgerSeverity, number> = {
                debug: 0,
                info: 1,
                notice: 2,
                warning: 3,
                error: 4,
                critical: 5,
              };
              comparison = severityOrder[a.what.severity] - severityOrder[b.what.severity];
              break;
            }
            case 'category':
              comparison = a.what.category.localeCompare(b.what.category);
              break;
          }
          return sort.direction === 'asc' ? comparison : -comparison;
        });

        return filtered;
      },

      getPaginatedEntries: () => {
        const filtered = get().getFilteredEntries();
        const { page, pageSize } = get().pagination;
        const start = (page - 1) * pageSize;
        return filtered.slice(start, start + pageSize);
      },

      getCategoryCount: (category) => {
        return get().entries.filter((e) => e.what.category === category).length;
      },

      getActorTypeCount: (actorType) => {
        return get().entries.filter((e) => e.who.type === actorType).length;
      },
    }),
    { name: 'LedgerStore' }
  )
);
