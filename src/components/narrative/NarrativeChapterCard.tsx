/**
 * Narrative Chapter Card Component
 *
 * Displays an individual chapter in the story timeline with type-specific
 * icons, story text, and expandable customization fields.
 */

import { useState, useCallback } from 'react';
import {
  Play,
  GitBranch,
  Zap,
  Flag,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Pencil,
  Trash2,
  GripVertical,
} from 'lucide-react';
import clsx from 'clsx';
import { Button } from '@/components/ui/Button';
import { CustomizableFieldInput } from './CustomizableFieldInput';
import type { NarrativeChapter, ChapterType } from '@/types';

interface NarrativeChapterCardProps {
  chapter: NarrativeChapter;
  chapterNumber: number;
  onEdit?: (chapter: NarrativeChapter) => void;
  onDelete?: (chapterId: string) => void;
  onFieldChange?: (chapterId: string, fieldId: string, value: string | number | boolean) => void;
  isDragging?: boolean;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
  className?: string;
}

interface ChapterTypeConfig {
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
  label: string;
}

const chapterTypeConfig: Record<ChapterType, ChapterTypeConfig> = {
  beginning: {
    icon: Play,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    label: 'Beginning',
  },
  decision: {
    icon: GitBranch,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    label: 'Decision',
  },
  action: {
    icon: Zap,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    label: 'Action',
  },
  milestone: {
    icon: Flag,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    label: 'Milestone',
  },
  ending: {
    icon: CheckCircle,
    color: 'text-symtex-primary',
    bgColor: 'bg-symtex-primary/10',
    borderColor: 'border-symtex-primary/30',
    label: 'Ending',
  },
};

export function NarrativeChapterCard({
  chapter,
  chapterNumber,
  onEdit,
  onDelete,
  onFieldChange,
  isDragging = false,
  dragHandleProps,
  className,
}: NarrativeChapterCardProps): JSX.Element {
  const [isExpanded, setIsExpanded] = useState(false);

  const config = chapterTypeConfig[chapter.type];
  const Icon = config.icon;

  const hasCustomizableFields = chapter.customizableFields.length > 0;
  const hasBranches = chapter.branches && chapter.branches.length > 0;

  const handleFieldChange = useCallback(
    (fieldId: string, value: string | number | boolean): void => {
      onFieldChange?.(chapter.id, fieldId, value);
    },
    [chapter.id, onFieldChange]
  );

  const toggleExpand = useCallback((): void => {
    setIsExpanded((prev) => !prev);
  }, []);

  return (
    <div
      className={clsx(
        'relative bg-symtex-card rounded-xl border transition-all duration-200',
        isDragging
          ? 'shadow-lg shadow-symtex-primary/20 border-symtex-primary scale-[1.02]'
          : `${config.borderColor} hover:border-slate-500`,
        className
      )}
    >
      {/* Chapter Header */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Drag Handle */}
          {dragHandleProps && (
            <div
              {...dragHandleProps}
              className="flex-shrink-0 p-1 rounded cursor-grab hover:bg-slate-700/50 text-slate-500 hover:text-slate-300 transition-colors"
            >
              <GripVertical className="w-4 h-4" />
            </div>
          )}

          {/* Type Icon */}
          <div
            className={clsx(
              'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
              config.bgColor
            )}
          >
            <Icon className={clsx('w-5 h-5', config.color)} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Type Badge & Title */}
            <div className="flex items-center gap-2 mb-1">
              <span
                className={clsx(
                  'text-xs font-medium px-2 py-0.5 rounded',
                  config.bgColor,
                  config.color
                )}
              >
                {config.label}
              </span>
            </div>

            <h4 className="font-semibold text-white text-base mb-1">
              Chapter {chapterNumber}: {chapter.title}
            </h4>

            <p className="text-sm text-slate-400 leading-relaxed">{chapter.storyText}</p>

            {/* Branch Indicators for Decision Chapters */}
            {hasBranches && (
              <div className="mt-3 space-y-1.5">
                <span className="text-xs text-slate-500 uppercase tracking-wider">
                  Branches:
                </span>
                <div className="flex flex-wrap gap-2">
                  {chapter.branches!.map((branch) => (
                    <div
                      key={branch.id}
                      className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-500/10 border border-amber-500/20"
                    >
                      <GitBranch className="w-3 h-3 text-amber-400" />
                      <span className="text-xs text-amber-300">{branch.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {onEdit && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onEdit(chapter)}
                aria-label="Edit chapter"
              >
                <Pencil className="w-4 h-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onDelete(chapter.id)}
                aria-label="Delete chapter"
                className="text-slate-400 hover:text-error"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Expand/Collapse for Customizable Fields */}
        {hasCustomizableFields && (
          <button
            onClick={toggleExpand}
            className="mt-3 flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-300 transition-colors"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Hide customization options
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Show {chapter.customizableFields.length} customization option
                {chapter.customizableFields.length !== 1 ? 's' : ''}
              </>
            )}
          </button>
        )}
      </div>

      {/* Customizable Fields (Expanded) */}
      {hasCustomizableFields && isExpanded && (
        <div className="px-4 pb-4 pt-2 border-t border-symtex-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {chapter.customizableFields.map((field) => (
              <CustomizableFieldInput
                key={field.id}
                field={field}
                onChange={handleFieldChange}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default NarrativeChapterCard;
