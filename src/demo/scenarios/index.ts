/**
 * Demo Scenarios Index
 *
 * Exports all industry-specific demo scenarios.
 */

export { healthcareScenario } from './healthcare';
export { financialScenario } from './financial';

// Re-export types for convenience
export type {
  DemoScenario,
  DemoCognate,
  DemoAutomation,
  DemoMetrics,
  ConversationMessage,
  SampleConversation,
  DemoCompany,
  CognatePersonality,
} from '../types';
