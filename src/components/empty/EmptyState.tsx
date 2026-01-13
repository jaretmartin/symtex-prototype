/**
 * Empty State Components
 *
 * Contextual empty states for different sections of the app
 */

import { useNavigate } from 'react-router-dom';
import {
  Workflow,
  Target,
  FileText,
  Search,
  FolderOpen,
  Plus,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface BaseEmptyStateProps {
  className?: string;
}

interface EmptyStateProps extends BaseEmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
}: EmptyStateProps): JSX.Element {
  return (
    <div className={`flex flex-col items-center justify-center py-16 text-center ${className}`}>
      {/* Icon */}
      <div className="w-16 h-16 rounded-full bg-symtex-primary/10 flex items-center justify-center mb-6">
        <span className="text-symtex-primary">{icon}</span>
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>

      {/* Description */}
      <p className="text-slate-400 mb-6 max-w-md">{description}</p>

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="flex items-center gap-3">
          {action && (
            <Button onClick={action.onClick} leftIcon={action.icon}>
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button variant="secondary" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// Pre-built empty states for common scenarios

export function EmptyWorkflows({ className }: BaseEmptyStateProps): JSX.Element {
  const navigate = useNavigate();

  return (
    <EmptyState
      icon={<Workflow className="w-8 h-8" />}
      title="No workflows yet"
      description="Create your first workflow to automate tasks and streamline your operations."
      action={{
        label: 'Create Workflow',
        onClick: () => navigate('/studio/lux?new=true'),
        icon: <Plus className="w-4 h-4" />,
      }}
      secondaryAction={{
        label: 'Browse Templates',
        onClick: () => navigate('/library/templates'),
      }}
      className={className}
    />
  );
}

export function EmptyMissions({ className }: BaseEmptyStateProps): JSX.Element {
  const navigate = useNavigate();

  return (
    <EmptyState
      icon={<Target className="w-8 h-8" />}
      title="No missions found"
      description="Start your AI operations journey by creating your first mission."
      action={{
        label: 'Create Mission',
        onClick: () => navigate('/missions?new=true'),
        icon: <Plus className="w-4 h-4" />,
      }}
      className={className}
    />
  );
}

export function EmptyTemplates({ className }: BaseEmptyStateProps): JSX.Element {
  return (
    <EmptyState
      icon={<FileText className="w-8 h-8" />}
      title="No templates available"
      description="Templates will appear here once they are created or imported."
      className={className}
    />
  );
}

export function EmptySearch({
  query,
  className,
}: BaseEmptyStateProps & { query: string }): JSX.Element {
  return (
    <EmptyState
      icon={<Search className="w-8 h-8" />}
      title="No results found"
      description={`We couldn't find anything matching "${query}". Try adjusting your search or filters.`}
      className={className}
    />
  );
}

export function EmptyFolder({ className }: BaseEmptyStateProps): JSX.Element {
  return (
    <EmptyState
      icon={<FolderOpen className="w-8 h-8" />}
      title="This folder is empty"
      description="Add items to this folder to organize your work."
      className={className}
    />
  );
}

export function EmptyCanvas({
  onAddNode,
  className,
}: BaseEmptyStateProps & { onAddNode?: () => void }): JSX.Element {
  return (
    <EmptyState
      icon={<Sparkles className="w-8 h-8" />}
      title="Your canvas is empty"
      description="Drag nodes from the palette or use AI to generate your workflow."
      action={
        onAddNode
          ? {
              label: 'Add First Node',
              onClick: onAddNode,
              icon: <Plus className="w-4 h-4" />,
            }
          : undefined
      }
      className={className}
    />
  );
}
