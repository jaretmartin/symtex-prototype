/**
 * DNA Strength and AI capabilities types
 */

export interface DNAStrand {
  id: string;
  name: string;
  score: number;
  maxScore: number;
  color: string;
  icon: string;
  description: string;
  capabilities: DNACapability[];
  recommendations: string[];
}

export interface DNACapability {
  name: string;
  enabled: boolean;
  score: number;
  description: string;
}

export interface DNAOverview {
  overallScore: number;
  strands: DNAStrand[];
  lastUpdated: string;
  improvementAreas: string[];
}
