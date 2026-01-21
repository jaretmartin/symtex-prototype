/**
 * Cognates Index Page
 *
 * Displays a list of all Cognates with filtering and search.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Brain,
  CheckCircle,
  Clock,
  Pause,
  Archive,
  MoreVertical,
  Edit,
  Trash2,
  FileText,
} from 'lucide-react';
import { useCognateStore } from '@/store';
import type { Cognate, CognateStatus } from '@/types';

const statusConfig: Record<CognateStatus, { label: string; color: string; icon: typeof CheckCircle }> = {
  draft: { label: 'Draft', color: 'bg-yellow-500/20 text-yellow-400', icon: Clock },
  active: { label: 'Active', color: 'bg-green-500/20 text-green-400', icon: CheckCircle },
  paused: { label: 'Paused', color: 'bg-orange-500/20 text-orange-400', icon: Pause },
  archived: { label: 'Archived', color: 'bg-muted/20 text-muted-foreground', icon: Archive },
};

interface CognateCardProps {
  cognate: Cognate;
  onEdit: (cognate: Cognate) => void;
  onDelete: (cognate: Cognate) => void;
}

function CognateCard({ cognate, onEdit, onDelete }: CognateCardProps): JSX.Element {
  const [showMenu, setShowMenu] = useState(false);
  const status = statusConfig[cognate.status];
  const StatusIcon = status.icon;

  return (
    <div className="p-5 bg-surface-base/50 border border-border rounded-lg hover:border-muted transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Brain className="w-6 h-6 text-foreground" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">{cognate.name}</h3>
            <p className="text-sm text-muted-foreground">{cognate.role || 'No role assigned'}</p>
          </div>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
          >
            <MoreVertical className="w-5 h-5 text-muted-foreground" />
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-full mt-1 z-20 w-40 py-1 bg-card border border-border rounded-lg shadow-xl">
                <button
                  type="button"
                  onClick={() => {
                    onEdit(cognate);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDelete(cognate);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-muted"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{cognate.description}</p>

      <div className="flex items-center gap-2 mb-4">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
          <StatusIcon className="w-3 h-3" />
          {status.label}
        </span>
        {cognate.industry && (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-card text-muted-foreground">
            {cognate.industry}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <FileText className="w-4 h-4" />
          <span>{cognate.activeSOPCount}/{cognate.sopCount} SOPs active</span>
        </div>

        <Link
          to={`/studio/cognates/${cognate.id}/sops`}
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          Manage SOPs
        </Link>
      </div>
    </div>
  );
}

export function CognatesPage(): JSX.Element {
  const { cognates, removeCognate } = useCognateStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CognateStatus | 'all'>('all');

  const filteredCognates = cognates.filter((cognate) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        cognate.name.toLowerCase().includes(query) ||
        cognate.description.toLowerCase().includes(query) ||
        cognate.tags.some((tag) => tag.toLowerCase().includes(query));
      if (!matchesSearch) return false;
    }

    // Status filter
    if (statusFilter !== 'all' && cognate.status !== statusFilter) {
      return false;
    }

    return true;
  });

  const handleEdit = (_cognate: Cognate): void => {
    // Navigate to edit page
    // Edit cognate: _cognate.id
  };

  const handleDelete = (cognate: Cognate): void => {
    if (confirm(`Are you sure you want to delete "${cognate.name}"?`)) {
      removeCognate(cognate.id);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Cognates</h1>
          <p className="text-muted-foreground mt-1">Manage your Cognates and their behaviors</p>
        </div>

        <Link
          to="/studio/cognates/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-foreground rounded-lg hover:bg-blue-500 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Cognate
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cognates..."
            className="w-full pl-10 pr-4 py-2 bg-surface-base border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-blue-500 focus:outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as CognateStatus | 'all')}
          className="px-4 py-2 bg-surface-base border border-border rounded-lg text-foreground focus:border-blue-500 focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="paused">Paused</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Cognate Grid */}
      {filteredCognates.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-border rounded-lg">
          <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Cognates Found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Create your first Cognate to get started'}
          </p>
          {!searchQuery && statusFilter === 'all' && (
            <Link
              to="/studio/cognates/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-foreground rounded-lg hover:bg-blue-500 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Cognate
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCognates.map((cognate) => (
            <CognateCard
              key={cognate.id}
              cognate={cognate}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CognatesPage;
