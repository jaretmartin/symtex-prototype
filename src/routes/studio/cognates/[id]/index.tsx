/**
 * Cognate Detail Page
 *
 * Central hub for a Cognate showing overview, space assignment, packs, and simulation.
 * Entry point for WF1: Cognate -> Space -> Pack -> Simulate workflow.
 */

import { useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Play,
  Settings,
  Package,
  FileText,
  GraduationCap,
  Loader2,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Folder,
  BookOpen,
  ExternalLink,
  Clock,
} from 'lucide-react';
import { useCognateStore, useSpaceStore } from '@/store';
import { useCognateEvents } from '@/hooks/useCognateEvents';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SimulationModal } from '@/components/simulation/SimulationModal';
import type { Cognate } from '@/types';

interface CostMeterProps {
  currentCost: number;
  maxCost: number;
  isRunning: boolean;
}

function CostMeter({ currentCost, maxCost, isRunning }: CostMeterProps): JSX.Element {
  const percentage = Math.min((currentCost / maxCost) * 100, 100);
  const isWarning = percentage > 80;

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-surface-base border border-border rounded-lg">
      <DollarSign className={`w-5 h-5 ${isWarning ? 'text-yellow-400' : 'text-green-400'}`} />
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-muted-foreground">Simulation Cost</span>
          <span className="text-xs font-mono">
            ${currentCost.toFixed(4)} / ${maxCost.toFixed(2)}
          </span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              isWarning ? 'bg-yellow-400' : 'bg-green-400'
            } ${isRunning ? 'animate-pulse' : ''}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}

interface SimulationProgressProps {
  progress: number;
  status: string;
}

function SimulationProgress({ progress, status }: SimulationProgressProps): JSX.Element {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
      <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-blue-400 font-medium">{status}</span>
          <span className="text-xs font-mono text-blue-400">{progress}%</span>
        </div>
        <div className="h-1.5 bg-blue-500/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-400 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
  count?: number;
}

function QuickActionCard({ title, description, icon, to, count }: QuickActionCardProps): JSX.Element {
  return (
    <Link
      to={to}
      className="p-4 bg-surface-base/50 border border-border rounded-lg hover:border-muted hover:bg-surface-base transition-all group"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 bg-card rounded-lg text-muted-foreground group-hover:text-primary transition-colors">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
              {title}
            </h3>
            {count !== undefined && (
              <span className="px-2 py-0.5 text-xs bg-card rounded-full text-muted-foreground">
                {count}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </div>
    </Link>
  );
}

export function CognateDetailPage(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cognates, sops, updateCognate } = useCognateStore();
  const { getDomains, getProjectsForDomain } = useSpaceStore();
  const { dispatchEvent } = useCognateEvents();

  // Get domains as a proxy for spaces
  const domains = getDomains();
  const firstDomain = domains[0];
  const projectsForDomain = firstDomain ? getProjectsForDomain(firstDomain.id) : [];

  const cognate = cognates.find((c) => c.id === id);
  const cognateSOPs = sops.filter((s) => s.cognateId === id);
  const activeSOPs = cognateSOPs.filter((s) => s.status === 'active');

  // Simulation state
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [simulationStatus, setSimulationStatus] = useState('');
  const [simulationCost, setSimulationCost] = useState(0);
  const [showSimulationModal, setShowSimulationModal] = useState(false);

  // Assigned space (mock for now - would come from cognate data)
  const assignedSpace = firstDomain; // Default to first domain

  const handleSimulate = useCallback(async (): Promise<void> => {
    if (!cognate || isSimulating) return;

    setIsSimulating(true);
    setSimulationProgress(0);
    setSimulationCost(0);

    // Dispatch run_started event
    dispatchEvent({
      type: 'run_started',
      cognateId: cognate.id,
      payload: { simulationType: 'full' },
    });

    // Simulate progress
    const stages = [
      { progress: 15, status: 'Loading SOPs...', costIncrement: 0.001 },
      { progress: 30, status: 'Analyzing rules...', costIncrement: 0.002 },
      { progress: 50, status: 'Running scenarios...', costIncrement: 0.005 },
      { progress: 70, status: 'Evaluating responses...', costIncrement: 0.003 },
      { progress: 85, status: 'Computing diff...', costIncrement: 0.002 },
      { progress: 100, status: 'Simulation complete', costIncrement: 0.001 },
    ];

    for (const stage of stages) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setSimulationProgress(stage.progress);
      setSimulationStatus(stage.status);
      setSimulationCost((prev) => prev + stage.costIncrement);
    }

    // Dispatch simulation_finished event
    dispatchEvent({
      type: 'simulation_finished',
      cognateId: cognate.id,
      payload: { diffAvailable: true, cost: 0.014 },
    });

    // Small delay before showing modal
    await new Promise((resolve) => setTimeout(resolve, 300));

    setIsSimulating(false);
    setShowSimulationModal(true);

    // Update cognate with last simulation time
    updateCognate(cognate.id, {
      updatedAt: new Date().toISOString(),
    });
  }, [cognate, isSimulating, dispatchEvent, updateCognate]);

  if (!cognate) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-medium text-foreground mb-2">Cognate Not Found</h2>
        <p className="text-muted-foreground mb-4">The requested Cognate does not exist.</p>
        <Link
          to="/studio/cognates"
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Cognates
        </Link>
      </div>
    );
  }

  const statusColors: Record<Cognate['status'], string> = {
    draft: 'bg-yellow-500/20 text-yellow-400',
    active: 'bg-green-500/20 text-green-400',
    paused: 'bg-orange-500/20 text-orange-400',
    archived: 'bg-muted/20 text-muted-foreground',
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/studio/cognates')}
            className="p-2 hover:bg-card rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl">
              {cognate.avatar || '🤖'}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-foreground">{cognate.name}</h1>
                <span className={`px-2 py-0.5 text-xs rounded-full ${statusColors[cognate.status]}`}>
                  {cognate.status.charAt(0).toUpperCase() + cognate.status.slice(1)}
                </span>
              </div>
              <p className="text-muted-foreground mt-1">{cognate.description}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/studio/cognates/${id}/sops`)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSimulate}
            disabled={isSimulating || activeSOPs.length === 0}
          >
            {isSimulating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Simulating...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Simulate Run
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Simulation Progress */}
      {isSimulating && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SimulationProgress progress={simulationProgress} status={simulationStatus} />
          <CostMeter currentCost={simulationCost} maxCost={0.05} isRunning={isSimulating} />
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Overview & Status */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total SOPs</span>
                  <FileText className="w-4 h-4 text-muted-foreground" />
                </div>
                <p className="text-2xl font-bold text-foreground mt-2">{cognateSOPs.length}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Active SOPs</span>
                  <CheckCircle className="w-4 h-4 text-green-400" />
                </div>
                <p className="text-2xl font-bold text-foreground mt-2">{activeSOPs.length}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Rules</span>
                  <AlertCircle className="w-4 h-4 text-muted-foreground" />
                </div>
                <p className="text-2xl font-bold text-foreground mt-2">
                  {cognateSOPs.reduce((acc, s) => acc + s.rules.length, 0)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Triggers</span>
                  <Clock className="w-4 h-4 text-muted-foreground" />
                </div>
                <p className="text-2xl font-bold text-foreground mt-2">
                  {cognateSOPs.reduce((acc, s) => acc + s.triggerCount, 0).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <QuickActionCard
                title="Manage SOPs"
                description="View and edit Standard Operating Procedures"
                icon={<FileText className="w-5 h-5" />}
                to={`/studio/cognates/${id}/sops`}
                count={cognateSOPs.length}
              />
              <QuickActionCard
                title="Install Packs"
                description="Add pre-built SOP collections"
                icon={<Package className="w-5 h-5" />}
                to={`/studio/cognates/${id}/packs`}
              />
              <QuickActionCard
                title="Training"
                description="View boot camp progress and sessions"
                icon={<GraduationCap className="w-5 h-5" />}
                to={`/studio/cognates/${id}/training`}
              />
              <QuickActionCard
                title="Bootstrap Setup"
                description="Configure initial Cognate settings"
                icon={<Settings className="w-5 h-5" />}
                to={`/studio/cognates/${id}/bootstrap`}
              />
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <Link
                to="/control/ledger"
                className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
              >
                View in Ledger
                <ExternalLink className="w-3 h-3" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cognateSOPs.slice(0, 3).map((sop) => (
                  <div key={sop.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-medium text-foreground">{sop.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {sop.lastTriggeredAt
                          ? `Last triggered ${new Date(sop.lastTriggeredAt).toLocaleDateString()}`
                          : 'Never triggered'}
                      </p>
                    </div>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      sop.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {sop.status}
                    </span>
                  </div>
                ))}
                {cognateSOPs.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No SOPs configured yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Space & Info */}
        <div className="space-y-6">
          {/* Assigned Space */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Folder className="w-4 h-4" />
                Assigned Space
              </CardTitle>
            </CardHeader>
            <CardContent>
              {assignedSpace ? (
                <Link
                  to={`/spaces/${assignedSpace.id}`}
                  className="block p-3 bg-surface-base border border-border rounded-lg hover:border-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                      style={{ backgroundColor: assignedSpace.color + '20' }}
                    >
                      {assignedSpace.icon}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{assignedSpace.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {projectsForDomain.length} projects
                      </p>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-3">No space assigned</p>
                  <Button variant="outline" size="sm" onClick={() => navigate('/spaces')}>
                    Assign to Space
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cognate Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cognate.industry && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Industry</p>
                  <p className="text-sm text-foreground mt-1">{cognate.industry}</p>
                </div>
              )}
              {cognate.role && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Role</p>
                  <p className="text-sm text-foreground mt-1">{cognate.role}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Created</p>
                <p className="text-sm text-foreground mt-1">
                  {new Date(cognate.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Last Updated</p>
                <p className="text-sm text-foreground mt-1">
                  {new Date(cognate.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              {cognate.tags.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {cognate.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 text-xs bg-card text-muted-foreground rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* View in Ledger Link */}
          <Link
            to="/control/ledger"
            className="flex items-center justify-center gap-2 p-4 bg-surface-base/50 border border-border rounded-lg text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View full audit trail in Ledger
          </Link>
        </div>
      </div>

      {/* Simulation Modal */}
      <SimulationModal
        isOpen={showSimulationModal}
        onClose={() => setShowSimulationModal(false)}
        cognate={cognate}
        sopCount={activeSOPs.length}
      />
    </div>
  );
}

export default CognateDetailPage;
