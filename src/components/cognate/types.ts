/**
 * Cognate Component Types and Constants
 *
 * Defines types for the gamification system, skills, personality traits,
 * and autonomy levels for Cognates (AI agents).
 */

// =============================================================================
// XP System Constants
// =============================================================================

export const XP_REWARDS = {
  task_completed: 10,
  task_approved: 15,
  correction_learned: 20,
  complex_task_success: 30,
  user_praised: 25,
} as const;

export const AUTONOMY_THRESHOLDS = {
  1: 0,      // Apprentice
  2: 500,    // Collaborator
  3: 2000,   // Expert
  4: 5000,   // Master
} as const;

// =============================================================================
// Autonomy Levels
// =============================================================================

export type AutonomyLevel = 1 | 2 | 3 | 4;

export interface AutonomyLevelConfig {
  level: AutonomyLevel;
  name: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: 'seedling' | 'handshake' | 'award' | 'crown';
}

export const AUTONOMY_LEVELS: Record<AutonomyLevel, AutonomyLevelConfig> = {
  1: {
    level: 1,
    name: 'Apprentice',
    description: 'Asks before every action',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/30',
    icon: 'seedling',
  },
  2: {
    level: 2,
    name: 'Collaborator',
    description: 'Handles routine tasks independently',
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/30',
    icon: 'handshake',
  },
  3: {
    level: 3,
    name: 'Expert',
    description: 'Handles complex tasks with review',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500/30',
    icon: 'award',
  },
  4: {
    level: 4,
    name: 'Master',
    description: 'Full autonomy with post-hoc review',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/20',
    borderColor: 'border-amber-500/30',
    icon: 'crown',
  },
} as const;

// =============================================================================
// Skills System
// =============================================================================

export type SkillProficiency = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export type SkillCategory =
  | 'communication'
  | 'analysis'
  | 'technical'
  | 'creative'
  | 'operations'
  | 'strategy';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  proficiency: SkillProficiency;
  description?: string;
}

export const SKILL_PROFICIENCY_CONFIG: Record<SkillProficiency, { label: string; color: string; bgColor: string }> = {
  beginner: { label: 'Beginner', color: 'text-muted-foreground', bgColor: 'bg-muted/20' },
  intermediate: { label: 'Intermediate', color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
  advanced: { label: 'Advanced', color: 'text-purple-400', bgColor: 'bg-purple-500/20' },
  expert: { label: 'Expert', color: 'text-amber-400', bgColor: 'bg-amber-500/20' },
};

export const SKILL_CATEGORY_CONFIG: Record<SkillCategory, { label: string; color: string; bgColor: string }> = {
  communication: { label: 'Communication', color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
  analysis: { label: 'Analysis', color: 'text-green-400', bgColor: 'bg-green-500/20' },
  technical: { label: 'Technical', color: 'text-purple-400', bgColor: 'bg-purple-500/20' },
  creative: { label: 'Creative', color: 'text-pink-400', bgColor: 'bg-pink-500/20' },
  operations: { label: 'Operations', color: 'text-orange-400', bgColor: 'bg-orange-500/20' },
  strategy: { label: 'Strategy', color: 'text-amber-400', bgColor: 'bg-amber-500/20' },
};

// =============================================================================
// Personality System
// =============================================================================

export type PersonalityTrait =
  | 'formality'
  | 'verbosity'
  | 'creativity'
  | 'caution'
  | 'humor'
  | 'empathy'
  | 'assertiveness';

export interface PersonalityTraitConfig {
  trait: PersonalityTrait;
  label: string;
  description: string;
  minLabel: string;
  maxLabel: string;
}

export const PERSONALITY_TRAITS: PersonalityTraitConfig[] = [
  {
    trait: 'formality',
    label: 'Formality',
    description: 'How formal or casual the communication style is',
    minLabel: 'Casual',
    maxLabel: 'Formal',
  },
  {
    trait: 'verbosity',
    label: 'Verbosity',
    description: 'How detailed or concise responses are',
    minLabel: 'Concise',
    maxLabel: 'Detailed',
  },
  {
    trait: 'creativity',
    label: 'Creativity',
    description: 'How creative or conventional approaches are',
    minLabel: 'Conventional',
    maxLabel: 'Creative',
  },
  {
    trait: 'caution',
    label: 'Caution',
    description: 'How cautious or bold decision-making is',
    minLabel: 'Bold',
    maxLabel: 'Cautious',
  },
  {
    trait: 'humor',
    label: 'Humor',
    description: 'How much humor is incorporated into responses',
    minLabel: 'Serious',
    maxLabel: 'Playful',
  },
  {
    trait: 'empathy',
    label: 'Empathy',
    description: 'How emotionally attuned responses are',
    minLabel: 'Objective',
    maxLabel: 'Empathetic',
  },
  {
    trait: 'assertiveness',
    label: 'Assertiveness',
    description: 'How assertive or accommodating the communication is',
    minLabel: 'Accommodating',
    maxLabel: 'Assertive',
  },
];

export type PersonalityValues = Record<PersonalityTrait, number>;

// =============================================================================
// Cognate Status (Availability)
// =============================================================================

export type CognateAvailabilityStatus = 'available' | 'busy' | 'offline';

export const AVAILABILITY_STATUS_CONFIG: Record<CognateAvailabilityStatus, { label: string; color: string; dotColor: string }> = {
  available: { label: 'Available', color: 'text-green-400', dotColor: 'bg-green-400' },
  busy: { label: 'Busy', color: 'text-yellow-400', dotColor: 'bg-yellow-400' },
  offline: { label: 'Offline', color: 'text-muted-foreground', dotColor: 'bg-muted-foreground' },
};

// =============================================================================
// Extended Cognate Type
// =============================================================================

export interface ExtendedCognate {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  role?: string;
  industry?: string;

  // Gamification
  xp: number;
  level: number;
  autonomyLevel: AutonomyLevel;

  // Skills and personality
  skills: Skill[];
  personality: PersonalityValues;

  // Availability
  availability: CognateAvailabilityStatus;

  // SOPs
  assignedSOPs: string[];

  // Activity
  lastActiveAt?: string;
  tasksCompleted: number;
  successRate: number;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Calculate the current level based on XP
 */
export function calculateLevel(xp: number): number {
  if (xp >= 5000) return 10;
  if (xp >= 4000) return 9;
  if (xp >= 3200) return 8;
  if (xp >= 2500) return 7;
  if (xp >= 1900) return 6;
  if (xp >= 1400) return 5;
  if (xp >= 1000) return 4;
  if (xp >= 600) return 3;
  if (xp >= 300) return 2;
  return 1;
}

/**
 * Get XP thresholds for a given level
 */
export function getXPThresholds(level: number): { current: number; next: number } {
  const thresholds = [0, 0, 300, 600, 1000, 1400, 1900, 2500, 3200, 4000, 5000];
  return {
    current: thresholds[level] || 0,
    next: thresholds[level + 1] || thresholds[10],
  };
}

/**
 * Calculate progress percentage to next level
 */
export function calculateLevelProgress(xp: number, level: number): number {
  const { current, next } = getXPThresholds(level);
  const progressXP = xp - current;
  const requiredXP = next - current;
  return Math.min(Math.round((progressXP / requiredXP) * 100), 100);
}

/**
 * Determine autonomy level based on XP
 */
export function getAutonomyLevel(xp: number): AutonomyLevel {
  if (xp >= AUTONOMY_THRESHOLDS[4]) return 4;
  if (xp >= AUTONOMY_THRESHOLDS[3]) return 3;
  if (xp >= AUTONOMY_THRESHOLDS[2]) return 2;
  return 1;
}
