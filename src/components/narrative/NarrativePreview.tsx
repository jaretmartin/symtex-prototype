/**
 * Narrative Preview Component
 *
 * Provides a read-only preview of a narrative story in a compact card format.
 * Useful for story lists, selection dialogs, and dashboard widgets.
 */

import { useMemo } from 'react';
import {
  BookOpen,
  Play,
  GitBranch,
  Zap,
  Flag,
  CheckCircle,
  DollarSign,
  Clock,
  ChevronRight,
  Eye,
} from 'lucide-react';
import clsx from 'clsx';
import { Button } from '@/components/ui/Button';
import type { NarrativeStory, NarrativeStatus, ChapterType } from '@/types';

interface NarrativePreviewProps {
  story: NarrativeStory;
  onSelect?: (story: NarrativeStory) => void;
  onPreview?: (story: NarrativeStory) => void;
  onRun?: (story: NarrativeStory) => void;
  isSelected?: boolean;
  showActions?: boolean;
  compact?: boolean;
  className?: string;
}

interface StatusBadgeConfig {
  label: string;
  color: string;
  bgColor: string;
}

interface ChapterTypeIcon {
  icon: React.ElementType;
  color: string;
}

const statusBadge: Record<NarrativeStatus, StatusBadgeConfig> = {
  draft: {
    label: 'Draft',
    color: 'text-muted-foreground',
    bgColor: 'bg-muted/10',
  },
  active: {
    label: 'Active',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
  },
  paused: {
    label: 'Paused',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
  },
};

const chapterTypeIcons: Record<ChapterType, ChapterTypeIcon> = {
  beginning: { icon: Play, color: 'text-emerald-400' },
  decision: { icon: GitBranch, color: 'text-amber-400' },
  action: { icon: Zap, color: 'text-blue-400' },
  milestone: { icon: Flag, color: 'text-purple-400' },
  ending: { icon: CheckCircle, color: 'text-symtex-primary' },
};

export function NarrativePreview({
  story,
  onSelect,
  onPreview,
  onRun,
  isSelected = false,
  showActions = true,
  compact = false,
  className,
}: NarrativePreviewProps): JSX.Element {
  const badge = statusBadge[story.status];
  const estimatedCost = story.estimatedCost ?? 0;

  // Calculate chapter type distribution for visual indicator
  const chapterDistribution = useMemo((): Array<{ type: ChapterType; count: number }> => {
    const counts: Record<ChapterType, number> = {
      beginning: 0,
      decision: 0,
      action: 0,
      milestone: 0,
      ending: 0,
    };

    story.chapters.forEach((chapter) => {
      counts[chapter.type]++;
    });

    return Object.entries(counts)
      .filter(([, count]) => count > 0)
      .map(([type, count]) => ({ type: type as ChapterType, count }));
  }, [story.chapters]);

  // Estimated duration based on chapter count
  const estimatedDuration = Math.ceil(story.chapters.length * 2);

  const handleClick = (): void => {
    if (onSelect) {
      onSelect(story);
    }
  };

  if (compact) {
    return (
      <div
        onClick={handleClick}
        className={clsx(
          'group p-3 rounded-lg border transition-all duration-200',
          onSelect && 'cursor-pointer',
          isSelected
            ? 'bg-symtex-primary/10 border-symtex-primary'
            : 'bg-card border-border hover:border-border'
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={clsx(
              'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center',
              isSelected ? 'bg-symtex-primary/20' : 'bg-muted/50'
            )}
          >
            <BookOpen
              className={clsx('w-4 h-4', isSelected ? 'text-symtex-primary' : 'text-muted-foreground')}
            />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-foreground truncate">{story.title}</h4>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{story.chapters.length} chapters</span>
              <span className={badge.color}>{badge.label}</span>
            </div>
          </div>

          {onSelect && (
            <ChevronRight
              className={clsx(
                'w-4 h-4 transition-transform',
                isSelected ? 'text-symtex-primary' : 'text-muted-foreground',
                'group-hover:translate-x-0.5'
              )}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'group bg-card rounded-xl border transition-all duration-200',
        isSelected
          ? 'border-symtex-primary ring-2 ring-symtex-primary/20'
          : 'border-border hover:border-border',
        onSelect && 'cursor-pointer',
        className
      )}
      onClick={handleClick}
    >
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div
            className={clsx(
              'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
              isSelected
                ? 'bg-gradient-to-br from-symtex-primary/20 to-symtex-accent/20'
                : 'bg-muted/50'
            )}
          >
            <BookOpen
              className={clsx('w-5 h-5', isSelected ? 'text-symtex-primary' : 'text-muted-foreground')}
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground truncate">{story.title}</h3>
              <span
                className={clsx('text-xs font-medium px-1.5 py-0.5 rounded', badge.bgColor, badge.color)}
              >
                {badge.label}
              </span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{story.description}</p>
          </div>
        </div>
      </div>

      {/* Chapter Distribution */}
      {chapterDistribution.length > 0 && (
        <div className="px-4 py-3 border-b border-border/50">
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">Chapters:</span>
            <div className="flex items-center gap-2">
              {chapterDistribution.map(({ type, count }) => {
                const config = chapterTypeIcons[type];
                const Icon = config.icon;
                return (
                  <div
                    key={type}
                    className="flex items-center gap-1 text-xs"
                    title={`${count} ${type} chapter${count !== 1 ? 's' : ''}`}
                  >
                    <Icon className={clsx('w-3.5 h-3.5', config.color)} />
                    <span className="text-muted-foreground">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="px-4 py-3 flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5" />
          <span>{story.chapters.length} chapters</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>~{estimatedDuration} min</span>
        </div>

        {estimatedCost > 0 && (
          <div className="flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5" />
            <span>${estimatedCost.toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      {showActions && (onPreview || onRun) && (
        <div className="px-4 py-3 border-t border-border/50 flex items-center justify-end gap-2">
          {onPreview && (
            <Button
              variant="ghost"
              size="xs"
              onClick={(e) => {
                e.stopPropagation();
                onPreview(story);
              }}
            >
              <Eye className="w-3.5 h-3.5" />
              Preview
            </Button>
          )}

          {onRun && story.chapters.length > 0 && (
            <Button
              variant="primary"
              size="xs"
              onClick={(e) => {
                e.stopPropagation();
                onRun(story);
              }}
            >
              <Play className="w-3.5 h-3.5" />
              Run
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default NarrativePreview;
