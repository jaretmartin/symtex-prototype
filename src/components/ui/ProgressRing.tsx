import clsx from 'clsx'

interface ProgressRingProps {
  progress: number // 0-100
  size?: number
  strokeWidth?: number
  color?: string
  bgColor?: string
  showPercentage?: boolean
  className?: string
}

export default function ProgressRing({
  progress,
  size = 60,
  strokeWidth = 4,
  color = '#6366f1',
  bgColor = '#334155',
  showPercentage = true,
  className
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className={clsx('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={bgColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500 ease-out progress-ring-animate"
          style={{ '--progress-offset': offset } as React.CSSProperties}
        />
      </svg>
      {showPercentage && (
        <span className="absolute text-xs font-semibold text-white">
          {Math.round(progress)}%
        </span>
      )}
    </div>
  )
}
