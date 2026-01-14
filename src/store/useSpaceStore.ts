/**
 * Space Store - Zustand state management for Space hierarchy
 *
 * Handles CRUD operations for personal spaces, domains, projects, and missions
 * with settings inheritance across the hierarchy.
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type {
  PersonalSpace,
  DomainSpace,
  Project,
  SpaceMission,
  SpaceSettings,
  SpaceEntityType,
} from '@/types';

interface SpaceState {
  // Data
  personal: PersonalSpace | null;
  domains: Record<string, DomainSpace>;
  projects: Record<string, Project>;
  missions: Record<string, SpaceMission>;

  // Loading states
  isLoading: boolean;
  error: string | null;

  // Actions - Personal Space
  setPersonalSpace: (space: PersonalSpace) => void;
  updatePersonalSpace: (updates: Partial<PersonalSpace>) => void;

  // Actions - Domain CRUD
  /** Creates a new domain space */
  createDomain: (domain: DomainSpace) => void;
  /** Updates an existing domain space */
  updateDomain: (id: string, updates: Partial<DomainSpace>) => void;
  /** Deletes a domain space and all its children */
  deleteDomain: (id: string) => void;

  // Actions - Project CRUD
  /** Creates a new project */
  createProject: (project: Project) => void;
  /** Updates an existing project */
  updateProject: (id: string, updates: Partial<Project>) => void;
  /** Deletes a project and all its missions */
  deleteProject: (id: string) => void;

  // Actions - Mission CRUD
  /** Creates a new mission */
  createMission: (mission: SpaceMission) => void;
  /** Updates an existing mission */
  updateMission: (id: string, updates: Partial<SpaceMission>) => void;
  /** Deletes a mission */
  deleteMission: (id: string) => void;

  // Actions - Loading
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;

  // Computed - Relationship queries
  /** Gets all projects for a specific domain */
  getProjectsForDomain: (domainId: string) => Project[];
  /** Gets all missions for a specific project */
  getMissionsForProject: (projectId: string) => SpaceMission[];
  /** Gets all domains */
  getDomains: () => DomainSpace[];
  /** Gets all projects */
  getProjects: () => Project[];
  /** Gets all missions */
  getMissions: () => SpaceMission[];

  // Computed - Settings inheritance
  /**
   * Resolves settings for an entity by merging inherited settings from the hierarchy.
   * Settings are inherited: Personal > Domain > Project > Mission
   */
  resolveSettings: (entityType: SpaceEntityType, entityId: string) => SpaceSettings | null;
}

const initialState = {
  personal: null,
  domains: {},
  projects: {},
  missions: {},
  isLoading: false,
  error: null,
};

export const useSpaceStore = create<SpaceState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        ...initialState,

        // Personal Space actions
        setPersonalSpace: (space): void => {
          set({ personal: space });
        },

        updatePersonalSpace: (updates): void => {
          set((state) => ({
            personal: state.personal
              ? { ...state.personal, ...updates }
              : null,
          }));
        },

        // Domain CRUD
        createDomain: (domain): void => {
          set((state) => ({
            domains: {
              ...state.domains,
              [domain.id]: domain,
            },
          }));
        },

        updateDomain: (id, updates): void => {
          set((state) => ({
            domains: {
              ...state.domains,
              [id]: state.domains[id]
                ? { ...state.domains[id], ...updates }
                : state.domains[id],
            },
          }));
        },

        deleteDomain: (id): void => {
          const state = get();
          // Get all projects in this domain
          const projectsToDelete = Object.values(state.projects)
            .filter((p) => p.domainId === id)
            .map((p) => p.id);

          // Get all missions in those projects
          const missionsToDelete = Object.values(state.missions)
            .filter((m) => projectsToDelete.includes(m.projectId))
            .map((m) => m.id);

          // Create new objects without the deleted items
          const newDomains = { ...state.domains };
          delete newDomains[id];

          const newProjects = { ...state.projects };
          projectsToDelete.forEach((pid) => delete newProjects[pid]);

          const newMissions = { ...state.missions };
          missionsToDelete.forEach((mid) => delete newMissions[mid]);

          set({
            domains: newDomains,
            projects: newProjects,
            missions: newMissions,
          });
        },

        // Project CRUD
        createProject: (project): void => {
          set((state) => ({
            projects: {
              ...state.projects,
              [project.id]: project,
            },
          }));
        },

        updateProject: (id, updates): void => {
          set((state) => ({
            projects: {
              ...state.projects,
              [id]: state.projects[id]
                ? { ...state.projects[id], ...updates }
                : state.projects[id],
            },
          }));
        },

        deleteProject: (id): void => {
          const state = get();
          // Get all missions in this project
          const missionsToDelete = Object.values(state.missions)
            .filter((m) => m.projectId === id)
            .map((m) => m.id);

          // Create new objects without the deleted items
          const newProjects = { ...state.projects };
          delete newProjects[id];

          const newMissions = { ...state.missions };
          missionsToDelete.forEach((mid) => delete newMissions[mid]);

          set({
            projects: newProjects,
            missions: newMissions,
          });
        },

        // Mission CRUD
        createMission: (mission): void => {
          set((state) => ({
            missions: {
              ...state.missions,
              [mission.id]: mission,
            },
          }));
        },

        updateMission: (id, updates): void => {
          set((state) => ({
            missions: {
              ...state.missions,
              [id]: state.missions[id]
                ? { ...state.missions[id], ...updates }
                : state.missions[id],
            },
          }));
        },

        deleteMission: (id): void => {
          set((state) => {
            const newMissions = { ...state.missions };
            delete newMissions[id];
            return { missions: newMissions };
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

        // Computed - Relationship queries
        getProjectsForDomain: (domainId): Project[] => {
          const { projects } = get();
          return Object.values(projects).filter((p) => p.domainId === domainId);
        },

        getMissionsForProject: (projectId): SpaceMission[] => {
          const { missions } = get();
          return Object.values(missions).filter((m) => m.projectId === projectId);
        },

        getDomains: (): DomainSpace[] => {
          const { domains } = get();
          return Object.values(domains);
        },

        getProjects: (): Project[] => {
          const { projects } = get();
          return Object.values(projects);
        },

        getMissions: (): SpaceMission[] => {
          const { missions } = get();
          return Object.values(missions);
        },

        // Settings inheritance resolver
        resolveSettings: (entityType, entityId): SpaceSettings | null => {
          const { personal, domains, projects } = get();

          if (!personal) return null;

          // Start with personal space default settings
          let resolvedSettings: SpaceSettings = { ...personal.defaultSettings };

          if (entityType === 'personal') {
            return resolvedSettings;
          }

          // For domain level, merge domain overrides
          if (entityType === 'domain') {
            const domain = domains[entityId];
            if (domain?.settingsOverrides) {
              resolvedSettings = mergeSettings(resolvedSettings, domain.settingsOverrides);
            }
            return resolvedSettings;
          }

          // For project level, get domain first then merge
          if (entityType === 'project') {
            const project = projects[entityId];
            if (!project) return resolvedSettings;

            const domain = domains[project.domainId];
            if (domain?.settingsOverrides) {
              resolvedSettings = mergeSettings(resolvedSettings, domain.settingsOverrides);
            }
            // Projects don't have their own settings overrides in current schema
            return resolvedSettings;
          }

          // For mission level, resolve up the chain
          if (entityType === 'mission') {
            const { missions } = get();
            const mission = missions[entityId];
            if (!mission) return resolvedSettings;

            const project = projects[mission.projectId];
            if (!project) return resolvedSettings;

            const domain = domains[project.domainId];
            if (domain?.settingsOverrides) {
              resolvedSettings = mergeSettings(resolvedSettings, domain.settingsOverrides);
            }
            // Missions don't have their own settings overrides in current schema
            return resolvedSettings;
          }

          return resolvedSettings;
        },
      }),
      {
        name: 'symtex-spaces',
        partialize: (state) => ({
          personal: state.personal,
          domains: state.domains,
          projects: state.projects,
          missions: state.missions,
        }),
      }
    ),
    { name: 'SpaceStore' }
  )
);

/**
 * Helper function to merge settings with overrides
 */
function mergeSettings(
  base: SpaceSettings,
  overrides: Partial<SpaceSettings>
): SpaceSettings {
  return {
    communication: {
      ...base.communication,
      ...overrides.communication,
    },
    autonomy: {
      ...base.autonomy,
      ...overrides.autonomy,
    },
    rules: overrides.rules ?? base.rules,
    inheritFromParent: overrides.inheritFromParent ?? base.inheritFromParent,
  };
}
