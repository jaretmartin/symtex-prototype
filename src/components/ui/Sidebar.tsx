/**
 * Sidebar Navigation Component
 *
 * Features:
 * - Mobile responsive with drawer pattern
 * - Accessible navigation with ARIA attributes
 * - Coming Soon badges for unimplemented routes
 * - Integration with UI store for state management
 */

import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Target,
  Settings,
  Zap,
  BarChart3,
  MessageSquare,
  Dna,
  Workflow,
  Play,
  Menu,
  X,
  BookOpen,
  FileText,
  Lock,
  Bot,
  BookText,
  Layers,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import clsx from 'clsx';
import { useUIStore } from '../../store';
import { SpaceTree } from '../context/SpaceTree';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  comingSoon?: boolean;
}

const navigation: NavItem[] = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Missions', href: '/missions', icon: Target },
  { name: 'DNA', href: '/dna', icon: Dna, comingSoon: true },
  { name: 'Analytics', href: '/analytics', icon: BarChart3, comingSoon: true },
  { name: 'Conversations', href: '/conversations', icon: MessageSquare, comingSoon: true },
];

const studioNavigation: NavItem[] = [
  { name: 'LUX Builder', href: '/studio/lux', icon: Workflow },
  { name: 'Automations', href: '/studio/automations', icon: Play },
  { name: 'Narrative', href: '/studio/narrative', icon: BookText },
  { name: 'Agents', href: '/studio/agents', icon: Bot },
];

const libraryNavigation: NavItem[] = [
  { name: 'Templates', href: '/library/templates', icon: FileText },
  { name: 'Knowledge', href: '/library/knowledge', icon: BookOpen },
];

export default function Sidebar(): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const [spacesExpanded, setSpacesExpanded] = useState(true);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [location.pathname, setSidebarOpen]);

  // Handle escape key to close sidebar
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [sidebarOpen, setSidebarOpen]);

  const renderNavItem = (item: NavItem): JSX.Element => {
    const isActive = location.pathname === item.href ||
      (item.href !== '/' && location.pathname.startsWith(item.href));

    if (item.comingSoon) {
      return (
        <Link
          key={item.name}
          to={item.href}
          aria-current={isActive ? 'page' : undefined}
          className={clsx(
            'flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all duration-200',
            'text-slate-500 hover:bg-slate-800/50 cursor-pointer'
          )}
        >
          <div className="flex items-center gap-3">
            <item.icon className="w-5 h-5" aria-hidden="true" />
            <span className="font-medium">{item.name}</span>
          </div>
          <span className="flex items-center gap-1 text-xs bg-slate-700/50 text-slate-400 px-2 py-0.5 rounded">
            <Lock className="w-3 h-3" aria-hidden="true" />
            Soon
          </span>
        </Link>
      );
    }

    return (
      <Link
        key={item.name}
        to={item.href}
        aria-current={isActive ? 'page' : undefined}
        className={clsx(
          'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
          isActive
            ? 'bg-symtex-primary/20 text-symtex-primary border border-symtex-primary/30'
            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
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
          'bg-symtex-card border border-symtex-border',
          'text-slate-400 hover:text-white transition-colors',
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
          'fixed inset-y-0 left-0 z-50 w-64 bg-symtex-card border-r border-symtex-border flex flex-col',
          'transform transition-transform duration-300 ease-in-out',
          'lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        aria-label="Main navigation"
      >
        {/* Header */}
        <div className="p-6 border-b border-symtex-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Symtex</h1>
              <p className="text-xs text-slate-400">AI Operations Platform</p>
            </div>
          </div>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto" role="navigation">
          {/* Main Navigation */}
          {navigation.map(renderNavItem)}

          {/* Spaces Section with SpaceTree */}
          <div className="pt-4 mt-4 border-t border-symtex-border">
            <button
              type="button"
              onClick={() => setSpacesExpanded(!spacesExpanded)}
              className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-300 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4" aria-hidden="true" />
                <span>Spaces</span>
              </div>
              {spacesExpanded ? (
                <ChevronDown className="w-4 h-4" aria-hidden="true" />
              ) : (
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              )}
            </button>
            {spacesExpanded && (
              <SpaceTree
                className="mt-2"
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
            )}
          </div>

          {/* Studio Section */}
          <div className="pt-4 mt-4 border-t border-symtex-border">
            <p className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Studio
            </p>
            {studioNavigation.map(renderNavItem)}
          </div>

          {/* Library Section */}
          <div className="pt-4 mt-4 border-t border-symtex-border">
            <p className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Library
            </p>
            {libraryNavigation.map(renderNavItem)}
          </div>
        </nav>

        {/* Settings */}
        <div className="p-4 border-t border-symtex-border">
          <Link
            to="/settings"
            className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-slate-500 hover:bg-slate-800/50 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5" aria-hidden="true" />
              <span className="font-medium">Settings</span>
            </div>
            <span className="flex items-center gap-1 text-xs bg-slate-700/50 text-slate-400 px-2 py-0.5 rounded">
              <Lock className="w-3 h-3" aria-hidden="true" />
              Soon
            </span>
          </Link>
        </div>
      </aside>
    </>
  );
}
