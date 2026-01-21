/**
 * Knowledge Ingest Modal
 *
 * Modal for adding new documents to the knowledge base.
 * Dispatches audit events when documents are ingested.
 */

import { useState } from 'react';
import { X, Upload, FileText, BookOpen, ClipboardList, AlertCircle } from 'lucide-react';
import { useCognateEvents } from '@/hooks';

export type DocumentType = 'document' | 'policy' | 'procedure';

interface IngestModalProps {
  open: boolean;
  onClose: () => void;
  onIngest?: (doc: IngestedDocument) => void;
}

export interface IngestedDocument {
  id: string;
  title: string;
  type: DocumentType;
  content?: string;
  tags: string[];
  createdAt: Date;
}

const DOCUMENT_TYPE_CONFIG: Record<DocumentType, { icon: React.ReactNode; label: string; description: string; color: string }> = {
  document: {
    icon: <FileText className="w-5 h-5" />,
    label: 'Document',
    description: 'General knowledge documents, specs, guides',
    color: 'border-blue-500 bg-blue-500/10 text-blue-400',
  },
  policy: {
    icon: <BookOpen className="w-5 h-5" />,
    label: 'Policy',
    description: 'Business rules, compliance guidelines',
    color: 'border-amber-500 bg-amber-500/10 text-amber-400',
  },
  procedure: {
    icon: <ClipboardList className="w-5 h-5" />,
    label: 'Procedure',
    description: 'Step-by-step processes, SOPs',
    color: 'border-emerald-500 bg-emerald-500/10 text-emerald-400',
  },
};

export function IngestModal({ open, onClose, onIngest }: IngestModalProps): JSX.Element | null {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<DocumentType>('document');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { dispatchEvent } = useCognateEvents();

  const handleIngest = async (): Promise<void> => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Create the document
      const documentId = `kb-${Date.now()}`;
      const ingestedDoc: IngestedDocument = {
        id: documentId,
        title: title.trim(),
        type,
        content: content.trim() || undefined,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        createdAt: new Date(),
      };

      // Dispatch audit event for evidence attachment
      dispatchEvent({
        type: 'evidence_attached',
        cognateId: 'system',
        payload: {
          documentId,
          title: ingestedDoc.title,
          documentType: type,
          tags: ingestedDoc.tags,
          action: 'ingest',
          source: 'knowledge_library',
        },
      });

      // Call the onIngest callback
      onIngest?.(ingestedDoc);

      // Reset form and close
      setTitle('');
      setType('document');
      setContent('');
      setTags('');
      onClose();
    } catch (err) {
      setError('Failed to ingest document. Please try again.');
      console.error('Ingest error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = (): void => {
    if (!isSubmitting) {
      setError(null);
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
        role="presentation"
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-surface-base border border-border rounded-xl shadow-2xl z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Add Knowledge Item</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Add a new document to your knowledge base
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-surface-card rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Error Alert */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title Input */}
          <div>
            <label htmlFor="doc-title" className="block text-sm font-medium text-foreground mb-2">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              id="doc-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter document title..."
              disabled={isSubmitting}
              className="w-full px-4 py-2.5 bg-surface-card/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-symtex-purple focus:ring-1 focus:ring-symtex-purple transition-all disabled:opacity-50"
            />
          </div>

          {/* Document Type */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Document Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(Object.entries(DOCUMENT_TYPE_CONFIG) as [DocumentType, typeof DOCUMENT_TYPE_CONFIG[DocumentType]][]).map(([key, config]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setType(key)}
                  disabled={isSubmitting}
                  className={`p-3 rounded-lg border-2 transition-all disabled:opacity-50 ${
                    type === key
                      ? config.color
                      : 'border-border bg-surface-card/30 text-muted-foreground hover:border-border hover:bg-surface-card/50'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    {config.icon}
                    <span className="text-xs font-medium">{config.label}</span>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {DOCUMENT_TYPE_CONFIG[type].description}
            </p>
          </div>

          {/* Content/Description */}
          <div>
            <label htmlFor="doc-content" className="block text-sm font-medium text-foreground mb-2">
              Content / Summary
            </label>
            <textarea
              id="doc-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste document content or add a summary..."
              rows={4}
              disabled={isSubmitting}
              className="w-full px-4 py-2.5 bg-surface-card/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-symtex-purple focus:ring-1 focus:ring-symtex-purple transition-all resize-none disabled:opacity-50"
            />
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="doc-tags" className="block text-sm font-medium text-foreground mb-2">
              Tags
            </label>
            <input
              id="doc-tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Enter tags separated by commas..."
              disabled={isSubmitting}
              className="w-full px-4 py-2.5 bg-surface-card/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-symtex-purple focus:ring-1 focus:ring-symtex-purple transition-all disabled:opacity-50"
            />
            <p className="text-xs text-muted-foreground mt-1">
              e.g., sales, onboarding, compliance
            </p>
          </div>

          {/* File Upload Hint */}
          <div className="flex items-center gap-3 p-3 bg-surface-elevated/30 rounded-lg border border-dashed border-border">
            <Upload className="w-5 h-5 text-muted-foreground" />
            <div className="text-sm">
              <p className="text-muted-foreground">
                File upload coming soon. For now, paste content directly.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-surface-card/20">
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-4 py-2.5 text-muted-foreground hover:text-foreground font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleIngest}
            disabled={isSubmitting || !title.trim()}
            className="px-6 py-2.5 bg-symtex-purple hover:bg-purple-600 text-foreground font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
                <span>Adding...</span>
              </>
            ) : (
              <span>Add to Knowledge Base</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default IngestModal;
