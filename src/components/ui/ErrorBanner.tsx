/**
 * ErrorBanner Component
 *
 * A flexible error/warning/info banner component for displaying
 * important messages with optional actions and collapsible details.
 */

import { useState } from 'react';
import {
  XCircle,
  AlertTriangle,
  Info,
  X,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button/Button';

export interface ErrorBannerProps {
  /** Optional title for the banner */
  title?: string;
  /** Main message to display (required) */
  message: string;

  /** Visual style variant */
  variant?: 'error' | 'warning' | 'info';

  /** Callback when retry button is clicked */
  onRetry?: () => void;
  /** Callback when dismiss button is clicked */
  onDismiss?: () => void;
  /** Custom label for the retry button */
  retryLabel?: string;
  /** Show loading state on retry button */
  isRetrying?: boolean;

  /** Optional error code to display */
  errorCode?: string;
  /** Optional collapsible details section */
  details?: string;
  /** Optional help link URL */
  helpLink?: string;
  /** Custom label for help link */
  helpLinkLabel?: string;

  /** Additional CSS classes */
  className?: string;
  /** Whether banner should take full width */
  fullWidth?: boolean;
}

const variantStyles = {
  error: {
    container:
      'bg-red-50 border-red-200 text-red-800 dark:bg-red-950/50 dark:border-red-800 dark:text-red-200',
    icon: 'text-red-600 dark:text-red-400',
    details:
      'bg-red-100/50 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    code: 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400',
  },
  warning: {
    container:
      'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/50 dark:border-amber-800 dark:text-amber-200',
    icon: 'text-amber-600 dark:text-amber-400',
    details:
      'bg-amber-100/50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
    code: 'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400',
  },
  info: {
    container:
      'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/50 dark:border-blue-800 dark:text-blue-200',
    icon: 'text-blue-600 dark:text-blue-400',
    details:
      'bg-blue-100/50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    code: 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400',
  },
};

const icons = {
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

/**
 * ErrorBanner displays important messages with contextual styling and actions.
 *
 * @example
 * ```tsx
 * <ErrorBanner
 *   title="Connection Failed"
 *   message="Unable to connect to the server. Please check your connection."
 *   variant="error"
 *   errorCode="CONN_ERR_001"
 *   onRetry={() => refetch()}
 *   onDismiss={() => setError(null)}
 *   helpLink="/help/connection-issues"
 * />
 * ```
 */
export function ErrorBanner({
  title,
  message,
  variant = 'error',
  onRetry,
  onDismiss,
  retryLabel = 'Try Again',
  isRetrying = false,
  errorCode,
  details,
  helpLink,
  helpLinkLabel = 'Learn more',
  className,
  fullWidth = true,
}: ErrorBannerProps): JSX.Element {
  const [showDetails, setShowDetails] = useState(false);

  const styles = variantStyles[variant];
  const Icon = icons[variant];

  const toggleDetails = (): void => {
    setShowDetails((prev) => !prev);
  };

  return (
    <div
      role="alert"
      aria-live={variant === 'error' ? 'assertive' : 'polite'}
      className={cn(
        'relative rounded-lg border p-4',
        styles.container,
        fullWidth ? 'w-full' : 'w-auto',
        className
      )}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <Icon
          className={cn('h-5 w-5 flex-shrink-0 mt-0.5', styles.icon)}
          aria-hidden="true"
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header row with title and error code */}
          <div className="flex items-center gap-2 flex-wrap">
            {title && (
              <h3 className="font-semibold text-sm">{title}</h3>
            )}
            {errorCode && (
              <span
                className={cn(
                  'text-xs font-mono px-1.5 py-0.5 rounded',
                  styles.code
                )}
              >
                {errorCode}
              </span>
            )}
          </div>

          {/* Message */}
          <p className={cn('text-sm', title && 'mt-1')}>{message}</p>

          {/* Collapsible details */}
          {details && (
            <div className="mt-2">
              <button
                type="button"
                onClick={toggleDetails}
                className="inline-flex items-center gap-1 text-xs font-medium hover:underline focus:outline-none focus-visible:underline"
                aria-expanded={showDetails}
              >
                {showDetails ? (
                  <>
                    <ChevronUp className="h-3 w-3" aria-hidden="true" />
                    Hide details
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3" aria-hidden="true" />
                    Show details
                  </>
                )}
              </button>

              {showDetails && (
                <pre
                  className={cn(
                    'mt-2 p-3 rounded text-xs font-mono overflow-x-auto whitespace-pre-wrap break-words',
                    styles.details
                  )}
                >
                  {details}
                </pre>
              )}
            </div>
          )}

          {/* Actions row */}
          {(onRetry || helpLink) && (
            <div className="flex items-center gap-3 mt-3">
              {onRetry && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRetry}
                  disabled={isRetrying}
                  isLoading={isRetrying}
                  leftIcon={
                    !isRetrying ? (
                      <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : undefined
                  }
                  className="h-7 px-2 text-xs"
                >
                  {retryLabel}
                </Button>
              )}

              {helpLink && (
                <a
                  href={helpLink}
                  className="inline-flex items-center gap-1 text-xs font-medium hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {helpLinkLabel}
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Dismiss button */}
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="flex-shrink-0 p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-current"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}

ErrorBanner.displayName = 'ErrorBanner';
