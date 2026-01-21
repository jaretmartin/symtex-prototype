/**
 * S1 Preview Component
 *
 * Displays compiled S1 syntax (Symtex Script) with syntax highlighting.
 * Allows copying and downloading the generated code.
 */

import { useState } from 'react';
import {
  Copy,
  Check,
  Download,
  Maximize2,
  Minimize2,
  AlertTriangle,
  XCircle,
} from 'lucide-react';
import type { SOPRule, SOPCondition, SOPAction } from '@/types';

export interface S1PreviewProps {
  rules: SOPRule[];
  sopName?: string;
  sopVersion?: string;
  errors?: string[];
  warnings?: string[];
  className?: string;
}

// S1 Syntax tokens for highlighting
const S1_SYNTAX_TOKENS = {
  keywords: ['TRIGGER', 'WHEN', 'THEN', 'ELSE', 'END', 'AND', 'OR', 'NOT', 'IF', 'ELIF'],
  operators: ['==', '!=', '>', '<', '>=', '<=', '~=', '??', '&&', '||'],
  functions: ['respond', 'escalate', 'log', 'notify', 'execute', 'wait', 'branch'],
  namespaces: ['message', 'context', 'user', 'session', 'system'],
};

function compileCondition(condition: SOPCondition): string {
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
    return `${condition.field} ${op}`;
  }

  const value = isNaN(Number(condition.value)) ? `"${condition.value}"` : condition.value;
  return `${condition.field} ${op} ${value}`;
}

function compileAction(action: SOPAction): string {
  const configStr = Object.keys(action.config).length > 0
    ? `(${Object.entries(action.config).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join(', ')})`
    : '()';

  return `    ${action.type}${configStr}`;
}

function compileRuleToS1(rule: SOPRule): string[] {
  const lines: string[] = [];

  // Rule header
  lines.push(`# Rule: ${rule.name}`);
  if (rule.description) {
    lines.push(`# ${rule.description}`);
  }
  lines.push('');

  // Trigger
  lines.push(`TRIGGER ${rule.trigger.type}`);

  // Conditions
  if (rule.conditions.length > 0) {
    lines.push('WHEN');
    rule.conditions.forEach((condition, index) => {
      const prefix = index === 0 ? '  ' : '  AND ';
      lines.push(`${prefix}${compileCondition(condition)}`);
    });
  }

  // Then actions
  lines.push('THEN');
  if (rule.thenActions.length === 0) {
    lines.push('    # No actions defined');
  } else {
    rule.thenActions.forEach((action) => {
      lines.push(compileAction(action));
    });
  }

  // Else actions
  if (rule.elseActions && rule.elseActions.length > 0) {
    lines.push('ELSE');
    rule.elseActions.forEach((action) => {
      lines.push(compileAction(action));
    });
  }

  lines.push('END');
  lines.push('');

  return lines;
}

function highlightSyntax(line: string): JSX.Element {
  // Check for comments
  if (line.trim().startsWith('#')) {
    return <span className="text-muted-foreground">{line}</span>;
  }

  // Split by spaces and operators while preserving them
  const tokens = line.split(/(\s+|==|!=|>=|<=|>|<|~=|\?\?|&&|\|\||\(|\)|,|:)/);

  return (
    <>
      {tokens.map((token, index) => {
        // Check token type
        if (S1_SYNTAX_TOKENS.keywords.includes(token)) {
          return <span key={index} className="text-purple-400 font-medium">{token}</span>;
        }
        if (S1_SYNTAX_TOKENS.operators.includes(token)) {
          return <span key={index} className="text-yellow-400">{token}</span>;
        }
        if (S1_SYNTAX_TOKENS.functions.includes(token)) {
          return <span key={index} className="text-blue-400">{token}</span>;
        }
        if (S1_SYNTAX_TOKENS.namespaces.some((ns) => token.startsWith(ns + '.'))) {
          const [ns, ...rest] = token.split('.');
          return (
            <span key={index}>
              <span className="text-cyan-400">{ns}</span>
              <span className="text-muted-foreground">.</span>
              <span className="text-green-400">{rest.join('.')}</span>
            </span>
          );
        }
        // String literals
        if (token.startsWith('"') && token.endsWith('"')) {
          return <span key={index} className="text-green-400">{token}</span>;
        }
        // Numbers
        if (!isNaN(Number(token)) && token.trim() !== '') {
          return <span key={index} className="text-orange-400">{token}</span>;
        }

        return <span key={index} className="text-muted-foreground">{token}</span>;
      })}
    </>
  );
}

export function S1Preview({
  rules,
  sopName,
  sopVersion,
  errors = [],
  warnings = [],
  className = '',
}: S1PreviewProps): JSX.Element {
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Compile all rules to S1
  const s1Lines: string[] = [];

  // Header
  if (sopName) {
    s1Lines.push(`# SOP: ${sopName}`);
  }
  if (sopVersion) {
    s1Lines.push(`# Version: ${sopVersion}`);
  }
  if (sopName || sopVersion) {
    s1Lines.push(`# Generated: ${new Date().toISOString()}`);
    s1Lines.push('');
  }

  // Compile each rule
  rules.forEach((rule) => {
    if (rule.enabled) {
      s1Lines.push(...compileRuleToS1(rule));
    }
  });

  const s1Code = s1Lines.join('\n');

  const handleCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(s1Code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = (): void => {
    const blob = new Blob([s1Code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sopName || 'sop'}.s1`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={`
        flex flex-col border border-border rounded-lg overflow-hidden
        ${isFullscreen ? 'fixed inset-4 z-50 bg-surface-base' : ''}
        ${className}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-card/80 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">S1 Preview</span>
          <span className="px-1.5 py-0.5 text-xs bg-card text-muted-foreground rounded">
            {rules.filter((r) => r.enabled).length} rules
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
            title="Copy to clipboard"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
            title="Download .s1 file"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Errors/Warnings */}
      {(errors.length > 0 || warnings.length > 0) && (
        <div className="px-4 py-2 border-b border-border space-y-1">
          {errors.map((error, index) => (
            <div key={`error-${index}`} className="flex items-center gap-2 text-sm text-red-400">
              <XCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          ))}
          {warnings.map((warning, index) => (
            <div key={`warning-${index}`} className="flex items-center gap-2 text-sm text-yellow-400">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{warning}</span>
            </div>
          ))}
        </div>
      )}

      {/* Code Preview */}
      <div className="flex-1 overflow-auto bg-surface-base">
        <pre className="p-4 text-sm font-mono leading-relaxed">
          {s1Lines.map((line, index) => (
            <div key={index} className="flex">
              <span className="w-8 text-right pr-3 text-muted-foreground select-none">
                {index + 1}
              </span>
              <code className="flex-1">{highlightSyntax(line)}</code>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}

export default S1Preview;
