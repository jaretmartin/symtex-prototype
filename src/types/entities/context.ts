/**
 * Navigation context types
 *
 * Defines the current navigation state and breadcrumb trail
 * for tracking user position within the space hierarchy.
 */

/**
 * Types of spaces that can be navigated to
 */
export type SpaceType = 'personal' | 'domain' | 'project' | 'mission';

/**
 * A single item in the breadcrumb navigation trail
 */
export interface BreadcrumbItem {
  /** The type of space this breadcrumb represents */
  type: SpaceType;
  /** Unique identifier for this breadcrumb's target */
  id: string;
  /** Display name for the breadcrumb */
  name: string;
  /** Optional icon identifier for visual representation */
  icon?: string;
}

/**
 * The current navigation context state
 */
export interface ContextState {
  /** The type of space currently being viewed */
  currentSpaceType: SpaceType;
  /** The ID of the currently viewed space */
  currentId: string;
  /** The full breadcrumb trail from root to current location */
  breadcrumb: BreadcrumbItem[];
}

/**
 * Navigation action for context changes
 */
export interface NavigationAction {
  /** The target space type to navigate to */
  targetType: SpaceType;
  /** The target space ID */
  targetId: string;
  /** Optional flag to replace current history entry */
  replace?: boolean;
}

/**
 * Context metadata for enhanced navigation features
 */
export interface ContextMetadata {
  /** Timestamp of last navigation */
  lastNavigatedAt: string;
  /** Recent navigation history (for back/forward) */
  recentHistory: BreadcrumbItem[];
  /** Favorite/pinned locations */
  pinnedLocations: BreadcrumbItem[];
}
