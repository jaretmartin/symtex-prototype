/**
 * Chat System Components
 *
 * Phase 2.6 - Complete chat interface components for AI conversations.
 *
 * Components:
 * - ChatPanel: Main container for the chat interface
 * - ChatMessage: Individual message display with role-based styling
 * - ChatInput: Text input with attachments and keyboard shortcuts
 * - StreamingText: Animated streaming text display with typing indicator
 * - ChatContextInfo: Context breadcrumb and badge displays
 * - SuggestionChips: Clickable quick action suggestions
 * - AttachmentPreview: File and image attachment previews
 * - ConversationList: Conversation list with search and filtering
 */

// Main container
export { ChatPanel } from './ChatPanel';

// Message components
export { ChatMessage } from './ChatMessage';
export { StreamingText, useStreamingText } from './StreamingText';

// Input components
export { ChatInput } from './ChatInput';
export {
  SuggestionChips,
  DEFAULT_SUGGESTIONS,
  useSuggestions,
} from './SuggestionChips';

// Context display
export { ChatContextInfo, ChatContextBadge } from './ChatContextInfo';

// Attachment handling
export { AttachmentPreview, AttachmentGrid } from './AttachmentPreview';

// Conversation management
export { ConversationList } from './ConversationList';
