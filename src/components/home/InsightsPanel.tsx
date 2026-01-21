import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  TrendingUp,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Brain,
  X,
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
  RefreshCcw
} from 'lucide-react'
import clsx from 'clsx'
import { useUIStore } from '@/store/useUIStore'
import WidgetSkeleton from './WidgetSkeleton'

type InsightType = 'improvement' | 'warning' | 'opportunity' | 'achievement'
type InsightCategory = 'all' | 'performance' | 'costs' | 'security' | 'automation'

interface Insight {
  id: string
  title: string
  description: string
  type: InsightType
  category: InsightCategory
  impact?: string
  actionable: boolean
  route?: string
  dismissed?: boolean
  helpful?: boolean | null
}

interface InsightsPanelProps {
  className?: string
}

// Mock data - in production, this would come from a store or API
const mockInsights: Insight[] = [
  {
    id: '1',
    title: 'Customer response time improved 23%',
    description: 'AI-handled queries are resolving faster than last week',
    type: 'achievement',
    category: 'performance',
    actionable: false,
    helpful: null
  },
  {
    id: '2',
    title: 'Optimize embedding costs',
    description: 'Switching to smaller model for FAQ queries could save $120/month',
    type: 'opportunity',
    category: 'costs',
    impact: '-$120/mo',
    actionable: true,
    route: '/settings/budget',
    helpful: null
  },
  {
    id: '3',
    title: 'Unusual traffic pattern detected',
    description: 'API calls from new region increased 340%',
    type: 'warning',
    category: 'security',
    actionable: true,
    route: '/settings/security',
    helpful: null
  },
  {
    id: '4',
    title: 'New automation suggestion',
    description: 'Repetitive task pattern detected in ticket routing',
    type: 'improvement',
    category: 'automation',
    actionable: true,
    route: '/studio/automations',
    helpful: null
  },
  {
    id: '5',
    title: 'Cognate efficiency increased',
    description: 'Support cognate now handles 15% more queries without escalation',
    type: 'achievement',
    category: 'performance',
    actionable: false,
    helpful: null
  }
]

const typeConfig: Record<InsightType, {
  icon: React.ElementType
  color: string
  bg: string
}> = {
  improvement: {
    icon: TrendingUp,
    color: 'text-blue-400',
    bg: 'bg-blue-500/20'
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/20'
  },
  opportunity: {
    icon: Sparkles,
    color: 'text-green-400',
    bg: 'bg-green-500/20'
  },
  achievement: {
    icon: TrendingUp,
    color: 'text-purple-400',
    bg: 'bg-purple-500/20'
  }
}

const categories: { value: InsightCategory; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'performance', label: 'Performance' },
  { value: 'costs', label: 'Costs' },
  { value: 'security', label: 'Security' },
  { value: 'automation', label: 'Automation' }
]

/**
 * InsightsPanel Component
 *
 * Displays AI-generated insights and recommendations.
 * Features:
 * - Loading skeleton state
 * - Category tabs for filtering
 * - Dismiss individual insights
 * - Mark insights as helpful/not helpful
 * - Navigate to relevant routes
 * - Impact badges for cost savings
 * - Empty state when no insights
 */
export default function InsightsPanel({ className }: InsightsPanelProps): JSX.Element {
  const navigate = useNavigate()
  const addToast = useUIStore((state) => state.addToast)

  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [insights, setInsights] = useState<Insight[]>([])
  const [activeCategory, setActiveCategory] = useState<InsightCategory>('all')

  // Simulate data loading
  useEffect(() => {
    const loadData = async (): Promise<void> => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 700))
      setInsights(mockInsights)
      setIsLoading(false)
    }

    loadData()
  }, [])

  // Handle refresh
  const handleRefresh = useCallback(async (): Promise<void> => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setInsights(mockInsights)
    setIsRefreshing(false)
    addToast({
      title: 'Insights refreshed',
      description: 'Latest AI analysis loaded',
      variant: 'success',
      duration: 2000
    })
  }, [addToast])

  // Handle dismiss insight
  const handleDismiss = useCallback((e: React.MouseEvent, insightId: string): void => {
    e.stopPropagation()
    setInsights(prev => prev.filter(i => i.id !== insightId))
    addToast({
      title: 'Insight dismissed',
      variant: 'info',
      duration: 2000
    })
  }, [addToast])

  // Handle take action
  const handleTakeAction = useCallback((insight: Insight): void => {
    if (insight.route) {
      navigate(insight.route)
    }
  }, [navigate])

  // Handle helpful feedback
  const handleFeedback = useCallback((e: React.MouseEvent, insightId: string, helpful: boolean): void => {
    e.stopPropagation()
    setInsights(prev => prev.map(i =>
      i.id === insightId ? { ...i, helpful } : i
    ))
    addToast({
      title: helpful ? 'Thanks for the feedback!' : 'Got it, we\'ll improve',
      variant: 'info',
      duration: 2000
    })
  }, [addToast])

  // Filter insights by category
  const filteredInsights = activeCategory === 'all'
    ? insights
    : insights.filter(i => i.category === activeCategory)

  // Count by category
  const getCategoryCount = (category: InsightCategory): number => {
    if (category === 'all') return insights.length
    return insights.filter(i => i.category === category).length
  }

  // Show loading skeleton
  if (isLoading) {
    return <WidgetSkeleton height={350} showHeader={true} rows={4} className={className} />
  }

  return (
    <div className={clsx(
      'bg-card rounded-xl border border-border overflow-hidden',
      className
    )}>
      {/* Header */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Brain className="w-5 h-5 text-symtex-accent" />
            AI Insights
            {insights.filter(i => i.type === 'warning').length > 0 && (
              <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">
                {insights.filter(i => i.type === 'warning').length} alert
              </span>
            )}
          </h2>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
          >
            <RefreshCcw className={clsx('w-4 h-4', isRefreshing && 'animate-spin')} />
          </button>
        </div>
        <p className="text-sm text-muted-foreground">
          Intelligent recommendations based on your usage patterns
        </p>
      </div>

      {/* Category Tabs */}
      <div className="px-5 py-3 border-b border-border bg-surface-card/30 overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          {categories.map((cat) => {
            const count = getCategoryCount(cat.value)
            return (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={clsx(
                  'px-3 py-1.5 text-xs rounded-full transition-colors whitespace-nowrap',
                  activeCategory === cat.value
                    ? 'bg-symtex-primary text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                {cat.label}
                {count > 0 && (
                  <span className={clsx(
                    'ml-1.5 px-1.5 rounded-full text-xs',
                    activeCategory === cat.value ? 'bg-white/20' : 'bg-muted'
                  )}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Insights List */}
      <div className="divide-y divide-border max-h-[320px] overflow-y-auto">
        {filteredInsights.length === 0 ? (
          <div className="p-8 flex flex-col items-center justify-center text-center">
            <div className="p-4 rounded-full bg-surface-card mb-4">
              <Lightbulb className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No Insights</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              {activeCategory === 'all'
                ? 'Your AI is analyzing patterns. Check back soon for recommendations.'
                : `No ${activeCategory} insights at this time.`}
            </p>
          </div>
        ) : (
          filteredInsights.map((insight) => {
            const config = typeConfig[insight.type]
            const Icon = config.icon

            return (
              <div
                key={insight.id}
                className="p-4 hover:bg-surface-card/30 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <div className={clsx('p-2 rounded-lg flex-shrink-0', config.bg)}>
                    <Icon className={clsx('w-4 h-4', config.color)} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-medium text-foreground text-sm">{insight.title}</h4>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {insight.impact && (
                          <span className="text-xs font-medium text-green-400 bg-green-500/20 px-2 py-0.5 rounded">
                            {insight.impact}
                          </span>
                        )}
                        <button
                          onClick={(e) => handleDismiss(e, insight.id)}
                          className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{insight.description}</p>

                    <div className="flex items-center justify-between mt-2">
                      {insight.actionable && (
                        <button
                          onClick={() => handleTakeAction(insight)}
                          className="text-xs text-symtex-primary hover:text-symtex-secondary transition-colors flex items-center gap-1"
                        >
                          Take Action
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}

                      {/* Feedback buttons */}
                      <div className="flex items-center gap-1 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs text-muted-foreground mr-1">Helpful?</span>
                        <button
                          onClick={(e) => handleFeedback(e, insight.id, true)}
                          className={clsx(
                            'p-1 rounded transition-colors',
                            insight.helpful === true
                              ? 'bg-green-500/20 text-green-400'
                              : 'text-muted-foreground hover:text-green-400 hover:bg-green-500/10'
                          )}
                        >
                          <ThumbsUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => handleFeedback(e, insight.id, false)}
                          className={clsx(
                            'p-1 rounded transition-colors',
                            insight.helpful === false
                              ? 'bg-red-500/20 text-red-400'
                              : 'text-muted-foreground hover:text-red-400 hover:bg-red-500/10'
                          )}
                        >
                          <ThumbsDown className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border bg-surface-card/30 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {filteredInsights.length} insight{filteredInsights.length !== 1 ? 's' : ''}
          {activeCategory !== 'all' && ` in ${activeCategory}`}
        </p>
        <button
          onClick={() => navigate('/insights')}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          View All Insights
        </button>
      </div>
    </div>
  )
}
