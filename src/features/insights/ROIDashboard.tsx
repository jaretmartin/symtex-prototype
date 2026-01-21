/**
 * ROIDashboard Component
 *
 * Main dashboard displaying all ROI metrics including:
 * - Key metrics (Time Saved, Cost Avoided, Actual Spend, ROI Multiplier)
 * - Cost savings comparison chart
 * - Symbolic ratio gauge
 * - Pattern compilation widget
 */

import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { RefreshCcw, Download, Calendar } from 'lucide-react';
import { useInsightsStore } from './insights-store';
import { MetricGrid } from './MetricCard';
import { CostSavingsChart } from './CostSavingsChart';
import { SymbolicRatioGauge } from './SymbolicRatioGauge';
import { PatternCompilationWidget } from './PatternCompilationWidget';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ROIDashboardProps {
  className?: string;
}

const timeRangeOptions = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: '6m', label: 'Last 6 months' },
  { value: '1y', label: 'Last year' },
];

export function ROIDashboard({ className }: ROIDashboardProps) {
  const {
    metrics,
    costData,
    symbolicRatio,
    patterns,
    totalPatternsCompiled,
    isLoading,
    timeRange,
    setTimeRange,
    loadMockData,
  } = useInsightsStore();

  // Load mock data on mount
  useEffect(() => {
    loadMockData();
  }, [loadMockData]);

  const handleRefresh = () => {
    loadMockData();
  };

  const handleExport = () => {
    // In production, this would export data to CSV/PDF
    // Exporting ROI data...
  };

  if (isLoading) {
    return (
      <div className={cn('p-6', className)}>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-700 rounded w-1/4" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-700 rounded-lg" />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="h-80 bg-slate-700 rounded-lg" />
            <div className="h-80 bg-slate-700 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)} role="region" aria-labelledby="roi-dashboard-title">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 id="roi-dashboard-title" className="text-2xl font-bold text-white">ROI Dashboard</h1>
          <p id="roi-dashboard-description" className="text-sm text-slate-400 mt-1">
            Track your return on investment with Symtex
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Time Range Selector */}
          <Select
            value={timeRange}
            onValueChange={(value) => setTimeRange(value as typeof timeRange)}
          >
            <SelectTrigger className="w-[160px] bg-slate-800 border-slate-700" aria-label="Select time range">
              <Calendar className="w-4 h-4 mr-2 text-slate-400" aria-hidden="true" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeRangeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Action Buttons */}
          <button
            onClick={handleRefresh}
            className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            title="Refresh data"
            aria-label="Refresh ROI data"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleExport}
            className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            title="Export report"
            aria-label="Export ROI report"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <section aria-label="Key metrics overview">
        <MetricGrid metrics={metrics} size="md" />
      </section>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cost Savings Chart - Takes 2 columns */}
        <section className="lg:col-span-2" aria-label="Cost savings comparison chart">
          <CostSavingsChart data={costData} height={320} />
        </section>

        {/* Symbolic Ratio Gauge */}
        <section aria-label="Symbolic to neural processing ratio">
          <SymbolicRatioGauge data={symbolicRatio} size="md" />
        </section>
      </div>

      {/* Pattern Compilation Widget */}
      <section aria-label="Pattern compilation statistics">
        <PatternCompilationWidget
          patterns={patterns}
          totalCompiled={totalPatternsCompiled}
          maxVisible={5}
        />
      </section>

      {/* Summary Footer */}
      <section
        className="p-4 rounded-lg bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20"
        aria-label="Total savings summary"
        role="region"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white">
              Symtex is saving you significant time and money
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Based on {timeRange === '6m' ? '6 months' : timeRange} of usage data
            </p>
          </div>
          <div className="text-right" role="status" aria-live="polite">
            <p className="text-2xl font-bold text-emerald-400" aria-label={`Total savings: ${costData.reduce((sum, p) => sum + p.savings, 0).toLocaleString()} dollars`}>
              ${costData.reduce((sum, p) => sum + p.savings, 0).toLocaleString()}
            </p>
            <p className="text-xs text-slate-400">Total Savings</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ROIDashboard;
