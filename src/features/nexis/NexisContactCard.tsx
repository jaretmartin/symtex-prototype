/**
 * NexisContactCard Component
 *
 * Enriched contact view showing detailed information about a person,
 * company, topic, or event in the NEXIS relationship graph.
 */

import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Building2,
  Hash,
  Calendar,
  Mail,
  MapPin,
  Clock,
  TrendingUp,
  ExternalLink,
  MessageSquare,
  UserPlus,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NexisNode, NexisEdge } from './nexis-store';

interface NexisContactCardProps {
  node: NexisNode;
  edges: NexisEdge[];
  onClose?: () => void;
  onMessage?: (nodeId: string) => void;
  onConnect?: (nodeId: string) => void;
  onSendToSymbios?: (nodeId: string) => void;
  className?: string;
}

const nodeTypeConfig = {
  person: {
    icon: User,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/30',
    label: 'Contact',
  },
  company: {
    icon: Building2,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500/30',
    label: 'Company',
  },
  topic: {
    icon: Hash,
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/30',
    label: 'Topic',
  },
  event: {
    icon: Calendar,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/20',
    borderColor: 'border-amber-500/30',
    label: 'Event',
  },
};

const edgeTypeLabels: Record<string, string> = {
  works_at: 'Works at',
  knows: 'Knows',
  mentioned_in: 'Mentioned in',
  attended: 'Attended',
  interested_in: 'Interested in',
  collaborated_on: 'Collaborated on',
};

function NexisContactCard({
  node,
  edges,
  onClose,
  onMessage,
  onConnect,
  onSendToSymbios,
  className,
}: NexisContactCardProps): JSX.Element {
  const navigate = useNavigate();
  const config = nodeTypeConfig[node.type];
  const Icon = config.icon;
  const { data } = node;

  const getStrengthColor = (strength: number): string => {
    if (strength >= 80) return 'text-green-400';
    if (strength >= 60) return 'text-yellow-400';
    if (strength >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  // Handle sending entity to Symbios
  const handleSendToSymbios = useCallback(() => {
    if (onSendToSymbios) {
      onSendToSymbios(node.id);
    } else {
      // Default navigation if no callback provided
      navigate(`/symbios?context=nexis&entity=${node.id}`);
    }
  }, [node.id, onSendToSymbios, navigate]);

  return (
    <div
      className={cn(
        'bg-card rounded-xl border border-border overflow-hidden',
        'animate-in slide-in-from-right-4 duration-300',
        className
      )}
    >
      {/* Header */}
      <div className={cn('p-4 border-b border-border', config.bgColor)}>
        <div className="flex items-start gap-3">
          <div
            className={cn(
              'p-2.5 rounded-xl',
              config.bgColor,
              'border',
              config.borderColor
            )}
          >
            <Icon className={cn('w-6 h-6', config.color)} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'text-xs px-2 py-0.5 rounded-full',
                  config.bgColor,
                  config.color
                )}
              >
                {config.label}
              </span>
              {data.strength && (
                <span
                  className={cn(
                    'text-xs flex items-center gap-1',
                    getStrengthColor(data.strength)
                  )}
                >
                  <TrendingUp className="w-3 h-3" />
                  {data.strength}%
                </span>
              )}
            </div>
            <h3 className="text-lg font-semibold text-foreground mt-1 truncate">
              {data.name}
            </h3>
            {data.title && data.company && (
              <p className="text-sm text-muted-foreground">
                {data.title} at {data.company}
              </p>
            )}
            {data.industry && (
              <p className="text-sm text-muted-foreground">{data.industry}</p>
            )}
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Contact Info */}
        {(data.email || data.lastContact || data.location || data.date) && (
          <div className="space-y-2">
            {data.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <a
                  href={`mailto:${data.email}`}
                  className="text-symtex-primary hover:underline"
                >
                  {data.email}
                </a>
              </div>
            )}
            {data.lastContact && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>Last contact: {data.lastContact}</span>
              </div>
            )}
            {data.location && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{data.location}</span>
              </div>
            )}
            {data.date && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>{data.date}</span>
              </div>
            )}
          </div>
        )}

        {/* Description */}
        {data.description && (
          <p className="text-sm text-foreground leading-relaxed">
            {data.description}
          </p>
        )}

        {/* Tags */}
        {data.tags && data.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {data.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full bg-muted/50 text-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Connections */}
        {edges.length > 0 && (
          <div className="pt-3 border-t border-border">
            <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
              Connections ({edges.length})
            </h4>
            <div className="space-y-1.5 max-h-32 overflow-y-auto">
              {edges.slice(0, 5).map((edge) => (
                <div
                  key={edge.id}
                  className="flex items-center gap-2 text-xs text-foreground"
                >
                  <span className="text-muted-foreground">
                    {edgeTypeLabels[edge.type] || edge.type}
                  </span>
                  <span className="text-symtex-primary">
                    {edge.source === node.id ? edge.target : edge.source}
                  </span>
                </div>
              ))}
              {edges.length > 5 && (
                <p className="text-xs text-muted-foreground">
                  +{edges.length - 5} more connections
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-border space-y-2">
        {/* Send to Symbios - available for all entity types */}
        <button
          onClick={handleSendToSymbios}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-symtex-primary/20 text-symtex-primary text-sm font-medium hover:bg-symtex-primary/30 transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          Send to Symbios
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Person-specific actions */}
        {node.type === 'person' && (onMessage || onConnect) && (
          <div className="flex gap-2">
            {onMessage && (
              <button
                onClick={() => onMessage(node.id)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-muted text-foreground text-sm font-medium hover:bg-muted/80 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                Message
              </button>
            )}
            {onConnect && (
              <button
                onClick={() => onConnect(node.id)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-muted text-foreground text-sm font-medium hover:bg-muted/80 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                Connect
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(NexisContactCard);
