/**
 * Narrative and story automation types
 *
 * Defines the structure for story-driven automation workflows
 * that guide users through complex processes with narrative framing.
 */

/**
 * Types of chapters in a narrative story
 */
export type ChapterType = 'beginning' | 'decision' | 'action' | 'milestone' | 'ending';

/**
 * Status of a narrative story
 */
export type NarrativeStatus = 'draft' | 'active' | 'paused';

/**
 * Field types for customizable story elements
 */
export type CustomizableFieldType = 'text' | 'select' | 'number' | 'boolean';

/**
 * A customizable field within a narrative chapter
 */
export interface CustomizableField {
  /** Unique identifier for the field */
  id: string;
  /** Display label for the field */
  label: string;
  /** The type of input for this field */
  type: CustomizableFieldType;
  /** Current value of the field */
  value: string | number | boolean;
  /** Available options for select fields */
  options?: string[];
  /** Whether this field must be filled */
  required: boolean;
}

/**
 * A branch point in the narrative for decision chapters
 */
export interface Branch {
  /** Unique identifier for the branch */
  id: string;
  /** The condition that triggers this branch */
  condition: string;
  /** The target chapter ID if this branch is taken */
  targetChapterId: string;
  /** Display label for this branch option */
  label: string;
}

/**
 * A single chapter in a narrative story
 */
export interface NarrativeChapter {
  /** Unique identifier for the chapter */
  id: string;
  /** The type of chapter */
  type: ChapterType;
  /** Chapter title */
  title: string;
  /** The narrative text that tells the story of this step */
  storyText: string;
  /** Icon identifier for visual representation */
  icon: string;
  /** The underlying step type for execution */
  stepType: string;
  /** Fields that users can customize in this chapter */
  customizableFields: CustomizableField[];
  /** Optional branches for decision chapters */
  branches?: Branch[];
}

/**
 * A complete narrative story for automation
 */
export interface NarrativeStory {
  /** Unique identifier for the story */
  id: string;
  /** Story title */
  title: string;
  /** Brief description of what this story accomplishes */
  description: string;
  /** The ordered list of chapters in this story */
  chapters: NarrativeChapter[];
  /** Current status of the story */
  status: NarrativeStatus;
  /** Estimated cost to execute this story (in tokens/credits) */
  estimatedCost?: number;
}

/**
 * Progress tracking for a narrative story execution
 */
export interface NarrativeProgress {
  /** The story being executed */
  storyId: string;
  /** Current chapter index */
  currentChapterIndex: number;
  /** Chapters that have been completed */
  completedChapterIds: string[];
  /** Decisions made at branch points */
  branchDecisions: Record<string, string>;
  /** Started timestamp */
  startedAt: string;
  /** Completion timestamp if finished */
  completedAt?: string;
}

/**
 * Template for creating new narrative stories
 */
export interface NarrativeTemplate {
  /** Unique identifier for the template */
  id: string;
  /** Template name */
  name: string;
  /** Template description */
  description: string;
  /** Category for organization */
  category: string;
  /** Base story structure to copy */
  baseStory: Omit<NarrativeStory, 'id' | 'status'>;
  /** Tags for discoverability */
  tags: string[];
}
