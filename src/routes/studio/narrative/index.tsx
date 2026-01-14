/**
 * Narrative Builder Page
 *
 * Full-page wrapper for the NarrativeBuilder component.
 * Provides story management and narrative-driven workflow creation.
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookText, ArrowLeft, Plus } from 'lucide-react';
import clsx from 'clsx';
import { NarrativeBuilder } from '@/components/narrative/NarrativeBuilder';
import { useNarrativeStore } from '@/store/useNarrativeStore';
import type { NarrativeStory, NarrativeChapter } from '@/types';

/**
 * Default empty story for new narratives
 */
function createEmptyStory(): NarrativeStory {
  return {
    id: `story-${Date.now()}`,
    title: 'Untitled Story',
    description: '',
    chapters: [],
    status: 'draft',
  };
}

export default function NarrativePage(): JSX.Element {
  const navigate = useNavigate();
  const { createStory, updateStory, getStories, setCurrentStory } = useNarrativeStore();

  // Get stories array
  const stories = getStories();

  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(
    stories.length > 0 ? stories[0].id : null
  );
  const [isSaving, setIsSaving] = useState(false);

  const selectedStory = stories.find((s) => s.id === selectedStoryId) || null;

  // Create a new story
  const handleNewStory = useCallback((): void => {
    const newStory = createEmptyStory();
    createStory(newStory);
    setSelectedStoryId(newStory.id);
    setCurrentStory(newStory.id);
  }, [createStory, setCurrentStory]);

  // Update story
  const handleStoryUpdate = useCallback(
    (updates: Partial<NarrativeStory>): void => {
      if (selectedStoryId) {
        updateStory(selectedStoryId, updates);
      }
    },
    [selectedStoryId, updateStory]
  );

  // Add chapter
  const handleChapterAdd = useCallback(
    (chapter: NarrativeChapter): void => {
      if (selectedStory) {
        const updatedChapters = [...selectedStory.chapters, chapter];
        updateStory(selectedStoryId!, { chapters: updatedChapters });
      }
    },
    [selectedStory, selectedStoryId, updateStory]
  );

  // Update chapter
  const handleChapterUpdate = useCallback(
    (chapterId: string, updates: Partial<NarrativeChapter>): void => {
      if (selectedStory) {
        const updatedChapters = selectedStory.chapters.map((ch: NarrativeChapter) =>
          ch.id === chapterId ? { ...ch, ...updates } : ch
        );
        updateStory(selectedStoryId!, { chapters: updatedChapters });
      }
    },
    [selectedStory, selectedStoryId, updateStory]
  );

  // Delete chapter
  const handleChapterDelete = useCallback(
    (chapterId: string): void => {
      if (selectedStory) {
        const updatedChapters = selectedStory.chapters.filter(
          (ch: NarrativeChapter) => ch.id !== chapterId
        );
        updateStory(selectedStoryId!, { chapters: updatedChapters });
      }
    },
    [selectedStory, selectedStoryId, updateStory]
  );

  // Reorder chapters
  const handleChapterReorder = useCallback(
    (chapterIds: string[]): void => {
      if (selectedStory) {
        const chapterMap = new Map(
          selectedStory.chapters.map((ch: NarrativeChapter) => [ch.id, ch])
        );
        const reorderedChapters = chapterIds
          .map((id) => chapterMap.get(id))
          .filter((ch): ch is NarrativeChapter => ch !== undefined);
        updateStory(selectedStoryId!, { chapters: reorderedChapters });
      }
    },
    [selectedStory, selectedStoryId, updateStory]
  );

  // Save story
  const handleSave = useCallback(async (): Promise<void> => {
    setIsSaving(true);
    // Simulate save operation
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSaving(false);
  }, []);

  // Activate story
  const handleActivate = useCallback((): void => {
    if (selectedStoryId) {
      updateStory(selectedStoryId, { status: 'active' });
    }
  }, [selectedStoryId, updateStory]);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <BookText className="w-8 h-8 text-symtex-primary" />
              Narrative Builder
            </h1>
            <p className="text-slate-400 mt-1">
              Create story-driven automation workflows with natural language
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleNewStory}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg gradient-primary text-white font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5" aria-hidden="true" />
          New Story
        </button>
      </div>

      {/* Story Selection Tabs */}
      {stories.length > 0 && (
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          {stories.map((story) => (
            <button
              key={story.id}
              type="button"
              onClick={() => {
                setSelectedStoryId(story.id);
                setCurrentStory(story.id);
              }}
              className={clsx(
                'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all',
                selectedStoryId === story.id
                  ? 'bg-symtex-primary/20 text-symtex-primary border border-symtex-primary/30'
                  : 'bg-symtex-card text-slate-400 border border-symtex-border hover:text-white hover:border-slate-500'
              )}
            >
              {story.title || 'Untitled'}
            </button>
          ))}
        </div>
      )}

      {/* Narrative Builder */}
      {selectedStory ? (
        <NarrativeBuilder
          story={selectedStory}
          onStoryUpdate={handleStoryUpdate}
          onChapterAdd={handleChapterAdd}
          onChapterUpdate={handleChapterUpdate}
          onChapterDelete={handleChapterDelete}
          onChapterReorder={handleChapterReorder}
          onSave={handleSave}
          onBack={() => navigate(-1)}
          onActivate={handleActivate}
          isSaving={isSaving}
        />
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-symtex-card rounded-xl border border-symtex-border">
          <BookText className="w-16 h-16 text-slate-600 mb-4" aria-hidden="true" />
          <h2 className="text-xl font-semibold text-white mb-2">No Stories Yet</h2>
          <p className="text-slate-400 mb-6">
            Create your first narrative-driven automation workflow
          </p>
          <button
            type="button"
            onClick={handleNewStory}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg gradient-primary text-white font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5" aria-hidden="true" />
            Create Your First Story
          </button>
        </div>
      )}
    </div>
  );
}
