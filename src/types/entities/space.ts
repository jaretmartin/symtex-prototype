/**
 * Space hierarchy types
 *
 * Defines the hierarchical structure of spaces in Symtex:
 * PersonalSpace > DomainSpace > Project > Mission
 */

import type { DNAOverview } from './dna';

/**
 * Intelligence level representing AI capability maturity (1-4)
 */
export type IntelligenceLevel = 1 | 2 | 3 | 4;

/**
 * Autonomy level for AI decision-making authority (1-4)
 */
export type AutonomyLevel = 1 | 2 | 3 | 4;

/**
 * Project status indicating current lifecycle stage
 */
export type ProjectStatus = 'active' | 'paused' | 'completed';

/**
 * Mission status for tracking execution state
 */
export type SpaceMissionStatus = 'queued' | 'running' | 'completed' | 'failed';

/**
 * Communication settings for AI interactions
 */
export interface CommunicationSettings {
  /** The tone of AI responses (e.g., 'formal', 'casual', 'technical') */
  tone: string;
  /** How detailed AI responses should be (e.g., 'concise', 'detailed', 'comprehensive') */
  verbosity: string;
  /** How proactively the AI should suggest actions (e.g., 'reactive', 'balanced', 'proactive') */
  proactivity: string;
}

/**
 * Autonomy configuration for AI decision-making
 */
export interface AutonomySettings {
  /** The level of autonomous decision-making (1=minimal, 4=full) */
  level: AutonomyLevel;
  /** Whether the AI can auto-approve certain actions without user confirmation */
  autoApprove: boolean;
}

/**
 * Configuration settings that apply to a space and can be inherited
 */
export interface SpaceSettings {
  /** Communication preferences for AI interactions */
  communication: CommunicationSettings;
  /** Autonomy configuration for AI decision-making */
  autonomy: AutonomySettings;
  /** Custom rules that govern AI behavior in this space */
  rules: string[];
  /** Whether to inherit settings from the parent space */
  inheritFromParent: boolean;
}

/**
 * Metrics tracking space activity and performance
 */
export interface SpaceMetrics {
  /** Total number of missions in this space */
  totalMissions: number;
  /** Number of successfully completed missions */
  completedMissions: number;
  /** Number of missions that failed */
  failedMissions: number;
  /** Average mission completion time in milliseconds */
  avgCompletionTime?: number;
  /** Last activity timestamp */
  lastActivityAt?: string;
}

/**
 * The root-level personal space for a user
 */
export interface PersonalSpace {
  /** Unique identifier for the personal space */
  id: string;
  /** Display name for the personal space */
  name: string;
  /** Current intelligence maturity level (1-4) */
  intelligenceLevel: IntelligenceLevel;
  /** Total experience points accumulated */
  totalXP: number;
  /** Semantic DNA configuration and scores */
  semanticDNA: DNAOverview;
  /** Default settings for this space */
  defaultSettings: SpaceSettings;
  /** Performance and activity metrics */
  metrics: SpaceMetrics;
}

/**
 * A domain space that categorizes projects within a personal space
 */
export interface DomainSpace {
  /** Unique identifier for the domain space */
  id: string;
  /** Parent personal space ID (always 'personal' for direct children) */
  parentId: 'personal';
  /** Display name for the domain */
  name: string;
  /** Icon identifier for visual representation */
  icon: string;
  /** Color code for visual theming */
  color: string;
  /** Optional settings that override parent defaults */
  settingsOverrides?: Partial<SpaceSettings>;
  /** IDs of cognates assigned to this domain */
  assignedCognates: string[];
}

/**
 * A project within a domain space
 */
export interface Project {
  /** Unique identifier for the project */
  id: string;
  /** Parent domain space ID */
  domainId: string;
  /** Project name */
  name: string;
  /** Detailed description of the project */
  description: string;
  /** Current project status */
  status: ProjectStatus;
  /** Completion progress as a percentage (0-100) */
  progress: number;
  /** Optional timeline information */
  timeline?: ProjectTimeline;
  /** List of project objectives */
  objectives: string[];
}

/**
 * Timeline information for a project
 */
export interface ProjectTimeline {
  /** Project start date */
  startDate: string;
  /** Expected end date */
  endDate?: string;
  /** Key milestone dates */
  milestones?: ProjectMilestone[];
}

/**
 * A milestone within a project timeline
 */
export interface ProjectMilestone {
  /** Unique identifier for the milestone */
  id: string;
  /** Milestone name */
  name: string;
  /** Target date for completion */
  targetDate: string;
  /** Whether the milestone has been completed */
  completed: boolean;
}

/**
 * A mission within a project (the atomic unit of work)
 */
export interface SpaceMission {
  /** Unique identifier for the mission */
  id: string;
  /** Parent project ID */
  projectId: string;
  /** Mission name */
  name: string;
  /** Detailed description of what the mission should accomplish */
  description: string;
  /** Current execution status */
  status: SpaceMissionStatus;
  /** ID of the cognate assigned to execute this mission */
  assignedCognateId?: string;
  /** ID of the reasoning trace for transparency */
  reasoningTraceId?: string;
}

/**
 * Entity types in the space hierarchy
 */
export type SpaceEntityType = 'personal' | 'domain' | 'project' | 'mission';

/**
 * Union type for all space entities
 */
export type SpaceEntity = PersonalSpace | DomainSpace | Project | SpaceMission;
