/**
 * SpaceTree Sidebar Component
 *
 * Hierarchical tree view for navigating the Space hierarchy:
 * Personal Space > Domain > Project > Mission
 *
 * Features:
 * - Expand/collapse with smooth animation
 * - Auto-expand to show current selection
 * - Keyboard navigation with arrow keys
 * - Quick action buttons on hover
 * - Status indicators for projects and missions
 * - Persistent expansion state via localStorage
 */

import { useCallback, useMemo, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { useSpaceStore } from '@/store/useSpaceStore';
import { useContextStore } from '@/store/useContextStore';
import { useTreeExpansion } from '@/hooks/useTreeExpansion';
import { TreeNode } from './TreeNode';
import type { SpaceType, DomainSpace, Project, SpaceMission } from '@/types';

export interface SpaceTreeProps {
  /** Additional CSS classes */
  className?: string;
  /** Callback when navigating to a space */
  onNavigate?: (type: SpaceType, id: string) => void;
}

/**
 * Tree data structure for building the hierarchy
 */
interface TreeData {
  domains: DomainSpace[];
  projectsByDomain: Record<string, Project[]>;
  missionsByProject: Record<string, SpaceMission[]>;
}

/**
 * Build tree data structure from flat stores
 */
function useTreeData(): TreeData {
  // Select raw data records (not methods that return new arrays)
  const domainsRecord = useSpaceStore((state) => state.domains);
  const projectsRecord = useSpaceStore((state) => state.projects);
  const missionsRecord = useSpaceStore((state) => state.missions);

  return useMemo(() => {
    // Convert records to arrays inside useMemo to prevent infinite re-renders
    const domains = Object.values(domainsRecord);
    const projects = Object.values(projectsRecord);
    const missions = Object.values(missionsRecord);

    // Group projects by domain
    const projectsByDomain: Record<string, Project[]> = {};
    projects.forEach((project) => {
      if (!projectsByDomain[project.domainId]) {
        projectsByDomain[project.domainId] = [];
      }
      projectsByDomain[project.domainId].push(project);
    });

    // Group missions by project
    const missionsByProject: Record<string, SpaceMission[]> = {};
    missions.forEach((mission) => {
      if (!missionsByProject[mission.projectId]) {
        missionsByProject[mission.projectId] = [];
      }
      missionsByProject[mission.projectId].push(mission);
    });

    // Sort domains by name
    const sortedDomains = [...domains].sort((a, b) => a.name.localeCompare(b.name));

    return {
      domains: sortedDomains,
      projectsByDomain,
      missionsByProject,
    };
  }, [domainsRecord, projectsRecord, missionsRecord]);
}

/**
 * Get parent path for a node (used for auto-expansion)
 */
function getParentPath(
  type: SpaceType,
  id: string,
  treeData: TreeData,
  projects: Record<string, Project>
): string[] {
  const path: string[] = [];

  if (type === 'personal') {
    return path;
  }

  // Always include personal
  path.push('personal');

  if (type === 'domain') {
    return path;
  }

  // For project, find its domain
  if (type === 'project') {
    const project = projects[id];
    if (project) {
      path.push(`domain-${project.domainId}`);
    }
    return path;
  }

  // For mission, find its project and domain
  if (type === 'mission') {
    for (const [projectId, missions] of Object.entries(treeData.missionsByProject)) {
      if (missions.some((m) => m.id === id)) {
        const project = projects[projectId];
        if (project) {
          path.push(`domain-${project.domainId}`);
          path.push(`project-${projectId}`);
        }
        break;
      }
    }
    return path;
  }

  return path;
}

export function SpaceTree({ className, onNavigate }: SpaceTreeProps): JSX.Element {
  const personal = useSpaceStore((state) => state.personal);
  const projects = useSpaceStore((state) => state.projects);
  const currentSpaceType = useContextStore((state) => state.currentSpaceType);
  const currentId = useContextStore((state) => state.currentId);
  const navigateTo = useContextStore((state) => state.navigateTo);

  const treeData = useTreeData();

  const {
    isExpanded,
    toggleExpanded,
    expandMany,
  } = useTreeExpansion({
    storageKey: 'symtex-space-tree-expansion',
    defaultExpanded: new Set(['personal']),
  });

  // Ref for keyboard navigation
  const treeRef = useRef<HTMLDivElement>(null);
  // Note: focusedNodeRef will be used for advanced keyboard navigation in future enhancements

  // Auto-expand to show current selection
  useEffect(() => {
    if (currentSpaceType && currentId) {
      const parentPath = getParentPath(currentSpaceType, currentId, treeData, projects);
      if (parentPath.length > 0) {
        expandMany(parentPath);
      }
    }
  }, [currentSpaceType, currentId, treeData, projects, expandMany]);

  // Handle navigation
  const handleNavigate = useCallback(
    (type: SpaceType, id: string, name: string, icon?: string): void => {
      navigateTo(type, id, name, icon);
      onNavigate?.(type, id);
    },
    [navigateTo, onNavigate]
  );

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent): void => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        // Keyboard navigation is handled by individual TreeNode components
        // This is a placeholder for more complex navigation if needed
      }
    },
    []
  );

  // Check if a node is selected
  const isSelected = useCallback(
    (type: SpaceType, id: string): boolean => {
      return currentSpaceType === type && currentId === id;
    },
    [currentSpaceType, currentId]
  );

  // Render personal space and its children
  const renderPersonalSpace = (): JSX.Element | null => {
    if (!personal) {
      return (
        <div className="px-4 py-8 text-center text-slate-500 text-sm">
          No personal space configured
        </div>
      );
    }

    return (
      <TreeNode
        type="personal"
        id="personal"
        name={personal.name}
        isExpanded={isExpanded('personal')}
        isSelected={isSelected('personal', 'personal')}
        level={0}
        hasChildren={treeData.domains.length > 0}
        onToggle={() => toggleExpanded('personal')}
        onSelect={() => handleNavigate('personal', 'personal', personal.name)}
        onQuickAdd={() => {
          // TODO: Implement quick add domain modal
          console.log('Quick add domain');
        }}
        childCount={treeData.domains.length}
      >
        {treeData.domains.map((domain) => renderDomain(domain))}
      </TreeNode>
    );
  };

  // Render a domain and its projects
  const renderDomain = (domain: DomainSpace): JSX.Element => {
    const nodeId = `domain-${domain.id}`;
    const domainProjects = treeData.projectsByDomain[domain.id] || [];

    return (
      <TreeNode
        key={domain.id}
        type="domain"
        id={domain.id}
        name={domain.name}
        icon={domain.icon}
        color={domain.color}
        isExpanded={isExpanded(nodeId)}
        isSelected={isSelected('domain', domain.id)}
        level={1}
        hasChildren={domainProjects.length > 0}
        onToggle={() => toggleExpanded(nodeId)}
        onSelect={() => handleNavigate('domain', domain.id, domain.name, domain.icon)}
        onQuickAdd={() => {
          // TODO: Implement quick add project modal
          console.log('Quick add project to domain:', domain.id);
        }}
        childCount={domainProjects.length}
      >
        {domainProjects.map((project) => renderProject(project))}
      </TreeNode>
    );
  };

  // Render a project and its missions
  const renderProject = (project: Project): JSX.Element => {
    const nodeId = `project-${project.id}`;
    const projectMissions = treeData.missionsByProject[project.id] || [];

    return (
      <TreeNode
        key={project.id}
        type="project"
        id={project.id}
        name={project.name}
        status={project.status}
        isExpanded={isExpanded(nodeId)}
        isSelected={isSelected('project', project.id)}
        level={2}
        hasChildren={projectMissions.length > 0}
        onToggle={() => toggleExpanded(nodeId)}
        onSelect={() => handleNavigate('project', project.id, project.name)}
        onQuickAdd={() => {
          // TODO: Implement quick add mission modal
          console.log('Quick add mission to project:', project.id);
        }}
        childCount={projectMissions.length}
      >
        {projectMissions.map((mission) => renderMission(mission))}
      </TreeNode>
    );
  };

  // Render a mission
  const renderMission = (mission: SpaceMission): JSX.Element => {
    return (
      <TreeNode
        key={mission.id}
        type="mission"
        id={mission.id}
        name={mission.name}
        status={mission.status}
        isExpanded={false}
        isSelected={isSelected('mission', mission.id)}
        level={3}
        hasChildren={false}
        onToggle={() => {}}
        onSelect={() => handleNavigate('mission', mission.id, mission.name)}
      />
    );
  };

  return (
    <div
      ref={treeRef}
      className={clsx('py-2', className)}
      role="tree"
      aria-label="Space hierarchy navigation"
      onKeyDown={handleKeyDown}
    >
      {renderPersonalSpace()}
    </div>
  );
}

export default SpaceTree;
