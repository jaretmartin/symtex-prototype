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
export * from './entities/cognate';
export * from './entities/space';
export * from './entities/context';
export * from './entities/narrative';
export * from './entities/chat';
export * from './entities/reasoning';
export * from './entities/agent';

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
