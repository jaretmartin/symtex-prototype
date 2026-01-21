/**
 * NEXIS Mock Data
 *
 * NEXIS (Network of Entities, eXpertise, Intelligence, and Signals)
 * is Symtex's relationship intelligence graph that maps connections
 * between people, organizations, concepts, and events.
 *
 * This file provides centralized mock data for NEXIS entities and relationships.
 */

import type { NexisNode, NexisEdge, NexisInsight } from '@/features/nexis/nexis-store';

// ============================================================================
// NEXIS ENTITY TYPES
// ============================================================================

export type NexisEntityType = 'person' | 'organization' | 'concept' | 'event';

export interface NexisEntity {
  id: string;
  type: NexisEntityType;
  name: string;
  description?: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// NEXIS RELATIONSHIP TYPES
// ============================================================================

export type NexisRelationshipType =
  | 'works_at'
  | 'responsible_for'
  | 'leads'
  | 'implements'
  | 'investigated'
  | 'owns'
  | 'manages'
  | 'customer_of'
  | 'validates'
  | 'attended'
  | 'triggered'
  | 'reports_to'
  | 'collaborates_with'
  | 'specializes_in'
  | 'part_of';

export interface NexisRelationship {
  id: string;
  sourceId: string;
  targetId: string;
  type: NexisRelationshipType;
  strength?: number; // 0-100
  since?: string;
  notes?: string;
  metadata?: Record<string, unknown>;
}

// ============================================================================
// MOCK ENTITIES (15 total)
// ============================================================================

// --- People (6) ---

export const mockNexisPeople: NexisEntity[] = [
  {
    id: 'person-sarah-chen',
    type: 'person',
    name: 'Sarah Chen',
    description: 'VP Compliance - Leads all compliance initiatives and SOC2 audit preparation',
    metadata: {
      title: 'VP Compliance',
      email: 'sarah.chen@symtexllc.com',
      department: 'Compliance',
      reportsTo: 'CEO',
      tags: ['leadership', 'compliance', 'audit', 'decision-maker'],
      linkedIn: 'linkedin.com/in/sarahchen',
    },
    createdAt: '2025-06-15T10:00:00Z',
    updatedAt: '2026-01-15T14:30:00Z',
  },
  {
    id: 'person-marcus-johnson',
    type: 'person',
    name: 'Marcus Johnson',
    description: 'Security Lead - Oversees security infrastructure and incident response',
    metadata: {
      title: 'Security Lead',
      email: 'marcus.johnson@symtexllc.com',
      department: 'Security',
      reportsTo: 'sarah-chen',
      tags: ['security', 'technical', 'zero-trust', 'incident-response'],
      certifications: ['CISSP', 'CISM'],
    },
    createdAt: '2025-07-01T09:00:00Z',
    updatedAt: '2026-01-20T11:00:00Z',
  },
  {
    id: 'person-emily-rodriguez',
    type: 'person',
    name: 'Emily Rodriguez',
    description: 'Revenue Ops Director - Manages lead scoring and sales operations',
    metadata: {
      title: 'Revenue Ops Director',
      email: 'emily.rodriguez@symtexllc.com',
      department: 'Revenue Operations',
      reportsTo: 'CRO',
      tags: ['revenue', 'operations', 'lead-scoring', 'analytics'],
    },
    createdAt: '2025-08-10T08:00:00Z',
    updatedAt: '2026-01-18T16:00:00Z',
  },
  {
    id: 'person-david-kim',
    type: 'person',
    name: 'David Kim',
    description: 'Audit Partner at External Auditor Inc - Lead auditor for SOC2 certification',
    metadata: {
      title: 'Audit Partner',
      email: 'david.kim@externalauditor.com',
      company: 'External Auditor Inc',
      tags: ['external', 'audit', 'soc2', 'partner'],
      certifications: ['CPA', 'CISA'],
      isExternal: true,
    },
    createdAt: '2025-09-01T10:00:00Z',
    updatedAt: '2026-01-10T09:00:00Z',
  },
  {
    id: 'person-lisa-wang',
    type: 'person',
    name: 'Lisa Wang',
    description: 'Customer Success Manager - Primary relationship owner for key accounts',
    metadata: {
      title: 'Customer Success Manager',
      email: 'lisa.wang@symtexllc.com',
      department: 'Customer Success',
      reportsTo: 'VP Customer Success',
      tags: ['customer-facing', 'relationships', 'success'],
      managedAccounts: ['techcorp', 'acme-industries'],
    },
    createdAt: '2025-05-20T11:00:00Z',
    updatedAt: '2026-01-19T15:00:00Z',
  },
  {
    id: 'person-james-wilson',
    type: 'person',
    name: 'James Wilson',
    description: 'CTO at TechCorp - Key customer executive and technical decision maker',
    metadata: {
      title: 'Chief Technology Officer',
      email: 'james.wilson@techcorp.io',
      company: 'TechCorp',
      tags: ['customer', 'executive', 'technical', 'decision-maker', 'cto'],
      isExternal: true,
    },
    createdAt: '2025-10-05T14:00:00Z',
    updatedAt: '2026-01-12T10:00:00Z',
  },
];

// --- Organizations (4) ---

export const mockNexisOrganizations: NexisEntity[] = [
  {
    id: 'org-symtex-llc',
    type: 'organization',
    name: 'Symtex LLC',
    description: 'AI operations platform for enterprise automation and Cognate management',
    metadata: {
      industry: 'Enterprise Software',
      size: 'Mid-Market',
      founded: '2024',
      headquarters: 'San Francisco, CA',
      website: 'symtex.io',
      tags: ['ai', 'automation', 'enterprise', 'saas'],
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2026-01-20T12:00:00Z',
  },
  {
    id: 'org-external-auditor',
    type: 'organization',
    name: 'External Auditor Inc',
    description: 'Big Four accounting firm providing audit and compliance services',
    metadata: {
      industry: 'Professional Services',
      size: 'Enterprise',
      services: ['SOC2 Audit', 'Financial Audit', 'Risk Assessment'],
      tags: ['audit', 'compliance', 'external', 'partner'],
      isVendor: true,
    },
    createdAt: '2025-06-01T00:00:00Z',
    updatedAt: '2026-01-05T09:00:00Z',
  },
  {
    id: 'org-techcorp',
    type: 'organization',
    name: 'TechCorp',
    description: 'Enterprise customer - Large technology company using Symtex platform',
    metadata: {
      industry: 'Technology',
      size: 'Enterprise',
      employees: 5000,
      arr: 250000,
      tags: ['customer', 'enterprise', 'technology'],
      tier: 'enterprise',
      healthScore: 92,
    },
    createdAt: '2025-04-15T10:00:00Z',
    updatedAt: '2026-01-18T14:00:00Z',
  },
  {
    id: 'org-acme-industries',
    type: 'organization',
    name: 'ACME Industries',
    description: 'Enterprise customer - Manufacturing conglomerate using Symtex for operations',
    metadata: {
      industry: 'Manufacturing',
      size: 'Enterprise',
      employees: 12000,
      arr: 180000,
      tags: ['customer', 'enterprise', 'manufacturing'],
      tier: 'enterprise',
      healthScore: 78,
    },
    createdAt: '2025-07-20T09:00:00Z',
    updatedAt: '2026-01-15T11:00:00Z',
  },
];

// --- Concepts (3) ---

export const mockNexisConcepts: NexisEntity[] = [
  {
    id: 'concept-soc2-compliance',
    type: 'concept',
    name: 'SOC2 Compliance',
    description: 'Service Organization Control 2 - Security, availability, and confidentiality framework',
    metadata: {
      category: 'compliance',
      framework: 'AICPA',
      trustServiceCriteria: ['Security', 'Availability', 'Processing Integrity', 'Confidentiality', 'Privacy'],
      tags: ['compliance', 'security', 'audit', 'framework'],
      status: 'in_progress',
      targetDate: '2026-03-31',
    },
    createdAt: '2025-06-01T00:00:00Z',
    updatedAt: '2026-01-20T10:00:00Z',
  },
  {
    id: 'concept-lead-scoring-model',
    type: 'concept',
    name: 'Lead Scoring Model',
    description: 'AI-powered model for scoring and prioritizing sales leads based on likelihood to convert',
    metadata: {
      category: 'analytics',
      modelType: 'machine_learning',
      accuracy: 0.87,
      factors: ['engagement', 'firmographics', 'behavior', 'intent'],
      tags: ['ai', 'sales', 'scoring', 'model'],
      lastTrained: '2026-01-15T00:00:00Z',
    },
    createdAt: '2025-09-10T10:00:00Z',
    updatedAt: '2026-01-15T08:00:00Z',
  },
  {
    id: 'concept-zero-trust-architecture',
    type: 'concept',
    name: 'Zero Trust Architecture',
    description: 'Security framework requiring strict verification for every access request',
    metadata: {
      category: 'security',
      principles: ['never trust', 'always verify', 'least privilege', 'assume breach'],
      tags: ['security', 'architecture', 'zero-trust', 'framework'],
      implementationStatus: 'active',
      coverage: 0.85,
    },
    createdAt: '2025-08-01T00:00:00Z',
    updatedAt: '2026-01-18T14:00:00Z',
  },
];

// --- Events (2) ---

export const mockNexisEvents: NexisEntity[] = [
  {
    id: 'event-q1-2026-soc2-audit',
    type: 'event',
    name: 'Q1 2026 SOC2 Audit',
    description: 'Annual SOC2 Type II audit conducted by External Auditor Inc',
    metadata: {
      eventType: 'audit',
      startDate: '2026-02-15',
      endDate: '2026-03-15',
      status: 'scheduled',
      location: 'Remote & On-site',
      stakeholders: ['sarah-chen', 'marcus-johnson', 'david-kim'],
      tags: ['audit', 'soc2', 'compliance', 'q1-2026'],
      milestones: [
        { name: 'Document Collection', date: '2026-02-15', status: 'pending' },
        { name: 'Control Testing', date: '2026-02-25', status: 'pending' },
        { name: 'Final Report', date: '2026-03-15', status: 'pending' },
      ],
    },
    createdAt: '2025-12-01T10:00:00Z',
    updatedAt: '2026-01-10T09:00:00Z',
  },
  {
    id: 'event-jan-2026-phishing-attempt',
    type: 'event',
    name: 'Jan 2026 Phishing Attempt',
    description: 'Coordinated phishing attack targeting Symtex employees - successfully contained',
    metadata: {
      eventType: 'security_incident',
      occurredAt: '2026-01-08T14:30:00Z',
      resolvedAt: '2026-01-08T16:45:00Z',
      severity: 'high',
      status: 'resolved',
      affectedUsers: 12,
      compromisedAccounts: 0,
      investigator: 'marcus-johnson',
      tags: ['security', 'incident', 'phishing', 'contained'],
      lessonsLearned: 'Enhanced email filtering rules deployed',
    },
    createdAt: '2026-01-08T17:00:00Z',
    updatedAt: '2026-01-12T11:00:00Z',
  },
];

// ============================================================================
// MOCK RELATIONSHIPS (17+)
// ============================================================================

export const mockNexisRelationships: NexisRelationship[] = [
  // works_at relationships
  {
    id: 'rel-sarah-symtex',
    sourceId: 'person-sarah-chen',
    targetId: 'org-symtex-llc',
    type: 'works_at',
    strength: 100,
    since: '2025-01-15',
    notes: 'VP Compliance, joined from Big Four firm',
  },
  {
    id: 'rel-marcus-symtex',
    sourceId: 'person-marcus-johnson',
    targetId: 'org-symtex-llc',
    type: 'works_at',
    strength: 100,
    since: '2025-03-01',
    notes: 'Security Lead, former FAANG security engineer',
  },
  {
    id: 'rel-emily-symtex',
    sourceId: 'person-emily-rodriguez',
    targetId: 'org-symtex-llc',
    type: 'works_at',
    strength: 100,
    since: '2025-06-01',
    notes: 'Revenue Ops Director, leads lead scoring initiative',
  },
  {
    id: 'rel-lisa-symtex',
    sourceId: 'person-lisa-wang',
    targetId: 'org-symtex-llc',
    type: 'works_at',
    strength: 100,
    since: '2025-02-01',
    notes: 'CS Manager, manages enterprise accounts',
  },
  {
    id: 'rel-david-external-auditor',
    sourceId: 'person-david-kim',
    targetId: 'org-external-auditor',
    type: 'works_at',
    strength: 100,
    since: '2018-01-01',
    notes: 'Audit Partner, 8+ years with firm',
  },
  {
    id: 'rel-james-techcorp',
    sourceId: 'person-james-wilson',
    targetId: 'org-techcorp',
    type: 'works_at',
    strength: 100,
    since: '2022-05-01',
    notes: 'CTO, key technical decision maker',
  },

  // responsible_for relationships
  {
    id: 'rel-sarah-soc2',
    sourceId: 'person-sarah-chen',
    targetId: 'concept-soc2-compliance',
    type: 'responsible_for',
    strength: 95,
    notes: 'Executive sponsor for SOC2 initiative',
  },
  {
    id: 'rel-emily-lead-scoring',
    sourceId: 'person-emily-rodriguez',
    targetId: 'concept-lead-scoring-model',
    type: 'owns',
    strength: 90,
    notes: 'Product owner for lead scoring model',
  },

  // leads relationships
  {
    id: 'rel-marcus-zero-trust',
    sourceId: 'person-marcus-johnson',
    targetId: 'concept-zero-trust-architecture',
    type: 'leads',
    strength: 95,
    notes: 'Leads zero trust implementation program',
  },

  // implements relationships
  {
    id: 'rel-symtex-zero-trust',
    sourceId: 'org-symtex-llc',
    targetId: 'concept-zero-trust-architecture',
    type: 'implements',
    strength: 85,
    since: '2025-08-01',
    notes: '85% implementation coverage achieved',
  },

  // investigated relationships
  {
    id: 'rel-marcus-phishing',
    sourceId: 'person-marcus-johnson',
    targetId: 'event-jan-2026-phishing-attempt',
    type: 'investigated',
    strength: 100,
    notes: 'Led incident response and containment',
  },

  // manages relationships
  {
    id: 'rel-lisa-techcorp',
    sourceId: 'person-lisa-wang',
    targetId: 'org-techcorp',
    type: 'manages',
    strength: 90,
    since: '2025-05-01',
    notes: 'Primary CSM for TechCorp account',
  },
  {
    id: 'rel-lisa-acme',
    sourceId: 'person-lisa-wang',
    targetId: 'org-acme-industries',
    type: 'manages',
    strength: 85,
    since: '2025-08-01',
    notes: 'Primary CSM for ACME account',
  },

  // customer_of relationships
  {
    id: 'rel-techcorp-symtex',
    sourceId: 'org-techcorp',
    targetId: 'org-symtex-llc',
    type: 'customer_of',
    strength: 92,
    since: '2025-04-15',
    notes: 'Enterprise tier customer, $250K ARR',
    metadata: { arr: 250000, healthScore: 92 },
  },
  {
    id: 'rel-acme-symtex',
    sourceId: 'org-acme-industries',
    targetId: 'org-symtex-llc',
    type: 'customer_of',
    strength: 78,
    since: '2025-07-20',
    notes: 'Enterprise tier customer, $180K ARR',
    metadata: { arr: 180000, healthScore: 78 },
  },

  // validates relationships
  {
    id: 'rel-david-soc2-audit',
    sourceId: 'person-david-kim',
    targetId: 'event-q1-2026-soc2-audit',
    type: 'validates',
    strength: 100,
    notes: 'Lead auditor for SOC2 certification',
  },
  {
    id: 'rel-external-auditor-symtex',
    sourceId: 'org-external-auditor',
    targetId: 'org-symtex-llc',
    type: 'validates',
    strength: 95,
    since: '2025-06-01',
    notes: 'Contracted auditor for compliance',
  },

  // Additional relationships for graph richness
  {
    id: 'rel-soc2-audit-event',
    sourceId: 'concept-soc2-compliance',
    targetId: 'event-q1-2026-soc2-audit',
    type: 'part_of',
    strength: 100,
    notes: 'Audit is part of SOC2 compliance program',
  },
  {
    id: 'rel-sarah-david-collab',
    sourceId: 'person-sarah-chen',
    targetId: 'person-david-kim',
    type: 'collaborates_with',
    strength: 80,
    since: '2025-06-01',
    notes: 'Primary audit relationship',
  },
  {
    id: 'rel-marcus-specializes',
    sourceId: 'person-marcus-johnson',
    targetId: 'concept-zero-trust-architecture',
    type: 'specializes_in',
    strength: 95,
    notes: 'Subject matter expert on zero trust',
  },
];

// ============================================================================
// ALL ENTITIES COMBINED
// ============================================================================

export const mockNexisEntities: NexisEntity[] = [
  ...mockNexisPeople,
  ...mockNexisOrganizations,
  ...mockNexisConcepts,
  ...mockNexisEvents,
];

// ============================================================================
// CONVERTED TO NEXIS STORE FORMAT (NexisNode & NexisEdge)
// ============================================================================

/**
 * Convert entities to NexisNode format for the graph visualization
 */
export function convertEntitiesToNodes(): NexisNode[] {
  const nodes: NexisNode[] = [];
  let x = 100;
  let y = 100;
  const xSpacing = 200;
  const ySpacing = 150;
  let col = 0;

  mockNexisEntities.forEach((entity, index) => {
    // Calculate position in a grid layout
    col = index % 4;
    const row = Math.floor(index / 4);
    x = 100 + col * xSpacing;
    y = 100 + row * ySpacing;

    const nodeType = entity.type === 'organization' ? 'company' : entity.type;

    nodes.push({
      id: entity.id,
      type: nodeType as 'person' | 'company' | 'topic' | 'event',
      label: entity.name,
      data: {
        name: entity.name,
        description: entity.description,
        title: entity.metadata.title as string | undefined,
        company: entity.metadata.company as string | undefined,
        email: entity.metadata.email as string | undefined,
        industry: entity.metadata.industry as string | undefined,
        date: entity.metadata.startDate as string | undefined,
        location: entity.metadata.location as string | undefined,
        tags: entity.metadata.tags as string[] | undefined,
        strength: entity.metadata.healthScore as number | undefined,
        lastContact: entity.updatedAt,
      },
      position: { x, y },
    });
  });

  return nodes;
}

/**
 * Convert relationships to NexisEdge format for the graph visualization
 */
export function convertRelationshipsToEdges(): NexisEdge[] {
  return mockNexisRelationships.map((rel) => ({
    id: rel.id,
    source: rel.sourceId,
    target: rel.targetId,
    type: rel.type as NexisEdge['type'],
    label: rel.type.replace(/_/g, ' '),
    data: {
      strength: rel.strength,
      since: rel.since,
      notes: rel.notes,
    },
  }));
}

// Pre-computed nodes and edges for immediate use
export const mockNexisNodes: NexisNode[] = convertEntitiesToNodes();
export const mockNexisEdges: NexisEdge[] = convertRelationshipsToEdges();

// ============================================================================
// NEXIS INSIGHTS
// ============================================================================

export const mockNexisInsights: NexisInsight[] = [
  {
    id: 'insight-audit-prep',
    type: 'reminder',
    title: 'SOC2 Audit Approaching',
    description: 'Q1 2026 SOC2 Audit begins in 25 days. Sarah Chen and David Kim should sync on document collection.',
    relatedNodes: ['person-sarah-chen', 'person-david-kim', 'event-q1-2026-soc2-audit'],
    priority: 'high',
    createdAt: '2026-01-21',
  },
  {
    id: 'insight-techcorp-health',
    type: 'opportunity',
    title: 'TechCorp Expansion Opportunity',
    description: 'TechCorp health score is 92%. James Wilson mentioned interest in additional Cognate deployments. Consider proactive outreach.',
    relatedNodes: ['org-techcorp', 'person-james-wilson', 'person-lisa-wang'],
    priority: 'high',
    createdAt: '2026-01-19',
  },
  {
    id: 'insight-acme-risk',
    type: 'trend',
    title: 'ACME Health Score Declining',
    description: 'ACME Industries health score dropped from 85 to 78 over the past month. Review engagement and schedule check-in.',
    relatedNodes: ['org-acme-industries', 'person-lisa-wang'],
    priority: 'medium',
    createdAt: '2026-01-18',
  },
  {
    id: 'insight-security-improvement',
    type: 'connection',
    title: 'Security Posture Strengthened',
    description: 'Phishing incident was contained with zero compromised accounts. Marcus Johnson implemented enhanced email filtering.',
    relatedNodes: ['person-marcus-johnson', 'event-jan-2026-phishing-attempt', 'concept-zero-trust-architecture'],
    priority: 'low',
    createdAt: '2026-01-12',
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getNexisEntityById(id: string): NexisEntity | undefined {
  return mockNexisEntities.find((entity) => entity.id === id);
}

export function getNexisEntitiesByType(type: NexisEntityType): NexisEntity[] {
  return mockNexisEntities.filter((entity) => entity.type === type);
}

export function getNexisRelationshipsForEntity(entityId: string): NexisRelationship[] {
  return mockNexisRelationships.filter(
    (rel) => rel.sourceId === entityId || rel.targetId === entityId
  );
}

export function getNexisConnectedEntities(entityId: string): NexisEntity[] {
  const relationships = getNexisRelationshipsForEntity(entityId);
  const connectedIds = new Set<string>();

  relationships.forEach((rel) => {
    if (rel.sourceId === entityId) {
      connectedIds.add(rel.targetId);
    } else {
      connectedIds.add(rel.sourceId);
    }
  });

  return mockNexisEntities.filter((entity) => connectedIds.has(entity.id));
}
