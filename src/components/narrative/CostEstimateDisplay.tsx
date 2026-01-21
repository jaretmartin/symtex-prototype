/**
 * Cost Estimate Display Component
 *
 * Shows breakdown of estimated costs for running a narrative automation,
 * including per-step costs, API calls, and monthly projections.
 */

import { DollarSign, Zap, Cloud, Calendar, TrendingUp } from 'lucide-react';
import clsx from 'clsx';
import type { NarrativeChapter, ChapterType } from '@/types';

interface CostBreakdownItem {
  label: string;
  type: ChapterType;
  cost: number;
  apiCalls: number;
}

interface CostEstimateDisplayProps {
  chapters: NarrativeChapter[];
  frequency?: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'on-demand';
  className?: string;
}

// Estimated costs per chapter type (in credits/tokens)
const chapterTypeCosts: Record<ChapterType, { baseCost: number; apiCalls: number }> = {
  beginning: { baseCost: 0.01, apiCalls: 1 },
  decision: { baseCost: 0.05, apiCalls: 2 },
  action: { baseCost: 0.10, apiCalls: 3 },
  milestone: { baseCost: 0.02, apiCalls: 1 },
  ending: { baseCost: 0.01, apiCalls: 1 },
};

// Frequency multipliers for monthly estimate
const frequencyMultipliers: Record<string, number> = {
  hourly: 720,
  daily: 30,
  weekly: 4,
  monthly: 1,
  'on-demand': 10, // Assume ~10 runs per month for on-demand
};

function calculateCostBreakdown(chapters: NarrativeChapter[]): CostBreakdownItem[] {
  return chapters.map((chapter, index) => {
    const costs = chapterTypeCosts[chapter.type];
    return {
      label: `Chapter ${index + 1}: ${chapter.title}`,
      type: chapter.type,
      cost: costs.baseCost,
      apiCalls: costs.apiCalls,
    };
  });
}

function formatCurrency(amount: number): string {
  if (amount < 0.01) {
    return `$${amount.toFixed(4)}`;
  }
  return `$${amount.toFixed(2)}`;
}

export function CostEstimateDisplay({
  chapters,
  frequency = 'on-demand',
  className,
}: CostEstimateDisplayProps): JSX.Element {
  const breakdown = calculateCostBreakdown(chapters);
  const totalCostPerRun = breakdown.reduce((sum, item) => sum + item.cost, 0);
  const totalApiCalls = breakdown.reduce((sum, item) => sum + item.apiCalls, 0);
  const monthlyMultiplier = frequencyMultipliers[frequency];
  const monthlyEstimate = totalCostPerRun * monthlyMultiplier;

  if (chapters.length === 0) {
    return (
      <div className={clsx('bg-card rounded-xl border border-border p-6', className)}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-symtex-primary/10 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-symtex-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Cost Estimate</h3>
            <p className="text-sm text-muted-foreground">Add chapters to see estimated costs</p>
          </div>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          No chapters to estimate
        </div>
      </div>
    );
  }

  return (
    <div className={clsx('bg-card rounded-xl border border-border', className)}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-symtex-primary/10 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-symtex-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Cost Estimate</h3>
            <p className="text-sm text-muted-foreground">Based on {chapters.length} chapters</p>
          </div>
        </div>
      </div>

      {/* Breakdown by Step */}
      <div className="p-4 border-b border-border">
        <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
          Cost Breakdown
        </h4>
        <div className="space-y-2">
          {breakdown.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/30"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Zap className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                <span className="text-sm text-foreground truncate">{item.label}</span>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <span className="text-xs text-muted-foreground">
                  {item.apiCalls} API call{item.apiCalls !== 1 ? 's' : ''}
                </span>
                <span className="text-sm font-medium text-foreground">
                  {formatCurrency(item.cost)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="p-4 grid grid-cols-3 gap-4">
        {/* Per Run Cost */}
        <div className="text-center p-3 rounded-lg bg-muted/30">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Zap className="w-4 h-4 text-symtex-primary" />
            <span className="text-xs text-muted-foreground">Per Run</span>
          </div>
          <div className="text-lg font-semibold text-foreground">
            {formatCurrency(totalCostPerRun)}
          </div>
        </div>

        {/* API Calls */}
        <div className="text-center p-3 rounded-lg bg-muted/30">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Cloud className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-muted-foreground">API Calls</span>
          </div>
          <div className="text-lg font-semibold text-foreground">{totalApiCalls}</div>
        </div>

        {/* Monthly Estimate */}
        <div className="text-center p-3 rounded-lg bg-muted/30">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Calendar className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-muted-foreground">Monthly</span>
          </div>
          <div className="text-lg font-semibold text-foreground">
            {formatCurrency(monthlyEstimate)}
          </div>
        </div>
      </div>

      {/* Frequency Note */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-2 p-3 rounded-lg bg-symtex-primary/5 border border-symtex-primary/20">
          <TrendingUp className="w-4 h-4 text-symtex-primary flex-shrink-0" />
          <p className="text-xs text-muted-foreground">
            Monthly estimate based on{' '}
            <span className="text-symtex-primary font-medium">{frequency}</span> execution
            frequency ({monthlyMultiplier} runs/month)
          </p>
        </div>
      </div>
    </div>
  );
}

export default CostEstimateDisplay;
