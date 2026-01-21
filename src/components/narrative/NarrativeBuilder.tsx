/**
 * Narrative Builder Component
 *
 * Main container for building and editing narrative-driven automation workflows.
 * Combines story editing, chapter management, and preview functionality.
 */

import { useState, useCallback } from 'react';
import {
  BookOpen,
  Plus,
  Save,
  ArrowLeft,
  Eye,
  EyeOff,
  Sparkles,
  Play,
  GitBranch,
  Zap,
  Flag,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import clsx from 'clsx';
import { Button } from '@/components/ui/Button';
import { NarrativeInput } from './NarrativeInput';
import { NarrativeStoryView } from './NarrativeStoryView';
import { CostEstimateDisplay } from './CostEstimateDisplay';
import type { NarrativeStory, NarrativeChapter, ChapterType } from '@/types';

interface NarrativeBuilderProps {
  story: NarrativeStory;
  onStoryUpdate: (updates: Partial<NarrativeStory>) => void;
  onChapterAdd: (chapter: NarrativeChapter) => void;
  onChapterUpdate: (chapterId: string, updates: Partial<NarrativeChapter>) => void;
  onChapterDelete: (chapterId: string) => void;
  onChapterReorder: (chapterIds: string[]) => void;
  onSave?: () => Promise<void>;
  onBack?: () => void;
  onActivate?: () => void;
  isSaving?: boolean;
  className?: string;
}

interface ChapterTypeOption {
  type: ChapterType;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

const chapterTypeOptions: ChapterTypeOption[] = [
  {
    type: 'beginning',
    label: 'Beginning',
    description: 'Start of the story',
    icon: Play,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
  },
  {
    type: 'action',
    label: 'Action',
    description: 'Execute a task',
    icon: Zap,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
  },
  {
    type: 'decision',
    label: 'Decision',
    description: 'Branch point',
    icon: GitBranch,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
  },
  {
    type: 'milestone',
    label: 'Milestone',
    description: 'Progress marker',
    icon: Flag,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
  },
  {
    type: 'ending',
    label: 'Ending',
    description: 'Story conclusion',
    icon: CheckCircle,
    color: 'text-symtex-primary',
    bgColor: 'bg-symtex-primary/10',
  },
];

type ViewMode = 'edit' | 'preview';

function generateId(): string {
  return `chapter-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function NarrativeBuilder({
  story,
  onStoryUpdate,
  onChapterAdd,
  onChapterUpdate,
  onChapterDelete,
  onChapterReorder: _onChapterReorder,
  onSave,
  onBack,
  onActivate,
  isSaving = false,
  className,
}: NarrativeBuilderProps): JSX.Element {
  const [viewMode, setViewMode] = useState<ViewMode>('edit');
  const [showAddChapter, setShowAddChapter] = useState(false);
  const [newChapterType, setNewChapterType] = useState<ChapterType>('action');
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [newChapterStory, setNewChapterStory] = useState('');
  const [showCostPanel, setShowCostPanel] = useState(true);

  const canActivate = story.chapters.length > 0 && story.status === 'draft';

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      onStoryUpdate({ title: e.target.value });
    },
    [onStoryUpdate]
  );

  const handleDescriptionChange = useCallback(
    (value: string): void => {
      onStoryUpdate({ description: value });
    },
    [onStoryUpdate]
  );

  const handleAddChapter = useCallback((): void => {
    if (!newChapterTitle.trim() || !newChapterStory.trim()) return;

    const newChapter: NarrativeChapter = {
      id: generateId(),
      type: newChapterType,
      title: newChapterTitle.trim(),
      storyText: newChapterStory.trim(),
      icon: newChapterType,
      stepType: newChapterType,
      customizableFields: [],
      branches: newChapterType === 'decision' ? [] : undefined,
    };

    onChapterAdd(newChapter);
    setNewChapterTitle('');
    setNewChapterStory('');
    setShowAddChapter(false);
  }, [newChapterType, newChapterTitle, newChapterStory, onChapterAdd]);

  const handleFieldChange = useCallback(
    (chapterId: string, fieldId: string, value: string | number | boolean): void => {
      const chapter = story.chapters.find((c) => c.id === chapterId);
      if (!chapter) return;

      const updatedFields = chapter.customizableFields.map((field) =>
        field.id === fieldId ? { ...field, value } : field
      );

      onChapterUpdate(chapterId, { customizableFields: updatedFields });
    },
    [story.chapters, onChapterUpdate]
  );

  const toggleViewMode = useCallback((): void => {
    setViewMode((prev) => (prev === 'edit' ? 'preview' : 'edit'));
  }, []);

  return (
    <div className={clsx('h-full flex flex-col', className)}>
      {/* Header */}
      <div className="flex-shrink-0 bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button variant="ghost" size="icon-sm" onClick={onBack} aria-label="Go back">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-symtex-primary/20 to-symtex-accent/20 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-symtex-primary" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">Narrative Builder</h1>
                <p className="text-sm text-muted-foreground">Create story-driven automations</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <Button variant="secondary" size="sm" onClick={toggleViewMode}>
              {viewMode === 'edit' ? (
                <>
                  <Eye className="w-4 h-4" />
                  Preview
                </>
              ) : (
                <>
                  <EyeOff className="w-4 h-4" />
                  Edit
                </>
              )}
            </Button>

            {/* Activate */}
            {canActivate && onActivate && (
              <Button variant="outline" size="sm" onClick={onActivate}>
                <Sparkles className="w-4 h-4" />
                Activate
              </Button>
            )}

            {/* Save */}
            {onSave && (
              <Button variant="primary" size="sm" onClick={onSave} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Main Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {viewMode === 'edit' ? (
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Story Metadata */}
              <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                <h2 className="font-semibold text-foreground">Story Details</h2>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Story Title
                  </label>
                  <input
                    type="text"
                    value={story.title}
                    onChange={handleTitleChange}
                    placeholder="Enter a title for your story..."
                    className={clsx(
                      'w-full px-4 py-2.5 rounded-lg bg-symtex-dark border border-border',
                      'text-foreground placeholder-muted-foreground text-sm',
                      'transition-colors duration-200',
                      'focus:outline-none focus:ring-2 focus:ring-symtex-primary focus:border-transparent',
                      'hover:border-border'
                    )}
                  />
                </div>

                {/* Description */}
                <NarrativeInput
                  label="Story Description"
                  value={story.description}
                  onChange={handleDescriptionChange}
                  placeholder="Describe what this story accomplishes..."
                  rows={3}
                  maxLength={500}
                  showAiAssist={false}
                />
              </div>

              {/* Chapters Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-foreground">Chapters</h2>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowAddChapter(!showAddChapter)}
                  >
                    <Plus className="w-4 h-4" />
                    Add Chapter
                  </Button>
                </div>

                {/* Add Chapter Panel */}
                {showAddChapter && (
                  <div className="bg-symtex-elevated rounded-xl border border-symtex-primary/30 p-4 space-y-4">
                    <h3 className="font-medium text-foreground">New Chapter</h3>

                    {/* Chapter Type Selection */}
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Chapter Type
                      </label>
                      <div className="grid grid-cols-5 gap-2">
                        {chapterTypeOptions.map((option) => {
                          const Icon = option.icon;
                          const isSelected = newChapterType === option.type;
                          return (
                            <button
                              key={option.type}
                              onClick={() => setNewChapterType(option.type)}
                              className={clsx(
                                'flex flex-col items-center gap-1 p-3 rounded-lg border transition-all',
                                isSelected
                                  ? `${option.bgColor} border-current ${option.color}`
                                  : 'border-border hover:border-border'
                              )}
                            >
                              <Icon className={clsx('w-5 h-5', option.color)} />
                              <span className="text-xs text-muted-foreground">{option.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Chapter Title */}
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Chapter Title
                      </label>
                      <input
                        type="text"
                        value={newChapterTitle}
                        onChange={(e) => setNewChapterTitle(e.target.value)}
                        placeholder="Enter chapter title..."
                        className={clsx(
                          'w-full px-4 py-2.5 rounded-lg bg-symtex-dark border border-border',
                          'text-foreground placeholder-muted-foreground text-sm',
                          'transition-colors duration-200',
                          'focus:outline-none focus:ring-2 focus:ring-symtex-primary focus:border-transparent'
                        )}
                      />
                    </div>

                    {/* Story Text */}
                    <NarrativeInput
                      label="Story Text"
                      value={newChapterStory}
                      onChange={setNewChapterStory}
                      placeholder="Tell the story of this chapter..."
                      rows={3}
                      maxLength={1000}
                      showAiAssist={false}
                    />

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 pt-2">
                      <Button variant="ghost" size="sm" onClick={() => setShowAddChapter(false)}>
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleAddChapter}
                        disabled={!newChapterTitle.trim() || !newChapterStory.trim()}
                      >
                        <Plus className="w-4 h-4" />
                        Add Chapter
                      </Button>
                    </div>
                  </div>
                )}

                {/* Chapter List */}
                <NarrativeStoryView
                  story={story}
                  onEditChapter={(_chapterId) => {
                    // In a real app, this would open an edit modal
                    // Edit chapter: chapterId
                  }}
                  onDeleteChapter={onChapterDelete}
                  onFieldChange={handleFieldChange}
                />
              </div>
            </div>
          ) : (
            /* Preview Mode */
            <div className="max-w-3xl mx-auto">
              <NarrativeStoryView
                story={story}
                onFieldChange={handleFieldChange}
              />
            </div>
          )}
        </div>

        {/* Cost Panel (Right Sidebar) */}
        {showCostPanel && viewMode === 'edit' && (
          <div className="w-80 flex-shrink-0 border-l border-border bg-surface-base/50 p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-foreground">Cost Analysis</h3>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setShowCostPanel(false)}
                aria-label="Hide cost panel"
              >
                <EyeOff className="w-4 h-4" />
              </Button>
            </div>

            <CostEstimateDisplay chapters={story.chapters} frequency="on-demand" />

            {/* Tips */}
            <div className="mt-4 p-3 rounded-lg bg-symtex-primary/5 border border-symtex-primary/20">
              <h4 className="text-sm font-medium text-symtex-primary mb-2">Tips</h4>
              <ul className="text-xs text-muted-foreground space-y-1.5">
                <li>Action chapters cost more due to API calls</li>
                <li>Decision chapters branch your Automation</li>
                <li>Milestones help track progress</li>
              </ul>
            </div>
          </div>
        )}

        {/* Show Cost Panel Button */}
        {!showCostPanel && viewMode === 'edit' && (
          <Button
            variant="secondary"
            size="icon-sm"
            onClick={() => setShowCostPanel(true)}
            className="fixed right-4 bottom-4"
            aria-label="Show cost panel"
          >
            <Eye className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

export default NarrativeBuilder;
