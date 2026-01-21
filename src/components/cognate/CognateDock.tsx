/**
 * CognateDock Component
 *
 * Persistent floating dock showing active Cognates and their states.
 * Provides an "alive" presence indicator for running Cognates.
 *
 * Features:
 * - 10 distinct Cognate states with unique animations
 * - Progress ring for running/simulating states
 * - Hover tooltips with Cognate name and state
 * - Click to navigate to Cognate detail
 * - Respects prefers-reduced-motion
 * - Configurable position (bottom-left or bottom-right)
 * - Compact avatar view (up to maxVisible)
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Brain, Check, X, Clock, AlertCircle, Sparkles } from 'lucide-react';
import clsx from 'clsx';
import { useDemoContext, type CognateState, type ActiveCognate } from '@/demo/DemoContext';

// ============================================================================
// Types
// ============================================================================

// Re-export types from DemoContext for external use
export type { CognateState, ActiveCognate };

export interface CognateDockProps {
  position?: 'bottom-left' | 'bottom-right';
  maxVisible?: number;
  className?: string;
}

// ============================================================================
// Constants
// ============================================================================

/**
 * State configuration with colors, labels, and icons
 */
const STATE_CONFIG: Record<CognateState, {
  label: string;
  borderColor: string;
  bgColor: string;
  ringColor: string;
  icon?: 'check' | 'x' | 'clock' | 'alert' | 'sparkle';
}> = {
  idle: {
    label: 'Idle',
    borderColor: 'border-muted',
    bgColor: 'bg-muted/20',
    ringColor: 'stroke-muted',
  },
  listening: {
    label: 'Listening',
    borderColor: 'border-info',
    bgColor: 'bg-info/20',
    ringColor: 'stroke-info',
  },
  planning: {
    label: 'Planning',
    borderColor: 'border-accent',
    bgColor: 'bg-accent/20',
    ringColor: 'stroke-accent',
  },
  waiting_approval: {
    label: 'Waiting for Approval',
    borderColor: 'border-warning',
    bgColor: 'bg-warning/20',
    ringColor: 'stroke-warning',
    icon: 'clock',
  },
  simulating: {
    label: 'Simulating',
    borderColor: 'border-info',
    bgColor: 'bg-info/20',
    ringColor: 'stroke-info',
  },
  running: {
    label: 'Running',
    borderColor: 'border-success',
    bgColor: 'bg-success/20',
    ringColor: 'stroke-success',
  },
  blocked: {
    label: 'Blocked',
    borderColor: 'border-error',
    bgColor: 'bg-error/20',
    ringColor: 'stroke-error',
    icon: 'alert',
  },
  needs_review: {
    label: 'Needs Review',
    borderColor: 'border-warning',
    bgColor: 'bg-warning/20',
    ringColor: 'stroke-warning',
    icon: 'alert',
  },
  completed: {
    label: 'Completed',
    borderColor: 'border-success',
    bgColor: 'bg-success/20',
    ringColor: 'stroke-success',
    icon: 'check',
  },
  error: {
    label: 'Error',
    borderColor: 'border-error',
    bgColor: 'bg-error/20',
    ringColor: 'stroke-error',
    icon: 'x',
  },
};

// ============================================================================
// Hooks
// ============================================================================

/**
 * Hook to detect reduced motion preference
 */
function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent): void => {
      setReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return reducedMotion;
}

// ============================================================================
// Animation Variants
// ============================================================================

const pulseVariants: Variants = {
  pulse: {
    opacity: [0.6, 1, 0.6],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

const flashVariants: Variants = {
  flash: {
    opacity: [1, 0.4, 1],
    scale: [1, 1.05, 1],
    transition: {
      duration: 0.8,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

const shakeVariants: Variants = {
  shake: {
    x: [0, -4, 4, -4, 4, 0],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      repeatDelay: 2,
      ease: 'easeInOut',
    },
  },
};

const bounceVariants: Variants = {
  bounce: {
    y: [0, -4, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatDelay: 1,
      ease: 'easeOut',
    },
  },
};

const celebrateVariants: Variants = {
  celebrate: {
    scale: [1, 1.15, 1],
    transition: {
      duration: 0.4,
      times: [0, 0.5, 1],
      ease: 'easeOut',
    },
  },
};

// ============================================================================
// Sub-Components
// ============================================================================

interface ProgressRingProps {
  progress: number;
  size: number;
  strokeWidth: number;
  colorClass: string;
}

/**
 * Circular progress ring for simulating/running states
 */
function ProgressRing({ progress, size, strokeWidth, colorClass }: ProgressRingProps): JSX.Element {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg
      className="absolute inset-0 -rotate-90"
      width={size}
      height={size}
      aria-hidden="true"
    >
      {/* Background ring */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        strokeWidth={strokeWidth}
        className="stroke-muted/30"
      />
      {/* Progress ring */}
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        className={colorClass}
        style={{
          strokeDasharray: circumference,
          strokeDashoffset: offset,
        }}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
    </svg>
  );
}

interface ThinkingDotsProps {
  className?: string;
}

/**
 * Animated thinking dots for planning state
 */
function ThinkingDots({ className }: ThinkingDotsProps): JSX.Element {
  return (
    <motion.div
      className={clsx('absolute inset-0 flex items-center justify-center', className)}
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
    >
      <div className="flex gap-0.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-1 h-1 rounded-full bg-accent"
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

interface StateBadgeProps {
  state: CognateState;
  reducedMotion: boolean;
}

/**
 * Corner badge showing state icon
 */
function StateBadge({ state, reducedMotion }: StateBadgeProps): JSX.Element | null {
  const config = STATE_CONFIG[state];
  if (!config.icon) return null;

  const iconClass = 'w-2.5 h-2.5';
  let IconComponent: JSX.Element;
  let bgColor: string;

  switch (config.icon) {
    case 'check':
      IconComponent = <Check className={clsx(iconClass, 'text-success')} />;
      bgColor = 'bg-success/20 border-success/30';
      break;
    case 'x':
      IconComponent = <X className={clsx(iconClass, 'text-error')} />;
      bgColor = 'bg-error/20 border-error/30';
      break;
    case 'clock':
      IconComponent = <Clock className={clsx(iconClass, 'text-warning')} />;
      bgColor = 'bg-warning/20 border-warning/30';
      break;
    case 'alert':
      IconComponent = <AlertCircle className={clsx(iconClass, 'text-warning')} />;
      bgColor = 'bg-warning/20 border-warning/30';
      break;
    case 'sparkle':
      IconComponent = <Sparkles className={clsx(iconClass, 'text-accent')} />;
      bgColor = 'bg-accent/20 border-accent/30';
      break;
    default:
      return null;
  }

  const shouldBounce = state === 'needs_review' && !reducedMotion;

  return (
    <motion.div
      className={clsx(
        'absolute -top-0.5 -right-0.5 z-10',
        'w-4 h-4 rounded-full',
        'flex items-center justify-center',
        'border',
        bgColor
      )}
      variants={shouldBounce ? bounceVariants : undefined}
      animate={shouldBounce ? 'bounce' : undefined}
    >
      {IconComponent}
    </motion.div>
  );
}

interface CognateAvatarProps {
  cognate: ActiveCognate;
  onClick: (id: string) => void;
  reducedMotion: boolean;
}

/**
 * Individual Cognate avatar with state animations
 */
function CognateAvatar({ cognate, onClick, reducedMotion }: CognateAvatarProps): JSX.Element {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const config = STATE_CONFIG[cognate.state];

  // Show tooltip after delay on hover
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (isHovered) {
      timeout = setTimeout(() => setShowTooltip(true), 400);
    } else {
      setShowTooltip(false);
    }
    return () => clearTimeout(timeout);
  }, [isHovered]);

  // Determine which animation to apply
  const getAnimationVariant = useCallback((): { variants: Variants; animate: string } | null => {
    if (reducedMotion) return null;

    switch (cognate.state) {
      case 'listening':
        return { variants: pulseVariants, animate: 'pulse' };
      case 'waiting_approval':
        return { variants: flashVariants, animate: 'flash' };
      case 'blocked':
      case 'error':
        return { variants: shakeVariants, animate: 'shake' };
      case 'completed':
        return { variants: celebrateVariants, animate: 'celebrate' };
      default:
        return null;
    }
  }, [cognate.state, reducedMotion]);

  const animation = getAnimationVariant();

  const showProgressRing = (cognate.state === 'simulating' || cognate.state === 'running') && cognate.progress !== undefined;
  const showThinkingDots = cognate.state === 'planning' && !reducedMotion;

  // Get display name from ID (format: "cog-name" -> "Name")
  const displayName = cognate.id.replace(/^cog-/, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div className="relative">
      <motion.button
        type="button"
        onClick={() => onClick(cognate.id)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        className={clsx(
          'relative w-8 h-8 rounded-full',
          'border-2 transition-colors duration-200',
          'flex items-center justify-center',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-card focus:ring-primary',
          config.borderColor,
          config.bgColor
        )}
        variants={animation?.variants}
        animate={animation?.animate}
        whileHover={!reducedMotion ? { scale: 1.1 } : undefined}
        whileTap={!reducedMotion ? { scale: 0.95 } : undefined}
        aria-label={`${displayName} - ${config.label}${cognate.progress ? ` (${cognate.progress}%)` : ''}`}
      >
        {/* Progress ring overlay */}
        {showProgressRing && (
          <ProgressRing
            progress={cognate.progress!}
            size={32}
            strokeWidth={2}
            colorClass={config.ringColor}
          />
        )}

        {/* Thinking dots overlay */}
        {showThinkingDots && <ThinkingDots />}

        {/* Default brain icon */}
        <Brain className="w-4 h-4 text-foreground/70" />

        {/* State badge */}
        <StateBadge state={cognate.state} reducedMotion={reducedMotion} />
      </motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            role="tooltip"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className={clsx(
              'absolute bottom-full left-1/2 -translate-x-1/2 mb-2',
              'px-2 py-1 rounded-md',
              'bg-card/95 backdrop-blur-sm border border-border/50',
              'text-xs text-foreground whitespace-nowrap',
              'shadow-lg shadow-black/20',
              'pointer-events-none z-50'
            )}
          >
            <div className="font-medium">{displayName}</div>
            <div className="text-muted-foreground">
              {config.label}
              {cognate.progress !== undefined && ` (${cognate.progress}%)`}
            </div>
            {/* Tooltip arrow */}
            <div
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-card/95 border-r border-b border-border/50 transform rotate-45"
              aria-hidden="true"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function CognateDock({
  position = 'bottom-left',
  maxVisible = 6,
  className,
}: CognateDockProps): JSX.Element | null {
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  const { activeCognates, demoMode } = useDemoContext();

  const { visibleCognates, overflowCount } = useMemo(() => {
    const visible = activeCognates.slice(0, maxVisible);
    const overflow = Math.max(0, activeCognates.length - maxVisible);
    return { visibleCognates: visible, overflowCount: overflow };
  }, [activeCognates, maxVisible]);

  const handleCognateClick = useCallback(
    (id: string): void => {
      navigate(`/studio/cognates/${id}`);
    },
    [navigate]
  );

  // Don't render if no active Cognates or demo mode is off
  if (!demoMode || activeCognates.length === 0) {
    return null;
  }

  const positionClasses =
    position === 'bottom-left' ? 'bottom-4 left-4' : 'bottom-4 right-4';

  return (
    <motion.div
      className={clsx('fixed z-40', positionClasses, className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.3, ease: 'easeOut' }}
    >
      {/* Dock container */}
      <div
        className={clsx(
          'flex items-center gap-2',
          'bg-card/95 backdrop-blur-sm',
          'border border-border rounded-2xl',
          'p-2 shadow-lg shadow-black/20'
        )}
        role="toolbar"
        aria-label="Active Cognates"
      >
        {/* Cognate avatars */}
        <AnimatePresence mode="popLayout">
          {visibleCognates.map((cognate) => (
            <motion.div
              key={cognate.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: reducedMotion ? 0 : 0.2 }}
            >
              <CognateAvatar
                cognate={cognate}
                onClick={handleCognateClick}
                reducedMotion={reducedMotion}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Overflow indicator */}
        {overflowCount > 0 && (
          <motion.button
            type="button"
            className={clsx(
              'w-8 h-8 rounded-full',
              'bg-muted/30 hover:bg-muted/50',
              'flex items-center justify-center',
              'text-xs font-medium text-muted-foreground',
              'transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-card focus:ring-primary'
            )}
            onClick={() => navigate('/studio/cognates')}
            whileHover={!reducedMotion ? { scale: 1.05 } : undefined}
            whileTap={!reducedMotion ? { scale: 0.95 } : undefined}
            aria-label={`View ${overflowCount} more Cognates`}
          >
            +{overflowCount}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

export default CognateDock;
