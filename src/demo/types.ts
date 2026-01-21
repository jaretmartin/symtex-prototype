/**
 * Demo Scenario Types
 *
 * Type definitions for industry-specific demo scenarios.
 */

export interface CognatePersonality {
  precision?: number;
  speed?: number;
  empathy?: number;
  patience?: number;
  vigilance?: number;
  thoroughness?: number;
  analytical?: number;
  clarity?: number;
}

export interface DemoCognate {
  id: string;
  name: string;
  role: string;
  description: string;
  personality: CognatePersonality;
  skills: string[];
}

export interface DemoAutomation {
  id: string;
  name: string;
  description: string;
  steps: string[];
  avgTimeSeconds?: number;
  costSavingsPerRun?: number;
}

export interface DemoMetrics {
  timeSavedHours: number;
  costAvoidedUSD?: number;
  costSavedDollars?: number;
  automationsRun?: number;
  accuracyRate?: number;
  satisfactionScore?: number;
  automationRate?: number;
  fraudPrevented?: number;
  complianceRate?: number;
}

export interface ConversationMessage {
  role: 'user' | 'cognate';
  content: string;
}

export interface SampleConversation {
  userMessage: string;
  cognateResponse: string;
  cognateId: string;
}

export interface DemoCompany {
  name: string;
  logo: string;
  tagline: string;
}

export interface DemoScenario {
  id: string;
  name: string;
  industry: string;
  description: string;
  company?: DemoCompany;
  cognates: DemoCognate[];
  automations: DemoAutomation[];
  metrics: DemoMetrics;
  sampleConversation?: ConversationMessage[];
  sampleConversations?: SampleConversation[];
}
