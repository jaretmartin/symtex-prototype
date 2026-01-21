/**
 * Mock Data Index
 *
 * Centralized mock data for Symtex Pro.
 * Import from this file for consistent access to all mock data.
 *
 * Usage:
 * import { mockSpaces, mockCognates, getMockSpaceById } from '@/mocks';
 */

// ============================================================================
// SPACES
// ============================================================================

export {
  spaces as mockSpaces,
  spacesById,
  spacesBySlug,
} from './spaces';

export type { Space, SpaceSettings } from './spaces';

// ============================================================================
// PROJECTS
// ============================================================================

export {
  projects as mockProjects,
  projectsById,
  getProjectsBySpaceId,
  getProjectsByStatus,
  getProjectsByMinPriority,
} from './projects';

export type { Project, ProjectStatus, ProjectPriority } from './projects';

// ============================================================================
// COGNATES
// ============================================================================

export {
  cognates as mockCognates,
  cognatesById,
  getCognatesBySpaceId,
  getCognatesByStatus as getCognatesByMockStatus,
  getCognatesByMaxAutonomy,
  getCognatesBySkill,
  getTotalTokensUsedThisMonth,
} from './cognates';

export type {
  Cognate as MockCognate,
  CognateStatus as MockCognateStatus,
  AutonomyLevel,
  CognateStats,
} from './cognates';

// ============================================================================
// AUTOMATIONS
// ============================================================================

export {
  mockAutomations,
  mockSafeAutomations,
  mockRiskyAutomations,
  getAutomationById,
  getAutomationsByCognate,
  getAutomationsBySpace,
  getApprovalRequiredAutomations,
  getAutomationsByRiskLevel,
} from './automations';

export type {
  Automation,
  AutomationRiskLevel,
  AutomationScheduleType,
  AutomationStatus,
} from './automations';

// ============================================================================
// RUNS
// ============================================================================

export {
  mockRuns,
  mockCompletedRuns,
  mockRunningRuns,
  mockAwaitingApprovalRuns,
  mockFailedRuns,
  mockCancelledRuns,
  mockPendingRuns,
  getRunById,
  getRunsByAutomation,
  getRunsByCognate,
  getRunsByStatus,
  getRunsAwaitingApproval,
  getRecentRuns,
  getRunStats,
} from './runs';

export type {
  AutomationRun,
  RunStatus,
  RunOutput,
  RunError,
  ApprovalRequest,
} from './runs';

// ============================================================================
// KNOWLEDGE
// ============================================================================

export {
  mockKnowledge,
  mockDocuments,
  mockPolicies as mockKnowledgePolicies, // Renamed to avoid conflict with governance policies
  mockProcedures,
  mockReferences,
  getKnowledgeById,
  getKnowledgeByType,
  getKnowledgeBySpace,
  getKnowledgeByTag,
  getKnowledgeByCognate,
  getTopCitedKnowledge,
  getRecentlyUpdatedKnowledge,
  getKnowledgeStats,
  searchKnowledge,
} from './knowledge';

export type {
  KnowledgeItem,
  KnowledgeType,
  KnowledgeSource,
  KnowledgeStatus,
} from './knowledge';

// ============================================================================
// NEXIS (Relationship Intelligence)
// ============================================================================

export {
  // Entity data
  mockNexisEntities,
  mockNexisPeople,
  mockNexisOrganizations,
  mockNexisConcepts,
  mockNexisEvents,
  mockNexisRelationships,
  // Graph visualization data
  mockNexisNodes,
  mockNexisEdges,
  mockNexisInsights,
  // Helper functions
  getNexisEntityById,
  getNexisEntitiesByType,
  getNexisRelationshipsForEntity,
  getNexisConnectedEntities,
  // Conversion functions
  convertEntitiesToNodes,
  convertRelationshipsToEdges,
} from './nexis';

export type {
  NexisEntity,
  NexisEntityType,
  NexisRelationship,
  NexisRelationshipType,
} from './nexis';

// ============================================================================
// POLICIES (Governance)
// ============================================================================

export {
  mockPolicies,
  getPolicyById,
  getPoliciesByScope,
  getActivePolicies,
  getPoliciesRequiringApproval,
  getPoliciesByTag,
  checkPolicyThreshold,
} from './policies';

export type {
  Policy,
  PolicyScope,
  PolicyTriggerType,
  ApproverType,
  PolicyStatus,
  PolicyTrigger,
  PolicyApprover,
  PolicyThreshold,
  PolicyEscalation,
} from './policies';

// ============================================================================
// LEDGER (Audit Trail)
// ============================================================================

export {
  mockLedgerEntries,
  getLedgerEntryById,
  getLedgerEntriesByType,
  getLedgerEntriesByActor,
  getLedgerEntriesBySpace,
  getLedgerEntriesBySeverity,
  getFlaggedLedgerEntries,
  getRecentLedgerEntries,
  getLedgerStats,
} from './ledger';

// Note: LedgerEntry and related types are exported from @/types

// ============================================================================
// CONVENIENCE GETTERS
// ============================================================================

import { spacesById } from './spaces';
import { projectsById } from './projects';
import { cognatesById } from './cognates';
import { getAutomationById } from './automations';
import { getRunById } from './runs';
import { getKnowledgeById } from './knowledge';
import { getNexisEntityById } from './nexis';
import { getPolicyById } from './policies';
import { getLedgerEntryById } from './ledger';

/**
 * Get a mock Space by ID
 */
export function getMockSpaceById(id: string) {
  return spacesById[id];
}

/**
 * Get a mock Project by ID
 */
export function getMockProjectById(id: string) {
  return projectsById[id];
}

/**
 * Get a mock Cognate by ID
 */
export function getMockCognateById(id: string) {
  return cognatesById[id];
}

/**
 * Get a mock Automation by ID
 */
export function getMockAutomationById(id: string) {
  return getAutomationById(id);
}

/**
 * Get a mock Run by ID
 */
export function getMockRunById(id: string) {
  return getRunById(id);
}

/**
 * Get a mock Knowledge item by ID
 */
export function getMockKnowledgeById(id: string) {
  return getKnowledgeById(id);
}

/**
 * Get a mock NEXIS entity by ID
 */
export function getMockNexisEntityById(id: string) {
  return getNexisEntityById(id);
}

/**
 * Get a mock Policy by ID
 */
export function getMockPolicyById(id: string) {
  return getPolicyById(id);
}

/**
 * Get a mock Ledger entry by ID
 */
export function getMockLedgerEntryById(id: string) {
  return getLedgerEntryById(id);
}

// ============================================================================
// AGGREGATE DATA
// ============================================================================

import { spaces } from './spaces';
import { projects } from './projects';
import { cognates } from './cognates';
import { mockAutomations } from './automations';
import { mockRuns } from './runs';
import { mockKnowledge } from './knowledge';
import { mockNexisEntities } from './nexis';
import { mockPolicies } from './policies';
import { mockLedgerEntries } from './ledger';

/**
 * Get counts of all mock data entities
 */
export function getMockDataCounts(): Record<string, number> {
  return {
    spaces: spaces.length,
    projects: projects.length,
    cognates: cognates.length,
    automations: mockAutomations.length,
    runs: mockRuns.length,
    knowledge: mockKnowledge.length,
    nexisEntities: mockNexisEntities.length,
    policies: mockPolicies.length,
    ledgerEntries: mockLedgerEntries.length,
  };
}

/**
 * Get a summary of the mock data state
 */
export function getMockDataSummary(): {
  counts: Record<string, number>;
  spaces: Array<{ id: string; name: string; projectCount: number; cognateCount: number }>;
} {
  const counts = getMockDataCounts();

  const spacesSummary = spaces.map((space) => ({
    id: space.id,
    name: space.name,
    projectCount: projects.filter((p) => p.spaceId === space.id).length,
    cognateCount: cognates.filter((c) => c.assignedSpaces.includes(space.id)).length,
  }));

  return {
    counts,
    spaces: spacesSummary,
  };
}
