/**
 * AttachmentPreview Component
 *
 * Displays previews for message attachments including images, files, and code.
 * Supports different sizes and interactive states.
 */

import { useState, useCallback } from 'react';
import {
  Code,
  Download,
  ExternalLink,
  X,
  Eye,
  File,
} from 'lucide-react';
import type { Attachment, AttachmentType } from '@/types';

interface AttachmentPreviewProps {
  /** The attachment to display */
  attachment: Attachment;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to show remove button */
  removable?: boolean;
  /** Callback when remove is clicked */
  onRemove?: () => void;
  /** Whether the preview is clickable to expand */
  expandable?: boolean;
  /** Callback when expanded */
  onExpand?: () => void;
  /** Additional CSS classes */
  className?: string;
}


/**
 * Returns file extension from filename
 */
function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : 'FILE';
}

/**
 * Returns color class based on file type
 */
function getTypeColor(type: AttachmentType, extension?: string): string {
  if (type === 'image') return 'text-blue-400';
  if (type === 'code') return 'text-green-400';

  // Color by extension for files
  const ext = extension?.toLowerCase();
  switch (ext) {
    case 'pdf':
      return 'text-red-400';
    case 'doc':
    case 'docx':
      return 'text-blue-400';
    case 'xls':
    case 'xlsx':
    case 'csv':
      return 'text-green-400';
    case 'json':
    case 'md':
    case 'txt':
      return 'text-slate-400';
    default:
      return 'text-slate-400';
  }
}

/**
 * Size configurations for the preview
 */
const sizeConfigs = {
  sm: {
    container: 'h-12',
    icon: 'w-4 h-4',
    text: 'text-xs',
    padding: 'px-2 py-1',
    maxWidth: 'max-w-[150px]',
    imageSize: 'w-12 h-12',
  },
  md: {
    container: 'h-16',
    icon: 'w-5 h-5',
    text: 'text-sm',
    padding: 'px-3 py-2',
    maxWidth: 'max-w-[200px]',
    imageSize: 'w-16 h-16',
  },
  lg: {
    container: 'h-24',
    icon: 'w-6 h-6',
    text: 'text-base',
    padding: 'px-4 py-3',
    maxWidth: 'max-w-[280px]',
    imageSize: 'w-24 h-24',
  },
};

/**
 * Displays a preview of a message attachment
 */
export function AttachmentPreview({
  attachment,
  size = 'md',
  removable = false,
  onRemove,
  expandable = false,
  onExpand,
  className = '',
}: AttachmentPreviewProps): JSX.Element {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const config = sizeConfigs[size];
  const extension = getFileExtension(attachment.name);
  const typeColor = getTypeColor(attachment.type, extension);

  const handleImageLoad = useCallback((): void => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback((): void => {
    setImageError(true);
  }, []);

  // Image attachment with preview
  if (attachment.type === 'image' && attachment.url && !imageError) {
    return (
      <div
        className={`relative group rounded-lg overflow-hidden border border-symtex-border ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image preview */}
        <div className={`${config.imageSize} bg-slate-800`}>
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-symtex-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <img
            src={attachment.url}
            alt={attachment.name}
            onLoad={handleImageLoad}
            onError={handleImageError}
            className={`w-full h-full object-cover transition-opacity duration-200 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>

        {/* Hover overlay */}
        <div
          className={`absolute inset-0 bg-slate-900/70 flex items-center justify-center gap-2 transition-opacity duration-200 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {expandable && (
            <button
              onClick={onExpand}
              className="p-1.5 bg-slate-700/80 text-white rounded-md hover:bg-slate-600 transition-colors"
              aria-label="View image"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
          {attachment.url && (
            <a
              href={attachment.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 bg-slate-700/80 text-white rounded-md hover:bg-slate-600 transition-colors"
              aria-label="Open in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Remove button */}
        {removable && (
          <button
            onClick={onRemove}
            className="absolute -top-1.5 -right-1.5 p-1 bg-slate-700 text-slate-300 rounded-full border border-slate-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors opacity-0 group-hover:opacity-100"
            aria-label={`Remove ${attachment.name}`}
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
    );
  }

  // File/code attachment with icon
  return (
    <div
      className={`relative group flex items-center gap-2 bg-symtex-card border border-symtex-border rounded-lg transition-colors hover:border-slate-600 ${config.container} ${config.padding} ${config.maxWidth} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* File type icon/badge */}
      <div
        className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-slate-800/50 ${typeColor}`}
      >
        {attachment.type === 'code' ? (
          <Code className={config.icon} />
        ) : (
          <div className="flex flex-col items-center">
            <File className="w-4 h-4 mb-0.5" />
            <span className="text-[8px] font-bold leading-none">{extension}</span>
          </div>
        )}
      </div>

      {/* File info */}
      <div className="flex-1 min-w-0 overflow-hidden">
        <p
          className={`font-medium text-slate-200 truncate ${config.text}`}
          title={attachment.name}
        >
          {attachment.name}
        </p>
        <p className="text-xs text-slate-500">{extension} file</p>
      </div>

      {/* Actions */}
      <div
        className={`flex items-center gap-1 transition-opacity duration-200 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {expandable && attachment.content && (
          <button
            onClick={onExpand}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-md hover:bg-slate-700/50 transition-colors"
            aria-label="Preview file"
          >
            <Eye className="w-4 h-4" />
          </button>
        )}
        {attachment.url && (
          <a
            href={attachment.url}
            download={attachment.name}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-md hover:bg-slate-700/50 transition-colors"
            aria-label="Download file"
          >
            <Download className="w-4 h-4" />
          </a>
        )}
      </div>

      {/* Remove button */}
      {removable && (
        <button
          onClick={onRemove}
          className="absolute -top-1.5 -right-1.5 p-1 bg-slate-700 text-slate-300 rounded-full border border-slate-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors opacity-0 group-hover:opacity-100"
          aria-label={`Remove ${attachment.name}`}
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

/**
 * Grid display for multiple attachments
 */
export function AttachmentGrid({
  attachments,
  size = 'md',
  removable = false,
  onRemove,
  expandable = false,
  onExpand,
  className = '',
}: {
  attachments: Attachment[];
  size?: 'sm' | 'md' | 'lg';
  removable?: boolean;
  onRemove?: (id: string) => void;
  expandable?: boolean;
  onExpand?: (attachment: Attachment) => void;
  className?: string;
}): JSX.Element {
  if (attachments.length === 0) {
    return <></>;
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {attachments.map((attachment) => (
        <AttachmentPreview
          key={attachment.id}
          attachment={attachment}
          size={size}
          removable={removable}
          onRemove={() => onRemove?.(attachment.id)}
          expandable={expandable}
          onExpand={() => onExpand?.(attachment)}
        />
      ))}
    </div>
  );
}
