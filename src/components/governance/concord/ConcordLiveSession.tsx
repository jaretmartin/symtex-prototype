/**
 * ConcordLiveSession Component
 *
 * Real-time view of Cognate debate/negotiation with transcript,
 * consensus gauge, and participant dynamics.
 */

import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Play,
  Pause,
  Square,
  MessageSquare,
  BarChart2,
  Clock,
  CheckCircle,
  ArrowLeft,
  Send,
  Brain,
  ChevronRight,
} from 'lucide-react';
import clsx from 'clsx';
import { useConcordStore } from './concordStore';
import type { Sentiment } from './types';

// ============================================================================
// Sentiment Color Map
// ============================================================================

const SENTIMENT_COLORS: Record<Sentiment, string> = {
  assertive: 'bg-orange-500/20 text-orange-400',
  constructive: 'bg-blue-500/20 text-blue-400',
  analytical: 'bg-purple-500/20 text-purple-400',
  compromising: 'bg-green-500/20 text-green-400',
  agreeable: 'bg-emerald-500/20 text-emerald-400',
  supportive: 'bg-teal-500/20 text-teal-400',
  neutral: 'bg-muted/20 text-muted-foreground',
};

// ============================================================================
// Main Component
// ============================================================================

export function ConcordLiveSession() {
  const navigate = useNavigate();
  const transcriptRef = useRef<HTMLDivElement>(null);

  const {
    currentSession,
    isRunning,
    elapsedTime,
    dynamics,
    pauseSession,
    resumeSession,
    endSession,
    setElapsedTime,
    injectHumanInput,
    getParticipantInfo,
  } = useConcordStore();

  const [humanInput, setHumanInput] = useState('');
  const [showHumanInput, setShowHumanInput] = useState(false);

  // Redirect if no session
  useEffect(() => {
    if (!currentSession) {
      navigate('/governance/concord/setup');
    }
  }, [currentSession, navigate]);

  // Timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime(elapsedTime + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, elapsedTime, setElapsedTime]);

  // Auto-scroll transcript
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [currentSession?.transcript.length]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndEarly = () => {
    endSession();
    navigate('/governance/concord');
  };

  const handleHumanOverride = () => {
    if (!humanInput.trim()) return;
    injectHumanInput(humanInput);
    setHumanInput('');
    setShowHumanInput(false);
  };

  if (!currentSession || !dynamics) {
    return null;
  }

  const totalTimeLimit = (currentSession.constraints?.timeLimit || 10) * 60;
  const timeProgress = (elapsedTime / totalTimeLimit) * 100;

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Link
            to="/governance/concord"
            className="p-2 hover:bg-card rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-muted-foreground">CONCORD: {currentSession.topic}</h1>
              <span
                className={clsx(
                  'px-2 py-0.5 text-xs font-medium rounded-full',
                  isRunning ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'
                )}
              >
                {isRunning ? 'LIVE' : 'PAUSED'}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{currentSession.participants.length} participants</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Timer */}
          <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-xl">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="font-mono font-bold text-muted-foreground">
              {formatTime(elapsedTime)} / {formatTime(totalTimeLimit)}
            </span>
          </div>

          {/* Controls */}
          {isRunning ? (
            <button
              onClick={pauseSession}
              className="px-4 py-2 bg-amber-500/20 text-amber-400 rounded-xl hover:bg-amber-500/30 transition-colors flex items-center gap-2 font-medium"
            >
              <Pause className="w-4 h-4" />
              Pause
            </button>
          ) : (
            <button
              onClick={resumeSession}
              className="px-4 py-2 bg-green-500/20 text-green-400 rounded-xl hover:bg-green-500/30 transition-colors flex items-center gap-2 font-medium"
            >
              <Play className="w-4 h-4" />
              Resume
            </button>
          )}
          <button
            onClick={handleEndEarly}
            className="px-4 py-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors flex items-center gap-2 font-medium"
          >
            <Square className="w-4 h-4" />
            End
          </button>
        </div>
      </div>

      {/* Time Progress Bar */}
      <div className="h-1.5 bg-muted rounded-full mb-4 overflow-hidden">
        <div
          className={clsx(
            'h-full transition-all',
            timeProgress > 90 ? 'bg-red-500' : timeProgress > 70 ? 'bg-amber-500' : 'bg-purple-600'
          )}
          style={{ width: `${Math.min(timeProgress, 100)}%` }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
        {/* Transcript Panel */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border flex flex-col overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="font-semibold flex items-center gap-2 text-muted-foreground">
              <MessageSquare className="w-5 h-5 text-purple-400" />
              Live Transcript
            </h2>
            <button
              onClick={() => setShowHumanInput(!showHumanInput)}
              className="px-3 py-1.5 text-sm bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
            >
              Override: Human Input
            </button>
          </div>

          {/* Human Input Area */}
          {showHumanInput && (
            <div className="p-4 bg-purple-900/20 border-b border-purple-700">
              <p className="text-sm text-purple-400 mb-2">
                Inject a human perspective into the discussion:
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={humanInput}
                  onChange={(e) => setHumanInput(e.target.value)}
                  placeholder="Type your input..."
                  className="flex-1 px-3 py-2 bg-surface-base rounded-lg border border-border focus:outline-none focus:border-purple-500 text-muted-foreground"
                />
                <button
                  onClick={handleHumanOverride}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Transcript Content */}
          <div ref={transcriptRef} className="flex-1 p-4 overflow-y-auto space-y-4">
            {currentSession.transcript.map((turn, index) => {
              const cognateInfo = turn.speaker === 'human'
                ? { name: 'Human Override', avatar: '👤', role: 'Operator' }
                : getParticipantInfo(turn.speaker);
              const isLatest = index === currentSession.transcript.length - 1;

              return (
                <div
                  key={index}
                  className={clsx('flex gap-3', isLatest && isRunning && 'animate-pulse')}
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-lg flex-shrink-0">
                    {cognateInfo?.avatar || '?'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-muted-foreground">{cognateInfo?.name || 'Unknown'}</span>
                      <span className="text-xs text-muted-foreground">{turn.timestamp}</span>
                      {turn.speaker !== 'human' && (
                        <button className="text-xs text-purple-400 hover:underline flex items-center gap-1">
                          <Brain className="w-3 h-3" />
                          View reasoning
                        </button>
                      )}
                    </div>
                    <p className="text-muted-foreground">{turn.message}</p>
                    <span
                      className={clsx(
                        'inline-block mt-1 text-xs px-2 py-0.5 rounded-full',
                        SENTIMENT_COLORS[turn.sentiment]
                      )}
                    >
                      {turn.sentiment}
                    </span>
                  </div>
                </div>
              );
            })}

            {isRunning && (
              <div className="flex gap-3 items-center text-muted-foreground">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                  <div className="flex gap-1">
                    <span
                      className="w-2 h-2 bg-muted rounded-full animate-bounce"
                      style={{ animationDelay: '0ms' }}
                    />
                    <span
                      className="w-2 h-2 bg-muted rounded-full animate-bounce"
                      style={{ animationDelay: '150ms' }}
                    />
                    <span
                      className="w-2 h-2 bg-muted rounded-full animate-bounce"
                      style={{ animationDelay: '300ms' }}
                    />
                  </div>
                </div>
                <span className="text-sm italic">Cognates are deliberating...</span>
              </div>
            )}
          </div>
        </div>

        {/* Dynamics Panel */}
        <div className="space-y-4 overflow-y-auto">
          {/* Consensus Gauge */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-semibold mb-4 flex items-center gap-2 text-muted-foreground">
              <BarChart2 className="w-5 h-5 text-purple-400" />
              Consensus Level
            </h3>
            <div className="relative pt-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl font-bold text-muted-foreground">{dynamics.consensus}%</span>
                <span
                  className={clsx(
                    'text-sm px-2 py-1 rounded-lg',
                    dynamics.consensus >= 75
                      ? 'bg-green-500/20 text-green-400'
                      : dynamics.consensus >= 50
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-red-500/20 text-red-400'
                  )}
                >
                  {dynamics.consensus >= 75 ? 'Strong' : dynamics.consensus >= 50 ? 'Building' : 'Divergent'}
                </span>
              </div>
              <div className="h-4 bg-muted rounded-full overflow-hidden">
                <div
                  className={clsx(
                    'h-full transition-all duration-500',
                    dynamics.consensus >= 75
                      ? 'bg-green-500'
                      : dynamics.consensus >= 50
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                  )}
                  style={{ width: `${dynamics.consensus}%` }}
                />
              </div>
            </div>
          </div>

          {/* Participant Alignment */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-semibold mb-4 text-muted-foreground">Participant Alignment</h3>
            <div className="space-y-4">
              {dynamics.participantAlignment.map((participant) => {
                const cognateInfo = getParticipantInfo(participant.cognateId);
                return (
                  <div key={participant.cognateId}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{cognateInfo?.avatar || '?'}</span>
                        <span className="text-sm font-medium text-muted-foreground">
                          {cognateInfo?.name || 'Unknown'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-muted-foreground">{participant.alignment}%</span>
                        {participant.trend === 'increasing' && (
                          <span className="text-xs text-green-400">+</span>
                        )}
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-600 rounded-full transition-all"
                        style={{ width: `${participant.alignment}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Emerging Consensus */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-semibold mb-4 flex items-center gap-2 text-muted-foreground">
              <CheckCircle className="w-5 h-5 text-green-400" />
              Emerging Consensus
            </h3>
            <ul className="space-y-2">
              {dynamics.emergingConsensus.map((point, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <ChevronRight className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Estimated Time */}
          <div className="bg-gradient-to-br from-purple-900/20 to-zinc-800 rounded-xl border border-purple-700/50 p-5">
            <h3 className="font-semibold mb-2 text-muted-foreground">Estimated Completion</h3>
            <p className="text-2xl font-bold text-purple-400">
              ~{Math.ceil(dynamics.estimatedTimeRemaining / 60)} min
            </p>
            <p className="text-sm text-muted-foreground mt-1">Current: {dynamics.currentTopic}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConcordLiveSession;
