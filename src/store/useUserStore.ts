/**
 * User Store - User data and preferences
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { User, UserPreferences, OnboardingProgress } from '@/types';

interface UserState {
  // User data
  user: User | null;
  isAuthenticated: boolean;

  // Preferences
  preferences: UserPreferences;

  // Onboarding
  onboarding: OnboardingProgress | null;

  // Actions - User
  setUser: (user: User | null) => void;
  clearUser: () => void;

  // Actions - Preferences
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  resetPreferences: () => void;

  // Actions - Onboarding
  startOnboarding: () => void;
  advanceOnboarding: (stepId: string) => void;
  skipOnboarding: () => void;
  completeOnboarding: () => void;
  dismissTutorial: (tutorialId: string) => void;
}

const defaultPreferences: UserPreferences = {
  theme: 'dark',
  sidebarCollapsed: false,
  defaultView: 'grid',
  notifications: {
    email: true,
    push: true,
    workflowFailures: true,
    weeklyDigest: true,
  },
  onboardingCompleted: false,
  tutorialsDismissed: [],
};

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        isAuthenticated: false,
        preferences: defaultPreferences,
        onboarding: null,

        // User actions
        setUser: (user) => {
          set({
            user,
            isAuthenticated: !!user,
          });
        },

        clearUser: () => {
          set({
            user: null,
            isAuthenticated: false,
          });
        },

        // Preferences actions
        updatePreferences: (updates) => {
          set((state) => ({
            preferences: {
              ...state.preferences,
              ...updates,
            },
          }));
        },

        resetPreferences: () => {
          set({ preferences: defaultPreferences });
        },

        // Onboarding actions
        startOnboarding: () => {
          set({
            onboarding: {
              currentStep: 0,
              completedSteps: [],
              skipped: false,
              startedAt: new Date().toISOString(),
            },
          });
        },

        advanceOnboarding: (stepId) => {
          const { onboarding } = get();
          if (!onboarding) return;

          set({
            onboarding: {
              ...onboarding,
              currentStep: onboarding.currentStep + 1,
              completedSteps: [...onboarding.completedSteps, stepId],
            },
          });
        },

        skipOnboarding: () => {
          const { onboarding } = get();
          if (!onboarding) return;

          set({
            onboarding: {
              ...onboarding,
              skipped: true,
              completedAt: new Date().toISOString(),
            },
            preferences: {
              ...get().preferences,
              onboardingCompleted: true,
            },
          });
        },

        completeOnboarding: () => {
          const { onboarding } = get();
          if (!onboarding) return;

          set({
            onboarding: {
              ...onboarding,
              completedAt: new Date().toISOString(),
            },
            preferences: {
              ...get().preferences,
              onboardingCompleted: true,
            },
          });
        },

        dismissTutorial: (tutorialId) => {
          set((state) => ({
            preferences: {
              ...state.preferences,
              tutorialsDismissed: [
                ...state.preferences.tutorialsDismissed,
                tutorialId,
              ],
            },
          }));
        },
      }),
      {
        name: 'symtex-user-store',
        partialize: (state) => ({
          preferences: state.preferences,
          onboarding: state.onboarding,
        }),
      }
    ),
    { name: 'UserStore' }
  )
);
