import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Workflow,
  Bot,
  Target,
  Layers,
  FileText,
  MessageSquare,
  Settings,
  Sparkles,
  Plus,
  ChevronRight
} from 'lucide-react'
import clsx from 'clsx'

interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ElementType
  color: string
  bg: string
  route: string
  isNew?: boolean
}

interface QuickActionsWidgetProps {
  className?: string
}

const quickActions: QuickAction[] = [
  {
    id: 'new-automation',
    title: 'New Automation',
    description: 'Create a new Automation',
    icon: Workflow,
    color: 'text-blue-400',
    bg: 'bg-blue-500/20',
    route: '/control/lux'
  },
  {
    id: 'new-cognate',
    title: 'New Cognate',
    description: 'Create a Cognate',
    icon: Bot,
    color: 'text-purple-400',
    bg: 'bg-purple-500/20',
    route: '/team/cognates',
    isNew: true
  },
  {
    id: 'new-mission',
    title: 'New Mission',
    description: 'Start a new project',
    icon: Target,
    color: 'text-green-400',
    bg: 'bg-green-500/20',
    route: '/control/lux'
  },
  {
    id: 'new-context',
    title: 'New Context',
    description: 'Create a knowledge space',
    icon: Layers,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/20',
    route: '/spaces'
  },
  {
    id: 'templates',
    title: 'Templates',
    description: 'Browse prompt templates',
    icon: FileText,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/20',
    route: '/library/templates'
  },
  {
    id: 'chat',
    title: 'Quick Chat',
    description: 'Start a conversation',
    icon: MessageSquare,
    color: 'text-pink-400',
    bg: 'bg-pink-500/20',
    route: '/chat'
  }
]

/**
 * QuickActionsWidget Component
 *
 * Provides quick access to common actions from the dashboard.
 * Features:
 * - Grid of action buttons
 * - Visual icons and descriptions
 * - New feature badges
 * - Direct navigation to creation flows
 * - Keyboard shortcut hints
 */
export default function QuickActionsWidget({ className }: QuickActionsWidgetProps): JSX.Element {
  const navigate = useNavigate()

  // Handle action click
  const handleActionClick = useCallback((action: QuickAction): void => {
    navigate(action.route)
  }, [navigate])

  // Handle settings
  const handleSettings = useCallback((): void => {
    navigate('/settings')
  }, [navigate])

  return (
    <div className={clsx(
      'bg-card rounded-xl border border-border overflow-hidden',
      className
    )}>
      {/* Header */}
      <div className="p-5 border-b border-border flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-symtex-accent" />
          Quick Actions
        </h2>
        <button
          onClick={handleSettings}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Actions Grid */}
      <div className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon

            return (
              <button
                key={action.id}
                onClick={() => handleActionClick(action)}
                className="group p-4 rounded-xl bg-card/50 border border-border hover:border-symtex-primary/50 transition-all hover:bg-card/80 text-left relative"
              >
                {action.isNew && (
                  <span className="absolute -top-1 -right-1 text-[10px] font-bold bg-symtex-accent text-white px-1.5 py-0.5 rounded-full">
                    NEW
                  </span>
                )}

                <div className={clsx('p-2.5 rounded-lg w-fit mb-3', action.bg)}>
                  <Icon className={clsx('w-5 h-5', action.color)} />
                </div>

                <h3 className="font-medium text-foreground text-sm mb-1 group-hover:text-symtex-primary transition-colors flex items-center gap-1">
                  {action.title}
                  <Plus className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {action.description}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Keyboard Shortcut Hint */}
      <div className="px-5 py-3 border-t border-border bg-card/30 flex items-center justify-between">
        <p className="text-xs text-muted-foreground flex items-center gap-2">
          <kbd className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono text-[10px]">
            Cmd+K
          </kbd>
          <span>for command palette</span>
        </p>
        <button
          onClick={() => navigate('/settings')}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          All shortcuts
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}
