import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Dna,
  Brain,
  Shield,
  Zap,
  Target,
  BookOpen,
  ChevronRight,
  Sparkles,
  TrendingUp,
  TrendingDown,
  RefreshCcw,
  Settings,
  ExternalLink
} from 'lucide-react'
import clsx from 'clsx'
import { useUIStore } from '@/store/useUIStore'
import WidgetSkeleton from '../home/WidgetSkeleton'

type StrandStatus = 'strong' | 'moderate' | 'weak' | 'not-configured'

interface DNAStrand {
  id: string
  name: string
  description: string
  strength: number // 0-100
  previousStrength?: number // For trend calculation
  icon: React.ElementType
  color: string
  status: StrandStatus
  metrics?: {
    label: string
    value: string
  }[]
  suggestions?: string[]
}

interface DNAStrengthProps {
  className?: string
  compact?: boolean
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
 * Features:
 * - Loading skeleton state
 * - Animated progress ring
 * - Trend indicators per strand
 * - Expandable detail sections
 * - Quick action buttons
 * - Configuration suggestions
 */

// Mock data - in production, this would come from a store or API
const mockDNAStrands: DNAStrand[] = [
  {
    id: 'knowledge',
    name: 'Knowledge Base',
    description: 'Training data and domain expertise',
    strength: 78,
    previousStrength: 72,
    icon: BookOpen,
    color: '#6366f1',
    status: 'strong',
    metrics: [
      { label: 'Documents indexed', value: '2,847' },
      { label: 'Last updated', value: '2 hours ago' }
    ],
    suggestions: ['Add more customer support transcripts', 'Update product documentation']
  },
  {
    id: 'reasoning',
    name: 'Reasoning',
    description: 'Logic and decision-making',
    strength: 85,
    previousStrength: 83,
    icon: Brain,
    color: '#8b5cf6',
    status: 'strong',
    metrics: [
      { label: 'Decision accuracy', value: '94.2%' },
      { label: 'Avg response time', value: '1.2s' }
    ],
    suggestions: ['Enable chain-of-thought for complex queries']
  },
  {
    id: 'safety',
    name: 'Safety Guards',
    description: 'Compliance and guardrails',
    strength: 92,
    previousStrength: 90,
    icon: Shield,
    color: '#22c55e',
    status: 'strong',
    metrics: [
      { label: 'Blocked attempts', value: '127' },
      { label: 'False positives', value: '0.3%' }
    ],
    suggestions: []
  },
  {
    id: 'performance',
    name: 'Performance',
    description: 'Speed and efficiency',
    strength: 65,
    previousStrength: 68,
    icon: Zap,
    color: '#f97316',
    status: 'moderate',
    metrics: [
      { label: 'Avg latency', value: '245ms' },
      { label: 'Cache hit rate', value: '67%' }
    ],
    suggestions: ['Enable response caching', 'Consider model optimization']
  },
  {
    id: 'specialization',
    name: 'Specialization',
    description: 'Domain-specific tuning',
    strength: 45,
    previousStrength: 40,
    icon: Target,
    color: '#06b6d4',
    status: 'moderate',
    metrics: [
      { label: 'Custom prompts', value: '12' },
      { label: 'Fine-tuned models', value: '0' }
    ],
    suggestions: ['Create domain-specific prompts', 'Consider fine-tuning for your industry']
  }
]

const getStatusConfig = (status: StrandStatus): { color: string; label: string } => {
  switch (status) {
    case 'strong': return { color: 'text-green-400', label: 'Strong' }
    case 'moderate': return { color: 'text-yellow-400', label: 'Moderate' }
    case 'weak': return { color: 'text-orange-400', label: 'Needs Attention' }
    case 'not-configured': return { color: 'text-slate-500', label: 'Not Configured' }
  }
}

const _getStrengthStatus = (strength: number): StrandStatus => {
  if (strength >= 80) return 'strong'
  if (strength >= 50) return 'moderate'
  if (strength > 0) return 'weak'
  return 'not-configured'
}

// Exported for use by other components
export { _getStrengthStatus as getStrengthStatus }

export default function DNAStrength({ className, compact = false }: DNAStrengthProps): JSX.Element {
  const navigate = useNavigate()
  const addToast = useUIStore((state) => state.addToast)

  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [strands, setStrands] = useState<DNAStrand[]>([])
  const [expandedStrand, setExpandedStrand] = useState<string | null>(null)

  // Simulate data loading
  useEffect(() => {
    const loadData = async (): Promise<void> => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 900))
      setStrands(mockDNAStrands)
      setIsLoading(false)
    }

    loadData()
  }, [])

  // Handle refresh
  const handleRefresh = useCallback(async (): Promise<void> => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1200))
    setStrands(mockDNAStrands)
    setIsRefreshing(false)
    addToast({
      title: 'DNA analysis refreshed',
      variant: 'success',
      duration: 2000
    })
  }, [addToast])

  // Handle configure strand
  const handleConfigure = useCallback((strandId: string): void => {
    navigate(`/settings/dna/${strandId}`)
  }, [navigate])

  // Calculate overall DNA strength
  const overallStrength = strands.length > 0
    ? Math.round(strands.reduce((acc, s) => acc + s.strength, 0) / strands.length)
    : 0

  // Calculate overall trend
  const overallTrend = strands.length > 0
    ? strands.reduce((acc, s) => {
        const trend = (s.strength - (s.previousStrength || s.strength))
        return acc + trend
      }, 0) / strands.length
    : 0

  // Get weak strands for suggestion
  const weakStrands = strands.filter(s => s.status === 'weak' || s.status === 'moderate')

  // Show loading skeleton
  if (isLoading) {
    return <WidgetSkeleton height={compact ? 200 : 400} showHeader={true} rows={compact ? 2 : 5} className={className} />
  }

  return (
    <div className={clsx(
      'bg-symtex-card rounded-xl border border-symtex-border overflow-hidden',
      className
    )}>
      {/* Header with Overall Strength */}
      <div className="p-5 border-b border-symtex-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Dna className="w-5 h-5 text-symtex-primary dna-pulse" />
            DNA Strength
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors disabled:opacity-50"
            >
              <RefreshCcw className={clsx('w-4 h-4', isRefreshing && 'animate-spin')} />
            </button>
            <span className="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded">
              BETA
            </span>
          </div>
        </div>

        {/* Overall Strength Visualization */}
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 flex-shrink-0">
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
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-white">{overallStrength}%</span>
              {overallTrend !== 0 && (
                <div className={clsx(
                  'flex items-center gap-0.5 text-xs',
                  overallTrend > 0 ? 'text-green-400' : 'text-red-400'
                )}>
                  {overallTrend > 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {Math.abs(overallTrend).toFixed(1)}%
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-slate-300 mb-1">Overall AI DNA Health</p>
            <p className="text-xs text-slate-500">
              {weakStrands.length === 0
                ? 'All your AI capabilities are performing optimally.'
                : `Consider improving ${weakStrands.map(s => s.name).join(' and ')} for better performance.`}
            </p>
          </div>
        </div>
      </div>

      {/* DNA Strands List */}
      <div className={clsx(
        'divide-y divide-symtex-border',
        !compact && 'max-h-[400px] overflow-y-auto'
      )}>
        {(compact ? strands.slice(0, 3) : strands).map((strand) => {
          const Icon = strand.icon
          const isExpanded = expandedStrand === strand.id
          const statusConfig = getStatusConfig(strand.status)
          const trend = strand.previousStrength
            ? strand.strength - strand.previousStrength
            : 0

          return (
            <div key={strand.id}>
              <button
                onClick={() => setExpandedStrand(isExpanded ? null : strand.id)}
                className="w-full p-4 flex items-center gap-4 hover:bg-slate-800/50 transition-colors"
              >
                <div
                  className="p-2 rounded-lg flex-shrink-0"
                  style={{ backgroundColor: `${strand.color}20` }}
                >
                  <Icon className="w-5 h-5" style={{ color: strand.color }} />
                </div>

                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-white">{strand.name}</span>
                    <span className={clsx('text-xs', statusConfig.color)}>
                      {statusConfig.label}
                    </span>
                    {trend !== 0 && (
                      <span className={clsx(
                        'flex items-center gap-0.5 text-xs',
                        trend > 0 ? 'text-green-400' : 'text-red-400'
                      )}>
                        {trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {Math.abs(trend)}%
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 truncate">{strand.description}</p>
                </div>

                {/* Strength Bar */}
                <div className="w-20 flex-shrink-0">
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
                  'w-5 h-5 text-slate-500 transition-transform duration-200 flex-shrink-0',
                  isExpanded && 'rotate-90'
                )} />
              </button>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-4 pb-4 bg-slate-800/30 animate-in slide-in-from-top-2 duration-200">
                  <div className="p-4 rounded-lg border border-symtex-border bg-symtex-dark/50">
                    {/* Metrics */}
                    {strand.metrics && strand.metrics.length > 0 && (
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        {strand.metrics.map((metric, idx) => (
                          <div key={idx} className="bg-slate-800/50 rounded-lg p-3">
                            <p className="text-xs text-slate-500">{metric.label}</p>
                            <p className="text-sm font-semibold text-white">{metric.value}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Suggestions */}
                    {strand.suggestions && strand.suggestions.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-slate-400 mb-2 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Suggestions to improve
                        </p>
                        <ul className="space-y-1">
                          {strand.suggestions.map((suggestion, idx) => (
                            <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                              <span className="text-symtex-primary">-</span>
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {strand.suggestions?.length === 0 && (
                      <div className="flex items-center gap-2 text-green-400 mb-4">
                        <Shield className="w-4 h-4" />
                        <span className="text-xs">This strand is performing optimally</span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleConfigure(strand.id)}
                        className="flex-1 text-xs text-symtex-primary hover:text-symtex-secondary transition-colors flex items-center justify-center gap-1 py-2 rounded-lg bg-symtex-primary/10 hover:bg-symtex-primary/20"
                      >
                        <Settings className="w-3 h-3" />
                        Configure {strand.name}
                      </button>
                      <button
                        onClick={() => navigate(`/docs/dna/${strand.id}`)}
                        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Compact mode: Show more link */}
      {compact && strands.length > 3 && (
        <div className="p-4 border-t border-symtex-border bg-slate-800/30">
          <button
            onClick={() => navigate('/settings/dna')}
            className="w-full text-center text-sm text-slate-400 hover:text-white transition-colors"
          >
            View all {strands.length} strands
          </button>
        </div>
      )}
    </div>
  )
}
