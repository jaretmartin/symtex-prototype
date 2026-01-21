/**
 * Narrative Story View Component
 *
 * Displays a complete narrative story with its chapters in a timeline view.
 * Shows story metadata, progress indicators, and allows navigation between chapters.
 */

import { useState, useCallback } from 'react';
import {
  BookOpen,
  Play,
  Pause,
  Clock,
  DollarSign,
  MoreVertical,
  Edit3,
  Trash2,
  Copy,
  Settings,
} from 'lucide-react';
import clsx from 'clsx';
import { Button } from '@/components/ui/Button';
import { NarrativeChapterCard } from './NarrativeChapterCard';
import type { NarrativeStory, NarrativeStatus } from '@/types';

interface NarrativeStoryViewProps {
  story: NarrativeStory;
  currentChapterIndex?: number;
  onChapterClick?: (chapterId: string, index: number) => void;
  onEditChapter?: (chapterId: string) => void;
  onDeleteChapter?: (chapterId: string) => void;
  onFieldChange?: (chapterId: string, fieldId: string, value: string | number | boolean) => void;
  onStatusChange?: (status: NarrativeStatus) => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onConfigure?: () => void;
  className?: string;
}

interface StatusConfig {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const statusConfig: Record<NarrativeStatus, StatusConfig> = {
  draft: {
    label: 'Draft',
    color: 'text-muted-foreground',
    bgColor: 'bg-muted/10',
    borderColor: 'border-muted/30',
  },
  active: {
    label: 'Active',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
  },
  paused: {
    label: 'Paused',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
  },
};

export function NarrativeStoryView({
  story,
  currentChapterIndex,
  onChapterClick,
  onEditChapter,
  onDeleteChapter,
  onFieldChange,
  onStatusChange,
  onEdit,
  onDelete,
  onDuplicate,
  onConfigure,
  className,
}: NarrativeStoryViewProps): JSX.Element {
  const [showMenu, setShowMenu] = useState(false);

  const status = statusConfig[story.status];
  const hasChapters = story.chapters.length > 0;
  const estimatedCost = story.estimatedCost ?? 0;

  const handleToggleStatus = useCallback((): void => {
    if (!onStatusChange) return;

    if (story.status === 'active') {
      onStatusChange('paused');
    } else {
      onStatusChange('active');
    }
  }, [story.status, onStatusChange]);

  const handleMenuAction = useCallback(
    (action: () => void): void => {
      action();
      setShowMenu(false);
    },
    []
  );

  return (
    <div className={clsx('space-y-6', className)}>
      {/* Story Header */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-symtex-primary/20 to-symtex-accent/20 flex items-center justify-center">
            <BookOpen className="w-7 h-7 text-symtex-primary" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-xl font-bold text-foreground truncate">{story.title}</h2>
              <span
                className={clsx(
                  'flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded border',
                  status.bgColor,
                  status.color,
                  status.borderColor
                )}
              >
                {status.label}
              </span>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{story.description}</p>

            {/* Meta Info */}
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <BookOpen className="w-4 h-4" />
                <span>{story.chapters.length} chapters</span>
              </div>

              {estimatedCost > 0 && (
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <DollarSign className="w-4 h-4" />
                  <span>${estimatedCost.toFixed(2)} estimated</span>
                </div>
              )}

              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>~{Math.ceil(story.chapters.length * 2)} min</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Status Toggle */}
            {onStatusChange && story.status !== 'draft' && (
              <Button
                variant={story.status === 'active' ? 'warning' : 'success'}
                size="sm"
                onClick={handleToggleStatus}
              >
                {story.status === 'active' ? (
                  <>
                    <Pause className="w-4 h-4" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Resume
                  </>
                )}
              </Button>
            )}

            {/* Activate Draft */}
            {onStatusChange && story.status === 'draft' && hasChapters && (
              <Button variant="primary" size="sm" onClick={() => onStatusChange('active')}>
                <Play className="w-4 h-4" />
                Activate
              </Button>
            )}

            {/* Menu */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setShowMenu(!showMenu)}
                aria-label="More options"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>

              {showMenu && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-symtex-elevated rounded-lg border border-border shadow-xl z-20">
                  {onEdit && (
                    <button
                      onClick={() => handleMenuAction(onEdit)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 first:rounded-t-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit Story
                    </button>
                  )}
                  {onDuplicate && (
                    <button
                      onClick={() => handleMenuAction(onDuplicate)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                      Duplicate
                    </button>
                  )}
                  {onConfigure && (
                    <button
                      onClick={() => handleMenuAction(onConfigure)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Configure
                    </button>
                  )}
                  {onDelete && (
                    <>
                      <div className="border-t border-border" />
                      <button
                        onClick={() => handleMenuAction(onDelete)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-error hover:bg-error/10 last:rounded-b-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Story
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chapters Timeline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Story Timeline</h3>
          {hasChapters && (
            <span className="text-sm text-muted-foreground">
              {story.chapters.length} chapter{story.chapters.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {hasChapters ? (
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-symtex-primary via-symtex-border to-transparent" />

            {/* Chapters */}
            <div className="space-y-4">
              {story.chapters.map((chapter, index) => (
                <div key={chapter.id} className="relative">
                  {/* Timeline Dot */}
                  <div
                    className={clsx(
                      'absolute left-4 top-6 w-4 h-4 rounded-full border-2 z-10',
                      currentChapterIndex === index
                        ? 'bg-symtex-primary border-symtex-primary shadow-lg shadow-symtex-primary/50'
                        : currentChapterIndex !== undefined && index < currentChapterIndex
                          ? 'bg-success border-success'
                          : 'bg-surface-base border-border'
                    )}
                  />

                  {/* Chapter Card */}
                  <div
                    className={clsx(
                      'ml-12 transition-all duration-200',
                      onChapterClick && 'cursor-pointer'
                    )}
                    onClick={() => onChapterClick?.(chapter.id, index)}
                  >
                    <NarrativeChapterCard
                      chapter={chapter}
                      chapterNumber={index + 1}
                      onEdit={onEditChapter ? () => onEditChapter(chapter.id) : undefined}
                      onDelete={onDeleteChapter ? () => onDeleteChapter(chapter.id) : undefined}
                      onFieldChange={onFieldChange}
                      className={clsx(
                        currentChapterIndex === index &&
                          'ring-2 ring-symtex-primary ring-offset-2 ring-offset-symtex-dark'
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-dashed border-border p-12 text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h4 className="text-lg font-medium text-foreground mb-2">No chapters yet</h4>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Start building your story by adding chapters. Each chapter represents a step in
              your Automation with narrative context.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default NarrativeStoryView;
