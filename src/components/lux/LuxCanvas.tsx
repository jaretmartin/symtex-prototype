import { useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  Connection,
  addEdge,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  useReactFlow,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';

import TriggerNode from './nodes/TriggerNode';
import ConditionNode from './nodes/ConditionNode';
import ActionNode from './nodes/ActionNode';
import DelayNode from './nodes/DelayNode';

interface LuxCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (nodes: Node[]) => void;
  onEdgesChange: (edges: Edge[]) => void;
  onAddNode: (nodeType: string, position: { x: number; y: number }) => void;
}

// Define custom node types
const nodeTypes = {
  trigger: TriggerNode,
  condition: ConditionNode,
  action: ActionNode,
  delay: DelayNode,
};

function LuxCanvasInner({
  nodes: initialNodes,
  edges: initialEdges,
  onNodesChange: onNodesChangeProp,
  onEdgesChange: onEdgesChangeProp,
}: Omit<LuxCanvasProps, 'onAddNode'>) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sync state changes to parent
  useEffect(() => {
    onNodesChangeProp(nodes);
  }, [nodes, onNodesChangeProp]);

  useEffect(() => {
    onEdgesChangeProp(edges);
  }, [edges, onEdgesChangeProp]);

  // Handle new connections
  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: true,
            style: { stroke: '#6366f1', strokeWidth: 2 },
          },
          eds
        )
      );
    },
    [setEdges]
  );

  // Handle drag over for dropping new nodes
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle drop to create new nodes
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const nodeType = event.dataTransfer.getData('application/lux-node-type');
      const nodeData = event.dataTransfer.getData('application/lux-node-data');

      if (!nodeType) {
        return;
      }

      // Get the position where the node was dropped
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      let data = {
        label: 'New Node',
        description: 'Configure this node',
        icon: 'circle',
      };

      try {
        if (nodeData) {
          data = JSON.parse(nodeData);
        }
      } catch (e) {
        console.error('Failed to parse node data:', e);
      }

      const newNode: Node = {
        id: `${nodeType}-${Date.now()}`,
        type: nodeType,
        position,
        data,
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [screenToFlowPosition, setNodes]
  );

  return (
    <div
      ref={reactFlowWrapper}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#0a0a0f',
      }}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{
          padding: 0.2,
          includeHiddenNodes: false,
        }}
        defaultEdgeOptions={{
          animated: true,
          style: { stroke: '#6366f1', strokeWidth: 2 },
        }}
        connectionLineStyle={{ stroke: '#6366f1', strokeWidth: 2 }}
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
          }}
        />
        <MiniMap
          style={{
            backgroundColor: '#0f0f1a',
            border: '1px solid #2a2a3e',
          }}
          nodeColor={(node) => {
            switch (node.type) {
              case 'trigger':
                return '#f59e0b';
              case 'condition':
                return '#8b5cf6';
              case 'action':
                return '#6366f1';
              case 'delay':
                return '#64748b';
              default:
                return '#6366f1';
            }
          }}
          maskColor="rgba(0, 0, 0, 0.8)"
        />
      </ReactFlow>
    </div>
  );
}

// Wrap with ReactFlowProvider for useReactFlow hook
export default function LuxCanvas({ onAddNode: _, ...props }: LuxCanvasProps) {
  return (
    <ReactFlowProvider>
      <LuxCanvasInner {...props} />
    </ReactFlowProvider>
  );
}
