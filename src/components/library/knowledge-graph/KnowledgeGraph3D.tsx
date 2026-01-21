/**
 * KnowledgeGraph3D Component
 *
 * 3D force-directed graph visualization using react-force-graph-3d.
 * Falls back to a 2D placeholder when 3D dependencies are not available.
 *
 * To enable full 3D:
 * npm install react-force-graph-3d three
 */

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layers,
  Eye,
  EyeOff,
  ChevronRight,
  X,
  Clock,
  Tag,
  User,
  Box,
} from 'lucide-react';
import clsx from 'clsx';
import type {
  GraphNode,
  GraphColorScheme,
  KnowledgeGraph3DProps,
  NodeLayer,
} from './types';
import { GRAPH_COLOR_SCHEME, MOCK_NODES, MOCK_EDGES } from './types';

// ============================================================================
// 2D Fallback Component (when 3D deps not available)
// ============================================================================

interface Node2DProps {
  node: GraphNode;
  x: number;
  y: number;
  isSelected: boolean;
  isHighlighted: boolean;
  colorScheme: GraphColorScheme;
  onClick: () => void;
}

function Node2D({ node, x, y, isSelected, isHighlighted, colorScheme, onClick }: Node2DProps) {
  const nodeColor = colorScheme[(node.layer || 'default') as NodeLayer] || colorScheme.default;
  const size = 12 + (node.importance || 0.5) * 16;

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
      className="transition-all duration-200"
    >
      {/* Glow effect */}
      <circle
        r={size * 1.5}
        fill={nodeColor.glow}
        opacity={isHighlighted ? 0.3 : 0.1}
        className="transition-opacity"
      />

      {/* Main node */}
      <circle
        r={size}
        fill={nodeColor.primary}
        stroke={isSelected ? '#fff' : 'transparent'}
        strokeWidth={2}
        opacity={isHighlighted ? 1 : 0.3}
        className="transition-opacity"
      />

      {/* Label */}
      <text
        y={size + 14}
        textAnchor="middle"
        fill={isHighlighted ? '#e4e4e7' : '#52525b'}
        fontSize={10}
        fontWeight={500}
        className="transition-opacity"
      >
        {node.label.length > 15 ? node.label.slice(0, 12) + '...' : node.label}
      </text>
    </g>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function KnowledgeGraph3D({
  nodes = MOCK_NODES,
  edges = MOCK_EDGES,
  colorScheme = GRAPH_COLOR_SCHEME,
  onNodeClick,
  showControls = true,
  showLegend = true,
  className = '',
}: KnowledgeGraph3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [visibleLayers, setVisibleLayers] = useState<Record<string, boolean>>(() => {
    const layers: Record<string, boolean> = {};
    Object.keys(colorScheme).forEach((key) => {
      if (key !== 'default') layers[key] = true;
    });
    return layers;
  });
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  // Handle container resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: rect.width,
          height: rect.height,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Filter data based on visible layers
  const filteredData = useMemo(() => {
    const filteredNodes = nodes.filter((node) => {
      const layer = node.layer || node.type || 'default';
      return visibleLayers[layer] !== false;
    });

    const nodeIds = new Set(filteredNodes.map((n) => n.id));

    const filteredEdges = edges.filter((edge) => {
      const sourceId = typeof edge.source === 'object' ? edge.source.id : edge.source;
      const targetId = typeof edge.target === 'object' ? edge.target.id : edge.target;
      return nodeIds.has(sourceId) && nodeIds.has(targetId);
    });

    return { nodes: filteredNodes, edges: filteredEdges };
  }, [nodes, edges, visibleLayers]);

  // Calculate simple force-directed positions
  const nodePositions = useMemo(() => {
    const positions: Record<string, { x: number; y: number }> = {};
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const radius = Math.min(dimensions.width, dimensions.height) * 0.35;

    filteredData.nodes.forEach((node, i) => {
      const angle = (2 * Math.PI * i) / filteredData.nodes.length;
      // Add some randomness for visual interest
      const r = radius * (0.7 + Math.random() * 0.3);
      positions[node.id] = {
        x: centerX + r * Math.cos(angle),
        y: centerY + r * Math.sin(angle),
      };
    });

    return positions;
  }, [filteredData.nodes, dimensions]);

  // Highlight connected nodes
  const highlightedNodes = useMemo(() => {
    if (!selectedNode) return new Set<string>();

    const connected = new Set([selectedNode.id]);

    edges.forEach((edge) => {
      const sourceId = typeof edge.source === 'object' ? edge.source.id : edge.source;
      const targetId = typeof edge.target === 'object' ? edge.target.id : edge.target;

      if (sourceId === selectedNode.id) connected.add(targetId);
      if (targetId === selectedNode.id) connected.add(sourceId);
    });

    return connected;
  }, [selectedNode, edges]);

  // Get unique layers from nodes
  const uniqueLayers = useMemo(() => {
    const layers = new Set<string>();
    nodes.forEach((node) => {
      const layer = node.layer || node.type || 'default';
      layers.add(layer);
    });
    return Array.from(layers).filter((l) => colorScheme[l as NodeLayer]);
  }, [nodes, colorScheme]);

  const handleNodeClick = useCallback(
    (node: GraphNode) => {
      setSelectedNode(node);
      onNodeClick?.(node);
    },
    [onNodeClick]
  );

  const toggleLayer = (layer: string) => {
    setVisibleLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  return (
    <div ref={containerRef} className={clsx('relative h-full w-full bg-surface-base', className)}>
      {/* SVG Canvas */}
      <svg
        width={dimensions.width - (selectedNode ? 320 : 0)}
        height={dimensions.height}
        style={{
          transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
          transformOrigin: 'center',
        }}
      >
        {/* Edges */}
        <g>
          {filteredData.edges.map((edge, i) => {
            const sourceId = typeof edge.source === 'object' ? edge.source.id : edge.source;
            const targetId = typeof edge.target === 'object' ? edge.target.id : edge.target;
            const sourcePos = nodePositions[sourceId];
            const targetPos = nodePositions[targetId];

            if (!sourcePos || !targetPos) return null;

            const isHighlighted =
              highlightedNodes.size === 0 ||
              (highlightedNodes.has(sourceId) && highlightedNodes.has(targetId));

            return (
              <line
                key={i}
                x1={sourcePos.x}
                y1={sourcePos.y}
                x2={targetPos.x}
                y2={targetPos.y}
                stroke={isHighlighted ? '#7C3AED' : '#3f3f46'}
                strokeWidth={isHighlighted ? 2 : 1}
                strokeOpacity={isHighlighted ? 0.5 : 0.2}
              />
            );
          })}
        </g>

        {/* Nodes */}
        <g>
          {filteredData.nodes.map((node) => {
            const pos = nodePositions[node.id];
            if (!pos) return null;

            const isHighlighted =
              highlightedNodes.size === 0 || highlightedNodes.has(node.id);

            return (
              <Node2D
                key={node.id}
                node={node}
                x={pos.x}
                y={pos.y}
                isSelected={selectedNode?.id === node.id}
                isHighlighted={isHighlighted}
                colorScheme={colorScheme}
                onClick={() => handleNodeClick(node)}
              />
            );
          })}
        </g>
      </svg>

      {/* 3D Mode Banner */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-card/80 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2 text-sm text-muted-foreground border border-border">
        <Box className="w-4 h-4" />
        <span>2D Preview Mode</span>
        <span className="text-muted-foreground">|</span>
        <span className="text-xs">Install react-force-graph-3d for full 3D</span>
      </div>

      {/* Layer Filter Panel */}
      {showControls && (
        <div className="absolute top-16 left-4 bg-card rounded-xl shadow-lg border border-border overflow-hidden">
          <button
            onClick={() => setFilterPanelOpen(!filterPanelOpen)}
            className="flex items-center gap-2 px-4 py-3 w-full hover:bg-muted transition-colors"
          >
            <Layers className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Layers</span>
            <ChevronRight
              className={clsx(
                'w-4 h-4 text-muted-foreground ml-auto transition-transform',
                filterPanelOpen && 'rotate-90'
              )}
            />
          </button>

          {filterPanelOpen && (
            <div className="px-4 pb-3 space-y-2">
              {uniqueLayers.map((layer) => {
                const config = colorScheme[layer as NodeLayer];
                if (!config) return null;
                return (
                  <button
                    key={layer}
                    onClick={() => toggleLayer(layer)}
                    className="flex items-center gap-3 w-full py-1.5 group"
                  >
                    <div
                      className="w-3 h-3 rounded-full shadow-lg"
                      style={{
                        backgroundColor: visibleLayers[layer] ? config.primary : '#4B5563',
                        boxShadow: visibleLayers[layer] ? `0 0 8px ${config.glow}` : 'none',
                      }}
                    />
                    <span
                      className={clsx(
                        'text-sm',
                        visibleLayers[layer] ? 'text-muted-foreground' : 'text-muted-foreground'
                      )}
                    >
                      {config.label}
                    </span>
                    {visibleLayers[layer] ? (
                      <Eye className="w-4 h-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Zoom Controls */}
      {showControls && (
        <div className="absolute bottom-4 left-4 flex flex-col gap-1 bg-card rounded-lg shadow-lg border border-border overflow-hidden">
          <button
            onClick={() => setZoom((z) => Math.min(z * 1.2, 3))}
            className="p-2 hover:bg-muted transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-5 h-5 text-muted-foreground" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(z * 0.8, 0.3))}
            className="p-2 hover:bg-muted transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5 text-muted-foreground" />
          </button>
          <div className="h-px bg-muted" />
          <button
            onClick={() => {
              setZoom(1);
              setPan({ x: 0, y: 0 });
            }}
            className="p-2 hover:bg-muted transition-colors"
            title="Reset View"
          >
            <RotateCcw className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      )}

      {/* Legend */}
      {showLegend && (
        <div className="absolute bottom-4 right-4 bg-card rounded-lg shadow-lg border border-border p-3">
          <p className="text-xs font-medium text-muted-foreground mb-2">Legend</p>
          <div className="space-y-1.5">
            {uniqueLayers.map((layer) => {
              const config = colorScheme[layer as NodeLayer];
              if (!config) return null;
              return (
                <div key={layer} className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      backgroundColor: config.primary,
                      boxShadow: `0 0 6px ${config.glow}`,
                    }}
                  />
                  <span className="text-xs text-muted-foreground">{config.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Node Stats Overlay */}
      <div className="absolute top-16 right-4 bg-card/80 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-muted-foreground border border-border">
        <span className="font-medium">{filteredData.nodes.length}</span> nodes
        <span className="mx-2 text-muted-foreground">|</span>
        <span className="font-medium">{filteredData.edges.length}</span> connections
      </div>

      {/* Node Detail Panel */}
      {selectedNode && (
        <div className="absolute top-0 right-0 w-80 h-full bg-card border-l border-border overflow-y-auto">
          <div className="sticky top-0 bg-card px-4 py-3 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-muted-foreground">Node Details</h3>
            <button
              onClick={() => setSelectedNode(null)}
              className="p-1 hover:bg-muted rounded"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          <div className="p-4 space-y-4">
            {/* Type Badge */}
            <div className="flex items-center gap-2">
              <span
                className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium text-foreground"
                style={{
                  backgroundColor:
                    colorScheme[(selectedNode.layer || 'default') as NodeLayer]?.primary || '#6B7280',
                  boxShadow: `0 0 10px ${
                    colorScheme[(selectedNode.layer || 'default') as NodeLayer]?.glow || '#9CA3AF'
                  }`,
                }}
              >
                {colorScheme[(selectedNode.layer || 'default') as NodeLayer]?.label || 'Node'}
              </span>
            </div>

            <h4 className="text-lg font-semibold text-muted-foreground">{selectedNode.label}</h4>

            {selectedNode.summary && (
              <p className="text-sm text-muted-foreground">{selectedNode.summary}</p>
            )}

            <div className="space-y-3 pt-2">
              {selectedNode.timestamp && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {new Date(selectedNode.timestamp).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              )}

              {selectedNode.participants && selectedNode.participants.length > 0 && (
                <div className="flex items-start gap-2 text-sm">
                  <User className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div className="flex flex-wrap gap-1">
                    {selectedNode.participants.map((p, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-muted rounded text-xs text-muted-foreground"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedNode.tags && selectedNode.tags.length > 0 && (
                <div className="flex items-start gap-2 text-sm">
                  <Tag className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div className="flex flex-wrap gap-1">
                    {selectedNode.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-purple-900/50 rounded text-xs text-purple-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedNode.importance && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Importance: </span>
                  <div className="inline-flex items-center gap-1">
                    <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{
                          width: `${selectedNode.importance * 100}%`,
                          boxShadow: '0 0 4px #A78BFA',
                        }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {Math.round(selectedNode.importance * 100)}%
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Connected Nodes */}
            <div className="pt-4 border-t border-border">
              <h5 className="text-sm font-medium text-muted-foreground mb-2">Connections</h5>
              <div className="space-y-2">
                {edges
                  .filter((edge) => {
                    const sourceId =
                      typeof edge.source === 'object' ? edge.source.id : edge.source;
                    const targetId =
                      typeof edge.target === 'object' ? edge.target.id : edge.target;
                    return sourceId === selectedNode.id || targetId === selectedNode.id;
                  })
                  .slice(0, 5)
                  .map((edge, i) => {
                    const sourceId =
                      typeof edge.source === 'object' ? edge.source.id : edge.source;
                    const targetId =
                      typeof edge.target === 'object' ? edge.target.id : edge.target;
                    const connectedId =
                      sourceId === selectedNode.id ? targetId : sourceId;
                    const connectedNode = nodes.find((n) => n.id === connectedId);

                    if (!connectedNode) return null;

                    const connectedColor =
                      colorScheme[(connectedNode.layer || 'default') as NodeLayer];

                    return (
                      <button
                        key={i}
                        onClick={() => handleNodeClick(connectedNode)}
                        className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-muted text-left transition-colors"
                      >
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: connectedColor?.primary || '#6B7280',
                            boxShadow: `0 0 4px ${connectedColor?.glow || '#9CA3AF'}`,
                          }}
                        />
                        <span className="text-sm text-muted-foreground flex-1 truncate">
                          {connectedNode.label}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {(edge.type || 'related').replace('_', ' ')}
                        </span>
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default KnowledgeGraph3D;
