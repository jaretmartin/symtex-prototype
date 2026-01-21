/**
 * Knowledge Library Page
 *
 * Document repository with search, filtering, and document ingestion.
 * Part of WF3: Knowledge -> Cite in Symbios -> View Citations -> Audit Event
 */

import { useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Plus,
  FileText,
  BookOpen,
  ClipboardList,
  Filter,
  SortAsc,
  SortDesc,
  Calendar,
  Link2,
  ExternalLink,
  MoreHorizontal,
  ChevronDown,
} from 'lucide-react';
import { IngestModal, type IngestedDocument, type DocumentType } from '@/components/knowledge';

// ============================================================================
// TYPES
// ============================================================================

interface KnowledgeDocument {
  id: string;
  title: string;
  type: DocumentType;
  excerpt: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  citations: number;
  author: string;
}

type SortField = 'title' | 'updatedAt' | 'citations';
type SortDirection = 'asc' | 'desc';

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_DOCUMENTS: KnowledgeDocument[] = [
  {
    id: 'kb-001',
    title: 'Customer Support SOP v2.3',
    type: 'procedure',
    excerpt: 'Standard operating procedures for customer support team including escalation paths, response templates, and quality guidelines.',
    tags: ['support', 'sop', 'customer-service'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-03-20'),
    citations: 47,
    author: 'Support Team',
  },
  {
    id: 'kb-002',
    title: 'Q4 Sales Policy Update',
    type: 'policy',
    excerpt: 'Updated pricing structures, discount authorization levels, and commission guidelines for Q4 2024.',
    tags: ['sales', 'pricing', 'policy'],
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10'),
    citations: 23,
    author: 'Sales Ops',
  },
  {
    id: 'kb-003',
    title: 'Product Specification Document',
    type: 'document',
    excerpt: 'Technical specifications for the Symtex Pro platform including architecture overview, API documentation, and integration guides.',
    tags: ['product', 'technical', 'api'],
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-18'),
    citations: 89,
    author: 'Engineering',
  },
  {
    id: 'kb-004',
    title: 'Security Compliance Guidelines',
    type: 'policy',
    excerpt: 'SOC2 compliance requirements, data handling procedures, and security best practices for all team members.',
    tags: ['security', 'compliance', 'soc2'],
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
    citations: 156,
    author: 'Security Team',
  },
  {
    id: 'kb-005',
    title: 'Onboarding Checklist',
    type: 'procedure',
    excerpt: 'Step-by-step onboarding process for new team members including system access, training modules, and first-week goals.',
    tags: ['hr', 'onboarding', 'checklist'],
    createdAt: new Date('2024-02-28'),
    updatedAt: new Date('2024-03-15'),
    citations: 34,
    author: 'HR Team',
  },
  {
    id: 'kb-006',
    title: 'Marketing Brand Guidelines',
    type: 'document',
    excerpt: 'Official brand guidelines including logo usage, color palettes, typography, and voice & tone standards.',
    tags: ['marketing', 'brand', 'design'],
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-02-15'),
    citations: 67,
    author: 'Marketing',
  },
  {
    id: 'kb-007',
    title: 'Data Retention Policy',
    type: 'policy',
    excerpt: 'Guidelines for data storage, retention periods, and deletion procedures across all systems and applications.',
    tags: ['data', 'compliance', 'retention'],
    createdAt: new Date('2024-01-30'),
    updatedAt: new Date('2024-01-30'),
    citations: 42,
    author: 'Legal',
  },
  {
    id: 'kb-008',
    title: 'API Integration Guide',
    type: 'document',
    excerpt: 'Developer guide for integrating with the Symtex API including authentication, endpoints, and code examples.',
    tags: ['api', 'developer', 'integration'],
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-03-19'),
    citations: 112,
    author: 'DevRel',
  },
];

// ============================================================================
// DOCUMENT TYPE CONFIG
// ============================================================================

const DOCUMENT_TYPE_CONFIG: Record<DocumentType, { icon: React.ReactNode; color: string; bg: string; label: string }> = {
  document: {
    icon: <FileText className="w-4 h-4" />,
    color: 'text-blue-400',
    bg: 'bg-blue-500/20',
    label: 'Document',
  },
  policy: {
    icon: <BookOpen className="w-4 h-4" />,
    color: 'text-amber-400',
    bg: 'bg-amber-500/20',
    label: 'Policy',
  },
  procedure: {
    icon: <ClipboardList className="w-4 h-4" />,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/20',
    label: 'Procedure',
  },
};

// ============================================================================
// COMPONENTS
// ============================================================================

interface DocumentCardProps {
  document: KnowledgeDocument;
  onViewInLedger: (docId: string) => void;
}

function DocumentCard({ document, onViewInLedger }: DocumentCardProps): JSX.Element {
  const config = DOCUMENT_TYPE_CONFIG[document.type];
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="group p-4 bg-surface-card/50 border border-border rounded-xl hover:border-symtex-purple/30 hover:bg-surface-card/80 transition-all">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`p-2.5 rounded-lg ${config.bg} ${config.color} flex-shrink-0`}>
          {config.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}>
                {config.label}
              </span>
              <h3 className="mt-2 text-base font-semibold text-foreground group-hover:text-symtex-purple transition-colors line-clamp-1">
                {document.title}
              </h3>
            </div>

            {/* Actions Menu */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-surface-elevated/50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              {isMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-1 w-48 bg-surface-base border border-border rounded-lg shadow-xl z-20 py-1">
                    <button
                      onClick={() => {
                        onViewInLedger(document.id);
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-surface-card/50 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View in Ledger
                    </button>
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-surface-card/50 transition-colors"
                    >
                      <Link2 className="w-4 h-4" />
                      Copy Citation Link
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
            {document.excerpt}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {document.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-surface-elevated/50 rounded text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}
            {document.tags.length > 3 && (
              <span className="px-2 py-0.5 text-xs text-muted-foreground">
                +{document.tags.length - 3}
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(document.updatedAt)}
              </span>
              <span className="flex items-center gap-1">
                <Link2 className="w-3 h-3" />
                {document.citations} citations
              </span>
            </div>
            <span className="text-xs text-muted-foreground">{document.author}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface FilterDropdownProps {
  label: string;
  icon: React.ReactNode;
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (values: string[]) => void;
}

function FilterDropdown({ label, icon, options, selected, onChange }: FilterDropdownProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (value: string): void => {
    if (selected.includes(value)) {
      onChange(selected.filter(v => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
          selected.length > 0
            ? 'border-symtex-purple bg-symtex-purple/10 text-symtex-purple'
            : 'border-border bg-surface-card/50 text-muted-foreground hover:text-foreground hover:bg-surface-card'
        }`}
      >
        {icon}
        <span className="text-sm">{label}</span>
        {selected.length > 0 && (
          <span className="px-1.5 py-0.5 bg-symtex-purple rounded text-xs text-foreground">
            {selected.length}
          </span>
        )}
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-1 w-48 bg-surface-base border border-border rounded-lg shadow-xl z-20 py-1">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => toggleOption(option.value)}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-surface-card/50 transition-colors"
              >
                <div className={`w-4 h-4 rounded border ${
                  selected.includes(option.value)
                    ? 'bg-symtex-purple border-symtex-purple'
                    : 'border-border'
                }`}>
                  {selected.includes(option.value) && (
                    <svg className="w-4 h-4 text-foreground" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
                    </svg>
                  )}
                </div>
                <span className="text-foreground">{option.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function KnowledgeLibrary(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialAction = searchParams.get('action');

  const [documents, setDocuments] = useState<KnowledgeDocument[]>(MOCK_DOCUMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<DocumentType[]>([]);
  const [sortField, setSortField] = useState<SortField>('updatedAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [isIngestModalOpen, setIsIngestModalOpen] = useState(initialAction === 'add');

  // Filter and sort documents
  const filteredDocuments = useMemo(() => {
    let filtered = [...documents];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        doc =>
          doc.title.toLowerCase().includes(query) ||
          doc.excerpt.toLowerCase().includes(query) ||
          doc.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Type filter
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(doc => selectedTypes.includes(doc.type));
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'updatedAt':
          comparison = a.updatedAt.getTime() - b.updatedAt.getTime();
          break;
        case 'citations':
          comparison = a.citations - b.citations;
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [documents, searchQuery, selectedTypes, sortField, sortDirection]);

  const handleIngest = useCallback((doc: IngestedDocument): void => {
    const newDocument: KnowledgeDocument = {
      id: doc.id,
      title: doc.title,
      type: doc.type,
      excerpt: doc.content || 'No description provided.',
      tags: doc.tags,
      createdAt: doc.createdAt,
      updatedAt: doc.createdAt,
      citations: 0,
      author: 'You',
    };
    setDocuments(prev => [newDocument, ...prev]);
  }, []);

  const handleViewInLedger = useCallback((docId: string): void => {
    // Navigate to ledger with document filter
    window.location.href = `/control/ledger?docId=${docId}`;
  }, []);

  const handleOpenIngestModal = (): void => {
    setIsIngestModalOpen(true);
    setSearchParams({});
  };

  const handleCloseIngestModal = (): void => {
    setIsIngestModalOpen(false);
    setSearchParams({});
  };

  const toggleSortDirection = (): void => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Knowledge Library
            </h1>
            <p className="text-muted-foreground mt-1">
              {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''} in your knowledge base
            </p>
          </div>
          <button
            onClick={handleOpenIngestModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-symtex-purple hover:bg-purple-600 text-foreground font-medium rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Document</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents..."
              className="w-full pl-12 pr-4 py-2.5 bg-surface-card/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-symtex-purple focus:ring-1 focus:ring-symtex-purple transition-all"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <FilterDropdown
              label="Type"
              icon={<Filter className="w-4 h-4" />}
              options={[
                { value: 'document', label: 'Documents' },
                { value: 'policy', label: 'Policies' },
                { value: 'procedure', label: 'Procedures' },
              ]}
              selected={selectedTypes}
              onChange={(values) => setSelectedTypes(values as DocumentType[])}
            />

            {/* Sort */}
            <div className="flex items-center gap-1 border border-border rounded-lg overflow-hidden">
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value as SortField)}
                className="px-3 py-2 bg-surface-card/50 text-sm text-foreground border-none focus:outline-none cursor-pointer"
              >
                <option value="updatedAt">Updated</option>
                <option value="title">Title</option>
                <option value="citations">Citations</option>
              </select>
              <button
                onClick={toggleSortDirection}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-surface-card/50 transition-colors"
              >
                {sortDirection === 'asc' ? (
                  <SortAsc className="w-4 h-4" />
                ) : (
                  <SortDesc className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredDocuments.map((doc) => (
          <DocumentCard
            key={doc.id}
            document={doc}
            onViewInLedger={handleViewInLedger}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredDocuments.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-card flex items-center justify-center">
            <FileText className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No documents found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || selectedTypes.length > 0
              ? 'Try adjusting your search or filters'
              : 'Add your first document to get started'}
          </p>
          {!searchQuery && selectedTypes.length === 0 && (
            <button
              onClick={handleOpenIngestModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-symtex-purple hover:bg-purple-600 text-foreground font-medium rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Document</span>
            </button>
          )}
        </div>
      )}

      {/* Ingest Modal */}
      <IngestModal
        open={isIngestModalOpen}
        onClose={handleCloseIngestModal}
        onIngest={handleIngest}
      />
    </div>
  );
}
