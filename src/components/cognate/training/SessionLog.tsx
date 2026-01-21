/**
 * SessionLog Component
 *
 * Displays the current training session and session history.
 */

import { Play, Pause, Clock, Zap, Target, CheckCircle } from 'lucide-react';
import clsx from 'clsx';
import { useTrainingStore } from './trainingStore';

export function SessionLog() {
  const { currentSession, isSessionActive, toggleSession, sessions } = useTrainingStore();

  // Format duration
  const formatDuration = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return hours > 0 ? `${hours}h ${remainingMinutes}m` : `${minutes}m`;
  };

  return (
    <div className="space-y-4">
      {/* Current Session */}
      {currentSession && (
        <div className="bg-card border border-purple-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className={clsx(
                  'w-3 h-3 rounded-full',
                  isSessionActive ? 'bg-green-500 animate-pulse' : 'bg-amber-500'
                )}
              />
              <h3 className="font-semibold text-muted-foreground">Current Session</h3>
              <span
                className={clsx(
                  'px-2 py-0.5 rounded-full text-xs font-medium',
                  isSessionActive
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-amber-500/20 text-amber-400'
                )}
              >
                {isSessionActive ? 'In Progress' : 'Paused'}
              </span>
            </div>
            <button
              onClick={toggleSession}
              className={clsx(
                'p-2 rounded-lg transition-colors',
                isSessionActive
                  ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                  : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
              )}
            >
              {isSessionActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
          </div>

          <p className="text-lg font-medium text-muted-foreground mb-4">{currentSession.title}</p>

          {/* Session stats */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="bg-surface-base rounded-lg p-3 text-center">
              <Clock className="w-4 h-4 text-purple-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-muted-foreground">
                {formatDuration(currentSession.durationMs)}
              </p>
              <p className="text-xs text-muted-foreground">Duration</p>
            </div>
            <div className="bg-surface-base rounded-lg p-3 text-center">
              <Zap className="w-4 h-4 text-green-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-muted-foreground">{currentSession.interactions}</p>
              <p className="text-xs text-muted-foreground">Interactions</p>
            </div>
            <div className="bg-surface-base rounded-lg p-3 text-center">
              <Target className="w-4 h-4 text-amber-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-muted-foreground">{currentSession.corrections}</p>
              <p className="text-xs text-muted-foreground">Corrections</p>
            </div>
            <div className="bg-surface-base rounded-lg p-3 text-center">
              <CheckCircle className="w-4 h-4 text-blue-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-muted-foreground">{currentSession.accuracy}%</p>
              <p className="text-xs text-muted-foreground">Accuracy</p>
            </div>
          </div>

          {/* Skills progress */}
          {currentSession.skills.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">Skills Progress</h4>
              {currentSession.skills.map((skill, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{skill.name}</span>
                    <span className="text-muted-foreground">
                      {skill.progress}% / {skill.target}%
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full flex">
                      <div
                        className="bg-purple-500 rounded-l-full"
                        style={{ width: `${skill.progress}%` }}
                      />
                      <div
                        className="bg-purple-500/30"
                        style={{ width: `${skill.target - skill.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Session History */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-semibold text-muted-foreground mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-purple-400" />
          Recent Sessions
        </h3>

        {sessions.length === 0 && !currentSession ? (
          <div className="text-center py-8">
            <Clock className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No training sessions yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Start a session to begin tracking progress
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.slice(0, 5).map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-3 bg-surface-base rounded-lg"
              >
                <div>
                  <p className="font-medium text-muted-foreground">{session.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {session.startedAt.toLocaleDateString()} •{' '}
                    {formatDuration(session.durationMs)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">
                    {session.interactions} interactions
                  </span>
                  <span
                    className={clsx(
                      'px-2 py-0.5 rounded-full text-xs',
                      session.status === 'completed'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {session.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SessionLog;
