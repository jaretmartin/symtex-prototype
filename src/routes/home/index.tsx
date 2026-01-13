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
import AIBudgetStatus from '../../components/home/AIBudgetStatus'
import ActionCenter from '../../components/home/ActionCenter'
import InsightsPanel from '../../components/home/InsightsPanel'

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
 */

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <HomeIcon className="w-8 h-8 text-symtex-primary" />
            Dashboard
          </h1>
          <p className="text-slate-400 mt-1">
            Welcome back! Here's an overview of your AI operations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/studio/lux"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg gradient-primary text-white font-medium hover:opacity-90 transition-all"
          >
            <Workflow className="w-5 h-5" />
            LUX Builder
          </Link>
          <Link
            to="/studio/automations"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-symtex-card border border-symtex-border text-slate-300 hover:text-white hover:border-slate-500 transition-all"
          >
            <Play className="w-5 h-5" />
            Automations
          </Link>
          <Link
            to="/missions"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-symtex-card border border-symtex-border text-slate-300 hover:text-white hover:border-slate-500 transition-all"
          >
            <Target className="w-5 h-5" />
            View Missions
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* AI Budget Status - Expandable/Collapsible */}
      <AIBudgetStatus />

      {/* Activity Stats - Merged from Activity page */}
      {/*
        NOTE: This component was previously on /activity page.
        Merged here because:
        1. Activity navigation was redundant (pointed to Home)
        2. These stats provide immediate dashboard value
        3. Reduces clicks to access key metrics
      */}
      <ActivityStats />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Action Center & Insights */}
        <div className="lg:col-span-2 space-y-6">
          <ActionCenter />
          <InsightsPanel />
        </div>

        {/* Right Column - DNA & PromptOps */}
        <div className="space-y-6">
          {/*
            DNA Strength Component
            Shows the health of your AI's core capabilities.
            PLACEHOLDER: Would connect to PromptOps for real metrics.
          */}
          <DNAStrength />

          {/*
            PromptOps Placeholder
            Shows where PromptOps features would integrate.
            Features are planned but not yet implemented.
          */}
          <PromptOpsPlaceholder />
        </div>
      </div>

      {/* Quick Stats Footer */}
      <div className="bg-gradient-to-r from-symtex-primary/10 to-symtex-accent/10 rounded-xl border border-symtex-primary/20 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-symtex-primary/20">
              <Sparkles className="w-6 h-6 text-symtex-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-white">AI Operations Summary</h3>
              <p className="text-sm text-slate-400">
                Your AI is handling 94.2% of automated tasks successfully
              </p>
            </div>
          </div>
          <button className="px-5 py-2.5 rounded-lg gradient-primary text-white font-medium hover:opacity-90 transition-opacity">
            View Full Report
          </button>
        </div>
      </div>
    </div>
  )
}
