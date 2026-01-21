/**
 * BootCampProgress Component
 *
 * Displays the 6-week boot camp timeline with overall progress.
 */

import { GraduationCap } from 'lucide-react';
import { WeekCard } from './WeekCard';
import { useTrainingStore } from './trainingStore';

export function BootCampProgress() {
  const { bootCampWeeks, getSelectedCognate } = useTrainingStore();
  const cognate = getSelectedCognate();

  const completedWeeks = bootCampWeeks.filter((w) => w.status === 'completed').length;
  const currentWeek = bootCampWeeks.find((w) => w.status === 'current');
  const overallProgress = cognate?.shadowProgress ?? 0;

  return (
    <div className="space-y-6">
      {/* Header with overall progress */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-muted-foreground flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-purple-400" />
            6-Week Boot Camp
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Week {completedWeeks + (currentWeek ? 1 : 0)} of 6
            </span>
          </div>
        </div>

        {/* Overall progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-medium text-muted-foreground">{overallProgress}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Foundation</span>
            <span>Graduation</span>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-border">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400">{completedWeeks}</p>
            <p className="text-xs text-muted-foreground">Weeks Completed</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-400">{currentWeek?.progress ?? 0}%</p>
            <p className="text-xs text-muted-foreground">Current Week</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-muted-foreground">{6 - completedWeeks - (currentWeek ? 1 : 0)}</p>
            <p className="text-xs text-muted-foreground">Weeks Remaining</p>
          </div>
        </div>
      </div>

      {/* Week cards */}
      <div className="space-y-3">
        {bootCampWeeks.map((week) => (
          <WeekCard key={week.week} week={week} isExpanded={week.status === 'current'} />
        ))}
      </div>
    </div>
  );
}

export default BootCampProgress;
