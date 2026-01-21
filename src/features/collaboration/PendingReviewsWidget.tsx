/**
 * PendingReviewsWidget Component
 *
 * Shows items awaiting user decision in a compact widget format.
 * Features:
 * - Quick approve/reject buttons
 * - Priority indicators
 * - Cognate attribution
 * - Expiry warnings
 */

import { useEffect } from 'react';
import {
  ClipboardCheck,
  Mail,
  FileText,
  Zap,
  ShoppingCart,
  Calendar,
  Check,
  X,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import clsx from 'clsx';
import {
  useCollaborationStore,
  type PendingApproval,
  type ApprovalType,
  type ApprovalPriority,
} from './collaboration-store';

interface PendingReviewsWidgetProps {
  className?: string;
  maxItems?: number;
}

const approvalTypeConfig: Record<
  ApprovalType,
  { icon: React.ElementType; label: string }
> = {
  email: { icon: Mail, label: 'Email' },
  document: { icon: FileText, label: 'Document' },
  action: { icon: Zap, label: 'Action' },
  purchase: { icon: ShoppingCart, label: 'Purchase' },
  meeting: { icon: Calendar, label: 'Meeting' },
};

const priorityConfig: Record<
  ApprovalPriority,
  { color: string; bgColor: string; borderColor: string; label: string }
> = {
  low: {
    color: 'text-muted-foreground',
    bgColor: 'bg-muted/20',
    borderColor: 'border-border/30',
    label: 'Low',
  },
  medium: {
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/30',
    label: 'Medium',
  },
  high: {
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/20',
    borderColor: 'border-amber-500/30',
    label: 'High',
  },
  critical: {
    color: 'text-red-400',
    bgColor: 'bg-red-500/20',
    borderColor: 'border-red-500/30',
    label: 'Critical',
  },
};

function getTimeUntilExpiry(expiresAt?: string): string | null {
  if (!expiresAt) return null;

  const now = new Date();
  const expiry = new Date(expiresAt);
  const diff = expiry.getTime() - now.getTime();

  if (diff < 0) return 'Expired';

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d left`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m left`;
  }
  return `${minutes}m left`;
}

function isExpiringSoon(expiresAt?: string): boolean {
  if (!expiresAt) return false;
  const now = new Date();
  const expiry = new Date(expiresAt);
  const hoursLeft = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60);
  return hoursLeft < 4 && hoursLeft > 0;
}

export function PendingReviewsWidget({
  className,
  maxItems = 4,
}: PendingReviewsWidgetProps): JSX.Element {
  const {
    pendingApprovals,
    loadMockData,
    isLoading,
    approveItem,
    rejectItem,
  } = useCollaborationStore();

  useEffect(() => {
    if (pendingApprovals.length === 0) {
      loadMockData();
    }
  }, [pendingApprovals.length, loadMockData]);

  // Filter to only pending items
  const pendingItems = pendingApprovals
    .filter((item) => item.status === 'pending')
    .slice(0, maxItems);

  const handleApprove = (e: React.MouseEvent, id: string): void => {
    e.stopPropagation();
    approveItem(id);
  };

  const handleReject = (e: React.MouseEvent, id: string): void => {
    e.stopPropagation();
    rejectItem(id);
  };

  if (isLoading) {
    return (
      <div className={clsx('bg-surface-base/50 border border-border rounded-lg', className)}>
        <div className="p-4 border-b border-border">
          <div className="h-5 w-36 bg-card rounded animate-pulse" />
        </div>
        <div className="p-4 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-card/50 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'bg-surface-base/50 border border-border rounded-lg overflow-hidden',
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <ClipboardCheck className="w-4 h-4 text-symtex-primary" />
          Pending Reviews
        </h3>
        {pendingItems.length > 0 && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
            {pendingItems.length} pending
          </span>
        )}
      </div>

      {/* Reviews List */}
      <div className="divide-y divide-zinc-800/50">
        {pendingItems.map((item) => (
          <ReviewItem
            key={item.id}
            item={item}
            onApprove={(e) => handleApprove(e, item.id)}
            onReject={(e) => handleReject(e, item.id)}
          />
        ))}

        {pendingItems.length === 0 && (
          <div className="p-8 text-center">
            <ClipboardCheck className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">All caught up!</p>
            <p className="text-xs text-muted-foreground">No pending reviews</p>
          </div>
        )}
      </div>

      {/* Footer */}
      {pendingApprovals.filter((i) => i.status === 'pending').length > maxItems && (
        <div className="p-3 border-t border-border bg-card/30">
          <button className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors">
            View all{' '}
            {pendingApprovals.filter((i) => i.status === 'pending').length} reviews
          </button>
        </div>
      )}
    </div>
  );
}

interface ReviewItemProps {
  item: PendingApproval;
  onApprove: (e: React.MouseEvent) => void;
  onReject: (e: React.MouseEvent) => void;
}

function ReviewItem({ item, onApprove, onReject }: ReviewItemProps): JSX.Element {
  const typeConfig = approvalTypeConfig[item.type];
  const prioConfig = priorityConfig[item.riskLevel];
  const TypeIcon = typeConfig.icon;
  const expiryText = getTimeUntilExpiry(item.expiresAt);
  const expiringSoon = isExpiringSoon(item.expiresAt);

  return (
    <div className="p-4 hover:bg-card/30 transition-colors group">
      <div className="flex items-start gap-3">
        {/* Type Icon */}
        <div className={clsx('p-2 rounded-lg flex-shrink-0', prioConfig.bgColor)}>
          <TypeIcon className={clsx('w-4 h-4', prioConfig.color)} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-foreground text-sm truncate">{item.title}</h4>
            <span
              className={clsx(
                'text-xs px-1.5 py-0.5 rounded border',
                prioConfig.bgColor,
                prioConfig.color,
                prioConfig.borderColor
              )}
            >
              {prioConfig.label}
            </span>
          </div>

          {/* Cognate Attribution */}
          <p className="text-xs text-muted-foreground mb-2">
            from <span className="text-symtex-primary">{item.cognateName}</span>
          </p>

          {/* Expiry Warning */}
          {expiryText && (
            <div
              className={clsx(
                'flex items-center gap-1 text-xs',
                expiringSoon ? 'text-amber-400' : 'text-muted-foreground'
              )}
            >
              {expiringSoon ? (
                <AlertTriangle className="w-3 h-3" />
              ) : (
                <Clock className="w-3 h-3" />
              )}
              {expiryText}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onApprove}
            className={clsx(
              'p-2 rounded-lg transition-colors',
              'text-green-400 hover:bg-green-500/20'
            )}
            title="Approve"
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            onClick={onReject}
            className={clsx(
              'p-2 rounded-lg transition-colors',
              'text-red-400 hover:bg-red-500/20'
            )}
            title="Reject"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default PendingReviewsWidget;
