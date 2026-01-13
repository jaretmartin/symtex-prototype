/**
 * Workflow Store - Zustand state management for LUX Builder
 *
 * Handles workflow nodes, edges, undo/redo history, and persistence
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Node, Edge } from 'reactflow';
import type { Workflow, HistorySnapshot } from '@/types';

interface WorkflowState {
  // Workflow data
  nodes: Node[];
  edges: Edge[];
  workflowName: string;
  workflowId: string | null;
  workflowStatus: 'draft' | 'published' | 'archived';

  // State flags
  isDirty: boolean;
  isExecuting: boolean;
  isSaving: boolean;

  // History for undo/redo
  undoStack: HistorySnapshot[];
  redoStack: HistorySnapshot[];

  // Actions - Node/Edge management
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (node: Node) => void;
  removeNode: (nodeId: string) => void;
  updateNodeData: (nodeId: string, data: Record<string, unknown>) => void;
  addEdge: (edge: Edge) => void;
  removeEdge: (edgeId: string) => void;

  // Actions - Workflow metadata
  setWorkflowName: (name: string) => void;
  setWorkflowId: (id: string | null) => void;

  // Actions - History
  saveSnapshot: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  clearHistory: () => void;

  // Actions - Persistence
  loadWorkflow: (workflow: Workflow) => void;
  reset: () => void;
  markClean: () => void;
  markDirty: () => void;

  // Actions - Execution
  setExecuting: (isExecuting: boolean) => void;
  setSaving: (isSaving: boolean) => void;
}

const MAX_HISTORY_SIZE = 50;

export const useWorkflowStore = create<WorkflowState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        nodes: [],
        edges: [],
        workflowName: 'Untitled Workflow',
        workflowId: null,
        workflowStatus: 'draft',
        isDirty: false,
        isExecuting: false,
        isSaving: false,
        undoStack: [],
        redoStack: [],

        // Node/Edge management
        setNodes: (nodes) => {
          const state = get();
          if (JSON.stringify(state.nodes) !== JSON.stringify(nodes)) {
            state.saveSnapshot();
            set({ nodes, isDirty: true, redoStack: [] });
          }
        },

        setEdges: (edges) => {
          const state = get();
          if (JSON.stringify(state.edges) !== JSON.stringify(edges)) {
            state.saveSnapshot();
            set({ edges, isDirty: true, redoStack: [] });
          }
        },

        addNode: (node) => {
          const state = get();
          state.saveSnapshot();
          set({
            nodes: [...state.nodes, node],
            isDirty: true,
            redoStack: [],
          });
        },

        removeNode: (nodeId) => {
          const state = get();
          state.saveSnapshot();
          set({
            nodes: state.nodes.filter((n) => n.id !== nodeId),
            edges: state.edges.filter(
              (e) => e.source !== nodeId && e.target !== nodeId
            ),
            isDirty: true,
            redoStack: [],
          });
        },

        updateNodeData: (nodeId, data) => {
          const state = get();
          state.saveSnapshot();
          set({
            nodes: state.nodes.map((node) =>
              node.id === nodeId
                ? { ...node, data: { ...node.data, ...data } }
                : node
            ),
            isDirty: true,
            redoStack: [],
          });
        },

        addEdge: (edge) => {
          const state = get();
          state.saveSnapshot();
          set({
            edges: [...state.edges, edge],
            isDirty: true,
            redoStack: [],
          });
        },

        removeEdge: (edgeId) => {
          const state = get();
          state.saveSnapshot();
          set({
            edges: state.edges.filter((e) => e.id !== edgeId),
            isDirty: true,
            redoStack: [],
          });
        },

        // Workflow metadata
        setWorkflowName: (workflowName) => {
          set({ workflowName, isDirty: true });
        },

        setWorkflowId: (workflowId) => {
          set({ workflowId });
        },

        // History management
        saveSnapshot: () => {
          const { nodes, edges, undoStack } = get();
          const snapshot: HistorySnapshot = {
            nodes: JSON.parse(JSON.stringify(nodes)),
            edges: JSON.parse(JSON.stringify(edges)),
            timestamp: Date.now(),
          };
          set({
            undoStack: [...undoStack.slice(-(MAX_HISTORY_SIZE - 1)), snapshot],
          });
        },

        undo: () => {
          const { undoStack, nodes, edges, redoStack } = get();
          if (undoStack.length === 0) return;

          const previous = undoStack[undoStack.length - 1];
          const currentSnapshot: HistorySnapshot = {
            nodes: JSON.parse(JSON.stringify(nodes)),
            edges: JSON.parse(JSON.stringify(edges)),
            timestamp: Date.now(),
          };

          set({
            nodes: previous.nodes,
            edges: previous.edges,
            undoStack: undoStack.slice(0, -1),
            redoStack: [...redoStack, currentSnapshot],
            isDirty: true,
          });
        },

        redo: () => {
          const { redoStack, nodes, edges, undoStack } = get();
          if (redoStack.length === 0) return;

          const next = redoStack[redoStack.length - 1];
          const currentSnapshot: HistorySnapshot = {
            nodes: JSON.parse(JSON.stringify(nodes)),
            edges: JSON.parse(JSON.stringify(edges)),
            timestamp: Date.now(),
          };

          set({
            nodes: next.nodes,
            edges: next.edges,
            redoStack: redoStack.slice(0, -1),
            undoStack: [...undoStack, currentSnapshot],
            isDirty: true,
          });
        },

        canUndo: () => get().undoStack.length > 0,
        canRedo: () => get().redoStack.length > 0,

        clearHistory: () => {
          set({ undoStack: [], redoStack: [] });
        },

        // Persistence
        loadWorkflow: (workflow) => {
          set({
            nodes: workflow.nodes,
            edges: workflow.edges,
            workflowName: workflow.name,
            workflowId: workflow.id,
            workflowStatus: workflow.status,
            isDirty: false,
            undoStack: [],
            redoStack: [],
          });
        },

        reset: () => {
          set({
            nodes: [],
            edges: [],
            workflowName: 'Untitled Workflow',
            workflowId: null,
            workflowStatus: 'draft',
            isDirty: false,
            isExecuting: false,
            isSaving: false,
            undoStack: [],
            redoStack: [],
          });
        },

        markClean: () => {
          set({ isDirty: false });
        },

        markDirty: () => {
          set({ isDirty: true });
        },

        // Execution state
        setExecuting: (isExecuting) => {
          set({ isExecuting });
        },

        setSaving: (isSaving) => {
          set({ isSaving });
        },
      }),
      {
        name: 'symtex-workflow-store',
        partialize: (state) => ({
          // Only persist workflow data, not UI state
          nodes: state.nodes,
          edges: state.edges,
          workflowName: state.workflowName,
          workflowId: state.workflowId,
        }),
      }
    ),
    { name: 'WorkflowStore' }
  )
);
