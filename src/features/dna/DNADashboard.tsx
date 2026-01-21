/**
 * DNADashboard Component
 *
 * Full DNA overview showing all 10 strands (5 personal + 5 work)
 * with helix visualization, gauges, and detailed cards.
 */

import { useState, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dna,
  RefreshCcw,
  User,
  Briefcase,
  ChevronRight,
  Settings,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDNAStore, type DNAStrandData, type DNACategory } from './dna-store';
import DNAHelixViz from './DNAHelixViz';
import DNAStrengthGauge from './DNAStrengthGauge';
import StrandCard from './StrandCard';

interface DNADashboardProps {
  className?: string;
  compact?: boolean;
}

function DNADashboard({ className, compact = false }: DNADashboardProps): JSX.Element {
  const {
    strands,
    profile,
    selectedStrandId,
    isAnalyzing,
    selectStrand,
    refreshAnalysis,
    getStrandsByCategory,
    getWeakStrands,
    getStrongStrands,
  } = useDNAStore();

  const [activeTab, setActiveTab] = useState<DNACategory | 'all'>('all');

  const personalStrands = getStrandsByCategory('personal');
  const workStrands = getStrandsByCategory('work');
  const weakStrands = getWeakStrands();
  const strongStrands = getStrongStrands();

  const displayStrands = activeTab === 'all'
    ? strands
    : strands.filter((s) => s.category === activeTab);

  const selectedStrand = strands.find((s) => s.id === selectedStrandId);

  const handleStrandClick = useCallback((strand: DNAStrandData) => {
    selectStrand(selectedStrandId === strand.id ? null : strand.id);
  }, [selectedStrandId, selectStrand]);

  const handleRefresh = useCallback(async () => {
    await refreshAnalysis();
  }, [refreshAnalysis]);

  if (compact) {
    return (
      <div className={cn('bg-card rounded-xl border border-border', className)}>
        {/* Compact Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Dna className="w-4 h-4 text-symtex-primary dna-pulse" />
              DNA Overview
            </h3>
            <span className="text-2xl font-bold text-foreground">{profile.overallStrength}%</span>
          </div>
        </div>

        {/* Compact Strands */}
        <div className="p-4 grid grid-cols-5 gap-2">
          {strands.slice(0, 5).map((strand) => (
            <DNAStrengthGauge
              key={strand.id}
              strand={strand}
              size="sm"
              showLabels={false}
              onClick={() => handleStrandClick(strand)}
            />
          ))}
        </div>

        {/* View More Link */}
        <div className="p-3 border-t border-border bg-card/30">
          <button className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1">
            View full DNA profile
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Dna className="w-6 h-6 text-symtex-primary dna-pulse" />
              Your AI DNA Profile
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {profile.totalDataPoints.toLocaleString()} data points analyzed
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={isAnalyzing}
              className={cn(
                'px-3 py-2 rounded-lg text-sm flex items-center gap-2',
                'bg-muted/50 text-muted-foreground hover:bg-muted transition-colors',
                isAnalyzing && 'opacity-50 cursor-not-allowed'
              )}
            >
              <RefreshCcw className={cn('w-4 h-4', isAnalyzing && 'animate-spin')} />
              {isAnalyzing ? 'Analyzing...' : 'Refresh'}
            </button>
            <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 bg-card/50 rounded-xl text-center">
            <Sparkles className="w-5 h-5 text-symtex-primary mx-auto mb-2" />
            <p className="text-3xl font-bold text-foreground">{profile.overallStrength}%</p>
            <p className="text-xs text-muted-foreground">Overall Strength</p>
          </div>
          <div className="p-4 bg-card/50 rounded-xl text-center">
            <TrendingUp className="w-5 h-5 text-green-400 mx-auto mb-2" />
            <p className="text-3xl font-bold text-foreground">{strongStrands.length}</p>
            <p className="text-xs text-muted-foreground">Strong Strands</p>
          </div>
          <div className="p-4 bg-card/50 rounded-xl text-center">
            <User className="w-5 h-5 text-blue-400 mx-auto mb-2" />
            <p className="text-3xl font-bold text-foreground">{personalStrands.length}</p>
            <p className="text-xs text-muted-foreground">Personal</p>
          </div>
          <div className="p-4 bg-card/50 rounded-xl text-center">
            <Briefcase className="w-5 h-5 text-purple-400 mx-auto mb-2" />
            <p className="text-3xl font-bold text-foreground">{workStrands.length}</p>
            <p className="text-xs text-muted-foreground">Work</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Helix Visualization */}
        <div className="lg:col-span-1">
          <DNAHelixViz
            height={500}
            onStrandClick={handleStrandClick}
          />
        </div>

        {/* Strands Grid */}
        <div className="lg:col-span-2 space-y-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 p-1 bg-card/50 rounded-lg">
            {(['all', 'personal', 'work'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize',
                  activeTab === tab
                    ? 'bg-symtex-primary text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {tab === 'all' ? 'All Strands' : tab}
              </button>
            ))}
          </div>

          {/* Strands List */}
          <div className="grid grid-cols-2 gap-4">
            {displayStrands.map((strand) => (
              <motion.div
                key={strand.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={cn(
                  'p-4 bg-card rounded-xl border transition-colors cursor-pointer',
                  selectedStrandId === strand.id
                    ? 'border-symtex-primary'
                    : 'border-border hover:border-border'
                )}
                onClick={() => handleStrandClick(strand)}
              >
                <div className="flex items-start gap-3">
                  <DNAStrengthGauge
                    strand={strand}
                    size="sm"
                    showLabels={false}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {strand.name}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {strand.category}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-muted-foreground">
                        {strand.confidence}% confidence
                      </span>
                      <span className="text-xs text-muted-foreground">-</span>
                      <span className="text-xs text-muted-foreground">
                        {strand.dataPoints} pts
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Weak Strands Alert */}
          {weakStrands.length > 0 && (
            <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl">
              <h4 className="text-sm font-medium text-orange-400 mb-2">
                Strands Needing Attention
              </h4>
              <div className="flex flex-wrap gap-2">
                {weakStrands.map((strand) => (
                  <button
                    key={strand.id}
                    onClick={() => handleStrandClick(strand)}
                    className="px-3 py-1.5 rounded-lg bg-orange-500/20 text-orange-300 text-xs hover:bg-orange-500/30 transition-colors"
                  >
                    {strand.name}: {strand.strength}%
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selected Strand Detail */}
      <AnimatePresence>
        {selectedStrand && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <StrandCard
              strand={selectedStrand}
              onClose={() => selectStrand(null)}
              onImprove={(_id) => { /* Improve strand: id */ }}
              expanded
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default memo(DNADashboard);
