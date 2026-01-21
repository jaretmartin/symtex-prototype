/**
 * Root Application Component
 *
 * Provides layout structure, global providers, and error boundaries
 */

import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './components/ui/Sidebar';
import { ErrorBoundary } from './components/error';
import { CommandPalette } from './components/command';
import { ToastContainer } from './components/ui/Toast';
import { BreadcrumbRail, ContextSummaryPill } from './components/context';
import { AriaPresence, AriaChat } from './components/aria';
import { SkipLinks } from './components/a11y';
import { DemoProvider, DemoControlPanel } from './demo';
import { CognateDock } from './components/cognate';
import { analyticsService } from './api';
import { useUIStore } from './store';

function App(): JSX.Element {
  const location = useLocation();
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const [ariaChatOpen, setAriaChatOpen] = useState(false);

  // Track page views
  useEffect(() => {
    analyticsService.pageView(location.pathname, document.title);
  }, [location.pathname]);

  // LUX Builder uses full-screen layout without sidebar
  const isFullScreenRoute = location.pathname === '/studio/lux';

  if (isFullScreenRoute) {
    return (
      <DemoProvider>
        <ErrorBoundary>
          <Outlet />
          <CommandPalette />
          <ToastContainer />
          <CognateDock position="bottom-left" />
          <DemoControlPanel />
        </ErrorBoundary>
      </DemoProvider>
    );
  }

  return (
    <DemoProvider>
      <ErrorBoundary>
        <div className="flex min-h-screen bg-background">
          {/* Skip links for accessibility */}
          <SkipLinks />

          {/* Sidebar */}
          <Sidebar />

          {/* Main content area */}
          <main
            id="main-content"
            className={`flex-1 flex flex-col transition-all duration-300 ${
              sidebarOpen ? 'lg:ml-64' : 'ml-0'
            } overflow-auto`}
          >
            {/* Breadcrumb navigation rail */}
            <BreadcrumbRail className="sticky top-0 z-30" />

            {/* Page content */}
            <div className="flex-1 p-4 md:p-6 lg:p-8">
              <ErrorBoundary>
                <Outlet />
              </ErrorBoundary>
            </div>
          </main>

          {/* Context Summary Pill - floating bottom-right */}
          <ContextSummaryPill />

          {/* Aria Meta-Cognate Presence */}
          <AriaPresence
            onOpenChat={() => setAriaChatOpen(true)}
            status="available"
          />
          <AriaChat
            isOpen={ariaChatOpen}
            onClose={() => setAriaChatOpen(false)}
          />
        </div>

        {/* Global overlays */}
        <CommandPalette />
        <ToastContainer />
        <CognateDock position="bottom-left" />
        <DemoControlPanel />
      </ErrorBoundary>
    </DemoProvider>
  );
}

export default App;
