/**
 * LUX Builder Page
 *
 * Visual workflow builder with Zustand state management,
 * undo/redo support, auto-save, and keyboard shortcuts.
 *
 * WF2 Integration: Plan -> Simulate -> Run -> Review -> Compile
 */

import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Undo2, Redo2, Save, ExternalLink, Circle, Play, FlaskConical, FileText } from 'lucide-react';
import LuxCanvas from '../../../components/lux/LuxCanvas';
import NodePalette from '../../../components/lux/NodePalette';
import NaturalLanguageBuilder from '../../../components/lux/NaturalLanguageBuilder';
import { useAutomationStore } from '../../../store';
import { useToast } from '../../../store/useUIStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ExplainPlan, type ExecutionPlan } from '@/components/runs/ExplainPlan';
import { SimulationPanel, type SimulationResult } from '@/components/runs/SimulationPanel';
import { RunReview, type RunResult } from '@/components/runs/RunReview';
import type { Node, Edge } from 'reactflow';

// Default nodes for new workflows
const defaultNodes: Node[] = [
  {
    id: 'trigger-1',
    type: 'trigger',
    position: { x: 250, y: 50 },
    data: {
      label: 'New Lead Received',
      description: 'Triggers when a new lead is added',
      icon: 'zap'
    },
  },
  {
    id: 'condition-1',
    type: 'condition',
    position: { x: 250, y: 180 },
    data: {
      label: 'Check Lead Score',
      description: 'If lead score > 80',
      icon: 'git-branch'
    },
  },
  {
    id: 'action-1',
    type: 'action',
    position: { x: 100, y: 320 },
    data: {
      label: 'Send Welcome Email',
      description: 'Personalized welcome message',
      icon: 'mail'
    },
  },
  {
    id: 'action-2',
    type: 'action',
    position: { x: 400, y: 320 },
    data: {
      label: 'Assign to Sales Rep',
      description: 'Route to available rep',
      icon: 'user'
    },
  },
];

const defaultEdges: Edge[] = [
  {
    id: 'e-trigger-condition',
    source: 'trigger-1',
    target: 'condition-1',
    animated: true,
    style: { stroke: '#6366f1' },
  },
  {
    id: 'e-condition-action1',
    source: 'condition-1',
    target: 'action-1',
    sourceHandle: 'false',
    label: 'No',
    style: { stroke: '#ef4444' },
  },
  {
    id: 'e-condition-action2',
    source: 'condition-1',
    target: 'action-2',
    sourceHandle: 'true',
    label: 'Yes',
    style: { stroke: '#22c55e' },
  },
];

// Types for WF2 workflow
type WF2Step = 'builder' | 'plan' | 'simulate' | 'running' | 'review';

// Mock data generators for WF2
function createMockExecutionPlan(name: string, nodeCount: number): ExecutionPlan {
  return {
    automationId: `auto-${Date.now()}`,
    automationName: name,
    systems: [
      {
        id: 'sys-1',
        name: 'Salesforce CRM',
        type: 'crm',
        action: 'read',
        description: 'Read contact and lead data',
      },
      {
        id: 'sys-2',
        name: 'Email Service',
        type: 'email',
        action: 'execute',
        description: 'Send automated emails',
      },
      {
        id: 'sys-3',
        name: 'Analytics Database',
        type: 'database',
        action: 'write',
        description: 'Log execution metrics',
      },
    ],
    permissions: [
      { id: 'perm-1', scope: 'salesforce', level: 'read', granted: true },
      { id: 'perm-2', scope: 'email', level: 'write', granted: true },
      { id: 'perm-3', scope: 'analytics', level: 'write', granted: true },
    ],
    cost: {
      apiCalls: nodeCount * 3,
      estimatedCost: nodeCount * 0.012,
      budgetCap: 50,
      budgetRemaining: 42.35,
      withinBudget: true,
    },
    estimatedDuration: nodeCount * 2,
    riskLevel: nodeCount > 5 ? 'medium' : 'low',
  };
}

function createMockSimulationResult(automationId: string): SimulationResult {
  return {
    automationId,
    status: 'success',
    steps: [
      {
        id: 'step-1',
        name: 'Initialize Automation',
        status: 'success',
        duration: 45,
        message: 'Automation context initialized',
      },
      {
        id: 'step-2',
        name: 'Fetch Input Data',
        status: 'success',
        duration: 245,
        input: { source: 'trigger' },
        output: { records: 12 },
        message: 'Successfully retrieved input data',
      },
      {
        id: 'step-3',
        name: 'Process Conditions',
        status: 'success',
        duration: 32,
        input: { records: 12 },
        output: { matched: 8, filtered: 4 },
        message: 'Conditions evaluated',
      },
      {
        id: 'step-4',
        name: 'Execute Actions',
        status: 'success',
        duration: 412,
        input: { records: 8 },
        output: { processed: 8 },
        message: 'All actions completed',
      },
    ],
    warnings: [
      {
        id: 'warn-1',
        severity: 'info',
        message: 'Simulation completed successfully. Ready to run for real.',
      },
    ],
    totalDuration: 734,
    completedAt: new Date(),
  };
}

function createMockRunResult(automationId: string, name: string): RunResult {
  const now = new Date();
  const startedAt = new Date(now.getTime() - 3200);
  return {
    runId: `run-${Date.now()}`,
    automationId,
    automationName: name,
    status: 'success',
    startedAt,
    completedAt: now,
    steps: [
      {
        id: 'step-1',
        name: 'Initialize',
        status: 'success',
        startedAt,
        completedAt: new Date(startedAt.getTime() + 50),
      },
      {
        id: 'step-2',
        name: 'Fetch Data',
        status: 'success',
        startedAt: new Date(startedAt.getTime() + 50),
        completedAt: new Date(startedAt.getTime() + 320),
        input: { query: 'active leads' },
        output: { count: 15 },
        cognateId: 'cog-1',
        cognateName: 'Data Fetcher',
      },
      {
        id: 'step-3',
        name: 'Process',
        status: 'success',
        startedAt: new Date(startedAt.getTime() + 320),
        completedAt: new Date(startedAt.getTime() + 850),
        input: { records: 15 },
        output: { processed: 15 },
      },
      {
        id: 'step-4',
        name: 'Complete',
        status: 'success',
        startedAt: new Date(startedAt.getTime() + 850),
        completedAt: now,
        output: { success: true },
      },
    ],
    totalCost: 0.048,
    outputSummary: 'Automation completed successfully. 15 records processed.',
    canCompilePattern: true,
    patternSuggestion: 'This automation can be compiled to S1 for 60% cost reduction.',
  };
}

export default function LuxBuilderPage(): JSX.Element {
  // Store state
  const {
    nodes,
    edges,
    automationName,
    isDirty,
    isSaving,
    setNodes,
    setEdges,
    setAutomationName,
    undo,
    redo,
    canUndo,
    canRedo,
    markClean,
    setSaving,
    addNode,
  } = useAutomationStore();

  const toast = useToast();

  // WF2 workflow state
  const [currentStep, setCurrentStep] = useState<WF2Step>('builder');
  const [executionPlan, setExecutionPlan] = useState<ExecutionPlan | null>(null);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);

  // Initialize with default nodes if empty
  useEffect(() => {
    if (nodes.length === 0) {
      setNodes(defaultNodes);
      setEdges(defaultEdges);
      markClean(); // Don't mark as dirty on initial load
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Cmd/Ctrl key
      if (e.metaKey || e.ctrlKey) {
        switch (e.key.toLowerCase()) {
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              // Cmd+Shift+Z = Redo
              if (canRedo()) redo();
            } else {
              // Cmd+Z = Undo
              if (canUndo()) undo();
            }
            break;
          case 's':
            e.preventDefault();
            handleSaveAutomation();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canUndo, canRedo, undo, redo]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-save every 30 seconds when dirty
  useEffect(() => {
    if (!isDirty) return;

    const autoSaveTimer = setInterval(() => {
      handleAutoSave();
    }, 30000);

    return () => clearInterval(autoSaveTimer);
  }, [isDirty]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleNodesChange = useCallback((newNodes: Node[]) => {
    setNodes(newNodes);
  }, [setNodes]);

  const handleEdgesChange = useCallback((newEdges: Edge[]) => {
    setEdges(newEdges);
  }, [setEdges]);

  const handleAddNode = useCallback((nodeType: string, position: { x: number; y: number }) => {
    const newNode: Node = {
      id: `${nodeType}-${Date.now()}`,
      type: nodeType,
      position,
      data: {
        label: getDefaultLabel(nodeType),
        description: getDefaultDescription(nodeType),
        icon: getDefaultIcon(nodeType),
      },
    };
    addNode(newNode);
  }, [addNode]);

  const handleAutoSave = useCallback(() => {
    const automation = {
      name: automationName,
      nodes,
      edges,
      savedAt: new Date().toISOString(),
    };
    // Migration: Changed from 'lux-workflow-autosave' to 'lux-automation-autosave' (Wave G)
    localStorage.setItem('lux-automation-autosave', JSON.stringify(automation));
    // Auto-saved automation
  }, [automationName, nodes, edges]);

  const handleSaveAutomation = useCallback(() => {
    setSaving(true);

    const automation = {
      name: automationName,
      nodes,
      edges,
      savedAt: new Date().toISOString(),
    };

    // Simulate API call
    setTimeout(() => {
      // Migration: Changed from 'lux-workflow-*' to 'lux-automation-*' (Wave G)
      localStorage.setItem(`lux-automation-${Date.now()}`, JSON.stringify(automation));
      markClean();
      setSaving(false);
      toast.success('Automation saved', 'Your Automation has been saved successfully.');
    }, 500);
  }, [automationName, nodes, edges, markClean, setSaving, toast]);

  // WF2 Workflow Handlers
  const handleExplainPlan = useCallback((): void => {
    if (nodes.length === 0) {
      toast.error('No nodes', 'Add some nodes to the automation before running.');
      return;
    }
    setExecutionPlan(createMockExecutionPlan(automationName, nodes.length));
    setCurrentStep('plan');
  }, [nodes, automationName, toast]);

  const handleSimulate = useCallback((): void => {
    setIsSimulating(true);
    setTimeout(() => {
      setSimulationResult(createMockSimulationResult(`auto-${Date.now()}`));
      setIsSimulating(false);
      setCurrentStep('simulate');
    }, 1500);
  }, []);

  const handleRun = useCallback((): void => {
    setIsRunning(true);
    setCurrentStep('running');
    setTimeout(() => {
      setRunResult(createMockRunResult(`auto-${Date.now()}`, automationName));
      setIsRunning(false);
      setCurrentStep('review');
    }, 2500);
  }, [automationName]);

  const handleCompilePattern = useCallback((): void => {
    setIsCompiling(true);
    setTimeout(() => {
      setIsCompiling(false);
      toast.success('Pattern Compiled', 'Your automation has been compiled to S1 for faster execution.');
      setCurrentStep('builder');
      setExecutionPlan(null);
      setSimulationResult(null);
      setRunResult(null);
    }, 2000);
  }, [toast]);

  const handleCancelWF2 = useCallback((): void => {
    setCurrentStep('builder');
    setExecutionPlan(null);
    setSimulationResult(null);
    setRunResult(null);
  }, []);

  return (
    <div className="lux-builder-page" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: '#0a0a0f',
      color: '#fff'
    }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 24px',
        borderBottom: '1px solid #1e1e2e',
        backgroundColor: '#0f0f1a',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <h1 style={{
            fontSize: '20px',
            fontWeight: 600,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            LUX Builder
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="text"
              value={automationName}
              onChange={(e) => setAutomationName(e.target.value)}
              style={{
                background: 'transparent',
                border: '1px solid #2a2a3e',
                borderRadius: '6px',
                padding: '6px 12px',
                color: '#fff',
                fontSize: '14px',
              }}
              aria-label="Automation name"
            />
            {isDirty && (
              <span
                title="Unsaved changes"
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <Circle
                  className="w-2 h-2 fill-amber-500 text-amber-500"
                  aria-label="Unsaved changes"
                />
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Undo/Redo */}
          <button
            onClick={undo}
            disabled={!canUndo()}
            style={{
              padding: '8px',
              borderRadius: '6px',
              border: '1px solid #2a2a3e',
              background: 'transparent',
              color: canUndo() ? '#fff' : '#4b5563',
              cursor: canUndo() ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Undo (Cmd+Z)"
            aria-label="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo()}
            style={{
              padding: '8px',
              borderRadius: '6px',
              border: '1px solid #2a2a3e',
              background: 'transparent',
              color: canRedo() ? '#fff' : '#4b5563',
              cursor: canRedo() ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Redo (Cmd+Shift+Z)"
            aria-label="Redo"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          <div style={{ width: '1px', height: '24px', backgroundColor: '#2a2a3e', margin: '0 4px' }} />

          {/* Save */}
          <button
            onClick={handleSaveAutomation}
            disabled={isSaving}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              background: isDirty
                ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                : '#2a2a3e',
              color: '#fff',
              cursor: isSaving ? 'wait' : 'pointer',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              opacity: isSaving ? 0.7 : 1,
            }}
            title="Save (Cmd+S)"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save'}
          </button>

          <div style={{ width: '1px', height: '24px', backgroundColor: '#2a2a3e', margin: '0 4px' }} />

          {/* WF2: Explain Plan */}
          <button
            onClick={handleExplainPlan}
            disabled={nodes.length === 0}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #2a2a3e',
              background: 'transparent',
              color: nodes.length > 0 ? '#fff' : '#4b5563',
              cursor: nodes.length > 0 ? 'pointer' : 'not-allowed',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            title="View execution plan"
          >
            <FileText className="w-4 h-4" />
            Explain Plan
          </button>

          {/* WF2: Simulate */}
          <button
            onClick={() => {
              handleExplainPlan();
              setTimeout(() => handleSimulate(), 100);
            }}
            disabled={nodes.length === 0}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #a855f7',
              background: 'rgba(168, 85, 247, 0.1)',
              color: nodes.length > 0 ? '#a855f7' : '#4b5563',
              cursor: nodes.length > 0 ? 'pointer' : 'not-allowed',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            title="Simulate automation"
          >
            <FlaskConical className="w-4 h-4" />
            Simulate
          </button>

          {/* WF2: Run */}
          <button
            onClick={() => {
              handleExplainPlan();
            }}
            disabled={nodes.length === 0}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              background: nodes.length > 0
                ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                : '#2a2a3e',
              color: '#fff',
              cursor: nodes.length > 0 ? 'pointer' : 'not-allowed',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            title="Run automation"
          >
            <Play className="w-4 h-4" />
            Run
          </button>

          <div style={{ width: '1px', height: '24px', backgroundColor: '#2a2a3e', margin: '0 4px' }} />

          <Link
            to="/runs"
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #2a2a3e',
              background: 'transparent',
              color: '#fff',
              textDecoration: 'none',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <ExternalLink className="w-4 h-4" />
            Runs
          </Link>
        </div>
      </header>

      {/* Natural Language Builder */}
      <NaturalLanguageBuilder />

      {/* Main Content */}
      <div style={{
        display: 'flex',
        flex: 1,
        overflow: 'hidden',
      }}>
        {/* Sidebar - Node Palette */}
        <NodePalette onAddNode={handleAddNode} />

        {/* Canvas */}
        <div style={{ flex: 1, position: 'relative' }}>
          <LuxCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={handleNodesChange}
            onEdgesChange={handleEdgesChange}
            onAddNode={handleAddNode}
          />
        </div>
      </div>

      {/* WF2 Dialogs */}

      {/* Plan Dialog */}
      <Dialog open={currentStep === 'plan'} onOpenChange={() => handleCancelWF2()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Execution Plan</DialogTitle>
          </DialogHeader>
          {executionPlan && (
            <ExplainPlan
              plan={executionPlan}
              onSimulate={handleSimulate}
              onRun={handleRun}
              onCancel={handleCancelWF2}
              isSimulating={isSimulating}
              isRunning={isRunning}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Simulate Dialog */}
      <Dialog open={currentStep === 'simulate'} onOpenChange={() => handleCancelWF2()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Simulation Results</DialogTitle>
          </DialogHeader>
          {simulationResult && (
            <SimulationPanel
              result={simulationResult}
              onRunForReal={handleRun}
              onReSimulate={handleSimulate}
              onCancel={handleCancelWF2}
              isRunning={isRunning}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Running Dialog */}
      <Dialog open={currentStep === 'running'} onOpenChange={() => {}}>
        <DialogContent className="max-w-md">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 rounded-full border-4 border-symtex-primary border-t-transparent animate-spin mb-6" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Running Automation
            </h3>
            <p className="text-muted-foreground text-center">
              {automationName}
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Please wait while the automation executes...
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={currentStep === 'review'} onOpenChange={() => handleCancelWF2()}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Run Complete</DialogTitle>
          </DialogHeader>
          {runResult && (
            <RunReview
              result={runResult}
              onCompilePattern={handleCompilePattern}
              onRunAgain={() => {
                handleCancelWF2();
                setTimeout(() => handleExplainPlan(), 100);
              }}
              onClose={handleCancelWF2}
              isCompiling={isCompiling}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function getDefaultLabel(nodeType: string): string {
  const labels: Record<string, string> = {
    trigger: 'New Trigger',
    condition: 'New Condition',
    action: 'New Action',
    delay: 'Wait',
    loop: 'Loop',
    webhook: 'Webhook',
  };
  return labels[nodeType] || 'New Node';
}

function getDefaultDescription(nodeType: string): string {
  const descriptions: Record<string, string> = {
    trigger: 'Configure trigger event',
    condition: 'Set condition logic',
    action: 'Define action to perform',
    delay: 'Add time delay',
    loop: 'Iterate over items',
    webhook: 'HTTP webhook endpoint',
  };
  return descriptions[nodeType] || 'Configure this node';
}

function getDefaultIcon(nodeType: string): string {
  const icons: Record<string, string> = {
    trigger: 'zap',
    condition: 'git-branch',
    action: 'play',
    delay: 'clock',
    loop: 'repeat',
    webhook: 'link',
  };
  return icons[nodeType] || 'circle';
}
