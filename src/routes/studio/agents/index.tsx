/**
 * Agent Roster Page
 *
 * Full-page wrapper for the AgentRoster component.
 * Displays available agent templates and allows instance creation.
 */

import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, ArrowLeft, Plus } from 'lucide-react';
import AgentRoster from '@/components/agent/AgentRoster';
import { useAgentStore } from '@/store/useAgentStore';
import { useToast } from '@/store';
import type { AgentTemplate, AgentInstance } from '@/types';

export default function AgentsPage(): JSX.Element {
  const navigate = useNavigate();
  const { success, error, info } = useToast();
  const { createInstance, templates } = useAgentStore();

  // Handle template selection
  const handleSelectTemplate = useCallback(
    (template: AgentTemplate): void => {
      // Could navigate to a detail view or open a modal
      console.log('Selected template:', template.id);
    },
    []
  );

  // Handle creating an agent instance
  const handleCreateInstance = useCallback(
    (templateId: string): void => {
      const template = templates.find((t) => t.id === templateId);
      if (!template) {
        error('Creation Failed', 'Template not found.');
        return;
      }

      // Create instance object matching the AgentInstance interface
      const instance: AgentInstance = {
        id: `agent-${Date.now()}`,
        templateId,
        status: 'idle',
        totalExecutions: 0,
        successfulExecutions: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      createInstance(instance);
      success('Agent Created', `Successfully created new ${template.name} instance`);
    },
    [createInstance, templates, success, error]
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Bot className="w-8 h-8 text-symtex-primary" />
              Agent Roster
            </h1>
            <p className="text-slate-400 mt-1">
              Browse and deploy AI agents with different verification patterns
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            // Could open a custom agent builder modal
            info('Coming Soon', 'Custom agent creation will be available in a future update.');
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg gradient-primary text-white font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5" aria-hidden="true" />
          Create Custom Agent
        </button>
      </div>

      {/* Agent Roster Component */}
      <AgentRoster
        onSelectTemplate={handleSelectTemplate}
        onCreateInstance={handleCreateInstance}
      />
    </div>
  );
}
