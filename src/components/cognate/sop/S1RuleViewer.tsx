/**
 * S1 Rule Viewer Component
 *
 * Displays compiled S1 (Symtex Script) rules for a Cognate with syntax highlighting.
 * Features:
 * - Expandable rule cards with S1 code preview
 * - Syntax highlighting for S1 keywords, operators, functions, and namespaces
 * - Copy/export functionality
 * - Filtering by search and status
 * - Stats overview panel
 *
 * @module components/cognate/sop/S1RuleViewer
 */

import React, { useState, useMemo, useCallback } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Code,
  Search,
  Copy,
  Download,
  Zap,
  ChevronDown,
  ChevronRight,
  FileText,
  Play,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
} from 'lucide-react';
import clsx from 'clsx';
import DOMPurify from 'dompurify';
import type { SOP, SOPStatus } from '@/types';

// =============================================================================
// S1 Syntax Token Configuration
// =============================================================================
// NOTE: These tokens align with S1_SYNTAX_TOKENS from @symtex/types.
// When @symtex/types is linked as a dependency, import from there instead.

/**
 * S1 syntax tokens for syntax highlighting.
 * Defines the language constructs for Symtex Script (S1).
 * Matches the shared definition in @symtex/types for consistency.
 */
export const S1_SYNTAX_TOKENS = {
  /** Reserved keywords and control flow */
  keywords: [
    'RULE',
    'TRIGGER',
    'WHEN',
    'THEN',
    'ELSE',
    'END',
    'PRIORITY',
    'AND',
    'OR',
    'NOT',
    'IF',
    'ELIF',
    'IN',
    'true',
    'false',
    'null',
  ],
  /** Comparison and logical operators */
  operators: ['==', '!=', '>', '<', '>=', '<=', '~=', '??', '&&', '||', '!~=', '!??', ':'],
  /** Built-in function names */
  functions: [
    'respond',
    'escalate',
    'log',
    'notify',
    'execute',
    'wait',
    'branch',
    'set',
    'get',
    'send',
    'create',
    'update',
    'delete',
    'flag',
    'block',
    'allow',
    'schedule',
    'check',
    'apply',
    'include',
    'add',
    'remove',
  ],
  /** Data context namespaces */
  namespaces: [
    'message',
    'context',
    'user',
    'session',
    'system',
    'tone',
    'escalation',
    'response',
    'notification',
    'data',
    'alert',
    'customer',
    'sentiment',
    'issue',
    'action',
    'security',
    'compliance',
    'content',
    'api',
    'refund',
    'email',
    'calendar',
  ],
} as const;

/** Type representing the S1 syntax token categories */
export type S1TokenCategory = keyof typeof S1_SYNTAX_TOKENS;

// =============================================================================
// Syntax Highlighter Component
// =============================================================================

interface S1SyntaxHighlightProps {
  /** The S1 code to highlight */
  code: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Renders S1 code with syntax highlighting
 *
 * Applies color highlighting for:
 * - Keywords (purple)
 * - Operators (cyan)
 * - Functions (yellow)
 * - Namespaces (blue)
 * - Strings (green)
 * - Numbers (orange)
 * - Comments (gray)
 *
 * @param props - Component props
 * @returns JSX element with highlighted code
 */
function S1SyntaxHighlight({ code, className }: S1SyntaxHighlightProps): JSX.Element {
  const highlightedHtml = useMemo(() => {
    let highlighted = code;

    // Escape HTML entities first to prevent XSS
    highlighted = highlighted
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Apply syntax highlighting for keywords
    S1_SYNTAX_TOKENS.keywords.forEach((keyword) => {
      highlighted = highlighted.replace(
        new RegExp(`\\b(${keyword})\\b`, 'g'),
        '<span class="text-purple-400 font-semibold">$1</span>'
      );
    });

    // Highlight operators (escape regex special characters)
    S1_SYNTAX_TOKENS.operators.forEach((op) => {
      const escaped = op.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      highlighted = highlighted.replace(
        new RegExp(escaped, 'g'),
        `<span class="text-cyan-400">${op}</span>`
      );
    });

    // Highlight functions (match function names followed by opening paren)
    S1_SYNTAX_TOKENS.functions.forEach((fn) => {
      highlighted = highlighted.replace(
        new RegExp(`\\b(${fn})\\(`, 'g'),
        '<span class="text-yellow-400">$1</span>('
      );
    });

    // Highlight namespaces (match namespace followed by dot)
    S1_SYNTAX_TOKENS.namespaces.forEach((ns) => {
      highlighted = highlighted.replace(
        new RegExp(`\\b(${ns})\\.`, 'g'),
        '<span class="text-blue-400">$1</span>.'
      );
    });

    // Highlight strings (double-quoted)
    highlighted = highlighted.replace(
      /"([^"]*)"/g,
      '<span class="text-green-400">"$1"</span>'
    );

    // Highlight numbers
    highlighted = highlighted.replace(
      /\b(\d+)\b/g,
      '<span class="text-orange-400">$1</span>'
    );

    // Highlight comments (lines starting with #)
    highlighted = highlighted.replace(
      /^(#.*)$/gm,
      '<span class="text-muted-foreground">$1</span>'
    );

    return highlighted;
  }, [code]);

  // Sanitize the highlighted HTML to prevent XSS attacks
  const sanitizedHtml = DOMPurify.sanitize(highlightedHtml);

  return (
    <pre
      className={clsx(
        'text-sm font-mono overflow-x-auto whitespace-pre-wrap text-foreground',
        className
      )}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}

// =============================================================================
// Rule Card Component
// =============================================================================

interface RuleCardProps {
  /** The SOP containing the rule data */
  sop: SOP;
  /** Whether the card is expanded to show code */
  isExpanded: boolean;
  /** Callback when card is toggled - receives sopId */
  onToggle: (sopId: string) => void;
  /** Callback when code is copied */
  onCopy: (code: string) => void;
  /** Compiled S1 code for this SOP */
  compiledS1: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Individual rule card with expandable S1 code preview
 *
 * @param props - Component props
 * @returns JSX element for the rule card
 */
const RuleCard = React.memo(function RuleCard({
  sop,
  isExpanded,
  onToggle,
  onCopy,
  compiledS1,
  className,
}: RuleCardProps): JSX.Element {
  const [isActive, setIsActive] = useState(sop.status === 'active');

  const handleToggleActive = useCallback((e: React.MouseEvent): void => {
    e.stopPropagation();
    setIsActive((prev) => !prev);
  }, []);

  const handleCopyClick = useCallback(
    (e: React.MouseEvent): void => {
      e.stopPropagation();
      onCopy(compiledS1);
    },
    [onCopy, compiledS1]
  );

  const handleToggle = useCallback((): void => {
    onToggle(sop.id);
  }, [onToggle, sop.id]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent): void => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleToggle();
      }
    },
    [handleToggle]
  );

  return (
    <div
      className={clsx(
        'border rounded-xl overflow-hidden transition-all',
        isActive ? 'border-border' : 'border-border opacity-60',
        className
      )}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 bg-surface-card/50 cursor-pointer hover:bg-muted transition-colors"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
          <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <Code className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h3 className="font-medium text-sm text-foreground">{sop.name}</h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{sop.rules.length} rules</span>
              <span className="text-border">|</span>
              <span>Priority: {sop.priority}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={clsx(
              'px-2 py-0.5 rounded text-xs font-medium',
              isActive
                ? 'bg-green-500/20 text-green-400'
                : 'bg-muted text-muted-foreground'
            )}
          >
            {isActive ? 'Active' : 'Inactive'}
          </span>
          <button
            type="button"
            onClick={handleToggleActive}
            className={clsx(
              'p-1.5 rounded-lg transition-colors',
              isActive
                ? 'text-green-400 hover:bg-green-500/20'
                : 'text-muted-foreground hover:bg-muted'
            )}
            aria-label={isActive ? 'Deactivate rule' : 'Activate rule'}
          >
            {isActive ? (
              <ToggleRight className="w-5 h-5" />
            ) : (
              <ToggleLeft className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 border-t border-border">
          {/* Description */}
          {sop.description && (
            <p className="text-sm text-muted-foreground mb-4">{sop.description}</p>
          )}

          {/* S1 Code */}
          <div className="bg-surface-base rounded-lg p-4 overflow-x-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground font-medium">S1 Code</span>
              <button
                type="button"
                onClick={handleCopyClick}
                className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
              >
                <Copy className="w-3 h-3" />
                Copy
              </button>
            </div>
            <S1SyntaxHighlight code={compiledS1} />
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              {sop.triggerCount.toLocaleString()} total triggers
            </span>
            {sop.lastTriggeredAt && (
              <span>
                Last triggered: {new Date(sop.lastTriggeredAt).toLocaleDateString()}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
            <Link
              to={`/cognates/${sop.cognateId}/sops/${sop.id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-foreground bg-card hover:bg-muted border border-border rounded-lg transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <FileText className="w-3 h-3" />
              Edit SOP
            </Link>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-foreground bg-card hover:bg-muted border border-border rounded-lg transition-colors"
            >
              <Play className="w-3 h-3" />
              Test Rule
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

// =============================================================================
// Stats Panel Component
// =============================================================================

interface RuleStats {
  totalRules: number;
  activeRules: number;
  totalTriggers: number;
}

interface StatsPanelProps {
  stats: RuleStats;
  className?: string;
}

/**
 * Stats overview panel displaying rule metrics
 *
 * @param props - Component props
 * @returns JSX element for the stats panel
 */
function StatsPanel({ stats, className }: StatsPanelProps): JSX.Element {
  return (
    <div className={clsx('grid grid-cols-3 gap-4', className)}>
      <div className="p-4 bg-surface-base/50 border border-border rounded-lg">
        <p className="text-sm text-muted-foreground mb-1">Total Rules</p>
        <p className="text-2xl font-bold text-foreground">{stats.totalRules}</p>
      </div>
      <div className="p-4 bg-surface-base/50 border border-border rounded-lg">
        <p className="text-sm text-muted-foreground mb-1">Active Rules</p>
        <p className="text-2xl font-bold text-green-400">{stats.activeRules}</p>
      </div>
      <div className="p-4 bg-surface-base/50 border border-border rounded-lg">
        <p className="text-sm text-muted-foreground mb-1">Total Triggers</p>
        <p className="text-2xl font-bold text-foreground">
          {stats.totalTriggers.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

// =============================================================================
// Main Component Props and Types
// =============================================================================

export interface S1RuleViewerProps {
  /** SOPs to display */
  sops: SOP[];
  /** Callback for toast notifications */
  onToast?: (type: 'success' | 'error', message: string) => void;
  /** Additional CSS classes */
  className?: string;
}

type StatusFilterValue = 'all' | SOPStatus;

// =============================================================================
// Main S1 Rule Viewer Component
// =============================================================================

/**
 * S1 Rule Viewer - Main component for viewing compiled S1 rules
 *
 * Displays all SOPs for a Cognate with their compiled S1 code,
 * supporting search, filtering, and bulk export.
 *
 * @example
 * ```tsx
 * <S1RuleViewer
 *   sops={cognateSOPs}
 *   onToast={(type, msg) => toast[type](msg)}
 * />
 * ```
 *
 * @param props - Component props
 * @returns JSX element for the rule viewer
 */
export function S1RuleViewer({
  sops,
  onToast,
  className,
}: S1RuleViewerProps): JSX.Element {
  const { id: cogId } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const highlightedSopId = searchParams.get('sop');

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>('all');
  const [expandedSops, setExpandedSops] = useState<string[]>(
    highlightedSopId ? [highlightedSopId] : []
  );

  /**
   * Compiles an SOP's rules to S1 syntax
   */
  const compileSOPToS1 = useCallback((sop: SOP): string => {
    const lines: string[] = [];
    lines.push(`# SOP: ${sop.name}`);
    lines.push(`# Version: ${sop.version}`);
    lines.push(`# Priority: ${sop.priority}`);
    lines.push('');

    sop.rules.forEach((rule) => {
      if (!rule.enabled) return;

      lines.push(`# Rule: ${rule.name}`);
      if (rule.description) {
        lines.push(`# ${rule.description}`);
      }
      lines.push('');
      lines.push(`TRIGGER ${rule.trigger.type}`);

      if (rule.conditions.length > 0) {
        lines.push('WHEN');
        rule.conditions.forEach((condition, index) => {
          const prefix = index === 0 ? '  ' : '  AND ';
          const operators: Record<string, string> = {
            equals: '==',
            not_equals: '!=',
            contains: '~=',
            not_contains: '!~=',
            greater_than: '>',
            less_than: '<',
            matches: '~=',
            exists: '??',
            not_exists: '!??',
          };
          const op = operators[condition.operator] || '==';

          if (condition.operator === 'exists' || condition.operator === 'not_exists') {
            lines.push(`${prefix}${condition.field} ${op}`);
          } else {
            const value = isNaN(Number(condition.value))
              ? `"${condition.value}"`
              : condition.value;
            lines.push(`${prefix}${condition.field} ${op} ${value}`);
          }
        });
      }

      lines.push('THEN');
      if (rule.thenActions.length === 0) {
        lines.push('    # No actions defined');
      } else {
        rule.thenActions.forEach((action) => {
          const configStr =
            Object.keys(action.config).length > 0
              ? `(${Object.entries(action.config)
                  .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
                  .join(', ')})`
              : '()';
          lines.push(`    ${action.type}${configStr}`);
        });
      }

      if (rule.elseActions && rule.elseActions.length > 0) {
        lines.push('ELSE');
        rule.elseActions.forEach((action) => {
          const configStr =
            Object.keys(action.config).length > 0
              ? `(${Object.entries(action.config)
                  .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
                  .join(', ')})`
              : '()';
          lines.push(`    ${action.type}${configStr}`);
        });
      }

      lines.push('END');
      lines.push('');
    });

    return lines.join('\n');
  }, []);

  // Memoize compiled S1 for each SOP
  const compiledS1Map = useMemo(() => {
    const map = new Map<string, string>();
    sops.forEach((sop) => {
      map.set(sop.id, compileSOPToS1(sop));
    });
    return map;
  }, [sops, compileSOPToS1]);

  // Filter SOPs based on search and status
  const filteredSops = useMemo(() => {
    return sops.filter((sop) => {
      const compiledS1 = compiledS1Map.get(sop.id) || '';
      const matchesSearch =
        sop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        compiledS1.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || sop.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [sops, searchTerm, statusFilter, compiledS1Map]);

  // Calculate stats
  const stats = useMemo<RuleStats>(
    () => ({
      totalRules: filteredSops.reduce((acc, sop) => acc + sop.rules.length, 0),
      activeRules: filteredSops
        .filter((s) => s.status === 'active')
        .reduce((acc, sop) => acc + sop.rules.filter((r) => r.enabled).length, 0),
      totalTriggers: filteredSops.reduce((acc, sop) => acc + sop.triggerCount, 0),
    }),
    [filteredSops]
  );

  const handleToggleExpand = useCallback((sopId: string): void => {
    setExpandedSops((prev) =>
      prev.includes(sopId)
        ? prev.filter((id) => id !== sopId)
        : [...prev, sopId]
    );
  }, []);

  const handleExpandAll = useCallback((): void => {
    setExpandedSops(filteredSops.map((s) => s.id));
  }, [filteredSops]);

  const handleCollapseAll = useCallback((): void => {
    setExpandedSops([]);
  }, []);

  const handleCopyCode = useCallback(
    (code: string): void => {
      navigator.clipboard.writeText(code).then(() => {
        onToast?.('success', 'S1 code copied to clipboard');
      }).catch(() => {
        onToast?.('error', 'Failed to copy code');
      });
    },
    [onToast]
  );

  const handleExportAll = useCallback((): void => {
    const allCode = filteredSops
      .filter((s) => s.status === 'active')
      .map((s) => compiledS1Map.get(s.id) || '')
      .join('\n\n---\n\n');

    const blob = new Blob([allCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cognate-${cogId}-rules.s1`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onToast?.('success', 'Rules exported successfully');
  }, [filteredSops, compiledS1Map, cogId, onToast]);

  return (
    <div className={clsx('flex flex-col h-full', className)}>
      {/* Header */}
      <Link
        to={`/cognates/${cogId}/sops`}
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to SOPs
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Code className="w-7 h-7 text-purple-400" />
            S1 Rule Viewer
          </h1>
          <p className="text-muted-foreground mt-1">
            View and manage compiled S1 rules for this Cognate
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportAll}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-purple-600 text-foreground rounded-lg hover:bg-purple-500 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export All Rules
        </button>
      </div>

      {/* Stats */}
      <StatsPanel stats={stats} className="mb-6" />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex-1 min-w-[200px] max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search rules or S1 code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 pl-10 text-sm bg-surface-base border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-purple-500 focus:outline-none transition-colors"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilterValue)}
          className="px-3 py-2 text-sm bg-surface-base border border-border rounded-lg text-foreground focus:border-purple-500 focus:outline-none transition-colors"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>

        <div className="flex items-center gap-2 ml-auto">
          <button
            type="button"
            onClick={handleExpandAll}
            className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
          >
            Expand All
          </button>
          <span className="text-muted-foreground">|</span>
          <button
            type="button"
            onClick={handleCollapseAll}
            className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Rules List */}
      <div className="flex-1 overflow-auto space-y-3">
        {filteredSops.length > 0 ? (
          filteredSops.map((sop) => (
            <RuleCard
              key={sop.id}
              sop={sop}
              compiledS1={compiledS1Map.get(sop.id) || ''}
              isExpanded={expandedSops.includes(sop.id)}
              onToggle={handleToggleExpand}
              onCopy={handleCopyCode}
            />
          ))
        ) : (
          <div className="p-12 text-center border border-border rounded-lg">
            <Code className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No Rules Found
            </h3>
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Create SOPs to generate S1 rules'}
            </p>
          </div>
        )}
      </div>

      {/* Info Banner */}
      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-300 mb-1">About S1 Rules</h4>
            <p className="text-sm text-blue-400/80">
              S1 (Symtex Script) rules provide deterministic behavior control for your
              Cognates. They are compiled from natural language SOPs and execute with
              predictable outcomes. Rules are evaluated by priority (higher first) and
              the first matching rule wins.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(S1RuleViewer);
