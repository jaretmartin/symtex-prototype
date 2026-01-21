/**
 * Custom Hooks
 *
 * Reusable React hooks for state management and UI behavior.
 */

export { useTreeExpansion } from './useTreeExpansion';
export { useCommandPalette, CATEGORY_ORDER } from './useCommandPalette';
export { useTheme, initializeTheme } from './useTheme';
export type { Theme } from './useTheme';

// Shared utility hooks
export { useDebounce } from './useDebounce';
export { useLocalStorage } from './useLocalStorage';
export { useKeyboardShortcut, useCrossPlatformShortcut } from './useKeyboardShortcut';

// Keyboard navigation hooks
export { useFocusTrap } from './useFocusTrap';
export { useRovingTabIndex } from './useRovingTabIndex';

// Voice command hooks
export { useVoiceCommand } from './useVoiceCommand';
export { useVoiceCommands } from './useVoiceCommands';

// Accessibility hooks
export { useFocusOnMount } from './useFocusOnMount';

// Cognate event hooks
export {
  useCognateEvents,
  useCognateEventSubscription,
  useLatestCognateEvent,
} from './useCognateEvents';
export type {
  CognateEvent,
  CognateEventType,
  UseCognateEventsReturn,
} from './useCognateEvents';
