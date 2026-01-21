/**
 * LedgerFilters Component
 *
 * Filter controls for the ledger viewer including:
 * - Date range picker
 * - Category filter
 * - Actor type filter
 * - Severity filter
 * - Search functionality
 */

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Search,
  Filter,
  X,
  Calendar,
  User,
  Bot,
  Server,
  Zap,
  Link2,
  Flag,
  RotateCcw,
} from 'lucide-react';
import type { LedgerFilter, LedgerCategory, LedgerSeverity, ActorType } from '@/types';

interface LedgerFiltersProps {
  filters: LedgerFilter;
  onFiltersChange: (filters: Partial<LedgerFilter>) => void;
  onReset: () => void;
  totalCount: number;
  filteredCount: number;
  className?: string;
}

const categories: { value: LedgerCategory; label: string }[] = [
  { value: 'action', label: 'Action' },
  { value: 'decision', label: 'Decision' },
  { value: 'approval', label: 'Approval' },
  { value: 'escalation', label: 'Escalation' },
  { value: 'error', label: 'Error' },
  { value: 'access', label: 'Access' },
  { value: 'change', label: 'Change' },
  { value: 'creation', label: 'Creation' },
  { value: 'deletion', label: 'Deletion' },
  { value: 'communication', label: 'Communication' },
  { value: 'integration', label: 'Integration' },
  { value: 'system', label: 'System' },
];

const severities: { value: LedgerSeverity; label: string; color: string }[] = [
  { value: 'debug', label: 'Debug', color: 'text-muted-foreground' },
  { value: 'info', label: 'Info', color: 'text-blue-400' },
  { value: 'notice', label: 'Notice', color: 'text-cyan-400' },
  { value: 'warning', label: 'Warning', color: 'text-yellow-400' },
  { value: 'error', label: 'Error', color: 'text-red-400' },
  { value: 'critical', label: 'Critical', color: 'text-red-500' },
];

const actorTypes: { value: ActorType; label: string; icon: typeof User }[] = [
  { value: 'user', label: 'User', icon: User },
  { value: 'cognate', label: 'Cognate', icon: Bot },
  { value: 'system', label: 'System', icon: Server },
  { value: 'automation', label: 'Automation', icon: Zap },
  { value: 'integration', label: 'Integration', icon: Link2 },
];

const dateRangeOptions = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: 'custom', label: 'Custom range' },
];

export function LedgerFilters({
  filters,
  onFiltersChange,
  onReset,
  totalCount,
  filteredCount,
  className,
}: LedgerFiltersProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState('30d');

  const activeFilterCount =
    (filters.category?.length || 0) +
    (filters.severity?.length || 0) +
    (filters.actorType?.length || 0) +
    (filters.flaggedOnly ? 1 : 0) +
    (filters.search ? 1 : 0);

  const handleSearchChange = (value: string) => {
    onFiltersChange({ search: value || undefined });
  };

  const handleCategoryToggle = (category: LedgerCategory) => {
    const current = filters.category || [];
    const updated = current.includes(category)
      ? current.filter((c) => c !== category)
      : [...current, category];
    onFiltersChange({ category: updated.length > 0 ? updated : undefined });
  };

  const handleSeverityToggle = (severity: LedgerSeverity) => {
    const current = filters.severity || [];
    const updated = current.includes(severity)
      ? current.filter((s) => s !== severity)
      : [...current, severity];
    onFiltersChange({ severity: updated.length > 0 ? updated : undefined });
  };

  const handleActorTypeToggle = (actorType: ActorType) => {
    const current = filters.actorType || [];
    const updated = current.includes(actorType)
      ? current.filter((a) => a !== actorType)
      : [...current, actorType];
    onFiltersChange({ actorType: updated.length > 0 ? updated : undefined });
  };

  const handleFlaggedToggle = () => {
    onFiltersChange({ flaggedOnly: !filters.flaggedOnly });
  };

  const handleDateRangeChange = (value: string) => {
    setSelectedDateRange(value);
    const now = new Date();
    let from: Date;

    switch (value) {
      case 'today':
        from = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'yesterday':
        from = new Date(now.setDate(now.getDate() - 1));
        from.setHours(0, 0, 0, 0);
        break;
      case '7d':
        from = new Date(now.setDate(now.getDate() - 7));
        break;
      case '30d':
        from = new Date(now.setDate(now.getDate() - 30));
        break;
      case '90d':
        from = new Date(now.setDate(now.getDate() - 90));
        break;
      default:
        onFiltersChange({ dateRange: undefined });
        return;
    }

    onFiltersChange({ dateRange: { from, to: new Date() } });
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Main Filter Bar */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search entries..."
            value={filters.search || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9 bg-card border-border text-foreground placeholder:text-muted-foreground"
          />
          {filters.search && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-muted"
            >
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Date Range */}
        <Select value={selectedDateRange} onValueChange={handleDateRangeChange}>
          <SelectTrigger className="w-[160px] bg-card border-border">
            <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {dateRangeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Advanced Filters Popover */}
        <Popover open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
          <PopoverTrigger asChild>
            <button
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors',
                activeFilterCount > 0
                  ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
                  : 'border-border bg-card text-muted-foreground hover:border-border'
              )}
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm">Filters</span>
              {activeFilterCount > 0 && (
                <Badge className="ml-1 h-5 min-w-[20px] px-1 bg-indigo-500 text-foreground">
                  {activeFilterCount}
                </Badge>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[400px] p-4 bg-card border-border"
            align="start"
          >
            <div className="space-y-4">
              {/* Actor Types */}
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                  Actor Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {actorTypes.map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => handleActorTypeToggle(value)}
                      className={cn(
                        'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors',
                        filters.actorType?.includes(value)
                          ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                          : 'bg-muted/50 text-muted-foreground border border-border hover:border-border'
                      )}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => handleCategoryToggle(value)}
                      className={cn(
                        'px-2.5 py-1.5 rounded-lg text-xs transition-colors',
                        filters.category?.includes(value)
                          ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                          : 'bg-muted/50 text-muted-foreground border border-border hover:border-border'
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Severity */}
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                  Severity
                </label>
                <div className="flex flex-wrap gap-2">
                  {severities.map(({ value, label, color }) => (
                    <button
                      key={value}
                      onClick={() => handleSeverityToggle(value)}
                      className={cn(
                        'px-2.5 py-1.5 rounded-lg text-xs transition-colors',
                        filters.severity?.includes(value)
                          ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                          : 'bg-muted/50 border border-border hover:border-border',
                        !filters.severity?.includes(value) && color
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Flagged Only */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="flex items-center gap-2">
                  <Flag className="w-4 h-4 text-amber-400" />
                  <span className="text-sm text-muted-foreground">Flagged entries only</span>
                </div>
                <button
                  onClick={handleFlaggedToggle}
                  className={cn(
                    'relative w-10 h-5 rounded-full transition-colors',
                    filters.flaggedOnly ? 'bg-indigo-500' : 'bg-muted'
                  )}
                >
                  <span
                    className={cn(
                      'absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform',
                      filters.flaggedOnly ? 'translate-x-5' : 'translate-x-0.5'
                    )}
                  />
                </button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Reset Filters */}
        {activeFilterCount > 0 && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        )}
      </div>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground">Active filters:</span>

          {filters.actorType?.map((type) => (
            <Badge
              key={type}
              variant="outline"
              className="text-xs border-indigo-500/30 text-indigo-400 bg-indigo-500/10 gap-1"
            >
              {type}
              <button
                onClick={() => handleActorTypeToggle(type)}
                className="ml-0.5 hover:text-foreground"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}

          {filters.category?.map((cat) => (
            <Badge
              key={cat}
              variant="outline"
              className="text-xs border-indigo-500/30 text-indigo-400 bg-indigo-500/10 gap-1"
            >
              {cat}
              <button
                onClick={() => handleCategoryToggle(cat)}
                className="ml-0.5 hover:text-foreground"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}

          {filters.severity?.map((sev) => (
            <Badge
              key={sev}
              variant="outline"
              className="text-xs border-indigo-500/30 text-indigo-400 bg-indigo-500/10 gap-1"
            >
              {sev}
              <button
                onClick={() => handleSeverityToggle(sev)}
                className="ml-0.5 hover:text-foreground"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}

          {filters.flaggedOnly && (
            <Badge
              variant="outline"
              className="text-xs border-amber-500/30 text-amber-400 bg-amber-500/10 gap-1"
            >
              Flagged
              <button onClick={handleFlaggedToggle} className="ml-0.5 hover:text-foreground">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}

          {/* Results Count */}
          <span className="text-xs text-muted-foreground ml-auto">
            Showing {filteredCount} of {totalCount} entries
          </span>
        </div>
      )}
    </div>
  );
}

export default LedgerFilters;
