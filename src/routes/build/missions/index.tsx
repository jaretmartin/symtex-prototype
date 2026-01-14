import { useState, useMemo } from 'react'
import {
  Target,
  Plus,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Calendar as CalendarIcon,
  Search
} from 'lucide-react'
import clsx from 'clsx'
import MissionCard, { type Mission, type MissionPriority, type MissionStatus } from '../../../components/missions/MissionCard'
import MissionFilters, { type ViewMode } from '../../../components/missions/MissionFilters'
import KanbanBoard from '../../../components/missions/KanbanBoard'
import TimelineView from '../../../components/missions/TimelineView'
import { EmptyState } from '../../../components/empty/EmptyState'

// Sample mission data
const sampleMissions: Mission[] = [
  {
    id: '1',
    title: 'Implement AI-Powered Customer Support',
    description: 'Deploy conversational AI for 24/7 customer support with sentiment analysis',
    priority: 'critical',
    status: 'active',
    progress: 72,
    dueDate: 'Jan 15',
    assignees: 4,
    automationLevel: 85,
    tags: ['AI', 'Support', 'Integration'],
    subtasks: { completed: 8, total: 11 }
  },
  {
    id: '2',
    title: 'Data Pipeline Optimization',
    description: 'Reduce data processing latency by 40% through pipeline restructuring',
    priority: 'high',
    status: 'active',
    progress: 45,
    dueDate: 'Jan 20',
    assignees: 3,
    automationLevel: 60,
    tags: ['Data', 'Performance', 'Infrastructure'],
    subtasks: { completed: 5, total: 12 }
  },
  {
    id: '3',
    title: 'Security Audit Compliance',
    description: 'Complete SOC 2 Type II compliance requirements and documentation',
    priority: 'critical',
    status: 'blocked',
    progress: 30,
    dueDate: 'Jan 12',
    assignees: 2,
    automationLevel: 25,
    tags: ['Security', 'Compliance', 'Documentation'],
    subtasks: { completed: 3, total: 10 }
  },
  {
    id: '4',
    title: 'Mobile App V2 Launch',
    description: 'Release updated mobile application with new feature set',
    priority: 'high',
    status: 'pending',
    progress: 15,
    dueDate: 'Feb 1',
    assignees: 6,
    automationLevel: 40,
    tags: ['Mobile', 'Product', 'Launch'],
    subtasks: { completed: 2, total: 15 }
  },
  {
    id: '5',
    title: 'API Rate Limiting Implementation',
    description: 'Implement intelligent rate limiting across all public endpoints',
    priority: 'medium',
    status: 'completed',
    progress: 100,
    dueDate: 'Jan 8',
    assignees: 2,
    automationLevel: 90,
    tags: ['API', 'Security', 'Backend'],
    subtasks: { completed: 7, total: 7 }
  },
  {
    id: '6',
    title: 'User Analytics Dashboard',
    description: 'Build comprehensive analytics dashboard for user behavior insights',
    priority: 'medium',
    status: 'active',
    progress: 58,
    dueDate: 'Jan 25',
    assignees: 3,
    automationLevel: 55,
    tags: ['Analytics', 'Dashboard', 'UX'],
    subtasks: { completed: 7, total: 12 }
  },
  {
    id: '7',
    title: 'Documentation Overhaul',
    description: 'Update and modernize all technical documentation and API references',
    priority: 'low',
    status: 'pending',
    progress: 10,
    dueDate: 'Feb 15',
    assignees: 2,
    automationLevel: 70,
    tags: ['Documentation', 'DevEx'],
    subtasks: { completed: 1, total: 8 }
  },
  {
    id: '8',
    title: 'Performance Monitoring Setup',
    description: 'Deploy comprehensive APM solution with alerting and dashboards',
    priority: 'high',
    status: 'active',
    progress: 65,
    dueDate: 'Jan 18',
    assignees: 2,
    automationLevel: 75,
    tags: ['Monitoring', 'DevOps', 'Infrastructure'],
    subtasks: { completed: 6, total: 9 }
  }
]

// Stats component
function MissionStats({ missions }: { missions: Mission[] }) {
  const stats = useMemo(() => ({
    total: missions.length,
    active: missions.filter(m => m.status === 'active').length,
    completed: missions.filter(m => m.status === 'completed').length,
    blocked: missions.filter(m => m.status === 'blocked').length,
    avgProgress: Math.round(missions.reduce((acc, m) => acc + m.progress, 0) / missions.length),
    avgAutomation: Math.round(missions.reduce((acc, m) => acc + m.automationLevel, 0) / missions.length)
  }), [missions])

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
      <div className="bg-symtex-card rounded-xl p-4 border border-symtex-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-symtex-primary/20">
            <Target className="w-5 h-5 text-symtex-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.total}</p>
            <p className="text-xs text-slate-400">Total Missions</p>
          </div>
        </div>
      </div>

      <div className="bg-symtex-card rounded-xl p-4 border border-symtex-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/20">
            <Clock className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.active}</p>
            <p className="text-xs text-slate-400">In Progress</p>
          </div>
        </div>
      </div>

      <div className="bg-symtex-card rounded-xl p-4 border border-symtex-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-500/20">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.completed}</p>
            <p className="text-xs text-slate-400">Completed</p>
          </div>
        </div>
      </div>

      <div className="bg-symtex-card rounded-xl p-4 border border-symtex-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-500/20">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.blocked}</p>
            <p className="text-xs text-slate-400">Blocked</p>
          </div>
        </div>
      </div>

      <div className="bg-symtex-card rounded-xl p-4 border border-symtex-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/20">
            <TrendingUp className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.avgProgress}%</p>
            <p className="text-xs text-slate-400">Avg Progress</p>
          </div>
        </div>
      </div>

      <div className="bg-symtex-card rounded-xl p-4 border border-symtex-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/20">
            <Sparkles className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.avgAutomation}%</p>
            <p className="text-xs text-slate-400">AI Automated</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Missions() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [showTimeline, setShowTimeline] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPriorities, setSelectedPriorities] = useState<MissionPriority[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<MissionStatus[]>([])

  // Filter missions based on search and filters
  const filteredMissions = useMemo(() => {
    return sampleMissions.filter(mission => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          mission.title.toLowerCase().includes(query) ||
          mission.description.toLowerCase().includes(query) ||
          mission.tags.some(tag => tag.toLowerCase().includes(query))
        if (!matchesSearch) return false
      }

      // Priority filter
      if (selectedPriorities.length > 0 && !selectedPriorities.includes(mission.priority)) {
        return false
      }

      // Status filter
      if (selectedStatuses.length > 0 && !selectedStatuses.includes(mission.status)) {
        return false
      }

      return true
    })
  }, [searchQuery, selectedPriorities, selectedStatuses])

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Target className="w-8 h-8 text-symtex-primary" />
            Missions
          </h1>
          <p className="text-slate-400 mt-1">
            Track and manage your AI-powered missions with intuitive visual controls
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Timeline Toggle */}
          <button
            onClick={() => setShowTimeline(!showTimeline)}
            className={clsx(
              'flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all duration-200',
              showTimeline
                ? 'bg-symtex-accent/20 border-symtex-accent text-symtex-accent'
                : 'bg-symtex-card border-symtex-border text-slate-400 hover:text-white hover:border-slate-500'
            )}
          >
            <CalendarIcon className="w-5 h-5" />
            <span className="font-medium">Timeline</span>
          </button>

          {/* New Mission Button */}
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg gradient-primary text-white font-medium hover:opacity-90 transition-opacity">
            <Plus className="w-5 h-5" />
            New Mission
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <MissionStats missions={sampleMissions} />

      {/* Filters */}
      {!showTimeline && (
        <div className="mb-6">
          <MissionFilters
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedPriorities={selectedPriorities}
            onPriorityChange={setSelectedPriorities}
            selectedStatuses={selectedStatuses}
            onStatusChange={setSelectedStatuses}
          />
        </div>
      )}

      {/* Mission Views */}
      {showTimeline ? (
        <TimelineView missions={filteredMissions} />
      ) : viewMode === 'kanban' ? (
        <KanbanBoard missions={filteredMissions} />
      ) : viewMode === 'list' ? (
        <div className="space-y-3">
          {filteredMissions.map(mission => (
            <MissionCard
              key={mission.id}
              mission={mission}
              viewMode="list"
            />
          ))}
          {filteredMissions.length === 0 && (
            <EmptyState
              icon={searchQuery || selectedPriorities.length > 0 || selectedStatuses.length > 0
                ? <Search className="w-8 h-8" />
                : <Target className="w-8 h-8" />
              }
              title={searchQuery || selectedPriorities.length > 0 || selectedStatuses.length > 0
                ? "No missions match your filters"
                : "No missions yet"
              }
              description={searchQuery || selectedPriorities.length > 0 || selectedStatuses.length > 0
                ? "Try adjusting your search or clearing some filters to see more results."
                : "Create your first mission to start tracking AI-powered objectives."
              }
              action={!(searchQuery || selectedPriorities.length > 0 || selectedStatuses.length > 0) ? {
                label: "Create Mission",
                onClick: () => console.log("Create mission"),
                icon: <Plus className="w-4 h-4" />
              } : undefined}
              secondaryAction={searchQuery || selectedPriorities.length > 0 || selectedStatuses.length > 0 ? {
                label: "Clear Filters",
                onClick: () => {
                  setSearchQuery('')
                  setSelectedPriorities([])
                  setSelectedStatuses([])
                }
              } : undefined}
            />
          )}
        </div>
      ) : (
        /* Grid View - Compact cards in a responsive grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMissions.map(mission => (
            <MissionCard
              key={mission.id}
              mission={mission}
              viewMode="grid"
            />
          ))}
          {filteredMissions.length === 0 && (
            <div className="col-span-full">
              <EmptyState
                icon={searchQuery || selectedPriorities.length > 0 || selectedStatuses.length > 0
                  ? <Search className="w-8 h-8" />
                  : <Target className="w-8 h-8" />
                }
                title={searchQuery || selectedPriorities.length > 0 || selectedStatuses.length > 0
                  ? "No missions match your filters"
                  : "No missions yet"
                }
                description={searchQuery || selectedPriorities.length > 0 || selectedStatuses.length > 0
                  ? "Try adjusting your search or clearing some filters to see more results."
                  : "Create your first mission to start tracking AI-powered objectives."
                }
                action={!(searchQuery || selectedPriorities.length > 0 || selectedStatuses.length > 0) ? {
                  label: "Create Mission",
                  onClick: () => console.log("Create mission"),
                  icon: <Plus className="w-4 h-4" />
                } : undefined}
                secondaryAction={searchQuery || selectedPriorities.length > 0 || selectedStatuses.length > 0 ? {
                  label: "Clear Filters",
                  onClick: () => {
                    setSearchQuery('')
                    setSelectedPriorities([])
                    setSelectedStatuses([])
                  }
                } : undefined}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
