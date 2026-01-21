/**
 * C2S2 Store - Zustand state management for Code-to-S1 transformations
 *
 * Manages C2S2 projects, transformations, and UI state.
 * C2S2 transforms traditional code into S1/Symtex Script - a more
 * deterministic, auditable format for AI operations.
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Source language types supported for transformation
export type SourceLanguage = 'javascript' | 'python' | 'typescript';

// Project status lifecycle
export type ProjectStatus = 'draft' | 'in_progress' | 'completed' | 'failed';

// Transformation status
export type TransformationStatus = 'pending' | 'processing' | 'completed' | 'failed';

// C2S2 Project interface
export interface C2S2Project {
  id: string;
  name: string;
  description: string;
  sourceLanguage: SourceLanguage;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  transformationCount: number;
  successRate: number;
}

// C2S2 Transformation interface
export interface C2S2Transformation {
  id: string;
  projectId: string;
  inputCode: string;
  outputS1: string;
  status: TransformationStatus;
  confidence: number;
  warnings: string[];
  createdAt: string;
  completedAt?: string;
}

// Stats summary for dashboard
export interface C2S2Stats {
  totalProjects: number;
  totalTransformations: number;
  overallSuccessRate: number;
  timeSavedHours: number;
}

interface C2S2State {
  // Current transformation project
  currentProject: C2S2Project | null;
  projects: C2S2Project[];

  // Transformation state
  transformations: C2S2Transformation[];
  activeTransformationId: string | null;

  // UI state
  isTransforming: boolean;
  progress: number;

  // Demo scenarios
  activeScenario: string | null;

  // Actions
  setCurrentProject: (project: C2S2Project | null) => void;
  addProject: (project: Omit<C2S2Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (id: string, updates: Partial<C2S2Project>) => void;
  deleteProject: (id: string) => void;

  addTransformation: (transformation: Omit<C2S2Transformation, 'id' | 'createdAt'>) => void;
  updateTransformation: (id: string, updates: Partial<C2S2Transformation>) => void;
  setActiveTransformation: (id: string | null) => void;

  setIsTransforming: (isTransforming: boolean) => void;
  setProgress: (progress: number) => void;
  setActiveScenario: (scenario: string | null) => void;

  // Simulated transformation (demo mode)
  simulateTransformation: (projectId: string, code: string) => Promise<void>;

  // Computed/getters
  getStats: () => C2S2Stats;
  getProjectTransformations: (projectId: string) => C2S2Transformation[];
  getRecentTransformations: (limit?: number) => C2S2Transformation[];
}

// Generate unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Mock projects for demo
const mockProjects: C2S2Project[] = [
  {
    id: 'proj-001',
    name: 'Customer Support Automation',
    description: 'Transform customer support routing logic from JavaScript to S1 for better auditability and deterministic behavior.',
    sourceLanguage: 'javascript',
    status: 'completed',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-18T14:45:00Z',
    transformationCount: 12,
    successRate: 92,
  },
  {
    id: 'proj-002',
    name: 'Compliance Check Pipeline',
    description: 'Convert Python compliance checking scripts to S1 for regulatory transparency and version control.',
    sourceLanguage: 'python',
    status: 'in_progress',
    createdAt: '2024-01-20T09:00:00Z',
    updatedAt: '2024-01-21T11:20:00Z',
    transformationCount: 8,
    successRate: 88,
  },
];

// Mock transformations for demo
const mockTransformations: C2S2Transformation[] = [
  {
    id: 'trans-001',
    projectId: 'proj-001',
    inputCode: `function routeTicket(ticket) {
  if (ticket.priority === 'high') {
    return assignToSenior(ticket);
  }
  return assignToQueue(ticket);
}`,
    outputS1: `@narrative "Ticket Routing"
@cognate "SupportRouter"

WHEN ticket.received
  IF ticket.priority == "high"
    ROUTE TO senior_queue
    LOG "High priority ticket routed"
  ELSE
    ROUTE TO general_queue
END`,
    status: 'completed',
    confidence: 94,
    warnings: [],
    createdAt: '2024-01-18T14:30:00Z',
    completedAt: '2024-01-18T14:32:00Z',
  },
  {
    id: 'trans-002',
    projectId: 'proj-001',
    inputCode: `async function escalateTicket(ticketId, reason) {
  const ticket = await getTicket(ticketId);
  ticket.status = 'escalated';
  ticket.escalationReason = reason;
  await notifyManager(ticket);
  return ticket;
}`,
    outputS1: `@narrative "Ticket Escalation"
@cognate "SupportEscalator"

WHEN escalation.requested WITH ticketId, reason
  FETCH ticket FROM tickets WHERE id == ticketId
  SET ticket.status = "escalated"
  SET ticket.escalationReason = reason
  NOTIFY manager WITH ticket
  RETURN ticket
END`,
    status: 'completed',
    confidence: 89,
    warnings: ['Consider adding error handling for missing ticket'],
    createdAt: '2024-01-18T15:00:00Z',
    completedAt: '2024-01-18T15:03:00Z',
  },
  {
    id: 'trans-003',
    projectId: 'proj-002',
    inputCode: `def check_compliance(document, rules):
    violations = []
    for rule in rules:
        if not rule.validate(document):
            violations.append(rule.id)
    return {'compliant': len(violations) == 0, 'violations': violations}`,
    outputS1: `@narrative "Compliance Validation"
@cognate "ComplianceChecker"

WHEN document.submitted WITH rules
  INIT violations = []
  FOR EACH rule IN rules
    IF NOT rule.validates(document)
      ADD rule.id TO violations
  RETURN {
    compliant: violations.length == 0,
    violations: violations
  }
END`,
    status: 'completed',
    confidence: 91,
    warnings: [],
    createdAt: '2024-01-21T10:15:00Z',
    completedAt: '2024-01-21T10:18:00Z',
  },
  {
    id: 'trans-004',
    projectId: 'proj-002',
    inputCode: `def generate_report(results, format='pdf'):
    if format == 'pdf':
        return PDFReport(results).render()
    elif format == 'csv':
        return CSVReport(results).export()`,
    outputS1: `@narrative "Report Generation"
@cognate "ReportGenerator"

WHEN report.requested WITH results, format = "pdf"
  IF format == "pdf"
    GENERATE PDFReport FROM results
    RETURN rendered
  ELIF format == "csv"
    GENERATE CSVReport FROM results
    RETURN exported
END`,
    status: 'processing',
    confidence: 0,
    warnings: [],
    createdAt: '2024-01-21T11:00:00Z',
  },
];

// Sample S1 output templates for simulation
const sampleS1Templates = [
  `@narrative "Generated Narrative"
@cognate "AutoCognate"

WHEN trigger.received
  VALIDATE input
  PROCESS data
  RETURN result
END`,
  `@narrative "Data Processing"
@cognate "DataProcessor"

WHEN data.incoming WITH payload
  TRANSFORM payload
  STORE IN database
  NOTIFY subscribers
END`,
];

export const useC2S2Store = create<C2S2State>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        currentProject: null,
        projects: mockProjects,
        transformations: mockTransformations,
        activeTransformationId: null,
        isTransforming: false,
        progress: 0,
        activeScenario: null,

        // Project actions
        setCurrentProject: (project) => set({ currentProject: project }),

        addProject: (projectData) => {
          const now = new Date().toISOString();
          const newProject: C2S2Project = {
            ...projectData,
            id: generateId(),
            createdAt: now,
            updatedAt: now,
            transformationCount: 0,
            successRate: 0,
          };
          set((state) => ({
            projects: [newProject, ...state.projects],
            currentProject: newProject,
          }));
        },

        updateProject: (id, updates) =>
          set((state) => ({
            projects: state.projects.map((p) =>
              p.id === id
                ? { ...p, ...updates, updatedAt: new Date().toISOString() }
                : p
            ),
            currentProject:
              state.currentProject?.id === id
                ? { ...state.currentProject, ...updates, updatedAt: new Date().toISOString() }
                : state.currentProject,
          })),

        deleteProject: (id) =>
          set((state) => ({
            projects: state.projects.filter((p) => p.id !== id),
            transformations: state.transformations.filter((t) => t.projectId !== id),
            currentProject: state.currentProject?.id === id ? null : state.currentProject,
          })),

        // Transformation actions
        addTransformation: (transformationData) => {
          const newTransformation: C2S2Transformation = {
            ...transformationData,
            id: generateId(),
            createdAt: new Date().toISOString(),
          };
          set((state) => ({
            transformations: [newTransformation, ...state.transformations],
          }));
        },

        updateTransformation: (id, updates) =>
          set((state) => ({
            transformations: state.transformations.map((t) =>
              t.id === id ? { ...t, ...updates } : t
            ),
          })),

        setActiveTransformation: (id) => set({ activeTransformationId: id }),

        // UI actions
        setIsTransforming: (isTransforming) => set({ isTransforming }),
        setProgress: (progress) => set({ progress }),
        setActiveScenario: (scenario) => set({ activeScenario: scenario }),

        // Simulated transformation for demo mode
        simulateTransformation: async (projectId, code) => {
          set({ isTransforming: true, progress: 0 });

          // Create pending transformation
          const transformId = generateId();
          const newTransformation: C2S2Transformation = {
            id: transformId,
            projectId,
            inputCode: code,
            outputS1: '',
            status: 'processing',
            confidence: 0,
            warnings: [],
            createdAt: new Date().toISOString(),
          };

          set((state) => ({
            transformations: [newTransformation, ...state.transformations],
            activeTransformationId: transformId,
          }));

          // Simulate progress
          for (let i = 0; i <= 100; i += 10) {
            await new Promise((resolve) => setTimeout(resolve, 200));
            set({ progress: i });
          }

          // Complete transformation with mock S1 output
          const randomTemplate = sampleS1Templates[Math.floor(Math.random() * sampleS1Templates.length)];
          const confidence = Math.floor(Math.random() * 15) + 85; // 85-99
          const hasWarning = Math.random() > 0.7;

          set((state) => ({
            transformations: state.transformations.map((t) =>
              t.id === transformId
                ? {
                    ...t,
                    outputS1: randomTemplate,
                    status: 'completed' as TransformationStatus,
                    confidence,
                    warnings: hasWarning ? ['Consider adding input validation'] : [],
                    completedAt: new Date().toISOString(),
                  }
                : t
            ),
            isTransforming: false,
            progress: 100,
          }));

          // Update project stats
          const { transformations } = get();
          const projectTransforms = transformations.filter((t) => t.projectId === projectId);
          const completedTransforms = projectTransforms.filter((t) => t.status === 'completed');
          const successRate = Math.round(
            (completedTransforms.length / projectTransforms.length) * 100
          );

          set((state) => ({
            projects: state.projects.map((p) =>
              p.id === projectId
                ? {
                    ...p,
                    transformationCount: projectTransforms.length,
                    successRate,
                    updatedAt: new Date().toISOString(),
                  }
                : p
            ),
          }));
        },

        // Computed/getters
        getStats: () => {
          const { projects, transformations } = get();
          const completedTransforms = transformations.filter((t) => t.status === 'completed');
          const successRate =
            transformations.length > 0
              ? Math.round((completedTransforms.length / transformations.length) * 100)
              : 0;

          return {
            totalProjects: projects.length,
            totalTransformations: transformations.length,
            overallSuccessRate: successRate,
            timeSavedHours: Math.round(completedTransforms.length * 0.5), // Estimate 30 min saved per transformation
          };
        },

        getProjectTransformations: (projectId) => {
          const { transformations } = get();
          return transformations.filter((t) => t.projectId === projectId);
        },

        getRecentTransformations: (limit = 5) => {
          const { transformations } = get();
          return transformations.slice(0, limit);
        },
      }),
      {
        name: 'symtex-c2s2',
        partialize: (state) => ({
          projects: state.projects,
          transformations: state.transformations,
          currentProject: state.currentProject,
        }),
      }
    ),
    { name: 'C2S2Store' }
  )
);
