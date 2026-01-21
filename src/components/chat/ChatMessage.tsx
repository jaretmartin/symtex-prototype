/**
 * ChatMessage Component
 *
 * Displays individual chat messages with different styles based on the sender role.
 * Supports user, assistant, and system message types with appropriate styling.
 */

import { useState, useCallback } from 'react';
import { Copy, Check, Bot } from 'lucide-react';
import type { Message, Cognate } from '@/types';
import { useCognateStore } from '@/store/useCognateStore';
import { AttachmentPreview } from './AttachmentPreview';

interface ChatMessageProps {
  /** The message to display */
  message: Message;
  /** Whether to show cognate info for assistant messages */
  showCognate?: boolean;
}

/**
 * Formats a timestamp for display on hover
 */
function formatTimestamp(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Renders an individual chat message with role-based styling
 */
export function ChatMessage({
  message,
  showCognate = true,
}: ChatMessageProps): JSX.Element {
  const [showTimestamp, setShowTimestamp] = useState(false);
  const [copied, setCopied] = useState(false);

  const cognates = useCognateStore((state) => state.cognates);
  const cognate: Cognate | undefined = message.cognateId
    ? cognates.find((c) => c.id === message.cognateId)
    : undefined;

  const handleCopy = useCallback(async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Silently fail if clipboard access is denied
    }
  }, [message.content]);

  // System message styling
  if (message.role === 'system') {
    return (
      <div className="flex justify-center py-2">
        <div className="max-w-md px-4 py-2 text-sm text-muted-foreground bg-card/30 rounded-lg text-center">
          {message.content}
        </div>
      </div>
    );
  }

  // User message styling
  if (message.role === 'user') {
    return (
      <div
        className="flex justify-end group"
        onMouseEnter={() => setShowTimestamp(true)}
        onMouseLeave={() => setShowTimestamp(false)}
      >
        <div className="max-w-[80%] flex flex-col items-end gap-1">
          <div className="relative flex items-center gap-2">
            {/* Hover actions */}
            <div
              className={`flex items-center gap-1 transition-opacity duration-200 ${
                showTimestamp ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <button
                onClick={handleCopy}
                className="p-1.5 text-muted-foreground hover:text-muted-foreground rounded-md hover:bg-muted/50 transition-colors"
                aria-label="Copy message"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-success" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Message bubble */}
            <div className="px-4 py-2.5 bg-gradient-to-r from-symtex-primary to-symtex-accent text-foreground rounded-2xl rounded-br-md shadow-lg shadow-symtex-primary/20">
              <p className="text-sm whitespace-pre-wrap break-words">
                {message.content}
              </p>
            </div>
          </div>

          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="flex flex-wrap justify-end gap-2 mt-1">
              {message.attachments.map((attachment) => (
                <AttachmentPreview
                  key={attachment.id}
                  attachment={attachment}
                  size="sm"
                />
              ))}
            </div>
          )}

          {/* Timestamp */}
          <div
            className={`text-xs text-muted-foreground transition-opacity duration-200 ${
              showTimestamp ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {formatTimestamp(message.createdAt)}
          </div>
        </div>
      </div>
    );
  }

  // Assistant message styling
  return (
    <div
      className="flex justify-start group"
      onMouseEnter={() => setShowTimestamp(true)}
      onMouseLeave={() => setShowTimestamp(false)}
    >
      <div className="max-w-[80%] flex flex-col items-start gap-1">
        {/* Cognate identity */}
        {showCognate && (
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-symtex-accent to-symtex-primary flex items-center justify-center">
              {cognate?.avatar ? (
                <img
                  src={cognate.avatar}
                  alt={cognate.name}
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <Bot className="w-3.5 h-3.5 text-white" />
              )}
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              {cognate?.name || 'Assistant'}
            </span>
          </div>
        )}

        <div className="relative flex items-center gap-2">
          {/* Message bubble */}
          <div className="px-4 py-2.5 bg-card border border-border text-muted-foreground rounded-2xl rounded-bl-md">
            <p className="text-sm whitespace-pre-wrap break-words">
              {message.content}
            </p>
          </div>

          {/* Hover actions */}
          <div
            className={`flex items-center gap-1 transition-opacity duration-200 ${
              showTimestamp ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <button
              onClick={handleCopy}
              className="p-1.5 text-muted-foreground hover:text-muted-foreground rounded-md hover:bg-muted/50 transition-colors"
              aria-label="Copy message"
            >
              {copied ? (
                <Check className="w-4 h-4 text-success" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {message.attachments.map((attachment) => (
              <AttachmentPreview
                key={attachment.id}
                attachment={attachment}
                size="sm"
              />
            ))}
          </div>
        )}

        {/* Timestamp */}
        <div
          className={`text-xs text-muted-foreground transition-opacity duration-200 ${
            showTimestamp ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {formatTimestamp(message.createdAt)}
        </div>
      </div>
    </div>
  );
}
