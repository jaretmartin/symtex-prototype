/**
 * SymbiosChat Component
 *
 * Main chat interface for the Symbios conversational system.
 * Features message list with routing visualization, Aria presence indicator,
 * and integrated input/suggestions.
 */

import { useRef, useEffect, useCallback } from 'react';
import {
  Sparkles,
  Minimize2,
  Maximize2,
  Trash2,
  X,
  Zap,
  Brain,
  DollarSign,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SymbiosMessage, TypingIndicator } from './SymbiosMessage';
import { SymbiosInput } from './SymbiosInput';
import { SymbiosSuggestions, SymbiosEmptyState } from './SymbiosSuggestions';
import { useSymbiosStore } from './symbios-store';
import type { SymbiosSuggestion, SymbiosAttachment } from './symbios-store';

interface SymbiosChatProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  variant?: 'panel' | 'modal' | 'embedded';
}

export function SymbiosChat({
  isOpen,
  onClose,
  className,
  variant = 'panel',
}: SymbiosChatProps): JSX.Element | null {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Store hooks
  const {
    messages,
    isTyping,
    suggestions,
    routingStats,
    ariaStatus,
    isMinimized,
    setMinimized,
    sendMessage,
    clearMessages,
    approveMessage,
    rejectMessage,
  } = useSymbiosStore();

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Handle send message
  const handleSend = useCallback(
    (content: string, attachments?: SymbiosAttachment[]) => {
      sendMessage(content, attachments);
    },
    [sendMessage]
  );

  // Handle suggestion select
  const handleSuggestionSelect = useCallback(
    (suggestion: SymbiosSuggestion) => {
      // Convert suggestion to a message
      sendMessage(suggestion.label);
    },
    [sendMessage]
  );

  // Handle empty state suggestion
  const handleEmptySuggestion = useCallback(
    (text: string) => {
      sendMessage(text);
    },
    [sendMessage]
  );

  if (!isOpen) return null;

  // Get status color
  const statusColors = {
    online: 'bg-emerald-500',
    busy: 'bg-amber-500',
    away: 'bg-zinc-500',
    offline: 'bg-zinc-600',
  };

  // Calculate symbolic percentage
  const total = routingStats.symbolic + routingStats.neural;
  const symbolicPercent = total > 0 ? Math.round((routingStats.symbolic / total) * 100) : 0;

  const containerClasses = cn(
    'flex flex-col bg-zinc-900 border border-zinc-800',
    variant === 'panel' && 'fixed bottom-24 right-6 w-[420px] h-[600px] rounded-2xl shadow-2xl z-40',
    variant === 'modal' && 'fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[600px] md:h-[700px] rounded-2xl shadow-2xl z-50',
    variant === 'embedded' && 'w-full h-full rounded-xl',
    'animate-scale-in',
    className
  );

  return (
    <>
      {/* Backdrop for modal variant */}
      {variant === 'modal' && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
          onClick={onClose}
        />
      )}

      <div
        className={containerClasses}
        role="dialog"
        aria-modal={variant === 'modal'}
        aria-labelledby="symbios-chat-title"
        aria-describedby="symbios-chat-description"
        aria-busy={isTyping}
      >
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            {/* Aria avatar with status */}
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span
                className={cn(
                  'absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-zinc-900',
                  statusColors[ariaStatus]
                )}
              />
            </div>

            {/* Title and status */}
            <div>
              <h2 id="symbios-chat-title" className="font-semibold text-zinc-100">Symbios</h2>
              <div className="flex items-center gap-2 text-xs text-zinc-400" role="status" aria-live="polite">
                <span className="capitalize" aria-label={`Status: ${ariaStatus}`}>{ariaStatus}</span>
                <span className="text-zinc-600">|</span>
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-emerald-400" />
                  {symbolicPercent}% symbolic
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setMinimized(!isMinimized)}
              className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors"
              title={isMinimized ? 'Expand' : 'Minimize'}
              aria-label={isMinimized ? 'Expand chat' : 'Minimize chat'}
            >
              {isMinimized ? (
                <Maximize2 className="w-4 h-4" />
              ) : (
                <Minimize2 className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={clearMessages}
              className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors"
              title="Clear chat"
              aria-label="Clear chat history"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors"
              title="Close"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Routing stats bar */}
        <div className="flex-shrink-0 px-4 py-2 border-b border-zinc-800/50 bg-zinc-900/50" role="status" aria-label="Routing statistics">
          <p id="symbios-chat-description" className="sr-only">AI assistant chat with symbolic and neural processing</p>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <Zap className="w-3.5 h-3.5" />
              <span>{routingStats.symbolic} symbolic</span>
            </div>
            <div className="flex items-center gap-1.5 text-violet-400">
              <Brain className="w-3.5 h-3.5" />
              <span>{routingStats.neural} neural</span>
            </div>
            <div className="flex-1 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${symbolicPercent}%` }}
              />
            </div>
            <div className="flex items-center gap-1 text-zinc-400">
              <DollarSign className="w-3 h-3" />
              <span>{routingStats.totalCost.toFixed(3)}</span>
            </div>
          </div>
        </div>

        {/* Messages area */}
        <div
          ref={messagesContainerRef}
          className={cn(
            'flex-1 overflow-y-auto',
            'scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent',
            isMinimized && 'hidden'
          )}
          role="log"
          aria-live="polite"
          aria-label="Chat messages"
          aria-relevant="additions"
        >
          {messages.length <= 1 ? (
            <SymbiosEmptyState onSuggestionSelect={handleEmptySuggestion} />
          ) : (
            <div className="py-2">
              {messages.map((message) => (
                <SymbiosMessage
                  key={message.id}
                  message={message}
                  onApprove={approveMessage}
                  onReject={rejectMessage}
                />
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div role="status" aria-live="polite" aria-label="Aria is typing">
                  <TypingIndicator cognateName="Aria" />
                </div>
              )}

              {/* Auto-scroll anchor */}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Suggestions */}
        {!isMinimized && suggestions.length > 0 && messages.length > 1 && (
          <div className="flex-shrink-0 px-4 py-2 border-t border-zinc-800/50">
            <SymbiosSuggestions
              suggestions={suggestions}
              onSelect={handleSuggestionSelect}
              variant="chips"
            />
          </div>
        )}

        {/* Input area */}
        {!isMinimized && (
          <SymbiosInput
            onSend={handleSend}
            isTyping={isTyping}
            placeholder="Message Aria..."
          />
        )}
      </div>
    </>
  );
}

/**
 * SymbiosChatPanel - Pre-configured panel variant
 */
export function SymbiosChatPanel(): JSX.Element {
  const { isOpen, toggleOpen } = useSymbiosStore();

  return <SymbiosChat isOpen={isOpen} onClose={toggleOpen} variant="panel" />;
}

/**
 * SymbiosChatModal - Pre-configured modal variant
 */
export function SymbiosChatModal(): JSX.Element {
  const { isOpen, setOpen } = useSymbiosStore();

  return (
    <SymbiosChat
      isOpen={isOpen}
      onClose={() => setOpen(false)}
      variant="modal"
    />
  );
}

export default SymbiosChat;
