import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Target,
  ArrowRight,
  Clock,
  AlertCircle,
  CheckCircle2,
  Pause,
  Plus
} from 'lucide-react'
import clsx from 'clsx'
import { useMissionStore } from '@/store/useMissionStore'
import WidgetSkeleton from './WidgetSkeleton'
import type { Mission, MissionPriority, MissionStatus } from '@/types'

interface ActiveMissionsWidgetProps {
  className?: string
  maxItems?: number
}

// Mock data for when store is empty
const mockMissions: Mission[] = [
  {
    id: 'mission-1',
    title: 'Customer Support Automation',
    description: 'Automate tier-1 customer support queries',
    priority: 'high',
    status: 'active',
    progress: 68,
    dueDate: '2026-01-20',
    assignees: 3,
    automationLevel: 75,
    tags: ['support', 'automation'],
    subtasks: { completed: 5, total: 8 },
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-18T14:30:00Z'
  },
  {
    id: 'mission-2',
    title: 'Data Pipeline Optimization',
    description: 'Reduce ETL processing time by 40%',
    priority: 'critical',
    status: 'active',
    progress: 45,
    dueDate: '2026-01-25',
    assignees: 2,
    automationLevel: 60,
    tags: ['data', 'performance'],
    subtasks: { completed: 3, total: 7 },
    createdAt: '2024-01-12T09:00:00Z',
    updatedAt: '2024-01-17T16:00:00Z'
  },
  {
    id: 'mission-3',
    title: 'Knowledge Base Expansion',
    description: 'Add 500 new FAQ entries to AI knowledge base',
    priority: 'medium',
    status: 'pending',
    progress: 22,
    dueDate: '2026-02-01',
    assignees: 1,
    automationLevel: 40,
    tags: ['knowledge', 'content'],
    subtasks: { completed: 110, total: 500 },
    createdAt: '2024-01-08T11:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z'
  }
]

const priorityConfig: Record<MissionPriority, {
  color: string
  bg: string
  label: string
}> = {
  critical: { color: 'text-red-400', bg: 'bg-red-500/20', label: 'Critical' },
  high: { color: 'text-orange-400', bg: 'bg-orange-500/20', label: 'High' },
  medium: { color: 'text-yellow-400', bg: 'bg-yellow-500/20', label: 'Medium' },
  low: { color: 'text-blue-400', bg: 'bg-blue-500/20', label: 'Low' }
}

const statusConfig: Record<MissionStatus, {
  icon: React.ElementType
  color: string
}> = {
  active: { icon: Clock, color: 'text-green-400' },
  pending: { icon: Pause, color: 'text-yellow-400' },
  completed: { icon: CheckCircle2, color: 'text-blue-400' },
  blocked: { icon: AlertCircle, color: 'text-red-400' }
}

/**
 * ActiveMissionsWidget Component
 *
 * Displays active missions on the dashboard.
 * Features:
 * - Loading skeleton state
 * - Connects to mission store
 * - Shows progress and subtask status
 * - Priority and status indicators
 * - Quick navigation to mission details
 * - Empty state with create action
 */
export default function ActiveMissionsWidget({
  className,
  maxItems = 3
}: ActiveMissionsWidgetProps): JSX.Element {
  const navigate = useNavigate()
  const { missions, setMissions, isLoading: storeLoading } = useMissionStore()

  const [isLoading, setIsLoading] = useState(true)

  // Load missions (use mock data if store is empty)
  useEffect(() => {
    const loadData = async (): Promise<void> => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))

      if (missions.length === 0) {
        setMissions(mockMissions)
      }
      setIsLoading(false)
    }

    loadData()
  }, [missions.length, setMissions])

  // Handle mission click
  const handleMissionClick = useCallback((mission: Mission): void => {
    navigate(`/runs/${mission.id}`)
  }, [navigate])

  // Handle create new mission
  const handleCreateMission = useCallback((): void => {
    navigate('/control/lux')
  }, [navigate])

  // Filter to active/pending missions and limit
  const activeMissions = missions
    .filter(m => m.status === 'active' || m.status === 'pending')
    .slice(0, maxItems)

  // Calculate days until due
  const getDaysUntilDue = (dueDate: string): number => {
    const due = new Date(dueDate)
    const today = new Date()
    const diffTime = due.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  // Get due date color based on urgency
  const getDueDateColor = (dueDate: string): string => {
    const days = getDaysUntilDue(dueDate)
    if (days < 0) return 'text-red-400'
    if (days <= 3) return 'text-orange-400'
    if (days <= 7) return 'text-yellow-400'
    return 'text-muted-foreground'
  }

  // Show loading skeleton
  if (isLoading || storeLoading) {
    return <WidgetSkeleton height={280} showHeader={true} rows={3} className={className} />
  }

  // Show empty state
  if (activeMissions.length === 0) {
    return (
      <div className={clsx(
        'bg-card rounded-xl border border-border overflow-hidden',
        className
      )}>
        <div className="p-5 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Target className="w-5 h-5 text-symtex-primary" />
            Active Missions
          </h2>
        </div>
        <div className="p-8 flex flex-col items-center justify-center text-center">
          <div className="p-4 rounded-full bg-card mb-4">
            <Target className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No Active Missions</h3>
          <p className="text-sm text-muted-foreground max-w-xs mb-4">
            Create a mission to track your AI operations goals and progress.
          </p>
          <button
            onClick={handleCreateMission}
            className="flex items-center gap-2 px-4 py-2 rounded-lg gradient-primary text-white font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Create Mission
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
      <div className="p-5 border-b border-border flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Target className="w-5 h-5 text-symtex-primary" />
          Active Missions
          <span className="text-xs bg-symtex-primary/20 text-symtex-primary px-2 py-0.5 rounded-full">
            {activeMissions.length}
          </span>
        </h2>
        <button
          onClick={handleCreateMission}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Missions List */}
      <div className="divide-y divide-border">
        {activeMissions.map((mission) => {
          const priority = priorityConfig[mission.priority]
          const status = statusConfig[mission.status]
          const StatusIcon = status.icon
          const daysLeft = getDaysUntilDue(mission.dueDate)

          return (
            <div
              key={mission.id}
              onClick={() => handleMissionClick(mission)}
              className="p-4 hover:bg-card/30 transition-colors cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                {/* Status Icon */}
                <div className={clsx(
                  'p-2 rounded-lg flex-shrink-0',
                  mission.priority === 'critical' ? 'bg-red-500/20' : 'bg-symtex-primary/20'
                )}>
                  <StatusIcon className={clsx('w-4 h-4', status.color)} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-foreground truncate group-hover:text-symtex-primary transition-colors">
                      {mission.title}
                    </h4>
                    <span className={clsx(
                      'text-xs px-1.5 py-0.5 rounded',
                      priority.bg, priority.color
                    )}>
                      {priority.label}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-symtex-primary transition-all duration-500"
                        style={{ width: `${mission.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {mission.progress}%
                    </span>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-muted-foreground">
                      {mission.subtasks.completed}/{mission.subtasks.total} tasks
                    </span>
                    <span className={getDueDateColor(mission.dueDate)}>
                      {daysLeft < 0
                        ? `${Math.abs(daysLeft)} days overdue`
                        : daysLeft === 0
                          ? 'Due today'
                          : `${daysLeft} days left`}
                    </span>
                  </div>
                </div>

                {/* Arrow */}
                <button className="p-1.5 rounded-lg text-muted-foreground group-hover:text-symtex-primary transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border bg-card/30 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {missions.filter(m => m.status === 'active').length} active,{' '}
          {missions.filter(m => m.status === 'pending').length} pending
        </p>
        <button
          onClick={() => navigate('/runs')}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          View All Missions
        </button>
      </div>
    </div>
  )
}
