/**
 * AriaChat Component
 *
 * Primary chat interface for Aria, the meta-cognate orchestrator.
 * Uses existing ChatPanel components internally with Aria-specific branding.
 *
 * Features:
 * - Aria-specific welcome message and styling
 * - Context-aware suggestions
 * - Cognate routing indicator when delegating
 * - "Thinking..." state with routing visualization
 * - Keyboard accessible
 */

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { X, Minimize2, Maximize2, Sparkles, Bot, Send, Paperclip } from 'lucide-react';
import clsx from 'clsx';
import type { Message, Cognate } from '@/types';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { StreamingText } from '@/components/chat/StreamingText';
import { SuggestionChips } from '@/components/chat/SuggestionChips';
import { AriaRoutingIndicator, type RoutingState } from './AriaRoutingIndicator';
import { AriaQuickActions, type QuickAction } from './AriaQuickActions';

// ============================================================================
// Types
// ============================================================================

export interface AriaChatProps {
  /** Whether the chat panel is open */
  isOpen: boolean;
  /** Callback to close the chat panel */
  onClose: () => void;
  /** Additional CSS classes */
  className?: string;
}

interface AriaMessage extends Message {
  /** Whether this message was routed to a Cognate */
  routedToCognate?: Cognate;
}

// ============================================================================
// Constants
// ============================================================================

const ARIA_WELCOME_MESSAGE = `Hello! I'm Aria, your AI orchestrator. I help coordinate your interactions across Symtex, routing your requests to the right Cognates and keeping everything running smoothly.

How can I assist you today?`;

const ARIA_SUGGESTIONS = [
  {
    id: 'aria-1',
    label: 'What can you help with?',
    message: 'What can you help me with?',
    icon: 'help' as const,
  },
  {
    id: 'aria-2',
    label: 'Show active Cognates',
    message: 'Show me all active Cognates and what they are working on.',
    icon: 'sparkles' as const,
  },
  {
    id: 'aria-3',
    label: 'Check current context',
    message: 'What context am I currently working in?',
    icon: 'message' as const,
  },
  {
    id: 'aria-4',
    label: 'Help me decide',
    message: 'I need help deciding which Cognate to use for my task.',
    icon: 'lightbulb' as const,
  },
];

// ============================================================================
// Sub-components
// ============================================================================

interface ChatHeaderProps {
  isExpanded: boolean;
  onToggleExpand: () => void;
  onClose: () => void;
}

function ChatHeader({
  isExpanded,
  onToggleExpand,
  onClose,
}: ChatHeaderProps): JSX.Element {
  return (
    <div
      className={clsx(
        'flex items-center justify-between',
        'px-4 py-3',
        'border-b border-violet-500/20',
        'bg-gradient-to-r from-violet-900/50 to-purple-900/50'
      )}
    >
      <div className="flex items-center gap-3">
        {/* Aria avatar */}
        <div
          className={clsx(
            'w-10 h-10 rounded-full',
            'bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500',
            'flex items-center justify-center',
            'shadow-lg shadow-violet-500/30',
            'ring-2 ring-violet-400/30'
          )}
        >
          <Sparkles className="w-5 h-5 text-white" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-white font-semibold flex items-center gap-2">
            Aria
            <span className="px-1.5 py-0.5 text-xs bg-violet-500/20 text-violet-300 rounded-full">
              Meta-Cognate
            </span>
          </h2>
          <p className="text-xs text-violet-300/70">Always here to help</p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onToggleExpand}
          className={clsx(
            'p-2 rounded-lg',
            'text-violet-300 hover:text-white',
            'hover:bg-violet-500/20',
            'transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-violet-400/50'
          )}
          aria-label={isExpanded ? 'Minimize chat' : 'Expand chat'}
        >
          {isExpanded ? (
            <Minimize2 className="w-4 h-4" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
        </button>
        <button
          type="button"
          onClick={onClose}
          className={clsx(
            'p-2 rounded-lg',
            'text-violet-300 hover:text-white',
            'hover:bg-violet-500/20',
            'transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-violet-400/50'
          )}
          aria-label="Close chat"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

interface AriaEmptyStateProps {
  onSuggestionSelect: (message: string) => void;
}

function AriaEmptyState({ onSuggestionSelect }: AriaEmptyStateProps): JSX.Element {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      {/* Aria avatar - larger */}
      <div
        className={clsx(
          'w-20 h-20 rounded-full mb-6',
          'bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500',
          'flex items-center justify-center',
          'shadow-xl shadow-violet-500/40',
          'ring-4 ring-violet-400/20',
          'animate-pulse'
        )}
        style={{ animationDuration: '3s' }}
      >
        <Sparkles className="w-10 h-10 text-white" aria-hidden="true" />
      </div>

      {/* Welcome text */}
      <h3 className="text-xl font-semibold text-foreground mb-2">
        Hi, I'm Aria
      </h3>
      <p className="text-muted-foreground max-w-sm mb-6 text-sm leading-relaxed">
        {ARIA_WELCOME_MESSAGE}
      </p>

      {/* Suggestions */}
      <SuggestionChips
        suggestions={ARIA_SUGGESTIONS}
        onSelect={onSuggestionSelect}
        maxVisible={4}
      />
    </div>
  );
}

interface ChatInputAreaProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

function ChatInputArea({
  value,
  onChange,
  onSend,
  disabled = false,
}: ChatInputAreaProps): JSX.Element {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [value]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (value.trim()) {
          onSend();
        }
      }
    },
    [value, onSend]
  );

  return (
    <div
      className={clsx(
        'p-3',
        'border-t border-violet-500/20',
        'bg-surface-base/50'
      )}
    >
      <div
        className={clsx(
          'flex items-end gap-2',
          'p-2 rounded-xl',
          'bg-card/50 border border-violet-500/20',
          'focus-within:border-violet-500/40',
          'transition-colors'
        )}
      >
        {/* Attachment button */}
        <button
          type="button"
          disabled={disabled}
          className={clsx(
            'flex-shrink-0 p-2 rounded-lg',
            'text-muted-foreground hover:text-violet-300',
            'hover:bg-violet-500/10',
            'transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
          aria-label="Add attachment"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Text input */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e): void => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Message Aria..."
          rows={1}
          className={clsx(
            'flex-1 resize-none',
            'bg-transparent text-white placeholder-slate-500',
            'outline-none text-sm py-2',
            'max-h-[120px]',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
          aria-label="Message input"
        />

        {/* Send button */}
        <button
          type="button"
          onClick={onSend}
          disabled={disabled || !value.trim()}
          className={clsx(
            'flex-shrink-0 p-2 rounded-lg',
            'bg-gradient-to-r from-violet-600 to-fuchsia-600',
            'text-white',
            'transition-all duration-200',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'enabled:hover:shadow-lg enabled:hover:shadow-violet-500/30'
          )}
          aria-label="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

      {/* Keyboard hint */}
      <p className="text-xs text-muted-foreground text-center mt-2">
        Press{' '}
        <kbd className="px-1.5 py-0.5 bg-muted rounded text-muted-foreground">
          Enter
        </kbd>{' '}
        to send
      </p>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function AriaChat({
  isOpen,
  onClose,
  className,
}: AriaChatProps): JSX.Element | null {
  const [messages, setMessages] = useState<AriaMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [routingState, setRoutingState] = useState<RoutingState | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, streamingText]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (!isOpen || !panelRef.current) return;

    const panel = panelRef.current;
    const focusableElements = panel.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];

    // Focus first element when opened
    firstElement?.focus();
  }, [isOpen]);

  // Simulate sending a message (mock implementation)
  const handleSend = useCallback((): void => {
    if (!inputValue.trim() || isGenerating) return;

    const userMessage: AriaMessage = {
      id: `msg-${Date.now()}`,
      conversationId: 'aria-chat',
      role: 'user',
      content: inputValue.trim(),
      status: 'sent',
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsGenerating(true);

    // Simulate routing decision
    setTimeout(() => {
      // Mock routing to a Cognate
      const shouldRoute = Math.random() > 0.5;

      if (shouldRoute) {
        setRoutingState({
          status: 'routing',
          selectedCognate: undefined,
        });

        // Simulate selecting a Cognate
        setTimeout(() => {
          const mockCognate: Cognate = {
            id: 'cog-1',
            name: 'Customer Support Cognate',
            description: 'Handles customer inquiries',
            status: 'active',
            createdAt: '',
            updatedAt: '',
            sopCount: 5,
            activeSOPCount: 3,
            tags: [],
          };

          setRoutingState({
            status: 'selected',
            selectedCognate: mockCognate,
            reason: 'Best match for customer support queries',
          });

          // Generate response
          setTimeout(() => {
            setRoutingState(null);
            simulateResponse(mockCognate);
          }, 1500);
        }, 1000);
      } else {
        // Aria handles directly
        simulateResponse();
      }
    }, 500);
  }, [inputValue, isGenerating]);

  // Simulate streaming response
  const simulateResponse = useCallback((routedCognate?: Cognate): void => {
    const responseText = routedCognate
      ? `I've routed your request to ${routedCognate.name}. They're best suited to help with this type of inquiry.\n\nHere's what I found for you...`
      : `I understand you're looking for assistance. Let me help you with that directly.\n\nBased on your current context, I can see you're working on the Symtex prototype project. Is there something specific you'd like to accomplish?`;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < responseText.length) {
        setStreamingText(responseText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(interval);

        const assistantMessage: AriaMessage = {
          id: `msg-${Date.now()}`,
          conversationId: 'aria-chat',
          role: 'assistant',
          content: responseText,
          status: 'delivered',
          createdAt: new Date().toISOString(),
          routedToCognate: routedCognate,
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setStreamingText('');
        setIsGenerating(false);
      }
    }, 20);
  }, []);

  const handleSuggestionSelect = useCallback((message: string): void => {
    setInputValue(message);
  }, []);

  const handleQuickAction = useCallback((action: QuickAction): void => {
    setInputValue(action.message);
    setShowQuickActions(false);
  }, []);

  const quickActions: QuickAction[] = useMemo(() => [
    {
      id: 'qa-1',
      label: 'Create a new mission',
      message: 'Help me create a new mission.',
      icon: 'plus',
    },
    {
      id: 'qa-2',
      label: 'Check my progress',
      message: 'What is my progress across all active missions?',
      icon: 'chart',
    },
    {
      id: 'qa-3',
      label: 'Find a Cognate',
      message: 'Help me find the right Cognate for my task.',
      icon: 'search',
    },
  ], []);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Chat with Aria"
      className={clsx(
        'fixed z-50',
        'flex flex-col',
        'bg-surface-base/95 backdrop-blur-xl',
        'border border-violet-500/30',
        'rounded-2xl',
        'shadow-2xl shadow-violet-500/10',
        'overflow-hidden',
        'transition-all duration-300 ease-out',
        // Position and size
        isExpanded
          ? 'bottom-6 right-6 w-[600px] h-[80vh]'
          : 'bottom-24 right-6 w-[400px] h-[500px]',
        // Entrance animation
        'animate-in slide-in-from-bottom-4 fade-in duration-200',
        className
      )}
    >
      {/* Header */}
      <ChatHeader
        isExpanded={isExpanded}
        onToggleExpand={(): void => setIsExpanded(!isExpanded)}
        onClose={onClose}
      />

      {/* Routing indicator */}
      {routingState && (
        <AriaRoutingIndicator
          status={routingState.status}
          selectedCognate={routingState.selectedCognate}
          reason={routingState.reason}
        />
      )}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 && !isGenerating ? (
          <AriaEmptyState onSuggestionSelect={handleSuggestionSelect} />
        ) : (
          <div className="p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id}>
                {/* Show routing badge if applicable */}
                {message.role === 'assistant' && message.routedToCognate && (
                  <div className="flex items-center gap-2 mb-2 ml-8">
                    <Bot className="w-3.5 h-3.5 text-violet-400" />
                    <span className="text-xs text-violet-400">
                      Routed via {message.routedToCognate.name}
                    </span>
                  </div>
                )}
                <ChatMessage message={message} showCognate={false} />
              </div>
            ))}

            {/* Streaming response */}
            {isGenerating && streamingText && (
              <div className="flex justify-start">
                <div className="max-w-[80%]">
                  {/* Aria identity */}
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className={clsx(
                        'w-6 h-6 rounded-full',
                        'bg-gradient-to-br from-violet-500 to-fuchsia-500',
                        'flex items-center justify-center'
                      )}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-xs text-violet-400 font-medium">
                      Aria
                    </span>
                  </div>

                  <div
                    className={clsx(
                      'px-4 py-2.5 rounded-2xl rounded-bl-md',
                      'bg-violet-900/30 border border-violet-500/20',
                      'text-muted-foreground'
                    )}
                  >
                    <StreamingText text={streamingText} isStreaming={true} />
                  </div>
                </div>
              </div>
            )}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Quick actions */}
      {showQuickActions && (
        <AriaQuickActions
          actions={quickActions}
          onSelect={handleQuickAction}
          onClose={(): void => setShowQuickActions(false)}
        />
      )}

      {/* Suggestions */}
      {messages.length > 0 && !isGenerating && (
        <div className="flex-shrink-0 px-4 py-2 border-t border-violet-500/10">
          <SuggestionChips
            suggestions={ARIA_SUGGESTIONS.slice(0, 3)}
            onSelect={handleSuggestionSelect}
            disabled={isGenerating}
            maxVisible={3}
          />
        </div>
      )}

      {/* Input area */}
      <ChatInputArea
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSend}
        disabled={isGenerating}
      />
    </div>
  );
}

export default AriaChat;
