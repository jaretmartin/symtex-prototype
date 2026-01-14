/**
 * Agent Template Card Component
 *
 * Displays an individual agent template with its capabilities,
 * default verification pattern, and instance count.
 */

import {
  Bot,
  Code,
  Search,
  FileText,
  Database,
  Shield,
  Zap,
  Network,
  Users,
  GitBranch,
  Eye,
  Cog,
  Layers,
} from 'lucide-react';
import clsx from 'clsx';
import type { AgentTemplate, VerificationPattern } from '@/types';
import { Button } from '@/components/ui/Button';

interface AgentTemplateCardProps {
  template: AgentTemplate;
  instanceCount: number;
  onSelect?: () => void;
  onDeploy?: () => void;
  isSelected?: boolean;
}

// Map icon names to Lucide components
const iconMap: Record<string, React.ElementType> = {
  bot: Bot,
  code: Code,
  search: Search,
  file: FileText,
  database: Database,
  shield: Shield,
  zap: Zap,
  network: Network,
  users: Users,
  git: GitBranch,
  eye: Eye,
  cog: Cog,
  layers: Layers,
};

// Verification pattern display config
const patternConfig: Record<
  VerificationPattern,
  { label: string; color: string; bgColor: string }
> = {
  sibling: {
    label: 'Sibling',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
  },
  debate: {
    label: 'Debate',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
  },
  family: {
    label: 'Family',
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
  },
  waves: {
    label: 'Waves',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20',
  },
};

export default function AgentTemplateCard({
  template,
  instanceCount,
  onSelect,
  onDeploy,
  isSelected = false,
}: AgentTemplateCardProps): JSX.Element {
  const IconComponent = iconMap[template.icon] || Bot;
  const pattern = patternConfig[template.defaultPattern];

  return (
    <div
      onClick={onSelect}
      className={clsx(
        'bg-symtex-card rounded-xl p-5 border cursor-pointer',
        'transition-all duration-200',
        isSelected
          ? 'border-symtex-primary ring-2 ring-symtex-primary/30'
          : 'border-symtex-border hover:border-slate-600',
        'hover:shadow-lg hover:shadow-symtex-primary/5'
      )}
    >
      {/* Header with icon and status */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-symtex-primary/10 flex items-center justify-center">
            <IconComponent className="w-6 h-6 text-symtex-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-white">{template.name}</h3>
            <span
              className={clsx(
                'text-xs px-2 py-0.5 rounded',
                pattern.bgColor,
                pattern.color
              )}
            >
              {pattern.label}
            </span>
          </div>
        </div>

        {/* Instance count badge */}
        {instanceCount > 0 && (
          <div className="flex items-center gap-1 text-xs bg-slate-700/50 text-slate-300 px-2 py-1 rounded">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            {instanceCount} running
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-slate-400 mb-4 line-clamp-2">
        {template.description}
      </p>

      {/* Capabilities */}
      <div className="mb-4">
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
          Capabilities
        </p>
        <div className="flex flex-wrap gap-1.5">
          {template.capabilities.slice(0, 4).map((capability) => (
            <span
              key={capability}
              className="text-xs px-2 py-1 rounded bg-slate-700/50 text-slate-300"
            >
              {capability}
            </span>
          ))}
          {template.capabilities.length > 4 && (
            <span className="text-xs px-2 py-1 rounded bg-slate-700/30 text-slate-500">
              +{template.capabilities.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-3 border-t border-symtex-border">
        <Button
          variant="primary"
          size="sm"
          fullWidth
          onClick={(e) => {
            e.stopPropagation();
            onDeploy?.();
          }}
          leftIcon={<Zap className="w-4 h-4" />}
        >
          Deploy
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onSelect?.();
          }}
        >
          Details
        </Button>
      </div>
    </div>
  );
}
