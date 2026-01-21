/**
 * Cognate Events Hook
 *
 * Manages the 8 trigger events that update Cognate states and show notifications.
 * Includes rate limiting for toasts and animations to prevent notification fatigue.
 *
 * Event Types:
 * - plan_created: Dock update + subtle ping
 * - simulation_finished: Needs Review badge + diff CTA
 * - approval_requested: Inbox item + Dock badge
 * - policy_blocked: Blocked state + "Why" card
 * - run_started: Progress ring + cost meter
 * - run_finished: Completion cue + "Compile Pattern" CTA
 * - budget_threshold: Warning chip + pause suggestion
 * - evidence_attached: Citation badge + audit event
 */

import { useCallback, useRef, useState, useEffect, useMemo } from 'react';
import { useUIStore } from '@/store/useUIStore';
import { useCognateStore } from '@/store/useCognateStore';

// ============================================================================
// Types
// ============================================================================

/**
 * The 8 Cognate event types that drive state changes and notifications
 */
export type CognateEventType =
  | 'plan_created'
  | 'simulation_finished'
  | 'approval_requested'
  | 'policy_blocked'
  | 'run_started'
  | 'run_finished'
  | 'budget_threshold'
  | 'evidence_attached';

/**
 * Event payload structure
 */
export interface CognateEvent {
  id: string;
  type: CognateEventType;
  cognateId: string;
  timestamp: Date;
  payload: Record<string, unknown>;
}

/**
 * Internal event input (without auto-generated fields)
 */
type CognateEventInput = Omit<CognateEvent, 'id' | 'timestamp'>;

/**
 * Toast variant mapping for event types
 */
type ToastVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

/**
 * Event metadata for handling
 */
interface EventMeta {
  toastTitle: string;
  toastDescription?: string;
  toastVariant: ToastVariant;
  cognateStatus?: string;
  triggerAnimation?: boolean;
}

/**
 * Return type for the useCognateEvents hook
 */
export interface UseCognateEventsReturn {
  /** Dispatch a Cognate event */
  dispatchEvent: (event: CognateEventInput) => CognateEvent;

  /** Recent events (most recent first, limited to last 50) */
  recentEvents: CognateEvent[];

  /** Whether a toast can be shown (respects rate limit) */
  canShowToast: boolean;

  /** Whether an animation can be shown (respects rate limit) */
  canShowAnimation: boolean;

  /** Time until next toast allowed (ms), 0 if allowed now */
  timeUntilNextToast: number;

  /** Time until next animation allowed (ms), 0 if allowed now */
  timeUntilNextAnimation: number;

  /** Clear all stored events */
  clearEvents: () => void;

  /** Get events for a specific Cognate */
  getEventsForCognate: (cognateId: string) => CognateEvent[];

  /** Get events by type */
  getEventsByType: (type: CognateEventType) => CognateEvent[];

  /** Check if user prefers reduced motion */
  prefersReducedMotion: boolean;
}

// ============================================================================
// Constants
// ============================================================================

/** Maximum time between toasts (30 seconds) */
const TOAST_RATE_LIMIT_MS = 30000;

/** Maximum time between ambient animations (10 seconds) */
const ANIMATION_RATE_LIMIT_MS = 10000;

/** Maximum number of events to keep in history */
const MAX_EVENTS_HISTORY = 50;

/** Event type to metadata mapping */
const EVENT_META: Record<CognateEventType, EventMeta> = {
  plan_created: {
    toastTitle: 'Plan created',
    toastDescription: 'Cognate has created a new execution plan',
    toastVariant: 'info',
    cognateStatus: 'planning',
    triggerAnimation: true,
  },
  simulation_finished: {
    toastTitle: 'Simulation complete',
    toastDescription: 'Review needed before execution',
    toastVariant: 'warning',
    cognateStatus: 'needs_review',
    triggerAnimation: true,
  },
  approval_requested: {
    toastTitle: 'Approval requested',
    toastDescription: 'Action requires your approval',
    toastVariant: 'warning',
    cognateStatus: 'waiting_approval',
    triggerAnimation: true,
  },
  policy_blocked: {
    toastTitle: 'Policy blocked run',
    toastDescription: 'Action was blocked by a policy rule',
    toastVariant: 'error',
    cognateStatus: 'blocked',
    triggerAnimation: false,
  },
  run_started: {
    toastTitle: 'Run started',
    toastDescription: 'Cognate is now executing',
    toastVariant: 'info',
    cognateStatus: 'running',
    triggerAnimation: true,
  },
  run_finished: {
    toastTitle: 'Run completed',
    toastDescription: 'Execution finished successfully',
    toastVariant: 'success',
    cognateStatus: 'completed',
    triggerAnimation: true,
  },
  budget_threshold: {
    toastTitle: 'Budget threshold reached',
    toastDescription: 'Consider pausing to review costs',
    toastVariant: 'warning',
    triggerAnimation: false,
  },
  evidence_attached: {
    toastTitle: 'Evidence attached',
    toastDescription: 'Citation added to audit trail',
    toastVariant: 'info',
    triggerAnimation: false,
  },
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Generate a unique event ID
 */
function generateEventId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Check if the user prefers reduced motion
 */
function checkReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ============================================================================
// Hook Implementation
// ============================================================================

/**
 * Hook for managing Cognate events with rate-limited notifications
 *
 * @example
 * ```tsx
 * const { dispatchEvent, recentEvents, canShowToast } = useCognateEvents();
 *
 * // Dispatch an event
 * dispatchEvent({
 *   type: 'run_started',
 *   cognateId: 'cog-123',
 *   payload: { missionId: 'mission-456' }
 * });
 * ```
 */
export function useCognateEvents(): UseCognateEventsReturn {
  // Store hooks
  const addToast = useUIStore((state) => state.addToast);
  const updateInstance = useCognateStore((state) => state.updateInstance);

  // Event history state
  const [events, setEvents] = useState<CognateEvent[]>([]);

  // Rate limiting refs
  const lastToastTimeRef = useRef<number>(0);
  const lastAnimationTimeRef = useRef<number>(0);

  // Rate limit state for reactive updates
  const [canShowToast, setCanShowToast] = useState(true);
  const [canShowAnimation, setCanShowAnimation] = useState(true);
  const [timeUntilNextToast, setTimeUntilNextToast] = useState(0);
  const [timeUntilNextAnimation, setTimeUntilNextAnimation] = useState(0);

  // Reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(checkReducedMotion);

  // Update reduced motion preference on change
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent): void => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Update rate limit state periodically
  useEffect(() => {
    const updateRateLimits = (): void => {
      const now = Date.now();

      const toastTimeSince = now - lastToastTimeRef.current;
      const animationTimeSince = now - lastAnimationTimeRef.current;

      const toastAllowed = toastTimeSince >= TOAST_RATE_LIMIT_MS;
      const animationAllowed = animationTimeSince >= ANIMATION_RATE_LIMIT_MS;

      setCanShowToast(toastAllowed);
      setCanShowAnimation(animationAllowed);
      setTimeUntilNextToast(toastAllowed ? 0 : TOAST_RATE_LIMIT_MS - toastTimeSince);
      setTimeUntilNextAnimation(
        animationAllowed ? 0 : ANIMATION_RATE_LIMIT_MS - animationTimeSince
      );
    };

    // Initial update
    updateRateLimits();

    // Update every second
    const interval = setInterval(updateRateLimits, 1000);
    return () => clearInterval(interval);
  }, []);

  /**
   * Show a toast notification if rate limit allows
   */
  const showToastIfAllowed = useCallback(
    (title: string, variant: ToastVariant, description?: string): boolean => {
      const now = Date.now();
      const timeSinceLastToast = now - lastToastTimeRef.current;

      if (timeSinceLastToast < TOAST_RATE_LIMIT_MS) {
        return false;
      }

      lastToastTimeRef.current = now;
      addToast({
        title,
        description,
        variant,
        duration: 4000,
      });

      return true;
    },
    [addToast]
  );

  /**
   * Check if animation is allowed and update tracking
   */
  const checkAnimationAllowed = useCallback((): boolean => {
    if (prefersReducedMotion) return false;

    const now = Date.now();
    const timeSinceLastAnimation = now - lastAnimationTimeRef.current;

    if (timeSinceLastAnimation < ANIMATION_RATE_LIMIT_MS) {
      return false;
    }

    lastAnimationTimeRef.current = now;
    return true;
  }, [prefersReducedMotion]);

  /**
   * Handle event-specific side effects
   */
  const handleEventSideEffects = useCallback(
    (event: CognateEvent): void => {
      const meta = EVENT_META[event.type];

      // Update Cognate instance status if applicable
      if (meta.cognateStatus && event.cognateId) {
        // Update instance status in the store
        // Map event states to valid CognateInstanceStatus values
        // Valid statuses: 'idle' | 'running' | 'paused' | 'completed' | 'failed' | 'busy'
        const statusMap: Record<string, 'idle' | 'running' | 'paused' | 'completed' | 'failed' | 'busy'> = {
          planning: 'busy',
          needs_review: 'idle',
          waiting_approval: 'idle',
          blocked: 'failed',
          running: 'running',
          completed: 'completed',
        };

        const mappedStatus = statusMap[meta.cognateStatus];
        if (mappedStatus) {
          updateInstance(event.cognateId, {
            status: mappedStatus,
          });
        }
      }

      // Show toast if allowed
      showToastIfAllowed(meta.toastTitle, meta.toastVariant, meta.toastDescription);

      // Handle animation triggers (consumed by UI components via canShowAnimation)
      if (meta.triggerAnimation) {
        checkAnimationAllowed();
      }

      // Handle event-specific actions
      switch (event.type) {
        case 'run_started':
          // Additional handling for run started could include:
          // - Starting a progress tracking interval
          // - Initializing cost accumulation
          break;

        case 'run_finished':
          // Additional handling for run finished could include:
          // - Triggering pattern compilation UI
          // - Updating execution statistics
          break;

        case 'budget_threshold':
          // Additional handling for budget threshold could include:
          // - Auto-pausing if configured
          // - Sending alerts to other channels
          break;

        case 'evidence_attached':
          // Additional handling for evidence could include:
          // - Updating audit trail UI
          // - Refreshing ledger view
          break;

        default:
          // Other events are handled by their metadata
          break;
      }
    },
    [showToastIfAllowed, checkAnimationAllowed, updateInstance]
  );

  /**
   * Dispatch a new Cognate event
   */
  const dispatchEvent = useCallback(
    (input: CognateEventInput): CognateEvent => {
      const event: CognateEvent = {
        ...input,
        id: generateEventId(),
        timestamp: new Date(),
      };

      // Add to event history (limited to MAX_EVENTS_HISTORY)
      setEvents((prev) => {
        const updated = [event, ...prev];
        return updated.slice(0, MAX_EVENTS_HISTORY);
      });

      // Handle side effects (notifications, state updates)
      handleEventSideEffects(event);

      return event;
    },
    [handleEventSideEffects]
  );

  /**
   * Clear all stored events
   */
  const clearEvents = useCallback((): void => {
    setEvents([]);
  }, []);

  /**
   * Get events for a specific Cognate
   */
  const getEventsForCognate = useCallback(
    (cognateId: string): CognateEvent[] => {
      return events.filter((e) => e.cognateId === cognateId);
    },
    [events]
  );

  /**
   * Get events by type
   */
  const getEventsByType = useCallback(
    (type: CognateEventType): CognateEvent[] => {
      return events.filter((e) => e.type === type);
    },
    [events]
  );

  // Memoized return value
  return useMemo(
    () => ({
      dispatchEvent,
      recentEvents: events,
      canShowToast,
      canShowAnimation,
      timeUntilNextToast,
      timeUntilNextAnimation,
      clearEvents,
      getEventsForCognate,
      getEventsByType,
      prefersReducedMotion,
    }),
    [
      dispatchEvent,
      events,
      canShowToast,
      canShowAnimation,
      timeUntilNextToast,
      timeUntilNextAnimation,
      clearEvents,
      getEventsForCognate,
      getEventsByType,
      prefersReducedMotion,
    ]
  );
}

// ============================================================================
// Utility Hooks
// ============================================================================

/**
 * Hook to subscribe to events for a specific Cognate
 */
export function useCognateEventSubscription(
  cognateId: string
): Pick<UseCognateEventsReturn, 'dispatchEvent'> & { events: CognateEvent[] } {
  const { dispatchEvent, getEventsForCognate } = useCognateEvents();
  const events = getEventsForCognate(cognateId);

  return { dispatchEvent, events };
}

/**
 * Hook to get the most recent event of a specific type
 */
export function useLatestCognateEvent(type: CognateEventType): CognateEvent | null {
  const { getEventsByType } = useCognateEvents();
  const events = getEventsByType(type);
  return events[0] ?? null;
}

export { useCognateEvents as default };
