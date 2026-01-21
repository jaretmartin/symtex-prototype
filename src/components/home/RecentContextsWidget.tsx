import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Layers,
  ArrowRight,
  Clock,
  FileText,
  MessageSquare,
  Database,
  Link2,
  Star,
  StarOff,
  Pin
} from 'lucide-react'
import clsx from 'clsx'
import { useContextStore } from '@/store/useContextStore'
import { useUIStore } from '@/store/useUIStore'
import WidgetSkeleton from './WidgetSkeleton'
import type { SpaceType } from '@/types'

interface RecentContext {
  id: string
  name: string
  type: SpaceType
  description?: string
  lastAccessed: string
  isPinned: boolean
  isFavorite: boolean
  sourceCount?: number
}

interface RecentContextsWidgetProps {
  className?: string
  maxItems?: number
}

// Mock data for recent contexts
const mockContexts: RecentContext[] = [
  {
    id: 'ctx-1',
    name: 'Q1 Marketing Campaign',
    type: 'domain',
    description: 'Marketing strategy and content planning',
    lastAccessed: '5 min ago',
    isPinned: true,
    isFavorite: true,
    sourceCount: 12
  },
  {
    id: 'ctx-2',
    name: 'Customer Support KB',
    type: 'domain',
    description: 'Knowledge base for support Cognates',
    lastAccessed: '1 hour ago',
    isPinned: false,
    isFavorite: true,
    sourceCount: 48
  },
  {
    id: 'ctx-3',
    name: 'Product Roadmap 2026',
    type: 'project',
    description: 'Feature planning and prioritization',
    lastAccessed: '3 hours ago',
    isPinned: false,
    isFavorite: false,
    sourceCount: 8
  },
  {
    id: 'ctx-4',
    name: 'Engineering Docs',
    type: 'domain',
    description: 'Technical documentation and guides',
    lastAccessed: 'Yesterday',
    isPinned: false,
    isFavorite: false,
    sourceCount: 156
  }
]

const typeConfig: Record<SpaceType, {
  icon: React.ElementType
  color: string
  bg: string
}> = {
  personal: { icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/20' },
  domain: { icon: Layers, color: 'text-purple-400', bg: 'bg-purple-500/20' },
  project: { icon: Database, color: 'text-green-400', bg: 'bg-green-500/20' },
  mission: { icon: MessageSquare, color: 'text-cyan-400', bg: 'bg-cyan-500/20' }
}

/**
 * RecentContextsWidget Component
 *
 * Displays recently accessed contexts/spaces on the dashboard.
 * Features:
 * - Loading skeleton state
 * - Shows pinned and recent contexts
 * - Favorite toggle
 * - Source count indicator
 * - Quick navigation to context
 * - Empty state when no contexts
 */
export default function RecentContextsWidget({
  className,
  maxItems = 4
}: RecentContextsWidgetProps): JSX.Element {
  const navigate = useNavigate()
  const addToast = useUIStore((state) => state.addToast)
  const { navigateTo } = useContextStore()

  const [isLoading, setIsLoading] = useState(true)
  const [contexts, setContexts] = useState<RecentContext[]>([])

  // Load contexts
  useEffect(() => {
    const loadData = async (): Promise<void> => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 550))
      setContexts(mockContexts)
      setIsLoading(false)
    }

    loadData()
  }, [])

  // Handle context click
  const handleContextClick = useCallback((context: RecentContext): void => {
    navigateTo(context.type, context.id, context.name)
    navigate(`/spaces/${context.id}`)
  }, [navigate, navigateTo])

  // Handle toggle favorite
  const handleToggleFavorite = useCallback((e: React.MouseEvent, contextId: string): void => {
    e.stopPropagation()
    setContexts(prev => prev.map(ctx =>
      ctx.id === contextId ? { ...ctx, isFavorite: !ctx.isFavorite } : ctx
    ))
    const context = contexts.find(c => c.id === contextId)
    addToast({
      title: context?.isFavorite ? 'Removed from favorites' : 'Added to favorites',
      variant: 'info',
      duration: 2000
    })
  }, [contexts, addToast])

  // Sort contexts: pinned first, then by most recent
  const sortedContexts = [...contexts].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return 0
  }).slice(0, maxItems)

  // Show loading skeleton
  if (isLoading) {
    return <WidgetSkeleton height={280} showHeader={true} rows={4} className={className} />
  }

  // Show empty state
  if (contexts.length === 0) {
    return (
      <div className={clsx(
        'bg-card rounded-xl border border-border overflow-hidden',
        className
      )}>
        <div className="p-5 border-b border-symtex-border">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-symtex-primary" />
            Recent Contexts
          </h2>
        </div>
        <div className="p-8 flex flex-col items-center justify-center text-center">
          <div className="p-4 rounded-full bg-slate-800 mb-4">
            <Layers className="w-8 h-8 text-slate-500" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No Contexts Yet</h3>
          <p className="text-sm text-slate-400 max-w-xs mb-4">
            Create your first context to organize knowledge for your Cognates.
          </p>
          <button
            onClick={() => navigate('/spaces/new')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg gradient-primary text-white font-medium hover:opacity-90 transition-opacity"
          >
            <Layers className="w-4 h-4" />
            Create Context
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={clsx(
      'bg-symtex-card rounded-xl border border-symtex-border overflow-hidden',
      className
    )}>
      {/* Header */}
      <div className="p-5 border-b border-symtex-border flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-symtex-primary" />
          Recent Contexts
        </h2>
        <button
          onClick={() => navigate('/spaces')}
          className="text-sm text-symtex-primary hover:text-symtex-secondary transition-colors flex items-center gap-1"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Contexts List */}
      <div className="divide-y divide-symtex-border">
        {sortedContexts.map((context) => {
          const config = typeConfig[context.type]
          const Icon = config.icon

          return (
            <div
              key={context.id}
              onClick={() => handleContextClick(context)}
              className="p-4 hover:bg-slate-800/30 transition-colors cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={clsx('p-2 rounded-lg flex-shrink-0', config.bg)}>
                  <Icon className={clsx('w-4 h-4', config.color)} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-white truncate group-hover:text-symtex-primary transition-colors">
                      {context.name}
                    </h4>
                    {context.isPinned && (
                      <Pin className="w-3 h-3 text-symtex-primary flex-shrink-0" />
                    )}
                  </div>
                  {context.description && (
                    <p className="text-xs text-slate-400 truncate mb-1">
                      {context.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {context.lastAccessed}
                    </span>
                    {context.sourceCount && (
                      <span className="flex items-center gap-1">
                        <Link2 className="w-3 h-3" />
                        {context.sourceCount} sources
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={(e) => handleToggleFavorite(e, context.id)}
                    className={clsx(
                      'p-1.5 rounded-lg transition-colors',
                      context.isFavorite
                        ? 'text-yellow-400 hover:text-yellow-300'
                        : 'text-slate-500 hover:text-yellow-400 opacity-0 group-hover:opacity-100'
                    )}
                  >
                    {context.isFavorite ? (
                      <Star className="w-4 h-4 fill-current" />
                    ) : (
                      <StarOff className="w-4 h-4" />
                    )}
                  </button>
                  <ArrowRight className="w-4 h-4 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-symtex-border bg-slate-800/30 flex items-center justify-between">
        <p className="text-xs text-slate-500">
          {contexts.filter(c => c.isPinned).length} pinned,{' '}
          {contexts.filter(c => c.isFavorite).length} favorites
        </p>
        <button
          onClick={() => navigate('/spaces/new')}
          className="text-xs text-slate-400 hover:text-white transition-colors"
        >
          + New Context
        </button>
      </div>
    </div>
  )
}
