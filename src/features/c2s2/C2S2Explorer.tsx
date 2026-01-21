/**
 * C2S2Explorer Component
 *
 * Code-to-S1 (C2S2) browser showing side-by-side transformation
 * from source code to S1/Symtex Script output with line-by-line mapping.
 */

import { useState, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2,
  FileCode,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RefreshCcw,
  Maximize2,
  Settings,
  Eye,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';

// ============================================================================
// Types
// ============================================================================

type TransformationStatus = 'completed' | 'pending' | 'warning' | 'error';

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  status?: TransformationStatus;
}

interface CodeMapping {
  sourceLines: [number, number];
  s1Lines: [number, number];
  status: TransformationStatus;
  confidence: number;
}

interface TransformationSection {
  id: string;
  name: string;
  sourceCode: string;
  s1Output: string;
  mappings: CodeMapping[];
  status: TransformationStatus;
}

interface C2S2ExplorerProps {
  projectId?: string;
  className?: string;
}

// ============================================================================
// Mock Data
// ============================================================================

const mockFileTree: FileNode[] = [
  {
    id: 'src',
    name: 'src',
    type: 'folder',
    children: [
      {
        id: 'handlers',
        name: 'handlers',
        type: 'folder',
        children: [
          {
            id: 'support.js',
            name: 'support.js',
            type: 'file',
            status: 'completed',
          },
          {
            id: 'billing.js',
            name: 'billing.js',
            type: 'file',
            status: 'pending',
          },
          {
            id: 'auth.js',
            name: 'auth.js',
            type: 'file',
            status: 'warning',
          },
        ],
      },
      {
        id: 'utils',
        name: 'utils',
        type: 'folder',
        children: [
          {
            id: 'validation.js',
            name: 'validation.js',
            type: 'file',
            status: 'completed',
          },
          {
            id: 'format.js',
            name: 'format.js',
            type: 'file',
            status: 'completed',
          },
        ],
      },
      {
        id: 'index.js',
        name: 'index.js',
        type: 'file',
        status: 'pending',
      },
    ],
  },
  {
    id: 'tests',
    name: 'tests',
    type: 'folder',
    children: [
      {
        id: 'support.test.js',
        name: 'support.test.js',
        type: 'file',
        status: 'pending',
      },
    ],
  },
  {
    id: 'config.json',
    name: 'config.json',
    type: 'file',
    status: 'completed',
  },
];

const mockSourceCode = `// Customer Support Ticket Handler
// Handles incoming support tickets with priority routing

async function handleTicket(ticket, user) {
  // Validate ticket data
  if (!ticket.subject || !ticket.body) {
    throw new ValidationError('Missing required fields');
  }

  // Determine priority based on keywords
  const priority = calculatePriority(ticket);

  // Route to appropriate queue
  const queue = await routeToQueue(priority, user.tier);

  // Create audit entry
  await createAuditLog({
    action: 'ticket_created',
    ticketId: ticket.id,
    userId: user.id,
    priority,
    queue: queue.name
  });

  // Send confirmation to user
  await sendNotification(user.email, {
    template: 'ticket_received',
    data: { ticketId: ticket.id, queue: queue.name }
  });

  return { ticketId: ticket.id, queue, priority };
}

function calculatePriority(ticket) {
  const urgentKeywords = ['urgent', 'critical', 'down', 'emergency'];
  const text = (ticket.subject + ' ' + ticket.body).toLowerCase();

  for (const keyword of urgentKeywords) {
    if (text.includes(keyword)) return 'high';
  }

  return 'normal';
}

async function routeToQueue(priority, userTier) {
  if (priority === 'high' || userTier === 'enterprise') {
    return { name: 'priority', sla: '1h' };
  }
  return { name: 'standard', sla: '24h' };
}`;

const mockS1Output = `@namespace customer_support
@version 1.0
@description "Customer Support Ticket Handler - S1 Transformation"

# Rule: Handle incoming support ticket
@rule handle_ticket(ticket: Ticket, user: User) -> TicketResult
  @requires ticket.subject != null
  @requires ticket.body != null
  @audit action="ticket_created"

  # Step 1: Validate ticket data
  @validate ticket {
    subject: required,
    body: required
  } @on_fail throw ValidationError("Missing required fields")

  # Step 2: Calculate priority
  priority := @call calculate_priority(ticket)

  # Step 3: Route to queue
  queue := @call route_to_queue(priority, user.tier)
  @audit ticketId=ticket.id, userId=user.id, priority, queue=queue.name

  # Step 4: Send confirmation
  @notify user.email {
    template: "ticket_received",
    data: { ticketId: ticket.id, queue: queue.name }
  }

  @return { ticketId: ticket.id, queue, priority }
@end

# Rule: Calculate ticket priority from keywords
@rule calculate_priority(ticket: Ticket) -> Priority
  @const urgent_keywords = ["urgent", "critical", "down", "emergency"]

  text := lowercase(ticket.subject + " " + ticket.body)

  @for keyword in urgent_keywords {
    @if contains(text, keyword) {
      @return "high"
    }
  }

  @return "normal"
@end

# Rule: Route ticket to appropriate queue
@rule route_to_queue(priority: Priority, user_tier: Tier) -> Queue
  @if priority == "high" or user_tier == "enterprise" {
    @return { name: "priority", sla: "1h" }
  }
  @return { name: "standard", sla: "24h" }
@end`;

const mockMappings: CodeMapping[] = [
  { sourceLines: [4, 25], s1Lines: [5, 26], status: 'completed', confidence: 95 },
  { sourceLines: [27, 36], s1Lines: [28, 40], status: 'completed', confidence: 92 },
  { sourceLines: [38, 43], s1Lines: [42, 50], status: 'completed', confidence: 98 },
];

// ============================================================================
// Sub-components
// ============================================================================

interface FileTreeItemProps {
  node: FileNode;
  level: number;
  selectedFile: string | null;
  onSelect: (id: string) => void;
  expandedFolders: Set<string>;
  onToggleFolder: (id: string) => void;
}

const FileTreeItem = memo(function FileTreeItem({
  node,
  level,
  selectedFile,
  onSelect,
  expandedFolders,
  onToggleFolder,
}: FileTreeItemProps): JSX.Element {
  const isExpanded = expandedFolders.has(node.id);
  const isSelected = selectedFile === node.id;

  const getStatusIcon = (status?: TransformationStatus): JSX.Element | null => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-3 h-3 text-success" />;
      case 'pending':
        return <Clock className="w-3 h-3 text-muted-foreground" />;
      case 'warning':
        return <AlertTriangle className="w-3 h-3 text-warning" />;
      case 'error':
        return <AlertTriangle className="w-3 h-3 text-error" />;
      default:
        return null;
    }
  };

  if (node.type === 'folder') {
    return (
      <div>
        <button
          onClick={() => onToggleFolder(node.id)}
          className={cn(
            'w-full flex items-center gap-1.5 px-2 py-1 text-sm rounded-md',
            'hover:bg-muted/50 transition-colors text-left'
          )}
          style={{ paddingLeft: `${level * 12 + 8}px` }}
        >
          {isExpanded ? (
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
          )}
          {isExpanded ? (
            <FolderOpen className="w-4 h-4 text-symtex-accent" />
          ) : (
            <Folder className="w-4 h-4 text-symtex-accent" />
          )}
          <span className="text-foreground">{node.name}</span>
        </button>
        <AnimatePresence>
          {isExpanded && node.children && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {node.children.map((child) => (
                <FileTreeItem
                  key={child.id}
                  node={child}
                  level={level + 1}
                  selectedFile={selectedFile}
                  onSelect={onSelect}
                  expandedFolders={expandedFolders}
                  onToggleFolder={onToggleFolder}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <button
      onClick={() => onSelect(node.id)}
      className={cn(
        'w-full flex items-center gap-1.5 px-2 py-1 text-sm rounded-md',
        'hover:bg-muted/50 transition-colors text-left',
        isSelected && 'bg-symtex-primary/20 text-symtex-primary'
      )}
      style={{ paddingLeft: `${level * 12 + 24}px` }}
    >
      <FileCode className="w-4 h-4 text-muted-foreground" />
      <span className="flex-1 truncate">{node.name}</span>
      {getStatusIcon(node.status)}
    </button>
  );
});

interface CodePanelProps {
  title: string;
  code: string;
  language: 'javascript' | 's1';
  highlightedLines?: [number, number] | null;
  className?: string;
}

const CodePanel = memo(function CodePanel({
  title,
  code,
  language,
  highlightedLines,
  className,
}: CodePanelProps): JSX.Element {
  const lines = code.split('\n');

  const isLineHighlighted = (lineNum: number): boolean => {
    if (!highlightedLines) return false;
    return lineNum >= highlightedLines[0] && lineNum <= highlightedLines[1];
  };

  return (
    <div className={cn('flex flex-col h-full', className)}>
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {title}
        </span>
        <Badge variant="outline" className="text-[10px]">
          {language === 'javascript' ? 'JavaScript' : 'S1'}
        </Badge>
      </div>
      <div className="flex-1 overflow-auto">
        <pre className="p-3 text-xs font-mono leading-relaxed">
          {lines.map((line, idx) => (
            <div
              key={idx}
              className={cn(
                'flex',
                isLineHighlighted(idx + 1) && 'bg-symtex-primary/10 -mx-3 px-3'
              )}
            >
              <span className="w-8 text-right pr-3 text-muted-foreground/50 select-none">
                {idx + 1}
              </span>
              <code
                className={cn(
                  'flex-1',
                  language === 's1' && line.startsWith('@') && 'text-symtex-primary',
                  language === 's1' && line.startsWith('#') && 'text-muted-foreground italic',
                  language === 'javascript' && line.trim().startsWith('//') && 'text-muted-foreground italic',
                  language === 'javascript' && (line.includes('async') || line.includes('await') || line.includes('function')) && 'text-symtex-accent'
                )}
              >
                {line || ' '}
              </code>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
});

interface MappingIndicatorProps {
  mappings: CodeMapping[];
  onHover: (mapping: CodeMapping | null) => void;
}

const MappingIndicator = memo(function MappingIndicator({
  mappings,
  onHover,
}: MappingIndicatorProps): JSX.Element {
  return (
    <div className="w-12 flex flex-col items-center justify-center gap-2 border-x border-border bg-muted/20">
      {mappings.map((mapping, idx) => (
        <button
          key={idx}
          onMouseEnter={() => onHover(mapping)}
          onMouseLeave={() => onHover(null)}
          className={cn(
            'w-6 h-6 rounded-full flex items-center justify-center',
            'transition-all hover:scale-110',
            mapping.status === 'completed' && 'bg-success/20 text-success',
            mapping.status === 'pending' && 'bg-muted text-muted-foreground',
            mapping.status === 'warning' && 'bg-warning/20 text-warning'
          )}
          title={`${mapping.confidence}% confidence`}
        >
          <ArrowRight className="w-3 h-3" />
        </button>
      ))}
    </div>
  );
});

// ============================================================================
// Main Component
// ============================================================================

function C2S2Explorer({ projectId: _projectId, className }: C2S2ExplorerProps): JSX.Element {
  const [selectedFile, setSelectedFile] = useState<string | null>('support.js');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(['src', 'handlers'])
  );
  const [hoveredMapping, setHoveredMapping] = useState<CodeMapping | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleToggleFolder = useCallback((id: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    // Simulate refresh
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  }, []);

  const sourceHighlight = hoveredMapping?.sourceLines ?? null;
  const s1Highlight = hoveredMapping?.s1Lines ?? null;

  return (
    <div className={cn('flex flex-col h-full bg-card rounded-xl border border-border overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-symtex-primary" />
            <h2 className="text-sm font-semibold text-foreground">C2S2 Explorer</h2>
          </div>
          <Badge className="bg-symtex-accent/20 text-symtex-accent border-symtex-accent/30 text-[10px]">
            DEMO MODE
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            Project: <span className="text-foreground">Customer Support Automation</span>
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCcw className={cn('w-4 h-4', isRefreshing && 'animate-spin')} />
          </Button>
          <Button variant="ghost" size="icon-sm">
            <Maximize2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon-sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* File Tree */}
        <div className="w-52 border-r border-border flex flex-col">
          <div className="px-3 py-2 border-b border-border bg-muted/30">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              File Tree
            </span>
          </div>
          <div className="flex-1 overflow-auto py-2">
            {mockFileTree.map((node) => (
              <FileTreeItem
                key={node.id}
                node={node}
                level={0}
                selectedFile={selectedFile}
                onSelect={setSelectedFile}
                expandedFolders={expandedFolders}
                onToggleFolder={handleToggleFolder}
              />
            ))}
          </div>
          {/* File Stats */}
          <div className="p-3 border-t border-border bg-muted/20">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-success" />
                <span className="text-muted-foreground">4 Completed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-muted-foreground" />
                <span className="text-muted-foreground">3 Pending</span>
              </div>
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="w-3 h-3 text-warning" />
                <span className="text-muted-foreground">1 Warning</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Eye className="w-3 h-3 text-symtex-primary" />
                <span className="text-muted-foreground">1 Selected</span>
              </div>
            </div>
          </div>
        </div>

        {/* Code Panels */}
        <div className="flex-1 flex">
          {/* Source Code */}
          <CodePanel
            title="Source Code"
            code={mockSourceCode}
            language="javascript"
            highlightedLines={sourceHighlight}
            className="flex-1"
          />

          {/* Mapping Indicators */}
          <MappingIndicator
            mappings={mockMappings}
            onHover={setHoveredMapping}
          />

          {/* S1 Output */}
          <CodePanel
            title="S1 Output"
            code={mockS1Output}
            language="s1"
            highlightedLines={s1Highlight}
            className="flex-1"
          />
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/20 text-xs">
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground">
            <span className="text-foreground font-medium">3</span> mappings detected
          </span>
          <span className="text-muted-foreground">
            Avg. confidence: <span className="text-success font-medium">95%</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          {hoveredMapping && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-muted-foreground"
            >
              Lines {hoveredMapping.sourceLines[0]}-{hoveredMapping.sourceLines[1]} →{' '}
              Lines {hoveredMapping.s1Lines[0]}-{hoveredMapping.s1Lines[1]}
              <span className="ml-2 text-symtex-primary">
                ({hoveredMapping.confidence}% confidence)
              </span>
            </motion.span>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(C2S2Explorer);
export type { C2S2ExplorerProps, FileNode, CodeMapping, TransformationSection };
