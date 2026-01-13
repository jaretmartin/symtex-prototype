import {
  Play,
  AlertCircle,
  Clock,
  CheckCircle2,
  ArrowRight,
  Zap,
  RefreshCcw
} from 'lucide-react'
import clsx from 'clsx'

interface Action {
  id: string
  title: string
  description: string
  type: 'urgent' | 'recommended' | 'completed' | 'scheduled'
  time?: string
  automatable?: boolean
}

const actions: Action[] = [
  {
    id: '1',
    title: 'Security scan requires attention',
    description: '3 medium-severity issues found in latest scan',
    type: 'urgent',
    automatable: false
  },
  {
    id: '2',
    title: 'Data backup scheduled',
    description: 'Automatic backup will run at 2:00 AM',
    type: 'scheduled',
    time: '2:00 AM'
  },
  {
    id: '3',
    title: 'Update prompt templates',
    description: 'New optimizations available for customer support prompts',
    type: 'recommended',
    automatable: true
  },
  {
    id: '4',
    title: 'API rate limits optimized',
    description: 'Completed 2 hours ago',
    type: 'completed',
    time: '2h ago'
  }
]

const typeConfig = {
  urgent: {
    icon: AlertCircle,
    color: 'text-red-400',
    bg: 'bg-red-500/20',
    border: 'border-red-500/30'
  },
  recommended: {
    icon: Zap,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/20',
    border: 'border-yellow-500/30'
  },
  completed: {
    icon: CheckCircle2,
    color: 'text-green-400',
    bg: 'bg-green-500/20',
    border: 'border-green-500/30'
  },
  scheduled: {
    icon: Clock,
    color: 'text-blue-400',
    bg: 'bg-blue-500/20',
    border: 'border-blue-500/30'
  }
}

export default function ActionCenter() {
  return (
    <div className="bg-symtex-card rounded-xl border border-symtex-border">
      <div className="p-5 border-b border-symtex-border flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Play className="w-5 h-5 text-symtex-primary" />
          Action Center
        </h2>
        <button className="text-sm text-symtex-primary hover:text-symtex-secondary transition-colors flex items-center gap-1">
          <RefreshCcw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="divide-y divide-symtex-border">
        {actions.map((action) => {
          const config = typeConfig[action.type]
          const Icon = config.icon

          return (
            <div
              key={action.id}
              className={clsx(
                'p-4 flex items-start gap-4 hover:bg-slate-800/30 transition-colors cursor-pointer',
                action.type === 'completed' && 'opacity-60'
              )}
            >
              <div className={clsx('p-2 rounded-lg', config.bg)}>
                <Icon className={clsx('w-5 h-5', config.color)} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-white truncate">{action.title}</h4>
                  {action.automatable && (
                    <span className="text-xs bg-symtex-primary/20 text-symtex-primary px-2 py-0.5 rounded">
                      AI Can Handle
                    </span>
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

              {action.type !== 'completed' && (
                <button className={clsx(
                  'p-2 rounded-lg border transition-colors',
                  config.bg, config.border, 'hover:opacity-80'
                )}>
                  <ArrowRight className={clsx('w-4 h-4', config.color)} />
                </button>
              )}
            </div>
          )
        })}
      </div>

      <div className="p-4 border-t border-symtex-border bg-slate-800/30">
        <button className="w-full text-center text-sm text-slate-400 hover:text-white transition-colors">
          View All Actions
        </button>
      </div>
    </div>
  )
}
