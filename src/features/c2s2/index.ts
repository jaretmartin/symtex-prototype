/**
 * C2S2 (Code-to-S1) Feature
 *
 * Transforms traditional code into S1/Symtex Script - a more
 * deterministic, auditable format for AI operations.
 *
 * Key Components:
 * - C2S2Dashboard: Main dashboard with stats, recent transformations, quick actions
 * - C2S2Explorer: Side-by-side code browser with line mapping
 * - C2S2Planner: Step-by-step transformation planner with confidence scores
 * - useC2S2Store: Zustand store for projects, transformations, and UI state
 */

// Main components
export { default as C2S2Dashboard } from './C2S2Dashboard';
export { default as C2S2Explorer } from './C2S2Explorer';
export { default as C2S2Planner } from './C2S2Planner';
export { C2S2Preview } from './C2S2Preview';

// Store and types
export {
  useC2S2Store,
  type SourceLanguage,
  type ProjectStatus,
  type TransformationStatus,
  type C2S2Project,
  type C2S2Transformation,
  type C2S2Stats,
} from './c2s2-store';

// Explorer types
export type {
  C2S2ExplorerProps,
  FileNode,
  CodeMapping,
  TransformationSection,
} from './C2S2Explorer';

// Planner types
export type {
  C2S2PlannerProps,
  TransformationStep,
  StepStatus,
} from './C2S2Planner';

// Preview types
export type {
  C2S2PreviewProps,
  TransformationMetrics,
} from './C2S2Preview';
