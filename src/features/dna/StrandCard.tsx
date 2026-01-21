/**
 * StrandCard Component
 *
 * Detail view for a single DNA strand showing strength, confidence,
 * insights, and recommendations.
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Clock,
  Scale,
  BookOpen,
  Star,
  Building,
  User,
  Wrench,
  CheckCircle,
  Users,
  TrendingUp,
  Lightbulb,
  ArrowRight,
  Database,
  Shield,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DNAStrandData } from './dna-store';

// Icon mapping
const STRAND_ICONS: Record<string, React.ElementType> = {
  MessageSquare: MessageSquare,
  Clock: Clock,
  Scale: Scale,
  BookOpen: BookOpen,
  Star: Star,
  Building: Building,
  User: User,
  Wrench: Wrench,
  CheckCircle: CheckCircle,
  Users: Users,
};

interface StrandCardProps {
  strand: DNAStrandData;
  onClose?: () => void;
  onImprove?: (strandId: string) => void;
  className?: string;
  expanded?: boolean;
}

function StrandCard({
  strand,
  onClose,
  onImprove,
  className,
  expanded: _expanded = false,
}: StrandCardProps): JSX.Element {
  // _expanded reserved for future use (expanded view mode)
  const Icon = STRAND_ICONS[strand.icon] || Star;

  const getStrengthLabel = (strength: number): { text: string; color: string } => {
    if (strength >= 80) return { text: 'Strong', color: 'text-green-400' };
    if (strength >= 60) return { text: 'Moderate', color: 'text-yellow-400' };
    return { text: 'Needs Attention', color: 'text-orange-400' };
  };

  const strengthInfo = getStrengthLabel(strand.strength);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        'bg-card rounded-xl border border-border overflow-hidden',
        className
      )}
    >
      {/* Header */}
      <div
        className="p-4 border-b border-border"
        style={{ backgroundColor: `${strand.color}10` }}
      >
        <div className="flex items-start gap-3">
          <div
            className="p-2.5 rounded-xl"
            style={{ backgroundColor: `${strand.color}20` }}
          >
            <Icon
              className="w-5 h-5"
              style={{ color: strand.color }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span
                className="text-xs px-2 py-0.5 rounded-full capitalize"
                style={{
                  backgroundColor: `${strand.color}20`,
                  color: strand.color,
                }}
              >
                {strand.category}
              </span>
              <span className={cn('text-xs', strengthInfo.color)}>
                {strengthInfo.text}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mt-1">
              {strand.name}
            </h3>
            <p className="text-sm text-muted-foreground">{strand.description}</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Metrics */}
      <div className="p-4 grid grid-cols-3 gap-3 border-b border-border">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingUp className="w-4 h-4" style={{ color: strand.color }} />
          </div>
          <p className="text-2xl font-bold text-foreground">{strand.strength}%</p>
          <p className="text-xs text-muted-foreground">Strength</p>
        </div>
        <div className="text-center border-x border-border">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Shield className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold text-foreground">{strand.confidence}%</p>
          <p className="text-xs text-muted-foreground">Confidence</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Database className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold text-foreground">{strand.dataPoints}</p>
          <p className="text-xs text-muted-foreground">Data Points</p>
        </div>
      </div>

      {/* Strength Bar */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
          <span>Strand Strength</span>
          <span>{strand.strength}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: strand.color }}
            initial={{ width: 0 }}
            animate={{ width: `${strand.strength}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Last updated: {strand.lastUpdated}
        </p>
      </div>

      {/* Insights */}
      {strand.insights && strand.insights.length > 0 && (
        <div className="px-4 py-3 border-t border-border">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
            <Lightbulb className="w-3 h-3" />
            Insights
          </h4>
          <ul className="space-y-1.5">
            {strand.insights.map((insight, index) => (
              <li
                key={index}
                className="text-sm text-muted-foreground flex items-start gap-2"
              >
                <span style={{ color: strand.color }}>-</span>
                {insight}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      {strand.recommendations && strand.recommendations.length > 0 && (
        <div className="px-4 py-3 border-t border-border bg-card/30">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
            <ArrowRight className="w-3 h-3" />
            Recommendations
          </h4>
          <ul className="space-y-1.5">
            {strand.recommendations.map((rec, index) => (
              <li
                key={index}
                className="text-sm text-muted-foreground flex items-start gap-2"
              >
                <span className="text-symtex-primary">-</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      {onImprove && (
        <div className="p-4 border-t border-border">
          <button
            onClick={() => onImprove(strand.id)}
            className={cn(
              'w-full py-2.5 rounded-lg text-sm font-medium',
              'transition-colors flex items-center justify-center gap-2'
            )}
            style={{
              backgroundColor: `${strand.color}20`,
              color: strand.color,
            }}
          >
            <TrendingUp className="w-4 h-4" />
            Improve This Strand
          </button>
        </div>
      )}
    </motion.div>
  );
}

export default memo(StrandCard);
