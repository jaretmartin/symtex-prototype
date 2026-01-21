/**
 * PersonalitySliders Component
 *
 * Interactive sliders for adjusting Cognate personality traits.
 */

import { useState } from 'react';
import { Sliders, RotateCcw, Save, Check } from 'lucide-react';
import clsx from 'clsx';
import { useTrainingStore } from './trainingStore';
import { TRAINING_PERSONALITY_TRAITS } from './types';

export function PersonalitySliders() {
  const {
    personality,
    setPersonalityTrait,
    savePersonality,
    resetPersonality,
    hasPersonalityChanges,
    isSaving,
  } = useTrainingStore();

  const [showSaved, setShowSaved] = useState(false);
  const hasChanges = hasPersonalityChanges();

  const handleSave = () => {
    savePersonality();
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-muted-foreground flex items-center gap-2">
          <Sliders className="w-5 h-5 text-purple-400" />
          Personality Configuration
        </h3>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <button
              onClick={resetPersonality}
              className="px-3 py-1.5 text-sm text-muted-foreground hover:text-muted-foreground transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className={clsx(
              'px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2',
              hasChanges
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            )}
          >
            {showSaved ? (
              <>
                <Check className="w-4 h-4" />
                Saved
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {TRAINING_PERSONALITY_TRAITS.map((trait) => {
          const value = personality[trait.id] ?? trait.default;

          return (
            <div key={trait.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">{trait.name}</span>
                <span className="text-sm text-muted-foreground">{value}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-20 text-right">{trait.low}</span>

                <div className="flex-1 relative">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={value}
                    onChange={(e) => setPersonalityTrait(trait.id, parseInt(e.target.value))}
                    className={clsx(
                      'w-full h-2 rounded-full appearance-none cursor-pointer',
                      'bg-muted',
                      '[&::-webkit-slider-thumb]:appearance-none',
                      '[&::-webkit-slider-thumb]:w-4',
                      '[&::-webkit-slider-thumb]:h-4',
                      '[&::-webkit-slider-thumb]:rounded-full',
                      '[&::-webkit-slider-thumb]:bg-purple-500',
                      '[&::-webkit-slider-thumb]:cursor-pointer',
                      '[&::-webkit-slider-thumb]:transition-all',
                      '[&::-webkit-slider-thumb]:hover:bg-purple-400',
                      '[&::-webkit-slider-thumb]:hover:scale-110'
                    )}
                    style={{
                      background: `linear-gradient(to right, #a855f7 ${value}%, #3f3f46 ${value}%)`,
                    }}
                  />
                </div>

                <span className="text-xs text-muted-foreground w-20">{trait.high}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Preview section */}
      <div className="mt-6 pt-4 border-t border-border">
        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
          Preview Response Style
        </h4>
        <div className="bg-surface-base rounded-lg p-4 text-sm text-muted-foreground italic">
          Based on your configuration, responses will be{' '}
          <span className="text-purple-400">
            {personality.formality > 60 ? 'formal' : 'casual'}
          </span>
          ,{' '}
          <span className="text-purple-400">
            {personality.verbosity > 60 ? 'detailed' : 'concise'}
          </span>
          , and{' '}
          <span className="text-purple-400">
            {personality.empathy > 60 ? 'warm' : 'neutral'}
          </span>{' '}
          in tone.
        </div>
      </div>
    </div>
  );
}

export default PersonalitySliders;
