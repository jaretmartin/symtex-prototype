/**
 * Demo Scenario Engine
 *
 * Defines named demo scenarios that configure the app state for different
 * demo flows based on persona (executive, operator, builder) and duration.
 *
 * These scenarios are distinct from the industry-specific scenarios in
 * ./scenarios/ - they focus on demonstrating Symtex capabilities to
 * different audience types rather than industry verticals.
 */

// ============================================================================
// Types
// ============================================================================

export type DemoPersona = 'exec' | 'operator' | 'builder';

export type CognateState =
  | 'idle'
  | 'running'
  | 'waiting_approval'
  | 'needs_review'
  | 'completed';

export interface ActiveCognateConfig {
  /** Reference to Cognate ID from mocks/cognates.ts */
  id: string;
  /** Current operational state for this scenario */
  state: CognateState;
  /** Progress percentage (0-100) for running states */
  progress?: number;
}

export interface DemoScenarioConfig {
  /** Space to set as active (from mocks/spaces.ts) */
  activeSpaceId: string;
  /** Project to set as active (from mocks/projects.ts) */
  activeProjectId?: string;

  /** Cognates that are active and their states */
  activeCognates: ActiveCognateConfig[];

  // Scenario toggles
  /** Whether to show policy block UI (governance gate) */
  policyBlockEnabled: boolean;
  /** Whether the current run succeeds or fails */
  runSucceeds: boolean;
  /** Whether to show budget warning indicators */
  budgetWarning: boolean;
  /** Whether there's a pending approval in the queue */
  approvalPending: boolean;

  // Feature flags
  /** Enable C2S2 (Cognate-to-Symbios-to-Cognate) routing */
  c2s2Enabled: boolean;
  /** Enable advanced PromptOps features */
  advancedPromptOps: boolean;
}

export interface DemoScenario {
  /** Unique scenario identifier */
  id: string;
  /** Display name */
  name: string;
  /** Brief description of what this scenario demonstrates */
  description: string;
  /** Expected demo duration (e.g., "3 min", "5 min", "7 min") */
  duration: string;
  /** Target audience persona */
  persona: DemoPersona;

  /** Initial state configuration */
  config: DemoScenarioConfig;

  /** Key "wow moments" this scenario demonstrates */
  wowMoments: string[];

  /** Suggested demo steps/talking points */
  demoSteps: string[];
}

// ============================================================================
// Persona Track Scenarios
// ============================================================================

/**
 * Track A - Executive Demo (3 min)
 *
 * High-level overview focused on business value, ROI, and governance.
 * Shows Signals dashboard, audit trail, and pattern compilation metrics.
 */
const execDemo: DemoScenario = {
  id: 'exec-demo',
  name: 'Executive Overview',
  description:
    'High-level overview focused on business value, ROI metrics, and governance. Perfect for C-suite and VP-level audiences.',
  duration: '3 min',
  persona: 'exec',

  config: {
    activeSpaceId: 'space-compliance-ops',
    activeProjectId: 'proj-audit-automation',

    activeCognates: [
      {
        id: 'cog-compliance-monitor',
        state: 'completed',
        progress: 100,
      },
      {
        id: 'cog-audit-collector',
        state: 'completed',
        progress: 100,
      },
      {
        id: 'cog-revenue-analyst',
        state: 'running',
        progress: 78,
      },
    ],

    policyBlockEnabled: false,
    runSucceeds: true,
    budgetWarning: false,
    approvalPending: false,

    c2s2Enabled: false,
    advancedPromptOps: false,
  },

  wowMoments: ['signals-roi', 'audit-trail', 'pattern-compilation'],

  demoSteps: [
    'Open Home dashboard - show AI budget status and active Cognates',
    'Navigate to Signals/Insights - highlight ROI metrics and time saved',
    'Show Ledger audit trail - demonstrate full traceability',
    'Open pattern compilation view - show efficiency gains over time',
    'End with governance overview - SOPs and autonomy levels',
  ],
};

/**
 * Track B - Operator Demo (5 min)
 *
 * Mid-level walkthrough focused on day-to-day operations.
 * Demonstrates the full run lifecycle, approval gates, and reasoning traces.
 */
const operatorDemo: DemoScenario = {
  id: 'operator-demo',
  name: 'Operator Walkthrough',
  description:
    'Day-to-day operational process demonstrating run lifecycle, governance gates, and reasoning traces. Ideal for ops managers and team leads.',
  duration: '5 min',
  persona: 'operator',

  config: {
    activeSpaceId: 'space-compliance-ops',
    activeProjectId: 'proj-policy-monitoring',

    activeCognates: [
      {
        id: 'cog-compliance-monitor',
        state: 'waiting_approval',
        progress: 65,
      },
      {
        id: 'cog-audit-collector',
        state: 'running',
        progress: 42,
      },
      {
        id: 'cog-threat-hunter',
        state: 'needs_review',
        progress: 100,
      },
    ],

    policyBlockEnabled: true,
    runSucceeds: true,
    budgetWarning: true,
    approvalPending: true,

    c2s2Enabled: false,
    advancedPromptOps: false,
  },

  wowMoments: [
    'explain-plan',
    'simulation-diff',
    'approval-gate',
    'trace-timeline',
  ],

  demoSteps: [
    'Start at Collab Inbox - show pending approvals queue',
    'Select awaiting approval Cognate - demonstrate explain plan feature',
    'Show simulation diff - before/after comparison',
    'Approve action through governance gate - walkthrough approval flow',
    'Navigate to Ledger - show reasoning trace timeline',
    'Demonstrate budget warning handling',
  ],
};

/**
 * Track C - Builder Demo (7 min)
 *
 * Deep technical dive covering Cognate creation, Narrative building,
 * knowledge management, and NEXIS integration.
 */
const builderDemo: DemoScenario = {
  id: 'builder-demo',
  name: 'Builder Deep Dive',
  description:
    'Technical deep dive covering Cognate creation, Narrative building, knowledge management, and advanced features. For technical architects and builders.',
  duration: '7 min',
  persona: 'builder',

  config: {
    activeSpaceId: 'space-revenue-ops',
    activeProjectId: 'proj-lead-scoring',

    activeCognates: [
      {
        id: 'cog-revenue-analyst',
        state: 'running',
        progress: 88,
      },
      {
        id: 'cog-customer-success',
        state: 'waiting_approval',
        progress: 45,
      },
      {
        id: 'cog-compliance-monitor',
        state: 'completed',
        progress: 100,
      },
      {
        id: 'cog-threat-hunter',
        state: 'idle',
      },
    ],

    policyBlockEnabled: true,
    runSucceeds: true,
    budgetWarning: false,
    approvalPending: true,

    c2s2Enabled: true,
    advancedPromptOps: true,
  },

  wowMoments: [
    'explain-plan',
    'simulation-diff',
    'pattern-compile',
    'nexis-automation',
    'symbios-command',
  ],

  demoSteps: [
    'Start in Studio - show Cognate roster and creation flow',
    'Open Cognate detail - demonstrate personality tuning and skill assignment',
    'Navigate to Narratives - build a simple automation flow',
    'Show LUX Builder - visual automation editing',
    'Demonstrate C2S2 routing - Cognate-to-Symbios-to-Cognate communication',
    'Open Knowledge Library - show RAG integration and knowledge graph',
    'Navigate to NEXIS - demonstrate contact intelligence',
    'End with pattern compilation - show how learnings accumulate',
  ],
};

// ============================================================================
// Industry-Specific Scenarios (with demo config)
// ============================================================================

/**
 * Healthcare Industry Scenario
 *
 * Patient intake, compliance, and HIPAA-focused demo.
 * Uses the MedAssist company persona.
 */
const healthcareDemo: DemoScenario = {
  id: 'healthcare',
  name: 'Healthcare: MedAssist',
  description:
    'Healthcare-focused demo featuring patient intake automation, HIPAA compliance, and care coordination. Shows MedAssist company persona.',
  duration: '5 min',
  persona: 'operator',

  config: {
    activeSpaceId: 'space-compliance-ops',
    activeProjectId: 'proj-policy-monitoring',

    activeCognates: [
      {
        id: 'cog-compliance-monitor',
        state: 'running',
        progress: 72,
      },
      {
        id: 'cog-audit-collector',
        state: 'completed',
        progress: 100,
      },
    ],

    policyBlockEnabled: true,
    runSucceeds: true,
    budgetWarning: false,
    approvalPending: true,

    c2s2Enabled: false,
    advancedPromptOps: false,
  },

  wowMoments: [
    'hipaa-compliance',
    'patient-triage',
    'audit-trail',
    'care-routing',
  ],

  demoSteps: [
    'Set context: MedAssist Healthcare - patient care coordination',
    'Show Compliance Monitor tracking HIPAA requirements',
    'Demonstrate patient intake Narrative with symptom assessment',
    'Walk through triage routing logic and care escalation',
    'Show audit trail for compliance documentation',
    'Highlight ROI: time saved, accuracy improved, patient satisfaction',
  ],
};

/**
 * Financial Industry Scenario
 *
 * KYC, fraud detection, and regulatory compliance demo.
 * Uses the WealthGuard company persona.
 */
const financialDemo: DemoScenario = {
  id: 'financial',
  name: 'Financial: WealthGuard',
  description:
    'Financial services demo featuring KYC automation, fraud detection, and regulatory compliance. Shows WealthGuard company persona.',
  duration: '5 min',
  persona: 'operator',

  config: {
    activeSpaceId: 'space-security-ops',
    activeProjectId: 'proj-threat-detection',

    activeCognates: [
      {
        id: 'cog-threat-hunter',
        state: 'running',
        progress: 56,
      },
      {
        id: 'cog-incident-responder',
        state: 'waiting_approval',
        progress: 89,
      },
      {
        id: 'cog-compliance-monitor',
        state: 'completed',
        progress: 100,
      },
    ],

    policyBlockEnabled: true,
    runSucceeds: true,
    budgetWarning: false,
    approvalPending: true,

    c2s2Enabled: false,
    advancedPromptOps: false,
  },

  wowMoments: [
    'kyc-verification',
    'fraud-detection',
    'transaction-monitoring',
    'compliance-reporting',
  ],

  demoSteps: [
    'Set context: WealthGuard Financial - wealth protection',
    'Show Threat Hunter analyzing transaction patterns',
    'Demonstrate KYC onboarding Narrative with identity verification',
    'Walk through fraud detection alerting and escalation',
    'Show real-time transaction monitoring dashboard',
    'Demonstrate compliance reporting and audit preparation',
    'Highlight ROI: fraud prevented, compliance rate, time saved',
  ],
};

// ============================================================================
// Exports
// ============================================================================

/**
 * All available demo scenarios
 */
export const demoScenarios: DemoScenario[] = [
  execDemo,
  operatorDemo,
  builderDemo,
  healthcareDemo,
  financialDemo,
];

/**
 * Retrieve a scenario by its ID
 */
export function getScenarioById(id: string): DemoScenario | undefined {
  return demoScenarios.find((scenario) => scenario.id === id);
}

/**
 * Get all scenarios for a specific persona
 */
export function getScenariosByPersona(persona: DemoPersona): DemoScenario[] {
  return demoScenarios.filter((scenario) => scenario.persona === persona);
}

/**
 * Apply a scenario configuration
 *
 * Returns the config object that can be used to initialize app state.
 * This is a pure function - actual state updates should be handled
 * by the consuming store/context.
 */
export function applyScenario(scenario: DemoScenario): DemoScenarioConfig {
  return { ...scenario.config };
}

/**
 * Get scenarios grouped by persona
 */
export function getScenariosByPersonaGrouped(): Record<
  DemoPersona,
  DemoScenario[]
> {
  return {
    exec: getScenariosByPersona('exec'),
    operator: getScenariosByPersona('operator'),
    builder: getScenariosByPersona('builder'),
  };
}

/**
 * Get scenarios sorted by duration (shortest first)
 */
export function getScenariosByDuration(): DemoScenario[] {
  return [...demoScenarios].sort((a, b) => {
    const durationA = parseInt(a.duration, 10);
    const durationB = parseInt(b.duration, 10);
    return durationA - durationB;
  });
}

/**
 * Get the default scenario for a persona
 */
export function getDefaultScenarioForPersona(
  persona: DemoPersona
): DemoScenario {
  const scenarios = getScenariosByPersona(persona);
  return scenarios[0] || execDemo;
}

export default demoScenarios;
