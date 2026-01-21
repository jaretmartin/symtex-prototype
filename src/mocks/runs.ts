/**
 * Mock Automation Run Data
 *
 * Centralized mock data for Automation Runs in Symtex Pro.
 * Distributed across various states: completed, running, awaiting_approval, failed, cancelled, pending.
 */

// ============================================================================
// TYPES
// ============================================================================

export type RunStatus =
  | 'pending'
  | 'running'
  | 'awaiting_approval'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface RunOutput {
  /** Summary of the run result */
  summary: string;
  /** Key metrics or data produced */
  metrics?: Record<string, number | string>;
  /** Artifacts generated */
  artifacts?: string[];
  /** Actions taken */
  actionsTaken?: string[];
}

export interface RunError {
  /** Error code */
  code: string;
  /** Human-readable error message */
  message: string;
  /** Stack trace or additional details */
  details?: string;
  /** Step where the error occurred */
  failedStep?: string;
}

export interface ApprovalRequest {
  /** Reason approval is required */
  reason: string;
  /** User IDs who can approve */
  approvers: string[];
  /** Actions that will be taken if approved */
  pendingActions: string[];
  /** Deadline for approval */
  deadline: string;
}

export interface AutomationRun {
  /** Unique identifier */
  id: string;
  /** ID of the automation that was executed */
  automationId: string;
  /** ID of the Cognate that executed this run */
  cognateId: string;
  /** Current status */
  status: RunStatus;
  /** When the run started */
  startedAt: string;
  /** When the run completed (null if still running) */
  completedAt: string | null;
  /** Cost in credits */
  cost: number;
  /** Output data for completed runs */
  output?: RunOutput;
  /** Error information for failed runs */
  error?: RunError;
  /** Trace ID for debugging and audit */
  traceId: string;
  /** Progress percentage for running jobs (0-100) */
  progress?: number;
  /** Current step being executed */
  currentStep?: string;
  /** Approval details for awaiting_approval status */
  approvalRequest?: ApprovalRequest;
  /** Who triggered the run */
  triggeredBy: 'schedule' | 'manual' | 'event' | 'api';
  /** User ID if manually triggered */
  triggeredByUserId?: string;
  /** Duration in milliseconds */
  duration?: number;
}

// ============================================================================
// HELPER - Generate trace IDs
// ============================================================================

function generateTraceId(runNumber: number): string {
  const prefix = 'trc';
  const timestamp = Date.now().toString(36);
  const suffix = runNumber.toString(16).padStart(4, '0');
  return `${prefix}-${timestamp}-${suffix}`;
}

// ============================================================================
// MOCK DATA - COMPLETED RUNS (8)
// ============================================================================

const completedRuns: AutomationRun[] = [
  {
    id: 'run-001',
    automationId: 'auto-daily-compliance-report',
    cognateId: 'cog-compliance-monitor',
    status: 'completed',
    startedAt: '2026-01-21T06:00:00Z',
    completedAt: '2026-01-21T06:00:45Z',
    cost: 12,
    output: {
      summary: 'Daily compliance report generated successfully. All systems compliant.',
      metrics: {
        systemsScanned: 47,
        violationsFound: 0,
        complianceScore: 98.5,
        reportPages: 24,
      },
      artifacts: [
        'compliance-report-2026-01-21.pdf',
        'compliance-metrics-2026-01-21.json',
      ],
      actionsTaken: [
        'Scanned 47 systems for compliance',
        'Generated executive summary',
        'Distributed to compliance team',
      ],
    },
    traceId: generateTraceId(1),
    triggeredBy: 'schedule',
    duration: 45000,
  },
  {
    id: 'run-002',
    automationId: 'auto-lead-score-update',
    cognateId: 'cog-revenue-analyst',
    status: 'completed',
    startedAt: '2026-01-21T12:00:00Z',
    completedAt: '2026-01-21T12:00:32Z',
    cost: 8,
    output: {
      summary: 'Lead scores updated for 1,247 active leads based on recent engagement.',
      metrics: {
        leadsProcessed: 1247,
        scoresUpdated: 342,
        avgScoreChange: 7.3,
        newHotLeads: 18,
      },
      actionsTaken: [
        'Analyzed 3-day engagement window',
        'Updated CRM lead scores',
        'Flagged 18 new hot leads',
        'Notified sales team',
      ],
    },
    traceId: generateTraceId(2),
    triggeredBy: 'schedule',
    duration: 32000,
  },
  {
    id: 'run-003',
    automationId: 'auto-renewal-reminder',
    cognateId: 'cog-customer-success',
    status: 'completed',
    startedAt: '2026-01-20T09:00:00Z',
    completedAt: '2026-01-20T09:02:00Z',
    cost: 15,
    output: {
      summary: 'Identified 23 contracts approaching renewal. Drafts prepared.',
      metrics: {
        contractsReviewed: 156,
        renewalsDue: 23,
        totalRevenue: 2450000,
        draftsPrepared: 23,
      },
      artifacts: [
        'renewal-queue-2026-01-20.csv',
        'outreach-drafts-batch-47.zip',
      ],
      actionsTaken: [
        'Scanned all active contracts',
        'Generated personalized outreach drafts',
        'Prioritized by account value',
        'Added to CS team queue',
      ],
    },
    traceId: generateTraceId(3),
    triggeredBy: 'schedule',
    duration: 120000,
  },
  {
    id: 'run-004',
    automationId: 'auto-log-analysis',
    cognateId: 'cog-threat-hunter',
    status: 'completed',
    startedAt: '2026-01-21T14:30:00Z',
    completedAt: '2026-01-21T14:30:18Z',
    cost: 5,
    output: {
      summary: 'Log analysis complete. No critical threats detected. 2 minor anomalies flagged.',
      metrics: {
        logsProcessed: 847293,
        anomaliesDetected: 2,
        criticalThreats: 0,
        falsePositives: 1,
      },
      actionsTaken: [
        'Processed 847K log entries',
        'Applied threat detection models',
        'Flagged 2 anomalies for review',
        'Updated threat baseline',
      ],
    },
    traceId: generateTraceId(4),
    triggeredBy: 'schedule',
    duration: 18000,
  },
  {
    id: 'run-005',
    automationId: 'auto-evidence-submission',
    cognateId: 'cog-audit-collector',
    status: 'completed',
    startedAt: '2026-01-15T14:00:00Z',
    completedAt: '2026-01-15T14:05:00Z',
    cost: 45,
    output: {
      summary: 'SOC2 evidence package submitted to auditors. Confirmation received.',
      metrics: {
        documentsIncluded: 127,
        controlsCovered: 42,
        attestationsSigned: 5,
        submissionId: 'SOC2-2026-Q1-001',
      },
      artifacts: [
        'soc2-evidence-package-q1-2026.zip',
        'submission-confirmation.pdf',
        'auditor-receipt.pdf',
      ],
      actionsTaken: [
        'Compiled evidence from 12 systems',
        'Verified document integrity',
        'Obtained required attestations',
        'Submitted to external auditor portal',
      ],
    },
    traceId: generateTraceId(5),
    triggeredBy: 'manual',
    triggeredByUserId: 'user-sarah-chen',
    duration: 300000,
  },
  {
    id: 'run-009',
    automationId: 'auto-daily-compliance-report',
    cognateId: 'cog-compliance-monitor',
    status: 'completed',
    startedAt: '2026-01-20T06:00:00Z',
    completedAt: '2026-01-20T06:00:48Z',
    cost: 12,
    output: {
      summary: 'Daily compliance report generated. 1 minor policy deviation noted.',
      metrics: {
        systemsScanned: 47,
        violationsFound: 1,
        complianceScore: 97.8,
        reportPages: 26,
      },
      artifacts: [
        'compliance-report-2026-01-20.pdf',
        'compliance-metrics-2026-01-20.json',
        'deviation-notice-PD-2026-0120.pdf',
      ],
      actionsTaken: [
        'Scanned 47 systems for compliance',
        'Documented policy deviation',
        'Generated executive summary',
        'Escalated deviation to policy team',
      ],
    },
    traceId: generateTraceId(9),
    triggeredBy: 'schedule',
    duration: 48000,
  },
  {
    id: 'run-010',
    automationId: 'auto-lead-score-update',
    cognateId: 'cog-revenue-analyst',
    status: 'completed',
    startedAt: '2026-01-21T08:00:00Z',
    completedAt: '2026-01-21T08:00:29Z',
    cost: 8,
    output: {
      summary: 'Morning lead score refresh completed. 15 leads upgraded to hot.',
      metrics: {
        leadsProcessed: 1234,
        scoresUpdated: 287,
        avgScoreChange: 5.1,
        newHotLeads: 15,
      },
      actionsTaken: [
        'Analyzed overnight engagement data',
        'Updated CRM lead scores',
        'Flagged 15 new hot leads',
        'Sent morning digest to sales',
      ],
    },
    traceId: generateTraceId(10),
    triggeredBy: 'schedule',
    duration: 29000,
  },
  {
    id: 'run-011',
    automationId: 'auto-log-analysis',
    cognateId: 'cog-threat-hunter',
    status: 'completed',
    startedAt: '2026-01-21T14:00:00Z',
    completedAt: '2026-01-21T14:00:17Z',
    cost: 5,
    output: {
      summary: 'Log analysis complete. All clear - no anomalies detected.',
      metrics: {
        logsProcessed: 823145,
        anomaliesDetected: 0,
        criticalThreats: 0,
        falsePositives: 0,
      },
      actionsTaken: [
        'Processed 823K log entries',
        'Applied threat detection models',
        'No actions required',
        'Updated baseline metrics',
      ],
    },
    traceId: generateTraceId(11),
    triggeredBy: 'schedule',
    duration: 17000,
  },
];

// ============================================================================
// MOCK DATA - RUNNING RUNS (3)
// ============================================================================

const runningRuns: AutomationRun[] = [
  {
    id: 'run-012',
    automationId: 'auto-daily-compliance-report',
    cognateId: 'cog-compliance-monitor',
    status: 'running',
    startedAt: '2026-01-21T15:00:00Z',
    completedAt: null,
    cost: 0,
    progress: 67,
    currentStep: 'Analyzing compliance data from finance systems',
    traceId: generateTraceId(12),
    triggeredBy: 'manual',
    triggeredByUserId: 'user-mike-johnson',
  },
  {
    id: 'run-013',
    automationId: 'auto-lead-score-update',
    cognateId: 'cog-revenue-analyst',
    status: 'running',
    startedAt: '2026-01-21T15:02:00Z',
    completedAt: null,
    cost: 0,
    progress: 34,
    currentStep: 'Processing engagement data from marketing platform',
    traceId: generateTraceId(13),
    triggeredBy: 'schedule',
  },
  {
    id: 'run-014',
    automationId: 'auto-log-analysis',
    cognateId: 'cog-threat-hunter',
    status: 'running',
    startedAt: '2026-01-21T15:00:00Z',
    completedAt: null,
    cost: 0,
    progress: 89,
    currentStep: 'Finalizing threat assessment report',
    traceId: generateTraceId(14),
    triggeredBy: 'schedule',
  },
];

// ============================================================================
// MOCK DATA - AWAITING APPROVAL RUNS (3)
// ============================================================================

const awaitingApprovalRuns: AutomationRun[] = [
  {
    id: 'run-006',
    automationId: 'auto-customer-outreach',
    cognateId: 'cog-customer-success',
    status: 'awaiting_approval',
    startedAt: '2026-01-21T10:00:00Z',
    completedAt: null,
    cost: 0,
    traceId: generateTraceId(6),
    triggeredBy: 'manual',
    triggeredByUserId: 'user-emily-rodriguez',
    approvalRequest: {
      reason:
        'This automation will send personalized emails to 47 enterprise customers. External communication requires approval.',
      approvers: ['user-sarah-chen', 'user-david-kim', 'user-admin'],
      pendingActions: [
        'Send 47 personalized outreach emails',
        'Update CRM engagement records',
        'Schedule follow-up tasks for CS team',
      ],
      deadline: '2026-01-22T10:00:00Z',
    },
  },
  {
    id: 'run-007',
    automationId: 'auto-threat-containment',
    cognateId: 'cog-incident-responder',
    status: 'awaiting_approval',
    startedAt: '2026-01-21T13:45:00Z',
    completedAt: null,
    cost: 0,
    traceId: generateTraceId(7),
    triggeredBy: 'event',
    approvalRequest: {
      reason:
        'Suspicious activity detected from IP 203.45.67.89. Containment actions require immediate approval.',
      approvers: ['user-security-lead', 'user-ciso', 'user-admin'],
      pendingActions: [
        'Block IP address 203.45.67.89 at firewall',
        'Revoke 3 potentially compromised API tokens',
        'Isolate affected workstation WS-ACCT-042',
        'Trigger incident response playbook IR-003',
      ],
      deadline: '2026-01-21T14:45:00Z',
    },
  },
  {
    id: 'run-008',
    automationId: 'auto-policy-violation-alert',
    cognateId: 'cog-compliance-monitor',
    status: 'awaiting_approval',
    startedAt: '2026-01-21T11:30:00Z',
    completedAt: null,
    cost: 0,
    traceId: generateTraceId(8),
    triggeredBy: 'event',
    approvalRequest: {
      reason:
        'Data retention policy violation detected. Employee attempted to copy customer PII to personal cloud storage.',
      approvers: ['user-hr-director', 'user-compliance-officer', 'user-legal'],
      pendingActions: [
        'Notify employee direct manager',
        'Send formal violation notice to employee',
        'Create HR incident record',
        'Schedule compliance remediation training',
      ],
      deadline: '2026-01-22T11:30:00Z',
    },
  },
];

// ============================================================================
// MOCK DATA - FAILED RUNS (2)
// ============================================================================

const failedRuns: AutomationRun[] = [
  {
    id: 'run-015',
    automationId: 'auto-evidence-submission',
    cognateId: 'cog-audit-collector',
    status: 'failed',
    startedAt: '2026-01-18T14:00:00Z',
    completedAt: '2026-01-18T14:02:30Z',
    cost: 15,
    traceId: generateTraceId(15),
    triggeredBy: 'manual',
    triggeredByUserId: 'user-sarah-chen',
    duration: 150000,
    error: {
      code: 'EXT_API_TIMEOUT',
      message: 'External auditor API timed out after 120 seconds',
      details:
        'Connection to auditor-portal.compliance-partner.com timed out. The external service may be experiencing high load or maintenance.',
      failedStep: 'Submit evidence package to auditor portal',
    },
  },
  {
    id: 'run-016',
    automationId: 'auto-customer-outreach',
    cognateId: 'cog-customer-success',
    status: 'failed',
    startedAt: '2026-01-19T09:00:00Z',
    completedAt: '2026-01-19T09:01:15Z',
    cost: 8,
    traceId: generateTraceId(16),
    triggeredBy: 'manual',
    triggeredByUserId: 'user-emily-rodriguez',
    duration: 75000,
    error: {
      code: 'VALIDATION_ERROR',
      message: 'Email template validation failed: Missing required merge field',
      details:
        'Template "enterprise-renewal-v3" references merge field {{contract.end_date}} which is not available in 12 customer records.',
      failedStep: 'Validate email templates and merge data',
    },
  },
];

// ============================================================================
// MOCK DATA - CANCELLED RUNS (2)
// ============================================================================

const cancelledRuns: AutomationRun[] = [
  {
    id: 'run-017',
    automationId: 'auto-threat-containment',
    cognateId: 'cog-incident-responder',
    status: 'cancelled',
    startedAt: '2026-01-17T16:20:00Z',
    completedAt: '2026-01-17T16:25:00Z',
    cost: 0,
    traceId: generateTraceId(17),
    triggeredBy: 'event',
    duration: 300000,
    output: {
      summary: 'Containment cancelled - threat determined to be false positive after manual review.',
      actionsTaken: [
        'Initial threat assessment completed',
        'Manual investigation initiated',
        'False positive confirmed by security analyst',
        'Run cancelled by user-security-lead',
      ],
    },
  },
  {
    id: 'run-018',
    automationId: 'auto-policy-violation-alert',
    cognateId: 'cog-compliance-monitor',
    status: 'cancelled',
    startedAt: '2026-01-16T14:00:00Z',
    completedAt: '2026-01-16T14:10:00Z',
    cost: 5,
    traceId: generateTraceId(18),
    triggeredBy: 'event',
    duration: 600000,
    output: {
      summary:
        'Alert cancelled - activity was pre-authorized by compliance team for data migration project.',
      actionsTaken: [
        'Violation pattern detected',
        'Cross-referenced with authorized activities',
        'Found matching exemption EX-2026-0115',
        'Run cancelled - no action required',
      ],
    },
  },
];

// ============================================================================
// MOCK DATA - PENDING RUNS (2)
// ============================================================================

const pendingRuns: AutomationRun[] = [
  {
    id: 'run-019',
    automationId: 'auto-renewal-reminder',
    cognateId: 'cog-customer-success',
    status: 'pending',
    startedAt: '2026-01-27T09:00:00Z',
    completedAt: null,
    cost: 0,
    traceId: generateTraceId(19),
    triggeredBy: 'schedule',
  },
  {
    id: 'run-020',
    automationId: 'auto-evidence-submission',
    cognateId: 'cog-audit-collector',
    status: 'pending',
    startedAt: '2026-01-28T14:00:00Z',
    completedAt: null,
    cost: 0,
    traceId: generateTraceId(20),
    triggeredBy: 'manual',
    triggeredByUserId: 'user-sarah-chen',
  },
];

// ============================================================================
// EXPORTS
// ============================================================================

/** All runs combined */
export const mockRuns: AutomationRun[] = [
  ...completedRuns,
  ...runningRuns,
  ...awaitingApprovalRuns,
  ...failedRuns,
  ...cancelledRuns,
  ...pendingRuns,
];

/** Runs by status */
export const mockCompletedRuns: AutomationRun[] = completedRuns;
export const mockRunningRuns: AutomationRun[] = runningRuns;
export const mockAwaitingApprovalRuns: AutomationRun[] = awaitingApprovalRuns;
export const mockFailedRuns: AutomationRun[] = failedRuns;
export const mockCancelledRuns: AutomationRun[] = cancelledRuns;
export const mockPendingRuns: AutomationRun[] = pendingRuns;

/** Get run by ID */
export function getRunById(id: string): AutomationRun | undefined {
  return mockRuns.find((r) => r.id === id);
}

/** Get runs by automation ID */
export function getRunsByAutomation(automationId: string): AutomationRun[] {
  return mockRuns.filter((r) => r.automationId === automationId);
}

/** Get runs by Cognate ID */
export function getRunsByCognate(cognateId: string): AutomationRun[] {
  return mockRuns.filter((r) => r.cognateId === cognateId);
}

/** Get runs by status */
export function getRunsByStatus(status: RunStatus): AutomationRun[] {
  return mockRuns.filter((r) => r.status === status);
}

/** Get runs requiring approval */
export function getRunsAwaitingApproval(): AutomationRun[] {
  return mockRuns.filter((r) => r.status === 'awaiting_approval');
}

/** Get recent runs (last N) */
export function getRecentRuns(count: number = 10): AutomationRun[] {
  return [...mockRuns]
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
    .slice(0, count);
}

/** Get runs statistics */
export function getRunStats(): {
  total: number;
  completed: number;
  running: number;
  awaitingApproval: number;
  failed: number;
  cancelled: number;
  pending: number;
  successRate: number;
  totalCost: number;
} {
  const completed = completedRuns.length;
  const failed = failedRuns.length;
  const totalFinished = completed + failed;

  return {
    total: mockRuns.length,
    completed,
    running: runningRuns.length,
    awaitingApproval: awaitingApprovalRuns.length,
    failed,
    cancelled: cancelledRuns.length,
    pending: pendingRuns.length,
    successRate: totalFinished > 0 ? Math.round((completed / totalFinished) * 100) : 100,
    totalCost: mockRuns.reduce((sum, r) => sum + r.cost, 0),
  };
}
