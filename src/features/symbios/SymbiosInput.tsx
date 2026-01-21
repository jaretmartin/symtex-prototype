/**
 * SymbiosInput Component
 *
 * Rich input field for the Symbios chat interface.
 * Supports text input, file attachments, and keyboard shortcuts.
 */

import { useState, useRef, useCallback, type KeyboardEvent, type ChangeEvent } from 'react';
import {
  Send,
  Paperclip,
  Image,
  FileText,
  X,
  Mic,
  StopCircle,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SymbiosAttachment } from './symbios-store';

interface SymbiosInputProps {
  onSend: (content: string, attachments?: SymbiosAttachment[]) => void;
  disabled?: boolean;
  isTyping?: boolean;
  placeholder?: string;
  className?: string;
}

export function SymbiosInput({
  onSend,
  disabled = false,
  isTyping = false,
  placeholder = 'Message Aria...',
  className,
}: SymbiosInputProps): JSX.Element {
  const [value, setValue] = useState('');
  const [attachments, setAttachments] = useState<SymbiosAttachment[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle text change
  const handleChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>): void => {
    setValue(e.target.value);

    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
  }, []);

  // Handle send
  const handleSend = useCallback((): void => {
    const trimmedValue = value.trim();
    if (!trimmedValue && attachments.length === 0) return;
    if (disabled || isTyping) return;

    onSend(trimmedValue, attachments.length > 0 ? attachments : undefined);
    setValue('');
    setAttachments([]);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [value, attachments, disabled, isTyping, onSend]);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>): void => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  // Handle file selection
  const handleFileSelect = useCallback((): void => {
    fileInputRef.current?.click();
  }, []);

  // Handle file change
  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>): void => {
      const files = e.target.files;
      if (!files) return;

      const newAttachments: SymbiosAttachment[] = Array.from(files).map(
        (file) => ({
          id: `attach_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: file.type.startsWith('image/')
            ? 'image'
            : file.type.includes('text') || file.name.endsWith('.json')
            ? 'code'
            : 'file',
          name: file.name,
          mimeType: file.type,
          // In a real app, we'd upload and get a URL
          url: URL.createObjectURL(file),
        })
      );

      setAttachments((prev) => [...prev, ...newAttachments]);

      // Reset file input
      e.target.value = '';
    },
    []
  );

  // Remove attachment
  const removeAttachment = useCallback((id: string): void => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  }, []);

  // Toggle voice recording (mock)
  const toggleRecording = useCallback((): void => {
    setIsRecording((prev) => !prev);
    // In a real app, we'd handle actual voice recording here
  }, []);

  const canSend = (value.trim() || attachments.length > 0) && !disabled && !isTyping;

  return (
    <div className={cn('border-t border-border bg-surface-base/50', className)}>
      {/* Attachments preview */}
      {attachments.length > 0 && (
        <div className="px-4 pt-3 flex flex-wrap gap-2">
          {attachments.map((attachment) => (
            <AttachmentPreview
              key={attachment.id}
              attachment={attachment}
              onRemove={removeAttachment}
            />
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="flex items-end gap-2 p-4">
        {/* Attachment button */}
        <button
          onClick={handleFileSelect}
          disabled={disabled}
          className={cn(
            'flex-shrink-0 p-2 rounded-lg transition-colors',
            disabled
              ? 'text-muted-foreground cursor-not-allowed'
              : 'text-muted-foreground hover:text-foreground hover:bg-card'
          )}
          title="Attach file"
          aria-label="Attach file"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Hidden file input - using sr-only for accessibility */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileChange}
          className="sr-only"
          aria-label="Upload file attachment"
          accept="image/*,.pdf,.doc,.docx,.txt,.json,.csv"
        />

        {/* Text input */}
        <div className="flex-1 relative">
          <label htmlFor="symbios-message" className="sr-only">
            Type a message
          </label>
          <textarea
            id="symbios-message"
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className={cn(
              'w-full resize-none rounded-xl border border-border bg-card px-4 py-2.5',
              'text-sm text-foreground placeholder:text-muted-foreground',
              'focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent'
            )}
            style={{ maxHeight: '150px' }}
          />
        </div>

        {/* Voice input button */}
        <button
          onClick={toggleRecording}
          disabled={disabled}
          className={cn(
            'flex-shrink-0 p-2 rounded-lg transition-colors',
            isRecording
              ? 'text-red-400 bg-red-500/10 hover:bg-red-500/20'
              : disabled
              ? 'text-muted-foreground cursor-not-allowed'
              : 'text-muted-foreground hover:text-foreground hover:bg-card'
          )}
          title={isRecording ? 'Stop recording' : 'Voice input'}
          aria-label={isRecording ? 'Stop recording' : 'Start voice input'}
        >
          {isRecording ? (
            <StopCircle className="w-5 h-5" />
          ) : (
            <Mic className="w-5 h-5" />
          )}
        </button>

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!canSend}
          className={cn(
            'flex-shrink-0 p-2 rounded-lg transition-all',
            canSend
              ? 'bg-indigo-600 text-foreground hover:bg-indigo-500'
              : 'bg-card text-muted-foreground cursor-not-allowed'
          )}
          title="Send message (Enter)"
          aria-label={isTyping ? 'Sending message' : 'Send message'}
        >
          {isTyping ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Keyboard hint */}
      <div className="px-4 pb-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>Press Enter to send, Shift+Enter for new line</span>
        {value.length > 0 && (
          <span>{value.length} characters</span>
        )}
      </div>
    </div>
  );
}

/**
 * AttachmentPreview - Preview of an attached file
 */
interface AttachmentPreviewProps {
  attachment: SymbiosAttachment;
  onRemove: (id: string) => void;
}

function AttachmentPreview({
  attachment,
  onRemove,
}: AttachmentPreviewProps): JSX.Element {
  const getIcon = (): JSX.Element => {
    switch (attachment.type) {
      case 'image':
        return <Image className="w-4 h-4" />;
      case 'code':
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="inline-flex items-center gap-2 px-2 py-1.5 bg-card rounded-lg border border-border group">
      {/* Preview thumbnail for images */}
      {attachment.type === 'image' && attachment.url ? (
        <img
          src={attachment.url}
          alt={attachment.name}
          className="w-8 h-8 rounded object-cover"
        />
      ) : (
        <div className="w-8 h-8 rounded bg-muted flex items-center justify-center text-muted-foreground">
          {getIcon()}
        </div>
      )}

      {/* File info */}
      <div className="flex flex-col min-w-0">
        <span className="text-xs font-medium text-foreground truncate max-w-[100px]">
          {attachment.name}
        </span>
        <span className="text-[10px] text-muted-foreground capitalize">
          {attachment.type}
        </span>
      </div>

      {/* Remove button */}
      <button
        onClick={() => onRemove(attachment.id)}
        className="p-1 text-muted-foreground hover:text-foreground transition-colors"
        title="Remove attachment"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

/**
 * QuickActionButton - Inline action button for the input
 */
interface QuickActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
}

export function QuickActionButton({
  icon,
  label,
  onClick,
  className,
}: QuickActionButtonProps): JSX.Element {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg',
        'text-xs text-muted-foreground hover:text-foreground',
        'bg-card/50 hover:bg-muted/50 border border-border/50',
        'transition-colors',
        className
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

export default SymbiosInput;
