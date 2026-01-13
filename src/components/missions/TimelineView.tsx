import { useMemo } from 'react'
import { Calendar, Clock, Flag } from 'lucide-react'
import clsx from 'clsx'
import ProgressRing from '../ui/ProgressRing'
import type { Mission, MissionPriority } from './MissionCard'

interface TimelineViewProps {
  missions: Mission[]
  onMissionClick?: (mission: Mission) => void
}

const priorityColors: Record<MissionPriority, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#22c55e'
}

export default function TimelineView({ missions, onMissionClick }: TimelineViewProps) {
  // Group missions by due date (simplified for demo)
  const timelineData = useMemo(() => {
    const groups: { label: string; missions: Mission[] }[] = [
      { label: 'Overdue', missions: [] },
      { label: 'Today', missions: [] },
      { label: 'This Week', missions: [] },
      { label: 'Next Week', missions: [] },
      { label: 'Later', missions: [] }
    ]

    // For demo purposes, distribute missions across groups
    missions.forEach((mission, index) => {
      const groupIndex = index % groups.length
      groups[groupIndex].missions.push(mission)
    })

    return groups.filter(g => g.missions.length > 0)
  }, [missions])

  return (
    <div className="relative">
      {/* Timeline Line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-symtex-primary via-symtex-secondary to-symtex-accent" />

      {/* Timeline Groups */}
      <div className="space-y-8">
        {timelineData.map((group) => (
          <div key={group.label} className="relative">
            {/* Group Header */}
            <div className="flex items-center gap-4 mb-4">
              <div className={clsx(
                'w-12 h-12 rounded-full flex items-center justify-center z-10',
                'bg-symtex-card border-2 border-symtex-primary'
              )}>
                <Calendar className="w-5 h-5 text-symtex-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{group.label}</h3>
                <p className="text-sm text-slate-400">
                  {group.missions.length} mission{group.missions.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Missions in Group */}
            <div className="ml-16 space-y-3">
              {group.missions.map((mission) => (
                <div
                  key={mission.id}
                  onClick={() => onMissionClick?.(mission)}
                  className={clsx(
                    'mission-card bg-symtex-card rounded-xl p-4 border border-symtex-border cursor-pointer',
                    'flex items-center gap-4 border-l-4',
                    mission.priority === 'critical' && 'border-l-red-500',
                    mission.priority === 'high' && 'border-l-orange-500',
                    mission.priority === 'medium' && 'border-l-yellow-500',
                    mission.priority === 'low' && 'border-l-green-500'
                  )}
                >
                  {/* Progress Ring */}
                  <ProgressRing
                    progress={mission.progress}
                    size={48}
                    color={priorityColors[mission.priority]}
                  />

                  {/* Mission Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-white truncate">{mission.title}</h4>
                    <p className="text-sm text-slate-400 truncate">{mission.description}</p>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Clock className="w-4 h-4" />
                      {mission.dueDate}
                    </div>
                    <div className="flex items-center gap-1">
                      <Flag
                        className="w-4 h-4"
                        style={{ color: priorityColors[mission.priority] }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
