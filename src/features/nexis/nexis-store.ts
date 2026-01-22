/**
 * NEXIS Store - Zustand state management for relationship graph
 *
 * Manages contacts, companies, topics, and their relationships
 * for the NEXIS relationship intelligence feature.
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  mockNexisNodes,
  mockNexisEdges,
  mockNexisInsights,
} from '@/mocks/nexis';

// Node types in the NEXIS graph
export type NexisNodeType = 'person' | 'company' | 'topic' | 'event';

// Edge types representing relationships
export type NexisEdgeType = 'works_at' | 'knows' | 'mentioned_in' | 'attended' | 'interested_in' | 'collaborated_on';

export interface NexisNode {
  id: string;
  type: NexisNodeType;
  label: string;
  data: {
    name: string;
    title?: string;
    company?: string;
    email?: string;
    avatar?: string;
    description?: string;
    industry?: string;
    date?: string;
    location?: string;
    strength?: number; // 0-100 relationship strength
    lastContact?: string;
    tags?: string[];
  };
  position: { x: number; y: number };
}

export interface NexisEdge {
  id: string;
  source: string;
  target: string;
  type: NexisEdgeType;
  label?: string;
  data?: {
    strength?: number;
    since?: string;
    notes?: string;
  };
}

export interface NexisInsight {
  id: string;
  type: 'connection' | 'opportunity' | 'reminder' | 'trend';
  title: string;
  description: string;
  relatedNodes: string[];
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

interface NexisState {
  // Data
  nodes: NexisNode[];
  edges: NexisEdge[];
  insights: NexisInsight[];

  // UI State
  selectedNodeId: string | null;
  hoveredNodeId: string | null;
  filterTypes: NexisNodeType[];
  searchQuery: string;
  isLoading: boolean;

  // Actions
  setNodes: (nodes: NexisNode[]) => void;
  setEdges: (edges: NexisEdge[]) => void;
  addNode: (node: NexisNode) => void;
  updateNode: (id: string, updates: Partial<NexisNode>) => void;
  removeNode: (id: string) => void;
  addEdge: (edge: NexisEdge) => void;
  removeEdge: (id: string) => void;
  selectNode: (id: string | null) => void;
  setHoveredNode: (id: string | null) => void;
  setFilterTypes: (types: NexisNodeType[]) => void;
  setSearchQuery: (query: string) => void;
  setLoading: (loading: boolean) => void;

  // Computed
  getConnectedNodes: (nodeId: string) => NexisNode[];
  getNodeEdges: (nodeId: string) => NexisEdge[];
  getFilteredNodes: () => NexisNode[];
}

// Mock data imported from centralized mocks
// See: src/mocks/nexis.ts for 15 entities (6 people, 4 orgs, 3 concepts, 2 events) and 17+ relationships

export const useNexisStore = create<NexisState>()(
  devtools(
    (set, get) => ({
      // Initial state with centralized mock data (15 entities, 17+ relationships)
      nodes: mockNexisNodes,
      edges: mockNexisEdges,
      insights: mockNexisInsights,
      selectedNodeId: null,
      hoveredNodeId: null,
      filterTypes: ['person', 'company', 'topic', 'event'],
      searchQuery: '',
      isLoading: false,

      // Actions
      setNodes: (nodes) => set({ nodes }),
      setEdges: (edges) => set({ edges }),

      addNode: (node) =>
        set((state) => ({
          nodes: [...state.nodes, node],
        })),

      updateNode: (id, updates) =>
        set((state) => ({
          nodes: state.nodes.map((n) =>
            n.id === id ? { ...n, ...updates } : n
          ),
        })),

      removeNode: (id) =>
        set((state) => ({
          nodes: state.nodes.filter((n) => n.id !== id),
          edges: state.edges.filter((e) => e.source !== id && e.target !== id),
        })),

      addEdge: (edge) =>
        set((state) => ({
          edges: [...state.edges, edge],
        })),

      removeEdge: (id) =>
        set((state) => ({
          edges: state.edges.filter((e) => e.id !== id),
        })),

      selectNode: (id) => set({ selectedNodeId: id }),
      setHoveredNode: (id) => set({ hoveredNodeId: id }),
      setFilterTypes: (types) => set({ filterTypes: types }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setLoading: (loading) => set({ isLoading: loading }),

      // Computed
      getConnectedNodes: (nodeId) => {
        const { nodes, edges } = get();
        const connectedIds = new Set<string>();

        edges.forEach((edge) => {
          if (edge.source === nodeId) connectedIds.add(edge.target);
          if (edge.target === nodeId) connectedIds.add(edge.source);
        });

        return nodes.filter((n) => connectedIds.has(n.id));
      },

      getNodeEdges: (nodeId) => {
        const { edges } = get();
        return edges.filter((e) => e.source === nodeId || e.target === nodeId);
      },

      getFilteredNodes: () => {
        const { nodes, filterTypes, searchQuery } = get();
        return nodes.filter((n) => {
          const matchesType = filterTypes.includes(n.type);
          const matchesSearch =
            !searchQuery ||
            n.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            n.data.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            n.data.tags?.some((t) =>
              t.toLowerCase().includes(searchQuery.toLowerCase())
            );
          return matchesType && matchesSearch;
        });
      },
    }),
    { name: 'NexisStore' }
  )
);
