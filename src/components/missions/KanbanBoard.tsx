import { useMemo } from 'react'
import { Circle, PlayCircle, CheckCircle2, XCircle } from 'lucide-react'
import clsx from 'clsx'
import MissionCard, { type Mission, type MissionStatus } from './MissionCard'

interface KanbanBoardProps {
  missions: Mission[]
  onMissionClick?: (mission: Mission) => void
}

const columns: { id: MissionStatus; label: string; icon: React.ElementType; color: string }[] = [
  { id: 'pending', label: 'Pending', icon: Circle, color: 'text-yellow-400' },
  { id: 'active', label: 'In Progress', icon: PlayCircle, color: 'text-blue-400' },
  { id: 'completed', label: 'Completed', icon: CheckCircle2, color: 'text-green-400' },
  { id: 'blocked', label: 'Blocked', icon: XCircle, color: 'text-red-400' }
]

export default function KanbanBoard({ missions, onMissionClick }: KanbanBoardProps) {
  const groupedMissions = useMemo(() => {
    return columns.reduce((acc, column) => {
      acc[column.id] = missions.filter(m => m.status === column.id)
      return acc
    }, {} as Record<MissionStatus, Mission[]>)
  }, [missions])

  return (
    <div className="grid grid-cols-4 gap-6 min-h-[600px]">
      {columns.map((column) => {
        const Icon = column.icon
        const columnMissions = groupedMissions[column.id] || []

        return (
          <div key={column.id} className="flex flex-col">
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-symtex-border">
              <div className="flex items-center gap-2">
                <Icon className={clsx('w-5 h-5', column.color)} />
                <h3 className="font-semibold text-white">{column.label}</h3>
              </div>
              <span className={clsx(
                'px-2.5 py-1 rounded-full text-xs font-medium',
                'bg-slate-700 text-slate-300'
              )}>
                {columnMissions.length}
              </span>
            </div>

            {/* Column Content */}
            <div className="flex-1 space-y-4 overflow-y-auto pr-2 -mr-2">
              {columnMissions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                  <Icon className="w-10 h-10 mb-3 opacity-30" />
                  <p className="text-sm">No missions</p>
                </div>
              ) : (
                columnMissions.map((mission) => (
                  <MissionCard
                    key={mission.id}
                    mission={mission}
                    viewMode="kanban"
                    onClick={() => onMissionClick?.(mission)}
                  />
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
