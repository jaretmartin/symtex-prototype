import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Heart, Landmark, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Scenario {
  id: string;
  name: string;
  industry: string;
  icon: typeof Building2;
  color: string;
}

const scenarios: Scenario[] = [
  {
    id: 'healthcare',
    name: 'MedFirst Health System',
    industry: 'Healthcare',
    icon: Heart,
    color: 'text-rose-400',
  },
  {
    id: 'financial',
    name: 'Pacific Coast Credit Union',
    industry: 'Financial Services',
    icon: Landmark,
    color: 'text-emerald-400',
  },
  {
    id: 'generic',
    name: 'Acme Corporation',
    industry: 'General',
    icon: Building2,
    color: 'text-indigo-400',
  },
];

interface DemoScenarioSwitcherProps {
  currentScenario: string;
  onScenarioChange: (scenarioId: string) => void;
  className?: string;
}

export function DemoScenarioSwitcher({
  currentScenario,
  onScenarioChange,
  className,
}: DemoScenarioSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  const current = scenarios.find(s => s.id === currentScenario) || scenarios[0];
  const Icon = current.icon;

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors w-full"
      >
        <Icon className={cn('w-5 h-5', current.color)} />
        <div className="flex-1 text-left">
          <div className="text-sm font-medium text-white">{current.name}</div>
          <div className="text-xs text-slate-400">{current.industry}</div>
        </div>
        <ChevronDown className={cn(
          'w-4 h-4 text-slate-400 transition-transform',
          isOpen && 'rotate-180'
        )} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-slate-800 rounded-lg border border-slate-700 overflow-hidden z-50 shadow-xl"
          >
            {scenarios.map((scenario) => {
              const ScenarioIcon = scenario.icon;
              const isSelected = scenario.id === currentScenario;

              return (
                <button
                  key={scenario.id}
                  onClick={() => {
                    onScenarioChange(scenario.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 w-full hover:bg-slate-700 transition-colors',
                    isSelected && 'bg-slate-700/50'
                  )}
                >
                  <ScenarioIcon className={cn('w-5 h-5', scenario.color)} />
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-white">{scenario.name}</div>
                    <div className="text-xs text-slate-400">{scenario.industry}</div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-indigo-400" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
