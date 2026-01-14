/**
 * SOP List Item Component
 *
 * Rich list item displaying SOP details including status badge,
 * priority indicator, validation status, and action menu.
 */

import { useState } from 'react';
import {
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
  CheckCircle,
  Clock,
  Tag,
  GitBranch,
  Zap,
} from 'lucide-react';
import type { SOP, SOPPriority } from '@/types';

export interface SOPListItemProps {
  sop: SOP;
  onEdit?: (sop: SOP) => void;
  onDelete?: (sop: SOP) => void;
  onDuplicate?: (sop: SOP) => void;
  onToggleStatus?: (sop: SOP) => void;
  className?: string;
}

const priorityColors: Record<SOPPriority, string> = {
  low: 'bg-zinc-500/20 text-zinc-400',
  medium: 'bg-blue-500/20 text-blue-400',
  high: 'bg-orange-500/20 text-orange-400',
  critical: 'bg-red-500/20 text-red-400',
};

const statusConfig = {
  draft: { label: 'Draft', color: 'bg-yellow-500/20 text-yellow-400', icon: Clock },
  active: { label: 'Active', color: 'bg-green-500/20 text-green-400', icon: CheckCircle },
  archived: { label: 'Archived', color: 'bg-zinc-500/20 text-zinc-400', icon: Clock },
};

export function SOPListItem({
  sop,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleStatus,
  className = '',
}: SOPListItemProps): JSX.Element {
  const [showMenu, setShowMenu] = useState(false);

  const status = statusConfig[sop.status];
  const StatusIcon = status.icon;

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      className={`
        relative p-4 rounded-lg border border-zinc-800 bg-zinc-900/50
        hover:bg-zinc-800/50 hover:border-zinc-700
        transition-all duration-200
        ${className}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-medium text-white truncate">{sop.name}</h3>
            {!sop.isValid && (
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            )}
          </div>
          <p className="text-sm text-zinc-400 line-clamp-2">{sop.description}</p>
        </div>

        {/* Actions Menu */}
        <div className="relative flex-shrink-0">
          <button
            type="button"
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded-lg hover:bg-zinc-700 transition-colors"
          >
            <MoreVertical className="w-5 h-5 text-zinc-400" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-full mt-1 z-20 w-48 py-1 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl">
                {onEdit && (
                  <button
                    type="button"
                    onClick={() => {
                      onEdit(sop);
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-700 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit SOP
                  </button>
                )}
                {onDuplicate && (
                  <button
                    type="button"
                    onClick={() => {
                      onDuplicate(sop);
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-700 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    Duplicate
                  </button>
                )}
                {onToggleStatus && (
                  <button
                    type="button"
                    onClick={() => {
                      onToggleStatus(sop);
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-700 transition-colors"
                  >
                    {sop.status === 'active' ? (
                      <>
                        <ToggleLeft className="w-4 h-4" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <ToggleRight className="w-4 h-4" />
                        Activate
                      </>
                    )}
                  </button>
                )}
                {onDelete && (
                  <>
                    <div className="my-1 border-t border-zinc-700" />
                    <button
                      type="button"
                      onClick={() => {
                        onDelete(sop);
                        setShowMenu(false);
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-zinc-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2 mt-3">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
          <StatusIcon className="w-3 h-3" />
          {status.label}
        </span>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[sop.priority]}`}>
          {sop.priority.charAt(0).toUpperCase() + sop.priority.slice(1)}
        </span>
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-zinc-700 text-zinc-300">
          v{sop.version}
        </span>
      </div>

      {/* Tags */}
      {sop.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mt-3">
          <Tag className="w-3.5 h-3.5 text-zinc-500" />
          {sop.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded text-xs bg-zinc-800 text-zinc-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Metadata */}
      <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-zinc-800 text-xs text-zinc-500">
        <span className="flex items-center gap-1">
          <GitBranch className="w-3.5 h-3.5" />
          {sop.rules.length} rule{sop.rules.length !== 1 ? 's' : ''}
        </span>
        <span className="flex items-center gap-1">
          <Zap className="w-3.5 h-3.5" />
          {sop.triggerCount.toLocaleString()} triggers
        </span>
        <span>Last triggered: {formatDate(sop.lastTriggeredAt)}</span>
      </div>

      {/* Validation Errors */}
      {!sop.isValid && sop.validationErrors && sop.validationErrors.length > 0 && (
        <div className="mt-3 p-2 rounded bg-red-500/10 border border-red-500/20">
          <p className="text-xs text-red-400 font-medium mb-1">Validation Errors:</p>
          <ul className="text-xs text-red-300 space-y-0.5">
            {sop.validationErrors.map((error, index) => (
              <li key={index}>- {error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SOPListItem;
