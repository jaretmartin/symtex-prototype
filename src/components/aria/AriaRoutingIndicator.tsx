/**
 * AriaRoutingIndicator Component
 *
 * Visual indicator showing when Aria is routing a request to a Cognate.
 * Displays the routing flow: User -> Aria -> Selected Cognate.
 *
 * Features:
 * - Animated flow visualization
 * - Shows which Cognate was selected
 * - Explains why the Cognate was chosen
 * - Smooth transitions between states
 */

import { useMemo } from 'react';
import { User, Sparkles, Bot, ArrowRight, Check } from 'lucide-react';
import clsx from 'clsx';
import type { Cognate } from '@/types';

// ============================================================================
// Types
// ============================================================================

export type RoutingStatus = 'routing' | 'selected' | 'complete';

export interface RoutingState {
  /** Current status of the routing process */
  status: RoutingStatus;
  /** The selected Cognate (if status is 'selected' or 'complete') */
  selectedCognate?: Cognate;
  /** Reason why this Cognate was selected */
  reason?: string;
}

export interface AriaRoutingIndicatorProps {
  /** Current routing status */
  status: RoutingStatus;
  /** Selected Cognate for the request */
  selectedCognate?: Cognate;
  /** Reason for selecting this Cognate */
  reason?: string;
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Sub-components
// ============================================================================

interface RoutingNodeProps {
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  isActive: boolean;
  isCompleted: boolean;
  variant: 'user' | 'aria' | 'cognate';
}

function RoutingNode({
  icon,
  label,
  sublabel,
  isActive,
  isCompleted,
  variant,
}: RoutingNodeProps): JSX.Element {
  const variantStyles = useMemo(() => {
    switch (variant) {
      case 'user':
        return {
          bg: 'bg-blue-500/20',
          border: 'border-blue-500/40',
          text: 'text-blue-400',
          glow: 'shadow-blue-500/20',
        };
      case 'aria':
        return {
          bg: 'bg-gradient-to-br from-violet-600/30 to-fuchsia-600/30',
          border: 'border-violet-500/40',
          text: 'text-violet-400',
          glow: 'shadow-violet-500/30',
        };
      case 'cognate':
        return {
          bg: 'bg-emerald-500/20',
          border: 'border-emerald-500/40',
          text: 'text-emerald-400',
          glow: 'shadow-emerald-500/20',
        };
    }
  }, [variant]);

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className={clsx(
          'relative w-10 h-10 rounded-full',
          'flex items-center justify-center',
          'border-2 transition-all duration-300',
          variantStyles.bg,
          variantStyles.border,
          isActive && 'ring-2 ring-offset-1 ring-offset-slate-900',
          isActive && variant === 'aria' && 'ring-violet-400/50',
          isActive && variant === 'user' && 'ring-blue-400/50',
          isActive && variant === 'cognate' && 'ring-emerald-400/50',
          isActive && 'shadow-lg',
          isActive && variantStyles.glow
        )}
      >
        {/* Completed check overlay */}
        {isCompleted && (
          <div
            className={clsx(
              'absolute inset-0 rounded-full',
              'bg-emerald-500/20',
              'flex items-center justify-center',
              'animate-in zoom-in duration-200'
            )}
          >
            <Check className="w-5 h-5 text-emerald-400" />
          </div>
        )}

        {/* Icon */}
        {!isCompleted && (
          <span
            className={clsx(
              'transition-transform duration-300',
              isActive && 'scale-110',
              variantStyles.text
            )}
          >
            {icon}
          </span>
        )}

        {/* Pulse animation for active state */}
        {isActive && !isCompleted && (
          <span
            className={clsx(
              'absolute inset-0 rounded-full',
              variant === 'aria' && 'bg-violet-500/30',
              variant === 'cognate' && 'bg-emerald-500/30',
              'animate-ping'
            )}
            style={{ animationDuration: '1.5s' }}
          />
        )}
      </div>

      {/* Label */}
      <div className="text-center">
        <p
          className={clsx(
            'text-xs font-medium transition-colors',
            isActive ? 'text-white' : 'text-slate-400'
          )}
        >
          {label}
        </p>
        {sublabel && (
          <p className="text-[10px] text-slate-500 max-w-[80px] truncate">
            {sublabel}
          </p>
        )}
      </div>
    </div>
  );
}

interface RoutingArrowProps {
  isActive: boolean;
  isCompleted: boolean;
}

function RoutingArrow({ isActive, isCompleted }: RoutingArrowProps): JSX.Element {
  return (
    <div className="relative flex items-center justify-center w-8">
      {/* Connection line */}
      <div
        className={clsx(
          'absolute top-5 left-0 right-0 h-0.5',
          'transition-all duration-300',
          isCompleted
            ? 'bg-emerald-500/50'
            : isActive
            ? 'bg-violet-500/50'
            : 'bg-slate-700/50'
        )}
      />

      {/* Animated dot traveling along the line */}
      {isActive && !isCompleted && (
        <div
          className={clsx(
            'absolute top-4 w-2 h-2 rounded-full',
            'bg-violet-400',
            'shadow-lg shadow-violet-500/50',
            'animate-bounce'
          )}
          style={{
            animation: 'travelRight 1s ease-in-out infinite',
          }}
        />
      )}

      {/* Arrow icon */}
      <ArrowRight
        className={clsx(
          'w-4 h-4 relative z-10',
          'transition-colors duration-300',
          isCompleted
            ? 'text-emerald-500'
            : isActive
            ? 'text-violet-400'
            : 'text-slate-600'
        )}
      />

      {/* CSS animation for traveling dot */}
      <style>{`
        @keyframes travelRight {
          0%, 100% { left: 0; opacity: 0.5; }
          50% { left: calc(100% - 8px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function AriaRoutingIndicator({
  status,
  selectedCognate,
  reason,
  className,
}: AriaRoutingIndicatorProps): JSX.Element {
  const isRouting = status === 'routing';
  const isSelected = status === 'selected' || status === 'complete';
  const isComplete = status === 'complete';

  return (
    <div
      className={clsx(
        'px-4 py-3',
        'bg-slate-800/50 border-b border-violet-500/20',
        'animate-in slide-in-from-top fade-in duration-200',
        className
      )}
      role="status"
      aria-live="polite"
      aria-label={
        isRouting
          ? 'Aria is analyzing your request'
          : isSelected
          ? `Routing to ${selectedCognate?.name || 'Cognate'}`
          : 'Routing complete'
      }
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
        <span className="text-sm font-medium text-violet-300">
          {isRouting && 'Analyzing your request...'}
          {isSelected && !isComplete && 'Routing to specialist...'}
          {isComplete && 'Request routed'}
        </span>
      </div>

      {/* Routing flow visualization */}
      <div className="flex items-start justify-center gap-1">
        {/* User node */}
        <RoutingNode
          icon={<User className="w-4 h-4" />}
          label="You"
          isActive={false}
          isCompleted={true}
          variant="user"
        />

        {/* Arrow to Aria */}
        <RoutingArrow isActive={isRouting} isCompleted={isSelected} />

        {/* Aria node */}
        <RoutingNode
          icon={<Sparkles className="w-4 h-4" />}
          label="Aria"
          sublabel={isRouting ? 'Thinking...' : 'Orchestrated'}
          isActive={isRouting}
          isCompleted={isSelected}
          variant="aria"
        />

        {/* Arrow to Cognate */}
        <RoutingArrow isActive={isSelected && !isComplete} isCompleted={isComplete} />

        {/* Cognate node */}
        <RoutingNode
          icon={<Bot className="w-4 h-4" />}
          label={selectedCognate?.name || 'Cognate'}
          sublabel={isSelected ? 'Selected' : 'Waiting...'}
          isActive={isSelected && !isComplete}
          isCompleted={isComplete}
          variant="cognate"
        />
      </div>

      {/* Reason text */}
      {reason && isSelected && (
        <div
          className={clsx(
            'mt-3 px-3 py-2',
            'bg-violet-500/10 border border-violet-500/20 rounded-lg',
            'animate-in fade-in slide-in-from-bottom-2 duration-200'
          )}
        >
          <p className="text-xs text-violet-300/80">
            <span className="font-medium">Why?</span> {reason}
          </p>
        </div>
      )}
    </div>
  );
}

export default AriaRoutingIndicator;
