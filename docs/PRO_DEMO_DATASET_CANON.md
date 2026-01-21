# PRO_DEMO_DATASET_CANON.md

> Symtex Pro - Canonical Mock Dataset Definition
> Version: 1.0.0 | Last Updated: 2026-01-21

---

## 1. Overview

This document defines the complete mock dataset for the Symtex Pro demo. All entities have stable IDs, realistic enterprise content, and well-defined relationships.

**Entity Counts:**
| Entity | Count | Status |
|--------|-------|--------|
| Spaces | 3 | Required |
| Projects | 6 | Required |
| Cognates | 6 | Required |
| Automations | 8 | Required |
| Runs | 20 | Required |
| Knowledge Items | 40 | Required |
| NEXIS Entities | 15 | Required |
| Templates | 12 | Required |
| Policies | 8 | Required |
| Audit Events | 25 | Required |

---

## 2. Spaces (3)

### Space 1: Compliance Ops
```typescript
{
  id: 'space-compliance-ops',
  name: 'Compliance Ops',
  slug: 'compliance-ops',
  description: 'Regulatory compliance automation and monitoring',
  icon: 'shield-check',
  color: '#3b82f6', // Blue
  createdAt: '2024-06-15T00:00:00Z',
  settings: {
    defaultAutonomy: 'L2',
    requireApproval: true,
    budgetLimit: 5000
  }
}
```

### Space 2: Revenue Ops
```typescript
{
  id: 'space-revenue-ops',
  name: 'Revenue Ops',
  slug: 'revenue-ops',
  description: 'Sales pipeline and customer success automation',
  icon: 'trending-up',
  color: '#22c55e', // Green
  createdAt: '2024-07-01T00:00:00Z',
  settings: {
    defaultAutonomy: 'L3',
    requireApproval: false,
    budgetLimit: 10000
  }
}
```

### Space 3: Security Ops
```typescript
{
  id: 'space-security-ops',
  name: 'Security Ops',
  slug: 'security-ops',
  description: 'Threat detection and incident response',
  icon: 'lock',
  color: '#ef4444', // Red
  createdAt: '2024-08-01T00:00:00Z',
  settings: {
    defaultAutonomy: 'L1',
    requireApproval: true,
    budgetLimit: 3000
  }
}
```

---

## 3. Projects (6)

### Compliance Ops Projects

```typescript
// Project 1.1
{
  id: 'proj-audit-automation',
  name: 'Audit Automation',
  slug: 'audit-automation',
  spaceId: 'space-compliance-ops',
  description: 'Automate quarterly SOC2 audit evidence collection',
  status: 'active',
  priority: 'high',
  createdAt: '2024-06-20T00:00:00Z'
}

// Project 1.2
{
  id: 'proj-policy-monitoring',
  name: 'Policy Monitoring',
  slug: 'policy-monitoring',
  spaceId: 'space-compliance-ops',
  description: 'Continuous monitoring for policy violations',
  status: 'active',
  priority: 'critical',
  createdAt: '2024-07-05T00:00:00Z'
}
```

### Revenue Ops Projects

```typescript
// Project 2.1
{
  id: 'proj-lead-scoring',
  name: 'Lead Scoring',
  slug: 'lead-scoring',
  spaceId: 'space-revenue-ops',
  description: 'AI-powered lead qualification and scoring',
  status: 'active',
  priority: 'high',
  createdAt: '2024-07-15T00:00:00Z'
}

// Project 2.2
{
  id: 'proj-renewal-management',
  name: 'Renewal Management',
  slug: 'renewal-management',
  spaceId: 'space-revenue-ops',
  description: 'Proactive customer renewal and expansion',
  status: 'active',
  priority: 'medium',
  createdAt: '2024-08-01T00:00:00Z'
}
```

### Security Ops Projects

```typescript
// Project 3.1
{
  id: 'proj-threat-detection',
  name: 'Threat Detection',
  slug: 'threat-detection',
  spaceId: 'space-security-ops',
  description: 'Real-time threat identification and alerting',
  status: 'active',
  priority: 'critical',
  createdAt: '2024-08-10T00:00:00Z'
}

// Project 3.2
{
  id: 'proj-incident-response',
  name: 'Incident Response',
  slug: 'incident-response',
  spaceId: 'space-security-ops',
  description: 'Automated incident triage and response',
  status: 'active',
  priority: 'critical',
  createdAt: '2024-08-15T00:00:00Z'
}
```

---

## 4. Cognates (6)

### Cognate 1: Compliance Monitor
```typescript
{
  id: 'cog-compliance-monitor',
  name: 'Compliance Monitor',
  slug: 'compliance-monitor',
  avatar: '/avatars/cognate-compliance.png',
  description: 'Monitors regulatory requirements and flags compliance gaps',
  autonomyLevel: 'L2', // Can act with human review
  skills: ['regulatory-analysis', 'document-review', 'gap-assessment', 'reporting'],
  assignedSpaces: ['space-compliance-ops'],
  sopCount: 12,
  packIds: ['pack-soc2', 'pack-gdpr'],
  status: 'active',
  stats: {
    tasksCompleted: 156,
    accuracyScore: 0.94,
    avgResponseTime: '2.3 min'
  }
}
```

### Cognate 2: Audit Collector
```typescript
{
  id: 'cog-audit-collector',
  name: 'Audit Collector',
  slug: 'audit-collector',
  avatar: '/avatars/cognate-audit.png',
  description: 'Gathers and organizes evidence for compliance audits',
  autonomyLevel: 'L3', // Can act autonomously on safe tasks
  skills: ['evidence-collection', 'document-classification', 'timeline-assembly'],
  assignedSpaces: ['space-compliance-ops'],
  sopCount: 8,
  packIds: ['pack-soc2', 'pack-evidence'],
  status: 'active',
  stats: {
    tasksCompleted: 89,
    accuracyScore: 0.97,
    avgResponseTime: '5.1 min'
  }
}
```

### Cognate 3: Revenue Analyst
```typescript
{
  id: 'cog-revenue-analyst',
  name: 'Revenue Analyst',
  slug: 'revenue-analyst',
  avatar: '/avatars/cognate-revenue.png',
  description: 'Analyzes sales data and identifies growth opportunities',
  autonomyLevel: 'L3',
  skills: ['data-analysis', 'forecasting', 'opportunity-identification', 'reporting'],
  assignedSpaces: ['space-revenue-ops'],
  sopCount: 15,
  packIds: ['pack-salesforce', 'pack-analytics'],
  status: 'active',
  stats: {
    tasksCompleted: 234,
    accuracyScore: 0.91,
    avgResponseTime: '1.8 min'
  }
}
```

### Cognate 4: Customer Success
```typescript
{
  id: 'cog-customer-success',
  name: 'Customer Success',
  slug: 'customer-success',
  avatar: '/avatars/cognate-cs.png',
  description: 'Proactively engages customers and manages renewals',
  autonomyLevel: 'L2',
  skills: ['customer-outreach', 'health-scoring', 'renewal-tracking', 'escalation'],
  assignedSpaces: ['space-revenue-ops'],
  sopCount: 10,
  packIds: ['pack-zendesk', 'pack-email'],
  status: 'active',
  stats: {
    tasksCompleted: 312,
    accuracyScore: 0.88,
    avgResponseTime: '3.2 min'
  }
}
```

### Cognate 5: Threat Hunter
```typescript
{
  id: 'cog-threat-hunter',
  name: 'Threat Hunter',
  slug: 'threat-hunter',
  avatar: '/avatars/cognate-threat.png',
  description: 'Proactively searches for security threats and vulnerabilities',
  autonomyLevel: 'L1', // High-risk, requires approval
  skills: ['threat-analysis', 'log-correlation', 'anomaly-detection', 'ioc-identification'],
  assignedSpaces: ['space-security-ops'],
  sopCount: 18,
  packIds: ['pack-siem', 'pack-threat-intel'],
  status: 'active',
  stats: {
    tasksCompleted: 67,
    accuracyScore: 0.96,
    avgResponseTime: '8.5 min'
  }
}
```

### Cognate 6: Incident Responder
```typescript
{
  id: 'cog-incident-responder',
  name: 'Incident Responder',
  slug: 'incident-responder',
  avatar: '/avatars/cognate-incident.png',
  description: 'Triages and responds to security incidents',
  autonomyLevel: 'L1',
  skills: ['incident-triage', 'containment', 'forensics', 'communication'],
  assignedSpaces: ['space-security-ops'],
  sopCount: 22,
  packIds: ['pack-siem', 'pack-ticketing', 'pack-slack'],
  status: 'active',
  stats: {
    tasksCompleted: 45,
    accuracyScore: 0.93,
    avgResponseTime: '4.7 min'
  }
}
```

---

## 5. Automations (8)

### Safe Automations (Low Risk)

```typescript
// Automation 1: Daily Compliance Report
{
  id: 'auto-daily-compliance-report',
  name: 'Daily Compliance Report',
  description: 'Generates daily summary of compliance status and pending items',
  cognateId: 'cog-compliance-monitor',
  spaceId: 'space-compliance-ops',
  projectId: 'proj-policy-monitoring',
  riskLevel: 'low',
  schedule: '0 8 * * *', // Daily at 8am
  status: 'active',
  requiresApproval: false,
  estimatedCost: 0.50,
  lastRunId: 'run-001'
}

// Automation 2: Lead Score Update
{
  id: 'auto-lead-score-update',
  name: 'Lead Score Update',
  description: 'Updates lead scores based on recent engagement signals',
  cognateId: 'cog-revenue-analyst',
  spaceId: 'space-revenue-ops',
  projectId: 'proj-lead-scoring',
  riskLevel: 'low',
  schedule: '0 */4 * * *', // Every 4 hours
  status: 'active',
  requiresApproval: false,
  estimatedCost: 0.25,
  lastRunId: 'run-002'
}

// Automation 3: Renewal Reminder
{
  id: 'auto-renewal-reminder',
  name: 'Renewal Reminder',
  description: 'Sends renewal reminders 30 days before contract expiry',
  cognateId: 'cog-customer-success',
  spaceId: 'space-revenue-ops',
  projectId: 'proj-renewal-management',
  riskLevel: 'low',
  schedule: '0 9 * * 1', // Monday 9am
  status: 'active',
  requiresApproval: false,
  estimatedCost: 0.35,
  lastRunId: 'run-003'
}

// Automation 4: Log Analysis
{
  id: 'auto-log-analysis',
  name: 'Security Log Analysis',
  description: 'Analyzes security logs for anomalies and patterns',
  cognateId: 'cog-threat-hunter',
  spaceId: 'space-security-ops',
  projectId: 'proj-threat-detection',
  riskLevel: 'low',
  schedule: '*/30 * * * *', // Every 30 minutes
  status: 'active',
  requiresApproval: false,
  estimatedCost: 0.15,
  lastRunId: 'run-004'
}
```

### Risky Automations (High Risk)

```typescript
// Automation 5: Evidence Submission
{
  id: 'auto-evidence-submission',
  name: 'Audit Evidence Submission',
  description: 'Submits collected evidence to external audit portal',
  cognateId: 'cog-audit-collector',
  spaceId: 'space-compliance-ops',
  projectId: 'proj-audit-automation',
  riskLevel: 'high',
  schedule: null, // Manual trigger
  status: 'active',
  requiresApproval: true,
  estimatedCost: 2.50,
  lastRunId: 'run-005'
}

// Automation 6: Customer Outreach
{
  id: 'auto-customer-outreach',
  name: 'Proactive Customer Outreach',
  description: 'Sends personalized outreach emails to at-risk customers',
  cognateId: 'cog-customer-success',
  spaceId: 'space-revenue-ops',
  projectId: 'proj-renewal-management',
  riskLevel: 'high',
  schedule: null,
  status: 'active',
  requiresApproval: true,
  estimatedCost: 1.75,
  lastRunId: 'run-006'
}

// Automation 7: Threat Containment
{
  id: 'auto-threat-containment',
  name: 'Automated Threat Containment',
  description: 'Isolates compromised systems and blocks malicious IPs',
  cognateId: 'cog-incident-responder',
  spaceId: 'space-security-ops',
  projectId: 'proj-incident-response',
  riskLevel: 'critical',
  schedule: null,
  status: 'active',
  requiresApproval: true,
  estimatedCost: 5.00,
  lastRunId: 'run-007'
}

// Automation 8: Policy Violation Alert
{
  id: 'auto-policy-violation-alert',
  name: 'Policy Violation Escalation',
  description: 'Escalates critical policy violations to leadership',
  cognateId: 'cog-compliance-monitor',
  spaceId: 'space-compliance-ops',
  projectId: 'proj-policy-monitoring',
  riskLevel: 'medium',
  schedule: null,
  status: 'active',
  requiresApproval: true,
  estimatedCost: 0.75,
  lastRunId: 'run-008'
}
```

---

## 6. Runs (20)

### Run States Distribution
| State | Count |
|-------|-------|
| completed | 8 |
| running | 3 |
| awaiting_approval | 3 |
| failed | 2 |
| cancelled | 2 |
| pending | 2 |

### Sample Runs

```typescript
// Run 1-8: Completed runs
{
  id: 'run-001',
  automationId: 'auto-daily-compliance-report',
  cognateId: 'cog-compliance-monitor',
  status: 'completed',
  startedAt: '2026-01-21T08:00:00Z',
  completedAt: '2026-01-21T08:02:30Z',
  cost: 0.48,
  output: { reportUrl: '/reports/compliance-2026-01-21.pdf' },
  traceId: 'trace-001'
}

// Run 9-11: Running
{
  id: 'run-009',
  automationId: 'auto-log-analysis',
  cognateId: 'cog-threat-hunter',
  status: 'running',
  startedAt: '2026-01-21T14:30:00Z',
  completedAt: null,
  cost: 0.08,
  progress: 65,
  currentStep: 'Correlating log entries'
}

// Run 12-14: Awaiting approval
{
  id: 'run-012',
  automationId: 'auto-customer-outreach',
  cognateId: 'cog-customer-success',
  status: 'awaiting_approval',
  startedAt: '2026-01-21T10:00:00Z',
  completedAt: null,
  cost: 0.00,
  approvalReason: 'High-risk: Will send emails to 15 customers',
  policyId: 'policy-external-comms'
}

// Run 15-16: Failed
{
  id: 'run-015',
  automationId: 'auto-evidence-submission',
  cognateId: 'cog-audit-collector',
  status: 'failed',
  startedAt: '2026-01-20T15:00:00Z',
  completedAt: '2026-01-20T15:05:00Z',
  cost: 1.20,
  error: 'Connection timeout to audit portal',
  errorCode: 'EXTERNAL_SERVICE_TIMEOUT'
}

// Run 17-18: Cancelled
{
  id: 'run-017',
  automationId: 'auto-threat-containment',
  cognateId: 'cog-incident-responder',
  status: 'cancelled',
  startedAt: '2026-01-19T22:00:00Z',
  completedAt: '2026-01-19T22:01:00Z',
  cost: 0.25,
  cancelledBy: 'user-admin',
  cancelReason: 'False positive - friendly security test'
}

// Run 19-20: Pending
{
  id: 'run-019',
  automationId: 'auto-renewal-reminder',
  cognateId: 'cog-customer-success',
  status: 'pending',
  scheduledFor: '2026-01-22T09:00:00Z',
  cost: 0.00
}
```

---

## 7. Knowledge Items (40)

### Distribution
| Type | Count |
|------|-------|
| Document | 15 |
| Policy | 8 |
| Procedure | 10 |
| Reference | 7 |

### Sample Knowledge Items

```typescript
// Documents (15)
{
  id: 'kb-soc2-requirements',
  title: 'SOC2 Type II Requirements 2025',
  type: 'document',
  source: 'internal',
  content: '...',
  tags: ['compliance', 'soc2', 'audit'],
  spaceIds: ['space-compliance-ops'],
  createdAt: '2024-01-15T00:00:00Z',
  updatedAt: '2025-06-01T00:00:00Z',
  citations: 45
}

{
  id: 'kb-gdpr-guidelines',
  title: 'GDPR Data Processing Guidelines',
  type: 'document',
  source: 'internal',
  tags: ['compliance', 'gdpr', 'privacy'],
  spaceIds: ['space-compliance-ops'],
  citations: 32
}

// Policies (8)
{
  id: 'kb-incident-response-policy',
  title: 'Incident Response Policy v3.2',
  type: 'policy',
  source: 'internal',
  tags: ['security', 'incident', 'policy'],
  spaceIds: ['space-security-ops'],
  effectiveDate: '2025-03-01T00:00:00Z',
  citations: 18
}

// Procedures (10)
{
  id: 'kb-lead-qualification-process',
  title: 'Lead Qualification Process',
  type: 'procedure',
  source: 'internal',
  tags: ['sales', 'leads', 'process'],
  spaceIds: ['space-revenue-ops'],
  steps: 8,
  citations: 27
}

// References (7)
{
  id: 'kb-nist-framework',
  title: 'NIST Cybersecurity Framework',
  type: 'reference',
  source: 'external',
  url: 'https://www.nist.gov/cyberframework',
  tags: ['security', 'compliance', 'framework'],
  spaceIds: ['space-security-ops', 'space-compliance-ops'],
  citations: 56
}
```

---

## 8. NEXIS Entities (15)

### Entity Types Distribution
| Type | Count |
|------|-------|
| Person | 6 |
| Organization | 4 |
| Concept | 3 |
| Event | 2 |

### Entities

```typescript
// People (6)
{ id: 'nexis-sarah-chen', type: 'person', name: 'Sarah Chen', role: 'VP Compliance', org: 'Internal' }
{ id: 'nexis-marcus-johnson', type: 'person', name: 'Marcus Johnson', role: 'Security Lead', org: 'Internal' }
{ id: 'nexis-emily-rodriguez', type: 'person', name: 'Emily Rodriguez', role: 'Revenue Ops Director', org: 'Internal' }
{ id: 'nexis-david-kim', type: 'person', name: 'David Kim', role: 'Audit Partner', org: 'External Auditor Inc' }
{ id: 'nexis-lisa-wang', type: 'person', name: 'Lisa Wang', role: 'Customer Success Manager', org: 'Internal' }
{ id: 'nexis-james-wilson', type: 'person', name: 'James Wilson', role: 'CTO', org: 'TechCorp (Customer)' }

// Organizations (4)
{ id: 'nexis-internal', type: 'organization', name: 'Symtex LLC', domain: 'symtex.io' }
{ id: 'nexis-external-auditor', type: 'organization', name: 'External Auditor Inc', domain: 'auditor.com' }
{ id: 'nexis-techcorp', type: 'organization', name: 'TechCorp', domain: 'techcorp.io', isCustomer: true }
{ id: 'nexis-acme', type: 'organization', name: 'ACME Industries', domain: 'acme.co', isCustomer: true }

// Concepts (3)
{ id: 'nexis-soc2', type: 'concept', name: 'SOC2 Compliance', category: 'Compliance Framework' }
{ id: 'nexis-lead-scoring', type: 'concept', name: 'Lead Scoring Model', category: 'Sales Process' }
{ id: 'nexis-zero-trust', type: 'concept', name: 'Zero Trust Architecture', category: 'Security Model' }

// Events (2)
{ id: 'nexis-q1-audit', type: 'event', name: 'Q1 2026 SOC2 Audit', date: '2026-03-15' }
{ id: 'nexis-security-incident', type: 'event', name: 'Jan 2026 Phishing Attempt', date: '2026-01-10' }
```

### Relationships (17)
```typescript
{ source: 'nexis-sarah-chen', target: 'nexis-internal', type: 'works_at' }
{ source: 'nexis-sarah-chen', target: 'nexis-soc2', type: 'responsible_for' }
{ source: 'nexis-david-kim', target: 'nexis-external-auditor', type: 'works_at' }
{ source: 'nexis-david-kim', target: 'nexis-q1-audit', type: 'leads' }
{ source: 'nexis-marcus-johnson', target: 'nexis-zero-trust', type: 'implements' }
{ source: 'nexis-marcus-johnson', target: 'nexis-security-incident', type: 'investigated' }
{ source: 'nexis-emily-rodriguez', target: 'nexis-lead-scoring', type: 'owns' }
{ source: 'nexis-lisa-wang', target: 'nexis-techcorp', type: 'manages' }
{ source: 'nexis-james-wilson', target: 'nexis-techcorp', type: 'works_at' }
{ source: 'nexis-techcorp', target: 'nexis-internal', type: 'customer_of' }
{ source: 'nexis-acme', target: 'nexis-internal', type: 'customer_of' }
{ source: 'nexis-q1-audit', target: 'nexis-soc2', type: 'validates' }
// ... etc
```

---

## 9. Templates (12)

```typescript
[
  { id: 'tpl-compliance-report', name: 'Compliance Status Report', category: 'compliance', usageCount: 234 },
  { id: 'tpl-incident-summary', name: 'Security Incident Summary', category: 'security', usageCount: 89 },
  { id: 'tpl-lead-outreach', name: 'Lead Outreach Email', category: 'sales', usageCount: 567 },
  { id: 'tpl-renewal-reminder', name: 'Renewal Reminder Email', category: 'customer-success', usageCount: 321 },
  { id: 'tpl-audit-evidence', name: 'Audit Evidence Summary', category: 'compliance', usageCount: 145 },
  { id: 'tpl-threat-alert', name: 'Threat Alert Notification', category: 'security', usageCount: 78 },
  { id: 'tpl-customer-health', name: 'Customer Health Report', category: 'customer-success', usageCount: 189 },
  { id: 'tpl-policy-summary', name: 'Policy Compliance Summary', category: 'compliance', usageCount: 256 },
  { id: 'tpl-sales-forecast', name: 'Sales Forecast Report', category: 'sales', usageCount: 423 },
  { id: 'tpl-incident-response', name: 'Incident Response Playbook', category: 'security', usageCount: 67 },
  { id: 'tpl-data-request', name: 'Data Subject Request', category: 'compliance', usageCount: 112 },
  { id: 'tpl-onboarding-checklist', name: 'Customer Onboarding Checklist', category: 'customer-success', usageCount: 298 }
]
```

---

## 10. Policies (8)

```typescript
[
  {
    id: 'policy-external-comms',
    name: 'External Communications',
    description: 'Approval required for any automated external communications',
    scope: ['space-revenue-ops'],
    triggers: ['email-send', 'message-send'],
    approvalRequired: true,
    approvers: ['role-manager', 'role-compliance']
  },
  {
    id: 'policy-budget-cap',
    name: 'Monthly Budget Cap',
    description: 'Pause automations when monthly budget exceeds threshold',
    scope: ['all'],
    triggers: ['cost-threshold'],
    thresholds: { warning: 0.8, alert: 0.95, block: 1.0 }
  },
  {
    id: 'policy-data-access',
    name: 'Sensitive Data Access',
    description: 'Approval required for accessing PII or financial data',
    scope: ['space-compliance-ops', 'space-revenue-ops'],
    triggers: ['data-access-pii', 'data-access-financial'],
    approvalRequired: true
  },
  {
    id: 'policy-system-changes',
    name: 'System Modifications',
    description: 'Approval required for any system configuration changes',
    scope: ['space-security-ops'],
    triggers: ['config-change', 'firewall-rule', 'access-control'],
    approvalRequired: true,
    approvers: ['role-security-lead']
  },
  {
    id: 'policy-audit-submission',
    name: 'Audit Evidence Submission',
    description: 'Multi-approval required for submitting audit evidence externally',
    scope: ['space-compliance-ops'],
    triggers: ['external-submission'],
    approvalRequired: true,
    approvers: ['role-compliance-lead', 'role-legal']
  },
  {
    id: 'policy-threat-response',
    name: 'Automated Threat Response',
    description: 'Approval required for automated containment actions',
    scope: ['space-security-ops'],
    triggers: ['containment-action', 'block-ip', 'isolate-system'],
    approvalRequired: true,
    approvers: ['role-security-lead', 'role-cto']
  },
  {
    id: 'policy-working-hours',
    name: 'Working Hours Only',
    description: 'Customer-facing automations only run during business hours',
    scope: ['space-revenue-ops'],
    triggers: ['schedule'],
    constraints: { hours: '09:00-17:00', timezone: 'America/New_York', days: ['mon', 'tue', 'wed', 'thu', 'fri'] }
  },
  {
    id: 'policy-rate-limit',
    name: 'Rate Limiting',
    description: 'Maximum 100 automated actions per hour per Cognate',
    scope: ['all'],
    triggers: ['action-count'],
    thresholds: { perHour: 100, perDay: 1000 }
  }
]
```

---

## 11. Audit Events (25)

### Event Types Distribution
| Type | Count |
|------|-------|
| run_completed | 8 |
| approval_requested | 5 |
| approval_granted | 4 |
| policy_triggered | 3 |
| cognate_created | 2 |
| automation_created | 2 |
| system_alert | 1 |

### Sample Events

```typescript
[
  {
    id: 'led-001',
    type: 'run_completed',
    timestamp: '2026-01-21T08:02:30Z',
    who: { type: 'cognate', id: 'cog-compliance-monitor', name: 'Compliance Monitor' },
    what: { action: 'run_completed', automationId: 'auto-daily-compliance-report', runId: 'run-001' },
    where: { spaceId: 'space-compliance-ops', projectId: 'proj-policy-monitoring' },
    outcome: 'success',
    cost: 0.48,
    evidence: [{ type: 'report', url: '/reports/compliance-2026-01-21.pdf' }]
  },
  {
    id: 'led-005',
    type: 'approval_requested',
    timestamp: '2026-01-21T10:00:05Z',
    who: { type: 'cognate', id: 'cog-customer-success', name: 'Customer Success' },
    what: { action: 'approval_requested', automationId: 'auto-customer-outreach', runId: 'run-012' },
    where: { spaceId: 'space-revenue-ops', projectId: 'proj-renewal-management' },
    why: { policyId: 'policy-external-comms', reason: 'External email to 15 recipients' },
    outcome: 'pending'
  },
  {
    id: 'led-010',
    type: 'policy_triggered',
    timestamp: '2026-01-20T15:05:00Z',
    who: { type: 'system', id: 'system', name: 'Policy Engine' },
    what: { action: 'policy_triggered', policyId: 'policy-budget-cap' },
    where: { spaceId: 'space-compliance-ops' },
    why: { threshold: 0.95, currentUsage: 0.97 },
    outcome: 'alert_sent'
  }
  // ... 22 more events
]
```

---

## 12. Entity Relationships Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                          SPACES                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Compliance   │  │ Revenue      │  │ Security     │          │
│  │ Ops          │  │ Ops          │  │ Ops          │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                 │                 │                   │
│    ┌────┴────┐       ┌────┴────┐       ┌────┴────┐             │
│    ▼         ▼       ▼         ▼       ▼         ▼             │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐         │
│ │Proj 1│ │Proj 2│ │Proj 3│ │Proj 4│ │Proj 5│ │Proj 6│         │
│ └──┬───┘ └──┬───┘ └──┬───┘ └──┬───┘ └──┬───┘ └──┬───┘         │
└────┼────────┼────────┼────────┼────────┼────────┼──────────────┘
     │        │        │        │        │        │
     ▼        ▼        ▼        ▼        ▼        ▼
┌─────────────────────────────────────────────────────────────────┐
│                        COGNATES                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐│
│  │Compliance│ │Audit     │ │Revenue   │ │Customer  │ │Threat  ││
│  │Monitor   │ │Collector │ │Analyst   │ │Success   │ │Hunter  ││
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ └───┬────┘│
└───────┼────────────┼────────────┼────────────┼───────────┼─────┘
        │            │            │            │           │
        ▼            ▼            ▼            ▼           ▼
┌─────────────────────────────────────────────────────────────────┐
│                       AUTOMATIONS                                │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │Daily    │ │Evidence │ │Lead     │ │Customer │ │Threat   │   │
│  │Report   │ │Submit   │ │Score    │ │Outreach │ │Contain  │   │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘   │
└───────┼──────────┼────────────┼────────────┼──────────┼────────┘
        │          │            │            │          │
        ▼          ▼            ▼            ▼          ▼
┌─────────────────────────────────────────────────────────────────┐
│                          RUNS                                    │
│   (20 runs across all automations with various states)          │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      AUDIT EVENTS (Ledger)                       │
│   (25 events tracking all actions with evidence)                │
└─────────────────────────────────────────────────────────────────┘
```

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-01-21 | Claude | Initial creation |
