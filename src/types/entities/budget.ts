/**
 * Budget and AI usage types
 */

export interface BudgetCategory {
  name: string;
  used: number;
  limit: number;
  color: string;
  trend: 'up' | 'down' | 'stable';
  icon: string;
}

export interface AIUsageStats {
  totalTokensUsed: number;
  totalCost: number;
  period: 'day' | 'week' | 'month';
  breakdown: BudgetCategory[];
  projectedCost: number;
  budgetLimit: number;
}

export interface UsageHistoryPoint {
  date: string;
  tokens: number;
  cost: number;
}
