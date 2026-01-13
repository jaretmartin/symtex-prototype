/**
 * LUX Builder Page
 *
 * Visual workflow builder with Zustand state management,
 * undo/redo support, auto-save, and keyboard shortcuts.
 */

import { useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Undo2, Redo2, Save, ExternalLink, Circle } from 'lucide-react';
import LuxCanvas from '../../../components/lux/LuxCanvas';
import NodePalette from '../../../components/lux/NodePalette';
import NaturalLanguageBuilder from '../../../components/lux/NaturalLanguageBuilder';
import { useWorkflowStore } from '../../../store';
import { useToast } from '../../../store/useUIStore';
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

export default function LuxBuilderPage(): JSX.Element {
  // Store state
  const {
    nodes,
    edges,
    workflowName,
    isDirty,
    isSaving,
    setNodes,
    setEdges,
    setWorkflowName,
    undo,
    redo,
    canUndo,
    canRedo,
    markClean,
    setSaving,
    addNode,
  } = useWorkflowStore();

  const toast = useToast();

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
            handleSaveWorkflow();
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
    const workflow = {
      name: workflowName,
      nodes,
      edges,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem('lux-workflow-autosave', JSON.stringify(workflow));
    console.log('Auto-saved workflow');
  }, [workflowName, nodes, edges]);

  const handleSaveWorkflow = useCallback(() => {
    setSaving(true);

    const workflow = {
      name: workflowName,
      nodes,
      edges,
      savedAt: new Date().toISOString(),
    };

    // Simulate API call
    setTimeout(() => {
      localStorage.setItem(`lux-workflow-${Date.now()}`, JSON.stringify(workflow));
      markClean();
      setSaving(false);
      toast.success('Workflow saved', 'Your workflow has been saved successfully.');
    }, 500);
  }, [workflowName, nodes, edges, markClean, setSaving, toast]);

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
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              style={{
                background: 'transparent',
                border: '1px solid #2a2a3e',
                borderRadius: '6px',
                padding: '6px 12px',
                color: '#fff',
                fontSize: '14px',
              }}
              aria-label="Workflow name"
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
            onClick={handleSaveWorkflow}
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

          <Link
            to="/studio/automations"
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
            Automations
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
