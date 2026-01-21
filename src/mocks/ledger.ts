/**
 * Ledger Mock Data
 *
 * The Ledger is Symtex's immutable audit trail that records all significant
 * events using the 6 W's framework (Who, What, When, Where, Why, How).
 *
 * This file provides centralized mock data for 25 audit events covering:
 * - 8 run_completed
 * - 5 approval_requested
 * - 4 approval_granted
 * - 3 policy_triggered
 * - 2 cognate_created
 * - 2 automation_created
 * - 1 system_alert
 */

import type { LedgerEntry, LedgerCrypto } from '@/types';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const now = new Date();

function createDate(hoursAgo: number): Date {
  return new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
}

function generateHash(): string {
  const chars = 'abcdef0123456789';
  return Array.from({ length: 64 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('');
}

function createCrypto(hoursAgo: number, previousHash?: string): LedgerCrypto {
  return {
    contentHash: `sha256:${generateHash()}`,
    previousHash: previousHash || `sha256:${generateHash()}`,
    algorithm: 'sha256',
    hashedAt: createDate(hoursAgo),
  };
}

// ============================================================================
// MOCK LEDGER ENTRIES (25 total)
// ============================================================================

export const mockLedgerEntries: LedgerEntry[] = [
  // =========================================================================
  // RUN_COMPLETED EVENTS (8)
  // =========================================================================

  // 1. Support Cognate - Ticket Resolution
  {
    id: 'led-001',
    sequence: 10001,
    who: {
      type: 'cognate',
      id: 'cog-support',
      name: 'Support Cognate',
      metadata: { tier: 2, autonomyLevel: 'supervised' },
    },
    what: {
      type: 'run_completed',
      description: 'Resolved customer support ticket #4582 - Billing inquiry',
      category: 'action',
      severity: 'info',
      status: 'completed',
      result: 'Customer satisfied, 5-star rating received',
      duration: 45000,
    },
    when: createDate(0.5),
    where: {
      spaceId: 'space-support',
      spaceName: 'Customer Support',
      projectId: 'proj-tickets',
      projectName: 'Ticket Management',
    },
    why: {
      trigger: 'user_request',
      reasoning: 'Customer submitted billing inquiry via chat widget',
      triggerRef: { type: 'message', id: 'msg-9284', name: 'Billing Question' },
      goal: 'Resolve customer billing inquiry efficiently',
      confidence: 0.94,
    },
    how: {
      approach: 'symbolic',
      tools: ['knowledge-base', 'billing-api', 'crm-lookup'],
      model: 'claude-opus-4-5',
      parameters: { temperature: 0.3 },
      steps: [
        'Parse customer inquiry',
        'Search knowledge base for billing policies',
        'Retrieve account billing history',
        'Generate personalized response',
      ],
      resources: { tokens: 1247, apiCalls: 3, duration: 45000, cost: 0.024 },
    },
    tags: ['support', 'billing', 'resolved', 'high-satisfaction'],
    crypto: createCrypto(0.5),
    isFlagged: false,
    createdAt: createDate(0.5),
  },

  // 2. Sales Cognate - Lead Qualification
  {
    id: 'led-002',
    sequence: 10002,
    who: {
      type: 'cognate',
      id: 'cog-sales',
      name: 'Sales Development Cognate',
      metadata: { tier: 2, autonomyLevel: 'supervised' },
    },
    what: {
      type: 'run_completed',
      description: 'Qualified 47 inbound leads from marketing campaign',
      category: 'action',
      severity: 'info',
      status: 'completed',
      result: 'High: 12, Medium: 23, Low: 12 - Routed to appropriate queues',
      duration: 180000,
    },
    when: createDate(2),
    where: {
      spaceId: 'space-sales',
      spaceName: 'Sales Operations',
      projectId: 'proj-lead-mgmt',
      projectName: 'Lead Management',
    },
    why: {
      trigger: 'schedule',
      reasoning: 'Hourly lead qualification job triggered',
      goal: 'Prioritize sales team efforts on high-value leads',
      confidence: 0.89,
    },
    how: {
      approach: 'hybrid',
      tools: ['lead-scoring-model', 'crm-api', 'enrichment-service'],
      model: 'claude-opus-4-5',
      parameters: { temperature: 0.1 },
      steps: [
        'Fetch unqualified leads',
        'Enrich company data',
        'Apply scoring model',
        'Route to sales queues',
      ],
      resources: { tokens: 15600, apiCalls: 94, duration: 180000, cost: 0.31 },
    },
    tags: ['sales', 'leads', 'qualification', 'automated'],
    crypto: createCrypto(2),
    isFlagged: false,
    createdAt: createDate(2),
  },

  // 3. Compliance Cognate - SOC2 Evidence Collection
  {
    id: 'led-003',
    sequence: 10003,
    who: {
      type: 'cognate',
      id: 'cog-compliance',
      name: 'Compliance Cognate',
      metadata: { tier: 3, autonomyLevel: 'autonomous' },
    },
    what: {
      type: 'run_completed',
      description: 'Collected and organized SOC2 audit evidence for Q1 2026',
      category: 'action',
      severity: 'notice',
      status: 'completed',
      result: '156 evidence artifacts collected, 12 gaps identified',
      duration: 420000,
    },
    when: createDate(6),
    where: {
      spaceId: 'space-compliance',
      spaceName: 'Compliance',
      projectId: 'proj-soc2',
      projectName: 'SOC2 Certification',
    },
    why: {
      trigger: 'schedule',
      reasoning: 'Weekly SOC2 evidence collection job',
      triggerRef: { type: 'sop', id: 'sop-evidence-collection', name: 'Evidence Collection SOP' },
      goal: 'Maintain audit-ready compliance posture',
      confidence: 0.97,
    },
    how: {
      approach: 'symbolic',
      tools: ['document-collector', 'audit-tracker', 'evidence-validator'],
      steps: [
        'Query integrated systems for control evidence',
        'Validate evidence completeness',
        'Organize by control category',
        'Generate gap report',
      ],
      resources: { tokens: 8900, apiCalls: 156, duration: 420000, cost: 0.18 },
    },
    evidence: [
      {
        id: 'ev-001',
        type: 'document',
        name: 'Q1 Evidence Package',
        description: 'Complete SOC2 evidence collection for Q1 2026',
        mimeType: 'application/pdf',
        size: 15728640,
        url: '/evidence/soc2-q1-2026-package.pdf',
        hash: `sha256:${generateHash()}`,
        capturedAt: createDate(6),
        capturedBy: 'cog-compliance',
      },
    ],
    tags: ['compliance', 'soc2', 'evidence', 'audit', 'automated'],
    crypto: createCrypto(6),
    isFlagged: false,
    createdAt: createDate(6),
  },

  // 4. Data Analyst Cognate - Report Generation
  {
    id: 'led-004',
    sequence: 10004,
    who: {
      type: 'cognate',
      id: 'cog-analyst',
      name: 'Data Analyst Cognate',
      metadata: { tier: 3, autonomyLevel: 'autonomous' },
    },
    what: {
      type: 'run_completed',
      description: 'Generated weekly executive dashboard report',
      category: 'action',
      severity: 'info',
      status: 'completed',
      result: 'Report delivered to 8 stakeholders',
      duration: 120000,
    },
    when: createDate(12),
    where: {
      spaceId: 'space-analytics',
      spaceName: 'Analytics',
      projectId: 'proj-reporting',
      projectName: 'Executive Reporting',
    },
    why: {
      trigger: 'schedule',
      reasoning: 'Weekly Monday morning executive report',
      goal: 'Provide leadership with key business metrics',
      confidence: 0.99,
    },
    how: {
      approach: 'hybrid',
      tools: ['data-warehouse', 'visualization-engine', 'email-service'],
      model: 'claude-opus-4-5',
      parameters: { temperature: 0.2 },
      steps: [
        'Query data warehouse for KPIs',
        'Generate visualizations',
        'Compile narrative insights',
        'Distribute to stakeholders',
      ],
      resources: { tokens: 4500, apiCalls: 12, duration: 120000, cost: 0.09 },
    },
    tags: ['analytics', 'reporting', 'executive', 'automated'],
    crypto: createCrypto(12),
    isFlagged: false,
    createdAt: createDate(12),
  },

  // 5. Security Cognate - Threat Detection
  {
    id: 'led-005',
    sequence: 10005,
    who: {
      type: 'cognate',
      id: 'cog-security',
      name: 'Security Monitoring Cognate',
      metadata: { tier: 3, autonomyLevel: 'autonomous' },
    },
    what: {
      type: 'run_completed',
      description: 'Completed hourly security scan - 0 threats detected',
      category: 'action',
      severity: 'info',
      status: 'completed',
      result: 'All systems nominal, 0 anomalies detected',
      duration: 60000,
    },
    when: createDate(1),
    where: {
      spaceId: 'space-security',
      spaceName: 'Security Operations',
      path: '/monitoring/scan',
    },
    why: {
      trigger: 'schedule',
      reasoning: 'Hourly automated security scan',
      goal: 'Continuous threat monitoring',
      confidence: 0.99,
    },
    how: {
      approach: 'symbolic',
      tools: ['siem', 'threat-intel', 'anomaly-detector'],
      steps: [
        'Collect security events from all sources',
        'Analyze patterns against threat signatures',
        'Check anomaly detection thresholds',
        'Update security dashboard',
      ],
      resources: { apiCalls: 45, duration: 60000 },
    },
    tags: ['security', 'monitoring', 'scan', 'automated'],
    crypto: createCrypto(1),
    isFlagged: false,
    createdAt: createDate(1),
  },

  // 6. Customer Success Cognate - Health Score Update
  {
    id: 'led-006',
    sequence: 10006,
    who: {
      type: 'cognate',
      id: 'cog-cs',
      name: 'Customer Success Cognate',
      metadata: { tier: 2, autonomyLevel: 'supervised' },
    },
    what: {
      type: 'run_completed',
      description: 'Updated health scores for 45 enterprise accounts',
      category: 'action',
      severity: 'info',
      status: 'completed',
      result: '3 accounts flagged for intervention, 5 expansion opportunities identified',
      duration: 90000,
    },
    when: createDate(8),
    where: {
      spaceId: 'space-cs',
      spaceName: 'Customer Success',
      projectId: 'proj-health',
      projectName: 'Account Health',
    },
    why: {
      trigger: 'schedule',
      reasoning: 'Daily health score calculation job',
      goal: 'Proactive customer success management',
      confidence: 0.92,
    },
    how: {
      approach: 'hybrid',
      tools: ['usage-analytics', 'support-history', 'engagement-tracker'],
      model: 'claude-opus-4-5',
      steps: [
        'Calculate usage metrics',
        'Analyze support ticket trends',
        'Measure engagement scores',
        'Generate health predictions',
      ],
      resources: { tokens: 12000, apiCalls: 90, duration: 90000, cost: 0.24 },
    },
    tags: ['customer-success', 'health-score', 'enterprise', 'automated'],
    crypto: createCrypto(8),
    isFlagged: false,
    createdAt: createDate(8),
  },

  // 7. Content Cognate - Blog Post Generation
  {
    id: 'led-007',
    sequence: 10007,
    who: {
      type: 'cognate',
      id: 'cog-content',
      name: 'Content Writer Cognate',
      metadata: { tier: 2, autonomyLevel: 'supervised' },
    },
    what: {
      type: 'run_completed',
      description: 'Generated draft blog post: "5 Ways AI is Transforming Enterprise Operations"',
      category: 'action',
      severity: 'info',
      status: 'completed',
      result: 'Draft ready for human review - 1,850 words',
      duration: 240000,
    },
    when: createDate(18),
    where: {
      spaceId: 'space-marketing',
      spaceName: 'Marketing',
      projectId: 'proj-content',
      projectName: 'Content Marketing',
    },
    why: {
      trigger: 'user_request',
      reasoning: 'Content brief submitted by marketing team',
      triggerRef: { type: 'message', id: 'brief-2156', name: 'AI Operations Blog Brief' },
      goal: 'Generate engaging thought leadership content',
      confidence: 0.88,
    },
    how: {
      approach: 'neural',
      tools: ['research-aggregator', 'seo-analyzer', 'style-checker'],
      model: 'claude-opus-4-5',
      parameters: { temperature: 0.7 },
      steps: [
        'Research topic and trends',
        'Generate outline with key points',
        'Write full draft with examples',
        'Optimize for SEO keywords',
      ],
      resources: { tokens: 8500, apiCalls: 4, duration: 240000, cost: 0.17 },
    },
    tags: ['content', 'marketing', 'blog', 'draft'],
    crypto: createCrypto(18),
    isFlagged: false,
    createdAt: createDate(18),
  },

  // 8. Finance Cognate - Invoice Processing
  {
    id: 'led-008',
    sequence: 10008,
    who: {
      type: 'cognate',
      id: 'cog-finance',
      name: 'Finance Operations Cognate',
      metadata: { tier: 3, autonomyLevel: 'autonomous' },
    },
    what: {
      type: 'run_completed',
      description: 'Processed 23 vendor invoices for payment approval',
      category: 'action',
      severity: 'info',
      status: 'completed',
      result: '21 auto-approved, 2 flagged for manual review',
      duration: 150000,
    },
    when: createDate(24),
    where: {
      spaceId: 'space-finance',
      spaceName: 'Finance',
      projectId: 'proj-ap',
      projectName: 'Accounts Payable',
    },
    why: {
      trigger: 'schedule',
      reasoning: 'Daily invoice processing batch job',
      goal: 'Efficient accounts payable processing',
      confidence: 0.96,
    },
    how: {
      approach: 'hybrid',
      tools: ['ocr-engine', 'erp-connector', 'approval-workflow'],
      model: 'claude-opus-4-5',
      steps: [
        'Extract invoice data via OCR',
        'Match to purchase orders',
        'Validate against budget',
        'Route for approval',
      ],
      resources: { tokens: 5600, apiCalls: 46, duration: 150000, cost: 0.11 },
    },
    tags: ['finance', 'invoices', 'ap', 'automated'],
    crypto: createCrypto(24),
    isFlagged: false,
    createdAt: createDate(24),
  },

  // =========================================================================
  // APPROVAL_REQUESTED EVENTS (5)
  // =========================================================================

  // 9. External Communication Approval Request
  {
    id: 'led-009',
    sequence: 10009,
    who: {
      type: 'cognate',
      id: 'cog-support',
      name: 'Support Cognate',
      metadata: { tier: 2, autonomyLevel: 'supervised' },
    },
    what: {
      type: 'approval_requested',
      description: 'Requesting approval to send escalation email to TechCorp CTO',
      category: 'approval',
      severity: 'notice',
      status: 'in_progress',
    },
    when: createDate(3),
    where: {
      spaceId: 'space-support',
      spaceName: 'Customer Support',
      projectId: 'proj-tickets',
      projectName: 'Ticket Management',
    },
    why: {
      trigger: 'condition',
      reasoning: 'External communication policy triggered - recipient is external executive',
      triggerRef: { type: 'rule', id: 'policy-external-comms', name: 'External Communications Policy' },
      goal: 'Notify customer executive of critical issue resolution',
      confidence: 0.91,
    },
    how: {
      approach: 'symbolic',
      steps: [
        'Detected external recipient',
        'Policy evaluation triggered',
        'Approval workflow initiated',
        'Pending: Lisa Wang approval',
      ],
    },
    relatedEntities: [
      { type: 'user', id: 'user-lisa-wang', name: 'Lisa Wang', relationship: 'target' },
    ],
    tags: ['approval', 'external-comms', 'pending', 'enterprise'],
    crypto: createCrypto(3),
    isFlagged: false,
    createdAt: createDate(3),
  },

  // 10. Budget Threshold Approval Request
  {
    id: 'led-010',
    sequence: 10010,
    who: {
      type: 'cognate',
      id: 'cog-analyst',
      name: 'Data Analyst Cognate',
      metadata: { tier: 3, autonomyLevel: 'autonomous' },
    },
    what: {
      type: 'approval_requested',
      description: 'Requesting approval to run large batch analysis - estimated cost $45',
      category: 'approval',
      severity: 'notice',
      status: 'in_progress',
    },
    when: createDate(5),
    where: {
      spaceId: 'space-analytics',
      spaceName: 'Analytics',
      projectId: 'proj-ml',
      projectName: 'ML Operations',
    },
    why: {
      trigger: 'condition',
      reasoning: 'Budget cap policy triggered - estimated cost exceeds $10 threshold',
      triggerRef: { type: 'rule', id: 'policy-budget-cap', name: 'Monthly Budget Cap Policy' },
      goal: 'Run comprehensive customer segmentation analysis',
    },
    how: {
      approach: 'symbolic',
      steps: [
        'Estimated job cost: $45',
        'Current monthly spend: $7,850',
        'Policy threshold: $8,000',
        'Pending: Finance Approver',
      ],
    },
    tags: ['approval', 'budget', 'pending', 'high-cost'],
    crypto: createCrypto(5),
    isFlagged: false,
    createdAt: createDate(5),
  },

  // 11. Data Access Approval Request
  {
    id: 'led-011',
    sequence: 10011,
    who: {
      type: 'cognate',
      id: 'cog-cs',
      name: 'Customer Success Cognate',
      metadata: { tier: 2, autonomyLevel: 'supervised' },
    },
    what: {
      type: 'approval_requested',
      description: 'Requesting approval to export customer PII for account review',
      category: 'approval',
      severity: 'warning',
      status: 'in_progress',
    },
    when: createDate(7),
    where: {
      spaceId: 'space-cs',
      spaceName: 'Customer Success',
      projectId: 'proj-health',
      projectName: 'Account Health',
    },
    why: {
      trigger: 'condition',
      reasoning: 'Data access policy triggered - PII export requested',
      triggerRef: { type: 'rule', id: 'policy-data-access', name: 'Sensitive Data Access Policy' },
      goal: 'Generate detailed account health report with user-level data',
    },
    how: {
      approach: 'symbolic',
      steps: [
        'PII detected in export request',
        'Policy evaluation triggered',
        'Multi-level approval required',
        'Pending: Data Steward, Compliance Officer',
      ],
    },
    tags: ['approval', 'pii', 'pending', 'compliance'],
    crypto: createCrypto(7),
    isFlagged: true,
    createdAt: createDate(7),
  },

  // 12. System Change Approval Request
  {
    id: 'led-012',
    sequence: 10012,
    who: {
      type: 'automation',
      id: 'auto-deploy',
      name: 'Deployment Automation',
    },
    what: {
      type: 'approval_requested',
      description: 'Requesting approval to deploy SOP update to production',
      category: 'approval',
      severity: 'notice',
      status: 'in_progress',
    },
    when: createDate(10),
    where: {
      spaceId: 'space-engineering',
      spaceName: 'Engineering',
      projectId: 'proj-platform',
      projectName: 'Platform Development',
    },
    why: {
      trigger: 'automation',
      reasoning: 'System changes policy triggered - production deployment requested',
      triggerRef: { type: 'rule', id: 'policy-system-changes', name: 'Configuration Changes Policy' },
      goal: 'Deploy updated customer greeting SOP',
    },
    how: {
      approach: 'symbolic',
      steps: [
        'Change detected: SOP modification',
        'Production deployment requested',
        'Policy evaluation triggered',
        'Pending: System Administrator',
      ],
    },
    tags: ['approval', 'deployment', 'pending', 'sop'],
    crypto: createCrypto(10),
    isFlagged: false,
    createdAt: createDate(10),
  },

  // 13. Audit Evidence Submission Approval Request
  {
    id: 'led-013',
    sequence: 10013,
    who: {
      type: 'cognate',
      id: 'cog-compliance',
      name: 'Compliance Cognate',
      metadata: { tier: 3, autonomyLevel: 'autonomous' },
    },
    what: {
      type: 'approval_requested',
      description: 'Requesting approval to submit SOC2 evidence package to External Auditor Inc',
      category: 'approval',
      severity: 'notice',
      status: 'in_progress',
    },
    when: createDate(4),
    where: {
      spaceId: 'space-compliance',
      spaceName: 'Compliance',
      projectId: 'proj-soc2',
      projectName: 'SOC2 Certification',
    },
    why: {
      trigger: 'condition',
      reasoning: 'Audit submission policy triggered - external auditor sharing requested',
      triggerRef: { type: 'rule', id: 'policy-audit-submission', name: 'Audit Evidence Submission Policy' },
      goal: 'Submit Q1 2026 evidence package to auditors',
    },
    how: {
      approach: 'symbolic',
      steps: [
        'Evidence package compiled',
        'External submission detected',
        'Multi-approval workflow initiated',
        'Pending: VP Compliance, Legal, CISO',
      ],
    },
    relatedEntities: [
      { type: 'user', id: 'user-sarah-chen', name: 'Sarah Chen', relationship: 'target' },
      { type: 'user', id: 'user-david-kim', name: 'David Kim', relationship: 'participant' },
    ],
    tags: ['approval', 'audit', 'soc2', 'pending', 'multi-approval'],
    crypto: createCrypto(4),
    isFlagged: false,
    createdAt: createDate(4),
  },

  // =========================================================================
  // APPROVAL_GRANTED EVENTS (4)
  // =========================================================================

  // 14. External Communication Approved
  {
    id: 'led-014',
    sequence: 10014,
    who: {
      type: 'user',
      id: 'user-lisa-wang',
      name: 'Lisa Wang',
      metadata: { role: 'Customer Success Manager' },
    },
    what: {
      type: 'approval_granted',
      description: 'Approved external communication to ACME Industries stakeholder',
      category: 'approval',
      severity: 'info',
      status: 'completed',
    },
    when: createDate(14),
    where: {
      spaceId: 'space-cs',
      spaceName: 'Customer Success',
      projectId: 'proj-comms',
      projectName: 'Customer Communications',
    },
    why: {
      trigger: 'user_request',
      reasoning: 'Reviewed communication content and approved for external delivery',
      goal: 'Maintain strong customer relationships',
    },
    how: {
      approach: 'manual',
      steps: ['Reviewed message content', 'Verified recipient', 'Approved for sending'],
    },
    tags: ['approval', 'granted', 'external-comms', 'customer'],
    crypto: createCrypto(14),
    isFlagged: false,
    createdAt: createDate(14),
  },

  // 15. Budget Override Approved
  {
    id: 'led-015',
    sequence: 10015,
    who: {
      type: 'user',
      id: 'user-emily-rodriguez',
      name: 'Emily Rodriguez',
      metadata: { role: 'Revenue Ops Director' },
    },
    what: {
      type: 'approval_granted',
      description: 'Approved budget override for lead scoring model retraining - $125',
      category: 'approval',
      severity: 'notice',
      status: 'completed',
    },
    when: createDate(20),
    where: {
      spaceId: 'space-sales',
      spaceName: 'Sales Operations',
      projectId: 'proj-lead-mgmt',
      projectName: 'Lead Management',
    },
    why: {
      trigger: 'user_request',
      reasoning: 'Model retraining critical for Q1 pipeline accuracy improvement',
      goal: 'Improve lead scoring accuracy to 90%+',
    },
    how: {
      approach: 'manual',
      steps: ['Reviewed cost estimate', 'Verified ROI projection', 'Approved budget allocation'],
    },
    tags: ['approval', 'granted', 'budget', 'ml'],
    crypto: createCrypto(20),
    isFlagged: false,
    createdAt: createDate(20),
  },

  // 16. Data Export Approved
  {
    id: 'led-016',
    sequence: 10016,
    who: {
      type: 'user',
      id: 'user-sarah-chen',
      name: 'Sarah Chen',
      metadata: { role: 'VP Compliance' },
    },
    what: {
      type: 'approval_granted',
      description: 'Approved aggregated usage data export for audit evidence',
      category: 'approval',
      severity: 'info',
      status: 'completed',
    },
    when: createDate(26),
    where: {
      spaceId: 'space-compliance',
      spaceName: 'Compliance',
      projectId: 'proj-soc2',
      projectName: 'SOC2 Certification',
    },
    why: {
      trigger: 'user_request',
      reasoning: 'Data required for SOC2 control evidence - aggregated, no PII',
      goal: 'Complete SOC2 evidence collection',
    },
    how: {
      approach: 'manual',
      steps: ['Verified data classification', 'Confirmed no PII included', 'Approved export'],
    },
    tags: ['approval', 'granted', 'data', 'audit'],
    crypto: createCrypto(26),
    isFlagged: false,
    createdAt: createDate(26),
  },

  // 17. System Change Approved
  {
    id: 'led-017',
    sequence: 10017,
    who: {
      type: 'user',
      id: 'user-marcus-johnson',
      name: 'Marcus Johnson',
      metadata: { role: 'Security Lead' },
    },
    what: {
      type: 'approval_granted',
      description: 'Approved deployment of enhanced email filtering rules',
      category: 'approval',
      severity: 'notice',
      status: 'completed',
    },
    when: createDate(30),
    where: {
      spaceId: 'space-security',
      spaceName: 'Security Operations',
      path: '/config/email-filtering',
    },
    why: {
      trigger: 'event',
      reasoning: 'Post-incident improvement - enhanced phishing detection rules',
      triggerRef: { type: 'event', id: 'event-phishing-jan2026', name: 'Jan 2026 Phishing Incident' },
      goal: 'Prevent future phishing attempts',
    },
    how: {
      approach: 'manual',
      steps: ['Reviewed rule changes', 'Verified no service disruption', 'Approved deployment'],
    },
    tags: ['approval', 'granted', 'security', 'deployment'],
    crypto: createCrypto(30),
    isFlagged: false,
    createdAt: createDate(30),
  },

  // =========================================================================
  // POLICY_TRIGGERED EVENTS (3)
  // =========================================================================

  // 18. Rate Limit Policy Triggered
  {
    id: 'led-018',
    sequence: 10018,
    who: {
      type: 'system',
      id: 'sys-policy-engine',
      name: 'Policy Engine',
    },
    what: {
      type: 'policy_triggered',
      description: 'Rate limit policy triggered - Sales Cognate exceeded 100 actions/hour',
      category: 'system',
      severity: 'warning',
      status: 'completed',
      result: 'Cognate throttled for 15 minutes',
    },
    when: createDate(16),
    where: {
      spaceId: 'space-sales',
      spaceName: 'Sales Operations',
    },
    why: {
      trigger: 'condition',
      reasoning: 'Sales Cognate reached 112 actions in 1 hour, exceeding 100 action limit',
      triggerRef: { type: 'rule', id: 'policy-rate-limit', name: 'Action Rate Limit Policy' },
    },
    how: {
      approach: 'symbolic',
      steps: [
        'Action count threshold detected',
        'Policy evaluation: rate_limit exceeded',
        'Applied automatic throttling',
        'Notified system administrator',
      ],
    },
    relatedEntities: [
      { type: 'cognate', id: 'cog-sales', name: 'Sales Development Cognate', relationship: 'subject' },
    ],
    tags: ['policy', 'rate-limit', 'throttled', 'warning'],
    crypto: createCrypto(16),
    isFlagged: true,
    createdAt: createDate(16),
  },

  // 19. Working Hours Policy Triggered
  {
    id: 'led-019',
    sequence: 10019,
    who: {
      type: 'system',
      id: 'sys-policy-engine',
      name: 'Policy Engine',
    },
    what: {
      type: 'policy_triggered',
      description: 'Working hours policy triggered - customer outreach blocked outside business hours',
      category: 'system',
      severity: 'info',
      status: 'completed',
      result: 'Action queued for 9:00 AM PST',
    },
    when: createDate(36),
    where: {
      spaceId: 'space-sales',
      spaceName: 'Sales Operations',
      projectId: 'proj-outreach',
      projectName: 'Sales Outreach',
    },
    why: {
      trigger: 'schedule',
      reasoning: 'Customer outreach attempted at 2:30 AM PST - outside business hours',
      triggerRef: { type: 'rule', id: 'policy-working-hours', name: 'Customer-Facing Working Hours Policy' },
    },
    how: {
      approach: 'symbolic',
      steps: [
        'Customer-facing action detected',
        'Time check: 2:30 AM PST',
        'Business hours: 9 AM - 5 PM PST',
        'Action queued for next business hour',
      ],
    },
    tags: ['policy', 'working-hours', 'queued', 'customer-facing'],
    crypto: createCrypto(36),
    isFlagged: false,
    createdAt: createDate(36),
  },

  // 20. Threat Response Policy Triggered
  {
    id: 'led-020',
    sequence: 10020,
    who: {
      type: 'system',
      id: 'sys-policy-engine',
      name: 'Policy Engine',
    },
    what: {
      type: 'policy_triggered',
      description: 'Threat response policy triggered - suspicious login pattern detected',
      category: 'system',
      severity: 'critical',
      status: 'completed',
      result: 'Account locked, security team alerted',
    },
    when: createDate(42),
    where: {
      path: '/auth/login',
      externalSystem: 'Authentication Service',
    },
    why: {
      trigger: 'condition',
      reasoning: '5 failed login attempts from unknown IP in 2 minutes',
      triggerRef: { type: 'rule', id: 'policy-threat-response', name: 'Security Threat Response Policy' },
    },
    how: {
      approach: 'symbolic',
      steps: [
        'Failed login threshold exceeded',
        'IP reputation check: Unknown/Suspicious',
        'Auto-containment: Account locked',
        'Alert sent to security team',
      ],
    },
    tags: ['policy', 'security', 'threat', 'auto-contained'],
    crypto: createCrypto(42),
    isFlagged: true,
    reviewStatus: 'pending',
    createdAt: createDate(42),
  },

  // =========================================================================
  // COGNATE_CREATED EVENTS (2)
  // =========================================================================

  // 21. New Support Cognate Created
  {
    id: 'led-021',
    sequence: 10021,
    who: {
      type: 'user',
      id: 'user-lisa-wang',
      name: 'Lisa Wang',
      metadata: { role: 'Customer Success Manager' },
    },
    what: {
      type: 'cognate_created',
      description: 'Created new Cognate: Enterprise Support Specialist',
      category: 'creation',
      severity: 'notice',
      status: 'completed',
    },
    when: createDate(48),
    where: {
      spaceId: 'space-support',
      spaceName: 'Customer Support',
      projectId: 'proj-enterprise',
      projectName: 'Enterprise Support',
    },
    why: {
      trigger: 'user_request',
      reasoning: 'Enterprise customer volume increased, need dedicated support Cognate',
      goal: 'Provide specialized support for enterprise tier customers',
    },
    how: {
      approach: 'manual',
      tools: ['cognate-builder', 'sop-library'],
      steps: [
        'Selected Support template',
        'Customized for enterprise context',
        'Imported 12 enterprise SOPs',
        'Set autonomy to supervised',
      ],
    },
    tags: ['cognate', 'created', 'support', 'enterprise'],
    crypto: createCrypto(48),
    isFlagged: false,
    createdAt: createDate(48),
  },

  // 22. New Compliance Cognate Created
  {
    id: 'led-022',
    sequence: 10022,
    who: {
      type: 'user',
      id: 'user-sarah-chen',
      name: 'Sarah Chen',
      metadata: { role: 'VP Compliance' },
    },
    what: {
      type: 'cognate_created',
      description: 'Created new Cognate: GDPR Compliance Monitor',
      category: 'creation',
      severity: 'notice',
      status: 'completed',
    },
    when: createDate(72),
    where: {
      spaceId: 'space-compliance',
      spaceName: 'Compliance',
      projectId: 'proj-gdpr',
      projectName: 'GDPR Compliance',
    },
    why: {
      trigger: 'user_request',
      reasoning: 'EU expansion requires dedicated GDPR compliance monitoring',
      goal: 'Automate GDPR compliance checks and reporting',
    },
    how: {
      approach: 'manual',
      tools: ['cognate-builder', 'compliance-pack'],
      steps: [
        'Selected Compliance template',
        'Installed GDPR compliance pack',
        'Configured data retention rules',
        'Set autonomy to autonomous',
      ],
    },
    tags: ['cognate', 'created', 'compliance', 'gdpr'],
    crypto: createCrypto(72),
    isFlagged: false,
    createdAt: createDate(72),
  },

  // =========================================================================
  // AUTOMATION_CREATED EVENTS (2)
  // =========================================================================

  // 23. Lead Scoring Automation Created
  {
    id: 'led-023',
    sequence: 10023,
    who: {
      type: 'user',
      id: 'user-emily-rodriguez',
      name: 'Emily Rodriguez',
      metadata: { role: 'Revenue Ops Director' },
    },
    what: {
      type: 'automation_created',
      description: 'Created automation: Real-time Lead Scoring Pipeline',
      category: 'creation',
      severity: 'notice',
      status: 'completed',
    },
    when: createDate(96),
    where: {
      spaceId: 'space-sales',
      spaceName: 'Sales Operations',
      projectId: 'proj-lead-mgmt',
      projectName: 'Lead Management',
    },
    why: {
      trigger: 'user_request',
      reasoning: 'Replace batch processing with real-time scoring for faster lead response',
      goal: 'Reduce lead response time from 2 hours to 5 minutes',
    },
    how: {
      approach: 'manual',
      tools: ['lux-builder', 'integration-hub'],
      steps: [
        'Created trigger: New lead webhook',
        'Added enrichment node',
        'Connected scoring model',
        'Added CRM update action',
      ],
    },
    tags: ['automation', 'created', 'lead-scoring', 'real-time'],
    crypto: createCrypto(96),
    isFlagged: false,
    createdAt: createDate(96),
  },

  // 24. Incident Response Automation Created
  {
    id: 'led-024',
    sequence: 10024,
    who: {
      type: 'user',
      id: 'user-marcus-johnson',
      name: 'Marcus Johnson',
      metadata: { role: 'Security Lead' },
    },
    what: {
      type: 'automation_created',
      description: 'Created automation: Automated Incident Response Playbook',
      category: 'creation',
      severity: 'notice',
      status: 'completed',
    },
    when: createDate(120),
    where: {
      spaceId: 'space-security',
      spaceName: 'Security Operations',
      projectId: 'proj-incident',
      projectName: 'Incident Response',
    },
    why: {
      trigger: 'user_request',
      reasoning: 'Post-phishing incident: automate initial containment actions',
      triggerRef: { type: 'event', id: 'event-phishing-jan2026', name: 'Jan 2026 Phishing Incident' },
      goal: 'Reduce mean time to containment (MTTC) from 2 hours to 15 minutes',
    },
    how: {
      approach: 'manual',
      tools: ['lux-builder', 'security-integrations'],
      steps: [
        'Created trigger: SIEM alert webhook',
        'Added threat assessment node',
        'Connected containment actions',
        'Added notification workflow',
      ],
    },
    tags: ['automation', 'created', 'security', 'incident-response'],
    crypto: createCrypto(120),
    isFlagged: false,
    createdAt: createDate(120),
  },

  // =========================================================================
  // SYSTEM_ALERT EVENT (1)
  // =========================================================================

  // 25. Critical System Alert
  {
    id: 'led-025',
    sequence: 10025,
    who: {
      type: 'system',
      id: 'sys-monitor',
      name: 'System Monitor',
    },
    what: {
      type: 'system_alert',
      description: 'API rate limit approaching threshold - OpenAI API at 85% capacity',
      category: 'system',
      severity: 'warning',
      status: 'completed',
      result: 'Alert sent, no action required - usage returned to normal',
    },
    when: createDate(60),
    where: {
      externalSystem: 'OpenAI API',
      path: '/v1/chat/completions',
    },
    why: {
      trigger: 'condition',
      reasoning: 'API usage exceeded 80% of rate limit threshold',
      triggerRef: { type: 'rule', id: 'rule-rate-monitor', name: 'API Rate Monitor' },
    },
    how: {
      approach: 'symbolic',
      steps: [
        'Detected: Current usage at 85%',
        'Threshold: 80% warning level',
        'Alert generated',
        'Resolved: Usage dropped to 62%',
      ],
    },
    tags: ['system', 'alert', 'rate-limit', 'api', 'resolved'],
    crypto: createCrypto(60),
    isFlagged: false,
    createdAt: createDate(60),
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getLedgerEntryById(id: string): LedgerEntry | undefined {
  return mockLedgerEntries.find((entry) => entry.id === id);
}

export function getLedgerEntriesByType(type: string): LedgerEntry[] {
  return mockLedgerEntries.filter((entry) => entry.what.type === type);
}

export function getLedgerEntriesByActor(actorId: string): LedgerEntry[] {
  return mockLedgerEntries.filter((entry) => entry.who.id === actorId);
}

export function getLedgerEntriesBySpace(spaceId: string): LedgerEntry[] {
  return mockLedgerEntries.filter((entry) => entry.where.spaceId === spaceId);
}

export function getLedgerEntriesBySeverity(severity: string): LedgerEntry[] {
  return mockLedgerEntries.filter((entry) => entry.what.severity === severity);
}

export function getFlaggedLedgerEntries(): LedgerEntry[] {
  return mockLedgerEntries.filter((entry) => entry.isFlagged);
}

export function getRecentLedgerEntries(count: number = 10): LedgerEntry[] {
  return [...mockLedgerEntries]
    .sort((a, b) => b.when.getTime() - a.when.getTime())
    .slice(0, count);
}

export function getLedgerStats(): {
  total: number;
  byType: Record<string, number>;
  bySeverity: Record<string, number>;
  flagged: number;
} {
  const byType: Record<string, number> = {};
  const bySeverity: Record<string, number> = {};
  let flagged = 0;

  mockLedgerEntries.forEach((entry) => {
    byType[entry.what.type] = (byType[entry.what.type] || 0) + 1;
    bySeverity[entry.what.severity] = (bySeverity[entry.what.severity] || 0) + 1;
    if (entry.isFlagged) flagged++;
  });

  return {
    total: mockLedgerEntries.length,
    byType,
    bySeverity,
    flagged,
  };
}
