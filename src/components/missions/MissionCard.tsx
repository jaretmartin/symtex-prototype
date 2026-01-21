import {
  Clock,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Users,
  Zap,
  Calendar
} from 'lucide-react'
import clsx from 'clsx'
import ProgressRing from '../ui/ProgressRing'

export type MissionPriority = 'critical' | 'high' | 'medium' | 'low'
export type MissionStatus = 'active' | 'pending' | 'completed' | 'blocked'

export interface Mission {
  id: string
  title: string
  description: string
  priority: MissionPriority
  status: MissionStatus
  progress: number
  dueDate: string
  assignees: number
  automationLevel: number // 0-100 percentage of AI automation
  tags: string[]
  subtasks: { completed: number; total: number }
}

interface MissionCardProps {
  mission: Mission
  viewMode: 'grid' | 'list' | 'kanban'
  onClick?: () => void
}

const priorityConfig = {
  critical: {
    color: '#ef4444',
    bg: 'bg-red-500/10',
    border: 'border-red-500',
    label: 'Critical',
    icon: AlertCircle
  },
  high: {
    color: '#f97316',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500',
    label: 'High',
    icon: AlertCircle
  },
  medium: {
    color: '#eab308',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500',
    label: 'Medium',
    icon: Clock
  },
  low: {
    color: '#22c55e',
    bg: 'bg-green-500/10',
    border: 'border-green-500',
    label: 'Low',
    icon: CheckCircle2
  }
}

const statusConfig = {
  active: { color: 'text-blue-400', bg: 'bg-blue-500/20', label: 'Active' },
  pending: { color: 'text-yellow-400', bg: 'bg-yellow-500/20', label: 'Pending' },
  completed: { color: 'text-green-400', bg: 'bg-green-500/20', label: 'Completed' },
  blocked: { color: 'text-red-400', bg: 'bg-red-500/20', label: 'Blocked' }
}

export default function MissionCard({ mission, viewMode, onClick }: MissionCardProps) {
  const priority = priorityConfig[mission.priority]
  const status = statusConfig[mission.status]
  const PriorityIcon = priority.icon

  if (viewMode === 'list') {
    return (
      <div
        onClick={onClick}
        className={clsx(
          'mission-card bg-card rounded-lg p-4 border border-border cursor-pointer',
          'flex items-center gap-6',
          `border-l-4 ${priority.border}`
        )}
      >
        <ProgressRing progress={mission.progress} size={48} color={priority.color} />

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{mission.title}</h3>
          <p className="text-sm text-muted-foreground truncate">{mission.description}</p>
        </div>

        <div className="flex items-center gap-6">
          <div className={clsx('px-3 py-1 rounded-full text-xs font-medium', status.bg, status.color)}>
            {status.label}
          </div>

          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Calendar className="w-4 h-4" />
            {mission.dueDate}
          </div>

          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Users className="w-4 h-4" />
            {mission.assignees}
          </div>

          <ArrowRight className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>
    )
  }

  // Grid and Kanban view (card format)
  return (
    <div
      onClick={onClick}
      className={clsx(
        'mission-card bg-card rounded-xl p-5 border border-border cursor-pointer',
        `border-l-4 ${priority.border}`,
        viewMode === 'kanban' && 'w-full'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <PriorityIcon className="w-4 h-4" style={{ color: priority.color }} />
          <span className={clsx('text-xs font-medium px-2 py-0.5 rounded', priority.bg)}
                style={{ color: priority.color }}>
            {priority.label}
          </span>
        </div>
        <div className={clsx('px-2 py-1 rounded-full text-xs font-medium', status.bg, status.color)}>
          {status.label}
        </div>
      </div>

      {/* Title and Description */}
      <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{mission.title}</h3>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{mission.description}</p>

      {/* Progress Section */}
      <div className="flex items-center gap-4 mb-4">
        <ProgressRing progress={mission.progress} size={56} color={priority.color} />
        <div className="flex-1">
          <div className="text-sm text-muted-foreground mb-1">Progress</div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${mission.progress}%`, backgroundColor: priority.color }}
            />
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {mission.subtasks.completed}/{mission.subtasks.total} subtasks
          </div>
        </div>
      </div>

      {/* AI Automation Indicator */}
      <div className="flex items-center gap-2 mb-4 p-2 rounded-lg bg-symtex-primary/10 border border-symtex-primary/20">
        <Zap className="w-4 h-4 text-symtex-primary" />
        <span className="text-xs text-symtex-primary font-medium">
          {mission.automationLevel}% AI Automated
        </span>
        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-symtex-primary rounded-full"
            style={{ width: `${mission.automationLevel}%` }}
          />
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {mission.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-1 rounded bg-muted/50 text-muted-foreground"
          >
            {tag}
          </span>
        ))}
        {mission.tags.length > 3 && (
          <span className="text-xs px-2 py-1 rounded bg-muted/50 text-muted-foreground">
            +{mission.tags.length - 3}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Calendar className="w-4 h-4" />
          <span>{mission.dueDate}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Users className="w-4 h-4" />
          <span>{mission.assignees} assigned</span>
        </div>
      </div>
    </div>
  )
}
