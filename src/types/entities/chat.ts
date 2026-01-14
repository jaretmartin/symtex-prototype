/**
 * Chat and messaging types
 *
 * Defines the structure for conversations, messages, and attachments
 * used in the AI chat interface.
 */

import type { ContextState } from './context';

/**
 * Role of the message sender
 */
export type MessageRole = 'user' | 'assistant' | 'system';

/**
 * Status of a message
 */
export type MessageStatus = 'pending' | 'sent' | 'delivered' | 'error';

/**
 * Types of attachments that can be included with messages
 */
export type AttachmentType = 'file' | 'image' | 'code';

/**
 * Type of conversation
 */
export type ConversationType = 'chat' | 'mission' | 'review' | 'debug';

/**
 * An attachment included with a chat message
 */
export interface Attachment {
  /** Unique identifier for the attachment */
  id: string;
  /** The type of attachment */
  type: AttachmentType;
  /** Display name for the attachment */
  name: string;
  /** URL for externally hosted attachments */
  url?: string;
  /** Inline content for small attachments */
  content?: string;
}

/**
 * A single message in a conversation (spec interface)
 */
export interface ChatMessage {
  /** Unique identifier for the message */
  id: string;
  /** The role of the message sender */
  role: MessageRole;
  /** The text content of the message */
  content: string;
  /** ISO timestamp when the message was sent */
  timestamp: string;
  /** ID of the cognate that sent/generated this message */
  cognateId?: string;
  /** ID of the reasoning trace for transparency */
  reasoningTraceId?: string;
  /** Attachments included with this message */
  attachments?: Attachment[];
}

/**
 * A message with store-specific fields (used by useChatStore)
 */
export interface Message {
  /** Unique identifier for the message */
  id: string;
  /** ID of the conversation this message belongs to */
  conversationId: string;
  /** The role of the message sender */
  role: MessageRole;
  /** The text content of the message */
  content: string;
  /** Delivery status of the message */
  status: MessageStatus;
  /** Attachments included with this message */
  attachments?: Attachment[];
  /** Optional metadata (e.g., tool calls, reasoning) */
  metadata?: Record<string, unknown>;
  /** ISO timestamp when the message was created */
  createdAt: string;
  /** ISO timestamp when the message was edited */
  editedAt?: string;
  /** ID of the parent message (for threading) */
  parentMessageId?: string;
  /** ID of the cognate that sent/generated this message */
  cognateId?: string;
  /** ID of the reasoning trace for transparency */
  reasoningTraceId?: string;
}

/**
 * A conversation containing multiple messages
 */
export interface Conversation {
  /** Unique identifier for the conversation */
  id: string;
  /** Title for the conversation */
  title: string;
  /** Type of conversation */
  type: ConversationType;
  /** IDs of messages in this conversation (in order) */
  messageIds: string[];
  /** Embedded messages for spec-compliant usage */
  messages?: ChatMessage[];
  /** Snapshot of the context when conversation started */
  contextSnapshot?: ContextState;
  /** ID of the associated entity (mission, project, etc.) */
  entityId?: string;
  /** Type of the associated entity */
  entityType?: 'mission' | 'project' | 'domain';
  /** ID of the assigned agent/cognate (if any) */
  agentId?: string;
  /** Whether the conversation is pinned */
  isPinned: boolean;
  /** Whether the conversation is archived */
  isArchived: boolean;
  /** ISO timestamp when the conversation was created */
  createdAt: string;
  /** ISO timestamp when the conversation was last updated */
  updatedAt: string;
  /** ISO timestamp of the last message */
  lastMessageAt?: string;
}

/**
 * Configuration for chat behavior
 */
export interface ChatConfig {
  /** Maximum number of messages to retain in memory */
  maxMessages: number;
  /** Whether to include system messages in the UI */
  showSystemMessages: boolean;
  /** Default cognate ID to use for new conversations */
  defaultCognateId?: string;
  /** Whether to auto-scroll to new messages */
  autoScroll: boolean;
}

/**
 * State for the chat input component
 */
export interface ChatInputState {
  /** Current draft message text */
  draft: string;
  /** Attachments queued to be sent */
  pendingAttachments: Attachment[];
  /** Whether a message is currently being sent */
  isSending: boolean;
  /** Whether the AI is currently generating a response */
  isGenerating: boolean;
}

/**
 * Metadata for conversation search and filtering
 */
export interface ConversationMetadata {
  /** ID of the conversation */
  conversationId: string;
  /** Number of messages in the conversation */
  messageCount: number;
  /** IDs of participants (cognates) */
  participantIds: string[];
  /** Tags for organization */
  tags: string[];
  /** Whether the conversation is pinned */
  isPinned: boolean;
  /** Whether the conversation is archived */
  isArchived: boolean;
}

/**
 * Participant in a conversation
 */
export interface ConversationParticipant {
  /** Unique identifier for the participant */
  id: string;
  /** Type of participant */
  type: 'user' | 'agent';
  /** Display name */
  name: string;
  /** Avatar URL */
  avatar?: string;
  /** Last seen timestamp */
  lastSeenAt?: string;
}
