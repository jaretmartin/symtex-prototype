/**
 * Mock data for Symtex Pro Spaces
 *
 * Spaces are top-level organizational containers that group related projects,
 * Cognates, and operational workflows. Each space has its own governance
 * settings, budget limits, and autonomy configurations.
 */

export interface SpaceSettings {
  /** Default autonomy level for new Cognates in this space (1-5) */
  defaultAutonomy: number;
  /** Whether actions require human approval before execution */
  requireApproval: boolean;
  /** Monthly AI compute budget limit in USD */
  budgetLimit: number;
}

export interface Space {
  /** Unique identifier in format: space-{slug} */
  id: string;
  /** Display name for the space */
  name: string;
  /** URL-safe identifier */
  slug: string;
  /** Brief description of the space's purpose */
  description: string;
  /** Lucide icon name */
  icon: string;
  /** Theme color for UI elements */
  color: string;
  /** ISO timestamp of creation */
  createdAt: string;
  /** Governance and operational settings */
  settings: SpaceSettings;
}

/**
 * Compliance Operations Space
 *
 * Handles regulatory compliance workflows including SOX, GDPR, HIPAA,
 * and internal policy monitoring. Cognates in this space operate with
 * strict approval requirements due to audit trail needs.
 */
const complianceOps: Space = {
  id: 'space-compliance-ops',
  name: 'Compliance Operations',
  slug: 'compliance-ops',
  description:
    'Regulatory compliance automation for SOX, GDPR, HIPAA, and internal policy monitoring. Maintains audit trails and ensures governance requirements are met.',
  icon: 'shield-check',
  color: 'blue',
  createdAt: '2024-08-15T09:00:00Z',
  settings: {
    defaultAutonomy: 2,
    requireApproval: true,
    budgetLimit: 5000,
  },
};

/**
 * Revenue Operations Space
 *
 * Manages sales pipeline optimization, lead scoring, customer success
 * workflows, and renewal management. Cognates have moderate autonomy
 * to take action on routine revenue operations.
 */
const revenueOps: Space = {
  id: 'space-revenue-ops',
  name: 'Revenue Operations',
  slug: 'revenue-ops',
  description:
    'Sales pipeline optimization, lead scoring, customer success automation, and renewal management. Drives predictable revenue growth through intelligent automation.',
  icon: 'trending-up',
  color: 'green',
  createdAt: '2024-09-01T14:30:00Z',
  settings: {
    defaultAutonomy: 3,
    requireApproval: false,
    budgetLimit: 8000,
  },
};

/**
 * Security Operations Space
 *
 * Handles threat detection, incident response, and security monitoring.
 * Cognates operate with minimal autonomy (L1) due to the critical nature
 * of security operations and need for human oversight.
 */
const securityOps: Space = {
  id: 'space-security-ops',
  name: 'Security Operations',
  slug: 'security-ops',
  description:
    'Threat detection, incident response, and security monitoring automation. Provides 24/7 vigilance with human-in-the-loop escalation for critical threats.',
  icon: 'lock',
  color: 'red',
  createdAt: '2024-07-20T08:00:00Z',
  settings: {
    defaultAutonomy: 1,
    requireApproval: true,
    budgetLimit: 12000,
  },
};

/**
 * All available spaces in the Symtex Pro instance
 */
export const spaces: Space[] = [complianceOps, revenueOps, securityOps];

/**
 * Lookup map for quick space retrieval by ID
 */
export const spacesById: Record<string, Space> = {
  [complianceOps.id]: complianceOps,
  [revenueOps.id]: revenueOps,
  [securityOps.id]: securityOps,
};

/**
 * Lookup map for quick space retrieval by slug
 */
export const spacesBySlug: Record<string, Space> = {
  [complianceOps.slug]: complianceOps,
  [revenueOps.slug]: revenueOps,
  [securityOps.slug]: securityOps,
};

export default spaces;
