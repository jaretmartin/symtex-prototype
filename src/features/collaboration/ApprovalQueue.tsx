/**
 * ApprovalQueue Component
 *
 * Full-page list of all pending approvals with:
 * - Sortable by priority, date, Cognate
 * - Batch actions (approve all safe)
 * - Filtering capabilities
 * - ApprovalCard integration
 */

import { useState, useMemo, useEffect } from 'react';
import {
  ClipboardList,
  Filter,
  SortAsc,
  SortDesc,
  CheckCheck,
  RefreshCw,
  Search,
  X,
  Brain,
} from 'lucide-react';
import clsx from 'clsx';
import {
  useCollaborationStore,
  type ApprovalPriority,
  type ApprovalType,
} from './collaboration-store';
import { ApprovalCard } from './ApprovalCard';

interface ApprovalQueueProps {
  className?: string;
}

type SortField = 'priority' | 'date' | 'cognate' | 'type';
type SortDirection = 'asc' | 'desc';
type FilterStatus = 'all' | 'pending' | 'approved' | 'rejected';

const priorityOrder: Record<ApprovalPriority, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

const typeLabels: Record<ApprovalType, string> = {
  email: 'Email',
  document: 'Document',
  action: 'Action',
  purchase: 'Purchase',
  meeting: 'Meeting',
};

export function ApprovalQueue({ className }: ApprovalQueueProps): JSX.Element {
  const {
    pendingApprovals,
    loadMockData,
    isLoading,
    approveItem,
    rejectItem,
    batchApprove,
    rerunApprovedItem,
  } = useCollaborationStore();

  // Local state
  const [sortField, setSortField] = useState<SortField>('priority');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('pending');
  const [filterCognate, setFilterCognate] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<ApprovalType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (pendingApprovals.length === 0) {
      loadMockData();
    }
  }, [pendingApprovals.length, loadMockData]);

  // Get unique Cognates for filter
  const uniqueCognates = useMemo(() => {
    const cognates = new Map<string, string>();
    pendingApprovals.forEach((a) => {
      cognates.set(a.cognateId, a.cognateName);
    });
    return Array.from(cognates.entries());
  }, [pendingApprovals]);

  // Filter and sort approvals
  const filteredApprovals = useMemo(() => {
    let result = [...pendingApprovals];

    // Status filter
    if (filterStatus !== 'all') {
      result = result.filter((a) => a.status === filterStatus);
    }

    // Cognate filter
    if (filterCognate) {
      result = result.filter((a) => a.cognateId === filterCognate);
    }

    // Type filter
    if (filterType) {
      result = result.filter((a) => a.type === filterType);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(query) ||
          a.description.toLowerCase().includes(query) ||
          a.cognateName.toLowerCase().includes(query)
      );
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'priority':
          comparison = priorityOrder[a.riskLevel] - priorityOrder[b.riskLevel];
          break;
        case 'date':
          comparison =
            new Date(a.requestedAt).getTime() - new Date(b.requestedAt).getTime();
          break;
        case 'cognate':
          comparison = a.cognateName.localeCompare(b.cognateName);
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
      }

      return sortDirection === 'desc' ? -comparison : comparison;
    });

    return result;
  }, [
    pendingApprovals,
    filterStatus,
    filterCognate,
    filterType,
    searchQuery,
    sortField,
    sortDirection,
  ]);

  // Get low-risk pending items for batch approve
  const lowRiskPending = useMemo(() => {
    return pendingApprovals.filter(
      (a) => a.status === 'pending' && (a.riskLevel === 'low' || a.riskLevel === 'medium')
    );
  }, [pendingApprovals]);

  const handleSortChange = (field: SortField): void => {
    if (sortField === field) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleBatchApproveSafe = (): void => {
    const lowRiskIds = lowRiskPending.map((a) => a.id);
    batchApprove(lowRiskIds);
  };

  const handleApprove = (id: string): void => {
    approveItem(id);
  };

  const handleReject = (id: string, reason?: string): void => {
    rejectItem(id, reason);
  };

  const handleModify = (_id: string): void => {
    // Would open edit modal - placeholder for now
    // Edit approval: _id
  };

  const handleRerun = (id: string): void => {
    rerunApprovedItem(id);
    // In a real implementation, this would trigger the actual rerun
    // and update the UI to show progress
  };

  const clearFilters = (): void => {
    setFilterStatus('pending');
    setFilterCognate(null);
    setFilterType(null);
    setSearchQuery('');
  };

  const hasActiveFilters =
    filterStatus !== 'pending' || filterCognate || filterType || searchQuery;

  return (
    <div className={clsx('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-symtex-primary" />
            Approval Queue
          </h1>
          <p className="text-muted-foreground mt-1">
            Review and approve Cognate actions requiring human oversight
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Batch Approve Safe */}
          {lowRiskPending.length > 0 && (
            <button
              onClick={handleBatchApproveSafe}
              className={clsx(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium',
                'bg-green-500/20 border border-green-500/30 text-green-400',
                'hover:bg-green-500/30 hover:border-green-500/50',
                'transition-colors'
              )}
            >
              <CheckCheck className="w-4 h-4" />
              Approve {lowRiskPending.length} Safe
            </button>
          )}

          {/* Refresh */}
          <button
            onClick={() => loadMockData()}
            disabled={isLoading}
            className={clsx(
              'p-2 rounded-lg border border-border text-muted-foreground',
              'hover:border-border hover:text-foreground hover:bg-card/50',
              'transition-colors disabled:opacity-50'
            )}
          >
            <RefreshCw className={clsx('w-4 h-4', isLoading && 'animate-spin')} />
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-surface-base/50 border border-border rounded-lg p-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <label htmlFor="approval-search" className="sr-only">
              Search approvals
            </label>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              id="approval-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search approvals..."
              className={clsx(
                'w-full pl-10 pr-4 py-2 rounded-lg bg-card border border-border',
                'text-foreground placeholder-zinc-500 text-sm',
                'focus:outline-none focus:border-symtex-primary focus:ring-1 focus:ring-symtex-primary'
              )}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort:</span>
            {(['priority', 'date', 'cognate', 'type'] as SortField[]).map((field) => (
              <button
                key={field}
                onClick={() => handleSortChange(field)}
                className={clsx(
                  'px-3 py-1.5 rounded text-sm capitalize',
                  sortField === field
                    ? 'bg-symtex-primary/20 text-symtex-primary border border-symtex-primary/30'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card'
                )}
              >
                {field}
                {sortField === field && (
                  sortDirection === 'desc' ? (
                    <SortDesc className="w-3 h-3 inline ml-1" />
                  ) : (
                    <SortAsc className="w-3 h-3 inline ml-1" />
                  )
                )}
              </button>
            ))}
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={clsx(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm',
              showFilters || hasActiveFilters
                ? 'bg-symtex-primary/20 text-symtex-primary border border-symtex-primary/30'
                : 'text-muted-foreground hover:text-foreground hover:bg-card border border-border'
            )}
          >
            <Filter className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-symtex-primary" />
            )}
          </button>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-border flex flex-wrap items-center gap-4">
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Status:</span>
              {(['pending', 'approved', 'rejected', 'all'] as FilterStatus[]).map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={clsx(
                      'px-2 py-1 rounded text-xs capitalize',
                      filterStatus === status
                        ? 'bg-muted text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {status}
                  </button>
                )
              )}
            </div>

            {/* Cognate Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Cognate:</span>
              <select
                value={filterCognate || ''}
                onChange={(e) => setFilterCognate(e.target.value || null)}
                className={clsx(
                  'px-2 py-1 rounded text-sm bg-card border border-border',
                  'text-muted-foreground focus:outline-none focus:border-symtex-primary'
                )}
              >
                <option value="">All Cognates</option>
                {uniqueCognates.map(([id, name]) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Type:</span>
              <select
                value={filterType || ''}
                onChange={(e) =>
                  setFilterType((e.target.value as ApprovalType) || null)
                }
                className={clsx(
                  'px-2 py-1 rounded text-sm bg-card border border-border',
                  'text-muted-foreground focus:outline-none focus:border-symtex-primary'
                )}
              >
                <option value="">All Types</option>
                {Object.entries(typeLabels).map(([type, label]) => (
                  <option key={type} value={type}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Showing <strong className="text-foreground">{filteredApprovals.length}</strong>{' '}
          {filteredApprovals.length === 1 ? 'approval' : 'approvals'}
          {hasActiveFilters && ' (filtered)'}
        </span>
        {pendingApprovals.filter((a) => a.status === 'pending').length > 0 && (
          <span className="text-amber-400">
            {pendingApprovals.filter((a) => a.status === 'pending').length} pending
          </span>
        )}
      </div>

      {/* Approvals List */}
      <div className="space-y-4">
        {filteredApprovals.map((approval) => (
          <ApprovalCard
            key={approval.id}
            approval={approval}
            onApprove={handleApprove}
            onReject={handleReject}
            onModify={handleModify}
            onRerun={handleRerun}
          />
        ))}

        {filteredApprovals.length === 0 && (
          <div className="bg-surface-base/50 border border-border rounded-lg p-12 text-center">
            {hasActiveFilters ? (
              <>
                <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No matching approvals
                </h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters to see more results
                </p>
                <button
                  onClick={clearFilters}
                  className="text-symtex-primary hover:underline"
                >
                  Clear all filters
                </button>
              </>
            ) : (
              <>
                <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">All caught up!</h3>
                <p className="text-muted-foreground">
                  No pending approvals from your Cognates
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ApprovalQueue;
