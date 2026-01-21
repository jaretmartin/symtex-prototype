/**
 * DomainCard Component
 *
 * Card component for displaying a domain space with its projects and metrics.
 * Features: Icon display, color theming, project count, navigation, actions menu.
 */

import { useState, useRef, useEffect } from 'react';
import {
  ChevronRight,
  MoreHorizontal,
  Settings,
  Trash2,
  FolderPlus,
  Bot,
  Edit3,
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import clsx from 'clsx';
import type { DomainSpace, Project } from '@/types';

interface DomainCardProps {
  domain: DomainSpace;
  /** Projects within this domain */
  projects: Project[];
  /** Cognate count for display */
  cognateCount?: number;
  /** Click handler for the card */
  onClick?: () => void;
  /** Handler for settings action */
  onSettings?: () => void;
  /** Handler for delete action */
  onDelete?: () => void;
  /** Handler for rename action */
  onRename?: () => void;
  /** Handler for adding a project */
  onAddProject?: () => void;
  className?: string;
}

export function DomainCard({
  domain,
  projects,
  cognateCount = 0,
  onClick,
  onSettings,
  onDelete,
  onRename,
  onAddProject,
  className,
}: DomainCardProps): JSX.Element {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Get the icon component dynamically
  const getIconComponent = (name: string): React.ComponentType<{ className?: string; style?: React.CSSProperties }> | null => {
    const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>>)[name];
    return IconComponent || null;
  };

  const IconComponent = getIconComponent(domain.icon);

  // Calculate project stats
  const activeProjects = projects.filter((p) => p.status === 'active').length;
  const completedProjects = projects.filter((p) => p.status === 'completed').length;
  const totalProjects = projects.length;

  // Average progress across projects
  const avgProgress = totalProjects > 0
    ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / totalProjects)
    : 0;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuClick = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleAction = (action: () => void) => (e: React.MouseEvent): void => {
    e.stopPropagation();
    setIsMenuOpen(false);
    action();
  };

  return (
    <div
      className={clsx(
        'group relative bg-surface-base rounded-xl border border-border',
        'hover:border-border transition-all cursor-pointer',
        'overflow-hidden',
        className
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`View ${domain.name} domain with ${totalProjects} ${totalProjects === 1 ? 'project' : 'projects'}`}
      onKeyDown={(e): void => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {/* Color Accent Bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ backgroundColor: domain.color }}
      />

      {/* Card Content */}
      <div className="p-5 pt-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            {/* Icon */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${domain.color}20` }}
            >
              {IconComponent ? (
                <IconComponent
                  className="w-6 h-6"
                  style={{ color: domain.color }}
                />
              ) : (
                <span
                  className="text-xl font-bold"
                  style={{ color: domain.color }}
                >
                  {domain.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            {/* Title */}
            <div>
              <h3 className="text-lg font-semibold text-foreground group-hover:text-symtex-primary transition-colors">
                {domain.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {totalProjects} {totalProjects === 1 ? 'project' : 'projects'}
              </p>
            </div>
          </div>

          {/* Actions Menu */}
          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={handleMenuClick}
              className={clsx(
                'p-2 rounded-lg transition-colors',
                isMenuOpen
                  ? 'bg-card text-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-card',
                'opacity-0 group-hover:opacity-100 focus:opacity-100'
              )}
              aria-label="Domain actions"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-surface-base border border-border rounded-lg shadow-xl z-10 overflow-hidden">
                {onAddProject && (
                  <button
                    type="button"
                    onClick={handleAction(onAddProject)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-muted-foreground hover:bg-card hover:text-foreground transition-colors"
                  >
                    <FolderPlus className="w-4 h-4" />
                    Add Project
                  </button>
                )}
                {onRename && (
                  <button
                    type="button"
                    onClick={handleAction(onRename)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-muted-foreground hover:bg-card hover:text-foreground transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    Rename
                  </button>
                )}
                {onSettings && (
                  <button
                    type="button"
                    onClick={handleAction(onSettings)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-muted-foreground hover:bg-card hover:text-foreground transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                )}
                {onDelete && (
                  <>
                    <div className="border-t border-border" />
                    <button
                      type="button"
                      onClick={handleAction(onDelete)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <p className="text-2xl font-semibold text-foreground">{activeProjects}</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-green-400">{completedProjects}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-muted-foreground">{avgProgress}%</p>
            <p className="text-xs text-muted-foreground">Avg Progress</p>
          </div>
        </div>

        {/* Progress Bar */}
        {totalProjects > 0 && (
          <div className="mb-4">
            <div className="h-2 bg-card rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${avgProgress}%`,
                  backgroundColor: domain.color,
                }}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          {/* Cognates */}
          {cognateCount > 0 ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Bot className="w-4 h-4" />
              <span className="text-sm">
                {cognateCount} {cognateCount === 1 ? 'cognate' : 'cognates'}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Bot className="w-4 h-4" />
              <span className="text-sm">No cognates</span>
            </div>
          )}

          {/* Navigate CTA */}
          <div className="flex items-center gap-1 text-sm text-muted-foreground group-hover:text-symtex-primary transition-colors">
            <span>View</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DomainCard;
