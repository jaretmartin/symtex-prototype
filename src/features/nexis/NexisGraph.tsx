/**
 * NexisGraph Component
 *
 * React Flow-based 2D visualization of the NEXIS relationship graph.
 * Shows connections between contacts, companies, topics, and events.
 */

import React, { useCallback, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  BackgroundVariant,
  ConnectionMode,
  NodeProps,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  User,
  Building2,
  Hash,
  Calendar,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNexisStore, type NexisNode, type NexisEdgeType } from './nexis-store';

interface NexisGraphProps {
  onNodeSelect?: (nodeId: string | null) => void;
  className?: string;
}

// Node type configuration for visual styling
const nodeTypeConfig = {
  person: {
    icon: User,
    color: '#3b82f6',
    bgColor: '#3b82f620',
    borderColor: '#3b82f640',
  },
  company: {
    icon: Building2,
    color: '#8b5cf6',
    bgColor: '#8b5cf620',
    borderColor: '#8b5cf640',
  },
  topic: {
    icon: Hash,
    color: '#22c55e',
    bgColor: '#22c55e20',
    borderColor: '#22c55e40',
  },
  event: {
    icon: Calendar,
    color: '#f59e0b',
    bgColor: '#f59e0b20',
    borderColor: '#f59e0b40',
  },
};

// Edge type colors
const edgeTypeColors: Record<NexisEdgeType, string> = {
  works_at: '#8b5cf6',
  knows: '#3b82f6',
  mentioned_in: '#22c55e',
  attended: '#f59e0b',
  interested_in: '#06b6d4',
  collaborated_on: '#ec4899',
};

// Custom Node Component
function NexisNodeComponent({ data, selected }: NodeProps): JSX.Element {
  const nodeType = data.nodeType as keyof typeof nodeTypeConfig;
  const config = nodeTypeConfig[nodeType];
  const Icon = config.icon;

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-transparent !border-none"
      />
      <div
        className={cn(
          'px-3 py-2 rounded-xl border-2 transition-all duration-200',
          'flex items-center gap-2 min-w-[120px]',
          selected && 'ring-2 ring-symtex-primary ring-offset-2 ring-offset-symtex-dark'
        )}
        style={{
          backgroundColor: config.bgColor,
          borderColor: selected ? config.color : config.borderColor,
        }}
      >
        <div
          className="p-1.5 rounded-lg"
          style={{ backgroundColor: config.bgColor }}
        >
          <Icon
            className="w-4 h-4"
            style={{ color: config.color }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p
            className="text-sm font-medium truncate"
            style={{ color: config.color }}
          >
            {data.label}
          </p>
          {data.subtitle && (
            <p className="text-xs text-muted-foreground truncate">{data.subtitle}</p>
          )}
        </div>
        {data.strength && (
          <div
            className="text-xs font-medium px-1.5 py-0.5 rounded"
            style={{
              backgroundColor: config.color,
              color: '#0a0a0f',
            }}
          >
            {data.strength}%
          </div>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-transparent !border-none"
      />
    </>
  );
}

// Custom node types for React Flow
const nodeTypes = {
  nexis: NexisNodeComponent,
};

// Convert NexisNode to React Flow Node
function convertToFlowNode(nexisNode: NexisNode): Node {
  return {
    id: nexisNode.id,
    type: 'nexis',
    position: nexisNode.position,
    data: {
      label: nexisNode.label,
      nodeType: nexisNode.type,
      subtitle: nexisNode.data.title || nexisNode.data.industry || nexisNode.data.date,
      strength: nexisNode.data.strength,
    },
  };
}

// Convert NexisEdge to React Flow Edge
function convertToFlowEdge(nexisEdge: { id: string; source: string; target: string; type: NexisEdgeType }): Edge {
  return {
    id: nexisEdge.id,
    source: nexisEdge.source,
    target: nexisEdge.target,
    type: 'smoothstep',
    animated: nexisEdge.type === 'knows' || nexisEdge.type === 'collaborated_on',
    style: {
      stroke: edgeTypeColors[nexisEdge.type],
      strokeWidth: 2,
    },
    labelStyle: {
      fontSize: 10,
      fill: '#94a3b8',
    },
  };
}

function NexisGraphInner({ onNodeSelect, className }: NexisGraphProps): JSX.Element {
  const { nodes: nexisNodes, edges: nexisEdges, selectNode, filterTypes } = useNexisStore();

  // Filter and convert nodes
  const filteredNodes = useMemo(
    () =>
      nexisNodes
        .filter((n) => filterTypes.includes(n.type))
        .map(convertToFlowNode),
    [nexisNodes, filterTypes]
  );

  // Filter edges to only include those between visible nodes
  const visibleNodeIds = useMemo(
    () => new Set(filteredNodes.map((n) => n.id)),
    [filteredNodes]
  );

  const filteredEdges = useMemo(
    () =>
      nexisEdges
        .filter((e) => visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target))
        .map(convertToFlowEdge),
    [nexisEdges, visibleNodeIds]
  );

  const [nodes, , onNodesChange] = useNodesState(filteredNodes);
  const [edges, , onEdgesChange] = useEdgesState(filteredEdges);

  // Handle node click
  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      selectNode(node.id);
      onNodeSelect?.(node.id);
    },
    [selectNode, onNodeSelect]
  );

  // Handle pane click (deselect)
  const handlePaneClick = useCallback(() => {
    selectNode(null);
    onNodeSelect?.(null);
  }, [selectNode, onNodeSelect]);

  return (
    <div className={cn('w-full h-full bg-symtex-dark rounded-xl overflow-hidden', className)}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        fitViewOptions={{
          padding: 0.2,
          includeHiddenNodes: false,
        }}
        defaultEdgeOptions={{
          type: 'smoothstep',
        }}
        style={{
          backgroundColor: '#0a0a0f',
        }}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#1e1e2e"
        />
        <Controls
          style={{
            backgroundColor: '#1e1e2e',
            borderColor: '#2a2a3e',
            borderRadius: 8,
          }}
          className="!border !border-border !rounded-lg overflow-hidden"
        />
        <MiniMap
          style={{
            backgroundColor: '#0f0f1a',
            border: '1px solid #2a2a3e',
            borderRadius: 8,
          }}
          nodeColor={(node) => {
            const nodeType = node.data?.nodeType as keyof typeof nodeTypeConfig;
            return nodeTypeConfig[nodeType]?.color || '#6366f1';
          }}
          maskColor="rgba(0, 0, 0, 0.8)"
          pannable
          zoomable
        />
      </ReactFlow>
    </div>
  );
}

// Wrap with ReactFlowProvider
function NexisGraphInnerWrapper(props: NexisGraphProps): JSX.Element {
  return (
    <ReactFlowProvider>
      <NexisGraphInner {...props} />
    </ReactFlowProvider>
  );
}

export default React.memo(NexisGraphInnerWrapper);
