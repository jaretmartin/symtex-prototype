import { Navigate } from 'react-router-dom'

/**
 * Activity Page - DEPRECATED / MERGED INTO HOME
 *
 * DECISION: This page has been merged into the Home dashboard.
 *
 * RATIONALE:
 * 1. The Activity link in navigation was essentially pointing back to Home,
 *    creating a confusing circular navigation pattern for users.
 *
 * 2. The valuable content from Activity - specifically the stats section
 *    showing conversations, cognate actions, and automation success rates -
 *    has been moved to the ActivityStats component which is now displayed
 *    prominently on the Home page.
 *
 * 3. Merging reduces navigation complexity. Users now have a single dashboard
 *    view that shows both operational overview AND activity metrics.
 *
 * 4. The Home page is the natural landing spot for users, so having activity
 *    data there means fewer clicks to access important information.
 *
 * WHY KEEP THIS FILE:
 * - Maintains backward compatibility with any bookmarks or deep links
 * - Redirects cleanly to Home instead of showing a 404
 * - Documents the merge decision for future developers
 *
 * WHAT WAS MIGRATED:
 * - ActivityStats component (conversations, cognate actions, automation success)
 * - Recent activity timeline
 * - Activity trends/charts (when implemented)
 *
 * The original Activity page design (especially the top stats section) was
 * well-received and has been preserved in the ActivityStats component at:
 * /src/components/activity/ActivityStats.tsx
 */
export default function Activity() {
  // Redirect to Home where activity data is now displayed
  return <Navigate to="/" replace />
}
