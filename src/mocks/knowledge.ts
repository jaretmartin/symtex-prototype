/**
 * Mock Knowledge Data
 *
 * Centralized mock data for Knowledge items in Symtex Pro.
 * Includes documents, policies, procedures, and external references.
 */

// ============================================================================
// TYPES
// ============================================================================

export type KnowledgeType = 'document' | 'policy' | 'procedure' | 'reference';

export type KnowledgeSource =
  | 'internal'
  | 'external'
  | 'imported'
  | 'generated'
  | 'regulatory';

export type KnowledgeStatus = 'draft' | 'published' | 'archived' | 'review';

export interface KnowledgeItem {
  /** Unique identifier */
  id: string;
  /** Title of the knowledge item */
  title: string;
  /** Type of knowledge */
  type: KnowledgeType;
  /** Source of the knowledge */
  source: KnowledgeSource;
  /** Current status */
  status: KnowledgeStatus;
  /** Tags for categorization */
  tags: string[];
  /** Space IDs this knowledge is available in */
  spaceIds: string[];
  /** Creation timestamp */
  createdAt: string;
  /** Last update timestamp */
  updatedAt: string;
  /** Number of times this item has been cited/referenced */
  citations: number;
  /** Brief description */
  description: string;
  /** Author or owner */
  author: string;
  /** Version number */
  version: string;
  /** File size in bytes (for documents) */
  fileSize?: number;
  /** External URL (for references) */
  externalUrl?: string;
  /** Related knowledge item IDs */
  relatedItems?: string[];
  /** Cognate IDs that use this knowledge */
  usedByCognates?: string[];
}

// ============================================================================
// MOCK DATA - DOCUMENTS (15)
// ============================================================================

const documents: KnowledgeItem[] = [
  {
    id: 'know-doc-001',
    title: 'SOC 2 Type II Compliance Framework',
    type: 'document',
    source: 'internal',
    status: 'published',
    tags: ['compliance', 'soc2', 'security', 'audit'],
    spaceIds: ['space-compliance', 'space-security'],
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2025-12-01T14:30:00Z',
    citations: 247,
    description:
      'Comprehensive guide to SOC 2 Type II compliance requirements, controls, and evidence collection procedures.',
    author: 'Compliance Team',
    version: '4.2.0',
    fileSize: 2457600,
    relatedItems: ['know-doc-002', 'know-pol-001', 'know-proc-001'],
    usedByCognates: ['cog-compliance-monitor', 'cog-audit-collector'],
  },
  {
    id: 'know-doc-002',
    title: 'GDPR Data Processing Guidelines',
    type: 'document',
    source: 'regulatory',
    status: 'published',
    tags: ['compliance', 'gdpr', 'privacy', 'data-protection', 'eu'],
    spaceIds: ['space-compliance', 'space-legal'],
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2025-11-15T11:00:00Z',
    citations: 189,
    description:
      'Official guidelines for GDPR-compliant data processing, including consent management, data subject rights, and cross-border transfers.',
    author: 'Legal Department',
    version: '3.1.0',
    fileSize: 1843200,
    relatedItems: ['know-doc-001', 'know-pol-002', 'know-ref-001'],
    usedByCognates: ['cog-compliance-monitor'],
  },
  {
    id: 'know-doc-003',
    title: 'Customer Onboarding Playbook',
    type: 'document',
    source: 'internal',
    status: 'published',
    tags: ['customer-success', 'onboarding', 'sales', 'process'],
    spaceIds: ['space-customer-success', 'space-sales'],
    createdAt: '2024-05-20T09:00:00Z',
    updatedAt: '2025-10-22T16:45:00Z',
    citations: 156,
    description:
      'Step-by-step guide for customer onboarding, including kickoff meetings, implementation milestones, and success criteria.',
    author: 'Customer Success Team',
    version: '2.8.0',
    fileSize: 1228800,
    relatedItems: ['know-proc-003', 'know-proc-004'],
    usedByCognates: ['cog-customer-success'],
  },
  {
    id: 'know-doc-004',
    title: 'Security Incident Response Plan',
    type: 'document',
    source: 'internal',
    status: 'published',
    tags: ['security', 'incident-response', 'critical', 'procedures'],
    spaceIds: ['space-security'],
    createdAt: '2024-02-01T14:00:00Z',
    updatedAt: '2026-01-05T10:30:00Z',
    citations: 312,
    description:
      'Comprehensive incident response procedures including detection, containment, eradication, and recovery protocols.',
    author: 'Security Operations',
    version: '5.0.1',
    fileSize: 3072000,
    relatedItems: ['know-proc-005', 'know-pol-003'],
    usedByCognates: ['cog-threat-hunter', 'cog-incident-responder'],
  },
  {
    id: 'know-doc-005',
    title: 'Sales Qualification Framework (MEDDIC)',
    type: 'document',
    source: 'internal',
    status: 'published',
    tags: ['sales', 'qualification', 'meddic', 'methodology'],
    spaceIds: ['space-sales'],
    createdAt: '2024-04-12T11:00:00Z',
    updatedAt: '2025-09-18T13:20:00Z',
    citations: 98,
    description:
      'MEDDIC sales qualification methodology adapted for enterprise software sales, including scoring matrices and deal progression criteria.',
    author: 'Sales Enablement',
    version: '2.3.0',
    fileSize: 921600,
    relatedItems: ['know-proc-006'],
    usedByCognates: ['cog-revenue-analyst'],
  },
  {
    id: 'know-doc-006',
    title: 'API Security Standards',
    type: 'document',
    source: 'internal',
    status: 'published',
    tags: ['security', 'api', 'development', 'standards'],
    spaceIds: ['space-security', 'space-engineering'],
    createdAt: '2024-06-01T10:00:00Z',
    updatedAt: '2025-12-10T09:15:00Z',
    citations: 134,
    description:
      'Security standards for API development including authentication, authorization, rate limiting, and input validation requirements.',
    author: 'Security Architecture',
    version: '3.2.0',
    fileSize: 1536000,
    relatedItems: ['know-ref-002', 'know-pol-004'],
    usedByCognates: ['cog-threat-hunter'],
  },
  {
    id: 'know-doc-007',
    title: 'Financial Controls Documentation',
    type: 'document',
    source: 'internal',
    status: 'published',
    tags: ['finance', 'controls', 'audit', 'compliance'],
    spaceIds: ['space-compliance', 'space-finance'],
    createdAt: '2024-07-15T08:30:00Z',
    updatedAt: '2025-11-28T14:00:00Z',
    citations: 87,
    description:
      'Documentation of financial controls including segregation of duties, approval workflows, and reconciliation procedures.',
    author: 'Finance Team',
    version: '2.1.0',
    fileSize: 1740800,
    relatedItems: ['know-pol-005', 'know-proc-007'],
    usedByCognates: ['cog-audit-collector'],
  },
  {
    id: 'know-doc-008',
    title: 'Employee Handbook 2026',
    type: 'document',
    source: 'internal',
    status: 'published',
    tags: ['hr', 'policy', 'employees', 'handbook'],
    spaceIds: ['space-hr'],
    createdAt: '2025-12-01T09:00:00Z',
    updatedAt: '2026-01-02T11:30:00Z',
    citations: 56,
    description:
      'Comprehensive employee handbook covering company policies, benefits, code of conduct, and workplace guidelines.',
    author: 'Human Resources',
    version: '2026.1',
    fileSize: 2867200,
    relatedItems: ['know-pol-006', 'know-pol-007'],
    usedByCognates: [],
  },
  {
    id: 'know-doc-009',
    title: 'Vendor Risk Assessment Template',
    type: 'document',
    source: 'internal',
    status: 'published',
    tags: ['vendor', 'risk', 'assessment', 'procurement'],
    spaceIds: ['space-compliance', 'space-procurement'],
    createdAt: '2024-08-20T10:00:00Z',
    updatedAt: '2025-10-05T15:45:00Z',
    citations: 73,
    description:
      'Standardized template for assessing vendor security, compliance, and operational risks before engagement.',
    author: 'Procurement & Compliance',
    version: '1.8.0',
    fileSize: 614400,
    relatedItems: ['know-proc-008'],
    usedByCognates: ['cog-compliance-monitor'],
  },
  {
    id: 'know-doc-010',
    title: 'Customer Success Metrics Guide',
    type: 'document',
    source: 'internal',
    status: 'published',
    tags: ['customer-success', 'metrics', 'kpi', 'reporting'],
    spaceIds: ['space-customer-success'],
    createdAt: '2024-09-05T14:00:00Z',
    updatedAt: '2025-11-12T10:30:00Z',
    citations: 112,
    description:
      'Guide to customer success metrics including health scores, NPS, churn prediction, and expansion indicators.',
    author: 'CS Operations',
    version: '2.5.0',
    fileSize: 1024000,
    relatedItems: ['know-proc-009'],
    usedByCognates: ['cog-customer-success'],
  },
  {
    id: 'know-doc-011',
    title: 'Data Classification Policy Guide',
    type: 'document',
    source: 'internal',
    status: 'published',
    tags: ['data', 'classification', 'security', 'privacy'],
    spaceIds: ['space-compliance', 'space-security'],
    createdAt: '2024-04-01T09:00:00Z',
    updatedAt: '2025-12-18T11:00:00Z',
    citations: 201,
    description:
      'Comprehensive guide to data classification levels, handling requirements, and protection standards for each classification tier.',
    author: 'Information Security',
    version: '3.0.0',
    fileSize: 1433600,
    relatedItems: ['know-pol-002', 'know-pol-008'],
    usedByCognates: ['cog-compliance-monitor', 'cog-threat-hunter'],
  },
  {
    id: 'know-doc-012',
    title: 'Contract Management Handbook',
    type: 'document',
    source: 'internal',
    status: 'published',
    tags: ['legal', 'contracts', 'sales', 'procurement'],
    spaceIds: ['space-legal', 'space-sales'],
    createdAt: '2024-10-15T10:00:00Z',
    updatedAt: '2025-11-30T14:20:00Z',
    citations: 89,
    description:
      'Handbook covering contract lifecycle management, standard terms, negotiation guidelines, and renewal procedures.',
    author: 'Legal Operations',
    version: '2.2.0',
    fileSize: 1843200,
    relatedItems: ['know-proc-010', 'know-pol-009'],
    usedByCognates: ['cog-customer-success'],
  },
  {
    id: 'know-doc-013',
    title: 'Business Continuity Plan',
    type: 'document',
    source: 'internal',
    status: 'published',
    tags: ['business-continuity', 'disaster-recovery', 'critical'],
    spaceIds: ['space-security', 'space-operations'],
    createdAt: '2024-02-28T08:00:00Z',
    updatedAt: '2025-12-20T16:00:00Z',
    citations: 67,
    description:
      'Business continuity and disaster recovery plan including RTO/RPO objectives, failover procedures, and communication protocols.',
    author: 'Operations Team',
    version: '4.1.0',
    fileSize: 2252800,
    relatedItems: ['know-doc-004', 'know-proc-011'],
    usedByCognates: ['cog-incident-responder'],
  },
  {
    id: 'know-doc-014',
    title: 'Lead Scoring Model Documentation',
    type: 'document',
    source: 'generated',
    status: 'published',
    tags: ['sales', 'leads', 'scoring', 'ml', 'analytics'],
    spaceIds: ['space-sales'],
    createdAt: '2025-01-10T11:00:00Z',
    updatedAt: '2025-12-05T09:30:00Z',
    citations: 145,
    description:
      'Technical documentation for the ML-based lead scoring model including feature engineering, model training, and score interpretation.',
    author: 'Data Science Team',
    version: '2.0.0',
    fileSize: 1638400,
    relatedItems: ['know-ref-003'],
    usedByCognates: ['cog-revenue-analyst'],
  },
  {
    id: 'know-doc-015',
    title: 'Audit Evidence Collection Guide',
    type: 'document',
    source: 'internal',
    status: 'published',
    tags: ['audit', 'evidence', 'compliance', 'documentation'],
    spaceIds: ['space-compliance'],
    createdAt: '2024-11-01T10:00:00Z',
    updatedAt: '2026-01-10T13:45:00Z',
    citations: 178,
    description:
      'Guide for collecting, organizing, and presenting audit evidence for SOC 2, ISO 27001, and other compliance frameworks.',
    author: 'Compliance Team',
    version: '3.1.0',
    fileSize: 1228800,
    relatedItems: ['know-doc-001', 'know-proc-001'],
    usedByCognates: ['cog-audit-collector'],
  },
];

// ============================================================================
// MOCK DATA - POLICIES (8)
// ============================================================================

const policies: KnowledgeItem[] = [
  {
    id: 'know-pol-001',
    title: 'Information Security Policy',
    type: 'policy',
    source: 'internal',
    status: 'published',
    tags: ['security', 'policy', 'mandatory', 'compliance'],
    spaceIds: ['space-security', 'space-compliance'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2025-12-15T10:00:00Z',
    citations: 423,
    description:
      'Master information security policy establishing security requirements, responsibilities, and governance structure.',
    author: 'CISO Office',
    version: '5.0.0',
    relatedItems: ['know-doc-004', 'know-doc-006'],
    usedByCognates: ['cog-threat-hunter', 'cog-compliance-monitor'],
  },
  {
    id: 'know-pol-002',
    title: 'Data Privacy and Protection Policy',
    type: 'policy',
    source: 'internal',
    status: 'published',
    tags: ['privacy', 'gdpr', 'data-protection', 'policy'],
    spaceIds: ['space-compliance', 'space-legal'],
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2025-11-20T14:30:00Z',
    citations: 312,
    description:
      'Policy governing the collection, processing, storage, and disposal of personal and sensitive data.',
    author: 'Privacy Officer',
    version: '4.2.0',
    relatedItems: ['know-doc-002', 'know-doc-011'],
    usedByCognates: ['cog-compliance-monitor'],
  },
  {
    id: 'know-pol-003',
    title: 'Incident Response Policy',
    type: 'policy',
    source: 'internal',
    status: 'published',
    tags: ['security', 'incident-response', 'policy', 'critical'],
    spaceIds: ['space-security'],
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2026-01-08T09:00:00Z',
    citations: 267,
    description:
      'Policy defining incident classification, escalation paths, response procedures, and post-incident review requirements.',
    author: 'Security Operations',
    version: '3.5.0',
    relatedItems: ['know-doc-004', 'know-proc-005'],
    usedByCognates: ['cog-incident-responder', 'cog-threat-hunter'],
  },
  {
    id: 'know-pol-004',
    title: 'Access Control Policy',
    type: 'policy',
    source: 'internal',
    status: 'published',
    tags: ['security', 'access-control', 'identity', 'policy'],
    spaceIds: ['space-security', 'space-it'],
    createdAt: '2024-03-01T09:00:00Z',
    updatedAt: '2025-10-30T11:15:00Z',
    citations: 198,
    description:
      'Policy governing user access management, authentication requirements, and least privilege principles.',
    author: 'Identity & Access Team',
    version: '3.0.0',
    relatedItems: ['know-doc-006'],
    usedByCognates: ['cog-threat-hunter'],
  },
  {
    id: 'know-pol-005',
    title: 'Financial Transaction Approval Policy',
    type: 'policy',
    source: 'internal',
    status: 'published',
    tags: ['finance', 'approval', 'controls', 'policy'],
    spaceIds: ['space-finance', 'space-compliance'],
    createdAt: '2024-04-01T08:00:00Z',
    updatedAt: '2025-12-01T10:00:00Z',
    citations: 134,
    description:
      'Policy establishing approval thresholds, segregation of duties, and authorization requirements for financial transactions.',
    author: 'Finance & Compliance',
    version: '2.4.0',
    relatedItems: ['know-doc-007'],
    usedByCognates: ['cog-audit-collector'],
  },
  {
    id: 'know-pol-006',
    title: 'Remote Work Policy',
    type: 'policy',
    source: 'internal',
    status: 'published',
    tags: ['hr', 'remote-work', 'policy', 'employees'],
    spaceIds: ['space-hr'],
    createdAt: '2024-05-15T09:00:00Z',
    updatedAt: '2025-09-01T14:00:00Z',
    citations: 89,
    description:
      'Policy governing remote work arrangements, equipment requirements, security expectations, and communication standards.',
    author: 'Human Resources',
    version: '2.1.0',
    relatedItems: ['know-doc-008'],
    usedByCognates: [],
  },
  {
    id: 'know-pol-007',
    title: 'Code of Conduct',
    type: 'policy',
    source: 'internal',
    status: 'published',
    tags: ['hr', 'ethics', 'conduct', 'policy'],
    spaceIds: ['space-hr', 'space-compliance'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2025-12-20T10:30:00Z',
    citations: 156,
    description:
      'Company code of conduct establishing ethical standards, behavioral expectations, and reporting mechanisms.',
    author: 'Legal & HR',
    version: '3.0.0',
    relatedItems: ['know-doc-008'],
    usedByCognates: ['cog-compliance-monitor'],
  },
  {
    id: 'know-pol-008',
    title: 'Data Retention and Disposal Policy',
    type: 'policy',
    source: 'internal',
    status: 'published',
    tags: ['data', 'retention', 'disposal', 'compliance', 'policy'],
    spaceIds: ['space-compliance', 'space-legal'],
    createdAt: '2024-06-01T10:00:00Z',
    updatedAt: '2025-11-10T15:00:00Z',
    citations: 178,
    description:
      'Policy defining data retention schedules, archival procedures, and secure disposal requirements by data type.',
    author: 'Compliance & Legal',
    version: '2.3.0',
    relatedItems: ['know-doc-011', 'know-doc-002'],
    usedByCognates: ['cog-compliance-monitor'],
  },
];

// ============================================================================
// MOCK DATA - PROCEDURES (10)
// ============================================================================

const procedures: KnowledgeItem[] = [
  {
    id: 'know-proc-001',
    title: 'SOC 2 Evidence Collection Procedure',
    type: 'procedure',
    source: 'internal',
    status: 'published',
    tags: ['compliance', 'soc2', 'audit', 'procedure'],
    spaceIds: ['space-compliance'],
    createdAt: '2024-03-20T10:00:00Z',
    updatedAt: '2025-12-15T11:30:00Z',
    citations: 189,
    description:
      'Step-by-step procedure for collecting and organizing SOC 2 audit evidence across all trust service criteria.',
    author: 'Compliance Team',
    version: '3.2.0',
    relatedItems: ['know-doc-001', 'know-doc-015'],
    usedByCognates: ['cog-audit-collector'],
  },
  {
    id: 'know-proc-002',
    title: 'Change Management Procedure',
    type: 'procedure',
    source: 'internal',
    status: 'published',
    tags: ['change-management', 'it', 'procedure', 'controls'],
    spaceIds: ['space-it', 'space-compliance'],
    createdAt: '2024-04-05T09:00:00Z',
    updatedAt: '2025-11-25T14:00:00Z',
    citations: 234,
    description:
      'Procedure for requesting, reviewing, approving, and implementing changes to production systems.',
    author: 'IT Operations',
    version: '4.0.0',
    relatedItems: ['know-pol-001'],
    usedByCognates: ['cog-compliance-monitor'],
  },
  {
    id: 'know-proc-003',
    title: 'Customer Kickoff Meeting Procedure',
    type: 'procedure',
    source: 'internal',
    status: 'published',
    tags: ['customer-success', 'onboarding', 'meeting', 'procedure'],
    spaceIds: ['space-customer-success'],
    createdAt: '2024-05-25T11:00:00Z',
    updatedAt: '2025-10-15T09:45:00Z',
    citations: 78,
    description:
      'Standardized procedure for conducting customer kickoff meetings including agenda, stakeholders, and success criteria.',
    author: 'CS Enablement',
    version: '2.1.0',
    relatedItems: ['know-doc-003'],
    usedByCognates: ['cog-customer-success'],
  },
  {
    id: 'know-proc-004',
    title: 'Customer Health Check Procedure',
    type: 'procedure',
    source: 'internal',
    status: 'published',
    tags: ['customer-success', 'health-check', 'procedure'],
    spaceIds: ['space-customer-success'],
    createdAt: '2024-06-10T10:00:00Z',
    updatedAt: '2025-11-08T13:30:00Z',
    citations: 112,
    description:
      'Procedure for conducting quarterly customer health checks including metrics review, risk assessment, and action planning.',
    author: 'CS Operations',
    version: '2.5.0',
    relatedItems: ['know-doc-003', 'know-doc-010'],
    usedByCognates: ['cog-customer-success'],
  },
  {
    id: 'know-proc-005',
    title: 'Security Incident Triage Procedure',
    type: 'procedure',
    source: 'internal',
    status: 'published',
    tags: ['security', 'incident', 'triage', 'procedure', 'critical'],
    spaceIds: ['space-security'],
    createdAt: '2024-02-15T14:00:00Z',
    updatedAt: '2026-01-12T10:00:00Z',
    citations: 287,
    description:
      'Procedure for initial triage of security incidents including severity classification, escalation paths, and initial response actions.',
    author: 'SOC Team',
    version: '4.1.0',
    relatedItems: ['know-doc-004', 'know-pol-003'],
    usedByCognates: ['cog-incident-responder', 'cog-threat-hunter'],
  },
  {
    id: 'know-proc-006',
    title: 'Lead Qualification Procedure',
    type: 'procedure',
    source: 'internal',
    status: 'published',
    tags: ['sales', 'leads', 'qualification', 'procedure'],
    spaceIds: ['space-sales'],
    createdAt: '2024-04-20T09:00:00Z',
    updatedAt: '2025-09-22T11:00:00Z',
    citations: 89,
    description:
      'Procedure for qualifying inbound and outbound leads using MEDDIC criteria and scoring matrices.',
    author: 'Sales Operations',
    version: '2.0.0',
    relatedItems: ['know-doc-005'],
    usedByCognates: ['cog-revenue-analyst'],
  },
  {
    id: 'know-proc-007',
    title: 'Month-End Close Procedure',
    type: 'procedure',
    source: 'internal',
    status: 'published',
    tags: ['finance', 'accounting', 'close', 'procedure'],
    spaceIds: ['space-finance'],
    createdAt: '2024-07-01T08:00:00Z',
    updatedAt: '2025-12-28T16:00:00Z',
    citations: 67,
    description:
      'Step-by-step procedure for month-end financial close including reconciliations, accruals, and reporting.',
    author: 'Accounting Team',
    version: '3.0.0',
    relatedItems: ['know-doc-007'],
    usedByCognates: [],
  },
  {
    id: 'know-proc-008',
    title: 'Vendor Onboarding Procedure',
    type: 'procedure',
    source: 'internal',
    status: 'published',
    tags: ['vendor', 'onboarding', 'procurement', 'procedure'],
    spaceIds: ['space-procurement', 'space-compliance'],
    createdAt: '2024-08-25T10:00:00Z',
    updatedAt: '2025-10-10T14:30:00Z',
    citations: 56,
    description:
      'Procedure for onboarding new vendors including risk assessment, contract review, and system provisioning.',
    author: 'Procurement Team',
    version: '2.2.0',
    relatedItems: ['know-doc-009'],
    usedByCognates: ['cog-compliance-monitor'],
  },
  {
    id: 'know-proc-009',
    title: 'Customer Renewal Process',
    type: 'procedure',
    source: 'internal',
    status: 'published',
    tags: ['customer-success', 'renewals', 'procedure'],
    spaceIds: ['space-customer-success', 'space-sales'],
    createdAt: '2024-09-10T11:00:00Z',
    updatedAt: '2025-11-18T10:15:00Z',
    citations: 98,
    description:
      'End-to-end procedure for managing customer renewals from 90-day notice through contract execution.',
    author: 'CS & Sales Ops',
    version: '2.4.0',
    relatedItems: ['know-doc-010', 'know-doc-012'],
    usedByCognates: ['cog-customer-success'],
  },
  {
    id: 'know-proc-010',
    title: 'Contract Review and Approval Procedure',
    type: 'procedure',
    source: 'internal',
    status: 'published',
    tags: ['legal', 'contracts', 'approval', 'procedure'],
    spaceIds: ['space-legal', 'space-sales'],
    createdAt: '2024-10-20T09:00:00Z',
    updatedAt: '2025-12-05T15:30:00Z',
    citations: 78,
    description:
      'Procedure for legal review of contracts including non-standard terms escalation and approval workflows.',
    author: 'Legal Operations',
    version: '2.1.0',
    relatedItems: ['know-doc-012', 'know-pol-009'],
    usedByCognates: [],
  },
];

// ============================================================================
// MOCK DATA - REFERENCES (7)
// ============================================================================

const references: KnowledgeItem[] = [
  {
    id: 'know-ref-001',
    title: 'GDPR Official Regulation Text',
    type: 'reference',
    source: 'regulatory',
    status: 'published',
    tags: ['gdpr', 'regulation', 'eu', 'privacy', 'external'],
    spaceIds: ['space-compliance', 'space-legal'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2025-06-01T10:00:00Z',
    citations: 167,
    description:
      'Official text of the General Data Protection Regulation (EU) 2016/679 with article-by-article breakdown.',
    author: 'European Union',
    version: '2016/679',
    externalUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016R0679',
    relatedItems: ['know-doc-002', 'know-pol-002'],
    usedByCognates: ['cog-compliance-monitor'],
  },
  {
    id: 'know-ref-002',
    title: 'OWASP API Security Top 10',
    type: 'reference',
    source: 'external',
    status: 'published',
    tags: ['security', 'api', 'owasp', 'external', 'best-practices'],
    spaceIds: ['space-security', 'space-engineering'],
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2025-09-01T14:00:00Z',
    citations: 123,
    description:
      'OWASP API Security Top 10 vulnerabilities and recommended mitigations for secure API development.',
    author: 'OWASP Foundation',
    version: '2023',
    externalUrl: 'https://owasp.org/API-Security/editions/2023/en/0x00-header/',
    relatedItems: ['know-doc-006'],
    usedByCognates: ['cog-threat-hunter'],
  },
  {
    id: 'know-ref-003',
    title: 'CRISP-DM Data Mining Methodology',
    type: 'reference',
    source: 'external',
    status: 'published',
    tags: ['data-science', 'methodology', 'ml', 'external'],
    spaceIds: ['space-sales', 'space-analytics'],
    createdAt: '2024-06-01T11:00:00Z',
    updatedAt: '2025-08-15T09:30:00Z',
    citations: 45,
    description:
      'Cross-Industry Standard Process for Data Mining - methodology reference for data science projects.',
    author: 'IBM/NCR/Daimler',
    version: '1.0',
    externalUrl: 'https://www.datascience-pm.com/crisp-dm-2/',
    relatedItems: ['know-doc-014'],
    usedByCognates: ['cog-revenue-analyst'],
  },
  {
    id: 'know-ref-004',
    title: 'NIST Cybersecurity Framework',
    type: 'reference',
    source: 'regulatory',
    status: 'published',
    tags: ['security', 'nist', 'framework', 'external', 'compliance'],
    spaceIds: ['space-security', 'space-compliance'],
    createdAt: '2024-02-01T08:00:00Z',
    updatedAt: '2025-12-01T10:00:00Z',
    citations: 198,
    description:
      'NIST Cybersecurity Framework 2.0 providing standards and best practices for managing cybersecurity risk.',
    author: 'NIST',
    version: '2.0',
    externalUrl: 'https://www.nist.gov/cyberframework',
    relatedItems: ['know-pol-001', 'know-doc-004'],
    usedByCognates: ['cog-threat-hunter', 'cog-compliance-monitor'],
  },
  {
    id: 'know-ref-005',
    title: 'ISO 27001:2022 Standard Summary',
    type: 'reference',
    source: 'regulatory',
    status: 'published',
    tags: ['security', 'iso', 'compliance', 'external', 'certification'],
    spaceIds: ['space-compliance', 'space-security'],
    createdAt: '2024-04-01T10:00:00Z',
    updatedAt: '2025-10-20T11:30:00Z',
    citations: 156,
    description:
      'Summary of ISO 27001:2022 information security management system requirements and Annex A controls.',
    author: 'ISO',
    version: '2022',
    externalUrl: 'https://www.iso.org/standard/27001',
    relatedItems: ['know-doc-001', 'know-pol-001'],
    usedByCognates: ['cog-compliance-monitor', 'cog-audit-collector'],
  },
  {
    id: 'know-ref-006',
    title: 'SOC 2 Trust Service Criteria',
    type: 'reference',
    source: 'regulatory',
    status: 'published',
    tags: ['soc2', 'compliance', 'audit', 'external', 'aicpa'],
    spaceIds: ['space-compliance'],
    createdAt: '2024-03-01T09:00:00Z',
    updatedAt: '2025-11-15T14:00:00Z',
    citations: 234,
    description:
      'AICPA Trust Service Criteria defining requirements for Security, Availability, Processing Integrity, Confidentiality, and Privacy.',
    author: 'AICPA',
    version: '2017 (Updated 2022)',
    externalUrl: 'https://www.aicpa.org/resources/landing/soc-trust-services-criteria',
    relatedItems: ['know-doc-001', 'know-proc-001'],
    usedByCognates: ['cog-audit-collector'],
  },
  {
    id: 'know-ref-007',
    title: 'CCPA/CPRA Consumer Privacy Rights',
    type: 'reference',
    source: 'regulatory',
    status: 'published',
    tags: ['privacy', 'ccpa', 'cpra', 'california', 'external'],
    spaceIds: ['space-compliance', 'space-legal'],
    createdAt: '2024-05-01T10:00:00Z',
    updatedAt: '2025-12-10T09:00:00Z',
    citations: 89,
    description:
      'California Consumer Privacy Act and California Privacy Rights Act requirements for consumer data rights and business obligations.',
    author: 'State of California',
    version: '2023',
    externalUrl: 'https://oag.ca.gov/privacy/ccpa',
    relatedItems: ['know-pol-002', 'know-doc-002'],
    usedByCognates: ['cog-compliance-monitor'],
  },
];

// ============================================================================
// EXPORTS
// ============================================================================

/** All knowledge items combined */
export const mockKnowledge: KnowledgeItem[] = [
  ...documents,
  ...policies,
  ...procedures,
  ...references,
];

/** Knowledge items by type */
export const mockDocuments: KnowledgeItem[] = documents;
export const mockPolicies: KnowledgeItem[] = policies;
export const mockProcedures: KnowledgeItem[] = procedures;
export const mockReferences: KnowledgeItem[] = references;

/** Get knowledge item by ID */
export function getKnowledgeById(id: string): KnowledgeItem | undefined {
  return mockKnowledge.find((k) => k.id === id);
}

/** Get knowledge items by type */
export function getKnowledgeByType(type: KnowledgeType): KnowledgeItem[] {
  return mockKnowledge.filter((k) => k.type === type);
}

/** Get knowledge items by Space ID */
export function getKnowledgeBySpace(spaceId: string): KnowledgeItem[] {
  return mockKnowledge.filter((k) => k.spaceIds.includes(spaceId));
}

/** Get knowledge items by tag */
export function getKnowledgeByTag(tag: string): KnowledgeItem[] {
  return mockKnowledge.filter((k) => k.tags.includes(tag));
}

/** Get knowledge items used by a Cognate */
export function getKnowledgeByCognate(cognateId: string): KnowledgeItem[] {
  return mockKnowledge.filter(
    (k) => k.usedByCognates && k.usedByCognates.includes(cognateId)
  );
}

/** Get top cited knowledge items */
export function getTopCitedKnowledge(count: number = 10): KnowledgeItem[] {
  return [...mockKnowledge]
    .sort((a, b) => b.citations - a.citations)
    .slice(0, count);
}

/** Get recently updated knowledge items */
export function getRecentlyUpdatedKnowledge(count: number = 10): KnowledgeItem[] {
  return [...mockKnowledge]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, count);
}

/** Get knowledge statistics */
export function getKnowledgeStats(): {
  total: number;
  documents: number;
  policies: number;
  procedures: number;
  references: number;
  totalCitations: number;
  avgCitations: number;
  topTags: Array<{ tag: string; count: number }>;
} {
  const allTags = mockKnowledge.flatMap((k) => k.tags);
  const tagCounts = allTags.reduce(
    (acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const topTags = Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const totalCitations = mockKnowledge.reduce((sum, k) => sum + k.citations, 0);

  return {
    total: mockKnowledge.length,
    documents: documents.length,
    policies: policies.length,
    procedures: procedures.length,
    references: references.length,
    totalCitations,
    avgCitations: Math.round(totalCitations / mockKnowledge.length),
    topTags,
  };
}

/** Search knowledge items */
export function searchKnowledge(query: string): KnowledgeItem[] {
  const lowerQuery = query.toLowerCase();
  return mockKnowledge.filter(
    (k) =>
      k.title.toLowerCase().includes(lowerQuery) ||
      k.description.toLowerCase().includes(lowerQuery) ||
      k.tags.some((t) => t.toLowerCase().includes(lowerQuery))
  );
}
