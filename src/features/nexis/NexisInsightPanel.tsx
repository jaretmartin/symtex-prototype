/**
 * NexisInsightPanel Component
 *
 * Displays AI-generated insights about relationships, opportunities,
 * and actionable recommendations from the NEXIS relationship graph.
 */

import { memo } from 'react';
import {
  Lightbulb,
  TrendingUp,
  Bell,
  Link2,
  ChevronRight,
  Sparkles,
  Users,
  ArrowUpRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NexisInsight } from './nexis-store';

interface NexisInsightPanelProps {
  insights: NexisInsight[];
  onInsightClick?: (insight: NexisInsight) => void;
  onViewAll?: () => void;
  className?: string;
  compact?: boolean;
}

const insightTypeConfig = {
  connection: {
    icon: Link2,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/30',
    label: 'Connection',
  },
  opportunity: {
    icon: Lightbulb,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/20',
    borderColor: 'border-amber-500/30',
    label: 'Opportunity',
  },
  reminder: {
    icon: Bell,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500/30',
    label: 'Reminder',
  },
  trend: {
    icon: TrendingUp,
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/30',
    label: 'Trend',
  },
};

const priorityConfig = {
  high: { color: 'text-red-400', bgColor: 'bg-red-500/20', label: 'High' },
  medium: {
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20',
    label: 'Medium',
  },
  low: { color: 'text-green-400', bgColor: 'bg-green-500/20', label: 'Low' },
};

function NexisInsightPanel({
  insights,
  onInsightClick,
  onViewAll,
  className,
  compact = false,
}: NexisInsightPanelProps): JSX.Element {
  const displayInsights = compact ? insights.slice(0, 3) : insights;

  return (
    <div
      className={cn(
        'bg-card rounded-xl border border-border overflow-hidden',
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-symtex-primary" />
            Relationship Insights
          </h3>
          <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">
            AI-Powered
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Actionable intelligence from your network
        </p>
      </div>

      {/* Insights List */}
      <div className="divide-y divide-symtex-border">
        {displayInsights.length === 0 ? (
          <div className="p-6 text-center">
            <Users className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No insights available yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Add more connections to generate insights
            </p>
          </div>
        ) : (
          displayInsights.map((insight) => {
            const typeConfig = insightTypeConfig[insight.type];
            const prioConfig = priorityConfig[insight.priority];
            const TypeIcon = typeConfig.icon;

            return (
              <button
                key={insight.id}
                onClick={() => onInsightClick?.(insight)}
                className={cn(
                  'w-full p-4 text-left hover:bg-card/50 transition-colors',
                  'group'
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      'p-2 rounded-lg flex-shrink-0',
                      typeConfig.bgColor
                    )}
                  >
                    <TypeIcon className={cn('w-4 h-4', typeConfig.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={cn(
                          'text-xs px-1.5 py-0.5 rounded',
                          typeConfig.bgColor,
                          typeConfig.color
                        )}
                      >
                        {typeConfig.label}
                      </span>
                      <span
                        className={cn(
                          'text-xs px-1.5 py-0.5 rounded',
                          prioConfig.bgColor,
                          prioConfig.color
                        )}
                      >
                        {prioConfig.label}
                      </span>
                    </div>
                    <h4 className="text-sm font-medium text-foreground mb-1 group-hover:text-symtex-primary transition-colors">
                      {insight.title}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {insight.description}
                    </p>
                    {insight.relatedNodes.length > 0 && (
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="text-xs text-muted-foreground">Related:</span>
                        <div className="flex items-center gap-1 flex-wrap">
                          {insight.relatedNodes.slice(0, 3).map((nodeId) => (
                            <span
                              key={nodeId}
                              className="text-xs px-1.5 py-0.5 rounded bg-muted/50 text-muted-foreground"
                            >
                              {nodeId.replace(/^(person|company|topic|event)-/, '')}
                            </span>
                          ))}
                          {insight.relatedNodes.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                              +{insight.relatedNodes.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Footer */}
      {insights.length > 3 && compact && onViewAll && (
        <div className="p-3 border-t border-border bg-card/30">
          <button
            onClick={onViewAll}
            className="w-full flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            View all {insights.length} insights
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Quick Stats */}
      {!compact && (
        <div className="p-4 border-t border-border bg-card/30">
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">
                {insights.filter((i) => i.type === 'opportunity').length}
              </div>
              <div className="text-xs text-muted-foreground">Opportunities</div>
            </div>
            <div className="text-center border-x border-border">
              <div className="text-lg font-semibold text-foreground">
                {insights.filter((i) => i.priority === 'high').length}
              </div>
              <div className="text-xs text-muted-foreground">High Priority</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">
                {insights.filter((i) => i.type === 'reminder').length}
              </div>
              <div className="text-xs text-muted-foreground">Reminders</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(NexisInsightPanel);
