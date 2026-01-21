/**
 * Sidebar Navigation Component
 *
 * Features:
 * - Mobile responsive with drawer pattern
 * - Accessible navigation with ARIA attributes
 * - Option A (OS-nav) 8-item L1 navigation
 * - Expandable Spaces section with SpaceTree
 * - Integration with UI store for state management
 */

import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Layers,
  BookOpen,
  Activity,
  Users,
  Gauge,
  Shield,
  MessageCircle,
  Settings,
  Zap,
  Menu,
  X,
  Lock,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import clsx from 'clsx';
import { useUIStore } from '../../store';
import { SpaceTree } from '../context/SpaceTree';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  description?: string;
  comingSoon?: boolean;
}

/**
 * Option A (OS-nav) - Primary 8-item L1 navigation
 */
const primaryNavigation: NavItem[] = [
  { name: 'Home', href: '/', icon: Home, description: 'Dashboard' },
  { name: 'Spaces', href: '/spaces', icon: Layers, description: 'Space hierarchy' },
  { name: 'Knowledge', href: '/knowledge', icon: BookOpen, description: 'Library, templates, NEXIS' },
  { name: 'Runs', href: '/runs', icon: Activity, description: 'Automation executions, history' },
  { name: 'Team', href: '/team', icon: Users, description: 'Cognate roster, training' },
  { name: 'Signals', href: '/signals', icon: Gauge, description: 'Insights, ROI, patterns' },
  { name: 'Control', href: '/control', icon: Shield, description: 'Governance, approvals, LUX, C2S2' },
  { name: 'Symbios', href: '/symbios', icon: MessageCircle, description: 'AI chat interface' },
];

export default function Sidebar(): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const [spacesExpanded, setSpacesExpanded] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [location.pathname, setSidebarOpen]);

  // Handle escape key to close sidebar
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [sidebarOpen, setSidebarOpen]);

  const renderNavItem = (item: NavItem): JSX.Element => {
    const isActive =
      location.pathname === item.href ||
      (item.href !== '/' && location.pathname.startsWith(item.href));

    // Special handling for Spaces - render with expandable SpaceTree
    if (item.name === 'Spaces') {
      return (
        <div key={item.name}>
          <div className="flex items-center">
            <Link
              to={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={clsx(
                'flex-1 flex items-center gap-3 px-4 py-3 rounded-l-lg transition-all duration-200',
                isActive
                  ? 'bg-symtex-primary/20 text-symtex-primary border border-symtex-primary/30 border-r-0'
                  : 'text-muted-foreground hover:bg-surface-card hover:text-foreground'
              )}
            >
              <item.icon className="w-5 h-5" aria-hidden="true" />
              <span className="font-medium">{item.name}</span>
            </Link>
            <button
              type="button"
              onClick={() => setSpacesExpanded(!spacesExpanded)}
              className={clsx(
                'p-3 rounded-r-lg transition-all duration-200',
                isActive
                  ? 'bg-symtex-primary/20 text-symtex-primary border border-symtex-primary/30 border-l-0'
                  : 'text-muted-foreground hover:bg-surface-card hover:text-foreground'
              )}
              aria-expanded={spacesExpanded}
              aria-controls="spaces-tree-section"
              aria-label={`${spacesExpanded ? 'Collapse' : 'Expand'} spaces tree`}
            >
              {spacesExpanded ? (
                <ChevronDown className="w-4 h-4" aria-hidden="true" />
              ) : (
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              )}
            </button>
          </div>
          {spacesExpanded && (
            <div
              id="spaces-tree-section"
              role="group"
              aria-label="Spaces hierarchy"
              className="ml-4 mt-1 border-l border-border pl-2"
            >
              <SpaceTree
                className="py-2"
                onNavigate={(type, id) => {
                  // Navigate to appropriate route based on space type
                  if (type === 'personal') {
                    navigate('/spaces');
                  } else if (type === 'domain') {
                    navigate(`/spaces/${id}`);
                  } else if (type === 'project') {
                    // Find the domain for this project (handled by route)
                    navigate(`/spaces/domain/${id}`);
                  } else if (type === 'mission') {
                    navigate(`/missions/${id}`);
                  }
                }}
              />
            </div>
          )}
        </div>
      );
    }

    // Standard nav item rendering
    return (
      <Link
        key={item.name}
        to={item.href}
        aria-current={isActive ? 'page' : undefined}
        className={clsx(
          'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
          isActive
            ? 'bg-symtex-primary/20 text-symtex-primary border border-symtex-primary/30'
            : 'text-muted-foreground hover:bg-surface-card hover:text-foreground'
        )}
      >
        <item.icon className="w-5 h-5" aria-hidden="true" />
        <span className="font-medium">{item.name}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        type="button"
        onClick={() => setSidebarOpen(true)}
        className={clsx(
          'lg:hidden fixed top-4 left-4 z-40 p-2 rounded-lg',
          'bg-card border border-border',
          'text-muted-foreground hover:text-foreground transition-colors',
          sidebarOpen && 'hidden'
        )}
        aria-label="Open navigation menu"
        aria-expanded={sidebarOpen}
        aria-controls="sidebar"
      >
        <Menu className="w-6 h-6" aria-hidden="true" />
      </button>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        id="sidebar"
        data-tour="sidebar"
        className={clsx(
          'fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col',
          'transform transition-transform duration-300 ease-in-out',
          'lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        aria-label="Main navigation"
      >
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Zap className="w-6 h-6 text-foreground" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Symtex</h1>
              <p className="text-xs text-muted-foreground">AI Operations Platform</p>
            </div>
          </div>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-card transition-colors"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Navigation */}
        <nav
          id="main-navigation"
          className="flex-1 p-4 space-y-1 overflow-y-auto"
          role="navigation"
          aria-label="Main navigation"
        >
          {/* Primary Navigation - Option A (OS-nav) */}
          <div role="group" aria-label="Primary navigation">
            {primaryNavigation.map(renderNavItem)}
          </div>
        </nav>

        {/* Footer: Theme Toggle & Settings */}
        <div className="p-4 border-t border-border space-y-3">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between px-4 py-2">
            <span className="text-sm text-muted-foreground">Theme</span>
            <ThemeToggle size="sm" />
          </div>

          {/* Settings Link */}
          <Link
            to="/settings"
            aria-label="Settings (Coming soon)"
            className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted/50 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5" aria-hidden="true" />
              <span className="font-medium">Settings</span>
            </div>
            <span className="flex items-center gap-1 text-xs bg-surface-elevated/50 text-muted-foreground px-2 py-0.5 rounded">
              <Lock className="w-3 h-3" aria-hidden="true" />
              Soon
            </span>
          </Link>
        </div>
      </aside>
    </>
  );
}
