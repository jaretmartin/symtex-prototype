/**
 * Mission Store - State management for missions
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Mission, MissionFilters, ViewMode } from '@/types';

interface MissionState {
  // Data
  missions: Mission[];
  selectedMission: Mission | null;

  // Filters
  filters: MissionFilters;
  viewMode: ViewMode;
  showTimeline: boolean;

  // Loading states
  isLoading: boolean;
  error: string | null;

  // Actions - Data
  setMissions: (missions: Mission[]) => void;
  addMission: (mission: Mission) => void;
  updateMission: (id: string, updates: Partial<Mission>) => void;
  removeMission: (id: string) => void;
  selectMission: (mission: Mission | null) => void;

  // Actions - Filters
  setFilters: (filters: Partial<MissionFilters>) => void;
  resetFilters: () => void;
  setViewMode: (mode: ViewMode) => void;
  toggleTimeline: () => void;

  // Actions - Loading
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Computed
  getFilteredMissions: () => Mission[];
}

const defaultFilters: MissionFilters = {
  search: '',
  priorities: [],
  statuses: [],
};

export const useMissionStore = create<MissionState>()(
  devtools(
    (set, get) => ({
      // Initial state
      missions: [],
      selectedMission: null,
      filters: defaultFilters,
      viewMode: 'grid',
      showTimeline: true,
      isLoading: false,
      error: null,

      // Data actions
      setMissions: (missions) => {
        set({ missions, isLoading: false, error: null });
      },

      addMission: (mission) => {
        set((state) => ({
          missions: [...state.missions, mission],
        }));
      },

      updateMission: (id, updates) => {
        set((state) => ({
          missions: state.missions.map((m) =>
            m.id === id ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m
          ),
        }));
      },

      removeMission: (id) => {
        set((state) => ({
          missions: state.missions.filter((m) => m.id !== id),
          selectedMission:
            state.selectedMission?.id === id ? null : state.selectedMission,
        }));
      },

      selectMission: (mission) => {
        set({ selectedMission: mission });
      },

      // Filter actions
      setFilters: (filters) => {
        set((state) => ({
          filters: { ...state.filters, ...filters },
        }));
      },

      resetFilters: () => {
        set({ filters: defaultFilters });
      },

      setViewMode: (viewMode) => {
        set({ viewMode });
      },

      toggleTimeline: () => {
        set((state) => ({ showTimeline: !state.showTimeline }));
      },

      // Loading actions
      setLoading: (isLoading) => {
        set({ isLoading });
      },

      setError: (error) => {
        set({ error, isLoading: false });
      },

      // Computed
      getFilteredMissions: () => {
        const { missions, filters } = get();

        return missions.filter((mission) => {
          // Search filter
          if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            const matchesSearch =
              mission.title.toLowerCase().includes(searchLower) ||
              mission.description.toLowerCase().includes(searchLower) ||
              mission.tags.some((tag) => tag.toLowerCase().includes(searchLower));
            if (!matchesSearch) return false;
          }

          // Priority filter
          if (filters.priorities.length > 0) {
            if (!filters.priorities.includes(mission.priority)) return false;
          }

          // Status filter
          if (filters.statuses.length > 0) {
            if (!filters.statuses.includes(mission.status)) return false;
          }

          return true;
        });
      },
    }),
    { name: 'MissionStore' }
  )
);
