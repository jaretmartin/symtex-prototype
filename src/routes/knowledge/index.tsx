/**
 * Knowledge Index Page
 *
 * Landing page for the Knowledge section providing access to:
 * - Knowledge Library (documents)
 * - Templates
 * - NEXIS Graph
 */

import { Link } from 'react-router-dom';
import {
  BookOpen,
  FileText,
  Network,
  LayoutTemplate,
  ArrowRight,
  Search,
  Plus,
} from 'lucide-react';

interface KnowledgeSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color: string;
  bgColor: string;
  stats?: string;
}

const KNOWLEDGE_SECTIONS: KnowledgeSection[] = [
  {
    id: 'library',
    title: 'Knowledge Library',
    description: 'Browse and search your document repository. Add new documents, policies, and procedures.',
    icon: <BookOpen className="w-6 h-6" />,
    path: '/knowledge/library',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    stats: '247 documents',
  },
  {
    id: 'templates',
    title: 'Templates',
    description: 'Pre-built templates for reports, presentations, documentation, and more.',
    icon: <LayoutTemplate className="w-6 h-6" />,
    path: '/knowledge/templates',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    stats: '12 templates',
  },
  {
    id: 'nexis',
    title: 'NEXIS Graph',
    description: 'Visualize knowledge connections and discover relationships between documents.',
    icon: <Network className="w-6 h-6" />,
    path: '/knowledge/nexis',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/20',
    stats: '1,432 connections',
  },
];

interface RecentDocument {
  id: string;
  title: string;
  type: 'document' | 'policy' | 'procedure';
  updatedAt: string;
}

const RECENT_DOCUMENTS: RecentDocument[] = [
  { id: '1', title: 'Customer Support SOP v2.3', type: 'procedure', updatedAt: '2 hours ago' },
  { id: '2', title: 'Q4 Sales Policy Update', type: 'policy', updatedAt: '5 hours ago' },
  { id: '3', title: 'Product Specification Doc', type: 'document', updatedAt: '1 day ago' },
  { id: '4', title: 'Security Compliance Guidelines', type: 'policy', updatedAt: '2 days ago' },
  { id: '5', title: 'Onboarding Checklist', type: 'procedure', updatedAt: '3 days ago' },
];

function SectionCard({ section }: { section: KnowledgeSection }): JSX.Element {
  return (
    <Link
      to={section.path}
      className="group block p-6 bg-surface-card/50 border border-border rounded-xl hover:border-symtex-purple/50 hover:bg-surface-card/80 transition-all duration-200"
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl ${section.bgColor} ${section.color}`}>
          {section.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-symtex-purple transition-colors">
              {section.title}
            </h3>
            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-symtex-purple group-hover:translate-x-1 transition-all" />
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            {section.description}
          </p>
          {section.stats && (
            <span className="text-xs font-medium text-muted-foreground bg-surface-elevated/50 px-2 py-1 rounded">
              {section.stats}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

function RecentDocumentItem({ doc }: { doc: RecentDocument }): JSX.Element {
  const typeConfig = {
    document: { color: 'text-blue-400', bg: 'bg-blue-500/20' },
    policy: { color: 'text-amber-400', bg: 'bg-amber-500/20' },
    procedure: { color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
  };

  const config = typeConfig[doc.type];

  return (
    <Link
      to={`/knowledge/library?doc=${doc.id}`}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-card/50 transition-colors group"
    >
      <div className={`p-2 rounded-lg ${config.bg}`}>
        <FileText className={`w-4 h-4 ${config.color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate group-hover:text-symtex-purple transition-colors">
          {doc.title}
        </p>
        <p className="text-xs text-muted-foreground">
          {doc.type.charAt(0).toUpperCase() + doc.type.slice(1)} - {doc.updatedAt}
        </p>
      </div>
    </Link>
  );
}

export default function KnowledgeIndex(): JSX.Element {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Knowledge
            </h1>
            <p className="text-muted-foreground mt-1">
              Your centralized knowledge base for documents, policies, and procedures
            </p>
          </div>
          <Link
            to="/knowledge/library?action=add"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-symtex-purple hover:bg-purple-600 text-foreground font-medium rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Document</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search across all knowledge..."
            className="w-full pl-12 pr-4 py-3 bg-surface-card/50 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-symtex-purple focus:ring-1 focus:ring-symtex-purple transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Sections */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-foreground mb-4">Browse Knowledge</h2>
          {KNOWLEDGE_SECTIONS.map((section) => (
            <SectionCard key={section.id} section={section} />
          ))}
        </div>

        {/* Recent Documents Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-surface-card/30 border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Recent Documents</h2>
              <Link
                to="/knowledge/library"
                className="text-sm text-symtex-purple hover:text-purple-400 transition-colors"
              >
                View all
              </Link>
            </div>
            <div className="space-y-1">
              {RECENT_DOCUMENTS.map((doc) => (
                <RecentDocumentItem key={doc.id} doc={doc} />
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-surface-card/30 border border-border rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-foreground">247</p>
              <p className="text-xs text-muted-foreground">Total Documents</p>
            </div>
            <div className="bg-surface-card/30 border border-border rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-foreground">89%</p>
              <p className="text-xs text-muted-foreground">Citation Coverage</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
