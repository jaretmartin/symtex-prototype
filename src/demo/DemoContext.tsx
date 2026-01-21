/**
 * Demo Context
 *
 * App-wide demo state management using React Context.
 * Provides centralized control over demo mode, personas, feature flags,
 * scenario toggles, and active Cognate states.
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';

// ============================================================================
// Types
// ============================================================================

export type Persona = 'exec' | 'operator' | 'builder';

export type CognateState =
  | 'idle'
  | 'listening'
  | 'planning'
  | 'waiting_approval'
  | 'simulating'
  | 'running'
  | 'blocked'
  | 'needs_review'
  | 'completed'
  | 'error';

export interface ActiveCognate {
  id: string;
  state: CognateState;
  progress?: number;
}

export interface FeatureFlags {
  c2s2Enabled: boolean;
  advancedPromptOps: boolean;
  nexisEnabled: boolean;
}

export interface ScenarioToggles {
  policyBlockEnabled: boolean;
  runSucceeds: boolean;
  budgetWarning: boolean;
  approvalPending: boolean;
}

export interface DemoState {
  /** Whether demo mode is active */
  demoMode: boolean;
  /** Current user persona for tailored experience */
  persona: Persona;
  /** Currently active scenario ID */
  activeScenario: string | null;
  /** Feature flags for Labs modules */
  featureFlags: FeatureFlags;
  /** Scenario state toggles for controlling demo flows */
  scenarioToggles: ScenarioToggles;
  /** Active Cognate states for dock display */
  activeCognates: ActiveCognate[];
}

export interface DemoContextValue extends DemoState {
  // Actions
  setDemoMode: (enabled: boolean) => void;
  setPersona: (persona: Persona) => void;
  setActiveScenario: (scenarioId: string | null) => void;
  toggleFeatureFlag: (flag: keyof FeatureFlags) => void;
  setScenarioToggle: (toggle: keyof ScenarioToggles, value: boolean) => void;
  setCognateState: (
    cognateId: string,
    state: CognateState,
    progress?: number
  ) => void;
  resetDemoState: () => void;

  // Convenience getters
  isFeatureEnabled: (flag: keyof FeatureFlags) => boolean;
}

// ============================================================================
// Initial State
// ============================================================================

const initialFeatureFlags: FeatureFlags = {
  c2s2Enabled: true,
  advancedPromptOps: true,
  nexisEnabled: true,
};

const initialScenarioToggles: ScenarioToggles = {
  policyBlockEnabled: false,
  runSucceeds: false,
  budgetWarning: false,
  approvalPending: false,
};

const initialDemoState: DemoState = {
  demoMode: true,
  persona: 'operator',
  activeScenario: null,
  featureFlags: initialFeatureFlags,
  scenarioToggles: initialScenarioToggles,
  activeCognates: [],
};

// ============================================================================
// Context
// ============================================================================

const DemoContext = createContext<DemoContextValue | null>(null);

// ============================================================================
// Provider
// ============================================================================

interface DemoProviderProps {
  children: ReactNode;
  /** Optional initial state override for testing */
  initialState?: Partial<DemoState>;
}

export function DemoProvider({
  children,
  initialState,
}: DemoProviderProps): JSX.Element {
  const [state, setState] = useState<DemoState>(() => ({
    ...initialDemoState,
    ...initialState,
  }));

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------

  const setDemoMode = useCallback((enabled: boolean): void => {
    setState((prev) => ({ ...prev, demoMode: enabled }));
  }, []);

  const setPersona = useCallback((persona: Persona): void => {
    setState((prev) => ({ ...prev, persona }));
  }, []);

  const setActiveScenario = useCallback((scenarioId: string | null): void => {
    setState((prev) => ({ ...prev, activeScenario: scenarioId }));
  }, []);

  const toggleFeatureFlag = useCallback((flag: keyof FeatureFlags): void => {
    setState((prev) => ({
      ...prev,
      featureFlags: {
        ...prev.featureFlags,
        [flag]: !prev.featureFlags[flag],
      },
    }));
  }, []);

  const setScenarioToggle = useCallback(
    (toggle: keyof ScenarioToggles, value: boolean): void => {
      setState((prev) => ({
        ...prev,
        scenarioToggles: {
          ...prev.scenarioToggles,
          [toggle]: value,
        },
      }));
    },
    []
  );

  const setCognateState = useCallback(
    (cognateId: string, cognateState: CognateState, progress?: number): void => {
      setState((prev) => {
        const existingIndex = prev.activeCognates.findIndex(
          (c) => c.id === cognateId
        );

        if (existingIndex >= 0) {
          // Update existing Cognate
          const updatedCognates = [...prev.activeCognates];
          updatedCognates[existingIndex] = {
            id: cognateId,
            state: cognateState,
            progress,
          };
          return { ...prev, activeCognates: updatedCognates };
        } else {
          // Add new Cognate
          return {
            ...prev,
            activeCognates: [
              ...prev.activeCognates,
              { id: cognateId, state: cognateState, progress },
            ],
          };
        }
      });
    },
    []
  );

  const resetDemoState = useCallback((): void => {
    setState({
      ...initialDemoState,
      ...initialState,
    });
  }, [initialState]);

  // ---------------------------------------------------------------------------
  // Convenience Getters
  // ---------------------------------------------------------------------------

  const isFeatureEnabled = useCallback(
    (flag: keyof FeatureFlags): boolean => {
      return state.featureFlags[flag];
    },
    [state.featureFlags]
  );

  // ---------------------------------------------------------------------------
  // Context Value
  // ---------------------------------------------------------------------------

  const contextValue = useMemo<DemoContextValue>(
    () => ({
      ...state,
      setDemoMode,
      setPersona,
      setActiveScenario,
      toggleFeatureFlag,
      setScenarioToggle,
      setCognateState,
      resetDemoState,
      isFeatureEnabled,
    }),
    [
      state,
      setDemoMode,
      setPersona,
      setActiveScenario,
      toggleFeatureFlag,
      setScenarioToggle,
      setCognateState,
      resetDemoState,
      isFeatureEnabled,
    ]
  );

  return (
    <DemoContext.Provider value={contextValue}>{children}</DemoContext.Provider>
  );
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook to access the demo context.
 * Must be used within a DemoProvider.
 *
 * @throws Error if used outside of DemoProvider
 */
export function useDemoContext(): DemoContextValue {
  const context = useContext(DemoContext);

  if (context === null) {
    throw new Error(
      'useDemoContext must be used within a DemoProvider. ' +
        'Wrap your component tree with <DemoProvider> to use demo features.'
    );
  }

  return context;
}

// ============================================================================
// Exports
// ============================================================================

export { DemoContext };
