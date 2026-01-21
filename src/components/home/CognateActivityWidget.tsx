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
  TrendingUp,
} from 'lucide-react'
import clsx from 'clsx'
import { useCognateStore } from '@/store/useCognateStore'
import WidgetSkeleton from './WidgetSkeleton'
import { TraceLink } from '@/components/ui/TraceLink'
import { LedgerLink } from '@/components/ui/LedgerLink'

interface CognateActivity {
  id: string
  cognateId: string
  cognateName: string
  action: string
  timestamp: string
  type: 'message' | 'action' | 'escalation' | 'success' | 'error'
  runId?: string // Optional associated run ID for trace linking
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
    cognateName: 'Aria Support',
    action: 'Resolved ticket #4521 automatically',
    timestamp: '2 min ago',
    type: 'success',
    runId: 'run-001'
  },
  {
    id: 'act-2',
    cognateId: 'cog-1',
    cognateName: 'Aria Support',
    action: 'Escalated complex query to human support',
    timestamp: '15 min ago',
    type: 'escalation',
    runId: 'run-002'
  },
  {
    id: 'act-3',
    cognateId: 'cog-2',
    cognateName: 'Sales Assistant',
    action: 'Qualified 3 new leads from chat',
    timestamp: '1 hour ago',
    type: 'action',
    runId: 'run-003'
  },
  {
    id: 'act-4',
    cognateId: 'cog-1',
    cognateName: 'Aria Support',
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
    type: 'error',
    runId: 'run-005'
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
      'bg-card rounded-xl border border-border overflow-hidden',
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
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/50 border border-border hover:border-symtex-primary/50 transition-colors"
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
      <div className="divide-y divide-border max-h-[280px] overflow-y-auto">
        {activities.slice(0, maxItems).map((activity) => {
          const config = activityTypeConfig[activity.type]
          const Icon = config.icon

          return (
            <div
              key={activity.id}
              className="p-4 hover:bg-card/30 transition-colors group"
            >
              <div className="flex items-start gap-3">
                <div className={clsx('p-2 rounded-lg flex-shrink-0', config.bg)}>
                  <Icon className={clsx('w-4 h-4', config.color)} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-muted-foreground">{activity.cognateName}</span>
                    <span className="text-xs text-muted-foreground">-</span>
                    <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                  </div>
                  <p
                    onClick={() => handleActivityClick(activity)}
                    className="text-sm text-foreground group-hover:text-symtex-primary transition-colors cursor-pointer"
                  >
                    {activity.action}
                  </p>
                  {/* Trace and Ledger Links */}
                  {activity.runId && (
                    <div className="flex items-center gap-3 mt-2">
                      <TraceLink runId={activity.runId} />
                      <LedgerLink runId={activity.runId} cognateId={activity.cognateId} />
                    </div>
                  )}
                </div>

                <ArrowRight
                  onClick={() => handleActivityClick(activity)}
                  className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 cursor-pointer"
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Stats Footer */}
      <div className="p-4 border-t border-border bg-card/30">
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
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Full Activity Log
          </button>
        </div>
      </div>
    </div>
  )
}
