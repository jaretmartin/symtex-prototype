/**
 * Aria Components
 *
 * Phase 2.8.2 - Aria (Meta-Cognate) Presence Components
 *
 * Aria is the meta-cognate - an always-present orchestrator that routes
 * requests to appropriate Cognates. These components provide the UI
 * for interacting with Aria throughout the application.
 *
 * Components:
 * - AriaPresence: Floating assistant indicator (bottom-right)
 * - AriaChat: Primary chat interface for Aria
 * - AriaRoutingIndicator: Visual showing routing to Cognates
 * - AriaQuickActions: Contextual quick action suggestions
 */

// Main presence component
export { AriaPresence, default as AriaPresenceDefault } from './AriaPresence';
export type { AriaPresenceProps, AriaStatus } from './AriaPresence';

// Chat interface
export { AriaChat, default as AriaChatDefault } from './AriaChat';
export type { AriaChatProps } from './AriaChat';

// Routing visualization
export {
  AriaRoutingIndicator,
  default as AriaRoutingIndicatorDefault,
} from './AriaRoutingIndicator';
export type {
  AriaRoutingIndicatorProps,
  RoutingState,
  RoutingStatus,
} from './AriaRoutingIndicator';

// Quick actions
export {
  AriaQuickActions,
  DEFAULT_QUICK_ACTIONS,
  useQuickActions,
  default as AriaQuickActionsDefault,
} from './AriaQuickActions';
export type {
  AriaQuickActionsProps,
  QuickAction,
  QuickActionIcon,
  UseQuickActionsOptions,
} from './AriaQuickActions';
