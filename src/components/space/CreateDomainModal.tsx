/**
 * CreateDomainModal Component
 *
 * Modal for creating new domain spaces within the hierarchy.
 * Features: Name, icon picker, color picker, description, template presets,
 * optional settings overrides, connect to useSpaceStore.createDomain.
 */

import { useState } from 'react';
import { X, Briefcase, Heart, DollarSign, GraduationCap, User, Sparkles } from 'lucide-react';
import clsx from 'clsx';
import { useSpaceStore, useToast } from '@/store';
import type { DomainSpace, SpaceSettings } from '@/types';
import { IconPicker } from './IconPicker';
import { ColorPicker } from './ColorPicker';

interface CreateDomainModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (domain: DomainSpace) => void;
}

// Template presets for quick domain creation
const DOMAIN_TEMPLATES = [
  {
    id: 'work',
    name: 'Work',
    icon: 'Briefcase',
    color: '#3B82F6',
    description: 'Professional projects and career tasks',
    IconComponent: Briefcase,
  },
  {
    id: 'health',
    name: 'Health',
    icon: 'Heart',
    color: '#22C55E',
    description: 'Fitness, wellness, and health goals',
    IconComponent: Heart,
  },
  {
    id: 'finance',
    name: 'Finance',
    icon: 'DollarSign',
    color: '#F59E0B',
    description: 'Budgeting, investments, and financial planning',
    IconComponent: DollarSign,
  },
  {
    id: 'learning',
    name: 'Learning',
    icon: 'GraduationCap',
    color: '#8B5CF6',
    description: 'Education, courses, and skill development',
    IconComponent: GraduationCap,
  },
  {
    id: 'personal',
    name: 'Personal',
    icon: 'User',
    color: '#EC4899',
    description: 'Personal projects and life goals',
    IconComponent: User,
  },
] as const;

interface FormData {
  name: string;
  icon: string;
  color: string;
  description: string;
  useSettingsOverride: boolean;
  settingsOverrides?: Partial<SpaceSettings>;
}

const initialFormData: FormData = {
  name: '',
  icon: 'Briefcase',
  color: '#6366F1',
  description: '',
  useSettingsOverride: false,
};

export function CreateDomainModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateDomainModalProps): JSX.Element | null {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createDomain = useSpaceStore((state) => state.createDomain);
  const toast = useToast();

  // Reset form when modal closes
  const handleClose = (): void => {
    setFormData(initialFormData);
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  // Apply template preset
  const applyTemplate = (templateId: string): void => {
    const template = DOMAIN_TEMPLATES.find((t) => t.id === templateId);
    if (template) {
      setFormData({
        ...formData,
        name: template.name,
        icon: template.icon,
        color: template.color,
        description: template.description,
      });
      setErrors({});
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Domain name is required';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Domain name must be 50 characters or less';
    }

    if (!formData.icon) {
      newErrors.icon = 'Please select an icon';
    }

    if (!formData.color) {
      newErrors.color = 'Please select a color';
    }

    if (formData.description.length > 500) {
      newErrors.description = 'Description must be 500 characters or less';
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
      // Create the domain object
      const newDomain: DomainSpace = {
        id: `domain-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        parentId: 'personal',
        name: formData.name.trim(),
        icon: formData.icon,
        color: formData.color,
        settingsOverrides: formData.useSettingsOverride ? formData.settingsOverrides : undefined,
        assignedCognates: [],
      };

      // Save to store
      createDomain(newDomain);

      // Show success toast
      toast.success('Domain created', `${formData.name} has been created successfully.`);

      // Call success callback
      if (onSuccess) {
        onSuccess(newDomain);
      }

      // Close modal
      handleClose();
    } catch (error) {
      toast.error(
        'Error creating domain',
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
        aria-labelledby="create-domain-title"
      >
        {/* Header */}
        <div className="sticky top-0 bg-card px-6 py-4 border-b border-border flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-symtex-primary to-symtex-accent flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <h2 id="create-domain-title" className="text-lg font-semibold text-foreground">
                Create New Domain
              </h2>
              <p className="text-sm text-muted-foreground">
                Organize your projects with a domain
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Template Presets */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-3">
              Quick Start Templates
            </label>
            <div className="flex flex-wrap gap-2">
              {DOMAIN_TEMPLATES.map((template) => {
                const isSelected = formData.name === template.name && formData.icon === template.icon;
                return (
                  <button
                    key={template.id}
                    type="button"
                    onClick={(): void => applyTemplate(template.id)}
                    className={clsx(
                      'flex items-center gap-2 px-4 py-2 rounded-lg transition-all',
                      'border',
                      isSelected
                        ? 'bg-symtex-primary/20 border-symtex-primary text-foreground'
                        : 'bg-muted border-border text-muted-foreground hover:border-border'
                    )}
                  >
                    <template.IconComponent
                      className="w-4 h-4"
                      style={{ color: isSelected ? template.color : undefined }}
                    />
                    <span className="text-sm">{template.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Name Field */}
          <div>
            <label htmlFor="domain-name" className="block text-sm font-medium text-muted-foreground mb-2">
              Domain Name <span className="text-red-400">*</span>
            </label>
            <input
              id="domain-name"
              type="text"
              value={formData.name}
              onChange={(e): void => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) {
                  setErrors({ ...errors, name: '' });
                }
              }}
              placeholder="Enter domain name"
              className={clsx(
                'w-full px-4 py-3 bg-surface-base border rounded-lg',
                'text-foreground placeholder-muted-foreground',
                'focus:outline-none focus:border-symtex-primary',
                errors.name ? 'border-red-500' : 'border-border'
              )}
              maxLength={50}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-400">{errors.name}</p>
            )}
            <p className="mt-1 text-xs text-muted-foreground">
              {formData.name.length}/50 characters
            </p>
          </div>

          {/* Icon and Color */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Icon <span className="text-red-400">*</span>
              </label>
              <IconPicker
                value={formData.icon}
                onChange={(icon): void => {
                  setFormData({ ...formData, icon });
                  if (errors.icon) {
                    setErrors({ ...errors, icon: '' });
                  }
                }}
                placeholder="Select an icon"
              />
              {errors.icon && (
                <p className="mt-1 text-sm text-red-400">{errors.icon}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Color <span className="text-red-400">*</span>
              </label>
              <ColorPicker
                value={formData.color}
                onChange={(color): void => {
                  setFormData({ ...formData, color });
                  if (errors.color) {
                    setErrors({ ...errors, color: '' });
                  }
                }}
                placeholder="Select a color"
              />
              {errors.color && (
                <p className="mt-1 text-sm text-red-400">{errors.color}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="domain-description" className="block text-sm font-medium text-muted-foreground mb-2">
              Description
            </label>
            <textarea
              id="domain-description"
              value={formData.description}
              onChange={(e): void => {
                setFormData({ ...formData, description: e.target.value });
                if (errors.description) {
                  setErrors({ ...errors, description: '' });
                }
              }}
              placeholder="Describe what this domain is for..."
              rows={3}
              className={clsx(
                'w-full px-4 py-3 bg-surface-base border rounded-lg',
                'text-foreground placeholder-muted-foreground resize-none',
                'focus:outline-none focus:border-symtex-primary',
                errors.description ? 'border-red-500' : 'border-border'
              )}
              maxLength={500}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-400">{errors.description}</p>
            )}
            <p className="mt-1 text-xs text-muted-foreground">
              {formData.description.length}/500 characters
            </p>
          </div>

          {/* Settings Override Toggle */}
          <div className="p-4 bg-muted/50 border border-border rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Custom Settings</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Override inherited settings from your personal space
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.useSettingsOverride}
                  onChange={(e): void =>
                    setFormData({ ...formData, useSettingsOverride: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-symtex-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-foreground after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-foreground after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-symtex-primary" />
              </label>
            </div>
            {formData.useSettingsOverride && (
              <p className="mt-3 text-xs text-muted-foreground flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-amber-400" />
                Configure settings after creation in Domain Settings
              </p>
            )}
          </div>

          {/* Preview */}
          <div className="p-4 bg-muted/30 border border-border/50 rounded-lg">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Preview</p>
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${formData.color}20` }}
              >
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: formData.color }}
                >
                  {/* Icon preview would go here - simplified for now */}
                  <span className="text-xs text-foreground font-bold">
                    {formData.name.charAt(0).toUpperCase() || '?'}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-foreground font-medium">
                  {formData.name || 'Domain Name'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formData.description || 'No description'}
                </p>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="sticky bottom-0 bg-card px-6 py-4 border-t border-border flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={clsx(
              'flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium',
              'bg-gradient-to-r from-symtex-primary to-symtex-accent text-foreground',
              'hover:opacity-90 transition-opacity',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-foreground border-t-transparent rounded-full" />
                Creating...
              </>
            ) : (
              'Create Domain'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateDomainModal;
