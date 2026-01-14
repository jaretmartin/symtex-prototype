/**
 * CreateMissionModal Component
 *
 * Modal for creating new missions within a project.
 * Features: Name, description, project selector, optional cognate assignment,
 * connects to useSpaceStore.createMission.
 */

import { useState, useEffect } from 'react';
import { X, Target, ChevronDown, Check, Bot, Sparkles } from 'lucide-react';
import clsx from 'clsx';
import { useSpaceStore, useCognateStore, useToast } from '@/store';
import type { SpaceMission, SpaceMissionStatus } from '@/types';

interface CreateMissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (mission: SpaceMission) => void;
  /** Pre-selected project ID */
  defaultProjectId?: string;
}

interface FormData {
  name: string;
  description: string;
  projectId: string;
  assignedCognateId: string;
  status: SpaceMissionStatus;
}

const STATUS_OPTIONS: { value: SpaceMissionStatus; label: string; color: string }[] = [
  { value: 'queued', label: 'Queued', color: 'bg-zinc-500' },
  { value: 'running', label: 'Running', color: 'bg-blue-500' },
  { value: 'completed', label: 'Completed', color: 'bg-green-500' },
  { value: 'failed', label: 'Failed', color: 'bg-red-500' },
];

const getInitialFormData = (defaultProjectId?: string): FormData => ({
  name: '',
  description: '',
  projectId: defaultProjectId || '',
  assignedCognateId: '',
  status: 'queued',
});

export function CreateMissionModal({
  isOpen,
  onClose,
  onSuccess,
  defaultProjectId,
}: CreateMissionModalProps): JSX.Element | null {
  const [formData, setFormData] = useState<FormData>(getInitialFormData(defaultProjectId));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [isCognateDropdownOpen, setIsCognateDropdownOpen] = useState(false);

  const createMission = useSpaceStore((state) => state.createMission);
  const getProjects = useSpaceStore((state) => state.getProjects);
  const getDomains = useSpaceStore((state) => state.getDomains);
  const projects = getProjects();
  const domains = getDomains();

  const cognates = useCognateStore((state) => state.cognates);
  const toast = useToast();

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormData(defaultProjectId));
      setErrors({});
    }
  }, [isOpen, defaultProjectId]);

  const handleClose = (): void => {
    setFormData(getInitialFormData(defaultProjectId));
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  // Get the selected project and its domain
  const selectedProject = projects.find((p) => p.id === formData.projectId);
  const projectDomain = selectedProject
    ? domains.find((d) => d.id === selectedProject.domainId)
    : null;

  // Get selected cognate
  const selectedCognate = cognates.find((c) => c.id === formData.assignedCognateId);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Mission name is required';
    } else if (formData.name.length > 150) {
      newErrors.name = 'Mission name must be 150 characters or less';
    }

    if (!formData.projectId) {
      newErrors.projectId = 'Please select a project';
    }

    if (formData.description.length > 2000) {
      newErrors.description = 'Description must be 2000 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create the mission object
      const newMission: SpaceMission = {
        id: `mission-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        projectId: formData.projectId,
        name: formData.name.trim(),
        description: formData.description.trim(),
        status: formData.status,
        assignedCognateId: formData.assignedCognateId || undefined,
        reasoningTraceId: undefined,
      };

      // Save to store
      createMission(newMission);

      // Show success toast
      toast.success('Mission created', `${formData.name} has been created successfully.`);

      // Call success callback
      if (onSuccess) {
        onSuccess(newMission);
      }

      // Close modal
      handleClose();
    } catch (error) {
      toast.error(
        'Error creating mission',
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Group projects by domain for better UX
  const projectsByDomain = domains.map((domain) => ({
    domain,
    projects: projects.filter((p) => p.domainId === domain.id),
  })).filter((group) => group.projects.length > 0);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className={clsx(
          'relative w-full max-w-2xl max-h-[90vh] overflow-y-auto',
          'bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl',
          'm-4'
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-mission-title"
      >
        {/* Header */}
        <div className="sticky top-0 bg-zinc-900 px-6 py-4 border-b border-zinc-800 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 id="create-mission-title" className="text-lg font-semibold text-white">
                Create New Mission
              </h2>
              <p className="text-sm text-zinc-400">
                Define a specific task for your AI to execute
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Project Selector */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Project <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={(): void => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
                className={clsx(
                  'w-full flex items-center justify-between gap-2',
                  'px-4 py-3 bg-zinc-900 border rounded-lg',
                  'text-left transition-colors',
                  'hover:border-zinc-600 focus:border-symtex-primary focus:outline-none',
                  errors.projectId ? 'border-red-500' : 'border-zinc-700'
                )}
              >
                {selectedProject ? (
                  <div className="flex items-center gap-3">
                    {projectDomain && (
                      <div
                        className="w-2 h-8 rounded-full"
                        style={{ backgroundColor: projectDomain.color }}
                      />
                    )}
                    <div>
                      <span className="text-white">{selectedProject.name}</span>
                      {projectDomain && (
                        <span className="text-zinc-500 text-sm ml-2">
                          in {projectDomain.name}
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <span className="text-zinc-400">Select a project...</span>
                )}
                <ChevronDown
                  className={clsx(
                    'w-5 h-5 text-zinc-400 transition-transform',
                    isProjectDropdownOpen && 'rotate-180'
                  )}
                />
              </button>

              {isProjectDropdownOpen && (
                <div className="absolute z-50 w-full mt-2 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl max-h-72 overflow-y-auto">
                  {projectsByDomain.length > 0 ? (
                    projectsByDomain.map(({ domain, projects: domainProjects }) => (
                      <div key={domain.id}>
                        {/* Domain Header */}
                        <div className="px-4 py-2 bg-zinc-800/50 border-b border-zinc-700 sticky top-0">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: domain.color }}
                            />
                            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                              {domain.name}
                            </span>
                          </div>
                        </div>
                        {/* Projects in Domain */}
                        {domainProjects.map((project) => (
                          <button
                            key={project.id}
                            type="button"
                            onClick={(): void => {
                              setFormData({ ...formData, projectId: project.id });
                              setIsProjectDropdownOpen(false);
                              if (errors.projectId) {
                                setErrors({ ...errors, projectId: '' });
                              }
                            }}
                            className={clsx(
                              'w-full flex items-center justify-between gap-3 px-4 py-3',
                              'hover:bg-zinc-800 transition-colors',
                              formData.projectId === project.id && 'bg-zinc-800'
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className="w-2 h-6 rounded-full"
                                style={{ backgroundColor: domain.color }}
                              />
                              <div className="text-left">
                                <span className="text-white block">{project.name}</span>
                                <span className="text-xs text-zinc-500">
                                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)} - {project.progress}% complete
                                </span>
                              </div>
                            </div>
                            {formData.projectId === project.id && (
                              <Check className="w-4 h-4 text-symtex-primary" />
                            )}
                          </button>
                        ))}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-6 text-center">
                      <p className="text-zinc-400 text-sm">No projects available</p>
                      <p className="text-zinc-500 text-xs mt-1">Create a project first</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            {errors.projectId && (
              <p className="mt-1 text-sm text-red-400">{errors.projectId}</p>
            )}
          </div>

          {/* Name Field */}
          <div>
            <label htmlFor="mission-name" className="block text-sm font-medium text-zinc-300 mb-2">
              Mission Name <span className="text-red-400">*</span>
            </label>
            <input
              id="mission-name"
              type="text"
              value={formData.name}
              onChange={(e): void => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) {
                  setErrors({ ...errors, name: '' });
                }
              }}
              placeholder="Enter mission name"
              className={clsx(
                'w-full px-4 py-3 bg-zinc-900 border rounded-lg',
                'text-white placeholder-zinc-500',
                'focus:outline-none focus:border-symtex-primary',
                errors.name ? 'border-red-500' : 'border-zinc-700'
              )}
              maxLength={150}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-400">{errors.name}</p>
            )}
            <p className="mt-1 text-xs text-zinc-500">
              {formData.name.length}/150 characters
            </p>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="mission-description" className="block text-sm font-medium text-zinc-300 mb-2">
              Description
            </label>
            <textarea
              id="mission-description"
              value={formData.description}
              onChange={(e): void => {
                setFormData({ ...formData, description: e.target.value });
                if (errors.description) {
                  setErrors({ ...errors, description: '' });
                }
              }}
              placeholder="Describe in detail what this mission should accomplish..."
              rows={4}
              className={clsx(
                'w-full px-4 py-3 bg-zinc-900 border rounded-lg',
                'text-white placeholder-zinc-500 resize-none',
                'focus:outline-none focus:border-symtex-primary',
                errors.description ? 'border-red-500' : 'border-zinc-700'
              )}
              maxLength={2000}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-400">{errors.description}</p>
            )}
            <p className="mt-1 text-xs text-zinc-500">
              {formData.description.length}/2000 characters
            </p>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Initial Status
            </label>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={(): void => setFormData({ ...formData, status: option.value })}
                  className={clsx(
                    'flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-sm',
                    formData.status === option.value
                      ? 'bg-zinc-800 border-symtex-primary text-white'
                      : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-600'
                  )}
                >
                  <span className={clsx('w-2 h-2 rounded-full', option.color)} />
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cognate Assignment */}
          <div className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <Bot className="w-5 h-5 text-zinc-400" />
              <div>
                <p className="text-sm font-medium text-zinc-300">Assign a Cognate</p>
                <p className="text-xs text-zinc-500">Optionally assign an AI agent to this mission</p>
              </div>
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={(): void => setIsCognateDropdownOpen(!isCognateDropdownOpen)}
                className={clsx(
                  'w-full flex items-center justify-between gap-2',
                  'px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg',
                  'text-left transition-colors',
                  'hover:border-zinc-600 focus:border-symtex-primary focus:outline-none'
                )}
              >
                {selectedCognate ? (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white">{selectedCognate.name}</span>
                  </div>
                ) : (
                  <span className="text-zinc-400">No cognate assigned</span>
                )}
                <ChevronDown
                  className={clsx(
                    'w-5 h-5 text-zinc-400 transition-transform',
                    isCognateDropdownOpen && 'rotate-180'
                  )}
                />
              </button>

              {isCognateDropdownOpen && (
                <div className="absolute z-50 w-full mt-2 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                  {/* Unassign Option */}
                  <button
                    type="button"
                    onClick={(): void => {
                      setFormData({ ...formData, assignedCognateId: '' });
                      setIsCognateDropdownOpen(false);
                    }}
                    className={clsx(
                      'w-full flex items-center justify-between gap-3 px-4 py-3',
                      'hover:bg-zinc-800 transition-colors border-b border-zinc-700',
                      !formData.assignedCognateId && 'bg-zinc-800'
                    )}
                  >
                    <span className="text-zinc-400">No cognate assigned</span>
                    {!formData.assignedCognateId && (
                      <Check className="w-4 h-4 text-symtex-primary" />
                    )}
                  </button>
                  {cognates.length > 0 ? (
                    cognates.map((cognate) => (
                      <button
                        key={cognate.id}
                        type="button"
                        onClick={(): void => {
                          setFormData({ ...formData, assignedCognateId: cognate.id });
                          setIsCognateDropdownOpen(false);
                        }}
                        className={clsx(
                          'w-full flex items-center justify-between gap-3 px-4 py-3',
                          'hover:bg-zinc-800 transition-colors',
                          formData.assignedCognateId === cognate.id && 'bg-zinc-800'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                          </div>
                          <div className="text-left">
                            <span className="text-white block">{cognate.name}</span>
                            <span className="text-xs text-zinc-500">{cognate.role}</span>
                          </div>
                        </div>
                        {formData.assignedCognateId === cognate.id && (
                          <Check className="w-4 h-4 text-symtex-primary" />
                        )}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-4 text-center">
                      <p className="text-zinc-400 text-sm">No cognates available</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="sticky bottom-0 bg-zinc-900 px-6 py-4 border-t border-zinc-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting || projects.length === 0}
            className={clsx(
              'flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium',
              'bg-gradient-to-r from-orange-500 to-rose-500 text-white',
              'hover:opacity-90 transition-opacity',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Creating...
              </>
            ) : (
              'Create Mission'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateMissionModal;
