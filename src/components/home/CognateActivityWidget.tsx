import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bot,
  ArrowRight,
  Activity,
  MessageSquare,
  Zap,
  CheckCircle2,
  AlertCircle,
  TrendingUp
} from 'lucide-react'
import clsx from 'clsx'
import { useCognateStore } from '@/store/useCognateStore'
import WidgetSkeleton from './WidgetSkeleton'

interface CognateActivity {
  id: string
  cognateId: string
  cognateName: string
  action: string
  timestamp: string
  type: 'message' | 'action' | 'escalation' | 'success' | 'error'
}

interface CognateActivityWidgetProps {
  className?: string
  maxItems?: number
}

// Mock activity data
const mockActivities: CognateActivity[] = [
  {
    id: 'act-1',
    cognateId: 'cog-1',
    cognateName: 'Customer Support Agent',
    action: 'Resolved ticket #4521 automatically',
    timestamp: '2 min ago',
    type: 'success'
  },
  {
    id: 'act-2',
    cognateId: 'cog-1',
    cognateName: 'Customer Support Agent',
    action: 'Escalated complex query to human support',
    timestamp: '15 min ago',
    type: 'escalation'
  },
  {
    id: 'act-3',
    cognateId: 'cog-2',
    cognateName: 'Sales Assistant',
    action: 'Qualified 3 new leads from chat',
    timestamp: '1 hour ago',
    type: 'action'
  },
  {
    id: 'act-4',
    cognateId: 'cog-1',
    cognateName: 'Customer Support Agent',
    action: 'Handled 47 conversations today',
    timestamp: '2 hours ago',
    type: 'message'
  },
  {
    id: 'act-5',
    cognateId: 'cog-2',
    cognateName: 'Sales Assistant',
    action: 'Failed to connect to CRM - retrying',
    timestamp: '3 hours ago',
    type: 'error'
  }
]

const activityTypeConfig: Record<CognateActivity['type'], {
  icon: React.ElementType
  color: string
  bg: string
}> = {
  message: { icon: MessageSquare, color: 'text-blue-400', bg: 'bg-blue-500/20' },
  action: { icon: Zap, color: 'text-purple-400', bg: 'bg-purple-500/20' },
  escalation: { icon: AlertCircle, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  success: { icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/20' },
  error: { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/20' }
}

/**
 * CognateActivityWidget Component
 *
 * Displays recent Cognate (AI agent) activity on the dashboard.
 * Features:
 * - Loading skeleton state
 * - Connects to cognate store
 * - Shows recent activity feed
 * - Active cognate status indicators
 * - Quick navigation to cognate details
 * - Empty state when no cognates
 */
export default function CognateActivityWidget({
  className,
  maxItems = 5
}: CognateActivityWidgetProps): JSX.Element {
  const navigate = useNavigate()
  const { cognates } = useCognateStore()

  const [isLoading, setIsLoading] = useState(true)
  const [activities, setActivities] = useState<CognateActivity[]>([])

  // Load activities
  useEffect(() => {
    const loadData = async (): Promise<void> => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 600))
      setActivities(mockActivities)
      setIsLoading(false)
    }

    loadData()
  }, [])

  // Handle activity click
  const handleActivityClick = useCallback((activity: CognateActivity): void => {
    navigate(`/studio/cognates/${activity.cognateId}`)
  }, [navigate])

  // Handle create cognate
  const handleCreateCognate = useCallback((): void => {
    navigate('/studio/cognates/new')
  }, [navigate])

  // Get active cognates
  const activeCognates = cognates.filter(c => c.status === 'active')

  // Show loading skeleton
  if (isLoading) {
    return <WidgetSkeleton height={350} showHeader={true} rows={5} className={className} />
  }

  // Show empty state
  if (cognates.length === 0) {
    return (
      <div className={clsx(
        'bg-card rounded-xl border border-border overflow-hidden',
        className
      )}>
        <div className="p-5 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Bot className="w-5 h-5 text-symtex-accent" />
            Cognate Activity
          </h2>
        </div>
        <div className="p-8 flex flex-col items-center justify-center text-center">
          <div className="p-4 rounded-full bg-surface-card mb-4">
            <Bot className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No Cognates Yet</h3>
          <p className="text-sm text-muted-foreground max-w-xs mb-4">
            Create your first AI cognate to start automating tasks and conversations.
          </p>
          <button
            onClick={handleCreateCognate}
            className="flex items-center gap-2 px-4 py-2 rounded-lg gradient-primary text-white font-medium hover:opacity-90 transition-opacity"
          >
            <Bot className="w-4 h-4" />
            Create Cognate
          </button>
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
      <div className="p-5 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Bot className="w-5 h-5 text-symtex-accent" />
            Cognate Activity
          </h2>
          <button
            onClick={() => navigate('/studio/cognates')}
            className="text-sm text-symtex-primary hover:text-symtex-secondary transition-colors flex items-center gap-1"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Active Cognates Status */}
        <div className="flex items-center gap-3 flex-wrap">
          {activeCognates.slice(0, 3).map((cognate) => (
            <button
              key={cognate.id}
              onClick={() => navigate(`/studio/cognates/${cognate.id}`)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-symtex-border hover:border-symtex-primary/50 transition-colors"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-xs text-foreground">{cognate.name}</span>
            </button>
          ))}
          {activeCognates.length > 3 && (
            <span className="text-xs text-muted-foreground">
              +{activeCognates.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Activity Feed */}
      <div className="divide-y divide-symtex-border max-h-[280px] overflow-y-auto">
        {activities.slice(0, maxItems).map((activity) => {
          const config = activityTypeConfig[activity.type]
          const Icon = config.icon

          return (
            <div
              key={activity.id}
              onClick={() => handleActivityClick(activity)}
              className="p-4 hover:bg-slate-800/30 transition-colors cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                <div className={clsx('p-2 rounded-lg flex-shrink-0', config.bg)}>
                  <Icon className={clsx('w-4 h-4', config.color)} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-muted-foreground">{activity.cognateName}</span>
                    <span className="text-xs text-slate-600">-</span>
                    <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                  </div>
                  <p className="text-sm text-white group-hover:text-symtex-primary transition-colors">
                    {activity.action}
                  </p>
                </div>

                <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </div>
            </div>
          )
        })}
      </div>

      {/* Stats Footer */}
      <div className="p-4 border-t border-symtex-border bg-slate-800/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-green-400" />
              <span className="text-muted-foreground">{activeCognates.length} active</span>
            </span>
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-muted-foreground">127 actions today</span>
            </span>
          </div>
          <button
            onClick={() => navigate('/activity')}
            className="text-xs text-muted-foreground hover:text-white transition-colors"
          >
            Full Activity Log
          </button>
        </div>
      </div>
    </div>
  )
}
