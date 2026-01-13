/**
 * User and preferences types
 */

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'member' | 'viewer';
  createdAt: string;
  lastLoginAt: string;
}

export interface UserPreferences {
  theme: 'dark' | 'light' | 'system';
  sidebarCollapsed: boolean;
  defaultView: 'grid' | 'list';
  notifications: NotificationPreferences;
  onboardingCompleted: boolean;
  tutorialsDismissed: string[];
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  workflowFailures: boolean;
  weeklyDigest: boolean;
}

export interface OnboardingProgress {
  currentStep: number;
  completedSteps: string[];
  skipped: boolean;
  startedAt: string;
  completedAt?: string;
}
