/**
 * NEXIS Network Page
 *
 * Displays the NEXIS relationship graph with contact cards and insight panels.
 * Supports creating automations from insights and sending entities to Symbios.
 */

import { useState, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Network,
  Search,
  Filter,
  User,
  Building2,
  Hash,
  Calendar,
  Sparkles,
  X,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  NexisGraph,
  NexisContactCard,
  NexisInsightPanel,
  useNexisStore,
  type NexisNodeType,
} from '@/features/nexis';

// Budget utility function (mock implementation)
function getMockBudgetStatus(): { percentUsed: number; totalSpent: number; totalAllocated: number } {
  // In production, this would come from a store or API
  return {
    percentUsed: 0.65, // 65% used
    totalSpent: 2300.90,
    totalAllocated: 3500,
  };
}

interface BudgetWarningModalProps {
  isOpen: boolean;
  percentUsed: number;
  onClose: () => void;
  onProceed: () => void;
}

function BudgetWarningModal({ isOpen, percentUsed, onClose, onProceed }: BudgetWarningModalProps): JSX.Element | null {
  if (!isOpen) return null;

  const isBlocked = percentUsed >= 0.95;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-xl shadow-2xl max-w-md w-full mx-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={cn(
              'p-3 rounded-xl',
              isBlocked ? 'bg-red-500/20' : 'bg-yellow-500/20'
            )}>
              <AlertTriangle className={cn(
                'w-6 h-6',
                isBlocked ? 'text-red-400' : 'text-yellow-400'
              )} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground">
                {isBlocked ? 'Budget Exceeded' : 'Budget Warning'}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {isBlocked ? (
                  `Your AI budget is ${(percentUsed * 100).toFixed(0)}% used. You cannot run new automations until the budget resets or is increased.`
                ) : (
                  `Your AI budget is ${(percentUsed * 100).toFixed(0)}% used. Running this automation may exceed your budget limit.`
                )}
              </p>
            </div>
          </div>

          <div className="mt-6 flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {isBlocked ? 'Close' : 'Cancel'}
            </button>
            {!isBlocked && (
              <button
                onClick={onProceed}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-colors"
              >
                Proceed Anyway
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const nodeTypeFilters: { type: NexisNodeType; label: string; icon: typeof User }[] = [
  { type: 'person', label: 'People', icon: User },
  { type: 'company', label: 'Companies', icon: Building2 },
  { type: 'topic', label: 'Topics', icon: Hash },
  { type: 'event', label: 'Events', icon: Calendar },
];

export default function NexisPage(): JSX.Element {
  const navigate = useNavigate();
  // searchParams can be used for deep linking (e.g., ?entity=person-1)
  const [_searchParams] = useSearchParams();

  const {
    nodes,
    edges,
    insights,
    selectedNodeId,
    filterTypes,
    searchQuery,
    selectNode,
    setFilterTypes,
    setSearchQuery,
    getNodeEdges,
  } = useNexisStore();

  const [showFilters, setShowFilters] = useState(false);
  const [budgetWarning, setBudgetWarning] = useState<{ show: boolean; insightId: string | null; percentUsed: number }>({
    show: false,
    insightId: null,
    percentUsed: 0,
  });

  // Get selected node details
  const selectedNode = useMemo(() => {
    if (!selectedNodeId) return null;
    return nodes.find((n) => n.id === selectedNodeId) || null;
  }, [nodes, selectedNodeId]);

  const selectedNodeEdges = useMemo(() => {
    if (!selectedNodeId) return [];
    return getNodeEdges(selectedNodeId);
  }, [selectedNodeId, getNodeEdges]);

  // Handle creating automation from insight
  const handleCreateAutomation = useCallback((insightId: string) => {
    const budget = getMockBudgetStatus();

    if (budget.percentUsed >= 0.80) {
      // Show warning if near or over budget
      setBudgetWarning({
        show: true,
        insightId,
        percentUsed: budget.percentUsed,
      });
    } else {
      // Navigate directly to LUX builder with insight context
      navigate(`/control/lux?from=nexis&insight=${insightId}`);
    }
  }, [navigate]);

  // Handle proceeding after budget warning
  const handleProceedWithAutomation = useCallback(() => {
    if (budgetWarning.insightId) {
      navigate(`/control/lux?from=nexis&insight=${budgetWarning.insightId}`);
    }
    setBudgetWarning({ show: false, insightId: null, percentUsed: 0 });
  }, [budgetWarning.insightId, navigate]);

  // Handle closing budget warning
  const handleCloseBudgetWarning = useCallback(() => {
    setBudgetWarning({ show: false, insightId: null, percentUsed: 0 });
  }, []);

  // Handle sending entity to Symbios
  const handleSendToSymbios = useCallback((entityId: string) => {
    navigate(`/symbios?context=nexis&entity=${entityId}`);
  }, [navigate]);

  // Handle insight click
  const handleInsightClick = useCallback((insight: { id: string; relatedNodes: string[] }) => {
    // Select first related node if available
    if (insight.relatedNodes.length > 0) {
      selectNode(insight.relatedNodes[0]);
    }
  }, [selectNode]);

  // Handle node selection from graph
  const handleNodeSelect = useCallback((nodeId: string | null) => {
    selectNode(nodeId);
  }, [selectNode]);

  // Handle filter toggle
  const handleFilterToggle = useCallback((type: NexisNodeType) => {
    const newFilters = filterTypes.includes(type)
      ? filterTypes.filter((t) => t !== type)
      : [...filterTypes, type];
    setFilterTypes(newFilters);
  }, [filterTypes, setFilterTypes]);

  return (
    <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-border bg-background/80 backdrop-blur-xl z-40 flex-shrink-0">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-symtex-primary/20">
                <Network className="w-6 h-6 text-symtex-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  NEXIS Network
                </h1>
                <p className="text-muted-foreground text-sm mt-0.5">
                  {nodes.length} entities | {edges.length} connections | {insights.length} insights
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search network..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 bg-surface-card/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-symtex-primary focus:ring-1 focus:ring-symtex-primary transition-all text-sm"
                />
              </div>

              {/* Filter button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  'p-2 rounded-lg border transition-colors',
                  showFilters
                    ? 'bg-symtex-primary/20 border-symtex-primary text-symtex-primary'
                    : 'border-border text-muted-foreground hover:text-foreground hover:border-symtex-primary/50'
                )}
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filter pills */}
          {showFilters && (
            <div className="mt-4 flex items-center gap-2 animate-in slide-in-from-top-2 duration-200">
              <span className="text-sm text-muted-foreground mr-2">Show:</span>
              {nodeTypeFilters.map(({ type, label, icon: Icon }) => (
                <button
                  key={type}
                  onClick={() => handleFilterToggle(type)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors',
                    filterTypes.includes(type)
                      ? 'bg-symtex-primary/20 text-symtex-primary border border-symtex-primary/50'
                      : 'bg-muted/50 text-muted-foreground border border-transparent hover:border-border'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Graph Area */}
        <div className="flex-1 relative">
          <NexisGraph
            onNodeSelect={handleNodeSelect}
            className="w-full h-full"
          />
        </div>

        {/* Right Sidebar */}
        <div className="w-[380px] border-l border-border flex flex-col bg-background/50 backdrop-blur-sm">
          {selectedNode ? (
            <>
              {/* Selected Entity Header */}
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <User className="w-4 h-4 text-symtex-primary" />
                  Selected Entity
                </h3>
                <button
                  onClick={() => selectNode(null)}
                  className="p-1 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Contact Card */}
              <div className="flex-1 overflow-y-auto">
                <NexisContactCard
                  node={selectedNode}
                  edges={selectedNodeEdges}
                  onMessage={(nodeId) => handleSendToSymbios(nodeId)}
                  className="rounded-none border-0"
                />

                {/* Actions for selected entity */}
                <div className="p-4 border-t border-border">
                  <button
                    onClick={() => handleSendToSymbios(selectedNode.id)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-symtex-primary/20 text-symtex-primary hover:bg-symtex-primary/30 transition-colors text-sm font-medium"
                  >
                    <Sparkles className="w-4 h-4" />
                    Send to Symbios
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Insights Panel */}
              <NexisInsightPanel
                insights={insights}
                onInsightClick={handleInsightClick}
                onCreateAutomation={handleCreateAutomation}
                onSendToSymbios={handleSendToSymbios}
                className="flex-1 rounded-none border-0 overflow-hidden"
              />
            </>
          )}
        </div>
      </div>

      {/* Budget Warning Modal */}
      <BudgetWarningModal
        isOpen={budgetWarning.show}
        percentUsed={budgetWarning.percentUsed}
        onClose={handleCloseBudgetWarning}
        onProceed={handleProceedWithAutomation}
      />
    </div>
  );
}
