import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { GitCompare, Play, Pause, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SimulationStep {
  id: string;
  label: string;
  before: { value: string; status: 'neutral' | 'warning' | 'error' };
  after: { value: string; status: 'neutral' | 'success' | 'improved' };
  impact: string;
}

interface SimulationDiffProps {
  title?: string;
  steps: SimulationStep[];
  autoPlay?: boolean;
  className?: string;
}

export function SimulationDiff({
  title = 'AI Decision Simulation',
  steps,
  autoPlay = false,
  className
}: SimulationDiffProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [showAfter, setShowAfter] = useState(false);

  // Auto-advance simulation
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setShowAfter(prev => {
        if (!prev) return true;
        // Move to next step
        setCurrentStep(s => {
          if (s >= steps.length - 1) {
            setIsPlaying(false);
            return s;
          }
          return s + 1;
        });
        return false;
      });
    }, 2000);

    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

  const step = steps[currentStep];

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-primary" />
            {title}
          </CardTitle>
          <div className="flex gap-1">
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={() => {
                setCurrentStep(0);
                setShowAfter(false);
              }}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Progress indicator */}
        <div className="flex gap-1 mb-4">
          {steps.map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-1 flex-1 rounded-full transition-colors',
                i < currentStep ? 'bg-primary' :
                i === currentStep ? 'bg-primary/50' : 'bg-muted'
              )}
            />
          ))}
        </div>

        {/* Step label */}
        <p className="text-sm font-medium mb-3">{step.label}</p>

        {/* Before/After comparison */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            className={cn(
              'p-3 rounded-lg border',
              step.before.status === 'warning' && 'border-yellow-500/50 bg-yellow-500/10',
              step.before.status === 'error' && 'border-red-500/50 bg-red-500/10',
              step.before.status === 'neutral' && 'border-muted'
            )}
          >
            <p className="text-xs text-muted-foreground mb-1">Before</p>
            <p className="text-sm font-mono">{step.before.value}</p>
          </motion.div>

          <AnimatePresence mode="wait">
            {showAfter ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                  'p-3 rounded-lg border',
                  step.after.status === 'success' && 'border-green-500/50 bg-green-500/10',
                  step.after.status === 'improved' && 'border-blue-500/50 bg-blue-500/10'
                )}
              >
                <p className="text-xs text-muted-foreground mb-1">After (AI)</p>
                <p className="text-sm font-mono">{step.after.value}</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 rounded-lg border border-dashed border-muted flex items-center justify-center"
              >
                <p className="text-xs text-muted-foreground">Processing...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Impact statement */}
        {showAfter && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-muted-foreground mt-3 text-center"
          >
            {step.impact}
          </motion.p>
        )}
      </CardContent>
    </Card>
  );
}

// Export types for external use
export type { SimulationStep, SimulationDiffProps };
