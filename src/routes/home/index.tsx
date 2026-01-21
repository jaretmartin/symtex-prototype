import { Link } from 'react-router-dom'
import {
  Home as HomeIcon,
  Target,
  ArrowRight,
  Sparkles,
  Workflow,
  Play
} from 'lucide-react'

// Import merged Activity components
import ActivityStats from '../../components/activity/ActivityStats'

// Import DNA/PromptOps placeholders
import DNAStrength from '../../components/dna/DNAStrength'
import PromptOpsPlaceholder from '../../components/dna/PromptOpsPlaceholder'

// Import Home components
import {
  AIBudgetStatus,
  ActionCenter,
  InsightsPanel,
  ActiveMissionsWidget,
  CognateActivityWidget,
  RecentContextsWidget,
  QuickActionsWidget,
  WidgetErrorBoundary
} from '../../components/home'

/**
 * Home Page - Main Dashboard
 *
 * DESIGN DECISIONS:
 *
 * 1. ACTIVITY MERGE DECISION: MERGED
 *    The Activity page has been merged into the Home page for the following reasons:
 *    - The Activity link in navigation was pointing back to Home anyway, creating
 *      redundant navigation that confused users
 *    - The Activity stats (conversations, cognate actions, automation success) are
 *      valuable metrics that users want to see immediately on their dashboard
 *    - Consolidating Activity into Home reduces navigation complexity and creates
 *      a single source of truth for operational overview
 *    - The "Activity Overview" section now lives in the ActivityStats component
 *      which is imported and displayed prominently on this page
 *
 * 2. DNA STRENGTH INTEGRATION:
 *    The DNA Strength component shows the health/strength of your AI's core
 *    capabilities. This is a PLACEHOLDER implementation demonstrating where
 *    actual DNA metrics would be displayed. In production, this would connect
 *    to PromptOps to calculate real strength scores.
 *
 * 3. PROMPTOPS PLACEHOLDER:
 *    PromptOps features are planned but not yet implemented. A placeholder
 *    component shows where these features would integrate and allows users
 *    to join a waitlist for early access.
 *
 * 4. AI BUDGET STATUS:
 *    The AI Budget component is fully functional with expand/collapse behavior.
 *    When collapsed, it shows a quick summary. When expanded, it reveals:
 *    - Per-category spending breakdown
 *    - Trend indicators
 *    - Usage visualization
 *    - Management actions
 *
 * 5. PHASE 2.7 ENHANCEMENTS:
 *    - All widgets now have loading skeleton states
 *    - Error boundaries wrap each widget for graceful error handling
 *    - New widgets added: ActiveMissions, CognateActivity, RecentContexts, QuickActions
 *    - Improved layout with responsive grid system
 *    - Interactive filtering and navigation in all widgets
 */

export default function Home(): JSX.Element {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <HomeIcon className="w-8 h-8 text-symtex-primary" />
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's an overview of your AI operations.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Link
            to="/studio/lux"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg gradient-primary text-foreground font-medium hover:opacity-90 transition-all"
          >
            <Workflow className="w-5 h-5" />
            LUX Builder
          </Link>
          <Link
            to="/studio/automations"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border transition-all"
          >
            <Play className="w-5 h-5" />
            Automations
          </Link>
          <Link
            to="/missions"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border transition-all"
          >
            <Target className="w-5 h-5" />
            View Missions
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* AI Budget Status - Expandable/Collapsible */}
      <WidgetErrorBoundary widgetName="AI Budget Status">
        <AIBudgetStatus />
      </WidgetErrorBoundary>

      {/* Activity Stats - Merged from Activity page */}
      <WidgetErrorBoundary widgetName="Activity Stats">
        <ActivityStats />
      </WidgetErrorBoundary>

      {/* Quick Actions - Full width for easy access */}
      <WidgetErrorBoundary widgetName="Quick Actions">
        <QuickActionsWidget />
      </WidgetErrorBoundary>

      {/* Main Content Grid - Two columns on large screens */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Action Center, Insights, Missions */}
        <div className="lg:col-span-2 space-y-6">
          <WidgetErrorBoundary widgetName="Action Center">
            <ActionCenter />
          </WidgetErrorBoundary>

          <WidgetErrorBoundary widgetName="Active Missions">
            <ActiveMissionsWidget maxItems={3} />
          </WidgetErrorBoundary>

          <WidgetErrorBoundary widgetName="AI Insights">
            <InsightsPanel />
          </WidgetErrorBoundary>
        </div>

        {/* Right Column - DNA, Cognates, Contexts, PromptOps */}
        <div className="space-y-6">
          {/*
            DNA Strength Component
            Shows the health of your AI's core capabilities.
            PLACEHOLDER: Would connect to PromptOps for real metrics.
          */}
          <WidgetErrorBoundary widgetName="DNA Strength">
            <DNAStrength compact />
          </WidgetErrorBoundary>

          <WidgetErrorBoundary widgetName="Cognate Activity">
            <CognateActivityWidget maxItems={4} />
          </WidgetErrorBoundary>

          <WidgetErrorBoundary widgetName="Recent Contexts">
            <RecentContextsWidget maxItems={4} />
          </WidgetErrorBoundary>

          {/*
            PromptOps Placeholder
            Shows where PromptOps features would integrate.
            Features are planned but not yet implemented.
          */}
          <WidgetErrorBoundary widgetName="PromptOps">
            <PromptOpsPlaceholder />
          </WidgetErrorBoundary>
        </div>
      </div>

      {/* Quick Stats Footer */}
      <div className="bg-gradient-to-r from-symtex-primary/10 to-symtex-accent/10 rounded-xl border border-symtex-primary/20 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-symtex-primary/20">
              <Sparkles className="w-6 h-6 text-symtex-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">AI Operations Summary</h3>
              <p className="text-sm text-muted-foreground">
                Your AI is handling 94.2% of automated tasks successfully
              </p>
            </div>
          </div>
          <Link
            to="/signals"
            className="px-5 py-2.5 rounded-lg gradient-primary text-foreground font-medium hover:opacity-90 transition-opacity"
          >
            View Full Report
          </Link>
        </div>
      </div>
    </div>
  )
}
