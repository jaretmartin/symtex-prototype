/**
 * ChatInput Component
 *
 * Text input with auto-expanding textarea, send button, and attachment support.
 * Handles keyboard shortcuts for sending messages.
 */

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type KeyboardEvent,
  type ChangeEvent,
} from 'react';
import { Send, Paperclip, X, Image, FileText } from 'lucide-react';
import type { Attachment } from '@/types';

interface ChatInputProps {
  /** Callback when user sends a message */
  onSend: (content: string, attachments?: Attachment[]) => void;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Placeholder text for the input */
  placeholder?: string;
  /** Maximum character count (optional) */
  maxLength?: number;
  /** Whether to show character count */
  showCharCount?: boolean;
}

/**
 * Generates a unique ID for attachments
 */
function generateId(): string {
  return `attach-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Chat input with auto-expanding textarea and attachment support
 */
export function ChatInput({
  onSend,
  disabled = false,
  placeholder = 'Type a message...',
  maxLength,
  showCharCount = false,
}: ChatInputProps): JSX.Element {
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canSend = content.trim().length > 0 || attachments.length > 0;

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [content]);

  const handleSend = useCallback((): void => {
    if (!canSend || disabled) return;

    onSend(content.trim(), attachments.length > 0 ? attachments : undefined);
    setContent('');
    setAttachments([]);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [content, attachments, canSend, disabled, onSend]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>): void => {
      // Enter to send, Shift+Enter for newline
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>): void => {
      const value = e.target.value;
      if (maxLength && value.length > maxLength) return;
      setContent(value);
    },
    [maxLength]
  );

  const handleAttachmentClick = useCallback((): void => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>): void => {
      const files = e.target.files;
      if (!files) return;

      const newAttachments: Attachment[] = Array.from(files).map((file) => ({
        id: generateId(),
        type: file.type.startsWith('image/') ? 'image' : 'file',
        name: file.name,
        url: URL.createObjectURL(file),
      }));

      setAttachments((prev) => [...prev, ...newAttachments]);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    []
  );

  const removeAttachment = useCallback((id: string): void => {
    setAttachments((prev) => {
      const attachment = prev.find((a) => a.id === id);
      if (attachment?.url) {
        URL.revokeObjectURL(attachment.url);
      }
      return prev.filter((a) => a.id !== id);
    });
  }, []);

  return (
    <div className="flex flex-col gap-2">
      {/* Attachment previews */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 px-2">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center gap-2 px-3 py-1.5 bg-card border border-border rounded-lg text-sm"
            >
              {attachment.type === 'image' ? (
                <Image className="w-4 h-4 text-symtex-primary" />
              ) : (
                <FileText className="w-4 h-4 text-muted-foreground" />
              )}
              <span className="text-muted-foreground max-w-[150px] truncate">
                {attachment.name}
              </span>
              <button
                onClick={() => removeAttachment(attachment.id)}
                className="p-0.5 text-muted-foreground hover:text-muted-foreground rounded transition-colors"
                aria-label={`Remove ${attachment.name}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="relative flex items-end gap-2 p-2 bg-card border border-border rounded-2xl focus-within:border-symtex-primary/50 transition-colors">
        {/* Attachment button */}
        <button
          onClick={handleAttachmentClick}
          disabled={disabled}
          className="flex-shrink-0 p-2 text-muted-foreground hover:text-muted-foreground rounded-lg hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Add attachment"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx,.txt,.md,.json,.csv"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none bg-transparent text-muted-foreground placeholder-muted-foreground outline-none text-sm py-2 max-h-[200px] disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Message input"
        />

        {/* Character count */}
        {showCharCount && maxLength && (
          <span
            className={`flex-shrink-0 text-xs mr-2 ${
              content.length > maxLength * 0.9
                ? 'text-warning'
                : 'text-muted-foreground'
            }`}
          >
            {content.length}/{maxLength}
          </span>
        )}

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!canSend || disabled}
          className="flex-shrink-0 p-2 bg-gradient-to-r from-symtex-primary to-symtex-accent text-foreground rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed enabled:hover:shadow-lg enabled:hover:shadow-symtex-primary/30"
          aria-label="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

      {/* Keyboard hint */}
      <p className="text-xs text-muted-foreground text-center">
        Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-muted-foreground">Enter</kbd> to send,{' '}
        <kbd className="px-1.5 py-0.5 bg-muted rounded text-muted-foreground">Shift + Enter</kbd> for new line
      </p>
    </div>
  );
}
