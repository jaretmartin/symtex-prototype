/**
 * Chat Page
 *
 * Full-page chat interface for AI conversations.
 * Provides a complete chat experience with context awareness.
 */

import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  ArrowLeft,
  Plus,
  Trash2,
  MoreHorizontal,
} from 'lucide-react';
import clsx from 'clsx';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { useChatStore } from '@/store/useChatStore';
import { useContextStore } from '@/store/useContextStore';
import { useCognateStore } from '@/store';
import type { Attachment, ContextState, Conversation, Message } from '@/types';

export default function ChatPage(): JSX.Element {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  // Chat store
  const {
    activeConversationId,
    setActiveConversation,
    createConversation,
    addMessage,
    deleteConversation,
    getConversations,
    getActiveConversation,
    getMessages,
  } = useChatStore();

  // Get conversations array
  const conversations = getConversations();

  // Context store
  const breadcrumb = useContextStore((state) => state.breadcrumb);
  const currentSpaceType = useContextStore((state) => state.currentSpaceType);
  const currentId = useContextStore((state) => state.currentId);

  // Cognate store
  const cognates = useCognateStore((state) => state.cognates);
  const selectedCognate = useCognateStore((state) => state.selectedCognate);

  // Get active conversation
  const activeConversation = getActiveConversation();

  // Get messages for active conversation
  const messages = activeConversationId ? getMessages(activeConversationId) : [];

  // Build context state
  const context: ContextState = {
    breadcrumb,
    currentSpaceType: currentSpaceType || 'personal',
    currentId: currentId || 'personal',
  };

  // Get active cognate
  const activeCognate =
    selectedCognate || cognates.find((c) => c.status === 'active');

  // Handle sending a message
  const handleSend = useCallback(
    (content: string, attachments?: Attachment[]): void => {
      if (!activeConversationId) {
        // Create a new conversation if none exists
        const newConv: Conversation = {
          id: `conv-${Date.now()}`,
          title: 'New Conversation',
          type: 'chat',
          messageIds: [],
          isPinned: false,
          isArchived: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        createConversation(newConv);
        setActiveConversation(newConv.id);

        // Add the user message
        const userMsg: Message = {
          id: `msg-${Date.now()}`,
          conversationId: newConv.id,
          role: 'user',
          content,
          status: 'sent',
          attachments,
          createdAt: new Date().toISOString(),
        };
        addMessage(userMsg);
      } else {
        // Add user message to existing conversation
        const userMsg: Message = {
          id: `msg-${Date.now()}`,
          conversationId: activeConversationId,
          role: 'user',
          content,
          status: 'sent',
          attachments,
          createdAt: new Date().toISOString(),
        };
        addMessage(userMsg);

        // Simulate AI response (in real app, this would call an API)
        setTimeout(() => {
          const assistantMsg: Message = {
            id: `msg-${Date.now() + 1}`,
            conversationId: activeConversationId,
            role: 'assistant',
            content: `I understand you're asking about: "${content.slice(0, 50)}${content.length > 50 ? '...' : ''}". Let me help you with that. In a production environment, this would connect to the AI backend for a real response.`,
            status: 'delivered',
            createdAt: new Date().toISOString(),
          };
          addMessage(assistantMsg);
        }, 1000);
      }
    },
    [activeConversationId, addMessage, createConversation, setActiveConversation]
  );

  // Handle creating a new conversation
  const handleNewConversation = useCallback((): void => {
    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      title: 'New Conversation',
      type: 'chat',
      messageIds: [],
      isPinned: false,
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    createConversation(newConv);
    setActiveConversation(newConv.id);
  }, [createConversation, setActiveConversation]);

  // Handle deleting a conversation
  const handleDeleteConversation = useCallback(
    (convId: string): void => {
      deleteConversation(convId);
    },
    [deleteConversation]
  );

  return (
    <div className="h-[calc(100vh-8rem)] flex">
      {/* Conversation List Sidebar */}
      <div className="w-64 bg-symtex-card border-r border-symtex-border flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-symtex-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              </button>
              <h2 className="font-semibold text-white">Chats</h2>
            </div>
            <button
              type="button"
              onClick={handleNewConversation}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="New conversation"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.length > 0 ? (
            conversations.map((conv) => (
              <div
                key={conv.id}
                className={clsx(
                  'flex items-center justify-between p-3 rounded-lg cursor-pointer group',
                  'transition-all duration-150',
                  activeConversationId === conv.id
                    ? 'bg-symtex-primary/20 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                )}
                onClick={() => setActiveConversation(conv.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveConversation(conv.id);
                  }
                }}
                tabIndex={0}
                role="button"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <MessageSquare className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <span className="text-sm truncate">{conv.title}</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteConversation(conv.id);
                  }}
                  className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-all"
                  aria-label={`Delete ${conv.title}`}
                >
                  <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-slate-500 text-sm">
              <MessageSquare className="w-8 h-8 mb-2 opacity-50" aria-hidden="true" />
              <p>No conversations yet</p>
              <button
                type="button"
                onClick={handleNewConversation}
                className="mt-2 text-symtex-primary hover:underline"
              >
                Start a new chat
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-symtex-border bg-symtex-card/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-symtex-primary/20 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-symtex-primary" aria-hidden="true" />
            </div>
            <div>
              <h1 className="font-medium text-white">
                {activeConversation?.title || 'AI Assistant'}
              </h1>
              {activeCognate && (
                <p className="text-xs text-slate-400">
                  with {activeCognate.name}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="More options"
          >
            <MoreHorizontal className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Chat Panel */}
        <div className="flex-1 overflow-hidden">
          <ChatPanel
            conversation={activeConversation || null}
            messages={messages}
            context={context}
            cognate={activeCognate}
            isGenerating={false}
            onSend={handleSend}
            onSuggestionSelect={(msg) => handleSend(msg)}
            expandable
            isExpanded={isExpanded}
            onExpandChange={setIsExpanded}
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
}
