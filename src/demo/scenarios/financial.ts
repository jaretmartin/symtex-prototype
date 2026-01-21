import type { DemoScenario } from '../types';

export const financialScenario: DemoScenario = {
  id: 'financial',
  name: 'WealthGuard Financial',
  industry: 'Financial Services',
  description: 'AI-powered wealth management and compliance',

  company: {
    name: 'WealthGuard Financial',
    logo: '💰',
    tagline: 'Intelligent Wealth Protection',
  },

  cognates: [
    {
      id: 'compliance-cognate',
      name: 'Compliance Monitor',
      role: 'Regulatory Compliance Specialist',
      description: 'Monitors transactions for regulatory compliance',
      personality: { precision: 98, vigilance: 95, thoroughness: 92 },
      skills: ['aml-screening', 'kyc-verification', 'regulatory-reporting'],
    },
    {
      id: 'advisor-cognate',
      name: 'Portfolio Advisor',
      role: 'Investment Advisory Specialist',
      description: 'Provides personalized investment recommendations',
      personality: { analytical: 95, patience: 88, clarity: 90 },
      skills: ['risk-assessment', 'portfolio-analysis', 'market-research'],
    },
    {
      id: 'fraud-cognate',
      name: 'Fraud Detector',
      role: 'Fraud Prevention Specialist',
      description: 'Identifies and prevents fraudulent activities',
      personality: { vigilance: 98, speed: 95, precision: 96 },
      skills: ['pattern-recognition', 'anomaly-detection', 'alert-triage'],
    },
  ],

  automations: [
    {
      id: 'kyc-onboarding',
      name: 'KYC Onboarding',
      description: 'Automated customer verification and onboarding',
      steps: ['Collect documents', 'Verify identity', 'Screen watchlists', 'Approve account'],
    },
    {
      id: 'transaction-monitoring',
      name: 'Transaction Monitoring',
      description: 'Real-time transaction analysis and alerts',
      steps: ['Analyze transaction', 'Check thresholds', 'Flag anomalies', 'Generate SAR'],
    },
  ],

  sampleConversations: [
    {
      userMessage: "Can you analyze my portfolio risk exposure?",
      cognateResponse: "I've analyzed your current portfolio. Your risk exposure is moderate with 60% equities, 30% bonds, and 10% alternatives. Given current market volatility, I recommend increasing your bond allocation by 5% to reduce downside risk. Would you like me to show you specific rebalancing options?",
      cognateId: 'advisor-cognate',
    },
  ],

  metrics: {
    timeSavedHours: 3200,
    costSavedDollars: 450000,
    satisfactionScore: 91,
    automationRate: 85,
    fraudPrevented: 1200000,
    complianceRate: 99.7,
  },
};
