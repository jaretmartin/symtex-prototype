import React, { useState, useMemo, useRef, useEffect } from 'react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface Document {
  id: string;
  title: string;
  type: DocumentType;
  excerpt: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  connections: number;
  size: string;
  author: string;
  color: string;
}

type DocumentType = 'pdf' | 'note' | 'article' | 'research' | 'image' | 'video';

interface GraphNode {
  id: string;
  label: string;
  type: DocumentType;
  x: number;
  y: number;
  z: number;
  connections: string[];
  color: string;
}

type ViewMode = '3d' | '2d' | 'split';

// ============================================================================
// ICONS
// ============================================================================

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const DocumentIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const GraphIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const CubeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const SquareIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
  </svg>
);

const SplitIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
  </svg>
);

const LinkIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const PDFIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
    <path fill="currentColor" d="M7 18h10v-2H7v2zM7 14h10v-2H7v2zM7 10h4V8H7v2z"/>
    <path fill="currentColor" d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm0 16H5V5h14v14z"/>
  </svg>
);

const NoteIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const ArticleIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
  </svg>
);

const ResearchIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const ImageIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const VideoIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const ExpandIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
  </svg>
);

const CollapseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
  </svg>
);

// ============================================================================
// DOCUMENT TYPE CONFIG
// ============================================================================

const DOCUMENT_TYPE_CONFIG: Record<DocumentType, { icon: React.ReactNode; color: string; bgColor: string; label: string }> = {
  pdf: { icon: <PDFIcon />, color: 'text-red-400', bgColor: 'bg-red-500/20', label: 'PDF' },
  note: { icon: <NoteIcon />, color: 'text-yellow-400', bgColor: 'bg-yellow-500/20', label: 'Note' },
  article: { icon: <ArticleIcon />, color: 'text-blue-400', bgColor: 'bg-blue-500/20', label: 'Article' },
  research: { icon: <ResearchIcon />, color: 'text-purple-400', bgColor: 'bg-purple-500/20', label: 'Research' },
  image: { icon: <ImageIcon />, color: 'text-green-400', bgColor: 'bg-green-500/20', label: 'Image' },
  video: { icon: <VideoIcon />, color: 'text-pink-400', bgColor: 'bg-pink-500/20', label: 'Video' },
};

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_DOCUMENTS: Document[] = [
  {
    id: '1',
    title: 'AI Ethics Framework Analysis',
    type: 'research',
    excerpt: 'Comprehensive analysis of existing AI ethics frameworks and their application in enterprise settings. Covers principles of fairness, transparency, and accountability.',
    tags: ['AI', 'Ethics', 'Framework'],
    createdAt: '2024-01-15',
    updatedAt: '2024-03-20',
    connections: 8,
    size: '2.4 MB',
    author: 'Dr. Sarah Chen',
    color: '#8B5CF6',
  },
  {
    id: '2',
    title: 'Q4 Market Research Report',
    type: 'pdf',
    excerpt: 'Detailed market analysis covering competitive landscape, consumer trends, and growth opportunities in the SaaS sector.',
    tags: ['Market', 'Analysis', 'Q4'],
    createdAt: '2024-02-10',
    updatedAt: '2024-02-10',
    connections: 5,
    size: '8.1 MB',
    author: 'Marketing Team',
    color: '#EF4444',
  },
  {
    id: '3',
    title: 'Product Roadmap Notes',
    type: 'note',
    excerpt: 'Strategic planning notes for 2024 product development cycle. Includes feature prioritization and resource allocation.',
    tags: ['Product', 'Strategy', 'Planning'],
    createdAt: '2024-03-01',
    updatedAt: '2024-03-18',
    connections: 12,
    size: '45 KB',
    author: 'Product Team',
    color: '#F59E0B',
  },
  {
    id: '4',
    title: 'Machine Learning Best Practices',
    type: 'article',
    excerpt: 'Industry best practices for implementing ML models in production environments. Covers model versioning, monitoring, and deployment strategies.',
    tags: ['ML', 'Best Practices', 'Production'],
    createdAt: '2024-01-22',
    updatedAt: '2024-02-15',
    connections: 15,
    size: '1.2 MB',
    author: 'Tech Publications',
    color: '#3B82F6',
  },
  {
    id: '5',
    title: 'Brand Guidelines 2024',
    type: 'pdf',
    excerpt: 'Complete brand identity guidelines including logo usage, color palettes, typography, and voice & tone specifications.',
    tags: ['Brand', 'Design', 'Guidelines'],
    createdAt: '2024-01-05',
    updatedAt: '2024-01-05',
    connections: 7,
    size: '15.3 MB',
    author: 'Design Team',
    color: '#EF4444',
  },
  {
    id: '6',
    title: 'User Interview Recordings',
    type: 'video',
    excerpt: 'Collection of user interview sessions exploring pain points and feature requests for the next product iteration.',
    tags: ['UX', 'Research', 'Interviews'],
    createdAt: '2024-02-28',
    updatedAt: '2024-02-28',
    connections: 4,
    size: '2.1 GB',
    author: 'UX Team',
    color: '#EC4899',
  },
  {
    id: '7',
    title: 'Architecture Diagrams',
    type: 'image',
    excerpt: 'System architecture diagrams showing microservices structure, data flow, and integration points.',
    tags: ['Architecture', 'Technical', 'Diagrams'],
    createdAt: '2024-03-10',
    updatedAt: '2024-03-15',
    connections: 9,
    size: '4.5 MB',
    author: 'Engineering',
    color: '#22C55E',
  },
  {
    id: '8',
    title: 'Competitive Analysis Deep Dive',
    type: 'research',
    excerpt: 'In-depth analysis of top 5 competitors including feature comparison, pricing strategies, and market positioning.',
    tags: ['Competition', 'Analysis', 'Strategy'],
    createdAt: '2024-02-05',
    updatedAt: '2024-03-01',
    connections: 11,
    size: '3.8 MB',
    author: 'Strategy Team',
    color: '#8B5CF6',
  },
  {
    id: '9',
    title: 'API Documentation Draft',
    type: 'note',
    excerpt: 'Working draft for public API documentation. Includes endpoint specifications, authentication, and code examples.',
    tags: ['API', 'Documentation', 'Developer'],
    createdAt: '2024-03-05',
    updatedAt: '2024-03-19',
    connections: 6,
    size: '890 KB',
    author: 'Developer Relations',
    color: '#F59E0B',
  },
  {
    id: '10',
    title: 'Neural Network Fundamentals',
    type: 'article',
    excerpt: 'Educational article covering neural network basics, backpropagation, and common architectures for beginners.',
    tags: ['AI', 'Education', 'Neural Networks'],
    createdAt: '2024-01-30',
    updatedAt: '2024-01-30',
    connections: 13,
    size: '1.8 MB',
    author: 'AI Research Lab',
    color: '#3B82F6',
  },
];

// Generate graph nodes from documents
const generateGraphNodes = (documents: Document[]): GraphNode[] => {
  return documents.map((doc, index) => {
    const angle = (index / documents.length) * Math.PI * 2;
    const radius = 150 + Math.random() * 100;
    return {
      id: doc.id,
      label: doc.title,
      type: doc.type,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      z: (Math.random() - 0.5) * 200,
      connections: documents
        .filter((d) => d.id !== doc.id && Math.random() > 0.6)
        .slice(0, doc.connections)
        .map((d) => d.id),
      color: doc.color,
    };
  });
};

// ============================================================================
// 3D GRAPH VISUALIZATION COMPONENT
// ============================================================================

interface Graph3DProps {
  nodes: GraphNode[];
  selectedNode: string | null;
  onNodeSelect: (id: string | null) => void;
  isFullscreen?: boolean;
}

const Graph3DVisualization: React.FC<Graph3DProps> = ({ nodes, selectedNode, onNodeSelect, isFullscreen = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const rotationRef = useRef({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const [is3D, setIs3D] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener('resize', resize);

    const project = (x: number, y: number, z: number) => {
      const rotX = rotationRef.current.x;
      const rotY = rotationRef.current.y;

      // Rotate around Y axis
      const x1 = x * Math.cos(rotY) - z * Math.sin(rotY);
      const z1 = x * Math.sin(rotY) + z * Math.cos(rotY);

      // Rotate around X axis
      const y1 = y * Math.cos(rotX) - z1 * Math.sin(rotX);
      const z2 = y * Math.sin(rotX) + z1 * Math.cos(rotX);

      // Perspective projection
      const perspective = is3D ? 800 / (800 + z2) : 1;
      const centerX = canvas.width / (2 * window.devicePixelRatio);
      const centerY = canvas.height / (2 * window.devicePixelRatio);

      return {
        x: centerX + x1 * perspective,
        y: centerY + y1 * perspective,
        scale: perspective,
        z: z2,
      };
    };

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Auto-rotate when not dragging
      if (!isDragging) {
        rotationRef.current.y += 0.002;
      }

      // Draw connections first (behind nodes)
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.15)';
      ctx.lineWidth = 1;

      nodes.forEach((node) => {
        const p1 = project(node.x, node.y, node.z);
        node.connections.forEach((connId) => {
          const connNode = nodes.find((n) => n.id === connId);
          if (connNode) {
            const p2 = project(connNode.x, connNode.y, connNode.z);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      // Sort nodes by Z for proper rendering order
      const sortedNodes = [...nodes].sort((a, b) => {
        const pA = project(a.x, a.y, a.z);
        const pB = project(b.x, b.y, b.z);
        return pA.z - pB.z;
      });

      // Draw nodes
      sortedNodes.forEach((node) => {
        const p = project(node.x, node.y, node.z);
        const baseRadius = isFullscreen ? 12 : 8;
        const radius = baseRadius * p.scale;
        const isSelected = selectedNode === node.id;

        // Glow effect
        if (isSelected) {
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius * 3);
          gradient.addColorStop(0, node.color + '80');
          gradient.addColorStop(1, 'transparent');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius * 3, 0, Math.PI * 2);
          ctx.fill();
        }

        // Node circle
        ctx.fillStyle = isSelected ? node.color : node.color + 'CC';
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Node border
        ctx.strokeStyle = isSelected ? '#fff' : node.color;
        ctx.lineWidth = isSelected ? 3 : 1.5;
        ctx.stroke();

        // Label (only show for selected or when fullscreen/nearby)
        if (isSelected || isFullscreen) {
          ctx.fillStyle = '#fff';
          ctx.font = `${isSelected ? 'bold ' : ''}${isFullscreen ? 12 : 10}px system-ui`;
          ctx.textAlign = 'center';
          const label = node.label.length > 20 ? node.label.slice(0, 20) + '...' : node.label;
          ctx.fillText(label, p.x, p.y + radius + 16);
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [nodes, selectedNode, isDragging, isFullscreen, is3D]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - lastMouseRef.current.x;
    const deltaY = e.clientY - lastMouseRef.current.y;

    rotationRef.current.y += deltaX * 0.005;
    rotationRef.current.x += deltaY * 0.005;

    lastMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Simple hit detection (check if click is near any node)
    for (const node of nodes) {
      const rotX = rotationRef.current.x;
      const rotY = rotationRef.current.y;

      const x1 = node.x * Math.cos(rotY) - node.z * Math.sin(rotY);
      const z1 = node.x * Math.sin(rotY) + node.z * Math.cos(rotY);
      const y1 = node.y * Math.cos(rotX) - z1 * Math.sin(rotX);
      const z2 = node.y * Math.sin(rotX) + z1 * Math.cos(rotX);

      const perspective = is3D ? 800 / (800 + z2) : 1;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const px = centerX + x1 * perspective;
      const py = centerY + y1 * perspective;

      const distance = Math.sqrt((x - px) ** 2 + (y - py) ** 2);
      if (distance < 20) {
        onNodeSelect(selectedNode === node.id ? null : node.id);
        return;
      }
    }

    onNodeSelect(null);
  };

  return (
    <div className="relative w-full h-full">
      {/* 3D/2D Toggle */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-gray-900/80 backdrop-blur-sm rounded-lg p-1">
        <button
          onClick={() => setIs3D(true)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
            is3D ? 'bg-symtex-purple text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          <CubeIcon />
          <span className="text-sm font-medium">3D</span>
        </button>
        <button
          onClick={() => setIs3D(false)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
            !is3D ? 'bg-symtex-purple text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          <SquareIcon />
          <span className="text-sm font-medium">2D</span>
        </button>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 z-10 text-xs text-gray-500 bg-gray-900/60 backdrop-blur-sm rounded-lg px-3 py-2">
        Drag to rotate {is3D ? '3D' : '2D'} view | Click nodes to select
      </div>

      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleClick}
      />

      {/* Ambient glow effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-symtex-purple/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-symtex-gold/10 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

// ============================================================================
// DOCUMENT CARD COMPONENT
// ============================================================================

interface DocumentCardProps {
  document: Document;
  isSelected: boolean;
  onClick: () => void;
  variant?: 'default' | 'compact';
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document, isSelected, onClick, variant = 'default' }) => {
  const config = DOCUMENT_TYPE_CONFIG[document.type];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (variant === 'compact') {
    return (
      <button
        onClick={onClick}
        className={`w-full text-left p-3 rounded-xl transition-all duration-200 ${
          isSelected
            ? 'bg-symtex-purple/20 border border-symtex-purple'
            : 'bg-gray-800/50 border border-transparent hover:bg-gray-800 hover:border-gray-700'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${config.bgColor} ${config.color}`}>
            {config.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-white truncate">{document.title}</h4>
            <p className="text-xs text-gray-500">{config.label} | {document.connections} connections</p>
          </div>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl transition-all duration-200 group ${
        isSelected
          ? 'bg-symtex-purple/20 border-2 border-symtex-purple shadow-lg shadow-symtex-purple/20'
          : 'bg-gray-800/50 border border-gray-800 hover:bg-gray-800/80 hover:border-gray-700'
      }`}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className={`p-2.5 rounded-xl ${config.bgColor} ${config.color} flex-shrink-0`}>
          {config.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.bgColor} ${config.color}`}>
              {config.label}
            </span>
            <span className="text-xs text-gray-500">{document.size}</span>
          </div>
          <h3 className="font-semibold text-white group-hover:text-symtex-purple transition-colors line-clamp-1">
            {document.title}
          </h3>
        </div>
      </div>

      {/* Excerpt */}
      <p className="text-sm text-gray-400 mb-3 line-clamp-2">
        {document.excerpt}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {document.tags.map((tag) => (
          <span key={tag} className="px-2 py-0.5 bg-gray-700/50 rounded text-xs text-gray-400">
            {tag}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-700/50">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <LinkIcon />
          <span>{document.connections} connections</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <ClockIcon />
          <span>{formatDate(document.updatedAt)}</span>
        </div>
      </div>
    </button>
  );
};

// ============================================================================
// DOCUMENT LIST PANEL
// ============================================================================

interface DocumentListProps {
  documents: Document[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  variant?: 'default' | 'compact';
}

const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  selectedId,
  onSelect,
  searchQuery,
  onSearchChange,
  variant = 'default',
}) => {
  const filteredDocs = useMemo(() => {
    if (!searchQuery) return documents;
    const query = searchQuery.toLowerCase();
    return documents.filter(
      (doc) =>
        doc.title.toLowerCase().includes(query) ||
        doc.excerpt.toLowerCase().includes(query) ||
        doc.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }, [documents, searchQuery]);

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-4 border-b border-gray-800">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-symtex-purple focus:ring-1 focus:ring-symtex-purple transition-all text-sm"
          />
        </div>
      </div>

      {/* Document List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredDocs.map((doc) => (
          <DocumentCard
            key={doc.id}
            document={doc}
            isSelected={selectedId === doc.id}
            onClick={() => onSelect(selectedId === doc.id ? null : doc.id)}
            variant={variant}
          />
        ))}

        {filteredDocs.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <DocumentIcon />
            <p className="mt-2">No documents found</p>
          </div>
        )}
      </div>

      {/* Add Document Button */}
      <div className="p-4 border-t border-gray-800">
        <button className="w-full py-2.5 px-4 bg-symtex-purple/20 hover:bg-symtex-purple/30 border border-symtex-purple/50 hover:border-symtex-purple text-symtex-purple hover:text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
          <PlusIcon />
          <span>Add Document</span>
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const KnowledgePage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isGraphFullscreen, setIsGraphFullscreen] = useState(false);

  const graphNodes = useMemo(() => generateGraphNodes(MOCK_DOCUMENTS), []);

  const handleNodeSelect = (id: string | null) => {
    setSelectedDocument(id);
  };

  const selectedDoc = useMemo(() => {
    return MOCK_DOCUMENTS.find((d) => d.id === selectedDocument);
  }, [selectedDocument]);

  return (
    <div className="h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-xl z-40 flex-shrink-0">
        <div className="max-w-full px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Knowledge Base
              </h1>
              <p className="text-gray-500 text-sm mt-0.5">
                {MOCK_DOCUMENTS.length} documents | {graphNodes.reduce((acc, n) => acc + n.connections.length, 0)} connections
              </p>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-4">
              {/* Fullscreen toggle for graph */}
              {viewMode !== 'split' && (
                <button
                  onClick={() => setIsGraphFullscreen(!isGraphFullscreen)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                  title={isGraphFullscreen ? 'Exit fullscreen' : 'Fullscreen graph'}
                >
                  {isGraphFullscreen ? <CollapseIcon /> : <ExpandIcon />}
                </button>
              )}

              <div className="flex items-center gap-1 bg-gray-800/50 rounded-lg p-1">
                <button
                  onClick={() => { setViewMode('3d'); setIsGraphFullscreen(false); }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    viewMode === '3d' ? 'bg-symtex-purple text-white' : 'text-gray-400 hover:text-white'
                  }`}
                  title="Graph View"
                >
                  <GraphIcon />
                  <span className="text-sm font-medium hidden sm:inline">Graph</span>
                </button>
                <button
                  onClick={() => { setViewMode('split'); setIsGraphFullscreen(false); }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    viewMode === 'split' ? 'bg-symtex-purple text-white' : 'text-gray-400 hover:text-white'
                  }`}
                  title="Split View"
                >
                  <SplitIcon />
                  <span className="text-sm font-medium hidden sm:inline">Split</span>
                </button>
                <button
                  onClick={() => { setViewMode('2d'); setIsGraphFullscreen(false); }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    viewMode === '2d' ? 'bg-symtex-purple text-white' : 'text-gray-400 hover:text-white'
                  }`}
                  title="Document View"
                >
                  <DocumentIcon />
                  <span className="text-sm font-medium hidden sm:inline">Documents</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Graph-only View */}
        {viewMode === '3d' && (
          <div className={`h-full relative ${isGraphFullscreen ? 'fixed inset-0 z-50 bg-gray-950' : ''}`}>
            <Graph3DVisualization
              nodes={graphNodes}
              selectedNode={selectedDocument}
              onNodeSelect={handleNodeSelect}
              isFullscreen={isGraphFullscreen}
            />

            {/* Selected Document Info Overlay */}
            {selectedDoc && (
              <div className="absolute bottom-4 right-4 w-80 bg-gray-900/95 backdrop-blur-sm rounded-xl border border-gray-800 p-4 shadow-xl">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${DOCUMENT_TYPE_CONFIG[selectedDoc.type].bgColor} ${DOCUMENT_TYPE_CONFIG[selectedDoc.type].color}`}>
                    {DOCUMENT_TYPE_CONFIG[selectedDoc.type].icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white truncate">{selectedDoc.title}</h4>
                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">{selectedDoc.excerpt}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span>{selectedDoc.connections} connections</span>
                      <span>{selectedDoc.size}</span>
                    </div>
                  </div>
                </div>
                <button className="w-full mt-3 py-2 bg-symtex-purple hover:bg-purple-600 text-white text-sm font-medium rounded-lg transition-colors">
                  Open Document
                </button>
              </div>
            )}

            {/* Exit fullscreen button */}
            {isGraphFullscreen && (
              <button
                onClick={() => setIsGraphFullscreen(false)}
                className="absolute top-4 right-4 p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors"
              >
                <CollapseIcon />
              </button>
            )}
          </div>
        )}

        {/* Document-only View */}
        {viewMode === '2d' && (
          <div className="h-full">
            <div className="max-w-4xl mx-auto h-full">
              <DocumentList
                documents={MOCK_DOCUMENTS}
                selectedId={selectedDocument}
                onSelect={setSelectedDocument}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            </div>
          </div>
        )}

        {/* Split View */}
        {viewMode === 'split' && (
          <div className="h-full flex">
            {/* Documents Panel */}
            <div className="w-[400px] xl:w-[450px] border-r border-gray-800 flex-shrink-0 bg-gray-900/30">
              <DocumentList
                documents={MOCK_DOCUMENTS}
                selectedId={selectedDocument}
                onSelect={setSelectedDocument}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                variant="compact"
              />
            </div>

            {/* Graph Panel */}
            <div className="flex-1 relative">
              <Graph3DVisualization
                nodes={graphNodes}
                selectedNode={selectedDocument}
                onNodeSelect={handleNodeSelect}
              />

              {/* Graph Legend */}
              <div className="absolute top-4 right-4 bg-gray-900/80 backdrop-blur-sm rounded-lg p-3 border border-gray-800">
                <p className="text-xs font-medium text-gray-400 mb-2">Document Types</p>
                <div className="space-y-1.5">
                  {Object.entries(DOCUMENT_TYPE_CONFIG).map(([type, config]) => (
                    <div key={type} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${config.bgColor}`} style={{ backgroundColor: type === 'pdf' ? '#EF4444' : type === 'note' ? '#F59E0B' : type === 'article' ? '#3B82F6' : type === 'research' ? '#8B5CF6' : type === 'image' ? '#22C55E' : '#EC4899' }} />
                      <span className="text-xs text-gray-400">{config.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected Document Details */}
              {selectedDoc && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[500px] max-w-[90%] bg-gray-900/95 backdrop-blur-sm rounded-xl border border-symtex-purple/50 p-4 shadow-xl shadow-symtex-purple/10">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${DOCUMENT_TYPE_CONFIG[selectedDoc.type].bgColor} ${DOCUMENT_TYPE_CONFIG[selectedDoc.type].color}`}>
                      {DOCUMENT_TYPE_CONFIG[selectedDoc.type].icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white">{selectedDoc.title}</h4>
                      <p className="text-sm text-gray-400 mt-1">{selectedDoc.excerpt}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <span className="text-xs text-gray-500">{selectedDoc.connections} connections</span>
                        <span className="text-xs text-gray-500">{selectedDoc.size}</span>
                        <span className="text-xs text-gray-500">by {selectedDoc.author}</span>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-symtex-purple hover:bg-purple-600 text-white text-sm font-medium rounded-lg transition-colors flex-shrink-0">
                      Open
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KnowledgePage;
