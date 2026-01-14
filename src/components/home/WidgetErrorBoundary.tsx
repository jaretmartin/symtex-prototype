import { Component, type ReactNode, type ErrorInfo } from 'react'
import { AlertTriangle, RefreshCcw } from 'lucide-react'
import clsx from 'clsx'

interface WidgetErrorBoundaryProps {
  /** Child components to render */
  children: ReactNode
  /** Widget name for error display */
  widgetName?: string
  /** Custom fallback component */
  fallback?: ReactNode
  /** Callback when error occurs */
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  /** Additional className for the error display */
  className?: string
}

interface WidgetErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * WidgetErrorBoundary - Error boundary component for dashboard widgets
 *
 * Features:
 * - Catches errors per widget without crashing the dashboard
 * - Displays user-friendly error message
 * - Retry button to attempt recovery
 * - Optional error callback for logging
 */
export default class WidgetErrorBoundary extends Component<
  WidgetErrorBoundaryProps,
  WidgetErrorBoundaryState
> {
  constructor(props: WidgetErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): WidgetErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console in development
    console.error('Widget Error:', error, errorInfo)

    // Call optional error callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null })
  }

  render(): ReactNode {
    const { hasError, error } = this.state
    const { children, widgetName, fallback, className } = this.props

    if (hasError) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback
      }

      // Default error display
      return (
        <div
          className={clsx(
            'bg-symtex-card rounded-xl border border-red-500/30 overflow-hidden',
            className
          )}
        >
          <div className="p-6 flex flex-col items-center justify-center min-h-[200px]">
            <div className="p-3 rounded-full bg-red-500/20 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {widgetName ? `${widgetName} Error` : 'Something went wrong'}
            </h3>
            <p className="text-sm text-slate-400 text-center mb-4 max-w-xs">
              {error?.message || 'An unexpected error occurred while loading this widget.'}
            </p>
            <button
              onClick={this.handleRetry}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium transition-colors"
            >
              <RefreshCcw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      )
    }

    return children
  }
}

interface WidgetErrorDisplayProps {
  /** Error message to display */
  message?: string
  /** Widget name for error display */
  widgetName?: string
  /** Callback for retry action */
  onRetry?: () => void
  /** Additional className */
  className?: string
}

/**
 * WidgetErrorDisplay - Standalone error display component
 *
 * Use this for async errors that aren't caught by error boundaries
 */
export function WidgetErrorDisplay({
  message = 'Failed to load data',
  widgetName,
  onRetry,
  className
}: WidgetErrorDisplayProps): JSX.Element {
  return (
    <div
      className={clsx(
        'bg-symtex-card rounded-xl border border-red-500/30 overflow-hidden',
        className
      )}
    >
      <div className="p-6 flex flex-col items-center justify-center min-h-[200px]">
        <div className="p-3 rounded-full bg-red-500/20 mb-4">
          <AlertTriangle className="w-6 h-6 text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">
          {widgetName ? `${widgetName} Error` : 'Unable to Load'}
        </h3>
        <p className="text-sm text-slate-400 text-center mb-4 max-w-xs">
          {message}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium transition-colors"
          >
            <RefreshCcw className="w-4 h-4" />
            Try Again
          </button>
        )}
      </div>
    </div>
  )
}
