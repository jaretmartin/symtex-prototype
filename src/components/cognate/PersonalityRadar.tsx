/**
 * PersonalityRadar Component
 *
 * 8-trait radar chart for Cognate personality visualization using Recharts.
 * Traits: formality, verbosity, creativity, assertiveness, empathy, technicality, humor, patience
 *
 * Features:
 * - Interactive radar chart with clickable traits
 * - Preset personality templates
 * - Value display (0-100)
 * - Dark theme compatible
 */

import { useState, useMemo, memo } from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import {
  Briefcase,
  Heart,
  Sparkles,
  Zap,
  Palette,
  Settings,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Extended personality traits (8 traits instead of original 7)
export type RadarPersonalityTrait =
  | 'formality'
  | 'verbosity'
  | 'creativity'
  | 'assertiveness'
  | 'empathy'
  | 'technicality'
  | 'humor'
  | 'patience';

export interface RadarPersonalityValues {
  formality: number;
  verbosity: number;
  creativity: number;
  assertiveness: number;
  empathy: number;
  technicality: number;
  humor: number;
  patience: number;
}

interface TraitConfig {
  trait: RadarPersonalityTrait;
  label: string;
  shortLabel: string;
  description: string;
  color: string;
}

const RADAR_TRAITS: TraitConfig[] = [
  {
    trait: 'formality',
    label: 'Formality',
    shortLabel: 'Formal',
    description: 'How formal or casual the communication style is',
    color: '#6366f1',
  },
  {
    trait: 'verbosity',
    label: 'Verbosity',
    shortLabel: 'Verbose',
    description: 'How detailed or concise responses are',
    color: '#8b5cf6',
  },
  {
    trait: 'creativity',
    label: 'Creativity',
    shortLabel: 'Creative',
    description: 'How creative or conventional approaches are',
    color: '#ec4899',
  },
  {
    trait: 'assertiveness',
    label: 'Assertiveness',
    shortLabel: 'Assertive',
    description: 'How assertive or accommodating the communication is',
    color: '#f59e0b',
  },
  {
    trait: 'empathy',
    label: 'Empathy',
    shortLabel: 'Empathy',
    description: 'How emotionally attuned responses are',
    color: '#ef4444',
  },
  {
    trait: 'technicality',
    label: 'Technicality',
    shortLabel: 'Technical',
    description: 'How technical or simplified explanations are',
    color: '#06b6d4',
  },
  {
    trait: 'humor',
    label: 'Humor',
    shortLabel: 'Humor',
    description: 'How much humor is incorporated into responses',
    color: '#22c55e',
  },
  {
    trait: 'patience',
    label: 'Patience',
    shortLabel: 'Patient',
    description: 'How patient and thorough in explanations',
    color: '#3b82f6',
  },
];

// Preset personality templates
interface PersonalityPreset {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  values: RadarPersonalityValues;
}

const PERSONALITY_PRESETS: PersonalityPreset[] = [
  {
    id: 'professional',
    name: 'Professional',
    description: 'Formal, precise, and business-oriented',
    icon: Briefcase,
    values: {
      formality: 85,
      verbosity: 60,
      creativity: 40,
      assertiveness: 70,
      empathy: 50,
      technicality: 75,
      humor: 20,
      patience: 65,
    },
  },
  {
    id: 'friendly',
    name: 'Friendly',
    description: 'Warm, approachable, and conversational',
    icon: Heart,
    values: {
      formality: 30,
      verbosity: 70,
      creativity: 60,
      assertiveness: 40,
      empathy: 90,
      technicality: 35,
      humor: 75,
      patience: 85,
    },
  },
  {
    id: 'technical',
    name: 'Technical',
    description: 'Precise, detailed, and data-driven',
    icon: Settings,
    values: {
      formality: 70,
      verbosity: 80,
      creativity: 30,
      assertiveness: 55,
      empathy: 40,
      technicality: 95,
      humor: 15,
      patience: 70,
    },
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Innovative, expressive, and imaginative',
    icon: Palette,
    values: {
      formality: 25,
      verbosity: 65,
      creativity: 95,
      assertiveness: 60,
      empathy: 70,
      technicality: 45,
      humor: 80,
      patience: 55,
    },
  },
];

interface PersonalityRadarProps {
  values: RadarPersonalityValues;
  onChange?: (trait: RadarPersonalityTrait, value: number) => void;
  onPresetSelect?: (preset: PersonalityPreset) => void;
  className?: string;
  readOnly?: boolean;
  showPresets?: boolean;
  showValues?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

function PersonalityRadar({
  values,
  onChange,
  onPresetSelect,
  className,
  readOnly = false,
  showPresets = true,
  showValues = true,
  size = 'md',
}: PersonalityRadarProps): JSX.Element {
  const [selectedTrait, setSelectedTrait] = useState<RadarPersonalityTrait | null>(null);
  const [showPresetDropdown, setShowPresetDropdown] = useState(false);

  // Convert values to chart data format
  const chartData = useMemo(
    () =>
      RADAR_TRAITS.map((trait) => ({
        trait: trait.shortLabel,
        value: values[trait.trait],
        fullMark: 100,
        traitKey: trait.trait,
      })),
    [values]
  );

  // Chart dimensions based on size
  const chartDimensions = {
    sm: { height: 200, outerRadius: 60 },
    md: { height: 280, outerRadius: 90 },
    lg: { height: 360, outerRadius: 120 },
  }[size];

  // Handle trait click
  const handleTraitClick = (trait: RadarPersonalityTrait): void => {
    if (readOnly) return;
    setSelectedTrait(selectedTrait === trait ? null : trait);
  };

  // Handle value change for selected trait
  const handleValueChange = (newValue: number): void => {
    if (selectedTrait && onChange) {
      onChange(selectedTrait, Math.max(0, Math.min(100, newValue)));
    }
  };

  // Handle preset selection
  const handlePresetClick = (preset: PersonalityPreset): void => {
    onPresetSelect?.(preset);
    setShowPresetDropdown(false);
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { trait: string; value: number; traitKey: RadarPersonalityTrait } }> }): JSX.Element | null => {
    if (!active || !payload?.length) return null;
    const data = payload[0].payload;
    const traitConfig = RADAR_TRAITS.find((t) => t.trait === data.traitKey);

    return (
      <div className="bg-card border border-border rounded-lg p-2 shadow-xl">
        <p className="text-sm font-medium text-foreground">{traitConfig?.label}</p>
        <p className="text-xs text-muted-foreground">{traitConfig?.description}</p>
        <p className="text-lg font-bold text-symtex-primary mt-1">{data.value}%</p>
      </div>
    );
  };

  return (
    <div className={cn('bg-card rounded-xl border border-border', className)}>
      {/* Header with Presets */}
      {showPresets && (
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-symtex-primary" />
              Personality Profile
            </h3>
            <div className="relative">
              <button
                onClick={() => setShowPresetDropdown(!showPresetDropdown)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/50 text-sm text-foreground hover:bg-muted transition-colors"
                disabled={readOnly}
              >
                <Zap className="w-3.5 h-3.5" />
                Presets
                <ChevronDown
                  className={cn(
                    'w-3.5 h-3.5 transition-transform',
                    showPresetDropdown && 'rotate-180'
                  )}
                />
              </button>
              {showPresetDropdown && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                  {PERSONALITY_PRESETS.map((preset) => {
                    const PresetIcon = preset.icon;
                    return (
                      <button
                        key={preset.id}
                        onClick={() => handlePresetClick(preset)}
                        className="w-full p-3 flex items-start gap-3 hover:bg-muted/50 transition-colors text-left"
                      >
                        <PresetIcon className="w-5 h-5 text-symtex-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{preset.name}</p>
                          <p className="text-xs text-muted-foreground">{preset.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Radar Chart */}
      <div className="p-4">
        <ResponsiveContainer width="100%" height={chartDimensions.height}>
          <RadarChart data={chartData} cx="50%" cy="50%" outerRadius={chartDimensions.outerRadius}>
            <PolarGrid
              stroke="#334155"
              strokeDasharray="3 3"
            />
            <PolarAngleAxis
              dataKey="trait"
              tick={{
                fill: '#94a3b8',
                fontSize: size === 'sm' ? 10 : 12,
              }}
              tickLine={false}
            />
            <PolarRadiusAxis
              angle={22.5}
              domain={[0, 100]}
              tick={false}
              axisLine={false}
            />
            <Radar
              name="Personality"
              dataKey="value"
              stroke="#6366f1"
              fill="#6366f1"
              fillOpacity={0.3}
              strokeWidth={2}
              dot={{
                r: 4,
                fill: '#6366f1',
                stroke: '#0a0a0f',
                strokeWidth: 2,
              }}
              activeDot={{
                r: 6,
                fill: '#818cf8',
                stroke: '#0a0a0f',
                strokeWidth: 2,
              }}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Trait Values Grid */}
      {showValues && (
        <div className="p-4 border-t border-border">
          <div className="grid grid-cols-4 gap-2">
            {RADAR_TRAITS.map((traitConfig) => {
              const isSelected = selectedTrait === traitConfig.trait;
              return (
                <button
                  key={traitConfig.trait}
                  onClick={() => handleTraitClick(traitConfig.trait)}
                  disabled={readOnly}
                  className={cn(
                    'p-2 rounded-lg transition-all duration-200 text-left',
                    isSelected
                      ? 'bg-symtex-primary/20 border border-symtex-primary'
                      : 'bg-muted/50 border border-transparent hover:bg-muted/50',
                    readOnly && 'cursor-default'
                  )}
                >
                  <p className="text-xs text-muted-foreground truncate">{traitConfig.shortLabel}</p>
                  <p
                    className="text-lg font-bold"
                    style={{ color: traitConfig.color }}
                  >
                    {values[traitConfig.trait]}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Slider for selected trait */}
          {selectedTrait && !readOnly && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg animate-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">
                  {RADAR_TRAITS.find((t) => t.trait === selectedTrait)?.label}
                </span>
                <span className="text-sm font-bold text-symtex-primary">
                  {values[selectedTrait]}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={values[selectedTrait]}
                onChange={(e) => handleValueChange(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-symtex-primary"
              />
              <p className="text-xs text-muted-foreground mt-2">
                {RADAR_TRAITS.find((t) => t.trait === selectedTrait)?.description}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default memo(PersonalityRadar);

// Export types and presets for external use
export { RADAR_TRAITS, PERSONALITY_PRESETS };
export type { PersonalityPreset, TraitConfig };
