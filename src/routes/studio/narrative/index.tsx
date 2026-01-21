/**
 * Narrative Builder Page
 *
 * Full-page wrapper for the NarrativeBuilder component.
 * Provides story management and narrative-driven workflow creation.
 *
 * WF2 Integration: Plan -> Simulate -> Run -> Review -> Compile
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookText, ArrowLeft, Plus, Play, FlaskConical, FileText } from 'lucide-react';
import clsx from 'clsx';
import { NarrativeBuilder } from '@/components/narrative/NarrativeBuilder';
import { useNarrativeStore } from '@/store/useNarrativeStore';
import { useToast } from '@/store/useUIStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/Button';
import { ExplainPlan, type ExecutionPlan } from '@/components/runs/ExplainPlan';
import { SimulationPanel, type SimulationResult } from '@/components/runs/SimulationPanel';
import { RunReview, type RunResult } from '@/components/runs/RunReview';
import type { NarrativeStory, NarrativeChapter } from '@/types';

// Types for WF2 workflow
type WF2Step = 'builder' | 'plan' | 'simulate' | 'running' | 'review';

// Mock data generators for WF2
function createMockExecutionPlan(story: NarrativeStory): ExecutionPlan {
  const chapterCount = story.chapters.length;
  return {
    automationId: story.id,
    automationName: story.title,
    systems: [
      {
        id: 'sys-1',
        name: 'Narrative Engine',
        type: 'api',
        action: 'execute',
        description: 'Process story chapters sequentially',
      },
      {
        id: 'sys-2',
        name: 'Email Service',
        type: 'email',
        action: 'execute',
        description: 'Send notifications at milestones',
      },
      {
        id: 'sys-3',
        name: 'Analytics',
        type: 'database',
        action: 'write',
        description: 'Track story execution metrics',
      },
    ],
    permissions: [
      { id: 'perm-1', scope: 'narrative', level: 'read', granted: true },
      { id: 'perm-2', scope: 'narrative', level: 'write', granted: true },
      { id: 'perm-3', scope: 'email', level: 'write', granted: true },
    ],
    cost: {
      apiCalls: chapterCount * 4,
      estimatedCost: chapterCount * 0.015,
      budgetCap: 50,
      budgetRemaining: 45.20,
      withinBudget: true,
    },
    estimatedDuration: chapterCount * 3,
    riskLevel: chapterCount > 10 ? 'medium' : 'low',
  };
}

function createMockSimulationResult(storyId: string, chapters: NarrativeChapter[]): SimulationResult {
  return {
    automationId: storyId,
    status: 'success',
    steps: chapters.map((chapter, index) => ({
      id: `step-${index}`,
      name: chapter.title,
      status: 'success' as const,
      duration: 150 + Math.random() * 300,
      input: { chapterType: chapter.type },
      output: { processed: true },
      message: `Chapter "${chapter.title}" simulated successfully`,
    })),
    warnings: [
      {
        id: 'warn-1',
        severity: 'info',
        message: 'All chapters simulated successfully. Ready to run.',
      },
    ],
    totalDuration: chapters.length * 200,
    completedAt: new Date(),
  };
}

function createMockRunResult(story: NarrativeStory): RunResult {
  const now = new Date();
  const startedAt = new Date(now.getTime() - story.chapters.length * 500);
  return {
    runId: `run-${Date.now()}`,
    automationId: story.id,
    automationName: story.title,
    status: 'success',
    startedAt,
    completedAt: now,
    steps: story.chapters.map((chapter, index) => ({
      id: `step-${index}`,
      name: chapter.title,
      status: 'success' as const,
      startedAt: new Date(startedAt.getTime() + index * 400),
      completedAt: new Date(startedAt.getTime() + (index + 1) * 400),
      input: { chapterType: chapter.type },
      output: { completed: true },
    })),
    totalCost: story.chapters.length * 0.012,
    outputSummary: `Story "${story.title}" executed successfully. All ${story.chapters.length} chapters completed.`,
    canCompilePattern: true,
    patternSuggestion: 'This narrative pattern can be compiled to S1 for faster execution.',
  };
}

/**
 * Default empty story for new narratives
 */
function createEmptyStory(): NarrativeStory {
  return {
    id: `story-${Date.now()}`,
    title: 'Untitled Story',
    description: '',
    chapters: [],
    status: 'draft',
  };
}

export default function NarrativePage(): JSX.Element {
  const navigate = useNavigate();
  const { createStory, updateStory, getStories, setCurrentStory } = useNarrativeStore();
  const toast = useToast();

  // Get stories array
  const stories = getStories();

  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(
    stories.length > 0 ? stories[0].id : null
  );
  const [isSaving, setIsSaving] = useState(false);

  // WF2 workflow state
  const [currentStep, setCurrentStep] = useState<WF2Step>('builder');
  const [executionPlan, setExecutionPlan] = useState<ExecutionPlan | null>(null);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);

  const selectedStory = stories.find((s) => s.id === selectedStoryId) || null;

  // Create a new story
  const handleNewStory = useCallback((): void => {
    const newStory = createEmptyStory();
    createStory(newStory);
    setSelectedStoryId(newStory.id);
    setCurrentStory(newStory.id);
  }, [createStory, setCurrentStory]);

  // Update story
  const handleStoryUpdate = useCallback(
    (updates: Partial<NarrativeStory>): void => {
      if (selectedStoryId) {
        updateStory(selectedStoryId, updates);
      }
    },
    [selectedStoryId, updateStory]
  );

  // Add chapter
  const handleChapterAdd = useCallback(
    (chapter: NarrativeChapter): void => {
      if (selectedStory) {
        const updatedChapters = [...selectedStory.chapters, chapter];
        updateStory(selectedStoryId!, { chapters: updatedChapters });
      }
    },
    [selectedStory, selectedStoryId, updateStory]
  );

  // Update chapter
  const handleChapterUpdate = useCallback(
    (chapterId: string, updates: Partial<NarrativeChapter>): void => {
      if (selectedStory) {
        const updatedChapters = selectedStory.chapters.map((ch: NarrativeChapter) =>
          ch.id === chapterId ? { ...ch, ...updates } : ch
        );
        updateStory(selectedStoryId!, { chapters: updatedChapters });
      }
    },
    [selectedStory, selectedStoryId, updateStory]
  );

  // Delete chapter
  const handleChapterDelete = useCallback(
    (chapterId: string): void => {
      if (selectedStory) {
        const updatedChapters = selectedStory.chapters.filter(
          (ch: NarrativeChapter) => ch.id !== chapterId
        );
        updateStory(selectedStoryId!, { chapters: updatedChapters });
      }
    },
    [selectedStory, selectedStoryId, updateStory]
  );

  // Reorder chapters
  const handleChapterReorder = useCallback(
    (chapterIds: string[]): void => {
      if (selectedStory) {
        const chapterMap = new Map(
          selectedStory.chapters.map((ch: NarrativeChapter) => [ch.id, ch])
        );
        const reorderedChapters = chapterIds
          .map((id) => chapterMap.get(id))
          .filter((ch): ch is NarrativeChapter => ch !== undefined);
        updateStory(selectedStoryId!, { chapters: reorderedChapters });
      }
    },
    [selectedStory, selectedStoryId, updateStory]
  );

  // Save story
  const handleSave = useCallback(async (): Promise<void> => {
    setIsSaving(true);
    // Simulate save operation
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSaving(false);
  }, []);

  // Activate story
  const handleActivate = useCallback((): void => {
    if (selectedStoryId) {
      updateStory(selectedStoryId, { status: 'active' });
    }
  }, [selectedStoryId, updateStory]);

  // WF2 Workflow Handlers
  const handleExplainPlan = useCallback((): void => {
    if (!selectedStory || selectedStory.chapters.length === 0) {
      toast.error('No chapters', 'Add some chapters to the story before running.');
      return;
    }
    setExecutionPlan(createMockExecutionPlan(selectedStory));
    setCurrentStep('plan');
  }, [selectedStory, toast]);

  const handleSimulate = useCallback((): void => {
    if (!selectedStory) return;
    setIsSimulating(true);
    setTimeout(() => {
      setSimulationResult(createMockSimulationResult(selectedStory.id, selectedStory.chapters));
      setIsSimulating(false);
      setCurrentStep('simulate');
    }, 1500);
  }, [selectedStory]);

  const handleRun = useCallback((): void => {
    if (!selectedStory) return;
    setIsRunning(true);
    setCurrentStep('running');
    setTimeout(() => {
      setRunResult(createMockRunResult(selectedStory));
      setIsRunning(false);
      setCurrentStep('review');
    }, 2500);
  }, [selectedStory]);

  const handleCompilePattern = useCallback((): void => {
    setIsCompiling(true);
    setTimeout(() => {
      setIsCompiling(false);
      toast.success('Pattern Compiled', 'Your narrative has been compiled to S1 for faster execution.');
      setCurrentStep('builder');
      setExecutionPlan(null);
      setSimulationResult(null);
      setRunResult(null);
    }, 2000);
  }, [toast]);

  const handleCancelWF2 = useCallback((): void => {
    setCurrentStep('builder');
    setExecutionPlan(null);
    setSimulationResult(null);
    setRunResult(null);
  }, []);

  const canRunStory = selectedStory && selectedStory.chapters.length > 0;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <BookText className="w-8 h-8 text-symtex-primary" />
              Narrative Builder
            </h1>
            <p className="text-muted-foreground mt-1">
              Create story-driven Automations with natural language
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* WF2 Buttons */}
          <Button
            variant="secondary"
            onClick={handleExplainPlan}
            disabled={!canRunStory}
          >
            <FileText className="w-4 h-4" />
            Explain Plan
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              handleExplainPlan();
              setTimeout(() => handleSimulate(), 100);
            }}
            disabled={!canRunStory}
            className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
          >
            <FlaskConical className="w-4 h-4" />
            Simulate
          </Button>
          <Button
            variant="success"
            onClick={handleExplainPlan}
            disabled={!canRunStory}
          >
            <Play className="w-4 h-4" />
            Run Story
          </Button>

          <div className="w-px h-8 bg-border mx-2" />

          <button
            type="button"
            onClick={handleNewStory}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg gradient-primary text-foreground font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5" aria-hidden="true" />
            New Story
          </button>
        </div>
      </div>

      {/* Story Selection Tabs */}
      {stories.length > 0 && (
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          {stories.map((story) => (
            <button
              key={story.id}
              type="button"
              onClick={() => {
                setSelectedStoryId(story.id);
                setCurrentStory(story.id);
              }}
              className={clsx(
                'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all',
                selectedStoryId === story.id
                  ? 'bg-symtex-primary/20 text-symtex-primary border border-symtex-primary/30'
                  : 'bg-card text-muted-foreground border border-border hover:text-foreground hover:border-muted'
              )}
            >
              {story.title || 'Untitled'}
            </button>
          ))}
        </div>
      )}

      {/* Narrative Builder */}
      {selectedStory ? (
        <NarrativeBuilder
          story={selectedStory}
          onStoryUpdate={handleStoryUpdate}
          onChapterAdd={handleChapterAdd}
          onChapterUpdate={handleChapterUpdate}
          onChapterDelete={handleChapterDelete}
          onChapterReorder={handleChapterReorder}
          onSave={handleSave}
          onBack={() => navigate(-1)}
          onActivate={handleActivate}
          isSaving={isSaving}
        />
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-card rounded-xl border border-border">
          <BookText className="w-16 h-16 text-muted-foreground mb-4" aria-hidden="true" />
          <h2 className="text-xl font-semibold text-foreground mb-2">No Stories Yet</h2>
          <p className="text-muted-foreground mb-6">
            Create your first narrative-driven Automation
          </p>
          <button
            type="button"
            onClick={handleNewStory}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg gradient-primary text-foreground font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5" aria-hidden="true" />
            Create Your First Story
          </button>
        </div>
      )}

      {/* WF2 Dialogs */}

      {/* Plan Dialog */}
      <Dialog open={currentStep === 'plan'} onOpenChange={() => handleCancelWF2()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Execution Plan</DialogTitle>
          </DialogHeader>
          {executionPlan && (
            <ExplainPlan
              plan={executionPlan}
              onSimulate={handleSimulate}
              onRun={handleRun}
              onCancel={handleCancelWF2}
              isSimulating={isSimulating}
              isRunning={isRunning}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Simulate Dialog */}
      <Dialog open={currentStep === 'simulate'} onOpenChange={() => handleCancelWF2()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Simulation Results</DialogTitle>
          </DialogHeader>
          {simulationResult && (
            <SimulationPanel
              result={simulationResult}
              onRunForReal={handleRun}
              onReSimulate={handleSimulate}
              onCancel={handleCancelWF2}
              isRunning={isRunning}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Running Dialog */}
      <Dialog open={currentStep === 'running'} onOpenChange={() => {}}>
        <DialogContent className="max-w-md">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 rounded-full border-4 border-symtex-primary border-t-transparent animate-spin mb-6" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Running Story
            </h3>
            <p className="text-muted-foreground text-center">
              {selectedStory?.title}
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Processing {selectedStory?.chapters.length || 0} chapters...
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={currentStep === 'review'} onOpenChange={() => handleCancelWF2()}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Run Complete</DialogTitle>
          </DialogHeader>
          {runResult && (
            <RunReview
              result={runResult}
              onCompilePattern={handleCompilePattern}
              onRunAgain={() => {
                handleCancelWF2();
                setTimeout(() => handleExplainPlan(), 100);
              }}
              onClose={handleCancelWF2}
              isCompiling={isCompiling}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
