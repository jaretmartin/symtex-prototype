import {
  Terminal,
  GitBranch,
  History,
  FlaskConical,
  BarChart3,
  Lock,
  ArrowRight,
  Sparkles,
  AlertCircle
} from 'lucide-react'
import clsx from 'clsx'

interface PromptOpsFeature {
  id: string
  name: string
  description: string
  icon: React.ElementType
  status: 'coming-soon' | 'beta' | 'available'
}

/**
 * PromptOps Placeholder Component
 *
 * PromptOps is the system for managing, versioning, and optimizing AI prompts.
 * This placeholder shows where PromptOps features would be integrated.
 *
 * Planned Features:
 * - Prompt Version Control: Git-like versioning for prompts
 * - A/B Testing: Compare prompt performance
 * - Analytics: Track prompt effectiveness
 * - Templates: Reusable prompt templates
 * - Guardrails: Safety and compliance rules
 *
 * PLACEHOLDER NOTE: These features are planned but not yet implemented.
 * This UI demonstrates the intended integration points.
 */

const promptOpsFeatures: PromptOpsFeature[] = [
  {
    id: 'version-control',
    name: 'Prompt Version Control',
    description: 'Track changes and rollback prompts like code',
    icon: GitBranch,
    status: 'coming-soon'
  },
  {
    id: 'ab-testing',
    name: 'A/B Testing',
    description: 'Compare prompt variants and measure performance',
    icon: FlaskConical,
    status: 'coming-soon'
  },
  {
    id: 'analytics',
    name: 'Prompt Analytics',
    description: 'Track success rates, latency, and costs',
    icon: BarChart3,
    status: 'coming-soon'
  },
  {
    id: 'history',
    name: 'Execution History',
    description: 'Full audit trail of all prompt executions',
    icon: History,
    status: 'coming-soon'
  },
  {
    id: 'guardrails',
    name: 'Safety Guardrails',
    description: 'Automated compliance and safety checks',
    icon: Lock,
    status: 'coming-soon'
  }
]

export default function PromptOpsPlaceholder() {
  return (
    <div className="bg-symtex-card rounded-xl border border-symtex-border overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-symtex-border bg-gradient-to-r from-symtex-primary/10 to-symtex-accent/10">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-symtex-primary" />
            PromptOps
          </h2>
          <span className="text-xs font-medium text-symtex-accent bg-symtex-accent/20 px-2 py-1 rounded">
            COMING SOON
          </span>
        </div>
        <p className="text-sm text-slate-400">
          Enterprise-grade prompt management and optimization
        </p>
      </div>

      {/* Placeholder Notice */}
      <div className="p-4 m-4 rounded-lg border border-dashed border-symtex-border bg-symtex-dark/50">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-slate-300 font-medium mb-1">
              Placeholder Component
            </p>
            <p className="text-xs text-slate-500">
              This is a placeholder showing where PromptOps would be integrated.
              The features listed below are planned for future development.
            </p>
          </div>
        </div>
      </div>

      {/* Feature List */}
      <div className="p-4 pt-0 space-y-3">
        {promptOpsFeatures.map((feature) => {
          const Icon = feature.icon
          return (
            <div
              key={feature.id}
              className={clsx(
                'p-4 rounded-lg border border-symtex-border',
                'bg-slate-800/30 opacity-75 cursor-not-allowed'
              )}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-slate-700/50">
                  <Icon className="w-5 h-5 text-slate-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-slate-300">{feature.name}</span>
                    <span className="text-xs text-slate-500 bg-slate-700 px-2 py-0.5 rounded">
                      {feature.status === 'coming-soon' ? 'Coming Soon' : feature.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{feature.description}</p>
                </div>
                <Lock className="w-4 h-4 text-slate-600" />
              </div>
            </div>
          )
        })}
      </div>

      {/* CTA */}
      <div className="p-4 border-t border-symtex-border bg-slate-800/30">
        <button className="w-full py-3 rounded-lg border border-symtex-primary/50 text-symtex-primary hover:bg-symtex-primary/10 transition-colors flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span className="font-medium">Join PromptOps Waitlist</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
