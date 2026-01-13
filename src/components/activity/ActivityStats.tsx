import {
  MessageSquare,
  Zap,
  CheckCircle2,
  TrendingUp,
  Clock,
  BarChart3
} from 'lucide-react'
import clsx from 'clsx'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: { value: number; isPositive: boolean }
  icon: React.ElementType
  iconColor: string
  iconBg: string
}

function StatCard({ title, value, subtitle, trend, icon: Icon, iconColor, iconBg }: StatCardProps) {
  return (
    <div className="bg-symtex-card rounded-xl p-5 border border-symtex-border hover:border-slate-600 transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className={clsx('p-2.5 rounded-lg', iconBg)}>
          <Icon className={clsx('w-5 h-5', iconColor)} />
        </div>
        {trend && (
          <div className={clsx(
            'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full',
            trend.isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          )}>
            <TrendingUp className={clsx('w-3 h-3', !trend.isPositive && 'rotate-180')} />
            {trend.value}%
          </div>
        )}
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-sm text-slate-400">{title}</p>
      {subtitle && (
        <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
      )}
    </div>
  )
}

/**
 * ActivityStats Component
 *
 * This component was originally in the Activity page (/src/routes/activity/index.tsx)
 * and has been identified as well-designed. It displays key AI operation metrics:
 * - Conversations: Total AI conversations this period
 * - Cognate Actions: AI-initiated actions/decisions
 * - Automation Success: Percentage of successful automations
 *
 * DECISION: Merged into Home page because:
 * 1. Activity page navigation was redundant (Activity link -> Home)
 * 2. These stats provide immediate value on the dashboard
 * 3. Reduces navigation complexity for users
 * 4. Home becomes the single source of truth for operational overview
 */
export default function ActivityStats() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-symtex-primary" />
          Activity Overview
        </h2>
        <button className="text-sm text-symtex-primary hover:text-symtex-secondary transition-colors">
          View Details
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Conversations"
          value="1,247"
          subtitle="This week"
          trend={{ value: 12, isPositive: true }}
          icon={MessageSquare}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/20"
        />
        <StatCard
          title="Cognate Actions"
          value="3,892"
          subtitle="AI-initiated decisions"
          trend={{ value: 8, isPositive: true }}
          icon={Zap}
          iconColor="text-purple-400"
          iconBg="bg-purple-500/20"
        />
        <StatCard
          title="Automation Success"
          value="94.2%"
          subtitle="Last 30 days"
          trend={{ value: 2.3, isPositive: true }}
          icon={CheckCircle2}
          iconColor="text-green-400"
          iconBg="bg-green-500/20"
        />
      </div>

      {/* Recent Activity Timeline */}
      <div className="bg-symtex-card rounded-xl p-5 border border-symtex-border mt-4">
        <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Recent Activity
        </h3>
        <div className="space-y-3">
          {[
            { action: 'Customer support query resolved', time: '2 min ago', type: 'success' },
            { action: 'Data pipeline completed', time: '15 min ago', type: 'success' },
            { action: 'New automation workflow created', time: '1 hour ago', type: 'info' },
            { action: 'Security scan completed', time: '2 hours ago', type: 'warning' }
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className={clsx(
                'w-2 h-2 rounded-full',
                item.type === 'success' && 'bg-green-400',
                item.type === 'info' && 'bg-blue-400',
                item.type === 'warning' && 'bg-yellow-400'
              )} />
              <span className="flex-1 text-sm text-slate-300">{item.action}</span>
              <span className="text-xs text-slate-500">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
