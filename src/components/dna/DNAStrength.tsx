import { useState } from 'react'
import {
  Dna,
  Brain,
  Shield,
  Zap,
  Target,
  BookOpen,
  AlertCircle,
  ChevronRight,
  Sparkles
} from 'lucide-react'
import clsx from 'clsx'

interface DNAStrand {
  id: string
  name: string
  description: string
  strength: number // 0-100
  icon: React.ElementType
  color: string
  status: 'strong' | 'moderate' | 'weak' | 'not-configured'
}

/**
 * DNA Strength Component
 *
 * This component visualizes the "DNA" of your AI operations - the core configurations
 * and capabilities that define how your AI system behaves and performs.
 *
 * DNA Strands represent different aspects:
 * - Knowledge Base: Training data and domain expertise
 * - Reasoning: Logic and decision-making capabilities
 * - Safety: Guardrails and compliance measures
 * - Performance: Speed and efficiency metrics
 * - Specialization: Domain-specific fine-tuning
 *
 * PLACEHOLDER NOTE: This is a placeholder UI demonstrating where DNA components
 * would be displayed. The actual DNA strength calculations would come from
 * analyzing the PromptOps configurations, training data, and model performance.
 */

const dnaStrands: DNAStrand[] = [
  {
    id: 'knowledge',
    name: 'Knowledge Base',
    description: 'Training data and domain expertise',
    strength: 78,
    icon: BookOpen,
    color: '#6366f1',
    status: 'strong'
  },
  {
    id: 'reasoning',
    name: 'Reasoning',
    description: 'Logic and decision-making',
    strength: 85,
    icon: Brain,
    color: '#8b5cf6',
    status: 'strong'
  },
  {
    id: 'safety',
    name: 'Safety Guards',
    description: 'Compliance and guardrails',
    strength: 92,
    icon: Shield,
    color: '#22c55e',
    status: 'strong'
  },
  {
    id: 'performance',
    name: 'Performance',
    description: 'Speed and efficiency',
    strength: 65,
    icon: Zap,
    color: '#f97316',
    status: 'moderate'
  },
  {
    id: 'specialization',
    name: 'Specialization',
    description: 'Domain-specific tuning',
    strength: 45,
    icon: Target,
    color: '#06b6d4',
    status: 'moderate'
  }
]

export default function DNAStrength() {
  const [expandedStrand, setExpandedStrand] = useState<string | null>(null)

  // Calculate overall DNA strength
  const overallStrength = Math.round(
    dnaStrands.reduce((acc, s) => acc + s.strength, 0) / dnaStrands.length
  )

  const getStatusColor = (status: DNAStrand['status']) => {
    switch (status) {
      case 'strong': return 'text-green-400'
      case 'moderate': return 'text-yellow-400'
      case 'weak': return 'text-orange-400'
      case 'not-configured': return 'text-slate-500'
    }
  }

  const getStatusLabel = (status: DNAStrand['status']) => {
    switch (status) {
      case 'strong': return 'Strong'
      case 'moderate': return 'Moderate'
      case 'weak': return 'Needs Attention'
      case 'not-configured': return 'Not Configured'
    }
  }

  return (
    <div className="bg-symtex-card rounded-xl border border-symtex-border overflow-hidden">
      {/* Header with Overall Strength */}
      <div className="p-5 border-b border-symtex-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Dna className="w-5 h-5 text-symtex-primary dna-pulse" />
            DNA Strength
          </h2>
          <span className="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded">
            BETA
          </span>
        </div>

        {/* Overall Strength Visualization */}
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="35"
                stroke="#334155"
                strokeWidth="6"
                fill="none"
              />
              <circle
                cx="40"
                cy="40"
                r="35"
                stroke="url(#dna-gradient)"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${(overallStrength / 100) * 220} 220`}
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="dna-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-white">{overallStrength}%</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm text-slate-300 mb-1">Overall AI DNA Health</p>
            <p className="text-xs text-slate-500">
              Your AI system's core capabilities are performing well. Consider improving Performance and Specialization strands.
            </p>
          </div>
        </div>
      </div>

      {/* DNA Strands List */}
      <div className="divide-y divide-symtex-border">
        {dnaStrands.map((strand) => {
          const Icon = strand.icon
          const isExpanded = expandedStrand === strand.id

          return (
            <div key={strand.id}>
              <button
                onClick={() => setExpandedStrand(isExpanded ? null : strand.id)}
                className="w-full p-4 flex items-center gap-4 hover:bg-slate-800/50 transition-colors"
              >
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${strand.color}20` }}
                >
                  <Icon className="w-5 h-5" style={{ color: strand.color }} />
                </div>

                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{strand.name}</span>
                    <span className={clsx('text-xs', getStatusColor(strand.status))}>
                      {getStatusLabel(strand.status)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{strand.description}</p>
                </div>

                {/* Strength Bar */}
                <div className="w-24">
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${strand.strength}%`,
                        backgroundColor: strand.color
                      }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 text-right mt-1">{strand.strength}%</p>
                </div>

                <ChevronRight className={clsx(
                  'w-5 h-5 text-slate-500 transition-transform duration-200',
                  isExpanded && 'rotate-90'
                )} />
              </button>

              {/* Expanded Details - Placeholder */}
              {isExpanded && (
                <div className="px-4 pb-4 bg-slate-800/30">
                  <div className="p-4 rounded-lg border border-dashed border-symtex-border bg-symtex-dark/50">
                    <div className="flex items-center gap-2 text-slate-400 mb-2">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Placeholder Content</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      This section would show detailed metrics, configuration options,
                      and improvement suggestions for the {strand.name} DNA strand.
                      Connect to PromptOps to unlock detailed analytics.
                    </p>
                    <button className="mt-3 text-xs text-symtex-primary hover:text-symtex-secondary flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Configure {strand.name}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
