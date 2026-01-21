/**
 * LedgerEntry Component
 *
 * Displays a single ledger entry with the 6 W's:
 * - WHO: User, Cognate, or System
 * - WHAT: Action description
 * - WHEN: Timestamp
 * - WHERE: Space/Project context
 * - WHY: Policy/rule that triggered
 * - HOW: Symbolic/Neural, pattern ID, steps
 */

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Bot,
  Server,
  Zap,
  Link2,
  ChevronDown,
  ChevronRight,
  Clock,
  MapPin,
  HelpCircle,
  Wrench,
  Flag,
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
  AlertCircle,
} from 'lucide-react';
import type { LedgerEntry as LedgerEntryType, LedgerCategory, LedgerSeverity, ActorType } from '@/types';

interface LedgerEntryProps {
  entry: LedgerEntryType;
  isSelected?: boolean;
  onSelect?: (entry: LedgerEntryType) => void;
  expanded?: boolean;
  className?: string;
}

// Actor type configuration
const actorConfig: Record<ActorType, { icon: typeof User; color: string; bg: string }> = {
  user: { icon: User, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  cognate: { icon: Bot, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  system: { icon: Server, color: 'text-muted-foreground', bg: 'bg-muted/10' },
  automation: { icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  integration: { icon: Link2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
};

// Category configuration
const categoryConfig: Record<LedgerCategory, { label: string; color: string }> = {
  action: { label: 'Action', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  decision: { label: 'Decision', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
  approval: { label: 'Approval', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  escalation: { label: 'Escalation', color: 'bg-orange-500/10 text-orange-400 border-orange-500/30' },
  error: { label: 'Error', color: 'bg-red-500/10 text-red-400 border-red-500/30' },
  access: { label: 'Access', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' },
  change: { label: 'Change', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' },
  creation: { label: 'Creation', color: 'bg-green-500/10 text-green-400 border-green-500/30' },
  deletion: { label: 'Deletion', color: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
  communication: { label: 'Communication', color: 'bg-violet-500/10 text-violet-400 border-violet-500/30' },
  integration: { label: 'Integration', color: 'bg-teal-500/10 text-teal-400 border-teal-500/30' },
  system: { label: 'System', color: 'bg-muted/10 text-muted-foreground border-border/30' },
};

// Severity configuration
const severityConfig: Record<LedgerSeverity, { icon: typeof Info; color: string }> = {
  debug: { icon: Info, color: 'text-muted-foreground' },
  info: { icon: Info, color: 'text-blue-400' },
  notice: { icon: AlertCircle, color: 'text-cyan-400' },
  warning: { icon: AlertTriangle, color: 'text-yellow-400' },
  error: { icon: XCircle, color: 'text-red-400' },
  critical: { icon: AlertTriangle, color: 'text-red-500' },
};

// Status configuration
const statusConfig: Record<string, { icon: typeof CheckCircle2; color: string }> = {
  initiated: { icon: Clock, color: 'text-muted-foreground' },
  in_progress: { icon: Clock, color: 'text-blue-400' },
  completed: { icon: CheckCircle2, color: 'text-emerald-400' },
  failed: { icon: XCircle, color: 'text-red-400' },
  cancelled: { icon: XCircle, color: 'text-muted-foreground' },
};

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export function LedgerEntry({
  entry,
  isSelected,
  onSelect,
  expanded: initialExpanded = false,
  className,
}: LedgerEntryProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  const actor = actorConfig[entry.who.type];
  const ActorIcon = actor.icon;
  const category = categoryConfig[entry.what.category];
  const severity = severityConfig[entry.what.severity];
  const SeverityIcon = severity.icon;
  const status = statusConfig[entry.what.status];
  const StatusIcon = status.icon;

  const handleClick = () => {
    onSelect?.(entry);
  };

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={cn(
        'border rounded-lg transition-all duration-200',
        isSelected
          ? 'border-indigo-500/50 bg-indigo-500/5'
          : 'border-border/50 bg-card/30 hover:border-border/50 hover:bg-card/50',
        entry.isFlagged && 'border-l-2 border-l-amber-500',
        className
      )}
    >
      {/* Main Row */}
      <div
        className="p-4 cursor-pointer"
        onClick={handleClick}
      >
        <div className="flex items-start gap-3">
          {/* Expand Toggle */}
          <button
            onClick={handleToggleExpand}
            className="p-1 rounded hover:bg-muted/50 transition-colors mt-0.5"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
          </button>

          {/* Actor Icon */}
          <div className={cn('p-2 rounded-lg flex-shrink-0', actor.bg)}>
            <ActorIcon className={cn('w-4 h-4', actor.color)} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header Row */}
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-foreground">{entry.who.name}</span>
                <Badge variant="outline" className={cn('text-xs', category.color)}>
                  {category.label}
                </Badge>
                {entry.isFlagged && (
                  <Flag className="w-3.5 h-3.5 text-amber-400" />
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <StatusIcon className={cn('w-4 h-4', status.color)} />
                <span className="text-xs text-muted-foreground">{formatTimeAgo(entry.when)}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground mb-2">{entry.what.description}</p>

            {/* Quick Info */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              {entry.where.spaceName && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {entry.where.spaceName}
                </span>
              )}
              {entry.how.approach && (
                <span className="flex items-center gap-1">
                  <Wrench className="w-3 h-3" />
                  {entry.how.approach}
                </span>
              )}
              {entry.evidence && entry.evidence.length > 0 && (
                <span className="flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  {entry.evidence.length} attachment{entry.evidence.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>

          {/* Severity Indicator */}
          <div className="flex-shrink-0">
            <SeverityIcon className={cn('w-5 h-5', severity.color)} />
          </div>
        </div>
      </div>

      {/* Expanded Details - 6 W's */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-0 border-t border-border/50 mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            {/* WHO */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <User className="w-3 h-3" />
                WHO
              </div>
              <div className="pl-4 space-y-1">
                <p className="text-sm text-foreground">{entry.who.name}</p>
                <p className="text-xs text-muted-foreground">Type: {entry.who.type}</p>
                {entry.who.metadata?.tier && (
                  <p className="text-xs text-muted-foreground">Tier: {entry.who.metadata.tier}</p>
                )}
                {entry.who.metadata?.autonomyLevel && (
                  <p className="text-xs text-muted-foreground">Autonomy: {entry.who.metadata.autonomyLevel}</p>
                )}
                {entry.who.metadata?.role && (
                  <p className="text-xs text-muted-foreground">Role: {entry.who.metadata.role}</p>
                )}
              </div>
            </div>

            {/* WHAT */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <FileText className="w-3 h-3" />
                WHAT
              </div>
              <div className="pl-4 space-y-1">
                <p className="text-sm text-foreground">{entry.what.description}</p>
                <p className="text-xs text-muted-foreground">Type: {entry.what.type}</p>
                <p className="text-xs text-muted-foreground">Status: {entry.what.status}</p>
                {entry.what.result && (
                  <p className="text-xs text-muted-foreground">Result: {entry.what.result}</p>
                )}
                {entry.what.duration && (
                  <p className="text-xs text-muted-foreground">Duration: {(entry.what.duration / 1000).toFixed(1)}s</p>
                )}
              </div>
            </div>

            {/* WHEN */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <Clock className="w-3 h-3" />
                WHEN
              </div>
              <div className="pl-4 space-y-1">
                <p className="text-sm text-foreground">{entry.when.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{formatTimeAgo(entry.when)}</p>
              </div>
            </div>

            {/* WHERE */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <MapPin className="w-3 h-3" />
                WHERE
              </div>
              <div className="pl-4 space-y-1">
                {entry.where.spaceName && (
                  <p className="text-sm text-foreground">Space: {entry.where.spaceName}</p>
                )}
                {entry.where.projectName && (
                  <p className="text-xs text-muted-foreground">Project: {entry.where.projectName}</p>
                )}
                {entry.where.externalSystem && (
                  <p className="text-xs text-muted-foreground">External: {entry.where.externalSystem}</p>
                )}
                {entry.where.path && (
                  <p className="text-xs text-muted-foreground font-mono">{entry.where.path}</p>
                )}
              </div>
            </div>

            {/* WHY */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <HelpCircle className="w-3 h-3" />
                WHY
              </div>
              <div className="pl-4 space-y-1">
                <p className="text-sm text-foreground">Trigger: {entry.why.trigger}</p>
                {entry.why.reasoning && (
                  <p className="text-xs text-muted-foreground">{entry.why.reasoning}</p>
                )}
                {entry.why.triggerRef && (
                  <p className="text-xs text-muted-foreground">
                    Ref: {entry.why.triggerRef.type} - {entry.why.triggerRef.name || entry.why.triggerRef.id}
                  </p>
                )}
                {entry.why.confidence !== undefined && (
                  <p className="text-xs text-muted-foreground">Confidence: {(entry.why.confidence * 100).toFixed(0)}%</p>
                )}
              </div>
            </div>

            {/* HOW */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <Wrench className="w-3 h-3" />
                HOW
              </div>
              <div className="pl-4 space-y-1">
                <p className="text-sm text-foreground">Approach: {entry.how.approach}</p>
                {entry.how.model && (
                  <p className="text-xs text-muted-foreground">Model: {entry.how.model}</p>
                )}
                {entry.how.tools && entry.how.tools.length > 0 && (
                  <p className="text-xs text-muted-foreground">Tools: {entry.how.tools.join(', ')}</p>
                )}
                {entry.how.steps && entry.how.steps.length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    <p>Steps:</p>
                    <ol className="list-decimal list-inside ml-2 mt-1 space-y-0.5">
                      {entry.how.steps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}
                {entry.how.resources && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {entry.how.resources.tokens && <span>Tokens: {entry.how.resources.tokens.toLocaleString()} | </span>}
                    {entry.how.resources.cost && <span>Cost: ${entry.how.resources.cost.toFixed(2)}</span>}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tags */}
          {entry.tags.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border/50">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-muted-foreground">Tags:</span>
                {entry.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs border-border text-muted-foreground"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Crypto Hash */}
          <div className="mt-3 pt-3 border-t border-border/50">
            <p className="text-xs text-muted-foreground font-mono truncate">
              Hash: {entry.crypto.contentHash}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default LedgerEntry;
