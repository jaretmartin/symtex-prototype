/**
 * Cognate SOPs Page
 *
 * Displays all SOPs for a specific Cognate with stats, filtering,
 * and management capabilities.
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Grid,
  List,
  ArrowLeft,
  Package,
  Sparkles,
  Filter,
} from 'lucide-react';
import { useCognateStore } from '@/store';
import { SOPStatsPanel, SOPListItem } from '@/components/sop';
import type { SOP, SOPStatus } from '@/types';

export function CognateSOPsPage(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    cognates,
    getCognateSOPs,
    getSOPStats,
    selectCognate,
    removeSOP,
    toggleSOPStatus,
    duplicateSOP,
    sopFilters,
    setSOPFilters,
    viewMode,
    setViewMode,
  } = useCognateStore();

  const [searchQuery, setSearchQuery] = useState(sopFilters.search);
  const [statusFilter, setStatusFilter] = useState<SOPStatus | 'all'>('all');

  // Find the cognate
  const cognate = cognates.find((c) => c.id === id);

  useEffect(() => {
    if (cognate) {
      selectCognate(cognate);
    }
  }, [cognate, selectCognate]);

  // Update filters when search changes
  useEffect(() => {
    setSOPFilters({ search: searchQuery });
  }, [searchQuery, setSOPFilters]);

  if (!cognate) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-medium text-foreground mb-2">Cognate Not Found</h2>
        <p className="text-muted-foreground mb-4">The requested cognate does not exist.</p>
        <Link
          to="/studio/cognates"
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Cognates
        </Link>
      </div>
    );
  }

  const sops = getCognateSOPs(id!);
  const stats = getSOPStats();

  // Apply local filters
  const filteredSOPs = sops.filter((sop) => {
    if (statusFilter !== 'all' && sop.status !== statusFilter) {
      return false;
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        sop.name.toLowerCase().includes(query) ||
        sop.description.toLowerCase().includes(query) ||
        sop.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }
    return true;
  });

  const handleEdit = (sop: SOP): void => {
    navigate(`/studio/cognates/${id}/sops/${sop.id}`);
  };

  const handleDelete = (sop: SOP): void => {
    if (confirm(`Are you sure you want to delete "${sop.name}"?`)) {
      removeSOP(sop.id);
    }
  };

  const handleDuplicate = (sop: SOP): void => {
    duplicateSOP(sop.id);
  };

  const handleToggleStatus = (sop: SOP): void => {
    toggleSOPStatus(sop.id);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/studio/cognates"
            className="p-2 hover:bg-card rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{cognate.name}</h1>
            <p className="text-muted-foreground mt-1">Manage SOPs for this Cognate</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/studio/cognates/${id}/bootstrap`}
            className="flex items-center gap-2 px-4 py-2 border border-border text-muted-foreground rounded-lg hover:bg-card transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Bootstrap
          </Link>
          <Link
            to={`/studio/cognates/${id}/packs`}
            className="flex items-center gap-2 px-4 py-2 border border-border text-muted-foreground rounded-lg hover:bg-card transition-colors"
          >
            <Package className="w-4 h-4" />
            Packs
          </Link>
          <Link
            to={`/studio/cognates/${id}/sops/new`}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-foreground rounded-lg hover:bg-blue-500 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New SOP
          </Link>
        </div>
      </div>

      {/* Stats Panel */}
      <SOPStatsPanel stats={stats} />

      {/* Filters */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search SOPs..."
              className="w-full pl-10 pr-4 py-2 bg-surface-base border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as SOPStatus | 'all')}
              className="px-3 py-2 bg-surface-base border border-border rounded-lg text-foreground text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 p-1 bg-surface-base border border-border rounded-lg">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded transition-colors ${
              viewMode === 'grid' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`p-2 rounded transition-colors ${
              viewMode === 'list' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SOP List */}
      {filteredSOPs.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-border rounded-lg">
          <h3 className="text-lg font-medium text-foreground mb-2">No SOPs Found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Create your first SOP or install a pack to get started'}
          </p>
          {!searchQuery && statusFilter === 'all' && (
            <div className="flex items-center justify-center gap-4">
              <Link
                to={`/studio/cognates/${id}/sops/new`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-foreground rounded-lg hover:bg-blue-500 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create SOP
              </Link>
              <Link
                to={`/studio/cognates/${id}/packs`}
                className="inline-flex items-center gap-2 px-4 py-2 border border-border text-muted-foreground rounded-lg hover:bg-card transition-colors"
              >
                <Package className="w-4 h-4" />
                Browse Packs
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'space-y-4'
          }
        >
          {filteredSOPs.map((sop) => (
            <SOPListItem
              key={sop.id}
              sop={sop}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CognateSOPsPage;
