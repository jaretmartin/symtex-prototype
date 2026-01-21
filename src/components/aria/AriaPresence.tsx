/**
 * AriaPresence Component
 *
 * Floating assistant indicator for Aria, the meta-cognate.
 * Fixed position button that shows Aria's status and opens the chat interface.
 *
 * Features:
 * - Animated indicator showing listening/thinking states
 * - Pulse animation when Aria has suggestions
 * - Status indicator (available/busy)
 * - Tooltip on hover
 * - Keyboard accessible
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import clsx from 'clsx';

// ============================================================================
// Types
// ============================================================================

export type AriaStatus = 'available' | 'busy' | 'thinking';

export interface AriaPresenceProps {
  /** Callback when the presence button is clicked to open chat */
  onOpenChat: () => void;
  /** Whether Aria has pending notifications or suggestions */
  hasNotifications?: boolean;
  /** Current status of Aria */
  status?: AriaStatus;
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Constants
// ============================================================================

const STATUS_CONFIG: Record<AriaStatus, { label: string; ringColor: string }> = {
  available: {
    label: 'Available',
    ringColor: 'ring-emerald-400/50',
  },
  busy: {
    label: 'Busy',
    ringColor: 'ring-amber-400/50',
  },
  thinking: {
    label: 'Thinking...',
    ringColor: 'ring-violet-400/50',
  },
};

// ============================================================================
// Main Component
// ============================================================================

export function AriaPresence({
  onOpenChat,
  hasNotifications = false,
  status = 'available',
  className,
}: AriaPresenceProps): JSX.Element {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const config = STATUS_CONFIG[status];

  // Show tooltip after a delay on hover
  useEffect(() => {
    if (isHovered) {
      tooltipTimeoutRef.current = setTimeout(() => {
        setShowTooltip(true);
      }, 500);
    } else {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
      setShowTooltip(false);
    }

    return (): void => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
    };
  }, [isHovered]);

  const handleClick = useCallback((): void => {
    onOpenChat();
  }, [onOpenChat]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>): void => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onOpenChat();
      }
    },
    [onOpenChat]
  );

  return (
    <div
      className={clsx(
        'fixed bottom-24 right-6 z-50',
        'flex flex-col items-end gap-2',
        className
      )}
    >
      {/* Tooltip */}
      <div
        role="tooltip"
        className={clsx(
          'absolute bottom-full right-0 mb-2',
          'px-3 py-1.5 rounded-lg',
          'bg-card/95 backdrop-blur-sm border border-border/50',
          'text-sm text-foreground whitespace-nowrap',
          'shadow-lg shadow-black/20',
          'transition-all duration-200',
          showTooltip
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-1 pointer-events-none'
        )}
      >
        Chat with Aria
        {/* Tooltip arrow */}
        <div
          className="absolute -bottom-1 right-5 w-2 h-2 bg-card/95 border-r border-b border-border/50 transform rotate-45"
          aria-hidden="true"
        />
      </div>

      {/* Main presence button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={(): void => setIsHovered(true)}
        onMouseLeave={(): void => setIsHovered(false)}
        onFocus={(): void => setIsHovered(true)}
        onBlur={(): void => setIsHovered(false)}
        className={clsx(
          'relative group',
          'w-14 h-14 rounded-full',
          'flex items-center justify-center',
          'bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600',
          'shadow-lg shadow-violet-500/30',
          'ring-2 ring-offset-2 ring-offset-slate-900',
          config.ringColor,
          'transition-all duration-300 ease-out',
          'hover:scale-110 hover:shadow-xl hover:shadow-violet-500/40',
          'focus:outline-none focus:ring-4',
          // Subtle outer glow for Aria's distinct identity
          'before:absolute before:inset-0 before:rounded-full',
          'before:bg-gradient-to-br before:from-violet-400 before:to-fuchsia-400',
          'before:opacity-0 before:blur-xl before:transition-opacity before:duration-300',
          'hover:before:opacity-40'
        )}
        aria-label={`Chat with Aria - ${config.label}`}
        aria-describedby="aria-status"
      >
        {/* Thinking animation - orbiting rings */}
        {status === 'thinking' && (
          <>
            <span
              className={clsx(
                'absolute inset-0 rounded-full',
                'border-2 border-violet-400/30',
                'animate-ping'
              )}
              aria-hidden="true"
            />
            <span
              className={clsx(
                'absolute -inset-1 rounded-full',
                'border border-dashed border-violet-300/40',
                'animate-spin'
              )}
              style={{ animationDuration: '3s' }}
              aria-hidden="true"
            />
          </>
        )}

        {/* Notification pulse */}
        {hasNotifications && status !== 'thinking' && (
          <span
            className={clsx(
              'absolute inset-0 rounded-full',
              'bg-gradient-to-br from-violet-500 to-fuchsia-500',
              'animate-ping opacity-50'
            )}
            aria-hidden="true"
          />
        )}

        {/* Icon container */}
        <span
          className={clsx(
            'relative z-10',
            'text-white',
            'transition-transform duration-300',
            isHovered && 'scale-110',
            status === 'thinking' && 'animate-pulse'
          )}
        >
          <Sparkles className="w-6 h-6" aria-hidden="true" />
        </span>

        {/* Notification badge */}
        {hasNotifications && (
          <span
            className={clsx(
              'absolute -top-1 -right-1',
              'w-4 h-4 rounded-full',
              'bg-rose-500 border-2 border-border',
              'flex items-center justify-center'
            )}
            aria-label="Has suggestions"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
          </span>
        )}

        {/* Status indicator dot */}
        <span
          className={clsx(
            'absolute bottom-0 right-0',
            'w-4 h-4 rounded-full',
            'border-2 border-border',
            'transition-colors duration-200',
            status === 'available' && 'bg-emerald-400',
            status === 'busy' && 'bg-amber-400',
            status === 'thinking' && 'bg-violet-400 animate-pulse'
          )}
          aria-hidden="true"
        />
      </button>

      {/* Hidden status text for screen readers */}
      <span id="aria-status" className="sr-only">
        Aria is {config.label.toLowerCase()}
        {hasNotifications && ', has suggestions for you'}
      </span>
    </div>
  );
}

export default AriaPresence;
