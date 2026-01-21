/**
 * Mock Automation Data
 *
 * Centralized mock data for Automations in Symtex Pro.
 * Includes both safe (low-risk, automatic) and risky (approval-required) automations.
 */

// ============================================================================
// TYPES
// ============================================================================

export type AutomationRiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type AutomationScheduleType =
  | 'manual'
  | 'every_30_min'
  | 'hourly'
  | 'every_4_hours'
  | 'daily'
  | 'weekly'
  | 'monthly';

export type AutomationStatus = 'active' | 'paused' | 'draft' | 'disabled';

export interface Automation {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Description of what the automation does */
  description: string;
  /** ID of the Cognate that executes this automation */
  cognateId: string;
  /** ID of the Space this automation belongs to */
  spaceId: string;
  /** ID of the Project this automation belongs to */
  projectId: string;
  /** Risk level determines approval requirements */
  riskLevel: AutomationRiskLevel;
  /** When the automation runs */
  schedule: AutomationScheduleType;
  /** Current status */
  status: AutomationStatus;
  /** Whether human approval is required before execution */
  requiresApproval: boolean;
  /** Estimated cost per run in credits */
  estimatedCost: number;
  /** ID of the most recent run */
  lastRunId: string | null;
  /** Tags for organization */
  tags: string[];
  /** Version number */
  version: string;
  /** Creation timestamp */
  createdAt: string;
  /** Last update timestamp */
  updatedAt: string;
  /** Statistics */
  stats: {
    totalRuns: number;
    successfulRuns: number;
    failedRuns: number;
    averageDuration: number;
  };
}

// ============================================================================
// MOCK DATA - SAFE AUTOMATIONS (Low Risk, No Approval Required)
// ============================================================================

const safeAutomations: Automation[] = [
  {
    id: 'auto-daily-compliance-report',
    name: 'Daily Compliance Report',
    description:
      'Generates a comprehensive daily compliance report summarizing regulatory adherence, policy violations, and audit readiness metrics across all monitored systems.',
    cognateId: 'cog-compliance-monitor',
    spaceId: 'space-compliance',
    projectId: 'proj-regulatory-monitoring',
    riskLevel: 'low',
    schedule: 'daily',
    status: 'active',
    requiresApproval: false,
    estimatedCost: 12,
    lastRunId: 'run-001',
    tags: ['compliance', 'reporting', 'daily', 'audit'],
    version: '2.3.1',
    createdAt: '2024-06-15T10:00:00Z',
    updatedAt: '2025-11-20T14:30:00Z',
    stats: {
      totalRuns: 412,
      successfulRuns: 408,
      failedRuns: 4,
      averageDuration: 45000,
    },
  },
  {
    id: 'auto-lead-score-update',
    name: 'Lead Score Update',
    description:
      'Analyzes recent customer interactions, engagement metrics, and behavioral signals to update lead scores in the CRM. Runs every 4 hours during business hours.',
    cognateId: 'cog-revenue-analyst',
    spaceId: 'space-sales',
    projectId: 'proj-revenue-optimization',
    riskLevel: 'low',
    schedule: 'every_4_hours',
    status: 'active',
    requiresApproval: false,
    estimatedCost: 8,
    lastRunId: 'run-002',
    tags: ['sales', 'leads', 'scoring', 'crm'],
    version: '1.8.0',
    createdAt: '2024-09-01T08:00:00Z',
    updatedAt: '2025-12-05T11:15:00Z',
    stats: {
      totalRuns: 1847,
      successfulRuns: 1839,
      failedRuns: 8,
      averageDuration: 32000,
    },
  },
  {
    id: 'auto-renewal-reminder',
    name: 'Contract Renewal Reminder',
    description:
      'Identifies contracts approaching renewal within the next 90 days and generates personalized outreach drafts for customer success team review.',
    cognateId: 'cog-customer-success',
    spaceId: 'space-customer-success',
    projectId: 'proj-retention',
    riskLevel: 'low',
    schedule: 'weekly',
    status: 'active',
    requiresApproval: false,
    estimatedCost: 15,
    lastRunId: 'run-003',
    tags: ['renewals', 'customer-success', 'retention', 'contracts'],
    version: '3.1.0',
    createdAt: '2024-03-22T09:00:00Z',
    updatedAt: '2025-10-15T16:45:00Z',
    stats: {
      totalRuns: 89,
      successfulRuns: 89,
      failedRuns: 0,
      averageDuration: 120000,
    },
  },
  {
    id: 'auto-log-analysis',
    name: 'Security Log Analysis',
    description:
      'Continuously monitors system logs for anomalous patterns, potential security threats, and suspicious access attempts. Generates alerts for the security team.',
    cognateId: 'cog-threat-hunter',
    spaceId: 'space-security',
    projectId: 'proj-threat-detection',
    riskLevel: 'low',
    schedule: 'every_30_min',
    status: 'active',
    requiresApproval: false,
    estimatedCost: 5,
    lastRunId: 'run-004',
    tags: ['security', 'monitoring', 'logs', 'threat-detection'],
    version: '4.2.0',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2026-01-15T08:30:00Z',
    stats: {
      totalRuns: 35280,
      successfulRuns: 35275,
      failedRuns: 5,
      averageDuration: 18000,
    },
  },
];

// ============================================================================
// MOCK DATA - RISKY AUTOMATIONS (High Risk, Approval Required)
// ============================================================================

const riskyAutomations: Automation[] = [
  {
    id: 'auto-evidence-submission',
    name: 'Audit Evidence Submission',
    description:
      'Compiles and submits audit evidence packages to external regulatory bodies. Includes document verification, compliance attestations, and automated filing.',
    cognateId: 'cog-audit-collector',
    spaceId: 'space-compliance',
    projectId: 'proj-audit-management',
    riskLevel: 'high',
    schedule: 'manual',
    status: 'active',
    requiresApproval: true,
    estimatedCost: 45,
    lastRunId: 'run-005',
    tags: ['audit', 'compliance', 'regulatory', 'evidence', 'external'],
    version: '2.0.0',
    createdAt: '2024-08-01T14:00:00Z',
    updatedAt: '2025-12-18T09:20:00Z',
    stats: {
      totalRuns: 24,
      successfulRuns: 23,
      failedRuns: 1,
      averageDuration: 300000,
    },
  },
  {
    id: 'auto-customer-outreach',
    name: 'Personalized Customer Outreach',
    description:
      'Generates and sends personalized outreach emails to customers based on behavioral triggers, account health scores, and engagement patterns.',
    cognateId: 'cog-customer-success',
    spaceId: 'space-customer-success',
    projectId: 'proj-engagement',
    riskLevel: 'high',
    schedule: 'manual',
    status: 'active',
    requiresApproval: true,
    estimatedCost: 20,
    lastRunId: 'run-006',
    tags: ['outreach', 'email', 'customer-success', 'engagement', 'external'],
    version: '1.5.2',
    createdAt: '2024-11-05T11:00:00Z',
    updatedAt: '2026-01-10T13:40:00Z',
    stats: {
      totalRuns: 156,
      successfulRuns: 152,
      failedRuns: 4,
      averageDuration: 85000,
    },
  },
  {
    id: 'auto-threat-containment',
    name: 'Automated Threat Containment',
    description:
      'Executes immediate containment actions when critical security threats are detected. Can isolate systems, revoke access tokens, and trigger incident response procedures.',
    cognateId: 'cog-incident-responder',
    spaceId: 'space-security',
    projectId: 'proj-incident-response',
    riskLevel: 'critical',
    schedule: 'manual',
    status: 'active',
    requiresApproval: true,
    estimatedCost: 75,
    lastRunId: 'run-007',
    tags: ['security', 'incident-response', 'containment', 'critical', 'automated-response'],
    version: '3.0.1',
    createdAt: '2024-05-20T16:00:00Z',
    updatedAt: '2025-12-28T22:15:00Z',
    stats: {
      totalRuns: 8,
      successfulRuns: 7,
      failedRuns: 1,
      averageDuration: 45000,
    },
  },
  {
    id: 'auto-policy-violation-alert',
    name: 'Policy Violation Alert & Escalation',
    description:
      'Detects policy violations across the organization and triggers escalation procedures including manager notifications, HR alerts, and compliance team reviews.',
    cognateId: 'cog-compliance-monitor',
    spaceId: 'space-compliance',
    projectId: 'proj-policy-enforcement',
    riskLevel: 'medium',
    schedule: 'manual',
    status: 'active',
    requiresApproval: true,
    estimatedCost: 25,
    lastRunId: 'run-008',
    tags: ['compliance', 'policy', 'violations', 'escalation', 'hr'],
    version: '2.1.0',
    createdAt: '2024-07-12T10:30:00Z',
    updatedAt: '2025-11-30T15:00:00Z',
    stats: {
      totalRuns: 67,
      successfulRuns: 65,
      failedRuns: 2,
      averageDuration: 55000,
    },
  },
];

// ============================================================================
// EXPORTS
// ============================================================================

/** All automations combined */
export const mockAutomations: Automation[] = [...safeAutomations, ...riskyAutomations];

/** Only safe (low-risk) automations */
export const mockSafeAutomations: Automation[] = safeAutomations;

/** Only risky (approval-required) automations */
export const mockRiskyAutomations: Automation[] = riskyAutomations;

/** Get automation by ID */
export function getAutomationById(id: string): Automation | undefined {
  return mockAutomations.find((a) => a.id === id);
}

/** Get automations by Cognate ID */
export function getAutomationsByCognate(cognateId: string): Automation[] {
  return mockAutomations.filter((a) => a.cognateId === cognateId);
}

/** Get automations by Space ID */
export function getAutomationsBySpace(spaceId: string): Automation[] {
  return mockAutomations.filter((a) => a.spaceId === spaceId);
}

/** Get automations that require approval */
export function getApprovalRequiredAutomations(): Automation[] {
  return mockAutomations.filter((a) => a.requiresApproval);
}

/** Get automations by risk level */
export function getAutomationsByRiskLevel(riskLevel: AutomationRiskLevel): Automation[] {
  return mockAutomations.filter((a) => a.riskLevel === riskLevel);
}
