/**
 * C2S2 Page
 *
 * Code-to-S1 transformation hub with tabs for Dashboard, Explorer, Planner, and Preview.
 * Transforms traditional code into S1/Symtex Script - a deterministic, auditable format.
 */

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, LayoutDashboard, Compass, GitBranch, Eye } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

// Import C2S2 components
import { C2S2Dashboard, C2S2Explorer, C2S2Planner, C2S2Preview } from '@/features/c2s2';

type C2S2Tab = 'dashboard' | 'explorer' | 'planner' | 'preview';

export default function C2S2Page(): JSX.Element {
  const [activeTab, setActiveTab] = useState<C2S2Tab>('dashboard');
  const [previewTransformationId, setPreviewTransformationId] = useState<string>('trans-demo-001');

  // Handler to switch to preview tab with a specific transformation
  const handleOpenPreview = useCallback((transformationId?: string) => {
    if (transformationId) {
      setPreviewTransformationId(transformationId);
    }
    setActiveTab('preview');
  }, []);

  // Handler for navigating from dashboard to explorer
  const handleNavigateToExplorer = useCallback(() => {
    setActiveTab('explorer');
  }, []);

  // Handler for accepting a transformation
  const handleAcceptTransformation = useCallback(() => {
    // In a real app, this would save the transformation and update state
    console.log('Transformation accepted:', previewTransformationId);
    setActiveTab('dashboard');
  }, [previewTransformationId]);

  return (
    <div className="min-h-screen bg-background">
      {/* Persistent DEMO MODE Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 bg-symtex-gold/10 border-b border-symtex-gold/30 px-4 py-2"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-symtex-gold" />
          <span className="text-sm font-medium text-symtex-gold">DEMO MODE</span>
          <span className="text-xs text-symtex-gold/70">
            - All transformations are simulated for demonstration
          </span>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as C2S2Tab)}
          className="space-y-6"
        >
          {/* Tab Navigation */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground mb-1">
                C2S2 - Code to S1
              </h1>
              <p className="text-sm text-muted-foreground">
                Transform traditional code into deterministic S1/Symtex Script
              </p>
            </div>
            <TabsList className="grid grid-cols-4 gap-1">
              <TabsTrigger
                value="dashboard"
                className={cn(
                  'flex items-center gap-2 px-4',
                  activeTab === 'dashboard' && 'bg-symtex-primary/10 text-symtex-primary'
                )}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger
                value="explorer"
                className={cn(
                  'flex items-center gap-2 px-4',
                  activeTab === 'explorer' && 'bg-symtex-primary/10 text-symtex-primary'
                )}
              >
                <Compass className="w-4 h-4" />
                <span className="hidden sm:inline">Explorer</span>
              </TabsTrigger>
              <TabsTrigger
                value="planner"
                className={cn(
                  'flex items-center gap-2 px-4',
                  activeTab === 'planner' && 'bg-symtex-primary/10 text-symtex-primary'
                )}
              >
                <GitBranch className="w-4 h-4" />
                <span className="hidden sm:inline">Planner</span>
              </TabsTrigger>
              <TabsTrigger
                value="preview"
                className={cn(
                  'flex items-center gap-2 px-4',
                  activeTab === 'preview' && 'bg-symtex-primary/10 text-symtex-primary'
                )}
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Preview</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content */}
          <TabsContent value="dashboard" className="mt-0">
            <C2S2Dashboard
              onNavigateToExplorer={handleNavigateToExplorer}
              onCreateProject={() => console.log('Create project')}
              onImportCode={() => console.log('Import code')}
            />
          </TabsContent>

          <TabsContent value="explorer" className="mt-0">
            <div className="h-[calc(100vh-280px)] min-h-[500px]">
              <C2S2Explorer />
            </div>
          </TabsContent>

          <TabsContent value="planner" className="mt-0">
            <div className="h-[calc(100vh-280px)] min-h-[500px]">
              <C2S2Planner
                onApply={(stepId) => console.log('Applied step:', stepId)}
                onApplyAll={() => {
                  console.log('All steps applied');
                  handleOpenPreview();
                }}
              />
            </div>
          </TabsContent>

          <TabsContent value="preview" className="mt-0">
            <C2S2Preview
              transformationId={previewTransformationId}
              onAccept={handleAcceptTransformation}
              onEdit={() => setActiveTab('planner')}
              onExport={() => console.log('Export transformation')}
              onCancel={() => setActiveTab('dashboard')}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
