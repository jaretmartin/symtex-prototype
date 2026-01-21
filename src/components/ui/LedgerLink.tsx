/**
 * LedgerLink Component
 *
 * A reusable link component for navigating to the audit ledger.
 * Supports optional filtering parameters to pre-filter the ledger view.
 */

import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LedgerLinkProps {
  /** Optional filter parameter to pre-filter the ledger view */
  filter?: string;
  /** Optional cognate ID to filter by */
  cognateId?: string;
  /** Optional run ID to filter by */
  runId?: string;
  /** Optional additional CSS classes */
  className?: string;
  /** Optional custom label (defaults to "View in Ledger") */
  label?: string;
  /** Whether to show the icon */
  showIcon?: boolean;
  /** Size variant */
  size?: 'sm' | 'md';
}

/**
 * Builds the ledger URL with optional query parameters
 */
function buildLedgerUrl(filter?: string, cognateId?: string, runId?: string): string {
  const params = new URLSearchParams();

  if (filter) {
    params.set('filter', filter);
  }
  if (cognateId) {
    params.set('cognate', cognateId);
  }
  if (runId) {
    params.set('run', runId);
  }

  const queryString = params.toString();
  return queryString ? `/control/ledger?${queryString}` : '/control/ledger';
}

/**
 * LedgerLink - Navigation link to audit ledger view
 *
 * @example
 * // Basic usage
 * <LedgerLink />
 *
 * // With filter
 * <LedgerLink filter="approval" />
 *
 * // With cognate filter
 * <LedgerLink cognateId="cog-123" />
 *
 * // With run filter
 * <LedgerLink runId="run-456" />
 *
 * // Custom label
 * <LedgerLink label="Audit trail" />
 */
export function LedgerLink({
  filter,
  cognateId,
  runId,
  className,
  label = 'View in Ledger',
  showIcon = true,
  size = 'sm',
}: LedgerLinkProps): JSX.Element {
  const url = buildLedgerUrl(filter, cognateId, runId);

  return (
    <Link
      to={url}
      className={cn(
        'inline-flex items-center gap-1 text-muted-foreground hover:text-symtex-primary transition-colors',
        size === 'sm' ? 'text-sm' : 'text-base',
        className
      )}
    >
      {showIcon && (
        <FileText className={cn(size === 'sm' ? 'w-4 h-4' : 'w-5 h-5')} />
      )}
      {label}
    </Link>
  );
}

export default LedgerLink;
