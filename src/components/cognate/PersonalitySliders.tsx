/**
 * PersonalitySliders Component
 *
 * 7-slider personality configuration for Cognates.
 * Traits: Formality, Verbosity, Creativity, Caution, Humor, Empathy, Assertiveness
 * Each slider ranges from 0-100 with labeled endpoints.
 */

import { useState } from 'react';
import { Info } from 'lucide-react';
import clsx from 'clsx';
import type { PersonalityTrait, PersonalityValues } from './types';
import { PERSONALITY_TRAITS } from './types';

interface PersonalitySlidersProps {
  values: PersonalityValues;
  onChange?: (trait: PersonalityTrait, value: number) => void;
  className?: string;
  readOnly?: boolean;
  compact?: boolean;
}

export function PersonalitySliders({
  values,
  onChange,
  className,
  readOnly = false,
  compact = false,
}: PersonalitySlidersProps): JSX.Element {
  return (
    <div className={clsx('space-y-4', className)}>
      {PERSONALITY_TRAITS.map((trait) => (
        <PersonalitySlider
          key={trait.trait}
          config={trait}
          value={values[trait.trait]}
          onChange={onChange ? (value): void => onChange(trait.trait, value) : undefined}
          readOnly={readOnly}
          compact={compact}
        />
      ))}
    </div>
  );
}

interface PersonalitySliderProps {
  config: (typeof PERSONALITY_TRAITS)[number];
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  compact?: boolean;
}

function PersonalitySlider({
  config,
  value,
  onChange,
  readOnly = false,
  compact = false,
}: PersonalitySliderProps): JSX.Element {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (onChange && !readOnly) {
      onChange(Number(e.target.value));
    }
  };

  // Calculate color based on value (gradient from blue to purple to amber)
  const getTrackColor = (val: number): string => {
    if (val < 33) return 'from-blue-500 to-blue-400';
    if (val < 66) return 'from-purple-500 to-purple-400';
    return 'from-amber-500 to-amber-400';
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-400 w-20 truncate">{config.label}</span>
        <div className="flex-1 relative">
          <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={clsx(
                'h-full rounded-full bg-gradient-to-r transition-all duration-300',
                getTrackColor(value)
              )}
              style={{ width: `${value}%` }}
            />
          </div>
        </div>
        <span className="text-xs text-slate-400 w-8 text-right">{value}</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white">{config.label}</span>
          <button
            type="button"
            className="text-slate-500 hover:text-slate-400 transition-colors"
            onMouseEnter={(): void => setShowTooltip(true)}
            onMouseLeave={(): void => setShowTooltip(false)}
            aria-label={`Information about ${config.label}`}
          >
            <Info className="w-3.5 h-3.5" />
          </button>
          {showTooltip && (
            <div className="absolute z-50 mt-8 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 shadow-xl max-w-xs">
              <p className="text-xs text-slate-300">{config.description}</p>
            </div>
          )}
        </div>
        <span className="text-sm font-medium text-slate-400">{value}</span>
      </div>

      {/* Slider */}
      <div className="relative">
        {/* Custom track background */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-2 bg-slate-700 rounded-full pointer-events-none">
          <div
            className={clsx(
              'h-full rounded-full bg-gradient-to-r transition-all duration-300',
              getTrackColor(value)
            )}
            style={{ width: `${value}%` }}
          />
        </div>

        {/* Native slider (transparent, for functionality) */}
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={handleChange}
          disabled={readOnly}
          className={clsx(
            'relative w-full h-6 bg-transparent appearance-none cursor-pointer',
            'slider-thumb-custom',
            readOnly && 'cursor-default opacity-75'
          )}
          style={{
            WebkitAppearance: 'none',
          }}
        />
      </div>

      {/* Labels */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{config.minLabel}</span>
        <span>{config.maxLabel}</span>
      </div>
    </div>
  );
}

// Read-only personality display for cards
interface PersonalityPreviewProps {
  values: PersonalityValues;
  className?: string;
}

export function PersonalityPreview({ values, className }: PersonalityPreviewProps): JSX.Element {
  return (
    <div className={clsx('space-y-1.5', className)}>
      {PERSONALITY_TRAITS.map((trait) => (
        <div key={trait.trait} className="flex items-center gap-2">
          <span className="text-xs text-slate-500 w-16 truncate">{trait.label}</span>
          <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-symtex-primary to-symtex-accent rounded-full"
              style={{ width: `${values[trait.trait]}%` }}
            />
          </div>
          <span className="text-xs text-slate-500 w-6 text-right">{values[trait.trait]}</span>
        </div>
      ))}
    </div>
  );
}

export default PersonalitySliders;

// Add custom CSS for slider thumb
// Note: This would typically go in a CSS file, but we'll use a style tag approach here
// The actual styling is handled inline with Tailwind where possible
