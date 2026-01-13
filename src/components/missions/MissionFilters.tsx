import { useState } from 'react'
import {
  LayoutGrid,
  List,
  Columns,
  Filter,
  Search,
  ChevronDown,
  SlidersHorizontal
} from 'lucide-react'
import clsx from 'clsx'
import type { MissionPriority, MissionStatus } from './MissionCard'

export type ViewMode = 'grid' | 'list' | 'kanban'

interface MissionFiltersProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedPriorities: MissionPriority[]
  onPriorityChange: (priorities: MissionPriority[]) => void
  selectedStatuses: MissionStatus[]
  onStatusChange: (statuses: MissionStatus[]) => void
}

const viewModes = [
  { id: 'grid' as const, icon: LayoutGrid, label: 'Grid' },
  { id: 'list' as const, icon: List, label: 'List' },
  { id: 'kanban' as const, icon: Columns, label: 'Kanban' }
]

const priorities: { id: MissionPriority; label: string; color: string }[] = [
  { id: 'critical', label: 'Critical', color: 'bg-red-500' },
  { id: 'high', label: 'High', color: 'bg-orange-500' },
  { id: 'medium', label: 'Medium', color: 'bg-yellow-500' },
  { id: 'low', label: 'Low', color: 'bg-green-500' }
]

const statuses: { id: MissionStatus; label: string; color: string }[] = [
  { id: 'active', label: 'Active', color: 'bg-blue-500' },
  { id: 'pending', label: 'Pending', color: 'bg-yellow-500' },
  { id: 'completed', label: 'Completed', color: 'bg-green-500' },
  { id: 'blocked', label: 'Blocked', color: 'bg-red-500' }
]

export default function MissionFilters({
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
  selectedPriorities,
  onPriorityChange,
  selectedStatuses,
  onStatusChange
}: MissionFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)

  const togglePriority = (priority: MissionPriority) => {
    if (selectedPriorities.includes(priority)) {
      onPriorityChange(selectedPriorities.filter(p => p !== priority))
    } else {
      onPriorityChange([...selectedPriorities, priority])
    }
  }

  const toggleStatus = (status: MissionStatus) => {
    if (selectedStatuses.includes(status)) {
      onStatusChange(selectedStatuses.filter(s => s !== status))
    } else {
      onStatusChange([...selectedStatuses, status])
    }
  }

  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search missions..."
            className="w-full pl-10 pr-4 py-2.5 bg-symtex-card border border-symtex-border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-symtex-primary focus:ring-1 focus:ring-symtex-primary transition-all"
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center bg-symtex-card rounded-lg border border-symtex-border p-1">
          {viewModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => onViewModeChange(mode.id)}
              className={clsx(
                'p-2 rounded-md transition-all duration-200',
                viewMode === mode.id
                  ? 'bg-symtex-primary text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              )}
              title={mode.label}
            >
              <mode.icon className="w-5 h-5" />
            </button>
          ))}
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={clsx(
            'flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all duration-200',
            showFilters
              ? 'bg-symtex-primary/20 border-symtex-primary text-symtex-primary'
              : 'bg-symtex-card border-symtex-border text-slate-400 hover:text-white hover:border-slate-500'
          )}
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span className="font-medium">Filters</span>
          {(selectedPriorities.length > 0 || selectedStatuses.length > 0) && (
            <span className="px-2 py-0.5 rounded-full bg-symtex-primary text-white text-xs">
              {selectedPriorities.length + selectedStatuses.length}
            </span>
          )}
          <ChevronDown className={clsx(
            'w-4 h-4 transition-transform duration-200',
            showFilters && 'rotate-180'
          )} />
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-symtex-card rounded-xl border border-symtex-border p-6 space-y-6 animate-in slide-in-from-top-2 duration-200">
          {/* Priority Filters */}
          <div>
            <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Priority
            </h4>
            <div className="flex flex-wrap gap-2">
              {priorities.map((priority) => (
                <button
                  key={priority.id}
                  onClick={() => togglePriority(priority.id)}
                  className={clsx(
                    'flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200',
                    selectedPriorities.includes(priority.id)
                      ? 'bg-slate-700 border-slate-500 text-white'
                      : 'bg-transparent border-symtex-border text-slate-400 hover:border-slate-500'
                  )}
                >
                  <span className={clsx('w-2.5 h-2.5 rounded-full', priority.color)} />
                  <span className="text-sm font-medium">{priority.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Status Filters */}
          <div>
            <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Status
            </h4>
            <div className="flex flex-wrap gap-2">
              {statuses.map((status) => (
                <button
                  key={status.id}
                  onClick={() => toggleStatus(status.id)}
                  className={clsx(
                    'flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200',
                    selectedStatuses.includes(status.id)
                      ? 'bg-slate-700 border-slate-500 text-white'
                      : 'bg-transparent border-symtex-border text-slate-400 hover:border-slate-500'
                  )}
                >
                  <span className={clsx('w-2.5 h-2.5 rounded-full', status.color)} />
                  <span className="text-sm font-medium">{status.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {(selectedPriorities.length > 0 || selectedStatuses.length > 0) && (
            <button
              onClick={() => {
                onPriorityChange([])
                onStatusChange([])
              }}
              className="text-sm text-symtex-primary hover:text-symtex-secondary transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  )
}
