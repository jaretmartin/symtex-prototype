/**
 * Command Palette Component
 *
 * Global search and command interface triggered by Cmd+K
 */

import { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Home,
  Target,
  Workflow,
  Zap,
  FileText,
  BookOpen,
  Plus,
  Settings,
  ArrowRight,
} from 'lucide-react';
import clsx from 'clsx';
import { useUIStore } from '@/store';

interface Command {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  shortcut?: string;
  category: 'navigation' | 'action' | 'settings';
  action: () => void;
}

export function CommandPalette(): JSX.Element | null {
  const isOpen = useUIStore((state) => state.commandPaletteOpen);
  const closeCommandPalette = useUIStore((state) => state.closeCommandPalette);

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Define commands
  const commands: Command[] = useMemo(
    () => [
      // Navigation
      {
        id: 'home',
        label: 'Go to Home',
        description: 'Dashboard overview',
        icon: <Home className="w-4 h-4" />,
        shortcut: 'G H',
        category: 'navigation',
        action: () => navigate('/'),
      },
      {
        id: 'missions',
        label: 'Go to Missions',
        description: 'View and manage missions',
        icon: <Target className="w-4 h-4" />,
        shortcut: 'G M',
        category: 'navigation',
        action: () => navigate('/missions'),
      },
      {
        id: 'lux',
        label: 'Open LUX Builder',
        description: 'Visual workflow editor',
        icon: <Workflow className="w-4 h-4" />,
        shortcut: 'G L',
        category: 'navigation',
        action: () => navigate('/studio/lux'),
      },
      {
        id: 'automations',
        label: 'Go to Automations',
        description: 'Manage automations',
        icon: <Zap className="w-4 h-4" />,
        shortcut: 'G A',
        category: 'navigation',
        action: () => navigate('/studio/automations'),
      },
      {
        id: 'templates',
        label: 'Browse Templates',
        description: 'Workflow templates library',
        icon: <FileText className="w-4 h-4" />,
        shortcut: 'G T',
        category: 'navigation',
        action: () => navigate('/library/templates'),
      },
      {
        id: 'knowledge',
        label: 'Knowledge Base',
        description: 'Documentation and guides',
        icon: <BookOpen className="w-4 h-4" />,
        shortcut: 'G K',
        category: 'navigation',
        action: () => navigate('/library/knowledge'),
      },

      // Actions
      {
        id: 'new-workflow',
        label: 'Create New Workflow',
        description: 'Start building a new automation',
        icon: <Plus className="w-4 h-4" />,
        shortcut: 'N W',
        category: 'action',
        action: () => navigate('/studio/lux?new=true'),
      },
      {
        id: 'new-mission',
        label: 'Create New Mission',
        description: 'Add a new mission',
        icon: <Plus className="w-4 h-4" />,
        shortcut: 'N M',
        category: 'action',
        action: () => navigate('/missions?new=true'),
      },

      // Settings
      {
        id: 'settings',
        label: 'Settings',
        description: 'App preferences',
        icon: <Settings className="w-4 h-4" />,
        category: 'settings',
        action: () => navigate('/settings'),
      },
    ],
    [navigate]
  );

  // Filter commands based on query
  const filteredCommands = useMemo(() => {
    if (!query) return commands;

    const lowerQuery = query.toLowerCase();
    return commands.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(lowerQuery) ||
        cmd.description?.toLowerCase().includes(lowerQuery)
    );
  }, [commands, query]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent): void => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < filteredCommands.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredCommands.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
            closeCommandPalette();
          }
          break;
        case 'Escape':
          e.preventDefault();
          closeCommandPalette();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, closeCommandPalette]);

  // Global Cmd+K listener
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent): void => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        useUIStore.getState().toggleCommandPalette();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Scroll selected item into view
  useEffect(() => {
    const selectedElement = listRef.current?.children[selectedIndex] as
      | HTMLElement
      | undefined;
    selectedElement?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  if (!isOpen) return null;

  // Group commands by category
  const groupedCommands = filteredCommands.reduce(
    (acc, cmd) => {
      if (!acc[cmd.category]) acc[cmd.category] = [];
      acc[cmd.category].push(cmd);
      return acc;
    },
    {} as Record<string, Command[]>
  );

  const categoryLabels = {
    navigation: 'Navigation',
    action: 'Actions',
    settings: 'Settings',
  };

  let globalIndex = 0;

  return (
    <div className="fixed inset-0 z-modal">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeCommandPalette}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-lg">
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
          className="bg-symtex-card border border-symtex-border rounded-2xl shadow-2xl overflow-hidden animate-scale-in"
        >
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-symtex-border">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a command or search..."
              className="flex-1 bg-transparent text-white placeholder-slate-400 focus:outline-none"
              aria-label="Search commands"
            />
            <kbd className="px-2 py-1 text-xs font-medium text-slate-400 bg-symtex-dark rounded">
              ESC
            </kbd>
          </div>

          {/* Command List */}
          <div
            ref={listRef}
            className="max-h-80 overflow-y-auto py-2"
            role="listbox"
          >
            {filteredCommands.length === 0 ? (
              <div className="px-4 py-8 text-center text-slate-400">
                No commands found for "{query}"
              </div>
            ) : (
              Object.entries(groupedCommands).map(([category, cmds]) => (
                <div key={category}>
                  <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {categoryLabels[category as keyof typeof categoryLabels]}
                  </div>
                  {cmds.map((cmd) => {
                    const index = globalIndex++;
                    const isSelected = index === selectedIndex;

                    return (
                      <button
                        key={cmd.id}
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          cmd.action();
                          closeCommandPalette();
                        }}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={clsx(
                          'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors',
                          isSelected
                            ? 'bg-symtex-primary/20 text-white'
                            : 'text-slate-300 hover:bg-slate-700/50'
                        )}
                      >
                        <span
                          className={clsx(
                            'flex-shrink-0',
                            isSelected ? 'text-symtex-primary' : 'text-slate-400'
                          )}
                        >
                          {cmd.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium">{cmd.label}</div>
                          {cmd.description && (
                            <div className="text-sm text-slate-400 truncate">
                              {cmd.description}
                            </div>
                          )}
                        </div>
                        {cmd.shortcut && (
                          <kbd className="flex-shrink-0 px-2 py-0.5 text-xs font-medium text-slate-400 bg-symtex-dark rounded">
                            {cmd.shortcut}
                          </kbd>
                        )}
                        {isSelected && (
                          <ArrowRight className="w-4 h-4 text-symtex-primary flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-symtex-border text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <span>
                <kbd className="px-1.5 py-0.5 bg-symtex-dark rounded">↑↓</kbd>{' '}
                Navigate
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 bg-symtex-dark rounded">↵</kbd>{' '}
                Select
              </span>
            </div>
            <span>
              <kbd className="px-1.5 py-0.5 bg-symtex-dark rounded">⌘K</kbd> to
              toggle
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
