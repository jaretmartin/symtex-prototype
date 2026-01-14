import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Wallet,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  DollarSign,
  Zap,
  MessageSquare,
  Image,
  Code,
  RefreshCcw,
  Calendar,
  BarChart3,
  Info,
  ArrowRight
} from 'lucide-react'
import clsx from 'clsx'
import { useUIStore } from '@/store/useUIStore'
import WidgetSkeleton from './WidgetSkeleton'

interface BudgetCategory {
  id: string
  name: string
  icon: React.ElementType
  spent: number
  allocated: number
  trend: number // percentage change from last period
  color: string
}

interface AIBudgetStatusProps {
  className?: string
}

// Mock data - in production, this would come from a store or API
const mockBudgetCategories: BudgetCategory[] = [
  {
    id: 'chat',
    name: 'Chat Completions',
    icon: MessageSquare,
    spent: 1247.50,
    allocated: 2000,
    trend: 8.5,
    color: '#6366f1'
  },
  {
    id: 'embeddings',
    name: 'Embeddings',
    icon: Code,
    spent: 342.80,
    allocated: 500,
    trend: -3.2,
    color: '#8b5cf6'
  },
  {
    id: 'images',
    name: 'Image Generation',
    icon: Image,
    spent: 189.20,
    allocated: 300,
    trend: 15.7,
    color: '#06b6d4'
  },
  {
    id: 'automations',
    name: 'Automations',
    icon: Zap,
    spent: 521.40,
    allocated: 700,
    trend: 4.1,
    color: '#22c55e'
  }
]

/**
 * AI Budget Status Component
 *
 * Displays current AI API spending and budget allocation.
 * Features:
 * - Loading skeleton state
 * - Collapsible detailed breakdown view
 * - Per-category spending with trend indicators
 * - Visual budget utilization bar
 * - Alerts when approaching budget limits
 * - Click to view details navigation
 * - Refresh functionality
 */
export default function AIBudgetStatus({ className }: AIBudgetStatusProps): JSX.Element {
  const navigate = useNavigate()
  const addToast = useUIStore((state) => state.addToast)

  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([])

  // Simulate data loading
  useEffect(() => {
    const loadData = async (): Promise<void> => {
      setIsLoading(true)
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800))
      setBudgetCategories(mockBudgetCategories)
      setIsLoading(false)
    }

    loadData()
  }, [])

  // Handle refresh
  const handleRefresh = useCallback(async (): Promise<void> => {
    setIsRefreshing(true)
    // Simulate API refresh
    await new Promise(resolve => setTimeout(resolve, 1000))
    // In production, this would fetch fresh data
    setBudgetCategories(mockBudgetCategories)
    setIsRefreshing(false)
    addToast({
      title: 'Budget data refreshed',
      variant: 'success',
      duration: 3000
    })
  }, [addToast])

  // Handle view details
  const handleViewDetails = useCallback((): void => {
    navigate('/settings/budget')
  }, [navigate])

  // Handle category click
  const handleCategoryClick = useCallback((categoryId: string): void => {
    navigate(`/settings/budget?category=${categoryId}`)
  }, [navigate])

  // Show loading skeleton
  if (isLoading) {
    return <WidgetSkeleton height={180} showHeader={true} rows={0} className={className} />
  }

  // Calculate totals
  const totalSpent = budgetCategories.reduce((acc, cat) => acc + cat.spent, 0)
  const totalAllocated = budgetCategories.reduce((acc, cat) => acc + cat.allocated, 0)
  const utilizationPercent = (totalSpent / totalAllocated) * 100
  const isNearLimit = utilizationPercent > 80
  const isOverLimit = utilizationPercent > 95

  // Calculate overall trend
  const overallTrend = budgetCategories.reduce((acc, cat) => {
    const weight = cat.spent / totalSpent
    return acc + (cat.trend * weight)
  }, 0)

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount)
  }

  return (
    <div className={clsx(
      'bg-symtex-card rounded-xl border border-symtex-border overflow-hidden transition-all duration-300',
      className
    )}>
      {/* Header - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-5 flex items-center justify-between hover:bg-slate-800/30 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={clsx(
            'p-3 rounded-xl',
            isOverLimit ? 'bg-red-500/20' : isNearLimit ? 'bg-yellow-500/20' : 'bg-symtex-primary/20'
          )}>
            <Wallet className={clsx(
              'w-6 h-6',
              isOverLimit ? 'text-red-400' : isNearLimit ? 'text-yellow-400' : 'text-symtex-primary'
            )} />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              AI Budget Status
              {isNearLimit && !isOverLimit && (
                <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">
                  Near Limit
                </span>
              )}
              {isOverLimit && (
                <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Over Budget
                </span>
              )}
            </h3>
            <p className="text-sm text-slate-400">
              {formatCurrency(totalSpent)} of {formatCurrency(totalAllocated)} used this month
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Overall Trend Indicator */}
          <div className="hidden sm:flex items-center gap-2">
            <div className={clsx(
              'flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full',
              overallTrend > 0 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
            )}>
              {overallTrend > 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              {Math.abs(overallTrend).toFixed(1)}%
            </div>
          </div>

          {/* Quick Stats */}
          <div className="hidden md:flex items-center gap-6 mr-4">
            <div className="text-right">
              <p className="text-2xl font-bold text-white">{utilizationPercent.toFixed(1)}%</p>
              <p className="text-xs text-slate-500">Utilization</p>
            </div>
            <div className="w-32">
              <div className="h-2.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={clsx(
                    'h-full rounded-full transition-all duration-500',
                    isOverLimit ? 'bg-red-500' : isNearLimit ? 'bg-yellow-500' : 'bg-symtex-primary'
                  )}
                  style={{ width: `${Math.min(utilizationPercent, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Expand/Collapse Icon */}
          <div className={clsx(
            'p-2 rounded-lg transition-colors',
            isExpanded ? 'bg-symtex-primary/20 text-symtex-primary' : 'text-slate-400 hover:text-white'
          )}>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </div>
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-symtex-border animate-in slide-in-from-top-2 duration-200">
          {/* Summary Bar */}
          <div className="p-4 bg-slate-800/30 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Calendar className="w-4 h-4" />
              <span>Billing Period: Jan 1 - Jan 31, 2026</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleRefresh()
                }}
                disabled={isRefreshing}
                className="flex items-center gap-2 text-sm text-symtex-primary hover:text-symtex-secondary transition-colors disabled:opacity-50"
              >
                <RefreshCcw className={clsx('w-4 h-4', isRefreshing && 'animate-spin')} />
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleViewDetails()
                }}
                className="flex items-center gap-2 text-sm text-symtex-primary hover:text-symtex-secondary transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                Full Report
              </button>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="p-5 space-y-4">
            <h4 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Spending by Category
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {budgetCategories.map((category) => {
                const Icon = category.icon
                const catUtilization = (category.spent / category.allocated) * 100
                const isWarning = catUtilization > 80
                const isCritical = catUtilization > 95

                return (
                  <button
                    key={category.id}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCategoryClick(category.id)
                    }}
                    className="p-4 rounded-lg bg-slate-800/50 border border-symtex-border hover:border-symtex-primary/50 transition-colors text-left group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: `${category.color}20` }}
                        >
                          <Icon className="w-4 h-4" style={{ color: category.color }} />
                        </div>
                        <div>
                          <p className="font-medium text-white text-sm group-hover:text-symtex-primary transition-colors">
                            {category.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {formatCurrency(category.spent)} / {formatCurrency(category.allocated)}
                          </p>
                        </div>
                      </div>
                      <div className={clsx(
                        'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full',
                        category.trend > 0 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                      )}>
                        {category.trend > 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {Math.abs(category.trend)}%
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(catUtilization, 100)}%`,
                            backgroundColor: isCritical ? '#ef4444' : isWarning ? '#eab308' : category.color
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">
                          {catUtilization.toFixed(1)}% used
                        </span>
                        <span className="text-xs text-slate-500">
                          {formatCurrency(category.allocated - category.spent)} remaining
                        </span>
                      </div>
                    </div>

                    {/* Hover indicator */}
                    <div className="flex items-center justify-end mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs text-symtex-primary flex items-center gap-1">
                        View Details <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Daily Usage Chart Placeholder */}
          <div className="p-5 pt-0">
            <div className="p-4 rounded-lg border border-dashed border-symtex-border bg-symtex-dark/50">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <Info className="w-4 h-4" />
                <span className="text-sm font-medium">Daily Usage Chart</span>
              </div>
              <div className="h-32 flex items-end justify-around gap-2">
                {[35, 42, 58, 45, 67, 52, 78, 65, 82, 70, 55, 48, 62, 75].map((height, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-symtex-primary to-symtex-accent rounded-t opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-slate-500">
                <span>Jan 1</span>
                <span>Today</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 border-t border-symtex-border bg-slate-800/30 flex items-center justify-between">
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <Info className="w-3 h-3" />
              Budget resets in 22 days
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  addToast({
                    title: 'Alert settings',
                    description: 'Configure budget alerts in settings',
                    variant: 'info'
                  })
                }}
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                Set Alerts
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleViewDetails()
                }}
                className="px-4 py-2 rounded-lg bg-symtex-primary text-white text-sm font-medium hover:bg-symtex-primary/90 transition-colors"
              >
                Manage Budget
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
