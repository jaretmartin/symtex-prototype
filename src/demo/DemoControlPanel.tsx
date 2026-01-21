/**
 * DemoControlPanel Component
 *
 * Hidden panel for demo presentations accessible via Ctrl+Shift+D.
 * Provides scenario selection, persona switching, toggles, and wow moment navigation.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  RotateCcw,
  Play,
  Sparkles,
  Users,
  Clock,
  ChevronDown,
  ChevronUp,
  X,
  ToggleLeft,
  ToggleRight,
  Flag,
  Network,
  MessageCircle,
  GitCompare,
  ShieldCheck,
  RefreshCw,
  Briefcase,
  Wrench,
  Building2,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDemoContext, type Persona } from './DemoContext';
import { healthcareScenario, financialScenario } from './scenarios/index';

// ============================================================================
// Types
// ============================================================================

type ScenarioId =
  | 'exec-demo'
  | 'operator-demo'
  | 'builder-demo'
  | 'healthcare'
  | 'financial';

interface DemoScenarioConfig {
  id: ScenarioId;
  name: string;
  duration: string;
  description: string;
  persona: Persona;
}

// ============================================================================
// Scenario Configurations
// ============================================================================

const demoScenarios: DemoScenarioConfig[] = [
  {
    id: 'exec-demo',
    name: 'Executive Demo',
    duration: '10 min',
    description: 'High-level overview focusing on ROI and strategic value',
    persona: 'exec',
  },
  {
    id: 'operator-demo',
    name: 'Operator Demo',
    duration: '20 min',
    description: 'Day-to-day operations, approvals, and monitoring',
    persona: 'operator',
  },
  {
    id: 'builder-demo',
    name: 'Builder Demo',
    duration: '30 min',
    description: 'Technical deep-dive into Narratives and Cognate configuration',
    persona: 'builder',
  },
  {
    id: 'healthcare',
    name: 'Healthcare Industry',
    duration: '25 min',
    description: healthcareScenario.description,
    persona: 'operator',
  },
  {
    id: 'financial',
    name: 'Financial Services',
    duration: '25 min',
    description: financialScenario.description,
    persona: 'operator',
  },
];

function getScenarioById(id: ScenarioId): DemoScenarioConfig | undefined {
  return demoScenarios.find((s) => s.id === id);
}

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (value: boolean) => void;
  label: string;
}

function ToggleSwitch({ enabled, onChange, label }: ToggleSwitchProps): JSX.Element {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className="flex items-center justify-between w-full py-1.5 group"
      aria-pressed={enabled}
    >
      <span className="text-xs text-zinc-300 group-hover:text-white transition-colors">
        {label}
      </span>
      {enabled ? (
        <ToggleRight className="w-5 h-5 text-indigo-400" />
      ) : (
        <ToggleLeft className="w-5 h-5 text-zinc-500" />
      )}
    </button>
  );
}

interface SectionHeaderProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  collapsed?: boolean;
  onToggle?: () => void;
}

function SectionHeader({
  icon: Icon,
  title,
  collapsed,
  onToggle,
}: SectionHeaderProps): JSX.Element {
  return (
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full"
      disabled={!onToggle}
    >
      <h4 className="text-xs font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
        <Icon className="w-3 h-3" />
        {title}
      </h4>
      {onToggle && (
        collapsed ? (
          <ChevronDown className="w-3 h-3 text-zinc-500" />
        ) : (
          <ChevronUp className="w-3 h-3 text-zinc-500" />
        )
      )}
    </button>
  );
}

// ============================================================================
// Persona Configuration
// ============================================================================

const personaConfig: Record<Persona, { icon: typeof Briefcase; label: string; color: string }> = {
  exec: { icon: Briefcase, label: 'Exec', color: 'text-amber-400 bg-amber-400/20' },
  operator: { icon: Users, label: 'Operator', color: 'text-emerald-400 bg-emerald-400/20' },
  builder: { icon: Wrench, label: 'Builder', color: 'text-indigo-400 bg-indigo-400/20' },
};

export function DemoControlPanel(): JSX.Element | null {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<ScenarioId | ''>('');
  const [sectionsCollapsed, setSectionsCollapsed] = useState({
    scenarios: false,
    personas: false,
    toggles: false,
    features: false,
    wowMoments: false,
  });

  const navigate = useNavigate();
  const {
    activeScenario,
    persona,
    scenarioToggles,
    featureFlags,
    setPersona,
    setActiveScenario,
    setScenarioToggle,
    toggleFeatureFlag,
    resetDemoState,
  } = useDemoContext();

  // Sync selected scenario with active scenario
  useEffect(() => {
    if (activeScenario) {
      setSelectedScenario(activeScenario as ScenarioId);
    }
  }, [activeScenario]);

  // Keyboard shortcut: Ctrl+Shift+D
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleApplyScenario = (): void => {
    if (!selectedScenario) return;

    const scenario = getScenarioById(selectedScenario);
    if (!scenario) return;

    // Apply scenario - set active scenario and persona
    setActiveScenario(selectedScenario);
    setPersona(scenario.persona);

    // Apply scenario-specific toggles
    switch (selectedScenario) {
      case 'exec-demo':
        setScenarioToggle('policyBlockEnabled', true);
        setScenarioToggle('budgetWarning', true);
        setScenarioToggle('approvalPending', false);
        setScenarioToggle('runSucceeds', true);
        break;
      case 'operator-demo':
        setScenarioToggle('approvalPending', true);
        setScenarioToggle('runSucceeds', true);
        setScenarioToggle('policyBlockEnabled', false);
        setScenarioToggle('budgetWarning', false);
        break;
      case 'builder-demo':
        setScenarioToggle('policyBlockEnabled', true);
        setScenarioToggle('runSucceeds', false);
        setScenarioToggle('approvalPending', false);
        setScenarioToggle('budgetWarning', false);
        break;
      case 'healthcare':
      case 'financial':
        setScenarioToggle('runSucceeds', true);
        setScenarioToggle('approvalPending', true);
        setScenarioToggle('policyBlockEnabled', false);
        setScenarioToggle('budgetWarning', false);
        break;
    }
  };

  const handleWowMoment = (route: string): void => {
    navigate(route);
  };

  const handleResetDemo = (): void => {
    resetDemoState();
    setSelectedScenario('');
  };

  const handleReloadData = (): void => {
    // Force a window reload to refresh all mock data
    window.location.reload();
  };

  const toggleSection = (section: keyof typeof sectionsCollapsed): void => {
    setSectionsCollapsed((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const activeScenarioConfig = activeScenario
    ? getScenarioById(activeScenario as ScenarioId)
    : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 100, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.95 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="fixed bottom-4 right-4 z-40 w-80 max-h-[calc(100vh-2rem)] overflow-y-auto bg-zinc-900/95 backdrop-blur-sm border border-zinc-700 rounded-xl shadow-2xl"
          role="dialog"
          aria-label="Demo Control Panel"
        >
          {/* Header */}
          <div className="sticky top-0 p-3 border-b border-zinc-700 bg-zinc-900/95 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Settings className="w-4 h-4 text-indigo-400" />
                Demo Control Panel
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded hover:bg-zinc-700 transition-colors"
                aria-label="Close panel"
              >
                <X className="w-4 h-4 text-zinc-400" />
              </button>
            </div>
            <p className="text-xs text-zinc-500 mt-1">Ctrl+Shift+D to toggle</p>
            {activeScenarioConfig && (
              <div className="mt-2 px-2 py-1.5 rounded bg-indigo-500/20 border border-indigo-500/30">
                <div className="text-xs text-indigo-300">
                  Active: <span className="font-medium">{activeScenarioConfig.name}</span>
                </div>
                <div className="text-xs text-zinc-400">{activeScenarioConfig.duration}</div>
              </div>
            )}
          </div>

          {/* Section 1: Scenario Selection */}
          <div className="p-3 space-y-2 border-b border-zinc-700">
            <SectionHeader
              icon={Play}
              title="Scenario Selection"
              collapsed={sectionsCollapsed.scenarios}
              onToggle={() => toggleSection('scenarios')}
            />
            {!sectionsCollapsed.scenarios && (
              <div className="space-y-2 mt-2">
                <select
                  value={selectedScenario}
                  onChange={(e) => setSelectedScenario(e.target.value as ScenarioId)}
                  className="w-full px-3 py-2 text-sm bg-zinc-800 border border-zinc-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select a scenario...</option>
                  {demoScenarios.map((scenario) => (
                    <option key={scenario.id} value={scenario.id}>
                      {scenario.name} ({scenario.duration})
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleApplyScenario}
                  disabled={!selectedScenario}
                  className={cn(
                    'w-full px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors',
                    selectedScenario
                      ? 'bg-indigo-500 hover:bg-indigo-600 text-white'
                      : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
                  )}
                >
                  <Play className="w-4 h-4" />
                  Apply Scenario
                </button>
              </div>
            )}
          </div>

          {/* Section 2: Persona Switcher */}
          <div className="p-3 space-y-2 border-b border-zinc-700">
            <SectionHeader
              icon={Users}
              title="Persona"
              collapsed={sectionsCollapsed.personas}
              onToggle={() => toggleSection('personas')}
            />
            {!sectionsCollapsed.personas && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {(Object.entries(personaConfig) as [Persona, typeof personaConfig.exec][]).map(
                  ([personaKey, config]) => {
                    const Icon = config.icon;
                    const isActive = persona === personaKey;
                    return (
                      <button
                        key={personaKey}
                        onClick={() => setPersona(personaKey)}
                        className={cn(
                          'flex flex-col items-center gap-1 px-2 py-2 rounded-lg text-xs transition-colors',
                          isActive
                            ? config.color + ' border border-current/30'
                            : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        {config.label}
                      </button>
                    );
                  }
                )}
              </div>
            )}
          </div>

          {/* Section 3: Scenario Toggles */}
          <div className="p-3 space-y-2 border-b border-zinc-700">
            <SectionHeader
              icon={ToggleLeft}
              title="Scenario Toggles"
              collapsed={sectionsCollapsed.toggles}
              onToggle={() => toggleSection('toggles')}
            />
            {!sectionsCollapsed.toggles && (
              <div className="space-y-1 mt-2">
                <ToggleSwitch
                  label="Policy block enabled"
                  enabled={scenarioToggles.policyBlockEnabled}
                  onChange={(v) => setScenarioToggle('policyBlockEnabled', v)}
                />
                <ToggleSwitch
                  label="Run succeeds"
                  enabled={scenarioToggles.runSucceeds}
                  onChange={(v) => setScenarioToggle('runSucceeds', v)}
                />
                <ToggleSwitch
                  label="Budget warning"
                  enabled={scenarioToggles.budgetWarning}
                  onChange={(v) => setScenarioToggle('budgetWarning', v)}
                />
                <ToggleSwitch
                  label="Approval pending"
                  enabled={scenarioToggles.approvalPending}
                  onChange={(v) => setScenarioToggle('approvalPending', v)}
                />
              </div>
            )}
          </div>

          {/* Section 4: Feature Flags */}
          <div className="p-3 space-y-2 border-b border-zinc-700">
            <SectionHeader
              icon={Flag}
              title="Feature Flags"
              collapsed={sectionsCollapsed.features}
              onToggle={() => toggleSection('features')}
            />
            {!sectionsCollapsed.features && (
              <div className="space-y-1 mt-2">
                <ToggleSwitch
                  label="C2S2 enabled"
                  enabled={featureFlags.c2s2Enabled}
                  onChange={() => toggleFeatureFlag('c2s2Enabled')}
                />
                <ToggleSwitch
                  label="Advanced PromptOps"
                  enabled={featureFlags.advancedPromptOps}
                  onChange={() => toggleFeatureFlag('advancedPromptOps')}
                />
                <ToggleSwitch
                  label="NEXIS enabled"
                  enabled={featureFlags.nexisEnabled}
                  onChange={() => toggleFeatureFlag('nexisEnabled')}
                />
              </div>
            )}
          </div>

          {/* Section 5: Wow Moments */}
          <div className="p-3 space-y-2 border-b border-zinc-700">
            <SectionHeader
              icon={Sparkles}
              title="Wow Moments"
              collapsed={sectionsCollapsed.wowMoments}
              onToggle={() => toggleSection('wowMoments')}
            />
            {!sectionsCollapsed.wowMoments && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                <button
                  onClick={() => handleWowMoment('/runs')}
                  className="px-2 py-1.5 rounded bg-indigo-500/20 text-indigo-400 text-xs hover:bg-indigo-500/30 transition-colors flex items-center gap-1"
                >
                  <FileText className="w-3 h-3" />
                  Explain Plan
                </button>
                <button
                  onClick={() => handleWowMoment('/team/cognates/cog-compliance-monitor')}
                  className="px-2 py-1.5 rounded bg-indigo-500/20 text-indigo-400 text-xs hover:bg-indigo-500/30 transition-colors flex items-center gap-1"
                >
                  <GitCompare className="w-3 h-3" />
                  Simulation Diff
                </button>
                <button
                  onClick={() => handleWowMoment('/control/approvals')}
                  className="px-2 py-1.5 rounded bg-indigo-500/20 text-indigo-400 text-xs hover:bg-indigo-500/30 transition-colors flex items-center gap-1"
                >
                  <ShieldCheck className="w-3 h-3" />
                  Approval Gate
                </button>
                <button
                  onClick={() => handleWowMoment('/runs/run-001/trace')}
                  className="px-2 py-1.5 rounded bg-indigo-500/20 text-indigo-400 text-xs hover:bg-indigo-500/30 transition-colors flex items-center gap-1"
                >
                  <Clock className="w-3 h-3" />
                  Trace Timeline
                </button>
                <button
                  onClick={() => handleWowMoment('/signals')}
                  className="px-2 py-1.5 rounded bg-indigo-500/20 text-indigo-400 text-xs hover:bg-indigo-500/30 transition-colors flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  Pattern Compile
                </button>
                <button
                  onClick={() => handleWowMoment('/knowledge/nexis')}
                  className="px-2 py-1.5 rounded bg-indigo-500/20 text-indigo-400 text-xs hover:bg-indigo-500/30 transition-colors flex items-center gap-1"
                >
                  <Network className="w-3 h-3" />
                  NEXIS Insight
                </button>
                <button
                  onClick={() => handleWowMoment('/symbios?command=show+last+blocked+run')}
                  className="col-span-2 px-2 py-1.5 rounded bg-indigo-500/20 text-indigo-400 text-xs hover:bg-indigo-500/30 transition-colors flex items-center justify-center gap-1"
                >
                  <MessageCircle className="w-3 h-3" />
                  Symbios Command
                </button>
              </div>
            )}
          </div>

          {/* Section 6: Actions */}
          <div className="p-3 space-y-2">
            <h4 className="text-xs font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3 h-3" />
              Actions
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleResetDemo}
                className="px-3 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Reset Demo
              </button>
              <button
                onClick={handleReloadData}
                className="px-3 py-2 rounded-lg bg-zinc-700 text-zinc-300 hover:bg-zinc-600 text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                Reload Data
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default DemoControlPanel;
