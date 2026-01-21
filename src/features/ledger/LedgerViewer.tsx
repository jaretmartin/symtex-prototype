/**
 * LedgerViewer Component
 *
 * Main browser for the audit ledger with:
 * - Filterable by date, category, Cognate
 * - Search functionality
 * - Pagination
 * - List and Timeline view modes
 */

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  List,
  Clock,
  ChevronLeft,
  ChevronRight,
  RefreshCcw,
  Download,
  FileText,
} from 'lucide-react';
import { useLedgerStore } from './ledger-store';
import { LedgerEntry } from './LedgerEntry';
import { LedgerTimeline } from './LedgerTimeline';
import { LedgerFilters } from './LedgerFilters';
import { EvidencePanel } from './EvidencePanel';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface LedgerViewerProps {
  className?: string;
}

type ViewMode = 'list' | 'timeline';

export function LedgerViewer({ className }: LedgerViewerProps) {
  const {
    entries,
    selectedEntry,
    filters,
    pagination,
    isLoading,
    isEvidencePanelOpen,
    setFilters,
    resetFilters,
    setPage,
    setPageSize,
    selectEntry,
    closeEvidencePanel,
    loadMockData,
    getFilteredEntries,
    getPaginatedEntries,
  } = useLedgerStore();

  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load mock data on mount
  useEffect(() => {
    loadMockData();
  }, [loadMockData]);

  const filteredEntries = getFilteredEntries();
  const paginatedEntries = getPaginatedEntries();
  const totalPages = Math.ceil(filteredEntries.length / pagination.pageSize);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    loadMockData();
    setIsRefreshing(false);
  };

  const handleExport = () => {
    // In production, this would export data
    // Exporting ledger data...
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  if (isLoading) {
    return (
      <div className={cn('p-6', className)}>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="h-12 bg-muted rounded" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Audit Ledger</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Complete audit trail using the 6 W's framework
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-card rounded-lg p-1 border border-border">
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors',
                viewMode === 'list'
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <List className="w-4 h-4" />
              List
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors',
                viewMode === 'timeline'
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Clock className="w-4 h-4" />
              Timeline
            </button>
          </div>

          {/* Action Buttons */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
            title="Refresh"
            aria-label="Refresh ledger data"
          >
            <RefreshCcw className={cn('w-4 h-4', isRefreshing && 'animate-spin')} />
          </button>
          <button
            onClick={handleExport}
            className="p-2 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Export"
            aria-label="Export ledger data"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <LedgerFilters
        filters={filters}
        onFiltersChange={setFilters}
        onReset={resetFilters}
        totalCount={entries.length}
        filteredCount={filteredEntries.length}
        className="mb-6"
      />

      {/* Content */}
      <div className="flex-1 overflow-hidden flex">
        <div
          className={cn(
            'flex-1 overflow-y-auto pr-2',
            isEvidencePanelOpen && 'mr-[480px]'
          )}
        >
          {filteredEntries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FileText className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No entries found</h3>
              <p className="text-muted-foreground max-w-md">
                {entries.length === 0
                  ? 'The ledger is empty. Actions will be recorded here as they occur.'
                  : 'No entries match your current filters. Try adjusting your search criteria.'}
              </p>
              {entries.length > 0 && (
                <button
                  onClick={resetFilters}
                  className="mt-4 px-4 py-2 bg-indigo-500 text-foreground rounded-lg hover:bg-indigo-600 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : viewMode === 'list' ? (
            <>
              {/* List View */}
              <div className="space-y-3">
                {paginatedEntries.map((entry) => (
                  <LedgerEntry
                    key={entry.id}
                    entry={entry}
                    isSelected={selectedEntry?.id === entry.id}
                    onSelect={selectEntry}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">Rows per page:</span>
                    <Select
                      value={pagination.pageSize.toString()}
                      onValueChange={(value) => setPageSize(parseInt(value))}
                    >
                      <SelectTrigger className="w-[70px] bg-card border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Page {pagination.page} of {totalPages}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="p-1.5 rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Previous page"
                      >
                        <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === totalPages}
                        className="p-1.5 rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Next page"
                      >
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Timeline View */
            <LedgerTimeline
              entries={filteredEntries}
              selectedEntryId={selectedEntry?.id}
              onSelectEntry={selectEntry}
            />
          )}
        </div>

        {/* Evidence Panel */}
        <EvidencePanel
          entry={selectedEntry}
          isOpen={isEvidencePanelOpen}
          onClose={closeEvidencePanel}
        />
      </div>

      {/* Summary Bar */}
      <div className="mt-4 p-4 rounded-lg bg-card/50 border border-border flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Entries</p>
            <p className="text-lg font-semibold text-foreground">{entries.length}</p>
          </div>
          <div className="w-px h-8 bg-muted" />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Filtered</p>
            <p className="text-lg font-semibold text-foreground">{filteredEntries.length}</p>
          </div>
          <div className="w-px h-8 bg-muted" />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Flagged</p>
            <p className="text-lg font-semibold text-amber-400">
              {entries.filter((e) => e.isFlagged).length}
            </p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Showing entries from the last 7 days. All entries are cryptographically verified.
        </p>
      </div>
    </div>
  );
}

export default LedgerViewer;
