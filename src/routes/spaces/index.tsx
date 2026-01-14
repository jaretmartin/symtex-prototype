/**
 * Spaces Management Page
 *
 * Main page for managing the space hierarchy: domains, projects, and missions.
 * Provides an overview and management interface for organizational structure.
 */

import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Layers,
  Plus,
  Folder,
  FolderKanban,
  Target,
  Settings,
  MoreHorizontal,
  ChevronRight,
} from 'lucide-react';
import clsx from 'clsx';
import { useSpaceStore } from '@/store/useSpaceStore';
import { useContextStore } from '@/store/useContextStore';
import { useToast } from '@/store';
import type { DomainSpace, Project } from '@/types';

/**
 * Domain Card Component
 */
interface DomainCardProps {
  domain: DomainSpace;
  projectCount: number;
  onSelect: () => void;
  onEdit?: () => void;
}

function DomainCard({
  domain,
  projectCount,
  onSelect,
  onEdit,
}: DomainCardProps): JSX.Element {
  return (
    <div
      className={clsx(
        'bg-symtex-card rounded-xl border border-symtex-border p-6',
        'hover:border-slate-600 transition-all duration-200 cursor-pointer group'
      )}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Open ${domain.name} domain`}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={clsx(
            'w-12 h-12 rounded-xl flex items-center justify-center text-2xl',
            'bg-symtex-primary/20'
          )}
        >
          {domain.icon || <Folder className="w-6 h-6 text-symtex-primary" />}
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.();
          }}
          className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-slate-700 opacity-0 group-hover:opacity-100 transition-all"
          aria-label={`Edit ${domain.name}`}
        >
          <MoreHorizontal className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      <h3 className="text-lg font-semibold text-white mb-1">{domain.name}</h3>
      <div className="mb-4" />

      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500">
          {projectCount} {projectCount === 1 ? 'project' : 'projects'}
        </span>
        <ChevronRight
          className="w-5 h-5 text-slate-500 group-hover:text-symtex-primary transition-colors"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

/**
 * Project Card Component
 */
interface ProjectCardProps {
  project: Project;
  missionCount: number;
  onSelect: () => void;
}

function ProjectCard({
  project,
  missionCount,
  onSelect,
}: ProjectCardProps): JSX.Element {
  const statusColors: Record<string, string> = {
    active: 'bg-green-500/20 text-green-400',
    planning: 'bg-blue-500/20 text-blue-400',
    paused: 'bg-yellow-500/20 text-yellow-400',
    completed: 'bg-slate-500/20 text-slate-400',
  };

  return (
    <div
      className={clsx(
        'bg-symtex-card rounded-xl border border-symtex-border p-5',
        'hover:border-slate-600 transition-all duration-200 cursor-pointer group'
      )}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Open ${project.name} project`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
          <FolderKanban className="w-5 h-5 text-indigo-400" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-white truncate">{project.name}</h4>
          <span
            className={clsx(
              'inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1',
              statusColors[project.status] || statusColors.active
            )}
          >
            {project.status}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-500">
          {missionCount} {missionCount === 1 ? 'mission' : 'missions'}
        </span>
        <ChevronRight
          className="w-4 h-4 text-slate-500 group-hover:text-symtex-primary transition-colors"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

export default function SpacesPage(): JSX.Element {
  const navigate = useNavigate();
  const { domainId, projectId } = useParams<{
    domainId?: string;
    projectId?: string;
  }>();
  const { info } = useToast();

  const personal = useSpaceStore((state) => state.personal);
  const domains = useSpaceStore((state) => state.getDomains());
  const projects = useSpaceStore((state) => state.getProjects());
  const missions = useSpaceStore((state) => state.getMissions());
  const navigateTo = useContextStore((state) => state.navigateTo);

  // Current view state
  const selectedDomain = domainId
    ? domains.find((d) => d.id === domainId)
    : null;
  const selectedProject = projectId
    ? projects.find((p) => p.id === projectId)
    : null;

  // Filter data based on selection
  const filteredProjects = selectedDomain
    ? projects.filter((p) => p.domainId === selectedDomain.id)
    : [];
  const filteredMissions = selectedProject
    ? missions.filter((m) => m.projectId === selectedProject.id)
    : [];

  // Get counts
  const getProjectCount = useCallback(
    (dId: string): number => projects.filter((p) => p.domainId === dId).length,
    [projects]
  );

  const getMissionCount = useCallback(
    (pId: string): number => missions.filter((m) => m.projectId === pId).length,
    [missions]
  );

  // Navigation handlers
  const handleDomainSelect = useCallback(
    (domain: DomainSpace): void => {
      navigateTo('domain', domain.id, domain.name, domain.icon);
      navigate(`/spaces/${domain.id}`);
    },
    [navigate, navigateTo]
  );

  const handleProjectSelect = useCallback(
    (project: Project): void => {
      navigateTo('project', project.id, project.name);
      navigate(`/spaces/${project.domainId}/${project.id}`);
    },
    [navigate, navigateTo]
  );

  const handleMissionSelect = useCallback(
    (missionId: string, missionName: string): void => {
      navigateTo('mission', missionId, missionName);
      navigate(`/missions/${missionId}`);
    },
    [navigate, navigateTo]
  );

  // Placeholder for adding new items
  const handleAddNew = useCallback(
    (type: 'domain' | 'project' | 'mission'): void => {
      info('Coming Soon', `Creating new ${type}s will be available in a future update.`);
    },
    [info]
  );

  // Render breadcrumb
  const renderBreadcrumb = (): JSX.Element => (
    <nav className="flex items-center gap-2 text-sm mb-6" aria-label="Breadcrumb">
      <button
        type="button"
        onClick={() => {
          navigateTo('personal', 'personal', personal?.name || 'Personal Space');
          navigate('/spaces');
        }}
        className={clsx(
          'text-slate-400 hover:text-white transition-colors',
          !domainId && 'text-symtex-primary'
        )}
      >
        Spaces
      </button>
      {selectedDomain && (
        <>
          <ChevronRight className="w-4 h-4 text-slate-600" aria-hidden="true" />
          <button
            type="button"
            onClick={() => {
              navigateTo('domain', selectedDomain.id, selectedDomain.name);
              navigate(`/spaces/${selectedDomain.id}`);
            }}
            className={clsx(
              'text-slate-400 hover:text-white transition-colors',
              !projectId && 'text-symtex-primary'
            )}
          >
            {selectedDomain.name}
          </button>
        </>
      )}
      {selectedProject && (
        <>
          <ChevronRight className="w-4 h-4 text-slate-600" aria-hidden="true" />
          <span className="text-symtex-primary">{selectedProject.name}</span>
        </>
      )}
    </nav>
  );

  // Render domains view
  const renderDomainsView = (): JSX.Element => (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white">Domains</h2>
          <p className="text-slate-400 text-sm">
            Organize your work into logical domains
          </p>
        </div>
        <button
          type="button"
          onClick={() => handleAddNew('domain')}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-symtex-card border border-symtex-border text-slate-300 hover:text-white hover:border-slate-500 transition-all text-sm"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          New Domain
        </button>
      </div>

      {domains.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {domains.map((domain) => (
            <DomainCard
              key={domain.id}
              domain={domain}
              projectCount={getProjectCount(domain.id)}
              onSelect={() => handleDomainSelect(domain)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[300px] bg-symtex-card rounded-xl border border-symtex-border">
          <Folder className="w-12 h-12 text-slate-600 mb-4" aria-hidden="true" />
          <h3 className="text-lg font-semibold text-white mb-2">No Domains Yet</h3>
          <p className="text-slate-400 mb-4">Create your first domain to get started</p>
          <button
            type="button"
            onClick={() => handleAddNew('domain')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg gradient-primary text-white font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            Create Domain
          </button>
        </div>
      )}
    </>
  );

  // Render projects view
  const renderProjectsView = (): JSX.Element => (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white">Projects</h2>
          <p className="text-slate-400 text-sm">
            Projects in {selectedDomain?.name}
          </p>
        </div>
        <button
          type="button"
          onClick={() => handleAddNew('project')}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-symtex-card border border-symtex-border text-slate-300 hover:text-white hover:border-slate-500 transition-all text-sm"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          New Project
        </button>
      </div>

      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              missionCount={getMissionCount(project.id)}
              onSelect={() => handleProjectSelect(project)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[200px] bg-symtex-card rounded-xl border border-symtex-border">
          <FolderKanban className="w-10 h-10 text-slate-600 mb-3" aria-hidden="true" />
          <h3 className="font-semibold text-white mb-2">No Projects Yet</h3>
          <p className="text-slate-400 text-sm mb-4">
            Create your first project in this domain
          </p>
          <button
            type="button"
            onClick={() => handleAddNew('project')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg gradient-primary text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            Create Project
          </button>
        </div>
      )}
    </>
  );

  // Render missions view
  const renderMissionsView = (): JSX.Element => (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white">Missions</h2>
          <p className="text-slate-400 text-sm">
            Missions in {selectedProject?.name}
          </p>
        </div>
        <button
          type="button"
          onClick={() => handleAddNew('mission')}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-symtex-card border border-symtex-border text-slate-300 hover:text-white hover:border-slate-500 transition-all text-sm"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          New Mission
        </button>
      </div>

      {filteredMissions.length > 0 ? (
        <div className="space-y-3">
          {filteredMissions.map((mission) => (
            <div
              key={mission.id}
              className={clsx(
                'flex items-center justify-between p-4 rounded-lg',
                'bg-symtex-card border border-symtex-border',
                'hover:border-slate-600 transition-all cursor-pointer'
              )}
              onClick={() => handleMissionSelect(mission.id, mission.name)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleMissionSelect(mission.id, mission.name);
                }
              }}
              tabIndex={0}
              role="button"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <Target className="w-4 h-4 text-amber-400" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="font-medium text-white">{mission.name}</h4>
                  <span className="text-xs text-slate-500 capitalize">
                    {mission.status}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500" aria-hidden="true" />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[200px] bg-symtex-card rounded-xl border border-symtex-border">
          <Target className="w-10 h-10 text-slate-600 mb-3" aria-hidden="true" />
          <h3 className="font-semibold text-white mb-2">No Missions Yet</h3>
          <p className="text-slate-400 text-sm mb-4">
            Create your first mission in this project
          </p>
          <button
            type="button"
            onClick={() => handleAddNew('mission')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg gradient-primary text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            Create Mission
          </button>
        </div>
      )}
    </>
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Layers className="w-8 h-8 text-symtex-primary" />
            Spaces
          </h1>
          <p className="text-slate-400 mt-1">
            Organize your work into domains, projects, and missions
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            info('Coming Soon', 'Space settings will be available in a future update.');
          }}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Space settings"
        >
          <Settings className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>

      {/* Breadcrumb Navigation */}
      {renderBreadcrumb()}

      {/* Content based on selection */}
      {selectedProject
        ? renderMissionsView()
        : selectedDomain
        ? renderProjectsView()
        : renderDomainsView()}
    </div>
  );
}
