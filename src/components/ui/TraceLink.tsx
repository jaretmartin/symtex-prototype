/**
 * TraceLink Component
 *
 * A reusable link component for navigating to execution trace views.
 * Used throughout the application to provide quick access to reasoning
 * and execution traces for completed runs.
 */

import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TraceLinkProps {
  /** The unique identifier for the run/execution to view */
  runId: string;
  /** Optional additional CSS classes */
  className?: string;
  /** Optional custom label (defaults to "View Trace") */
  label?: string;
  /** Whether to show the icon */
  showIcon?: boolean;
  /** Size variant */
  size?: 'sm' | 'md';
}

/**
 * TraceLink - Navigation link to execution trace view
 *
 * @example
 * // Basic usage
 * <TraceLink runId="run-123" />
 *
 * // Custom label
 * <TraceLink runId="run-123" label="See reasoning" />
 *
 * // Without icon
 * <TraceLink runId="run-123" showIcon={false} />
 */
export function TraceLink({
  runId,
  className,
  label = 'View Trace',
  showIcon = true,
  size = 'sm',
}: TraceLinkProps): JSX.Element {
  return (
    <Link
      to={`/runs/${runId}/trace`}
      className={cn(
        'inline-flex items-center gap-1 text-muted-foreground hover:text-symtex-primary transition-colors',
        size === 'sm' ? 'text-sm' : 'text-base',
        className
      )}
    >
      {showIcon && (
        <Eye className={cn(size === 'sm' ? 'w-4 h-4' : 'w-5 h-5')} />
      )}
      {label}
    </Link>
  );
}

export default TraceLink;
