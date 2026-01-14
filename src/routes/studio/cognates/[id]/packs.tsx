/**
 * SOP Packs Browser Page
 *
 * Browse and install pre-built SOP packs for a Cognate.
 */

import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  Package,
  Star,
  Download,
  Check,
  Users,
  Tag,
} from 'lucide-react';
import { useCognateStore } from '@/store';
import type { SOPPack } from '@/types';

// Mock pack data
const MOCK_PACKS: SOPPack[] = [
  {
    id: 'pack-1',
    name: 'Healthcare Core',
    description: 'Essential SOPs for healthcare and medical applications. Includes HIPAA compliance, patient interaction protocols, and medical terminology handling.',
    type: 'industry',
    sopCount: 12,
    installCount: 1523,
    rating: 4.8,
    tags: ['healthcare', 'hipaa', 'compliance', 'medical'],
    author: 'Symtex Team',
    version: '2.1.0',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-18T00:00:00Z',
  },
  {
    id: 'pack-2',
    name: 'Financial Compliance',
    description: 'Regulatory compliance SOPs for financial services. Covers KYC, AML, and standard financial reporting requirements.',
    type: 'compliance',
    sopCount: 18,
    installCount: 892,
    rating: 4.9,
    tags: ['finance', 'compliance', 'kyc', 'aml', 'regulatory'],
    author: 'Symtex Team',
    version: '1.5.0',
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'pack-3',
    name: 'Customer Support Essentials',
    description: 'Core SOPs for customer support agents. Handles greetings, escalations, feedback collection, and issue resolution.',
    type: 'role',
    sopCount: 15,
    installCount: 3421,
    rating: 4.7,
    tags: ['support', 'customer-service', 'helpdesk'],
    author: 'Symtex Team',
    version: '3.0.0',
    createdAt: '2023-12-01T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
  },
  {
    id: 'pack-4',
    name: 'Sales Outreach',
    description: 'SOPs for sales-focused Cognates. Includes lead qualification, follow-up sequences, and objection handling.',
    type: 'role',
    sopCount: 10,
    installCount: 1876,
    rating: 4.6,
    tags: ['sales', 'outreach', 'leads', 'crm'],
    author: 'Community',
    version: '1.2.0',
    createdAt: '2024-01-08T00:00:00Z',
    updatedAt: '2024-01-16T00:00:00Z',
  },
  {
    id: 'pack-5',
    name: 'E-Commerce Starter',
    description: 'Quick-start pack for e-commerce support. Covers order inquiries, returns, shipping, and product questions.',
    type: 'starter',
    sopCount: 8,
    installCount: 2134,
    rating: 4.5,
    tags: ['ecommerce', 'retail', 'orders', 'shipping'],
    author: 'Symtex Team',
    version: '1.0.0',
    createdAt: '2024-01-12T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z',
  },
  {
    id: 'pack-6',
    name: 'Content Writing Assistant',
    description: 'SOPs for content creation workflows. Includes style guides, SEO optimization, and editorial review processes.',
    type: 'role',
    sopCount: 7,
    installCount: 654,
    rating: 4.4,
    tags: ['writing', 'content', 'seo', 'editorial'],
    author: 'Community',
    version: '0.9.0',
    createdAt: '2024-01-14T00:00:00Z',
    updatedAt: '2024-01-17T00:00:00Z',
  },
  {
    id: 'pack-7',
    name: 'Data Privacy (GDPR)',
    description: 'GDPR compliance SOPs for handling personal data. Includes consent management, data access requests, and erasure protocols.',
    type: 'compliance',
    sopCount: 11,
    installCount: 1245,
    rating: 4.8,
    tags: ['gdpr', 'privacy', 'compliance', 'europe'],
    author: 'Symtex Team',
    version: '2.0.0',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-19T00:00:00Z',
  },
  {
    id: 'pack-8',
    name: 'Tech Support Toolkit',
    description: 'Technical support SOPs for IT and software products. Covers troubleshooting flows, ticket routing, and knowledge base integration.',
    type: 'role',
    sopCount: 14,
    installCount: 987,
    rating: 4.6,
    tags: ['tech-support', 'it', 'troubleshooting', 'tickets'],
    author: 'Community',
    version: '1.3.0',
    createdAt: '2024-01-06T00:00:00Z',
    updatedAt: '2024-01-18T00:00:00Z',
  },
];

const PACK_TYPES = [
  { id: 'all', label: 'All Packs' },
  { id: 'industry', label: 'Industry' },
  { id: 'role', label: 'Role' },
  { id: 'compliance', label: 'Compliance' },
  { id: 'starter', label: 'Starter' },
];

interface PackCardProps {
  pack: SOPPack;
  isInstalled: boolean;
  onInstall: (pack: SOPPack) => void;
  onSelect: (pack: SOPPack) => void;
}

function PackCard({ pack, isInstalled, onInstall, onSelect }: PackCardProps): JSX.Element {
  const typeColors: Record<string, string> = {
    industry: 'bg-blue-500/20 text-blue-400',
    role: 'bg-green-500/20 text-green-400',
    compliance: 'bg-orange-500/20 text-orange-400',
    starter: 'bg-purple-500/20 text-purple-400',
  };

  return (
    <div
      className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-all cursor-pointer"
      onClick={() => onSelect(pack)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-zinc-400" />
          <h3 className="font-medium text-white">{pack.name}</h3>
        </div>
        <span className={`px-2 py-0.5 text-xs rounded ${typeColors[pack.type]}`}>
          {pack.type}
        </span>
      </div>

      <p className="text-sm text-zinc-400 line-clamp-2 mb-4">{pack.description}</p>

      <div className="flex items-center gap-4 text-xs text-zinc-500 mb-4">
        <span className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-yellow-400" />
          {pack.rating}
        </span>
        <span className="flex items-center gap-1">
          <Users className="w-3.5 h-3.5" />
          {pack.installCount.toLocaleString()}
        </span>
        <span>{pack.sopCount} SOPs</span>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onInstall(pack);
        }}
        disabled={isInstalled}
        className={`
          w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
          ${isInstalled
            ? 'bg-green-500/20 text-green-400 cursor-default'
            : 'bg-blue-600 text-white hover:bg-blue-500'
          }
        `}
      >
        {isInstalled ? (
          <>
            <Check className="w-4 h-4" />
            Installed
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            Install Pack
          </>
        )}
      </button>
    </div>
  );
}

interface PackDetailsPanelProps {
  pack: SOPPack;
  isInstalled: boolean;
  onInstall: (pack: SOPPack) => void;
  onClose: () => void;
}

function PackDetailsPanel({ pack, isInstalled, onInstall }: PackDetailsPanelProps): JSX.Element {
  const typeColors: Record<string, string> = {
    industry: 'bg-blue-500/20 text-blue-400',
    role: 'bg-green-500/20 text-green-400',
    compliance: 'bg-orange-500/20 text-orange-400',
    starter: 'bg-purple-500/20 text-purple-400',
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-zinc-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-zinc-800 rounded-lg">
            <Package className="w-6 h-6 text-zinc-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">{pack.name}</h2>
            <span className={`px-2 py-0.5 text-xs rounded ${typeColors[pack.type]}`}>
              {pack.type}
            </span>
          </div>
        </div>

        <p className="text-zinc-400 mb-4">{pack.description}</p>

        <div className="flex items-center gap-6 text-sm text-zinc-500">
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400" />
            {pack.rating} rating
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {pack.installCount.toLocaleString()} installs
          </span>
          <span>v{pack.version}</span>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-6">
        <div>
          <h3 className="text-sm font-medium text-zinc-300 mb-3">Included SOPs</h3>
          <p className="text-sm text-zinc-400">
            This pack includes {pack.sopCount} pre-configured SOPs.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-zinc-300 mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {pack.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 px-2 py-1 bg-zinc-800 text-zinc-400 rounded text-xs"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-zinc-300 mb-3">Author</h3>
          <p className="text-sm text-zinc-400">{pack.author}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-zinc-300 mb-3">Last Updated</h3>
          <p className="text-sm text-zinc-400">
            {new Date(pack.updatedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      <div className="p-6 border-t border-zinc-800">
        <button
          type="button"
          onClick={() => onInstall(pack)}
          disabled={isInstalled}
          className={`
            w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors
            ${isInstalled
              ? 'bg-green-500/20 text-green-400 cursor-default'
              : 'bg-blue-600 text-white hover:bg-blue-500'
            }
          `}
        >
          {isInstalled ? (
            <>
              <Check className="w-5 h-5" />
              Already Installed
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              Install Pack ({pack.sopCount} SOPs)
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export function PacksBrowserPage(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const { cognates } = useCognateStore();

  const cognate = cognates.find((c) => c.id === id);

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedPack, setSelectedPack] = useState<SOPPack | null>(null);
  const [installedPacks, setInstalledPacks] = useState<string[]>([]);

  if (!cognate) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-medium text-white mb-2">Cognate Not Found</h2>
        <p className="text-zinc-400 mb-4">The requested cognate does not exist.</p>
        <Link
          to="/studio/cognates"
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Cognates
        </Link>
      </div>
    );
  }

  const filteredPacks = MOCK_PACKS.filter((pack) => {
    // Type filter
    if (typeFilter !== 'all' && pack.type !== typeFilter) {
      return false;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        pack.name.toLowerCase().includes(query) ||
        pack.description.toLowerCase().includes(query) ||
        pack.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    return true;
  });

  const handleInstall = (pack: SOPPack): void => {
    if (!installedPacks.includes(pack.id)) {
      setInstalledPacks([...installedPacks, pack.id]);
      // TODO: Actually install the pack SOPs
    }
  };

  const popularPacks = [...MOCK_PACKS]
    .sort((a, b) => b.installCount - a.installCount)
    .slice(0, 3);

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            to={`/studio/cognates/${id}/sops`}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-zinc-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">SOP Packs</h1>
            <p className="text-zinc-400 mt-1">
              Browse and install pre-built SOP collections for {cognate.name}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search packs..."
              className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-700 rounded-lg">
            {PACK_TYPES.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setTypeFilter(type.id)}
                className={`
                  px-3 py-1.5 text-sm rounded transition-colors
                  ${typeFilter === type.id
                    ? 'bg-zinc-700 text-white'
                    : 'text-zinc-400 hover:text-white'
                  }
                `}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Popular Packs */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-white mb-4">Popular Packs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {popularPacks.map((pack) => (
              <PackCard
                key={pack.id}
                pack={pack}
                isInstalled={installedPacks.includes(pack.id)}
                onInstall={handleInstall}
                onSelect={setSelectedPack}
              />
            ))}
          </div>
        </div>

        {/* All Packs */}
        <div>
          <h2 className="text-lg font-medium text-white mb-4">
            {typeFilter === 'all' ? 'All Packs' : `${PACK_TYPES.find((t) => t.id === typeFilter)?.label} Packs`}
            <span className="text-sm text-zinc-500 ml-2">({filteredPacks.length})</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPacks.map((pack) => (
              <PackCard
                key={pack.id}
                pack={pack}
                isInstalled={installedPacks.includes(pack.id)}
                onInstall={handleInstall}
                onSelect={setSelectedPack}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Details Sidebar */}
      {selectedPack && (
        <div className="w-[400px] border-l border-zinc-800 bg-zinc-900/50">
          <PackDetailsPanel
            pack={selectedPack}
            isInstalled={installedPacks.includes(selectedPack.id)}
            onInstall={handleInstall}
            onClose={() => setSelectedPack(null)}
          />
        </div>
      )}
    </div>
  );
}

export default PacksBrowserPage;
