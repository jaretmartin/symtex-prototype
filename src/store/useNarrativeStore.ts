/**
 * Narrative Store - Story drafts state management
 *
 * Manages narrative stories with their chapters for the story-driven
 * automation workflow feature.
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { NarrativeStory, NarrativeChapter } from '@/types';

interface NarrativeState {
  // Data
  stories: Record<string, NarrativeStory>;
  currentStoryId: string | null;
  isEditing: boolean;

  // Loading states
  isLoading: boolean;
  error: string | null;

  // Actions - Story CRUD
  /** Creates a new story */
  createStory: (story: NarrativeStory) => void;
  /** Updates an existing story */
  updateStory: (id: string, updates: Partial<NarrativeStory>) => void;
  /** Deletes a story */
  deleteStory: (id: string) => void;
  /** Sets the current story being edited/viewed */
  setCurrentStory: (id: string | null) => void;

  // Actions - Chapter management
  /** Adds a new chapter to a story */
  addChapter: (storyId: string, chapter: NarrativeChapter) => void;
  /** Updates a chapter within a story */
  updateChapter: (storyId: string, chapterId: string, updates: Partial<NarrativeChapter>) => void;
  /** Removes a chapter from a story */
  removeChapter: (storyId: string, chapterId: string) => void;
  /** Reorders chapters within a story */
  reorderChapters: (storyId: string, chapterIds: string[]) => void;

  // Actions - Editing state
  /** Sets the editing mode */
  setEditing: (isEditing: boolean) => void;

  // Actions - Loading
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;

  // Computed
  /** Gets the current story being edited/viewed */
  getCurrentStory: () => NarrativeStory | null;
  /** Gets all chapters for a specific story */
  getStoryChapters: (storyId: string) => NarrativeChapter[];
  /** Gets all stories as an array */
  getStories: () => NarrativeStory[];
  /** Gets stories by status */
  getStoriesByStatus: (status: NarrativeStory['status']) => NarrativeStory[];
}

const initialState = {
  stories: {} as Record<string, NarrativeStory>,
  currentStoryId: null as string | null,
  isEditing: false,
  isLoading: false,
  error: null as string | null,
};

export const useNarrativeStore = create<NarrativeState>()(
  devtools(
    (set, get) => ({
      // Initial state
      ...initialState,

      // Story CRUD actions
      createStory: (story): void => {
        set((state) => ({
          stories: {
            ...state.stories,
            [story.id]: story,
          },
        }));
      },

      updateStory: (id, updates): void => {
        set((state) => {
          const existingStory = state.stories[id];
          if (!existingStory) return state;

          return {
            stories: {
              ...state.stories,
              [id]: { ...existingStory, ...updates },
            },
          };
        });
      },

      deleteStory: (id): void => {
        set((state) => {
          const newStories = { ...state.stories };
          delete newStories[id];

          return {
            stories: newStories,
            currentStoryId: state.currentStoryId === id ? null : state.currentStoryId,
          };
        });
      },

      setCurrentStory: (id): void => {
        set({ currentStoryId: id });
      },

      // Chapter management actions
      addChapter: (storyId, chapter): void => {
        set((state) => {
          const story = state.stories[storyId];
          if (!story) return state;

          return {
            stories: {
              ...state.stories,
              [storyId]: {
                ...story,
                chapters: [...story.chapters, chapter],
              },
            },
          };
        });
      },

      updateChapter: (storyId, chapterId, updates): void => {
        set((state) => {
          const story = state.stories[storyId];
          if (!story) return state;

          const updatedChapters = story.chapters.map((chapter) =>
            chapter.id === chapterId ? { ...chapter, ...updates } : chapter
          );

          return {
            stories: {
              ...state.stories,
              [storyId]: {
                ...story,
                chapters: updatedChapters,
              },
            },
          };
        });
      },

      removeChapter: (storyId, chapterId): void => {
        set((state) => {
          const story = state.stories[storyId];
          if (!story) return state;

          return {
            stories: {
              ...state.stories,
              [storyId]: {
                ...story,
                chapters: story.chapters.filter((c) => c.id !== chapterId),
              },
            },
          };
        });
      },

      reorderChapters: (storyId, chapterIds): void => {
        set((state) => {
          const story = state.stories[storyId];
          if (!story) return state;

          // Create a map for quick lookup
          const chapterMap = new Map(story.chapters.map((c) => [c.id, c]));

          // Reorder based on provided IDs
          const reorderedChapters = chapterIds
            .map((id) => chapterMap.get(id))
            .filter((c): c is NarrativeChapter => c !== undefined);

          return {
            stories: {
              ...state.stories,
              [storyId]: {
                ...story,
                chapters: reorderedChapters,
              },
            },
          };
        });
      },

      // Editing state
      setEditing: (isEditing): void => {
        set({ isEditing });
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
      getCurrentStory: (): NarrativeStory | null => {
        const { stories, currentStoryId } = get();
        return currentStoryId ? stories[currentStoryId] ?? null : null;
      },

      getStoryChapters: (storyId): NarrativeChapter[] => {
        const { stories } = get();
        return stories[storyId]?.chapters ?? [];
      },

      getStories: (): NarrativeStory[] => {
        const { stories } = get();
        return Object.values(stories);
      },

      getStoriesByStatus: (status): NarrativeStory[] => {
        const { stories } = get();
        return Object.values(stories).filter((s) => s.status === status);
      },
    }),
    { name: 'NarrativeStore' }
  )
);
