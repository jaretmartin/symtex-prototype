/**
 * ExplainPlan Component
 *
 * Shows execution plan details before running an automation:
 * - Systems/services that will be touched
 * - Permissions required
 * - Estimated cost
 * - Budget cap check
 *
 * Part of WF2: Automation -> Plan -> Simulate -> Run -> Review -> Compile
 */

import { useState } from 'react';
import {
  Server,
  Shield,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Play,
  FlaskConical,
  ExternalLink,
  Clock,
  Zap,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Types for execution plan
export interface SystemTouch {
  id: string;
  name: string;
  type: 'crm' | 'email' | 'database' | 'api' | 'file' | 'notification';
  action: 'read' | 'write' | 'delete' | 'execute';
  description: string;
}

export interface Permission {
  id: string;
  scope: string;
  level: 'read' | 'write' | 'admin';
  granted: boolean;
}

export interface CostEstimate {
  apiCalls: number;
  estimatedCost: number;
  budgetCap: number;
  budgetRemaining: number;
  withinBudget: boolean;
}

export interface ExecutionPlan {
  automationId: string;
  automationName: string;
  systems: SystemTouch[];
  permissions: Permission[];
  cost: CostEstimate;
  estimatedDuration: number; // seconds
  riskLevel: 'low' | 'medium' | 'high';
}

interface ExplainPlanProps {
  plan: ExecutionPlan;
  onSimulate: () => void;
  onRun: () => void;
  onCancel: () => void;
  isSimulating?: boolean;
  isRunning?: boolean;
  className?: string;
}

const systemTypeIcons: Record<SystemTouch['type'], React.ReactNode> = {
  crm: <Server className="w-4 h-4" />,
  email: <Zap className="w-4 h-4" />,
  database: <Server className="w-4 h-4" />,
  api: <ExternalLink className="w-4 h-4" />,
  file: <Server className="w-4 h-4" />,
  notification: <Zap className="w-4 h-4" />,
};

const actionColors: Record<SystemTouch['action'], string> = {
  read: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  write: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  delete: 'bg-red-500/10 text-red-400 border-red-500/30',
  execute: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
};

const riskColors: Record<ExecutionPlan['riskLevel'], string> = {
  low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  medium: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  high: 'bg-red-500/10 text-red-400 border-red-500/30',
};

export function ExplainPlan({
  plan,
  onSimulate,
  onRun,
  onCancel,
  isSimulating = false,
  isRunning = false,
  className,
}: ExplainPlanProps): JSX.Element {
  const [showAllPermissions, setShowAllPermissions] = useState(false);
  const visiblePermissions = showAllPermissions
    ? plan.permissions
    : plan.permissions.slice(0, 4);
  const missingPermissions = plan.permissions.filter((p) => !p.granted);
  const canRun = missingPermissions.length === 0 && plan.cost.withinBudget;

  function formatDuration(seconds: number): string {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  }

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  }

  return (
    <Card className={cn('bg-card/50 border-border/50', className)}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Zap className="w-5 h-5 text-symtex-primary" />
              Execution Plan
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Review what this automation will do before running
            </p>
          </div>
          <Badge
            variant="outline"
            className={cn('capitalize', riskColors[plan.riskLevel])}
          >
            {plan.riskLevel} risk
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Systems Touched */}
        <div>
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2 mb-3">
            <Server className="w-4 h-4 text-muted-foreground" />
            Systems Touched
          </h4>
          <div className="space-y-2">
            {plan.systems.map((system) => (
              <div
                key={system.id}
                className="flex items-center justify-between p-3 rounded-lg bg-surface-base/50 border border-border/50"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-muted/50">
                    {systemTypeIcons[system.type]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {system.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {system.description}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={cn('capitalize text-xs', actionColors[system.action])}
                >
                  {system.action}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Permissions Required */}
        <div>
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-muted-foreground" />
            Permissions Required
            {missingPermissions.length > 0 && (
              <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/30 text-xs">
                {missingPermissions.length} missing
              </Badge>
            )}
          </h4>
          <div className="flex flex-wrap gap-2">
            {visiblePermissions.map((permission) => (
              <Badge
                key={permission.id}
                variant="outline"
                className={cn(
                  'text-xs',
                  permission.granted
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-red-500/10 text-red-400 border-red-500/30'
                )}
              >
                {permission.granted ? (
                  <CheckCircle className="w-3 h-3 mr-1" />
                ) : (
                  <AlertTriangle className="w-3 h-3 mr-1" />
                )}
                {permission.scope}:{permission.level}
              </Badge>
            ))}
            {plan.permissions.length > 4 && (
              <button
                onClick={() => setShowAllPermissions(!showAllPermissions)}
                className="text-xs text-symtex-primary hover:text-symtex-primary/80 transition-colors"
              >
                {showAllPermissions
                  ? 'Show less'
                  : `+${plan.permissions.length - 4} more`}
              </button>
            )}
          </div>
        </div>

        {/* Cost Estimate */}
        <div>
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2 mb-3">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            Cost Estimate
          </h4>
          <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-surface-base/50 border border-border/50">
            <div>
              <p className="text-xs text-muted-foreground">Estimated Cost</p>
              <p className="text-lg font-semibold text-foreground">
                {formatCurrency(plan.cost.estimatedCost)}
              </p>
              <p className="text-xs text-muted-foreground">
                {plan.cost.apiCalls} API calls
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Budget Status</p>
              <p
                className={cn(
                  'text-lg font-semibold',
                  plan.cost.withinBudget ? 'text-emerald-400' : 'text-red-400'
                )}
              >
                {formatCurrency(plan.cost.budgetRemaining)}
              </p>
              <p className="text-xs text-muted-foreground">
                remaining of {formatCurrency(plan.cost.budgetCap)}
              </p>
            </div>
          </div>
          {!plan.cost.withinBudget && (
            <div className="flex items-center gap-2 mt-2 p-2 rounded-lg bg-red-500/10 border border-red-500/30">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <p className="text-xs text-red-400">
                Estimated cost exceeds budget cap. Increase budget or modify automation.
              </p>
            </div>
          )}
        </div>

        {/* Estimated Duration */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-surface-base/50 border border-border/50">
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Estimated Duration
            </span>
          </div>
          <span className="text-sm font-medium text-foreground">
            {formatDuration(plan.estimatedDuration)}
          </span>
        </div>
      </CardContent>

      <CardFooter className="flex gap-3 pt-4 border-t border-border/50">
        <Button variant="ghost" onClick={onCancel} disabled={isSimulating || isRunning}>
          Cancel
        </Button>
        <div className="flex-1" />
        <Button
          variant="secondary"
          onClick={onSimulate}
          disabled={isSimulating || isRunning}
          isLoading={isSimulating}
        >
          <FlaskConical className="w-4 h-4" />
          Simulate First
        </Button>
        <Button
          variant="primary"
          onClick={onRun}
          disabled={!canRun || isSimulating || isRunning}
          isLoading={isRunning}
        >
          <Play className="w-4 h-4" />
          Run Now
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ExplainPlan;
