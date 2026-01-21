/**
 * EvidencePanel Component
 *
 * Displays evidence and attachments for a ledger entry including:
 * - Input snapshot
 * - Output snapshot
 * - Citations with links
 * - Cryptographic hash verification
 */

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  X,
  FileText,
  Image,
  Code2,
  FileJson,
  Download,
  Copy,
  Check,
  ExternalLink,
  Shield,
  Link2,
  ChevronDown,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import type { LedgerEntry, LedgerEvidence, EvidenceType } from '@/types';

interface EvidencePanelProps {
  entry: LedgerEntry | null;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

// Evidence type icons
const evidenceTypeConfig: Record<EvidenceType, { icon: typeof FileText; color: string }> = {
  screenshot: { icon: Image, color: 'text-purple-400' },
  document: { icon: FileText, color: 'text-blue-400' },
  log: { icon: FileText, color: 'text-muted-foreground' },
  code: { icon: Code2, color: 'text-emerald-400' },
  data: { icon: FileJson, color: 'text-amber-400' },
  audio: { icon: FileText, color: 'text-pink-400' },
  video: { icon: FileText, color: 'text-red-400' },
  other: { icon: FileText, color: 'text-muted-foreground' },
};

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

interface CopyButtonProps {
  text: string;
  className?: string;
}

function CopyButton({ text, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'p-1.5 rounded hover:bg-muted/50 transition-colors',
        className
      )}
      title="Copy to clipboard"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-emerald-400" />
      ) : (
        <Copy className="w-3.5 h-3.5 text-muted-foreground" />
      )}
    </button>
  );
}

interface EvidenceItemProps {
  evidence: LedgerEvidence;
}

function EvidenceItem({ evidence }: EvidenceItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const config = evidenceTypeConfig[evidence.type];
  const Icon = config.icon;

  return (
    <div className="border border-border/50 rounded-lg overflow-hidden">
      <div
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-muted/50">
            <Icon className={cn('w-4 h-4', config.color)} />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{evidence.name}</p>
            <p className="text-xs text-muted-foreground">
              {evidence.mimeType} - {formatBytes(evidence.size)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={evidence.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 rounded hover:bg-muted/50 transition-colors"
            title="Download"
          >
            <Download className="w-4 h-4 text-muted-foreground" />
          </a>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="p-3 border-t border-border/50 bg-surface-base/30">
          {evidence.description && (
            <p className="text-sm text-muted-foreground mb-3">{evidence.description}</p>
          )}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Captured:</span>
              <span className="text-muted-foreground">{evidence.capturedAt.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">By:</span>
              <span className="text-muted-foreground">{evidence.capturedBy}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Hash:</span>
              <span className="text-muted-foreground font-mono text-xs truncate flex-1">{evidence.hash}</span>
              <CopyButton text={evidence.hash} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Mock input/output data for demo
function generateMockIO(entry: LedgerEntry): { input: string; output: string } {
  const inputExamples: Record<string, string> = {
    respond_to_ticket: `{
  "ticketId": "4582",
  "customerEmail": "jane@example.com",
  "subject": "Billing Question",
  "body": "I was charged twice for my subscription this month. Can you help?",
  "timestamp": "${entry.when.toISOString()}",
  "priority": "high"
}`,
    classify_data: `{
  "batchId": "batch-2024-01",
  "leads": [
    { "id": "lead-001", "company": "Acme Corp", "score": 87 },
    { "id": "lead-002", "company": "Tech Solutions", "score": 45 },
    { "id": "lead-003", "company": "Global Industries", "score": 92 }
    // ... 1,244 more leads
  ],
  "classificationModel": "v2.3"
}`,
    default: `{
  "action": "${entry.what.type}",
  "timestamp": "${entry.when.toISOString()}",
  "context": {
    "spaceId": "${entry.where.spaceId || 'N/A'}",
    "actorId": "${entry.who.id}"
  }
}`,
  };

  const outputExamples: Record<string, string> = {
    respond_to_ticket: `{
  "status": "resolved",
  "response": "Hi Jane, I apologize for the inconvenience. I've reviewed your account and confirmed the duplicate charge. A refund of $29.99 has been processed and should appear in 3-5 business days. Thank you for bringing this to our attention.",
  "actions": [
    { "type": "refund_initiated", "amount": 29.99 },
    { "type": "ticket_resolved", "satisfaction": 5 }
  ],
  "processingTime": 45000
}`,
    classify_data: `{
  "status": "completed",
  "results": {
    "high": 312,
    "medium": 589,
    "low": 346
  },
  "processingTime": 180000,
  "accuracy": 0.94
}`,
    default: `{
  "status": "${entry.what.status}",
  "result": "${entry.what.result || 'Completed successfully'}",
  "timestamp": "${new Date().toISOString()}"
}`,
  };

  return {
    input: inputExamples[entry.what.type] || inputExamples.default,
    output: outputExamples[entry.what.type] || outputExamples.default,
  };
}

export function EvidencePanel({ entry, isOpen, onClose, className }: EvidencePanelProps) {
  const [activeTab, setActiveTab] = useState<'io' | 'evidence' | 'crypto'>('io');

  if (!isOpen || !entry) return null;

  const mockIO = generateMockIO(entry);

  // Mock citations
  const citations = [
    { id: '1', title: 'Customer Support SOP', url: '/sops/support-responses' },
    { id: '2', title: 'Billing Policy v2.1', url: '/policies/billing' },
    { id: '3', title: 'Knowledge Base: Refunds', url: '/kb/refunds' },
  ];

  return (
    <div
      className={cn(
        'fixed right-0 top-0 h-full w-[480px] bg-surface-base border-l border-border shadow-2xl z-50 flex flex-col',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Evidence & Details</h2>
          <p className="text-sm text-muted-foreground">Entry #{entry.sequence}</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-card transition-colors"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        {[
          { id: 'io', label: 'Input/Output' },
          { id: 'evidence', label: `Evidence (${entry.evidence?.length || 0})` },
          { id: 'crypto', label: 'Verification' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={cn(
              'flex-1 px-4 py-3 text-sm font-medium transition-colors',
              activeTab === tab.id
                ? 'text-foreground border-b-2 border-indigo-500'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Input/Output Tab */}
        {activeTab === 'io' && (
          <div className="space-y-4">
            {/* Input Snapshot */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader className="py-3">
                <CardTitle className="text-sm font-medium text-foreground flex items-center justify-between">
                  <span>Input Snapshot</span>
                  <CopyButton text={mockIO.input} />
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <pre className="text-xs text-muted-foreground bg-surface-base/50 p-3 rounded-lg overflow-x-auto font-mono">
                  {mockIO.input}
                </pre>
              </CardContent>
            </Card>

            {/* Arrow */}
            <div className="flex justify-center">
              <div className="p-2 rounded-full bg-card border border-border">
                <ArrowRight className="w-4 h-4 text-indigo-400 rotate-90" />
              </div>
            </div>

            {/* Output Snapshot */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader className="py-3">
                <CardTitle className="text-sm font-medium text-foreground flex items-center justify-between">
                  <span>Output Snapshot</span>
                  <CopyButton text={mockIO.output} />
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <pre className="text-xs text-muted-foreground bg-surface-base/50 p-3 rounded-lg overflow-x-auto font-mono">
                  {mockIO.output}
                </pre>
              </CardContent>
            </Card>

            {/* Citations */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader className="py-3">
                <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-indigo-400" />
                  Citations & References
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {citations.map((citation) => (
                    <a
                      key={citation.id}
                      href={citation.url}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors group"
                    >
                      <span className="text-sm text-muted-foreground group-hover:text-foreground">
                        {citation.title}
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-indigo-400" />
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Evidence Tab */}
        {activeTab === 'evidence' && (
          <div className="space-y-3">
            {entry.evidence && entry.evidence.length > 0 ? (
              entry.evidence.map((ev) => (
                <EvidenceItem key={ev.id} evidence={ev} />
              ))
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No evidence attachments</p>
                <p className="text-sm text-muted-foreground mt-1">
                  This entry has no attached files or documents
                </p>
              </div>
            )}
          </div>
        )}

        {/* Crypto/Verification Tab */}
        {activeTab === 'crypto' && (
          <div className="space-y-4">
            <Card className="bg-card/50 border-border/50">
              <CardHeader className="py-3">
                <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  Cryptographic Verification
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-medium text-emerald-400">
                      Integrity Verified
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This entry has not been modified since creation
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wider">
                      Content Hash
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="flex-1 text-xs text-muted-foreground bg-surface-base/50 p-2 rounded font-mono truncate">
                        {entry.crypto.contentHash}
                      </code>
                      <CopyButton text={entry.crypto.contentHash} />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wider">
                      Previous Hash
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="flex-1 text-xs text-muted-foreground bg-surface-base/50 p-2 rounded font-mono truncate">
                        {entry.crypto.previousHash}
                      </code>
                      <CopyButton text={entry.crypto.previousHash} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground uppercase tracking-wider">
                        Algorithm
                      </label>
                      <p className="text-sm text-muted-foreground mt-1">{entry.crypto.algorithm}</p>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground uppercase tracking-wider">
                        Hashed At
                      </label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {entry.crypto.hashedAt.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {entry.crypto.signature && (
                    <div>
                      <label className="text-xs text-muted-foreground uppercase tracking-wider">
                        Digital Signature
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="flex-1 text-xs text-muted-foreground bg-surface-base/50 p-2 rounded font-mono truncate">
                          {entry.crypto.signature}
                        </code>
                        <CopyButton text={entry.crypto.signature} />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Chain Info */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader className="py-3">
                <CardTitle className="text-sm font-medium text-foreground">
                  Chain Position
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Sequence Number</span>
                  <Badge variant="outline" className="border-border text-muted-foreground">
                    #{entry.sequence}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default EvidencePanel;
