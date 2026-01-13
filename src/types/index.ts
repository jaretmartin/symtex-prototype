/**
 * Central type exports
 *
 * Import types from here:
 * import type { Mission, Workflow, Template } from '@/types';
 */

// Entity types
export * from './entities/mission';
export * from './entities/workflow';
export * from './entities/automation';
export * from './entities/template';
export * from './entities/user';
export * from './entities/budget';
export * from './entities/dna';

// API types
export * from './api/responses';
export * from './api/requests';

// UI Component prop types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export type Size = 'sm' | 'md' | 'lg';

export type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline';

export interface IconProps {
  className?: string;
  size?: number;
}
