/**
 * Error Fallback Component
 *
 * Displayed when an error is caught by ErrorBoundary
 */

import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorFallbackProps {
  error: Error | null;
  onReset?: () => void;
}

export function ErrorFallback({ error, onReset }: ErrorFallbackProps): JSX.Element {
  const handleRefresh = (): void => {
    if (onReset) {
      onReset();
    } else {
      window.location.reload();
    }
  };

  const handleGoHome = (): void => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-error/10 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-error" />
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Something went wrong
        </h2>

        {/* Description */}
        <p className="text-muted-foreground mb-6">
          We encountered an unexpected error. Please try refreshing the page or
          go back to the home page.
        </p>

        {/* Error details (temporarily enabled in all environments for debugging) */}
        {error && (
          <div className="mb-6 p-4 bg-card/50 rounded-lg text-left overflow-auto max-h-48">
            <p className="text-sm font-mono text-red-400 break-all">
              {error.message}
            </p>
            <p className="text-xs font-mono text-muted-foreground mt-2 break-all">
              {error.stack}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-symtex-primary text-white rounded-xl font-medium hover:bg-symtex-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-symtex-primary focus-visible:ring-offset-2 focus-visible:ring-offset-symtex-dark"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>

          <button
            onClick={handleGoHome}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-muted text-white rounded-xl font-medium hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-muted focus-visible:ring-offset-2 focus-visible:ring-offset-symtex-dark"
          >
            <Home className="w-4 h-4" />
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
