/**
 * CreateProjectModal Component
 *
 * Modal for creating new projects within a domain space.
 * Features: Name, description, objectives list, status, timeline optional,
 * domain selector, connects to useSpaceStore.createProject.
 */

import { useState, useEffect } from 'react';
import { X, FolderPlus, Plus, Trash2, Calendar, ChevronDown, Check } from 'lucide-react';
import clsx from 'clsx';
import { useSpaceStore, useToast } from '@/store';
import type { Project, ProjectStatus } from '@/types';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (project: Project) => void;
  /** Pre-selected domain ID */
  defaultDomainId?: string;
}

interface FormData {
  name: string;
  description: string;
  domainId: string;
  status: ProjectStatus;
  objectives: string[];
  hasTimeline: boolean;
  startDate: string;
  endDate: string;
}

const STATUS_OPTIONS: { value: ProjectStatus; label: string; color: string }[] = [
  { value: 'active', label: 'Active', color: 'bg-green-500' },
  { value: 'paused', label: 'Paused', color: 'bg-amber-500' },
  { value: 'completed', label: 'Completed', color: 'bg-blue-500' },
];

const getInitialFormData = (defaultDomainId?: string): FormData => ({
  name: '',
  description: '',
  domainId: defaultDomainId || '',
  status: 'active',
  objectives: [''],
  hasTimeline: false,
  startDate: new Date().toISOString().split('T')[0],
  endDate: '',
});

export function CreateProjectModal({
  isOpen,
  onClose,
  onSuccess,
  defaultDomainId,
}: CreateProjectModalProps): JSX.Element | null {
  const [formData, setFormData] = useState<FormData>(getInitialFormData(defaultDomainId));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDomainDropdownOpen, setIsDomainDropdownOpen] = useState(false);

  const createProject = useSpaceStore((state) => state.createProject);
  const getDomains = useSpaceStore((state) => state.getDomains);
  const domains = getDomains();
  const toast = useToast();

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormData(defaultDomainId));
      setErrors({});
    }
  }, [isOpen, defaultDomainId]);

  const handleClose = (): void => {
    setFormData(getInitialFormData(defaultDomainId));
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  // Get the selected domain
  const selectedDomain = domains.find((d) => d.id === formData.domainId);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Project name must be 100 characters or less';
    }

    if (!formData.domainId) {
      newErrors.domainId = 'Please select a domain';
    }

    if (formData.description.length > 1000) {
      newErrors.description = 'Description must be 1000 characters or less';
    }

    // Filter out empty objectives
    const validObjectives = formData.objectives.filter((o) => o.trim());
    if (validObjectives.length === 0) {
      newErrors.objectives = 'Add at least one objective';
    }

    if (formData.hasTimeline && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle objective changes
  const handleObjectiveChange = (index: number, value: string): void => {
    const newObjectives = [...formData.objectives];
    newObjectives[index] = value;
    setFormData({ ...formData, objectives: newObjectives });
    if (errors.objectives) {
      setErrors({ ...errors, objectives: '' });
    }
  };

  const addObjective = (): void => {
    setFormData({ ...formData, objectives: [...formData.objectives, ''] });
  };

  const removeObjective = (index: number): void => {
    if (formData.objectives.length > 1) {
      const newObjectives = formData.objectives.filter((_, i) => i !== index);
      setFormData({ ...formData, objectives: newObjectives });
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Filter out empty objectives
      const validObjectives = formData.objectives.filter((o) => o.trim());

      // Create the project object
      const newProject: Project = {
        id: `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        domainId: formData.domainId,
        name: formData.name.trim(),
        description: formData.description.trim(),
        status: formData.status,
        progress: formData.status === 'completed' ? 100 : 0,
        objectives: validObjectives,
        timeline: formData.hasTimeline
          ? {
              startDate: formData.startDate,
              endDate: formData.endDate || undefined,
              milestones: [],
            }
          : undefined,
      };

      // Save to store
      createProject(newProject);

      // Show success toast
      toast.success('Project created', `${formData.name} has been created successfully.`);

      // Call success callback
      if (onSuccess) {
        onSuccess(newProject);
      }

      // Close modal
      handleClose();
    } catch (error) {
      toast.error(
        'Error creating project',
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
          'bg-card border border-border rounded-xl shadow-2xl',
          'm-4'
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-project-title"
      >
        {/* Header */}
        <div className="sticky top-0 bg-card px-6 py-4 border-b border-border flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <FolderPlus className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <h2 id="create-project-title" className="text-lg font-semibold text-foreground">
                Create New Project
              </h2>
              <p className="text-sm text-muted-foreground">
                Define a project with objectives and timeline
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-card rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Domain Selector */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Domain <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={(): void => setIsDomainDropdownOpen(!isDomainDropdownOpen)}
                className={clsx(
                  'w-full flex items-center justify-between gap-2',
                  'px-4 py-3 bg-surface-base border rounded-lg',
                  'text-left transition-colors',
                  'hover:border-border focus:border-symtex-primary focus:outline-none',
                  errors.domainId ? 'border-red-500' : 'border-border'
                )}
              >
                {selectedDomain ? (
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${selectedDomain.color}30` }}
                    >
                      <span
                        className="text-sm font-bold"
                        style={{ color: selectedDomain.color }}
                      >
                        {selectedDomain.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-foreground">{selectedDomain.name}</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">Select a domain...</span>
                )}
                <ChevronDown
                  className={clsx(
                    'w-5 h-5 text-muted-foreground transition-transform',
                    isDomainDropdownOpen && 'rotate-180'
                  )}
                />
              </button>

              {isDomainDropdownOpen && (
                <div className="absolute z-50 w-full mt-2 bg-surface-base border border-border rounded-lg shadow-xl max-h-60 overflow-y-auto">
                  {domains.length > 0 ? (
                    domains.map((domain) => (
                      <button
                        key={domain.id}
                        type="button"
                        onClick={(): void => {
                          setFormData({ ...formData, domainId: domain.id });
                          setIsDomainDropdownOpen(false);
                          if (errors.domainId) {
                            setErrors({ ...errors, domainId: '' });
                          }
                        }}
                        className={clsx(
                          'w-full flex items-center justify-between gap-3 px-4 py-3',
                          'hover:bg-card transition-colors',
                          formData.domainId === domain.id && 'bg-card'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${domain.color}30` }}
                          >
                            <span
                              className="text-sm font-bold"
                              style={{ color: domain.color }}
                            >
                              {domain.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-foreground">{domain.name}</span>
                        </div>
                        {formData.domainId === domain.id && (
                          <Check className="w-4 h-4 text-symtex-primary" />
                        )}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-6 text-center">
                      <p className="text-muted-foreground text-sm">No domains available</p>
                      <p className="text-muted-foreground text-xs mt-1">Create a domain first</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            {errors.domainId && (
              <p className="mt-1 text-sm text-red-400">{errors.domainId}</p>
            )}
          </div>

          {/* Name Field */}
          <div>
            <label htmlFor="project-name" className="block text-sm font-medium text-muted-foreground mb-2">
              Project Name <span className="text-red-400">*</span>
            </label>
            <input
              id="project-name"
              type="text"
              value={formData.name}
              onChange={(e): void => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) {
                  setErrors({ ...errors, name: '' });
                }
              }}
              placeholder="Enter project name"
              className={clsx(
                'w-full px-4 py-3 bg-surface-base border rounded-lg',
                'text-foreground placeholder-muted-foreground',
                'focus:outline-none focus:border-symtex-primary',
                errors.name ? 'border-red-500' : 'border-border'
              )}
              maxLength={100}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-400">{errors.name}</p>
            )}
            <p className="mt-1 text-xs text-muted-foreground">
              {formData.name.length}/100 characters
            </p>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="project-description" className="block text-sm font-medium text-muted-foreground mb-2">
              Description
            </label>
            <textarea
              id="project-description"
              value={formData.description}
              onChange={(e): void => {
                setFormData({ ...formData, description: e.target.value });
                if (errors.description) {
                  setErrors({ ...errors, description: '' });
                }
              }}
              placeholder="Describe what this project aims to achieve..."
              rows={3}
              className={clsx(
                'w-full px-4 py-3 bg-surface-base border rounded-lg',
                'text-foreground placeholder-muted-foreground resize-none',
                'focus:outline-none focus:border-symtex-primary',
                errors.description ? 'border-red-500' : 'border-border'
              )}
              maxLength={1000}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-400">{errors.description}</p>
            )}
            <p className="mt-1 text-xs text-muted-foreground">
              {formData.description.length}/1000 characters
            </p>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Initial Status
            </label>
            <div className="flex gap-3">
              {STATUS_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={(): void => setFormData({ ...formData, status: option.value })}
                  className={clsx(
                    'flex items-center gap-2 px-4 py-2 rounded-lg border transition-all',
                    formData.status === option.value
                      ? 'bg-card border-symtex-primary text-foreground'
                      : 'bg-surface-base border-border text-muted-foreground hover:border-border'
                  )}
                >
                  <span className={clsx('w-2 h-2 rounded-full', option.color)} />
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Objectives */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-muted-foreground">
                Objectives <span className="text-red-400">*</span>
              </label>
              <button
                type="button"
                onClick={addObjective}
                className="flex items-center gap-1 text-sm text-symtex-primary hover:text-symtex-accent transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Objective
              </button>
            </div>
            <div className="space-y-2">
              {formData.objectives.map((objective, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={objective}
                    onChange={(e): void => handleObjectiveChange(index, e.target.value)}
                    placeholder={`Objective ${index + 1}`}
                    className={clsx(
                      'flex-1 px-4 py-2 bg-surface-base border border-border rounded-lg',
                      'text-foreground placeholder-muted-foreground',
                      'focus:outline-none focus:border-symtex-primary'
                    )}
                  />
                  {formData.objectives.length > 1 && (
                    <button
                      type="button"
                      onClick={(): void => removeObjective(index)}
                      className="p-2 text-muted-foreground hover:text-red-400 hover:bg-card rounded-lg transition-colors"
                      aria-label="Remove objective"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {errors.objectives && (
              <p className="mt-1 text-sm text-red-400">{errors.objectives}</p>
            )}
          </div>

          {/* Timeline Toggle */}
          <div className="p-4 bg-card/50 border border-border rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Project Timeline</p>
                  <p className="text-xs text-muted-foreground">Set start and end dates</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasTimeline}
                  onChange={(e): void => setFormData({ ...formData, hasTimeline: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-symtex-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-symtex-primary" />
              </label>
            </div>

            {formData.hasTimeline && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="start-date" className="block text-xs text-muted-foreground mb-1">
                    Start Date
                  </label>
                  <input
                    id="start-date"
                    type="date"
                    value={formData.startDate}
                    onChange={(e): void => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-base border border-border rounded-lg text-foreground text-sm focus:outline-none focus:border-symtex-primary"
                  />
                </div>
                <div>
                  <label htmlFor="end-date" className="block text-xs text-muted-foreground mb-1">
                    End Date (optional)
                  </label>
                  <input
                    id="end-date"
                    type="date"
                    value={formData.endDate}
                    onChange={(e): void => {
                      setFormData({ ...formData, endDate: e.target.value });
                      if (errors.endDate) {
                        setErrors({ ...errors, endDate: '' });
                      }
                    }}
                    className={clsx(
                      'w-full px-3 py-2 bg-surface-base border rounded-lg text-foreground text-sm',
                      'focus:outline-none focus:border-symtex-primary',
                      errors.endDate ? 'border-red-500' : 'border-border'
                    )}
                  />
                  {errors.endDate && (
                    <p className="mt-1 text-xs text-red-400">{errors.endDate}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="sticky bottom-0 bg-surface-base px-6 py-4 border-t border-border flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-card rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting || domains.length === 0}
            className={clsx(
              'flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium',
              'bg-gradient-to-r from-blue-500 to-cyan-500 text-foreground',
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
              'Create Project'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateProjectModal;
