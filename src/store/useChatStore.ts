/**
 * Chat Store - Messaging state management
 *
 * Manages conversations and messages for the chat/messaging system.
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Conversation, Message } from '@/types';

interface ChatState {
  // Data
  conversations: Record<string, Conversation>;
  messages: Record<string, Message>;
  activeConversationId: string | null;
  isStreaming: boolean;

  // Loading states
  isLoading: boolean;
  error: string | null;

  // Actions - Conversation management
  /** Creates a new conversation */
  createConversation: (conversation: Conversation) => void;
  /** Updates an existing conversation */
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
  /** Deletes a conversation and its messages */
  deleteConversation: (id: string) => void;
  /** Sets the active conversation */
  setActiveConversation: (id: string | null) => void;
  /** Pins/unpins a conversation */
  togglePinConversation: (id: string) => void;
  /** Archives/unarchives a conversation */
  toggleArchiveConversation: (id: string) => void;

  // Actions - Message management
  /** Adds a new message to a conversation */
  addMessage: (message: Message) => void;
  /** Updates an existing message */
  updateMessage: (id: string, updates: Partial<Message>) => void;
  /** Deletes a message */
  deleteMessage: (id: string) => void;

  // Actions - Streaming state
  /** Sets the streaming state */
  setStreaming: (isStreaming: boolean) => void;

  // Actions - Loading
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;

  // Computed
  /** Gets the active conversation */
  getActiveConversation: () => Conversation | null;
  /** Gets all messages for a conversation */
  getMessages: (conversationId: string) => Message[];
  /** Gets all conversations as an array */
  getConversations: () => Conversation[];
  /** Gets conversations by type */
  getConversationsByType: (type: Conversation['type']) => Conversation[];
  /** Gets pinned conversations */
  getPinnedConversations: () => Conversation[];
  /** Gets recent conversations (non-archived, sorted by last message) */
  getRecentConversations: (limit?: number) => Conversation[];
}

const initialState = {
  conversations: {} as Record<string, Conversation>,
  messages: {} as Record<string, Message>,
  activeConversationId: null as string | null,
  isStreaming: false,
  isLoading: false,
  error: null as string | null,
};

export const useChatStore = create<ChatState>()(
  devtools(
    (set, get) => ({
      // Initial state
      ...initialState,

      // Conversation management actions
      createConversation: (conversation): void => {
        set((state) => ({
          conversations: {
            ...state.conversations,
            [conversation.id]: conversation,
          },
        }));
      },

      updateConversation: (id, updates): void => {
        set((state) => {
          const existing = state.conversations[id];
          if (!existing) return state;

          return {
            conversations: {
              ...state.conversations,
              [id]: {
                ...existing,
                ...updates,
                updatedAt: new Date().toISOString(),
              },
            },
          };
        });
      },

      deleteConversation: (id): void => {
        set((state) => {
          const conversation = state.conversations[id];
          if (!conversation) return state;

          // Remove conversation
          const newConversations = { ...state.conversations };
          delete newConversations[id];

          // Remove associated messages
          const newMessages = { ...state.messages };
          conversation.messageIds.forEach((msgId) => {
            delete newMessages[msgId];
          });

          return {
            conversations: newConversations,
            messages: newMessages,
            activeConversationId:
              state.activeConversationId === id ? null : state.activeConversationId,
          };
        });
      },

      setActiveConversation: (id): void => {
        set({ activeConversationId: id });
      },

      togglePinConversation: (id): void => {
        set((state) => {
          const conversation = state.conversations[id];
          if (!conversation) return state;

          return {
            conversations: {
              ...state.conversations,
              [id]: {
                ...conversation,
                isPinned: !conversation.isPinned,
                updatedAt: new Date().toISOString(),
              },
            },
          };
        });
      },

      toggleArchiveConversation: (id): void => {
        set((state) => {
          const conversation = state.conversations[id];
          if (!conversation) return state;

          return {
            conversations: {
              ...state.conversations,
              [id]: {
                ...conversation,
                isArchived: !conversation.isArchived,
                updatedAt: new Date().toISOString(),
              },
            },
          };
        });
      },

      // Message management actions
      addMessage: (message): void => {
        set((state) => {
          const conversation = state.conversations[message.conversationId];
          if (!conversation) return state;

          // Add message to messages record
          const newMessages = {
            ...state.messages,
            [message.id]: message,
          };

          // Update conversation's message list and timestamp
          const newConversations = {
            ...state.conversations,
            [message.conversationId]: {
              ...conversation,
              messageIds: [...conversation.messageIds, message.id],
              lastMessageAt: message.createdAt,
              updatedAt: new Date().toISOString(),
            },
          };

          return {
            messages: newMessages,
            conversations: newConversations,
          };
        });
      },

      updateMessage: (id, updates): void => {
        set((state) => {
          const existing = state.messages[id];
          if (!existing) return state;

          return {
            messages: {
              ...state.messages,
              [id]: {
                ...existing,
                ...updates,
                editedAt: new Date().toISOString(),
              },
            },
          };
        });
      },

      deleteMessage: (id): void => {
        set((state) => {
          const message = state.messages[id];
          if (!message) return state;

          // Remove message
          const newMessages = { ...state.messages };
          delete newMessages[id];

          // Remove from conversation's message list
          const conversation = state.conversations[message.conversationId];
          if (conversation) {
            const newConversations = {
              ...state.conversations,
              [message.conversationId]: {
                ...conversation,
                messageIds: conversation.messageIds.filter((msgId) => msgId !== id),
                updatedAt: new Date().toISOString(),
              },
            };
            return {
              messages: newMessages,
              conversations: newConversations,
            };
          }

          return { messages: newMessages };
        });
      },

      // Streaming state
      setStreaming: (isStreaming): void => {
        set({ isStreaming });
      },

      // Loading actions
      setLoading: (isLoading): void => {
        set({ isLoading });
      },

      setError: (error): void => {
        set({ error, isLoading: false });
      },

      reset: (): void => {
        set(initialState);
      },

      // Computed
      getActiveConversation: (): Conversation | null => {
        const { conversations, activeConversationId } = get();
        return activeConversationId ? conversations[activeConversationId] ?? null : null;
      },

      getMessages: (conversationId): Message[] => {
        const { conversations, messages } = get();
        const conversation = conversations[conversationId];
        if (!conversation) return [];

        return conversation.messageIds
          .map((id) => messages[id])
          .filter((m): m is Message => m !== undefined);
      },

      getConversations: (): Conversation[] => {
        const { conversations } = get();
        return Object.values(conversations);
      },

      getConversationsByType: (type): Conversation[] => {
        const { conversations } = get();
        return Object.values(conversations).filter((c) => c.type === type);
      },

      getPinnedConversations: (): Conversation[] => {
        const { conversations } = get();
        return Object.values(conversations).filter((c) => c.isPinned && !c.isArchived);
      },

      getRecentConversations: (limit = 10): Conversation[] => {
        const { conversations } = get();
        return Object.values(conversations)
          .filter((c) => !c.isArchived)
          .sort((a, b) => {
            const aTime = a.lastMessageAt ?? a.updatedAt;
            const bTime = b.lastMessageAt ?? b.updatedAt;
            return new Date(bTime).getTime() - new Date(aTime).getTime();
          })
          .slice(0, limit);
      },
    }),
    { name: 'ChatStore' }
  )
);
