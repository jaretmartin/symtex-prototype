/**
 * ChatPanel Component
 *
 * Main container component for the chat interface. Combines message list,
 * input, suggestions, and context information into a complete chat experience.
 */

import { useRef, useEffect, useCallback, useState } from 'react';
import { Bot, Settings, Maximize2, Minimize2, RefreshCw } from 'lucide-react';
import type {
  Message,
  Conversation,
  Attachment,
  ContextState,
  Cognate,
} from '@/types';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ChatContextInfo, ChatContextBadge } from './ChatContextInfo';
import { SuggestionChips, DEFAULT_SUGGESTIONS } from './SuggestionChips';
import { StreamingText } from './StreamingText';

interface ChatPanelProps {
  /** The current conversation */
  conversation: Conversation | null;
  /** Messages to display */
  messages: Message[];
  /** Current context state */
  context?: ContextState;
  /** Active cognate for the conversation */
  cognate?: Cognate;
  /** Whether AI is currently generating a response */
  isGenerating?: boolean;
  /** Current streaming response text */
  streamingText?: string;
  /** Callback when user sends a message */
  onSend: (content: string, attachments?: Attachment[]) => void;
  /** Callback when a suggestion is selected */
  onSuggestionSelect?: (message: string) => void;
  /** Callback when generation should stop */
  onStopGeneration?: () => void;
  /** Callback when conversation should regenerate last response */
  onRegenerate?: () => void;
  /** Whether the panel can be expanded */
  expandable?: boolean;
  /** Whether the panel is expanded */
  isExpanded?: boolean;
  /** Callback when expand state changes */
  onExpandChange?: (expanded: boolean) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Empty state displayed when no conversation is selected
 */
function EmptyState({
  onSuggestionSelect,
  cognate,
}: {
  onSuggestionSelect?: (message: string) => void;
  cognate?: Cognate;
}): JSX.Element {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      {/* Avatar */}
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-symtex-primary to-symtex-accent flex items-center justify-center mb-6 shadow-lg shadow-symtex-primary/20">
        {cognate?.avatar ? (
          <img
            src={cognate.avatar}
            alt={cognate.name}
            className="w-20 h-20 rounded-full object-cover"
          />
        ) : (
          <Bot className="w-10 h-10 text-white" />
        )}
      </div>

      {/* Greeting */}
      <h2 className="text-2xl font-semibold text-white mb-2">
        {cognate ? `Hi, I'm ${cognate.name}` : 'Start a conversation'}
      </h2>
      <p className="text-slate-400 max-w-md mb-8">
        {cognate?.description ||
          'Ask me anything or choose a suggestion below to get started.'}
      </p>

      {/* Quick suggestions */}
      {onSuggestionSelect && (
        <SuggestionChips
          suggestions={DEFAULT_SUGGESTIONS.greeting}
          onSelect={onSuggestionSelect}
          maxVisible={4}
        />
      )}
    </div>
  );
}

/**
 * Main chat panel component
 */
export function ChatPanel({
  conversation,
  messages,
  context,
  cognate,
  isGenerating = false,
  streamingText = '',
  onSend,
  onSuggestionSelect,
  onStopGeneration,
  onRegenerate,
  expandable = false,
  isExpanded = false,
  onExpandChange,
  className = '',
}: ChatPanelProps): JSX.Element {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, streamingText, autoScroll]);

  // Detect manual scroll to disable auto-scroll
  const handleScroll = useCallback((): void => {
    if (!messagesContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
    setAutoScroll(isAtBottom);
  }, []);

  // Handle suggestion selection
  const handleSuggestionSelect = useCallback(
    (message: string): void => {
      if (onSuggestionSelect) {
        onSuggestionSelect(message);
      } else {
        onSend(message);
      }
    },
    [onSuggestionSelect, onSend]
  );

  // Determine which suggestions to show
  const currentSuggestions = conversation?.type === 'mission'
    ? DEFAULT_SUGGESTIONS.mission
    : messages.length > 0
    ? DEFAULT_SUGGESTIONS.followUp
    : DEFAULT_SUGGESTIONS.greeting;

  return (
    <div className={`flex flex-col h-full bg-symtex-background ${className}`}>
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-symtex-border">
        <div className="flex items-center gap-3">
          {/* Cognate info */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-symtex-primary to-symtex-accent flex items-center justify-center">
              {cognate?.avatar ? (
                <img
                  src={cognate.avatar}
                  alt={cognate.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <Bot className="w-4 h-4 text-white" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-white">
                {cognate?.name || 'Assistant'}
              </h3>
              {isGenerating && (
                <p className="text-xs text-symtex-primary animate-pulse">
                  Typing...
                </p>
              )}
            </div>
          </div>

          {/* Context badge */}
          {context && <ChatContextBadge context={context} />}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {onRegenerate && messages.length > 0 && !isGenerating && (
            <button
              onClick={onRegenerate}
              className="p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-700/50 transition-colors"
              aria-label="Regenerate response"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}

          <button
            className="p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-700/50 transition-colors"
            aria-label="Chat settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {expandable && (
            <button
              onClick={() => onExpandChange?.(!isExpanded)}
              className="p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-700/50 transition-colors"
              aria-label={isExpanded ? 'Minimize chat' : 'Expand chat'}
            >
              {isExpanded ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Context info (full) */}
      {context && context.breadcrumb.length > 1 && (
        <div className="flex-shrink-0 px-4 py-2 border-b border-symtex-border/50 bg-slate-900/30">
          <ChatContextInfo context={context} showFullBreadcrumb />
        </div>
      )}

      {/* Messages area */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto"
      >
        {messages.length === 0 && !isGenerating ? (
          <EmptyState
            onSuggestionSelect={handleSuggestionSelect}
            cognate={cognate}
          />
        ) : (
          <div className="p-4 space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {/* Streaming response */}
            {isGenerating && (
              <div className="flex justify-start">
                <div className="max-w-[80%]">
                  {/* Cognate identity */}
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
                    <span className="text-xs text-slate-400 font-medium">
                      {cognate?.name || 'Assistant'}
                    </span>
                  </div>

                  <div className="px-4 py-2.5 bg-symtex-card border border-symtex-border text-slate-200 rounded-2xl rounded-bl-md">
                    <StreamingText
                      text={streamingText}
                      isStreaming={isGenerating}
                    />
                  </div>

                  {/* Stop button */}
                  {onStopGeneration && (
                    <button
                      onClick={onStopGeneration}
                      className="mt-2 px-3 py-1 text-xs text-slate-400 hover:text-slate-200 border border-slate-700 rounded-full hover:border-slate-600 transition-colors"
                    >
                      Stop generating
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Suggestions */}
      {messages.length > 0 && !isGenerating && (
        <div className="flex-shrink-0 px-4 py-2 border-t border-symtex-border/50">
          <SuggestionChips
            suggestions={currentSuggestions}
            onSelect={handleSuggestionSelect}
            disabled={isGenerating}
            maxVisible={3}
          />
        </div>
      )}

      {/* Input area */}
      <div className="flex-shrink-0 p-4 border-t border-symtex-border bg-slate-900/30">
        <ChatInput
          onSend={onSend}
          disabled={isGenerating}
          placeholder={
            isGenerating
              ? 'Waiting for response...'
              : `Message ${cognate?.name || 'Assistant'}...`
          }
        />
      </div>
    </div>
  );
}
