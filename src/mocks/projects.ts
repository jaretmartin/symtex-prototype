/**
 * Mock data for Symtex Pro Projects
 *
 * Projects are containers within Spaces that organize related workflows,
 * Narratives, and Cognate assignments. Each project has a specific focus
 * area and tracks progress toward operational goals.
 */

export type ProjectStatus = 'active' | 'paused' | 'completed' | 'archived';
export type ProjectPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Project {
  /** Unique identifier in format: proj-{slug} */
  id: string;
  /** Display name for the project */
  name: string;
  /** URL-safe identifier */
  slug: string;
  /** Reference to parent space ID */
  spaceId: string;
  /** Brief description of the project's purpose */
  description: string;
  /** Current operational status */
  status: ProjectStatus;
  /** Business priority level */
  priority: ProjectPriority;
  /** ISO timestamp of creation */
  createdAt: string;
}

// ============================================================================
// Compliance Operations Projects
// ============================================================================

/**
 * Audit Automation Project
 *
 * Automates the collection, verification, and reporting of audit evidence
 * for SOX, GDPR, and internal compliance requirements.
 */
const auditAutomation: Project = {
  id: 'proj-audit-automation',
  name: 'Audit Automation',
  slug: 'audit-automation',
  spaceId: 'space-compliance-ops',
  description:
    'Automated collection and verification of audit evidence for SOX, GDPR, and internal compliance. Reduces manual evidence gathering by 80% while improving accuracy.',
  status: 'active',
  priority: 'high',
  createdAt: '2024-08-20T10:00:00Z',
};

/**
 * Policy Monitoring Project
 *
 * Continuous monitoring of systems and processes to ensure adherence
 * to regulatory and internal policies with real-time alerting.
 */
const policyMonitoring: Project = {
  id: 'proj-policy-monitoring',
  name: 'Policy Monitoring',
  slug: 'policy-monitoring',
  spaceId: 'space-compliance-ops',
  description:
    'Real-time monitoring of systems and processes for policy violations. Provides continuous compliance assurance with automated remediation suggestions.',
  status: 'active',
  priority: 'critical',
  createdAt: '2024-08-25T14:00:00Z',
};

// ============================================================================
// Revenue Operations Projects
// ============================================================================

/**
 * Lead Scoring Project
 *
 * AI-powered lead qualification and prioritization to help sales teams
 * focus on high-value opportunities with the greatest conversion potential.
 */
const leadScoring: Project = {
  id: 'proj-lead-scoring',
  name: 'Lead Scoring',
  slug: 'lead-scoring',
  spaceId: 'space-revenue-ops',
  description:
    'Intelligent lead qualification using behavioral signals, firmographic data, and engagement patterns. Increases sales efficiency by prioritizing high-intent prospects.',
  status: 'active',
  priority: 'high',
  createdAt: '2024-09-05T09:00:00Z',
};

/**
 * Renewal Management Project
 *
 * Proactive customer renewal workflows that identify churn risk early
 * and automate retention outreach to protect recurring revenue.
 */
const renewalManagement: Project = {
  id: 'proj-renewal-management',
  name: 'Renewal Management',
  slug: 'renewal-management',
  spaceId: 'space-revenue-ops',
  description:
    'Proactive renewal management with churn risk prediction and automated retention workflows. Targets 95% net revenue retention through early intervention.',
  status: 'active',
  priority: 'medium',
  createdAt: '2024-09-10T11:30:00Z',
};

// ============================================================================
// Security Operations Projects
// ============================================================================

/**
 * Threat Detection Project
 *
 * Continuous monitoring and analysis of security telemetry to identify
 * threats, anomalies, and potential breaches before they escalate.
 */
const threatDetection: Project = {
  id: 'proj-threat-detection',
  name: 'Threat Detection',
  slug: 'threat-detection',
  spaceId: 'space-security-ops',
  description:
    'Real-time threat detection across endpoints, network, and cloud infrastructure. Uses behavioral analysis to identify zero-day threats and advanced persistent threats.',
  status: 'active',
  priority: 'critical',
  createdAt: '2024-07-25T08:00:00Z',
};

/**
 * Incident Response Project
 *
 * Automated incident triage, containment, and response workflows that
 * reduce mean time to resolution while maintaining forensic integrity.
 */
const incidentResponse: Project = {
  id: 'proj-incident-response',
  name: 'Incident Response',
  slug: 'incident-response',
  spaceId: 'space-security-ops',
  description:
    'Automated incident triage and response with playbook execution. Reduces MTTR by 60% while preserving evidence chain for forensic analysis.',
  status: 'active',
  priority: 'critical',
  createdAt: '2024-07-28T15:00:00Z',
};

/**
 * All available projects in the Symtex Pro instance
 */
export const projects: Project[] = [
  auditAutomation,
  policyMonitoring,
  leadScoring,
  renewalManagement,
  threatDetection,
  incidentResponse,
];

/**
 * Lookup map for quick project retrieval by ID
 */
export const projectsById: Record<string, Project> = {
  [auditAutomation.id]: auditAutomation,
  [policyMonitoring.id]: policyMonitoring,
  [leadScoring.id]: leadScoring,
  [renewalManagement.id]: renewalManagement,
  [threatDetection.id]: threatDetection,
  [incidentResponse.id]: incidentResponse,
};

/**
 * Get all projects belonging to a specific space
 */
export function getProjectsBySpaceId(spaceId: string): Project[] {
  return projects.filter((project) => project.spaceId === spaceId);
}

/**
 * Get all projects with a specific status
 */
export function getProjectsByStatus(status: ProjectStatus): Project[] {
  return projects.filter((project) => project.status === status);
}

/**
 * Get all projects with a specific priority or higher
 */
export function getProjectsByMinPriority(minPriority: ProjectPriority): Project[] {
  const priorityOrder: ProjectPriority[] = ['low', 'medium', 'high', 'critical'];
  const minIndex = priorityOrder.indexOf(minPriority);
  return projects.filter((project) => priorityOrder.indexOf(project.priority) >= minIndex);
}

export default projects;
