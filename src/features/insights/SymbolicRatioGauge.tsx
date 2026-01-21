/**
 * SymbolicRatioGauge Component
 *
 * Displays a circular progress gauge showing the ratio of symbolic (Core)
 * to neural (Conductor) processing. Animated on mount.
 */

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Cpu, Brain } from 'lucide-react';
import type { SymbolicRatioData } from './insights-store';

interface SymbolicRatioGaugeProps {
  data: SymbolicRatioData;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const sizeConfig = {
  sm: {
    width: 120,
    strokeWidth: 8,
    fontSize: 'text-xl',
    labelSize: 'text-xs',
  },
  md: {
    width: 160,
    strokeWidth: 10,
    fontSize: 'text-3xl',
    labelSize: 'text-sm',
  },
  lg: {
    width: 200,
    strokeWidth: 12,
    fontSize: 'text-4xl',
    labelSize: 'text-base',
  },
};

export function SymbolicRatioGauge({
  data,
  className,
  size = 'md',
  animated = true,
}: SymbolicRatioGaugeProps) {
  const [animatedPercent, setAnimatedPercent] = useState(animated ? 0 : data.symbolic);
  const animationRef = useRef<number | null>(null);
  const hasAnimated = useRef(false);

  const config = sizeConfig[size];
  const radius = (config.width - config.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedPercent / 100) * circumference;

  useEffect(() => {
    if (!animated || hasAnimated.current) {
      setAnimatedPercent(data.symbolic);
      return;
    }

    hasAnimated.current = true;
    const duration = 1500; // ms
    const startTime = performance.now();
    const startValue = 0;
    const endValue = data.symbolic;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out cubic)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (endValue - startValue) * easeOut;

      setAnimatedPercent(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [data.symbolic, animated]);

  return (
    <Card className={cn('bg-card/50 border-border/50', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-foreground">Processing Distribution</CardTitle>
        <CardDescription className="text-muted-foreground">
          Symbolic (Core) vs Neural (Conductor) routing
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center pt-4">
        {/* Gauge */}
        <div className="relative" style={{ width: config.width, height: config.width }}>
          <svg
            width={config.width}
            height={config.width}
            className="transform -rotate-90"
          >
            {/* Background circle */}
            <circle
              cx={config.width / 2}
              cy={config.width / 2}
              r={radius}
              fill="none"
              stroke="#334155"
              strokeWidth={config.strokeWidth}
            />
            {/* Progress circle */}
            <circle
              cx={config.width / 2}
              cy={config.width / 2}
              r={radius}
              fill="none"
              stroke="url(#gaugeGradient)"
              strokeWidth={config.strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-100"
            />
            {/* Gradient definition */}
            <defs>
              <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn('font-bold text-foreground', config.fontSize)}>
              {Math.round(animatedPercent)}%
            </span>
            <span className={cn('text-muted-foreground', config.labelSize)}>Symbolic</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-6 w-full">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/10">
              <Cpu className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{data.symbolic}% Symbolic</p>
              <p className="text-xs text-muted-foreground">
                {data.symbolicRequests.toLocaleString()} requests
              </p>
            </div>
          </div>
          <div className="w-px h-8 bg-muted" />
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-500/10">
              <Brain className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{data.neural}% Neural</p>
              <p className="text-xs text-muted-foreground">
                {data.neuralRequests.toLocaleString()} requests
              </p>
            </div>
          </div>
        </div>

        {/* Total requests */}
        <div className="mt-4 pt-4 border-t border-border w-full text-center">
          <p className="text-xs text-muted-foreground">
            Total: {data.totalRequests.toLocaleString()} requests processed
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Last updated: {data.lastUpdated.toLocaleTimeString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default SymbolicRatioGauge;
