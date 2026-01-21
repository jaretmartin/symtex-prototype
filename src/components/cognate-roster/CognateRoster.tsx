/**
 * Cognate Roster Component
 *
 * Displays a grid of available Cognate templates with filtering,
 * search, and category tabs functionality.
 */

import { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Bot,
  Users,
  Layers,
  Zap,
} from 'lucide-react';
import clsx from 'clsx';
import type { AgentTemplate, VerificationPattern } from '@/types';
import { useCognateStore } from '@/store/useCognateStore';
import CognateTemplateCard from './CognateTemplateCard';
import { EmptyState } from '@/components/empty/EmptyState';

interface CognateRosterProps {
  onSelectTemplate?: (template: AgentTemplate) => void;
  onCreateInstance?: (templateId: string) => void;
}

type CategoryFilter = 'all' | VerificationPattern;

interface CategoryTab {
  id: CategoryFilter;
  label: string;
  icon: React.ElementType;
  description: string;
}

const categoryTabs: CategoryTab[] = [
  {
    id: 'all',
    label: 'All Cognates',
    icon: Bot,
    description: 'View all available Cognate templates',
  },
  {
    id: 'sibling',
    label: 'Sibling',
    icon: Users,
    description: 'Multiple Cognates work independently',
  },
  {
    id: 'debate',
    label: 'Debate',
    icon: Layers,
    description: 'Cognates argue positions and reach consensus',
  },
  {
    id: 'family',
    label: 'Family',
    icon: Users,
    description: 'Hierarchical with supervisor Cognate',
  },
  {
    id: 'waves',
    label: 'Waves',
    icon: Zap,
    description: 'Sequential validation layers',
  },
];

export default function CognateRoster({
  onSelectTemplate,
  onCreateInstance,
}: CognateRosterProps): JSX.Element {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [showFilters, setShowFilters] = useState(false);

  const { templates, getInstances, selectTemplate } = useCognateStore();
  const instances = getInstances();

  // Calculate instance counts per template
  const instanceCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    instances.forEach((instance) => {
      if (instance.status === 'running' || instance.status === 'busy') {
        counts[instance.templateId] = (counts[instance.templateId] || 0) + 1;
      }
    });
    return counts;
  }, [instances]);

  // Filter templates based on search and category
  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      // Category filter
      if (activeCategory !== 'all' && template.defaultPattern !== activeCategory) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = template.name.toLowerCase().includes(query);
        const matchesDescription = template.description.toLowerCase().includes(query);
        const matchesCapabilities = template.capabilities.some((cap) =>
          cap.toLowerCase().includes(query)
        );
        return matchesName || matchesDescription || matchesCapabilities;
      }

      return true;
    });
  }, [templates, searchQuery, activeCategory]);

  const handleSelectTemplate = (template: AgentTemplate): void => {
    selectTemplate(template.id);
    onSelectTemplate?.(template);
  };

  const handleDeployTemplate = (templateId: string): void => {
    onCreateInstance?.(templateId);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header with Search */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Cognate Roster</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {templates.length} templates available
            </p>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search Cognates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={clsx(
                  'w-64 pl-10 pr-4 py-2 rounded-lg',
                  'bg-card border border-border',
                  'text-white placeholder-slate-500',
                  'focus:outline-none focus:border-symtex-primary focus:ring-1 focus:ring-symtex-primary'
                )}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={clsx(
                'p-2 rounded-lg border transition-colors',
                showFilters
                  ? 'bg-symtex-primary/10 border-symtex-primary text-symtex-primary'
                  : 'bg-card border-border text-muted-foreground hover:text-white'
              )}
              aria-label="Toggle filters"
              aria-pressed={showFilters}
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categoryTabs.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeCategory === tab.id;
            const count =
              tab.id === 'all'
                ? templates.length
                : templates.filter((t) => t.defaultPattern === tab.id).length;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={clsx(
                  'flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap',
                  'transition-all duration-200',
                  isActive
                    ? 'bg-symtex-primary/20 text-symtex-primary border border-symtex-primary/30'
                    : 'bg-card border border-border text-muted-foreground hover:text-white hover:border-border'
                )}
                aria-pressed={isActive}
              >
                <TabIcon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
                <span
                  className={clsx(
                    'text-xs px-1.5 py-0.5 rounded',
                    isActive ? 'bg-symtex-primary/30' : 'bg-muted/50'
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="flex-1 overflow-y-auto">
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <CognateTemplateCard
                key={template.id}
                template={template}
                instanceCount={instanceCounts[template.id] || 0}
                onSelect={() => handleSelectTemplate(template)}
                onDeploy={() => handleDeployTemplate(template.id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Bot className="w-8 h-8" />}
            title={searchQuery ? 'No Cognates found' : 'No Cognate templates'}
            description={
              searchQuery
                ? `No Cognates match "${searchQuery}". Try adjusting your search.`
                : 'Create your first Cognate template to get started.'
            }
          />
        )}
      </div>
    </div>
  );
}
