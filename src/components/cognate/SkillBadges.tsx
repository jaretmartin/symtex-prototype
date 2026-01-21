/**
 * SkillBadges Component
 *
 * Displays skill badges with proficiency levels and category color coding.
 * Supports compact view (badges only) and expanded view (with descriptions).
 */

import { useState } from 'react';
import {
  MessageSquare,
  BarChart3,
  Code2,
  Palette,
  Settings,
  Target,
} from 'lucide-react';
import clsx from 'clsx';
import type { Skill, SkillCategory, SkillProficiency } from './types';
import { SKILL_PROFICIENCY_CONFIG, SKILL_CATEGORY_CONFIG } from './types';

interface SkillBadgesProps {
  skills: Skill[];
  className?: string;
  maxDisplay?: number;
  size?: 'sm' | 'md' | 'lg';
  showProficiency?: boolean;
  colorBy?: 'category' | 'proficiency';
}

const categoryIcons: Record<SkillCategory, typeof MessageSquare> = {
  communication: MessageSquare,
  analysis: BarChart3,
  technical: Code2,
  creative: Palette,
  operations: Settings,
  strategy: Target,
};

export function SkillBadges({
  skills,
  className,
  maxDisplay = 5,
  size = 'md',
  showProficiency = true,
  colorBy = 'category',
}: SkillBadgesProps): JSX.Element {
  const displayedSkills = skills.slice(0, maxDisplay);
  const remainingCount = skills.length - maxDisplay;

  const sizeConfig = {
    sm: {
      padding: 'px-1.5 py-0.5',
      fontSize: 'text-xs',
      iconSize: 'w-3 h-3',
      gap: 'gap-0.5',
    },
    md: {
      padding: 'px-2 py-1',
      fontSize: 'text-xs',
      iconSize: 'w-3.5 h-3.5',
      gap: 'gap-1',
    },
    lg: {
      padding: 'px-3 py-1.5',
      fontSize: 'text-sm',
      iconSize: 'w-4 h-4',
      gap: 'gap-1.5',
    },
  };

  const config = sizeConfig[size];

  const getColorConfig = (skill: Skill): { color: string; bgColor: string } => {
    if (colorBy === 'proficiency') {
      return SKILL_PROFICIENCY_CONFIG[skill.proficiency];
    }
    return SKILL_CATEGORY_CONFIG[skill.category];
  };

  return (
    <div className={clsx('flex flex-wrap gap-1.5', className)}>
      {displayedSkills.map((skill) => (
        <SkillBadge
          key={skill.id}
          skill={skill}
          size={size}
          showProficiency={showProficiency}
          colorConfig={getColorConfig(skill)}
        />
      ))}
      {remainingCount > 0 && (
        <span
          className={clsx(
            'inline-flex items-center rounded-lg font-medium',
            'bg-surface-elevated/50 text-muted-foreground',
            config.padding,
            config.fontSize
          )}
        >
          +{remainingCount} more
        </span>
      )}
    </div>
  );
}

interface SkillBadgeProps {
  skill: Skill;
  size?: 'sm' | 'md' | 'lg';
  showProficiency?: boolean;
  colorConfig: { color: string; bgColor: string };
}

export function SkillBadge({
  skill,
  size = 'md',
  showProficiency = true,
  colorConfig,
}: SkillBadgeProps): JSX.Element {
  const [showTooltip, setShowTooltip] = useState(false);
  const Icon = categoryIcons[skill.category];

  const sizeConfig = {
    sm: {
      padding: 'px-1.5 py-0.5',
      fontSize: 'text-xs',
      iconSize: 'w-3 h-3',
      gap: 'gap-0.5',
    },
    md: {
      padding: 'px-2 py-1',
      fontSize: 'text-xs',
      iconSize: 'w-3.5 h-3.5',
      gap: 'gap-1',
    },
    lg: {
      padding: 'px-3 py-1.5',
      fontSize: 'text-sm',
      iconSize: 'w-4 h-4',
      gap: 'gap-1.5',
    },
  };

  const config = sizeConfig[size];

  return (
    <div
      className="relative"
      onMouseEnter={(): void => setShowTooltip(true)}
      onMouseLeave={(): void => setShowTooltip(false)}
    >
      <span
        className={clsx(
          'inline-flex items-center rounded-lg font-medium',
          'border border-transparent transition-colors cursor-default',
          colorConfig.bgColor,
          colorConfig.color,
          config.padding,
          config.gap
        )}
      >
        <Icon className={config.iconSize} />
        <span className={config.fontSize}>{skill.name}</span>
        {showProficiency && (
          <ProficiencyDots proficiency={skill.proficiency} size={size} />
        )}
      </span>

      {/* Tooltip */}
      {showTooltip && skill.description && (
        <div
          className={clsx(
            'absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2',
            'px-3 py-2 rounded-lg bg-surface-card border border-border',
            'shadow-xl max-w-xs'
          )}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-foreground">{skill.name}</span>
            <span className={clsx('text-xs', SKILL_PROFICIENCY_CONFIG[skill.proficiency].color)}>
              {SKILL_PROFICIENCY_CONFIG[skill.proficiency].label}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">{skill.description}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Category: {SKILL_CATEGORY_CONFIG[skill.category].label}
          </p>
          <div
            className={clsx(
              'absolute top-full left-1/2 -translate-x-1/2',
              'border-4 border-transparent border-t-surface-card'
            )}
          />
        </div>
      )}
    </div>
  );
}

interface ProficiencyDotsProps {
  proficiency: SkillProficiency;
  size?: 'sm' | 'md' | 'lg';
}

function ProficiencyDots({ proficiency, size = 'md' }: ProficiencyDotsProps): JSX.Element {
  const levelMap: Record<SkillProficiency, number> = {
    beginner: 1,
    intermediate: 2,
    advanced: 3,
    expert: 4,
  };

  const filledDots = levelMap[proficiency];

  const dotSizeMap = {
    sm: 'w-1 h-1',
    md: 'w-1.5 h-1.5',
    lg: 'w-2 h-2',
  };

  return (
    <div className="flex items-center gap-0.5 ml-1">
      {[1, 2, 3, 4].map((dot) => (
        <div
          key={dot}
          className={clsx(
            'rounded-full',
            dotSizeMap[size],
            dot <= filledDots ? 'bg-current' : 'bg-current/30'
          )}
        />
      ))}
    </div>
  );
}

// Full list variant for detail views
interface SkillListProps {
  skills: Skill[];
  className?: string;
}

export function SkillList({ skills, className }: SkillListProps): JSX.Element {
  return (
    <div className={clsx('space-y-2', className)}>
      {skills.map((skill) => (
        <div
          key={skill.id}
          className="flex items-center justify-between p-2 rounded-lg bg-surface-card/50"
        >
          <div className="flex items-center gap-2">
            {(() => {
              const Icon = categoryIcons[skill.category];
              return <Icon className={clsx('w-4 h-4', SKILL_CATEGORY_CONFIG[skill.category].color)} />;
            })()}
            <span className="text-sm text-foreground">{skill.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={clsx(
                'text-xs px-2 py-0.5 rounded-full',
                SKILL_PROFICIENCY_CONFIG[skill.proficiency].bgColor,
                SKILL_PROFICIENCY_CONFIG[skill.proficiency].color
              )}
            >
              {SKILL_PROFICIENCY_CONFIG[skill.proficiency].label}
            </span>
            <ProficiencyDots proficiency={skill.proficiency} size="md" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default SkillBadges;
