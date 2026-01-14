import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Play,
  AlertCircle,
  Clock,
  CheckCircle2,
  ArrowRight,
  Zap,
  RefreshCcw,
  Inbox,
  Filter,
  X,
  Sparkles
} from 'lucide-react'
import clsx from 'clsx'
import { useUIStore } from '@/store/useUIStore'
import WidgetSkeleton from './WidgetSkeleton'

type ActionType = 'urgent' | 'recommended' | 'completed' | 'scheduled'

interface Action {
  id: string
  title: string
  description: string
  type: ActionType
  time?: string
  automatable?: boolean
  route?: string
  dismissible?: boolean
}

interface ActionCenterProps {
  className?: string
}

// Mock data - in production, this would come from a store or API
const mockActions: Action[] = [
  {
    id: '1',
    title: 'Security scan requires attention',
    description: '3 medium-severity issues found in latest scan',
    type: 'urgent',
    automatable: false,
    route: '/settings/security',
    dismissible: false
  },
  {
    id: '2',
    title: 'Data backup scheduled',
    description: 'Automatic backup will run at 2:00 AM',
    type: 'scheduled',
    time: '2:00 AM',
    route: '/settings/backups',
    dismissible: true
  },
  {
    id: '3',
    title: 'Update prompt templates',
    description: 'New optimizations available for customer support prompts',
    type: 'recommended',
    automatable: true,
    route: '/library/templates',
    dismissible: true
  },
  {
    id: '4',
    title: 'API rate limits optimized',
    description: 'Completed 2 hours ago',
    type: 'completed',
    time: '2h ago',
    dismissible: true
  }
]

const typeConfig: Record<ActionType, {
  icon: React.ElementType
  color: string
  bg: string
  border: string
  label: string
}> = {
  urgent: {
    icon: AlertCircle,
    color: 'text-red-400',
    bg: 'bg-red-500/20',
    border: 'border-red-500/30',
    label: 'Urgent'
  },
  recommended: {
    icon: Zap,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/20',
    border: 'border-yellow-500/30',
    label: 'Recommended'
  },
  completed: {
    icon: CheckCircle2,
    color: 'text-green-400',
    bg: 'bg-green-500/20',
    border: 'border-green-500/30',
    label: 'Completed'
  },
  scheduled: {
    icon: Clock,
    color: 'text-blue-400',
    bg: 'bg-blue-500/20',
    border: 'border-blue-500/30',
    label: 'Scheduled'
  }
}

const filterOptions: ActionType[] = ['urgent', 'recommended', 'scheduled', 'completed']

/**
 * ActionCenter Component
 *
 * Displays actionable items requiring user attention.
 * Features:
 * - Loading skeleton state
 * - Empty state when no actions
 * - Filter by action type
 * - Dismiss completed/non-critical actions
 * - Navigate to relevant routes on click
 * - AI automation badge for automatable tasks
 * - Refresh functionality
 */
export default function ActionCenter({ className }: ActionCenterProps): JSX.Element {
  const navigate = useNavigate()
  const addToast = useUIStore((state) => state.addToast)

  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [actions, setActions] = useState<Action[]>([])
  const [activeFilter, setActiveFilter] = useState<ActionType | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // Simulate data loading
  useEffect(() => {
    const loadData = async (): Promise<void> => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 600))
      setActions(mockActions)
      setIsLoading(false)
    }

    loadData()
  }, [])

  // Handle refresh
  const handleRefresh = useCallback(async (): Promise<void> => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    setActions(mockActions)
    setIsRefreshing(false)
    addToast({
      title: 'Actions refreshed',
      variant: 'success',
      duration: 2000
    })
  }, [addToast])

  // Handle action click - navigate to route
  const handleActionClick = useCallback((action: Action): void => {
    if (action.route) {
      navigate(action.route)
    }
  }, [navigate])

  // Handle dismiss action
  const handleDismiss = useCallback((e: React.MouseEvent, actionId: string): void => {
    e.stopPropagation()
    setActions(prev => prev.filter(a => a.id !== actionId))
    addToast({
      title: 'Action dismissed',
      variant: 'info',
      duration: 2000
    })
  }, [addToast])

  // Handle AI automation
  const handleAutomate = useCallback((e: React.MouseEvent, action: Action): void => {
    e.stopPropagation()
    addToast({
      title: 'AI Automation Started',
      description: `Processing: ${action.title}`,
      variant: 'success',
      duration: 3000
    })
    // In production, this would trigger the automation
    setActions(prev => prev.map(a =>
      a.id === action.id ? { ...a, type: 'scheduled' as ActionType } : a
    ))
  }, [addToast])

  // Handle filter toggle
  const handleFilterToggle = useCallback((type: ActionType): void => {
    setActiveFilter(prev => prev === type ? null : type)
  }, [])

  // Filter actions
  const filteredActions = activeFilter
    ? actions.filter(a => a.type === activeFilter)
    : actions

  // Show loading skeleton
  if (isLoading) {
    return <WidgetSkeleton height={320} showHeader={true} rows={4} className={className} />
  }

  // Show empty state
  if (actions.length === 0) {
    return (
      <div className={clsx(
        'bg-symtex-card rounded-xl border border-symtex-border overflow-hidden',
        className
      )}>
        <div className="p-5 border-b border-symtex-border flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Play className="w-5 h-5 text-symtex-primary" />
            Action Center
          </h2>
        </div>
        <div className="p-8 flex flex-col items-center justify-center text-center">
          <div className="p-4 rounded-full bg-slate-800 mb-4">
            <Inbox className="w-8 h-8 text-slate-500" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">All Caught Up!</h3>
          <p className="text-sm text-slate-400 max-w-xs">
            No pending actions require your attention. Your AI systems are running smoothly.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={clsx(
      'bg-symtex-card rounded-xl border border-symtex-border overflow-hidden',
      className
    )}>
      {/* Header */}
      <div className="p-5 border-b border-symtex-border flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Play className="w-5 h-5 text-symtex-primary" />
          Action Center
          {actions.filter(a => a.type === 'urgent').length > 0 && (
            <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
              {actions.filter(a => a.type === 'urgent').length} urgent
            </span>
          )}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={clsx(
              'p-2 rounded-lg transition-colors',
              showFilters || activeFilter
                ? 'bg-symtex-primary/20 text-symtex-primary'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            )}
          >
            <Filter className="w-4 h-4" />
          </button>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="text-sm text-symtex-primary hover:text-symtex-secondary transition-colors flex items-center gap-1 disabled:opacity-50"
          >
            <RefreshCcw className={clsx('w-4 h-4', isRefreshing && 'animate-spin')} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      {showFilters && (
        <div className="px-5 py-3 border-b border-symtex-border bg-slate-800/30 flex items-center gap-2 flex-wrap">
          {filterOptions.map((type) => {
            const config = typeConfig[type]
            const count = actions.filter(a => a.type === type).length
            return (
              <button
                key={type}
                onClick={() => handleFilterToggle(type)}
                className={clsx(
                  'text-xs px-3 py-1.5 rounded-full border transition-colors flex items-center gap-1.5',
                  activeFilter === type
                    ? `${config.bg} ${config.border} ${config.color}`
                    : 'border-symtex-border text-slate-400 hover:text-white hover:border-slate-500'
                )}
              >
                <config.icon className="w-3 h-3" />
                {config.label}
                {count > 0 && (
                  <span className={clsx(
                    'text-xs px-1.5 rounded-full',
                    activeFilter === type ? 'bg-white/20' : 'bg-slate-700'
                  )}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
          {activeFilter && (
            <button
              onClick={() => setActiveFilter(null)}
              className="text-xs text-slate-400 hover:text-white transition-colors ml-auto"
            >
              Clear filter
            </button>
          )}
        </div>
      )}

      {/* Actions List */}
      <div className="divide-y divide-symtex-border max-h-[400px] overflow-y-auto">
        {filteredActions.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-sm text-slate-400">No actions match this filter</p>
          </div>
        ) : (
          filteredActions.map((action) => {
            const config = typeConfig[action.type]
            const Icon = config.icon

            return (
              <div
                key={action.id}
                onClick={() => handleActionClick(action)}
                className={clsx(
                  'p-4 flex items-start gap-4 hover:bg-slate-800/30 transition-colors cursor-pointer group',
                  action.type === 'completed' && 'opacity-60'
                )}
              >
                <div className={clsx('p-2 rounded-lg flex-shrink-0', config.bg)}>
                  <Icon className={clsx('w-5 h-5', config.color)} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-white truncate group-hover:text-symtex-primary transition-colors">
                      {action.title}
                    </h4>
                    {action.automatable && (
                      <button
                        onClick={(e) => handleAutomate(e, action)}
                        className="text-xs bg-symtex-primary/20 text-symtex-primary px-2 py-0.5 rounded hover:bg-symtex-primary/30 transition-colors flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        AI Can Handle
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-slate-400 truncate">{action.description}</p>
                  {action.time && action.type !== 'completed' && (
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {action.time}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {action.dismissible && (
                    <button
                      onClick={(e) => handleDismiss(e, action.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-700/50 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  {action.type !== 'completed' && action.route && (
                    <button className={clsx(
                      'p-2 rounded-lg border transition-colors',
                      config.bg, config.border, 'hover:opacity-80'
                    )}>
                      <ArrowRight className={clsx('w-4 h-4', config.color)} />
                    </button>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-symtex-border bg-slate-800/30 flex items-center justify-between">
        <p className="text-xs text-slate-500">
          {filteredActions.length} action{filteredActions.length !== 1 ? 's' : ''}
          {activeFilter && ` (filtered)`}
        </p>
        <button
          onClick={() => navigate('/actions')}
          className="text-sm text-slate-400 hover:text-white transition-colors"
        >
          View All Actions
        </button>
      </div>
    </div>
  )
}
