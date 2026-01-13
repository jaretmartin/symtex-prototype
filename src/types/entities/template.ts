/**
 * Template entity types
 */

export type TemplateCategory =
  | 'sales'
  | 'marketing'
  | 'support'
  | 'operations'
  | 'hr'
  | 'finance'
  | 'custom';

export type TemplateComplexity = 'beginner' | 'intermediate' | 'advanced';

export interface Template {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  complexity: TemplateComplexity;
  icon: string;
  color: string;
  tags: string[];
  usageCount: number;
  rating: number;
  author: string;
  createdAt: string;
  updatedAt: string;
  previewImage?: string;
  estimatedSetupTime: string;
  requiredIntegrations: string[];
}

export interface TemplateWorkflow {
  templateId: string;
  nodes: unknown[];
  edges: unknown[];
  variables: TemplateVariable[];
}

export interface TemplateVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'email';
  label: string;
  description?: string;
  required: boolean;
  defaultValue?: unknown;
  options?: string[];
}
