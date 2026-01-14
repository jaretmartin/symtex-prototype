/**
 * FeedbackWidget Component
 *
 * Collects user feedback on AI reasoning traces.
 * Includes star rating, optional comment, and improvement suggestions.
 */

import { useState } from 'react';
import {
  Star,
  MessageSquare,
  CheckCircle,
  Send,
  X,
} from 'lucide-react';
import clsx from 'clsx';
import type { Feedback } from '@/types/entities/reasoning';
import { Button } from '@/components/ui/Button';

export interface FeedbackWidgetProps {
  /** Handler called when feedback is submitted */
  onSubmit: (feedback: Feedback) => void;
  /** Existing feedback to pre-fill the form */
  existingFeedback?: Feedback;
  /** Whether the widget is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Predefined improvement suggestions
 */
const IMPROVEMENT_OPTIONS = [
  'More detailed explanation',
  'Faster processing',
  'Better source attribution',
  'Higher confidence needed',
  'Consider more context',
  'Simpler reasoning path',
];

/**
 * Star Rating Component
 */
function StarRating({
  value,
  onChange,
  disabled,
}: {
  value: 1 | 2 | 3 | 4 | 5 | null;
  onChange: (rating: 1 | 2 | 3 | 4 | 5) => void;
  disabled?: boolean;
}): JSX.Element {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((rating) => {
        const isFilled = (hoverValue ?? value ?? 0) >= rating;
        return (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(rating as 1 | 2 | 3 | 4 | 5)}
            onMouseEnter={() => !disabled && setHoverValue(rating)}
            onMouseLeave={() => setHoverValue(null)}
            disabled={disabled}
            className={clsx(
              'p-1 transition-all duration-150',
              disabled
                ? 'cursor-not-allowed opacity-50'
                : 'cursor-pointer hover:scale-110'
            )}
            role="radio"
            aria-checked={value === rating}
            aria-label={`${rating} star${rating !== 1 ? 's' : ''}`}
          >
            <Star
              className={clsx(
                'w-6 h-6 transition-colors duration-150',
                isFilled
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-slate-600 hover:text-slate-500'
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

/**
 * Thank you state after submission
 */
function ThankYouState({ className }: { className?: string }): JSX.Element {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center py-6 text-center',
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-3">
        <CheckCircle className="w-6 h-6 text-green-400" />
      </div>
      <h4 className="text-sm font-medium text-white mb-1">Thank you for your feedback!</h4>
      <p className="text-xs text-slate-400">
        Your input helps improve AI reasoning quality.
      </p>
    </div>
  );
}

/**
 * FeedbackWidget - User feedback collection for reasoning traces
 *
 * @example
 * // Basic usage
 * <FeedbackWidget onSubmit={handleFeedback} />
 *
 * // Pre-filled with existing feedback
 * <FeedbackWidget
 *   onSubmit={handleFeedback}
 *   existingFeedback={trace.userFeedback}
 * />
 */
export default function FeedbackWidget({
  onSubmit,
  existingFeedback,
  disabled = false,
  className,
}: FeedbackWidgetProps): JSX.Element {
  const [rating, setRating] = useState<1 | 2 | 3 | 4 | 5 | null>(
    existingFeedback?.rating ?? null
  );
  const [comment, setComment] = useState(existingFeedback?.comment ?? '');
  const [improvements, setImprovements] = useState<string[]>(
    existingFeedback?.improvements ?? []
  );
  const [showCommentField, setShowCommentField] = useState(Boolean(existingFeedback?.comment));
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (): void => {
    if (!rating || disabled || isSubmitting) return;

    setIsSubmitting(true);

    // Simulate async submission
    setTimeout(() => {
      const feedback: Feedback = {
        rating,
        ...(comment.trim() && { comment: comment.trim() }),
        ...(improvements.length > 0 && { improvements }),
      };

      onSubmit(feedback);
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 500);
  };

  const toggleImprovement = (improvement: string): void => {
    setImprovements((prev) =>
      prev.includes(improvement)
        ? prev.filter((i) => i !== improvement)
        : [...prev, improvement]
    );
  };

  const handleReset = (): void => {
    setRating(null);
    setComment('');
    setImprovements([]);
    setShowCommentField(false);
    setIsSubmitted(false);
  };

  // Show thank you state if already submitted
  if (isSubmitted) {
    return <ThankYouState className={className} />;
  }

  return (
    <div
      className={clsx(
        'p-4 rounded-lg border border-symtex-border bg-slate-800/30',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-medium text-white flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-slate-400" />
          Rate this reasoning
        </h4>
        {(rating || comment || improvements.length > 0) && (
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-slate-500 hover:text-slate-400 transition-colors"
            aria-label="Reset feedback"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Star Rating */}
      <div className="mb-4">
        <p className="text-xs text-slate-400 mb-2">
          How helpful was this reasoning?
        </p>
        <StarRating value={rating} onChange={setRating} disabled={disabled} />
      </div>

      {/* Improvement Suggestions */}
      {rating && rating <= 3 && (
        <div className="mb-4">
          <p className="text-xs text-slate-400 mb-2">
            What could be improved? (optional)
          </p>
          <div className="flex flex-wrap gap-2">
            {IMPROVEMENT_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => toggleImprovement(option)}
                disabled={disabled}
                className={clsx(
                  'px-2.5 py-1 rounded-full text-xs transition-all duration-150',
                  improvements.includes(option)
                    ? 'bg-symtex-primary/20 text-symtex-primary border border-symtex-primary/30'
                    : 'bg-slate-700/50 text-slate-400 border border-slate-600 hover:border-slate-500',
                  disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Optional Comment */}
      <div className="mb-4">
        {!showCommentField ? (
          <button
            type="button"
            onClick={() => setShowCommentField(true)}
            disabled={disabled}
            className={clsx(
              'text-xs text-slate-500 hover:text-slate-400 transition-colors',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            + Add a comment
          </button>
        ) : (
          <div className="space-y-2">
            <label
              htmlFor="feedback-comment"
              className="text-xs text-slate-400 block"
            >
              Additional comments (optional)
            </label>
            <textarea
              id="feedback-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={disabled}
              placeholder="Share your thoughts..."
              className={clsx(
                'w-full px-3 py-2 rounded-lg text-sm',
                'bg-slate-900/50 border border-slate-700',
                'text-slate-200 placeholder-slate-500',
                'focus:outline-none focus:ring-2 focus:ring-symtex-primary/50 focus:border-symtex-primary/50',
                'resize-none transition-colors',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
              rows={3}
              maxLength={500}
            />
            <div className="text-xs text-slate-500 text-right">
              {comment.length}/500
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={!rating || disabled}
        isLoading={isSubmitting}
        size="sm"
        fullWidth
        rightIcon={<Send className="w-3.5 h-3.5" />}
      >
        Submit Feedback
      </Button>
    </div>
  );
}

/**
 * Compact feedback trigger button
 */
export function FeedbackTrigger({
  onClick,
  hasFeedback,
  className,
}: {
  onClick: () => void;
  hasFeedback?: boolean;
  className?: string;
}): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs',
        'transition-all duration-200',
        hasFeedback
          ? 'bg-green-500/10 text-green-400 border border-green-500/30'
          : 'bg-slate-700/50 text-slate-400 border border-slate-600 hover:border-slate-500 hover:text-slate-300',
        className
      )}
      aria-label={hasFeedback ? 'View submitted feedback' : 'Provide feedback'}
    >
      {hasFeedback ? (
        <>
          <CheckCircle className="w-3.5 h-3.5" />
          Feedback submitted
        </>
      ) : (
        <>
          <MessageSquare className="w-3.5 h-3.5" />
          Rate this
        </>
      )}
    </button>
  );
}
