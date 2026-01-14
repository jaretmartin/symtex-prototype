/**
 * Context Store - Navigation context state management
 *
 * Tracks the user's current position within the space hierarchy,
 * manages breadcrumb navigation, and handles navigation history.
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { SpaceType, BreadcrumbItem } from '@/types';

interface ContextState {
  // Navigation state
  currentSpaceType: SpaceType | null;
  currentId: string | null;
  breadcrumb: BreadcrumbItem[];

  // History for back/forward navigation
  historyStack: BreadcrumbItem[];
  historyIndex: number;

  // Actions - Navigation
  /** Navigates to a specific space entity */
  navigateTo: (type: SpaceType, id: string, name: string, icon?: string) => void;
  /** Goes back in navigation history */
  goBack: () => void;
  /** Goes forward in navigation history */
  goForward: () => void;
  /** Sets the entire breadcrumb trail */
  setBreadcrumb: (items: BreadcrumbItem[]) => void;
  /** Clears the navigation context */
  clearContext: () => void;

  // Computed
  /** Gets the current entity as a breadcrumb item */
  getCurrentEntity: () => BreadcrumbItem | null;
  /** Gets the full breadcrumb path */
  getBreadcrumbPath: () => BreadcrumbItem[];
  /** Checks if back navigation is available */
  canGoBack: () => boolean;
  /** Checks if forward navigation is available */
  canGoForward: () => boolean;
}

const initialState = {
  currentSpaceType: null as SpaceType | null,
  currentId: null as string | null,
  breadcrumb: [] as BreadcrumbItem[],
  historyStack: [] as BreadcrumbItem[],
  historyIndex: -1,
};

export const useContextStore = create<ContextState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        ...initialState,

        // Navigation actions
        navigateTo: (type, id, name, icon): void => {
          const newItem: BreadcrumbItem = { type, id, name, icon };
          const state = get();

          // Update breadcrumb based on where we're navigating
          let newBreadcrumb: BreadcrumbItem[];

          if (type === 'personal') {
            // Starting fresh from personal space
            newBreadcrumb = [newItem];
          } else {
            // Check if this item already exists in the breadcrumb
            const existingIndex = state.breadcrumb.findIndex(
              (item) => item.type === type && item.id === id
            );

            if (existingIndex >= 0) {
              // Navigating back to an existing item - truncate breadcrumb
              newBreadcrumb = state.breadcrumb.slice(0, existingIndex + 1);
            } else {
              // Adding a new item to the trail
              newBreadcrumb = [...state.breadcrumb, newItem];
            }
          }

          // Update history stack
          const newHistoryStack = [
            ...state.historyStack.slice(0, state.historyIndex + 1),
            newItem,
          ];

          set({
            currentSpaceType: type,
            currentId: id,
            breadcrumb: newBreadcrumb,
            historyStack: newHistoryStack,
            historyIndex: newHistoryStack.length - 1,
          });
        },

        goBack: (): void => {
          const { historyStack, historyIndex } = get();

          if (historyIndex <= 0) return;

          const newIndex = historyIndex - 1;
          const previousItem = historyStack[newIndex];

          // Update breadcrumb to match the previous location
          const breadcrumbIndex = get().breadcrumb.findIndex(
            (item) => item.type === previousItem.type && item.id === previousItem.id
          );

          const newBreadcrumb = breadcrumbIndex >= 0
            ? get().breadcrumb.slice(0, breadcrumbIndex + 1)
            : [previousItem];

          set({
            currentSpaceType: previousItem.type,
            currentId: previousItem.id,
            breadcrumb: newBreadcrumb,
            historyIndex: newIndex,
          });
        },

        goForward: (): void => {
          const { historyStack, historyIndex } = get();

          if (historyIndex >= historyStack.length - 1) return;

          const newIndex = historyIndex + 1;
          const nextItem = historyStack[newIndex];

          // Reconstruct breadcrumb up to this point
          const existingBreadcrumb = get().breadcrumb;
          const newBreadcrumb = existingBreadcrumb.some(
            (item) => item.type === nextItem.type && item.id === nextItem.id
          )
            ? existingBreadcrumb
            : [...existingBreadcrumb, nextItem];

          set({
            currentSpaceType: nextItem.type,
            currentId: nextItem.id,
            breadcrumb: newBreadcrumb,
            historyIndex: newIndex,
          });
        },

        setBreadcrumb: (items): void => {
          const lastItem = items[items.length - 1];
          set({
            breadcrumb: items,
            currentSpaceType: lastItem?.type ?? null,
            currentId: lastItem?.id ?? null,
          });
        },

        clearContext: (): void => {
          set(initialState);
        },

        // Computed
        getCurrentEntity: (): BreadcrumbItem | null => {
          const { currentSpaceType, currentId, breadcrumb } = get();

          if (!currentSpaceType || !currentId) return null;

          return (
            breadcrumb.find(
              (item) => item.type === currentSpaceType && item.id === currentId
            ) ?? null
          );
        },

        getBreadcrumbPath: (): BreadcrumbItem[] => {
          return get().breadcrumb;
        },

        canGoBack: (): boolean => {
          return get().historyIndex > 0;
        },

        canGoForward: (): boolean => {
          const { historyStack, historyIndex } = get();
          return historyIndex < historyStack.length - 1;
        },
      }),
      {
        name: 'symtex-context',
        partialize: (state) => ({
          currentSpaceType: state.currentSpaceType,
          currentId: state.currentId,
          breadcrumb: state.breadcrumb,
          historyStack: state.historyStack,
          historyIndex: state.historyIndex,
        }),
      }
    ),
    { name: 'ContextStore' }
  )
);
