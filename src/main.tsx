/**
 * Application Entry Point
 *
 * Sets up routing, lazy loading, and error boundaries
 */

import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import { initializeTheme } from '@/hooks';
import './index.css';

// Lazy load route components for code splitting
const Home = lazy(() => import('./routes/home/index'));
const LuxBuilder = lazy(() => import('./routes/studio/lux/index'));
const NarrativeBuilder = lazy(() => import('./routes/studio/narrative/index'));
const Templates = lazy(() => import('./routes/library/templates'));
const Knowledge = lazy(() => import('./routes/library/knowledge'));
const NexisPage = lazy(() => import('./routes/knowledge/nexis'));
const KnowledgeIndex = lazy(() => import('./routes/knowledge/index'));
const KnowledgeLibrary = lazy(() => import('./routes/knowledge/library'));
const Spaces = lazy(() => import('./routes/spaces/index'));
const Chat = lazy(() => import('./routes/chat/index'));

// Insights/Signals routes
const ROIDashboard = lazy(() => import('./features/insights/ROIDashboard'));

// Cognate routes
const Cognates = lazy(() => import('./routes/studio/cognates/index'));
const CognateDetail = lazy(() => import('./routes/studio/cognates/[id]/index'));
const CognateSOPs = lazy(() => import('./routes/studio/cognates/[id]/sops'));
const NewSOP = lazy(() => import('./routes/studio/cognates/[id]/sops/new'));
const EditSOP = lazy(() => import('./routes/studio/cognates/[id]/sops/[sopId]'));
const SOPEdit = lazy(() => import('./routes/studio/cognates/[id]/sops/edit'));
const SOPRules = lazy(() => import('./routes/studio/cognates/[id]/sops/rules'));
const SOPValidate = lazy(() => import('./routes/studio/cognates/[id]/sops/validate'));
const CognateBootstrap = lazy(() => import('./routes/studio/cognates/[id]/bootstrap'));
const CognatePacks = lazy(() => import('./routes/studio/cognates/[id]/packs'));
const CognateTraining = lazy(() => import('./routes/studio/cognates/[id]/training'));

// Governance routes
const Governance = lazy(() => import('./routes/governance/index'));
const ConcordSetup = lazy(() => import('./routes/governance/concord/index'));
const ConcordLive = lazy(() => import('./routes/governance/concord/[sessionId]'));

// Control routes
const Approvals = lazy(() => import('./routes/control/approvals'));
const Ledger = lazy(() => import('./routes/control/ledger'));
const C2S2Page = lazy(() => import('./routes/control/c2s2'));

// Run routes
const Runs = lazy(() => import('./routes/runs/index'));
const RunTrace = lazy(() => import('./routes/runs/[runId]/trace'));

// Settings route
const Settings = lazy(() => import('./routes/settings/index'));

// Loading fallback component
function RouteLoading(): JSX.Element {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-symtex-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    </div>
  );
}

// Placeholder for new route sections
function SectionIndex({ title, description }: { title: string; description: string }): JSX.Element {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-foreground mb-2">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

// Initialize theme before React renders to prevent FOUC
initializeTheme();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          {/* ==================== */}
          {/* HOME                 */}
          {/* ==================== */}
          <Route
            index
            element={
              <Suspense fallback={<RouteLoading />}>
                <Home />
              </Suspense>
            }
          />

          {/* ==================== */}
          {/* SPACES               */}
          {/* ==================== */}
          <Route
            path="spaces"
            element={
              <Suspense fallback={<RouteLoading />}>
                <Spaces />
              </Suspense>
            }
          />
          <Route
            path="spaces/:domainId"
            element={
              <Suspense fallback={<RouteLoading />}>
                <Spaces />
              </Suspense>
            }
          />
          <Route
            path="spaces/:domainId/:projectId"
            element={
              <Suspense fallback={<RouteLoading />}>
                <Spaces />
              </Suspense>
            }
          />

          {/* ==================== */}
          {/* KNOWLEDGE            */}
          {/* ==================== */}
          <Route
            path="knowledge"
            element={
              <Suspense fallback={<RouteLoading />}>
                <KnowledgeIndex />
              </Suspense>
            }
          />
          <Route
            path="knowledge/library"
            element={
              <Suspense fallback={<RouteLoading />}>
                <KnowledgeLibrary />
              </Suspense>
            }
          />
          {/* Legacy route - keep old knowledge graph working */}
          <Route
            path="knowledge/graph"
            element={
              <Suspense fallback={<RouteLoading />}>
                <Knowledge />
              </Suspense>
            }
          />
          <Route
            path="knowledge/templates"
            element={
              <Suspense fallback={<RouteLoading />}>
                <Templates />
              </Suspense>
            }
          />
          <Route
            path="knowledge/nexis"
            element={
              <Suspense fallback={<RouteLoading />}>
                <NexisPage />
              </Suspense>
            }
          />

          {/* ==================== */}
          {/* RUNS                 */}
          {/* ==================== */}
          <Route
            path="runs"
            element={
              <Suspense fallback={<RouteLoading />}>
                <Runs />
              </Suspense>
            }
          />
          <Route
            path="runs/:runId"
            element={
              <Suspense fallback={<RouteLoading />}>
                <RunTrace />
              </Suspense>
            }
          />
          <Route
            path="runs/:runId/trace"
            element={
              <Suspense fallback={<RouteLoading />}>
                <RunTrace />
              </Suspense>
            }
          />

          {/* ==================== */}
          {/* TEAM                 */}
          {/* ==================== */}
          <Route
            path="team"
            element={<SectionIndex title="Team" description="Manage your Cognates and team collaboration." />}
          />
          <Route
            path="team/cognates"
            element={
              <Suspense fallback={<RouteLoading />}>
                <Cognates />
              </Suspense>
            }
          />
          <Route
            path="team/cognates/:id"
            element={
              <Suspense fallback={<RouteLoading />}>
                <CognateDetail />
              </Suspense>
            }
          />
          <Route
            path="team/cognates/:id/sops"
            element={
              <Suspense fallback={<RouteLoading />}>
                <CognateSOPs />
              </Suspense>
            }
          />
          <Route
            path="team/cognates/:id/sops/new"
            element={
              <Suspense fallback={<RouteLoading />}>
                <NewSOP />
              </Suspense>
            }
          />
          <Route
            path="team/cognates/:id/sops/:sopId"
            element={
              <Suspense fallback={<RouteLoading />}>
                <EditSOP />
              </Suspense>
            }
          />
          <Route
            path="team/cognates/:id/sops/:sopId/edit"
            element={
              <Suspense fallback={<RouteLoading />}>
                <SOPEdit />
              </Suspense>
            }
          />
          <Route
            path="team/cognates/:id/sops/:sopId/rules"
            element={
              <Suspense fallback={<RouteLoading />}>
                <SOPRules />
              </Suspense>
            }
          />
          <Route
            path="team/cognates/:id/sops/:sopId/validate"
            element={
              <Suspense fallback={<RouteLoading />}>
                <SOPValidate />
              </Suspense>
            }
          />
          <Route
            path="team/cognates/:id/bootstrap"
            element={
              <Suspense fallback={<RouteLoading />}>
                <CognateBootstrap />
              </Suspense>
            }
          />
          <Route
            path="team/cognates/:id/packs"
            element={
              <Suspense fallback={<RouteLoading />}>
                <CognatePacks />
              </Suspense>
            }
          />
          <Route
            path="team/cognates/:id/training"
            element={
              <Suspense fallback={<RouteLoading />}>
                <CognateTraining />
              </Suspense>
            }
          />

          {/* ==================== */}
          {/* SIGNALS              */}
          {/* ==================== */}
          <Route
            path="signals"
            element={
              <Suspense fallback={<RouteLoading />}>
                <ROIDashboard />
              </Suspense>
            }
          />
          <Route
            path="signals/roi"
            element={
              <Suspense fallback={<RouteLoading />}>
                <ROIDashboard />
              </Suspense>
            }
          />

          {/* ==================== */}
          {/* CONTROL              */}
          {/* ==================== */}
          <Route
            path="control"
            element={
              <Suspense fallback={<RouteLoading />}>
                <Governance />
              </Suspense>
            }
          />
          <Route
            path="control/lux"
            element={
              <Suspense fallback={<RouteLoading />}>
                <LuxBuilder />
              </Suspense>
            }
          />
          <Route
            path="control/narrative"
            element={
              <Suspense fallback={<RouteLoading />}>
                <NarrativeBuilder />
              </Suspense>
            }
          />
          <Route
            path="control/concord"
            element={
              <Suspense fallback={<RouteLoading />}>
                <ConcordSetup />
              </Suspense>
            }
          />
          <Route
            path="control/concord/:sessionId"
            element={
              <Suspense fallback={<RouteLoading />}>
                <ConcordLive />
              </Suspense>
            }
          />
          <Route
            path="control/c2s2"
            element={
              <Suspense fallback={<RouteLoading />}>
                <C2S2Page />
              </Suspense>
            }
          />
          <Route
            path="control/approvals"
            element={
              <Suspense fallback={<RouteLoading />}>
                <Approvals />
              </Suspense>
            }
          />
          <Route
            path="control/ledger"
            element={
              <Suspense fallback={<RouteLoading />}>
                <Ledger />
              </Suspense>
            }
          />

          {/* ==================== */}
          {/* SYMBIOS (Chat)       */}
          {/* ==================== */}
          <Route
            path="symbios"
            element={
              <Suspense fallback={<RouteLoading />}>
                <Chat />
              </Suspense>
            }
          />
          <Route
            path="symbios/:conversationId"
            element={
              <Suspense fallback={<RouteLoading />}>
                <Chat />
              </Suspense>
            }
          />

          {/* ==================== */}
          {/* SETTINGS             */}
          {/* ==================== */}
          <Route
            path="settings"
            element={
              <Suspense fallback={<RouteLoading />}>
                <Settings />
              </Suspense>
            }
          />

          {/* ==================== */}
          {/* LEGACY ROUTES        */}
          {/* Keep old studio routes working during migration */}
          {/* ==================== */}

          {/* Studio Cognate routes (keep working during transition) */}
          <Route
            path="studio/cognates"
            element={
              <Suspense fallback={<RouteLoading />}>
                <Cognates />
              </Suspense>
            }
          />
          <Route
            path="studio/cognates/:id"
            element={
              <Suspense fallback={<RouteLoading />}>
                <CognateDetail />
              </Suspense>
            }
          />
          <Route
            path="studio/cognates/:id/sops"
            element={
              <Suspense fallback={<RouteLoading />}>
                <CognateSOPs />
              </Suspense>
            }
          />
          <Route
            path="studio/cognates/:id/sops/new"
            element={
              <Suspense fallback={<RouteLoading />}>
                <NewSOP />
              </Suspense>
            }
          />
          <Route
            path="studio/cognates/:id/sops/:sopId"
            element={
              <Suspense fallback={<RouteLoading />}>
                <EditSOP />
              </Suspense>
            }
          />
          <Route
            path="studio/cognates/:id/sops/:sopId/edit"
            element={
              <Suspense fallback={<RouteLoading />}>
                <SOPEdit />
              </Suspense>
            }
          />
          <Route
            path="studio/cognates/:id/sops/:sopId/rules"
            element={
              <Suspense fallback={<RouteLoading />}>
                <SOPRules />
              </Suspense>
            }
          />
          <Route
            path="studio/cognates/:id/sops/:sopId/validate"
            element={
              <Suspense fallback={<RouteLoading />}>
                <SOPValidate />
              </Suspense>
            }
          />
          <Route
            path="studio/cognates/:id/bootstrap"
            element={
              <Suspense fallback={<RouteLoading />}>
                <CognateBootstrap />
              </Suspense>
            }
          />
          <Route
            path="studio/cognates/:id/packs"
            element={
              <Suspense fallback={<RouteLoading />}>
                <CognatePacks />
              </Suspense>
            }
          />
          <Route
            path="studio/cognates/:id/training"
            element={
              <Suspense fallback={<RouteLoading />}>
                <CognateTraining />
              </Suspense>
            }
          />

          {/* ==================== */}
          {/* LEGACY REDIRECTS     */}
          {/* ==================== */}

          {/* Dashboard redirects */}
          <Route path="dashboard" element={<Navigate to="/" replace />} />

          {/* Automations/Runs redirects */}
          <Route path="automations" element={<Navigate to="/runs" replace />} />
          <Route path="studio/automations" element={<Navigate to="/runs" replace />} />
          <Route path="missions" element={<Navigate to="/runs" replace />} />

          {/* LUX redirects */}
          <Route path="lux" element={<Navigate to="/control/lux" replace />} />
          <Route path="studio/lux" element={<Navigate to="/control/lux" replace />} />

          {/* Cognate redirects */}
          <Route path="cognates" element={<Navigate to="/team/cognates" replace />} />
          <Route path="studio/agents" element={<Navigate to="/team/cognates" replace />} />

          {/* Narrative redirects */}
          <Route path="studio/narrative" element={<Navigate to="/control/narrative" replace />} />

          {/* Control/Governance redirects */}
          <Route path="command" element={<Navigate to="/control" replace />} />
          <Route path="governance" element={<Navigate to="/control" replace />} />
          <Route path="governance/concord" element={<Navigate to="/control/concord" replace />} />
          <Route path="governance/concord/:sessionId" element={<Navigate to="/control/concord/:sessionId" replace />} />
          <Route path="concord" element={<Navigate to="/control/concord" replace />} />

          {/* NEXIS redirects */}
          <Route path="nexis" element={<Navigate to="/knowledge/nexis" replace />} />

          {/* C2S2 redirect */}
          <Route path="c2s1" element={<Navigate to="/control/c2s2" replace />} />

          {/* Signals redirects */}
          <Route path="dna" element={<Navigate to="/signals" replace />} />
          <Route path="analytics" element={<Navigate to="/signals" replace />} />

          {/* Library redirects */}
          <Route path="library/templates" element={<Navigate to="/knowledge/templates" replace />} />
          <Route path="library/knowledge" element={<Navigate to="/knowledge/library" replace />} />

          {/* Chat/Conversations redirects */}
          <Route path="chat" element={<Navigate to="/symbios" replace />} />
          <Route path="conversations" element={<Navigate to="/symbios" replace />} />

          {/* Other legacy redirects */}
          <Route path="activity" element={<Navigate to="/" replace />} />
          <Route path="build" element={<Navigate to="/runs" replace />} />

          {/* ==================== */}
          {/* 404                  */}
          {/* ==================== */}
          <Route
            path="*"
            element={
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-foreground mb-2">404</h1>
                  <p className="text-muted-foreground">Page not found</p>
                </div>
              </div>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
