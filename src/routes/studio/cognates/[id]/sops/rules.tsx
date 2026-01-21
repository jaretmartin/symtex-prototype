/**
 * S1 Rule Viewer Route
 *
 * Displays the S1 (Symtex Script) rules for a specific SOP.
 * Provides a read-only view of the compiled rules with syntax highlighting.
 */

import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Code2,
  Copy,
  Check,
  Download,
  Eye,
  FileCode,
  ChevronRight,
  Pencil,
  Shield,
} from 'lucide-react';
import { useCognateStore } from '@/store';
import { S1Preview } from '@/components/sop';

export function S1RuleViewerRoute(): JSX.Element {
  const { id, sopId } = useParams<{ id: string; sopId: string }>();
  const navigate = useNavigate();
  const { cognates, sops } = useCognateStore();
  const [copied, setCopied] = useState(false);
  const [selectedRuleIndex, setSelectedRuleIndex] = useState<number | null>(null);

  const cognate = cognates.find((c) => c.id === id);
  const sop = sops.find((s) => s.id === sopId);

  // Generate S1 script from rules
  const s1Script = useMemo(() => {
    if (!sop?.rules) return '';

    const lines: string[] = [
      `// S1 Script for SOP: ${sop.name}`,
      `// Version: ${sop.version || '1.0.0'}`,
      `// Generated: ${new Date().toISOString()}`,
      '',
      `@sop "${sop.name}" {`,
      `  description: "${sop.description || ''}"`,
      `  priority: ${sop.priority || 'medium'}`,
      `  status: ${sop.status}`,
      '}',
      '',
    ];

    sop.rules.forEach((rule, index) => {
      lines.push(`@rule "${rule.name || `Rule ${index + 1}`}" {`);
      if (rule.conditions && rule.conditions.length > 0) {
        lines.push(`  when: ${JSON.stringify(rule.conditions)}`);
      }
      if (rule.thenActions && rule.thenActions.length > 0) {
        lines.push(`  then: ${JSON.stringify(rule.thenActions)}`);
      }
      if (rule.order !== undefined) {
        lines.push(`  priority: ${rule.order}`);
      }
      lines.push('}');
      lines.push('');
    });

    return lines.join('\n');
  }, [sop]);

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

  if (!sop) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-medium text-foreground mb-2">SOP Not Found</h2>
        <p className="text-muted-foreground mb-4">The requested SOP does not exist.</p>
        <Link
          to={`/studio/cognates/${id}/sops`}
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to SOPs
        </Link>
      </div>
    );
  }

  const handleCopy = async (): Promise<void> => {
    await navigator.clipboard.writeText(s1Script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (): void => {
    const blob = new Blob([s1Script], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sop.name.toLowerCase().replace(/\s+/g, '-')}.s1`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border bg-surface-base/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to={`/studio/cognates/${id}/sops`}
              className="p-2 hover:bg-card rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </Link>
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Link to="/studio/cognates" className="hover:text-foreground transition-colors">
                  Cognates
                </Link>
                <ChevronRight className="w-4 h-4" />
                <Link
                  to={`/studio/cognates/${id}/sops`}
                  className="hover:text-foreground transition-colors"
                >
                  {cognate.name}
                </Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-foreground">{sop.name}</span>
              </div>
              <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Code2 className="w-5 h-5 text-blue-400" />
                S1 Rule Viewer
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate(`/studio/cognates/${id}/sops/${sopId}/validate`)}
              className="flex items-center gap-2 px-3 py-2 border border-border text-muted-foreground rounded-lg hover:bg-card transition-colors"
            >
              <Shield className="w-4 h-4" />
              Validate
            </button>
            <button
              type="button"
              onClick={() => navigate(`/studio/cognates/${id}/sops/${sopId}/edit`)}
              className="flex items-center gap-2 px-3 py-2 border border-border text-muted-foreground rounded-lg hover:bg-card transition-colors"
            >
              <Pencil className="w-4 h-4" />
              Edit SOP
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-2 border border-border text-muted-foreground rounded-lg hover:bg-card transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-foreground rounded-lg hover:bg-blue-500 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download .s1
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Rules sidebar */}
        <div className="w-64 border-r border-border bg-surface-base/30 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Rules ({sop.rules?.length || 0})
            </h2>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setSelectedRuleIndex(null)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors ${
                  selectedRuleIndex === null
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-muted-foreground hover:bg-card'
                }`}
              >
                <FileCode className="w-4 h-4" />
                <span className="text-sm">Full Script</span>
              </button>
              {sop.rules?.map((rule, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedRuleIndex(index)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors ${
                    selectedRuleIndex === index
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  <span className="text-sm truncate">{rule.name || `Rule ${index + 1}`}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* S1 Preview */}
        <div className="flex-1 overflow-auto">
          <S1Preview
            rules={sop.rules}
            sopName={sop.name}
          />
        </div>
      </div>
    </div>
  );
}

export default S1RuleViewerRoute;
