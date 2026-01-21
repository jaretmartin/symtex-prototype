/**
 * SymbiosMessage Component
 *
 * Displays a single message in the Symbios chat interface.
 * Supports user and assistant roles, routing indicators, citations,
 * attachments, and approval workflows.
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import {
  User,
  Sparkles,
  ExternalLink,
  FileText,
  Image,
  Code,
  Link2,
  Check,
  X,
  Copy,
  CheckCircle2,
  AlertCircle,
  Clock,
  ScrollText,
} from 'lucide-react';
import { useCognateEvents } from '@/hooks';
import { cn } from '@/lib/utils';
import { SymbiosRoutingIndicator } from './SymbiosRoutingIndicator';
import type { SymbiosMessage as SymbiosMessageType, SymbiosCitation, SymbiosAttachment } from './symbios-store';

interface SymbiosMessageProps {
  message: SymbiosMessageType;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  className?: string;
}

export function SymbiosMessage({
  message,
  onApprove,
  onReject,
  className,
}: SymbiosMessageProps): JSX.Element {
  const [isCopied, setIsCopied] = useState(false);
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  // Handle copy to clipboard
  const handleCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(message.content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  // Format timestamp
  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // System messages
  if (isSystem) {
    return (
      <div className={cn('flex justify-center py-2', className)}>
        <div className="px-3 py-1 text-xs text-muted-foreground bg-card/50 rounded-full">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex gap-3 py-3 px-4 group',
        isUser ? 'flex-row-reverse' : '',
        className
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center',
          isUser
            ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
            : 'bg-gradient-to-br from-emerald-500 to-teal-600'
        )}
      >
        {isUser ? (
          <User className="w-4 h-4 text-foreground" />
        ) : (
          <Sparkles className="w-4 h-4 text-foreground" />
        )}
      </div>

      {/* Message content */}
      <div className={cn('flex-1 min-w-0', isUser ? 'items-end' : '')}>
        {/* Header */}
        <div
          className={cn(
            'flex items-center gap-2 mb-1',
            isUser ? 'flex-row-reverse' : ''
          )}
        >
          <span className="text-sm font-medium text-foreground">
            {isUser ? 'You' : message.cognateName || 'Aria'}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatTime(message.createdAt)}
          </span>
          {message.status === 'pending' && (
            <Clock className="w-3 h-3 text-muted-foreground" />
          )}
          {message.status === 'error' && (
            <AlertCircle className="w-3 h-3 text-red-500" />
          )}
        </div>

        {/* Message bubble */}
        <div
          className={cn(
            'rounded-xl px-4 py-2.5 max-w-[85%]',
            isUser
              ? 'bg-indigo-600 text-foreground ml-auto'
              : 'bg-card text-foreground border border-border'
          )}
        >
          {/* Content with markdown-like formatting */}
          <div className="text-sm whitespace-pre-wrap break-words">
            <MessageContent content={message.content} />
          </div>

          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 pt-2 border-t border-border/50">
              <AttachmentList attachments={message.attachments} />
            </div>
          )}
        </div>

        {/* Routing indicator (assistant only) */}
        {!isUser && message.routing && (
          <div className="mt-2">
            <SymbiosRoutingIndicator routing={message.routing} variant="default" />
          </div>
        )}

        {/* Citations */}
        {!isUser && message.citations && message.citations.length > 0 && (
          <div className="mt-2">
            <CitationList citations={message.citations} />
          </div>
        )}

        {/* Approval buttons */}
        {!isUser && message.requiresApproval && (
          <ApprovalButtons
            messageId={message.id}
            status={message.approvalStatus}
            onApprove={onApprove}
            onReject={onReject}
          />
        )}

        {/* Action buttons (visible on hover) */}
        <div
          className={cn(
            'flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity',
            isUser ? 'flex-row-reverse' : ''
          )}
        >
          <button
            onClick={handleCopy}
            className="p-1 text-muted-foreground hover:text-muted-foreground transition-colors"
            title="Copy message"
          >
            {isCopied ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * MessageContent - Renders message with basic formatting
 */
function MessageContent({ content }: { content: string }): JSX.Element {
  // Simple markdown-like parsing
  const lines = content.split('\n');

  return (
    <>
      {lines.map((line, index) => {
        // Bold text
        let formattedLine = line.replace(
          /\*\*(.*?)\*\*/g,
          '<strong class="font-semibold">$1</strong>'
        );

        // Code inline
        formattedLine = formattedLine.replace(
          /`([^`]+)`/g,
          '<code class="px-1 py-0.5 bg-muted rounded text-xs font-mono">$1</code>'
        );

        // Check if it's a list item
        const isListItem = /^[-*]\s/.test(line);
        const isNumberedItem = /^\d+\.\s/.test(line);

        if (isListItem || isNumberedItem) {
          const sanitizedHtml = DOMPurify.sanitize(
            isListItem
              ? `<span class="text-muted-foreground">-</span><span>${formattedLine.replace(/^[-*]\s/, '')}</span>`
              : formattedLine
          );
          return (
            <div
              key={index}
              className="flex gap-2 ml-2"
              dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
            />
          );
        }

        const sanitizedLine = DOMPurify.sanitize(formattedLine);
        return (
          <span key={index}>
            <span dangerouslySetInnerHTML={{ __html: sanitizedLine }} />
            {index < lines.length - 1 && <br />}
          </span>
        );
      })}
    </>
  );
}

/**
 * AttachmentList - Renders message attachments
 */
function AttachmentList({
  attachments,
}: {
  attachments: SymbiosAttachment[];
}): JSX.Element {
  const getIcon = (type: SymbiosAttachment['type']): JSX.Element => {
    switch (type) {
      case 'image':
        return <Image className="w-4 h-4" />;
      case 'code':
        return <Code className="w-4 h-4" />;
      case 'link':
        return <Link2 className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {attachments.map((attachment) => (
        <a
          key={attachment.id}
          href={attachment.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-2 py-1 bg-muted/50 rounded text-xs text-muted-foreground hover:bg-muted/50 transition-colors"
        >
          {getIcon(attachment.type)}
          <span className="truncate max-w-[120px]">{attachment.name}</span>
          <ExternalLink className="w-3 h-3 opacity-50" />
        </a>
      ))}
    </div>
  );
}

/**
 * CitationList - Renders message citations with View in Ledger functionality
 */
function CitationList({
  citations,
}: {
  citations: SymbiosCitation[];
}): JSX.Element {
  const navigate = useNavigate();
  const { dispatchEvent } = useCognateEvents();

  const getSourceIcon = (sourceType: SymbiosCitation['sourceType']): string => {
    switch (sourceType) {
      case 'sop':
        return 'SOP';
      case 'knowledge':
        return 'KB';
      case 'document':
        return 'DOC';
      case 'web':
        return 'WEB';
      default:
        return 'REF';
    }
  };

  const handleViewInLedger = useCallback((citation: SymbiosCitation): void => {
    // Dispatch audit event for citation view
    dispatchEvent({
      type: 'evidence_attached',
      cognateId: 'aria',
      payload: {
        citationId: citation.id,
        citationTitle: citation.title,
        sourceType: citation.sourceType,
        action: 'view_citation',
        source: 'symbios_chat',
      },
    });

    // Navigate to ledger with citation filter
    navigate(`/control/ledger?citationId=${citation.id}`);
  }, [dispatchEvent, navigate]);

  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground mb-1">Sources:</p>
      {citations.map((citation) => (
        <div
          key={citation.id}
          className="flex items-start gap-2 p-2 bg-card/50 rounded border border-border/50 group hover:border-symtex-purple/30 transition-colors"
        >
          <span className="flex-shrink-0 px-1.5 py-0.5 bg-muted rounded text-[10px] font-medium text-muted-foreground">
            {getSourceIcon(citation.sourceType)}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground truncate group-hover:text-symtex-purple transition-colors">
              {citation.title}
            </p>
            {citation.snippet && (
              <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                {citation.snippet}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* View in Ledger button */}
            <button
              onClick={() => handleViewInLedger(citation)}
              className="p-1 text-muted-foreground hover:text-symtex-purple opacity-0 group-hover:opacity-100 transition-all"
              title="View in Ledger"
            >
              <ScrollText className="w-3 h-3" />
            </button>
            {citation.url && (
              <a
                href={citation.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 text-muted-foreground hover:text-foreground"
                title="Open source"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * ApprovalButtons - Renders approval workflow buttons
 */
interface ApprovalButtonsProps {
  messageId: string;
  status?: 'pending' | 'approved' | 'rejected';
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

function ApprovalButtons({
  messageId,
  status,
  onApprove,
  onReject,
}: ApprovalButtonsProps): JSX.Element {
  if (status === 'approved') {
    return (
      <div className="mt-3 flex items-center gap-2 text-emerald-400 text-sm">
        <CheckCircle2 className="w-4 h-4" />
        <span>Approved - Automation activated</span>
      </div>
    );
  }

  if (status === 'rejected') {
    return (
      <div className="mt-3 flex items-center gap-2 text-red-400 text-sm">
        <AlertCircle className="w-4 h-4" />
        <span>Rejected - No changes made</span>
      </div>
    );
  }

  return (
    <div className="mt-3 flex items-center gap-2">
      <button
        onClick={() => onApprove?.(messageId)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-foreground text-sm font-medium rounded-lg transition-colors"
      >
        <Check className="w-4 h-4" />
        Approve
      </button>
      <button
        onClick={() => onReject?.(messageId)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted hover:bg-muted text-foreground text-sm font-medium rounded-lg transition-colors"
      >
        <X className="w-4 h-4" />
        Reject
      </button>
    </div>
  );
}

/**
 * TypingIndicator - Shows when Aria is typing
 */
export function TypingIndicator({ cognateName = 'Aria' }: { cognateName?: string }): JSX.Element {
  return (
    <div className="flex gap-3 py-3 px-4">
      {/* Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
        <Sparkles className="w-4 h-4 text-foreground" />
      </div>

      {/* Typing animation */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">{cognateName} is typing</span>
        <div className="flex gap-1">
          <span className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}

export default SymbiosMessage;
