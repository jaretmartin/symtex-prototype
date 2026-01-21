/**
 * Mock data for Symtex Pro Cognates
 *
 * Cognates are AI agents with defined skills, autonomy levels, and operational
 * boundaries. Each Cognate is assigned to one or more Spaces and operates
 * according to its SOPs (Standard Operating Procedures) and Packs.
 */

export type CognateStatus = 'active' | 'idle' | 'training' | 'paused' | 'error';
export type AutonomyLevel = 1 | 2 | 3 | 4 | 5;

export interface CognateStats {
  /** Total tasks completed all-time */
  tasksCompleted: number;
  /** Tasks completed in the last 7 days */
  tasksThisWeek: number;
  /** Percentage of tasks completed successfully */
  successRate: number;
  /** Average task completion time in seconds */
  avgCompletionTime: number;
  /** Total tokens consumed this month */
  tokensUsedThisMonth: number;
}

export interface Cognate {
  /** Unique identifier in format: cog-{slug} */
  id: string;
  /** Display name for the Cognate */
  name: string;
  /** URL-safe identifier */
  slug: string;
  /** Avatar image URL or emoji */
  avatar: string;
  /** Brief description of the Cognate's purpose and capabilities */
  description: string;
  /**
   * Autonomy level (1-5):
   * L1: Observe only - requires approval for all actions
   * L2: Suggest - can recommend actions, requires approval to execute
   * L3: Act with limits - can execute within defined boundaries
   * L4: Act freely - full autonomy within SOPs
   * L5: Autonomous - can modify own SOPs and escalate
   */
  autonomyLevel: AutonomyLevel;
  /** List of skill identifiers this Cognate possesses */
  skills: string[];
  /** Space IDs this Cognate is assigned to operate in */
  assignedSpaces: string[];
  /** Number of active SOPs governing this Cognate */
  sopCount: number;
  /** IDs of capability Packs installed on this Cognate */
  packIds: string[];
  /** Current operational status */
  status: CognateStatus;
  /** Performance and usage statistics */
  stats: CognateStats;
}

// ============================================================================
// Compliance Operations Cognates
// ============================================================================

/**
 * Compliance Monitor Cognate
 *
 * Continuously monitors systems for compliance violations and generates
 * alerts when policy breaches are detected. Operates at L2 autonomy,
 * suggesting remediation actions that require human approval.
 */
const complianceMonitor: Cognate = {
  id: 'cog-compliance-monitor',
  name: 'Compliance Monitor',
  slug: 'compliance-monitor',
  avatar: '🛡️',
  description:
    'Monitors systems and processes for regulatory compliance violations. Detects policy breaches in real-time and suggests remediation actions for human review.',
  autonomyLevel: 2,
  skills: [
    'policy-analysis',
    'violation-detection',
    'report-generation',
    'audit-trail-management',
    'regulatory-mapping',
  ],
  assignedSpaces: ['space-compliance-ops'],
  sopCount: 12,
  packIds: ['pack-compliance-core', 'pack-gdpr', 'pack-sox'],
  status: 'active',
  stats: {
    tasksCompleted: 2847,
    tasksThisWeek: 156,
    successRate: 99.2,
    avgCompletionTime: 45,
    tokensUsedThisMonth: 1250000,
  },
};

/**
 * Audit Collector Cognate
 *
 * Automates the collection and organization of audit evidence from
 * multiple systems. Operates at L3 autonomy with the ability to
 * execute data collection within defined boundaries.
 */
const auditCollector: Cognate = {
  id: 'cog-audit-collector',
  name: 'Audit Collector',
  slug: 'audit-collector',
  avatar: '📋',
  description:
    'Automates audit evidence collection from enterprise systems. Gathers, validates, and organizes documentation for compliance audits with full chain of custody.',
  autonomyLevel: 3,
  skills: [
    'evidence-collection',
    'data-validation',
    'document-organization',
    'api-integration',
    'audit-scheduling',
  ],
  assignedSpaces: ['space-compliance-ops'],
  sopCount: 8,
  packIds: ['pack-compliance-core', 'pack-evidence-management'],
  status: 'active',
  stats: {
    tasksCompleted: 1523,
    tasksThisWeek: 89,
    successRate: 98.7,
    avgCompletionTime: 120,
    tokensUsedThisMonth: 890000,
  },
};

// ============================================================================
// Revenue Operations Cognates
// ============================================================================

/**
 * Revenue Analyst Cognate
 *
 * Analyzes sales data, identifies pipeline risks, and provides
 * revenue forecasting insights. Operates at L3 autonomy to
 * automatically generate reports and update CRM records.
 */
const revenueAnalyst: Cognate = {
  id: 'cog-revenue-analyst',
  name: 'Revenue Analyst',
  slug: 'revenue-analyst',
  avatar: '📊',
  description:
    'Analyzes sales pipeline data to identify revenue opportunities and risks. Provides accurate forecasting and automatically updates CRM with enriched insights.',
  autonomyLevel: 3,
  skills: [
    'pipeline-analysis',
    'revenue-forecasting',
    'lead-scoring',
    'crm-integration',
    'trend-detection',
  ],
  assignedSpaces: ['space-revenue-ops'],
  sopCount: 15,
  packIds: ['pack-revenue-core', 'pack-salesforce', 'pack-analytics'],
  status: 'active',
  stats: {
    tasksCompleted: 4231,
    tasksThisWeek: 287,
    successRate: 97.8,
    avgCompletionTime: 30,
    tokensUsedThisMonth: 2100000,
  },
};

/**
 * Customer Success Cognate
 *
 * Monitors customer health signals and proactively identifies
 * churn risks. Operates at L2 autonomy, recommending outreach
 * actions that require CSM approval.
 */
const customerSuccess: Cognate = {
  id: 'cog-customer-success',
  name: 'Customer Success',
  slug: 'customer-success',
  avatar: '🤝',
  description:
    'Monitors customer health metrics and engagement patterns. Identifies churn risk early and recommends personalized retention strategies for CSM review.',
  autonomyLevel: 2,
  skills: [
    'health-scoring',
    'churn-prediction',
    'engagement-analysis',
    'playbook-execution',
    'sentiment-analysis',
  ],
  assignedSpaces: ['space-revenue-ops'],
  sopCount: 11,
  packIds: ['pack-revenue-core', 'pack-customer-health', 'pack-communications'],
  status: 'active',
  stats: {
    tasksCompleted: 1876,
    tasksThisWeek: 134,
    successRate: 96.5,
    avgCompletionTime: 60,
    tokensUsedThisMonth: 1450000,
  },
};

// ============================================================================
// Security Operations Cognates
// ============================================================================

/**
 * Threat Hunter Cognate
 *
 * Actively hunts for threats across security telemetry using
 * behavioral analysis and threat intelligence. Operates at L1
 * autonomy due to the sensitive nature of security operations.
 */
const threatHunter: Cognate = {
  id: 'cog-threat-hunter',
  name: 'Threat Hunter',
  slug: 'threat-hunter',
  avatar: '🔍',
  description:
    'Proactively hunts for threats across endpoints, network, and cloud. Uses behavioral analysis and threat intelligence to identify advanced persistent threats.',
  autonomyLevel: 1,
  skills: [
    'threat-detection',
    'behavioral-analysis',
    'ioc-correlation',
    'siem-integration',
    'threat-intelligence',
  ],
  assignedSpaces: ['space-security-ops'],
  sopCount: 18,
  packIds: ['pack-security-core', 'pack-threat-intel', 'pack-siem'],
  status: 'active',
  stats: {
    tasksCompleted: 5672,
    tasksThisWeek: 412,
    successRate: 99.8,
    avgCompletionTime: 15,
    tokensUsedThisMonth: 3200000,
  },
};

/**
 * Incident Responder Cognate
 *
 * Executes incident response playbooks and coordinates containment
 * actions. Operates at L1 autonomy to ensure human oversight of
 * all response actions while maintaining forensic integrity.
 */
const incidentResponder: Cognate = {
  id: 'cog-incident-responder',
  name: 'Incident Responder',
  slug: 'incident-responder',
  avatar: '🚨',
  description:
    'Executes incident response playbooks with precision. Coordinates containment, eradication, and recovery while preserving evidence for forensic analysis.',
  autonomyLevel: 1,
  skills: [
    'playbook-execution',
    'containment-actions',
    'evidence-preservation',
    'stakeholder-communication',
    'post-incident-analysis',
  ],
  assignedSpaces: ['space-security-ops'],
  sopCount: 22,
  packIds: ['pack-security-core', 'pack-incident-response', 'pack-forensics'],
  status: 'idle',
  stats: {
    tasksCompleted: 892,
    tasksThisWeek: 23,
    successRate: 99.5,
    avgCompletionTime: 180,
    tokensUsedThisMonth: 780000,
  },
};

/**
 * All available Cognates in the Symtex Pro instance
 */
export const cognates: Cognate[] = [
  complianceMonitor,
  auditCollector,
  revenueAnalyst,
  customerSuccess,
  threatHunter,
  incidentResponder,
];

/**
 * Lookup map for quick Cognate retrieval by ID
 */
export const cognatesById: Record<string, Cognate> = {
  [complianceMonitor.id]: complianceMonitor,
  [auditCollector.id]: auditCollector,
  [revenueAnalyst.id]: revenueAnalyst,
  [customerSuccess.id]: customerSuccess,
  [threatHunter.id]: threatHunter,
  [incidentResponder.id]: incidentResponder,
};

/**
 * Get all Cognates assigned to a specific space
 */
export function getCognatesBySpaceId(spaceId: string): Cognate[] {
  return cognates.filter((cognate) => cognate.assignedSpaces.includes(spaceId));
}

/**
 * Get all Cognates with a specific status
 */
export function getCognatesByStatus(status: CognateStatus): Cognate[] {
  return cognates.filter((cognate) => cognate.status === status);
}

/**
 * Get all Cognates at or below a specific autonomy level
 */
export function getCognatesByMaxAutonomy(maxLevel: AutonomyLevel): Cognate[] {
  return cognates.filter((cognate) => cognate.autonomyLevel <= maxLevel);
}

/**
 * Get all Cognates that have a specific skill
 */
export function getCognatesBySkill(skill: string): Cognate[] {
  return cognates.filter((cognate) => cognate.skills.includes(skill));
}

/**
 * Calculate total tokens used across all Cognates this month
 */
export function getTotalTokensUsedThisMonth(): number {
  return cognates.reduce((total, cognate) => total + cognate.stats.tokensUsedThisMonth, 0);
}

export default cognates;
