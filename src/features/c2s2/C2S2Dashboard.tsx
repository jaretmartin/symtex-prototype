/**
 * C2S2Dashboard Component
 *
 * Main dashboard for Code-to-S1 transformations.
 * Shows project stats, recent transformations, and quick actions.
 * Includes DEMO MODE banner to indicate simulated transformations.
 */

import { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  FlaskConical,
  FolderPlus,
  Upload,
  Compass,
  Code2,
  CheckCircle2,
  Clock,
  TrendingUp,
  ChevronRight,
  FileCode,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useC2S2Store, type C2S2Transformation } from './c2s2-store';

interface C2S2DashboardProps {
  className?: string;
  onNavigateToExplorer?: () => void;
  onCreateProject?: () => void;
  onImportCode?: () => void;
}

// Stats card component
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  description?: string;
  trend?: number;
  color: string;
}

function StatCard({ icon, label, value, description, trend, color }: StatCardProps): JSX.Element {
  return (
    <Card className="bg-card/50 border-border/50 hover:border-border transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', color)}>
                {icon}
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground mb-1">{value}</p>
            <p className="text-sm text-muted-foreground font-medium">{label}</p>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          {trend !== undefined && (
            <div
              className={cn(
                'flex items-center gap-1 px-2 py-1 rounded-full',
                trend >= 0 ? 'bg-emerald-500/10' : 'bg-red-500/10'
              )}
            >
              <TrendingUp
                className={cn(
                  'w-3 h-3',
                  trend >= 0 ? 'text-emerald-400' : 'text-red-400 rotate-180'
                )}
              />
              <span
                className={cn(
                  'text-xs font-medium',
                  trend >= 0 ? 'text-emerald-400' : 'text-red-400'
                )}
              >
                {Math.abs(trend)}%
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Transformation list item component
interface TransformationItemProps {
  transformation: C2S2Transformation;
  projectName: string;
  onClick?: () => void;
}

function TransformationItem({ transformation, projectName, onClick }: TransformationItemProps): JSX.Element {
  const statusConfig: Record<
    C2S2Transformation['status'],
    { icon: typeof Clock; color: string; bg: string; animate?: boolean }
  > = {
    pending: { icon: Clock, color: 'text-muted-foreground', bg: 'bg-muted/10' },
    processing: { icon: Loader2, color: 'text-blue-400', bg: 'bg-blue-500/10', animate: true },
    completed: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    failed: { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
  };

  const config = statusConfig[transformation.status];
  const StatusIcon = config.icon;

  // Get first line of input code for preview
  const codePreview = transformation.inputCode.split('\n')[0].substring(0, 50);

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="p-3 bg-card/30 rounded-lg border border-border/50 hover:border-border cursor-pointer transition-colors"
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className={cn('p-2 rounded-lg', config.bg)}>
          <StatusIcon
            className={cn(
              'w-4 h-4',
              config.color,
              config.animate === true && 'animate-spin'
            )}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-medium text-foreground truncate">
              {projectName}
            </p>
            {transformation.status === 'completed' && transformation.confidence > 0 && (
              <span className="text-xs text-muted-foreground">
                {transformation.confidence}% confidence
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground font-mono truncate">
            {codePreview}...
          </p>
          {transformation.warnings.length > 0 && (
            <div className="flex items-center gap-1 mt-1">
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              <span className="text-xs text-amber-400">
                {transformation.warnings.length} warning{transformation.warnings.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </div>
    </motion.div>
  );
}

// Quick action button component
interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick?: () => void;
}

function QuickAction({ icon, label, description, onClick }: QuickActionProps): JSX.Element {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 p-4 bg-card/30 rounded-lg border border-border/50 hover:border-symtex-primary/50 hover:bg-card/50 transition-all text-left w-full group"
    >
      <div className="p-2 rounded-lg bg-symtex-primary/10 text-symtex-primary group-hover:bg-symtex-primary/20 transition-colors">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
    </button>
  );
}

function C2S2Dashboard({
  className,
  onNavigateToExplorer,
  onCreateProject,
  onImportCode,
}: C2S2DashboardProps): JSX.Element {
  const {
    projects,
    getStats,
    getRecentTransformations,
    setCurrentProject,
    setActiveTransformation,
  } = useC2S2Store();

  const stats = getStats();
  const recentTransformations = getRecentTransformations(5);

  const handleTransformationClick = useCallback(
    (transformation: C2S2Transformation) => {
      const project = projects.find((p) => p.id === transformation.projectId);
      if (project) {
        setCurrentProject(project);
        setActiveTransformation(transformation.id);
      }
    },
    [projects, setCurrentProject, setActiveTransformation]
  );

  const getProjectName = useCallback(
    (projectId: string): string => {
      const project = projects.find((p) => p.id === projectId);
      return project?.name || 'Unknown Project';
    },
    [projects]
  );

  return (
    <div className={cn('space-y-6', className)}>
      {/* DEMO MODE Banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-2">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-amber-500" />
          <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
            DEMO MODE - Transformations are simulated
          </span>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <Code2 className="w-7 h-7 text-symtex-primary" />
            C2S2 Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Transform code into S1/Symtex Script for deterministic AI operations
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<FolderPlus className="w-5 h-5 text-indigo-400" />}
          label="Total Projects"
          value={stats.totalProjects}
          description="Active transformation projects"
          color="bg-indigo-500/10"
        />
        <StatCard
          icon={<FileCode className="w-5 h-5 text-purple-400" />}
          label="Transformations"
          value={stats.totalTransformations}
          description="Code snippets converted"
          trend={12}
          color="bg-purple-500/10"
        />
        <StatCard
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          label="Success Rate"
          value={`${stats.overallSuccessRate}%`}
          description="Successful transformations"
          trend={5}
          color="bg-emerald-500/10"
        />
        <StatCard
          icon={<Clock className="w-5 h-5 text-cyan-400" />}
          label="Time Saved"
          value={`${stats.timeSavedHours}h`}
          description="Estimated time saved"
          color="bg-cyan-500/10"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transformations */}
        <div className="lg:col-span-2">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-symtex-primary" />
                  Recent Transformations
                </span>
                <button className="text-xs text-symtex-primary hover:text-symtex-primary/80 transition-colors">
                  View all
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentTransformations.length > 0 ? (
                recentTransformations.map((transformation) => (
                  <TransformationItem
                    key={transformation.id}
                    transformation={transformation}
                    projectName={getProjectName(transformation.projectId)}
                    onClick={() => handleTransformationClick(transformation)}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileCode className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No transformations yet</p>
                  <p className="text-xs mt-1">Create a project to get started</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <QuickAction
                icon={<FolderPlus className="w-4 h-4" />}
                label="New Project"
                description="Start a new transformation project"
                onClick={onCreateProject}
              />
              <QuickAction
                icon={<Upload className="w-4 h-4" />}
                label="Import Code"
                description="Upload code for transformation"
                onClick={onImportCode}
              />
              <QuickAction
                icon={<Compass className="w-4 h-4" />}
                label="View Explorer"
                description="Browse all projects and transformations"
                onClick={onNavigateToExplorer}
              />
            </CardContent>
          </Card>

          {/* Active Projects */}
          <Card className="bg-card border-border mt-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-symtex-primary" />
                Active Projects
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {projects.slice(0, 3).map((project) => (
                <button
                  key={project.id}
                  onClick={() => setCurrentProject(project)}
                  className="w-full p-3 bg-card/30 rounded-lg border border-border/50 hover:border-border text-left transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {project.name}
                    </p>
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded-full text-xs font-medium',
                        project.status === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : project.status === 'in_progress'
                            ? 'bg-blue-500/10 text-blue-400'
                            : project.status === 'failed'
                              ? 'bg-red-500/10 text-red-400'
                              : 'bg-muted/10 text-muted-foreground'
                      )}
                    >
                      {project.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {project.transformationCount} transformations - {project.successRate}% success
                  </p>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default memo(C2S2Dashboard);
