/**
 * Policy Mock Data
 *
 * Policies define governance rules and approval workflows that control
 * what actions Cognates can take autonomously and what requires human approval.
 *
 * This file provides centralized mock data for the 8 core policy types.
 */

// ============================================================================
// POLICY TYPES
// ============================================================================

export type PolicyScope =
  | 'global'
  | 'space'
  | 'project'
  | 'cognate'
  | 'automation'
  | 'user'
  | 'integration';

export type PolicyTriggerType =
  | 'action'
  | 'threshold'
  | 'schedule'
  | 'condition'
  | 'event'
  | 'manual';

export type ApproverType = 'user' | 'role' | 'group' | 'cognate' | 'system';

export type PolicyStatus = 'active' | 'draft' | 'disabled' | 'archived';

export interface PolicyTrigger {
  type: PolicyTriggerType;
  config: Record<string, unknown>;
  description?: string;
}

export interface PolicyApprover {
  type: ApproverType;
  id: string;
  name: string;
  fallbackId?: string;
  fallbackName?: string;
  timeout?: number; // minutes before fallback
}

export interface PolicyThreshold {
  metric: string;
  operator: 'lt' | 'lte' | 'gt' | 'gte' | 'eq' | 'neq' | 'between';
  value: number | string;
  valueTo?: number | string; // for 'between' operator
  unit?: string;
}

export interface PolicyEscalation {
  level: number;
  afterMinutes: number;
  approvers: PolicyApprover[];
  notification: {
    channels: ('email' | 'slack' | 'sms' | 'in_app')[];
    message: string;
  };
}

export interface Policy {
  id: string;
  name: string;
  description: string;
  status: PolicyStatus;
  scope: PolicyScope[];
  triggers: PolicyTrigger[];
  approvalRequired: boolean;
  approvers: PolicyApprover[];
  thresholds?: PolicyThreshold[];
  escalations?: PolicyEscalation[];
  autoApproveConditions?: Record<string, unknown>[];
  metadata: {
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    version: string;
    tags: string[];
  };
}

// ============================================================================
// MOCK POLICIES (8 total)
// ============================================================================

export const mockPolicies: Policy[] = [
  // 1. External Communications Policy
  {
    id: 'policy-external-comms',
    name: 'External Communications Policy',
    description: 'Requires approval for any external communications sent by Cognates to customers, partners, or public channels',
    status: 'active',
    scope: ['global', 'cognate', 'automation'],
    triggers: [
      {
        type: 'action',
        config: {
          actionTypes: ['send_email', 'send_slack_message', 'post_social', 'api_call_external'],
          destinationType: 'external',
        },
        description: 'Triggered when a Cognate attempts to send external communication',
      },
      {
        type: 'condition',
        config: {
          condition: 'recipient.domain NOT IN approved_domains',
        },
        description: 'Triggered for non-approved recipient domains',
      },
    ],
    approvalRequired: true,
    approvers: [
      {
        type: 'role',
        id: 'role-comms-approver',
        name: 'Communications Approver',
        fallbackId: 'role-admin',
        fallbackName: 'Administrator',
        timeout: 30,
      },
      {
        type: 'user',
        id: 'user-lisa-wang',
        name: 'Lisa Wang',
        timeout: 60,
      },
    ],
    autoApproveConditions: [
      {
        recipientDomain: ['symtexllc.com', 'symtex.io'],
        messageType: 'internal',
      },
      {
        template: 'approved_template',
        cognateAutonomyLevel: 'autonomous',
      },
    ],
    escalations: [
      {
        level: 1,
        afterMinutes: 30,
        approvers: [{ type: 'role', id: 'role-admin', name: 'Administrator' }],
        notification: {
          channels: ['slack', 'email'],
          message: 'External communication approval pending for over 30 minutes',
        },
      },
    ],
    metadata: {
      createdBy: 'system',
      createdAt: '2025-06-01T10:00:00Z',
      updatedAt: '2026-01-15T14:00:00Z',
      version: '2.1.0',
      tags: ['communications', 'external', 'customer-facing'],
    },
  },

  // 2. Budget Cap Policy
  {
    id: 'policy-budget-cap',
    name: 'Monthly Budget Cap Policy',
    description: 'Enforces monthly AI spend limits and requires approval when approaching or exceeding thresholds',
    status: 'active',
    scope: ['global', 'space', 'project'],
    triggers: [
      {
        type: 'threshold',
        config: {
          metric: 'monthly_ai_spend',
          checkInterval: 'hourly',
        },
        description: 'Monitors monthly AI spending against budget limits',
      },
      {
        type: 'action',
        config: {
          actionTypes: ['model_inference', 'api_call'],
          estimatedCost: { operator: 'gt', value: 10 },
        },
        description: 'Triggered for high-cost individual operations',
      },
    ],
    approvalRequired: true,
    approvers: [
      {
        type: 'role',
        id: 'role-finance-approver',
        name: 'Finance Approver',
        fallbackId: 'user-cfo',
        fallbackName: 'CFO',
        timeout: 120,
      },
    ],
    thresholds: [
      {
        metric: 'monthly_ai_spend',
        operator: 'gte',
        value: 8000,
        unit: 'USD',
      },
      {
        metric: 'monthly_ai_spend_percent',
        operator: 'gte',
        value: 80,
        unit: 'percent',
      },
      {
        metric: 'daily_token_usage',
        operator: 'gte',
        value: 1000000,
        unit: 'tokens',
      },
    ],
    escalations: [
      {
        level: 1,
        afterMinutes: 60,
        approvers: [{ type: 'role', id: 'role-admin', name: 'Administrator' }],
        notification: {
          channels: ['email', 'slack'],
          message: 'Budget threshold breach requires immediate attention',
        },
      },
      {
        level: 2,
        afterMinutes: 240,
        approvers: [{ type: 'user', id: 'user-cfo', name: 'CFO' }],
        notification: {
          channels: ['email', 'sms'],
          message: 'CRITICAL: Budget approval pending, operations may be paused',
        },
      },
    ],
    metadata: {
      createdBy: 'system',
      createdAt: '2025-05-01T10:00:00Z',
      updatedAt: '2026-01-10T09:00:00Z',
      version: '3.0.0',
      tags: ['budget', 'finance', 'limits', 'cost-control'],
    },
  },

  // 3. Data Access Policy
  {
    id: 'policy-data-access',
    name: 'Sensitive Data Access Policy',
    description: 'Controls access to PII, financial data, and other sensitive information by Cognates',
    status: 'active',
    scope: ['global', 'cognate', 'integration'],
    triggers: [
      {
        type: 'action',
        config: {
          actionTypes: ['read_data', 'write_data', 'export_data', 'share_data'],
          dataClassification: ['pii', 'financial', 'confidential', 'restricted'],
        },
        description: 'Triggered when accessing classified data',
      },
      {
        type: 'condition',
        config: {
          condition: 'data.contains_pii = true OR data.classification IN (financial, confidential)',
        },
        description: 'Triggered for sensitive data detection',
      },
    ],
    approvalRequired: true,
    approvers: [
      {
        type: 'role',
        id: 'role-data-steward',
        name: 'Data Steward',
        timeout: 15,
      },
      {
        type: 'role',
        id: 'role-compliance',
        name: 'Compliance Officer',
        fallbackId: 'user-sarah-chen',
        fallbackName: 'Sarah Chen',
        timeout: 30,
      },
    ],
    thresholds: [
      {
        metric: 'pii_records_accessed',
        operator: 'gt',
        value: 100,
        unit: 'records',
      },
      {
        metric: 'financial_data_export_size',
        operator: 'gt',
        value: 10,
        unit: 'MB',
      },
    ],
    autoApproveConditions: [
      {
        cognateId: 'cog-data-analyst',
        dataType: 'aggregated_metrics',
        containsPII: false,
      },
    ],
    metadata: {
      createdBy: 'user-sarah-chen',
      createdAt: '2025-07-01T10:00:00Z',
      updatedAt: '2026-01-18T11:00:00Z',
      version: '2.5.0',
      tags: ['data', 'privacy', 'pii', 'compliance', 'gdpr'],
    },
  },

  // 4. System Changes Policy
  {
    id: 'policy-system-changes',
    name: 'Configuration Changes Policy',
    description: 'Requires approval for any configuration or system changes made by Cognates',
    status: 'active',
    scope: ['global', 'cognate', 'automation'],
    triggers: [
      {
        type: 'action',
        config: {
          actionTypes: [
            'modify_config',
            'update_integration',
            'change_permissions',
            'deploy_automation',
            'modify_sop',
          ],
        },
        description: 'Triggered on system configuration changes',
      },
      {
        type: 'event',
        config: {
          eventTypes: ['config_change_detected', 'permission_modified'],
        },
        description: 'Triggered on detected configuration events',
      },
    ],
    approvalRequired: true,
    approvers: [
      {
        type: 'role',
        id: 'role-system-admin',
        name: 'System Administrator',
        timeout: 60,
      },
      {
        type: 'user',
        id: 'user-marcus-johnson',
        name: 'Marcus Johnson',
        fallbackId: 'role-admin',
        fallbackName: 'Administrator',
        timeout: 120,
      },
    ],
    autoApproveConditions: [
      {
        changeType: 'minor',
        riskLevel: 'low',
        testedInStaging: true,
      },
    ],
    metadata: {
      createdBy: 'user-marcus-johnson',
      createdAt: '2025-08-01T10:00:00Z',
      updatedAt: '2026-01-12T15:00:00Z',
      version: '1.8.0',
      tags: ['system', 'configuration', 'change-management', 'security'],
    },
  },

  // 5. Audit Submission Policy
  {
    id: 'policy-audit-submission',
    name: 'Audit Evidence Submission Policy',
    description: 'Requires multi-level approval for submitting audit evidence to external auditors',
    status: 'active',
    scope: ['global', 'cognate', 'user'],
    triggers: [
      {
        type: 'action',
        config: {
          actionTypes: ['submit_audit_evidence', 'share_with_auditor', 'generate_compliance_report'],
          destination: 'external_auditor',
        },
        description: 'Triggered when submitting evidence to external auditors',
      },
      {
        type: 'condition',
        config: {
          condition: 'document.classification = audit_evidence AND recipient.type = external',
        },
        description: 'Triggered for external audit document sharing',
      },
    ],
    approvalRequired: true,
    approvers: [
      {
        type: 'user',
        id: 'user-sarah-chen',
        name: 'Sarah Chen (VP Compliance)',
        timeout: 240,
      },
      {
        type: 'role',
        id: 'role-legal',
        name: 'Legal Team',
        timeout: 480,
      },
      {
        type: 'role',
        id: 'role-ciso',
        name: 'CISO',
        fallbackId: 'user-marcus-johnson',
        fallbackName: 'Marcus Johnson',
        timeout: 480,
      },
    ],
    escalations: [
      {
        level: 1,
        afterMinutes: 480,
        approvers: [{ type: 'user', id: 'user-ceo', name: 'CEO' }],
        notification: {
          channels: ['email', 'sms'],
          message: 'Audit submission approval urgently needed - audit deadline approaching',
        },
      },
    ],
    metadata: {
      createdBy: 'user-sarah-chen',
      createdAt: '2025-06-15T10:00:00Z',
      updatedAt: '2026-01-20T10:00:00Z',
      version: '2.0.0',
      tags: ['audit', 'compliance', 'soc2', 'evidence', 'multi-approval'],
    },
  },

  // 6. Threat Response Policy
  {
    id: 'policy-threat-response',
    name: 'Security Threat Response Policy',
    description: 'Governs automated containment actions during security incidents',
    status: 'active',
    scope: ['global', 'cognate', 'automation', 'integration'],
    triggers: [
      {
        type: 'event',
        config: {
          eventTypes: [
            'security_alert',
            'intrusion_detected',
            'anomaly_detected',
            'credential_compromise',
          ],
          severityLevels: ['high', 'critical'],
        },
        description: 'Triggered on security events',
      },
      {
        type: 'condition',
        config: {
          condition: 'threat_score >= 0.8 OR anomaly_score >= 0.9',
        },
        description: 'Triggered on high threat/anomaly scores',
      },
    ],
    approvalRequired: false, // Auto-containment allowed for high-severity threats
    approvers: [
      {
        type: 'user',
        id: 'user-marcus-johnson',
        name: 'Marcus Johnson (Security Lead)',
        timeout: 5,
      },
      {
        type: 'role',
        id: 'role-soc-analyst',
        name: 'SOC Analyst',
        timeout: 15,
      },
    ],
    thresholds: [
      {
        metric: 'threat_score',
        operator: 'gte',
        value: 0.8,
      },
      {
        metric: 'failed_login_attempts',
        operator: 'gte',
        value: 5,
        unit: 'attempts',
      },
      {
        metric: 'anomaly_score',
        operator: 'gte',
        value: 0.9,
      },
    ],
    autoApproveConditions: [
      {
        threatSeverity: 'critical',
        containmentType: ['block_ip', 'disable_account', 'quarantine_file'],
        autoContainmentEnabled: true,
      },
    ],
    escalations: [
      {
        level: 1,
        afterMinutes: 5,
        approvers: [
          { type: 'user', id: 'user-marcus-johnson', name: 'Marcus Johnson' },
        ],
        notification: {
          channels: ['sms', 'slack', 'email'],
          message: 'CRITICAL SECURITY ALERT: Immediate attention required',
        },
      },
      {
        level: 2,
        afterMinutes: 15,
        approvers: [{ type: 'role', id: 'role-ciso', name: 'CISO' }],
        notification: {
          channels: ['sms', 'email'],
          message: 'ESCALATION: Security incident unresolved after 15 minutes',
        },
      },
    ],
    metadata: {
      createdBy: 'user-marcus-johnson',
      createdAt: '2025-08-15T10:00:00Z',
      updatedAt: '2026-01-08T17:00:00Z',
      version: '3.2.0',
      tags: ['security', 'incident-response', 'containment', 'automated'],
    },
  },

  // 7. Working Hours Policy
  {
    id: 'policy-working-hours',
    name: 'Customer-Facing Working Hours Policy',
    description: 'Restricts customer-facing Cognate actions to business hours unless emergency override',
    status: 'active',
    scope: ['cognate', 'automation'],
    triggers: [
      {
        type: 'action',
        config: {
          actionTypes: ['customer_communication', 'support_response', 'sales_outreach'],
          cognateType: 'customer_facing',
        },
        description: 'Triggered for customer-facing actions',
      },
      {
        type: 'schedule',
        config: {
          businessHours: {
            timezone: 'America/Los_Angeles',
            start: '09:00',
            end: '17:00',
            days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          },
          checkOnExecution: true,
        },
        description: 'Checks against business hours schedule',
      },
    ],
    approvalRequired: true,
    approvers: [
      {
        type: 'role',
        id: 'role-cs-manager',
        name: 'Customer Success Manager',
        timeout: 30,
      },
    ],
    thresholds: [
      {
        metric: 'time_outside_business_hours',
        operator: 'gt',
        value: 0,
        unit: 'minutes',
      },
    ],
    autoApproveConditions: [
      {
        actionType: 'urgent_support_response',
        ticketPriority: 'critical',
        customerTier: 'enterprise',
      },
      {
        withinBusinessHours: true,
      },
    ],
    metadata: {
      createdBy: 'user-lisa-wang',
      createdAt: '2025-09-01T10:00:00Z',
      updatedAt: '2026-01-05T11:00:00Z',
      version: '1.5.0',
      tags: ['customer-facing', 'schedule', 'business-hours', 'support'],
    },
  },

  // 8. Rate Limit Policy
  {
    id: 'policy-rate-limit',
    name: 'Action Rate Limit Policy',
    description: 'Limits Cognate actions to maximum 100 per hour to prevent runaway automations',
    status: 'active',
    scope: ['global', 'cognate', 'automation'],
    triggers: [
      {
        type: 'threshold',
        config: {
          metric: 'actions_per_hour',
          checkInterval: 'per_minute',
          aggregateBy: 'cognate_id',
        },
        description: 'Monitors action rate per Cognate',
      },
      {
        type: 'condition',
        config: {
          condition: 'hourly_action_count >= 80',
        },
        description: 'Warning when approaching limit',
      },
    ],
    approvalRequired: true,
    approvers: [
      {
        type: 'role',
        id: 'role-system-admin',
        name: 'System Administrator',
        timeout: 15,
      },
    ],
    thresholds: [
      {
        metric: 'actions_per_hour',
        operator: 'gte',
        value: 100,
        unit: 'actions',
      },
      {
        metric: 'actions_per_minute',
        operator: 'gte',
        value: 10,
        unit: 'actions',
      },
      {
        metric: 'api_calls_per_hour',
        operator: 'gte',
        value: 500,
        unit: 'calls',
      },
    ],
    autoApproveConditions: [
      {
        cognateAutonomyLevel: 'autonomous',
        actionType: 'batch_processing',
        scheduledJob: true,
      },
    ],
    escalations: [
      {
        level: 1,
        afterMinutes: 5,
        approvers: [{ type: 'system', id: 'sys-auto-throttle', name: 'Auto Throttle' }],
        notification: {
          channels: ['in_app', 'slack'],
          message: 'Rate limit exceeded - Cognate actions throttled',
        },
      },
      {
        level: 2,
        afterMinutes: 30,
        approvers: [{ type: 'role', id: 'role-admin', name: 'Administrator' }],
        notification: {
          channels: ['email', 'slack'],
          message: 'Sustained rate limit breach - manual review required',
        },
      },
    ],
    metadata: {
      createdBy: 'system',
      createdAt: '2025-05-15T10:00:00Z',
      updatedAt: '2026-01-15T09:00:00Z',
      version: '2.3.0',
      tags: ['rate-limit', 'throttling', 'safety', 'runaway-prevention'],
    },
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getPolicyById(id: string): Policy | undefined {
  return mockPolicies.find((policy) => policy.id === id);
}

export function getPoliciesByScope(scope: PolicyScope): Policy[] {
  return mockPolicies.filter((policy) => policy.scope.includes(scope));
}

export function getActivePolicies(): Policy[] {
  return mockPolicies.filter((policy) => policy.status === 'active');
}

export function getPoliciesRequiringApproval(): Policy[] {
  return mockPolicies.filter((policy) => policy.approvalRequired && policy.status === 'active');
}

export function getPoliciesByTag(tag: string): Policy[] {
  return mockPolicies.filter((policy) => policy.metadata.tags.includes(tag));
}

export function checkPolicyThreshold(
  policy: Policy,
  metric: string,
  value: number
): { triggered: boolean; threshold?: PolicyThreshold } {
  if (!policy.thresholds) return { triggered: false };

  const threshold = policy.thresholds.find((t) => t.metric === metric);
  if (!threshold) return { triggered: false };

  let triggered = false;
  switch (threshold.operator) {
    case 'lt':
      triggered = value < Number(threshold.value);
      break;
    case 'lte':
      triggered = value <= Number(threshold.value);
      break;
    case 'gt':
      triggered = value > Number(threshold.value);
      break;
    case 'gte':
      triggered = value >= Number(threshold.value);
      break;
    case 'eq':
      triggered = value === Number(threshold.value);
      break;
    case 'neq':
      triggered = value !== Number(threshold.value);
      break;
    case 'between':
      triggered =
        value >= Number(threshold.value) && value <= Number(threshold.valueTo);
      break;
  }

  return { triggered, threshold };
}
