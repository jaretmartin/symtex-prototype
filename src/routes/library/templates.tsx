import React, { useState, useMemo } from 'react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface Template {
  id: string;
  title: string;
  description: string;
  category: TemplateCategory;
  previewImage: string;
  previewGradient: string;
  rating: number;
  usageCount: number;
  tags: string[];
  isFeatured: boolean;
  author: string;
  createdAt: string;
}

type TemplateCategory =
  | 'research'
  | 'reports'
  | 'presentations'
  | 'documentation'
  | 'creative'
  | 'data-analysis';

interface CategoryConfig {
  id: TemplateCategory;
  label: string;
  icon: React.ReactNode;
  color: string;
}

// ============================================================================
// ICONS (Inline SVG Components)
// ============================================================================

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const StarIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg className="w-4 h-4" fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const SparklesIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

// Category Icons
const ResearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const ReportsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const PresentationsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
  </svg>
);

const DocumentationIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const CreativeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

const DataAnalysisIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
  </svg>
);

const GridIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const MasonryIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 14a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM14 16a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
  </svg>
);

// ============================================================================
// CATEGORY CONFIGURATION
// ============================================================================

const CATEGORIES: CategoryConfig[] = [
  { id: 'research', label: 'Research', icon: <ResearchIcon />, color: 'from-blue-500 to-cyan-500' },
  { id: 'reports', label: 'Reports', icon: <ReportsIcon />, color: 'from-emerald-500 to-teal-500' },
  { id: 'presentations', label: 'Presentations', icon: <PresentationsIcon />, color: 'from-orange-500 to-amber-500' },
  { id: 'documentation', label: 'Documentation', icon: <DocumentationIcon />, color: 'from-violet-500 to-purple-500' },
  { id: 'creative', label: 'Creative', icon: <CreativeIcon />, color: 'from-pink-500 to-rose-500' },
  { id: 'data-analysis', label: 'Data Analysis', icon: <DataAnalysisIcon />, color: 'from-indigo-500 to-blue-500' },
];

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_TEMPLATES: Template[] = [
  {
    id: '1',
    title: 'Academic Research Paper',
    description: 'Comprehensive research paper template with abstract, methodology, results, and citations sections.',
    category: 'research',
    previewImage: '',
    previewGradient: 'from-blue-600 via-cyan-500 to-teal-400',
    rating: 4.9,
    usageCount: 12847,
    tags: ['Academic', 'Citations', 'Peer Review'],
    isFeatured: true,
    author: 'Symtex Team',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'Executive Summary Report',
    description: 'Clean, professional executive summary with key metrics, insights, and actionable recommendations.',
    category: 'reports',
    previewImage: '',
    previewGradient: 'from-emerald-600 via-green-500 to-lime-400',
    rating: 4.8,
    usageCount: 9523,
    tags: ['Business', 'Executive', 'Metrics'],
    isFeatured: true,
    author: 'Symtex Team',
    createdAt: '2024-02-20',
  },
  {
    id: '3',
    title: 'Pitch Deck Presentation',
    description: 'Stunning pitch deck with problem/solution framework, market analysis, and financial projections.',
    category: 'presentations',
    previewImage: '',
    previewGradient: 'from-orange-600 via-amber-500 to-yellow-400',
    rating: 4.9,
    usageCount: 15632,
    tags: ['Startup', 'Investors', 'Pitch'],
    isFeatured: true,
    author: 'Symtex Team',
    createdAt: '2024-01-08',
  },
  {
    id: '4',
    title: 'API Documentation',
    description: 'Developer-friendly API documentation with endpoints, parameters, and code examples.',
    category: 'documentation',
    previewImage: '',
    previewGradient: 'from-violet-600 via-purple-500 to-fuchsia-400',
    rating: 4.7,
    usageCount: 7841,
    tags: ['Developer', 'API', 'Technical'],
    isFeatured: false,
    author: 'DevDocs Pro',
    createdAt: '2024-03-10',
  },
  {
    id: '5',
    title: 'Creative Brief',
    description: 'Structured creative brief for marketing campaigns with brand guidelines and deliverables.',
    category: 'creative',
    previewImage: '',
    previewGradient: 'from-pink-600 via-rose-500 to-red-400',
    rating: 4.6,
    usageCount: 5234,
    tags: ['Marketing', 'Design', 'Brand'],
    isFeatured: false,
    author: 'Creative Labs',
    createdAt: '2024-02-28',
  },
  {
    id: '6',
    title: 'Data Analysis Report',
    description: 'Comprehensive data analysis template with visualizations, statistical summaries, and insights.',
    category: 'data-analysis',
    previewImage: '',
    previewGradient: 'from-indigo-600 via-blue-500 to-sky-400',
    rating: 4.8,
    usageCount: 8976,
    tags: ['Analytics', 'Visualization', 'Statistics'],
    isFeatured: true,
    author: 'Data Insights Co',
    createdAt: '2024-01-22',
  },
  {
    id: '7',
    title: 'Literature Review',
    description: 'Academic literature review template with thematic organization and critical analysis.',
    category: 'research',
    previewImage: '',
    previewGradient: 'from-cyan-600 via-teal-500 to-emerald-400',
    rating: 4.5,
    usageCount: 4521,
    tags: ['Academic', 'Literature', 'Analysis'],
    isFeatured: false,
    author: 'AcademicPro',
    createdAt: '2024-03-05',
  },
  {
    id: '8',
    title: 'Quarterly Business Report',
    description: 'Professional quarterly report with financial highlights, KPIs, and strategic outlook.',
    category: 'reports',
    previewImage: '',
    previewGradient: 'from-teal-600 via-cyan-500 to-blue-400',
    rating: 4.7,
    usageCount: 6789,
    tags: ['Finance', 'Quarterly', 'KPIs'],
    isFeatured: false,
    author: 'BizReports',
    createdAt: '2024-02-14',
  },
  {
    id: '9',
    title: 'Training Workshop Slides',
    description: 'Interactive workshop presentation with exercises, quizzes, and hands-on activities.',
    category: 'presentations',
    previewImage: '',
    previewGradient: 'from-amber-600 via-orange-500 to-red-400',
    rating: 4.4,
    usageCount: 3456,
    tags: ['Training', 'Workshop', 'Interactive'],
    isFeatured: false,
    author: 'LearnHub',
    createdAt: '2024-03-18',
  },
  {
    id: '10',
    title: 'Product Documentation',
    description: 'User-friendly product documentation with getting started guide and feature walkthroughs.',
    category: 'documentation',
    previewImage: '',
    previewGradient: 'from-purple-600 via-violet-500 to-indigo-400',
    rating: 4.6,
    usageCount: 5678,
    tags: ['Product', 'User Guide', 'Features'],
    isFeatured: false,
    author: 'Symtex Team',
    createdAt: '2024-01-30',
  },
  {
    id: '11',
    title: 'Brand Story Narrative',
    description: 'Compelling brand storytelling template with emotional hooks and brand voice guidelines.',
    category: 'creative',
    previewImage: '',
    previewGradient: 'from-rose-600 via-pink-500 to-fuchsia-400',
    rating: 4.8,
    usageCount: 4123,
    tags: ['Branding', 'Storytelling', 'Narrative'],
    isFeatured: false,
    author: 'StoryBrand Co',
    createdAt: '2024-02-08',
  },
  {
    id: '12',
    title: 'Market Research Analysis',
    description: 'In-depth market research template with competitor analysis, trends, and opportunities.',
    category: 'data-analysis',
    previewImage: '',
    previewGradient: 'from-blue-600 via-indigo-500 to-violet-400',
    rating: 4.7,
    usageCount: 7234,
    tags: ['Market', 'Competitors', 'Trends'],
    isFeatured: false,
    author: 'MarketPulse',
    createdAt: '2024-03-01',
  },
];

// ============================================================================
// COMPONENTS
// ============================================================================

// Template Preview Visual (generates a visual preview pattern)
const TemplatePreview: React.FC<{ gradient: string; category: TemplateCategory }> = ({ gradient, category }) => {
  return (
    <div className={`relative w-full h-48 bg-gradient-to-br ${gradient} rounded-t-xl overflow-hidden`}>
      {/* Abstract document preview */}
      <div className="absolute inset-4 bg-white/10 backdrop-blur-sm rounded-lg p-3 flex flex-col gap-2">
        {/* Header line */}
        <div className="h-3 w-3/4 bg-white/40 rounded" />
        <div className="h-2 w-1/2 bg-white/30 rounded" />

        {/* Content lines */}
        <div className="flex-1 flex flex-col gap-1.5 mt-2">
          <div className="h-2 w-full bg-white/25 rounded" />
          <div className="h-2 w-5/6 bg-white/25 rounded" />
          <div className="h-2 w-4/5 bg-white/25 rounded" />
          <div className="h-2 w-full bg-white/25 rounded" />
          <div className="h-2 w-3/4 bg-white/25 rounded" />
        </div>

        {/* Category-specific visual element */}
        {category === 'data-analysis' && (
          <div className="absolute bottom-3 right-3 flex gap-1 items-end">
            <div className="w-2 h-4 bg-white/40 rounded-sm" />
            <div className="w-2 h-6 bg-white/50 rounded-sm" />
            <div className="w-2 h-8 bg-white/60 rounded-sm" />
            <div className="w-2 h-5 bg-white/45 rounded-sm" />
          </div>
        )}
        {category === 'presentations' && (
          <div className="absolute bottom-3 right-3 w-8 h-8 border-2 border-white/40 rounded-full flex items-center justify-center">
            <div className="w-0 h-0 border-l-4 border-l-white/60 border-y-2 border-y-transparent ml-0.5" />
          </div>
        )}
      </div>

      {/* Decorative elements */}
      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
      <div className="absolute -top-4 -left-4 w-16 h-16 bg-white/10 rounded-full blur-lg" />
    </div>
  );
};

// Star Rating Component
const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={i < fullStars ? 'text-symtex-gold' : 'text-muted-foreground'}>
          <StarIcon filled={i < fullStars || (i === fullStars && hasHalfStar)} />
        </span>
      ))}
      <span className="ml-1 text-sm text-muted-foreground">{rating.toFixed(1)}</span>
    </div>
  );
};

// Category Badge Component
const CategoryBadge: React.FC<{ category: TemplateCategory }> = ({ category }) => {
  const config = CATEGORIES.find(c => c.id === category);
  if (!config) return null;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${config.color} text-foreground shadow-lg shadow-${category === 'research' ? 'blue' : category === 'reports' ? 'emerald' : 'purple'}-500/25`}>
      {config.icon}
      {config.label}
    </span>
  );
};

// Template Card Component
const TemplateCard: React.FC<{ template: Template; isMasonry?: boolean }> = ({ template, isMasonry = false }) => {
  const formatUsageCount = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <div className={`group relative bg-surface-card/50 backdrop-blur-sm rounded-xl border border-border hover:border-symtex-purple/50 transition-all duration-300 hover:shadow-xl hover:shadow-symtex-purple/10 overflow-hidden ${isMasonry ? '' : 'flex flex-col'}`}>
      {/* Featured Badge */}
      {template.isFeatured && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2 py-1 bg-symtex-gold/90 backdrop-blur-sm rounded-full text-xs font-semibold text-foreground">
          <SparklesIcon />
          Featured
        </div>
      )}

      {/* Preview Image */}
      <TemplatePreview gradient={template.previewGradient} category={template.category} />

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Category Badge */}
        <div className="mb-3">
          <CategoryBadge category={template.category} />
        </div>

        {/* Title & Description */}
        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-symtex-purple transition-colors">
          {template.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
          {template.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {template.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="px-2 py-0.5 bg-surface-card rounded text-xs text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between mb-4 pt-4 border-t border-border">
          <StarRating rating={template.rating} />
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <UsersIcon />
            <span>{formatUsageCount(template.usageCount)} uses</span>
          </div>
        </div>

        {/* Action Button */}
        <button className="w-full py-2.5 px-4 bg-gradient-to-r from-symtex-purple to-symtex-purple/80 hover:from-symtex-purple hover:to-purple-600 text-foreground font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group/btn">
          <span>Use Template</span>
          <ArrowRightIcon />
        </button>
      </div>
    </div>
  );
};

// Featured Template Card (larger, more prominent)
const FeaturedTemplateCard: React.FC<{ template: Template }> = ({ template }) => {
  const formatUsageCount = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <div className="group relative bg-gradient-to-br from-surface-base to-surface-base/50 backdrop-blur-sm rounded-2xl border border-symtex-purple/30 hover:border-symtex-purple transition-all duration-300 hover:shadow-2xl hover:shadow-symtex-purple/20 overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Preview Section */}
        <div className={`relative md:w-1/2 h-64 md:h-auto bg-gradient-to-br ${template.previewGradient} overflow-hidden`}>
          {/* Featured Badge */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 bg-symtex-gold backdrop-blur-sm rounded-full text-sm font-bold text-foreground shadow-lg">
            <SparklesIcon />
            Featured Template
          </div>

          {/* Abstract preview */}
          <div className="absolute inset-6 md:inset-8 bg-white/10 backdrop-blur-sm rounded-xl p-4 flex flex-col gap-2">
            <div className="h-4 w-3/4 bg-white/40 rounded" />
            <div className="h-3 w-1/2 bg-white/30 rounded" />
            <div className="flex-1 flex flex-col gap-2 mt-3">
              <div className="h-2.5 w-full bg-white/25 rounded" />
              <div className="h-2.5 w-5/6 bg-white/25 rounded" />
              <div className="h-2.5 w-4/5 bg-white/25 rounded" />
            </div>
          </div>

          {/* Decorative */}
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        </div>

        {/* Content Section */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
          <CategoryBadge category={template.category} />

          <h3 className="text-2xl font-bold text-foreground mt-4 mb-3 group-hover:text-symtex-purple transition-colors">
            {template.title}
          </h3>

          <p className="text-muted-foreground mb-4">
            {template.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {template.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-surface-card/80 rounded-lg text-sm text-foreground">
                {tag}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 mb-6">
            <StarRating rating={template.rating} />
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <UsersIcon />
              <span>{formatUsageCount(template.usageCount)} uses</span>
            </div>
          </div>

          {/* CTA */}
          <button className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-symtex-purple to-purple-600 hover:from-purple-600 hover:to-symtex-purple text-foreground font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-symtex-purple/25">
            <span>Use This Template</span>
            <ArrowRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

// Category Filter Component
const CategoryFilter: React.FC<{
  categories: CategoryConfig[];
  selected: TemplateCategory | 'all';
  onSelect: (category: TemplateCategory | 'all') => void;
}> = ({ categories, selected, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {/* All Button */}
      <button
        onClick={() => onSelect('all')}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
          selected === 'all'
            ? 'bg-symtex-purple text-foreground shadow-lg shadow-symtex-purple/25'
            : 'bg-surface-card/50 text-muted-foreground hover:bg-surface-card hover:text-foreground'
        }`}
      >
        <GridIcon />
        <span>All Templates</span>
      </button>

      {/* Category Buttons */}
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
            selected === cat.id
              ? `bg-gradient-to-r ${cat.color} text-foreground shadow-lg`
              : 'bg-surface-card/50 text-muted-foreground hover:bg-surface-card hover:text-foreground'
          }`}
        >
          {cat.icon}
          <span>{cat.label}</span>
        </button>
      ))}
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const TemplatesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid');

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return MOCK_TEMPLATES.filter((template) => {
      const matchesSearch =
        template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Get featured templates
  const featuredTemplates = useMemo(() => {
    return MOCK_TEMPLATES.filter(t => t.isFeatured).slice(0, 2);
  }, []);

  // Get non-featured templates for the main grid
  const regularTemplates = useMemo(() => {
    return filteredTemplates.filter(t => !t.isFeatured || selectedCategory !== 'all');
  }, [filteredTemplates, selectedCategory]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Template Library
              </h1>
              <p className="text-muted-foreground mt-1">
                Discover beautifully crafted templates to accelerate your work
              </p>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-surface-card/50 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-symtex-purple text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <GridIcon />
                <span className="text-sm font-medium">Grid</span>
              </button>
              <button
                onClick={() => setViewMode('masonry')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                  viewMode === 'masonry'
                    ? 'bg-symtex-purple text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <MasonryIcon />
                <span className="text-sm font-medium">Masonry</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search Bar */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Search templates by name, description, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-surface-card/50 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-symtex-purple focus:ring-1 focus:ring-symtex-purple transition-all"
          />
        </div>

        {/* Category Filters */}
        <div className="mb-10">
          <CategoryFilter
            categories={CATEGORIES}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>

        {/* Featured Section (only show when not filtering) */}
        {selectedCategory === 'all' && searchQuery === '' && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-symtex-gold/20 rounded-lg">
                <SparklesIcon />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Featured Templates</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredTemplates.map((template) => (
                <FeaturedTemplateCard key={template.id} template={template} />
              ))}
            </div>
          </section>
        )}

        {/* All Templates Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              {selectedCategory === 'all' ? 'All Templates' : CATEGORIES.find(c => c.id === selectedCategory)?.label + ' Templates'}
            </h2>
            <span className="text-sm text-muted-foreground">
              {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} found
            </span>
          </div>

          {/* Template Grid */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(selectedCategory === 'all' && searchQuery === '' ? regularTemplates.filter(t => !t.isFeatured) : filteredTemplates).map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {(selectedCategory === 'all' && searchQuery === '' ? regularTemplates.filter(t => !t.isFeatured) : filteredTemplates).map((template, index) => (
                <div key={template.id} className={`break-inside-avoid ${index % 3 === 1 ? 'pt-8' : ''}`}>
                  <TemplateCard template={template} isMasonry />
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {filteredTemplates.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-card flex items-center justify-center">
                <SearchIcon />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No templates found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default TemplatesPage;
