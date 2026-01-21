/**
 * CostSavingsChart Component
 *
 * Displays a Recharts area chart comparing costs with and without Symtex.
 * Shows last 6 months of savings data with interactive tooltips.
 */

import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TrendingDown } from 'lucide-react';
import type { CostDataPoint } from './insights-store';

interface CostSavingsChartProps {
  data: CostDataPoint[];
  className?: string;
  showLegend?: boolean;
  height?: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    color: string;
    name: string;
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const withoutSymtex = payload.find((p) => p.dataKey === 'withoutSymtex');
  const withSymtex = payload.find((p) => p.dataKey === 'withSymtex');
  const savings = withoutSymtex && withSymtex ? withoutSymtex.value - withSymtex.value : 0;

  return (
    <div className="bg-card border border-border rounded-lg p-3 shadow-xl">
      <p className="text-sm font-medium text-foreground mb-2">{label}</p>
      <div className="space-y-1.5">
        {withoutSymtex && (
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span className="text-xs text-muted-foreground">Without Symtex</span>
            </div>
            <span className="text-sm font-medium text-foreground">
              ${withoutSymtex.value.toLocaleString()}
            </span>
          </div>
        )}
        {withSymtex && (
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
              <span className="text-xs text-muted-foreground">With Symtex</span>
            </div>
            <span className="text-sm font-medium text-foreground">
              ${withSymtex.value.toLocaleString()}
            </span>
          </div>
        )}
        <div className="border-t border-border pt-1.5 mt-1.5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-3 h-3 text-emerald-400" />
              <span className="text-xs text-emerald-400">Savings</span>
            </div>
            <span className="text-sm font-bold text-emerald-400">
              ${savings.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CostSavingsChartInner({
  data,
  className,
  showLegend = true,
  height = 300,
}: CostSavingsChartProps) {
  const totalSavings = useMemo(() => {
    return data.reduce((sum, point) => sum + point.savings, 0);
  }, [data]);

  const percentReduction = useMemo(() => {
    const totalWithout = data.reduce((sum, p) => sum + p.withoutSymtex, 0);
    const totalWith = data.reduce((sum, p) => sum + p.withSymtex, 0);
    return totalWithout > 0 ? ((totalWithout - totalWith) / totalWithout) * 100 : 0;
  }, [data]);

  return (
    <Card className={cn('bg-card/50 border-border/50', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">Cost Comparison</CardTitle>
            <CardDescription className="text-muted-foreground">
              Monthly operational costs with vs. without Symtex
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-emerald-400">
              ${totalSavings.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">
              Total saved ({percentReduction.toFixed(1)}% reduction)
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorWithout" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f87171" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorWith" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#334155"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
              width={80}
            />
            <Tooltip content={<CustomTooltip />} />
            {showLegend && (
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: 10 }}
                formatter={(value) => (
                  <span className="text-xs text-muted-foreground">
                    {value === 'withoutSymtex' ? 'Without Symtex' : 'With Symtex'}
                  </span>
                )}
              />
            )}
            <Area
              type="monotone"
              dataKey="withoutSymtex"
              name="withoutSymtex"
              stroke="#f87171"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorWithout)"
            />
            <Area
              type="monotone"
              dataKey="withSymtex"
              name="withSymtex"
              stroke="#818cf8"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorWith)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export const CostSavingsChart = React.memo(CostSavingsChartInner);
export default CostSavingsChart;
