import {
  TrendingUp,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Brain
} from 'lucide-react'
import clsx from 'clsx'

interface Insight {
  id: string
  title: string
  description: string
  type: 'improvement' | 'warning' | 'opportunity' | 'achievement'
  impact?: string
  actionable: boolean
}

const insights: Insight[] = [
  {
    id: '1',
    title: 'Customer response time improved 23%',
    description: 'AI-handled queries are resolving faster than last week',
    type: 'achievement',
    actionable: false
  },
  {
    id: '2',
    title: 'Optimize embedding costs',
    description: 'Switching to smaller model for FAQ queries could save $120/month',
    type: 'opportunity',
    impact: '-$120/mo',
    actionable: true
  },
  {
    id: '3',
    title: 'Unusual traffic pattern detected',
    description: 'API calls from new region increased 340%',
    type: 'warning',
    actionable: true
  },
  {
    id: '4',
    title: 'New automation suggestion',
    description: 'Repetitive task pattern detected in ticket routing',
    type: 'improvement',
    actionable: true
  }
]

const typeConfig = {
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

export default function InsightsPanel() {
  return (
    <div className="bg-symtex-card rounded-xl border border-symtex-border">
      <div className="p-5 border-b border-symtex-border">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Brain className="w-5 h-5 text-symtex-accent" />
          AI Insights
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Intelligent recommendations based on your usage patterns
        </p>
      </div>

      <div className="divide-y divide-symtex-border">
        {insights.map((insight) => {
          const config = typeConfig[insight.type]
          const Icon = config.icon

          return (
            <div
              key={insight.id}
              className="p-4 hover:bg-slate-800/30 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className={clsx('p-2 rounded-lg', config.bg)}>
                  <Icon className={clsx('w-4 h-4', config.color)} />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-medium text-white text-sm">{insight.title}</h4>
                    {insight.impact && (
                      <span className="text-xs font-medium text-green-400 bg-green-500/20 px-2 py-0.5 rounded">
                        {insight.impact}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">{insight.description}</p>

                  {insight.actionable && (
                    <button className="mt-2 text-xs text-symtex-primary hover:text-symtex-secondary transition-colors flex items-center gap-1">
                      Take Action
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="p-4 border-t border-symtex-border bg-slate-800/30">
        <button className="w-full text-center text-sm text-slate-400 hover:text-white transition-colors">
          View All Insights
        </button>
      </div>
    </div>
  )
}
