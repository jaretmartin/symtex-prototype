/**
 * Cognate Component Library
 *
 * A comprehensive component library for the Cognate system including:
 * - XP and leveling progress displays
 * - Autonomy level indicators
 * - Skill badges and lists
 * - Personality configuration sliders
 * - Cognate cards and detail views
 * - Selection dropdowns for assignments
 */

// Types and constants
export {
  // XP System
  XP_REWARDS,
  AUTONOMY_THRESHOLDS,
  calculateLevel,
  getXPThresholds,
  calculateLevelProgress,
  getAutonomyLevel,

  // Autonomy
  AUTONOMY_LEVELS,

  // Skills
  SKILL_PROFICIENCY_CONFIG,
  SKILL_CATEGORY_CONFIG,

  // Personality
  PERSONALITY_TRAITS,

  // Status
  AVAILABILITY_STATUS_CONFIG,
} from './types';

export type {
  // Autonomy types
  AutonomyLevel,
  AutonomyLevelConfig,

  // Skill types
  Skill,
  SkillProficiency,
  SkillCategory,

  // Personality types
  PersonalityTrait,
  PersonalityValues,
  PersonalityTraitConfig,

  // Status types
  CognateAvailabilityStatus,

  // Extended cognate type
  ExtendedCognate,
} from './types';

// Components
export { XPProgressBar } from './XPProgressBar';
export { AutonomyLevelIndicator, AutonomyBadge } from './AutonomyLevelIndicator';
export { SkillBadges, SkillBadge, SkillList } from './SkillBadges';
export { PersonalitySliders, PersonalityPreview } from './PersonalitySliders';
export { CognateCard } from './CognateCard';
export { CognateDetail } from './CognateDetail';
export { CognateSelector, CognateMultiSelector } from './CognateSelector';
