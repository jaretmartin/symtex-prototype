import type { DemoScenario } from '../types';

export const healthcareScenario: DemoScenario = {
  id: 'healthcare',
  name: 'MedAssist Healthcare',
  industry: 'Healthcare',
  description: 'AI-powered patient intake and triage system',

  // Demo company
  company: {
    name: 'MedAssist Healthcare',
    logo: '🏥',
    tagline: 'Intelligent Patient Care Coordination',
  },

  // Sample Cognates for healthcare
  cognates: [
    {
      id: 'triage-cognate',
      name: 'Triage Assistant',
      role: 'Patient Triage Specialist',
      description: 'Evaluates patient symptoms and prioritizes care',
      personality: { empathy: 95, precision: 90, patience: 85 },
      skills: ['symptom-assessment', 'urgency-classification', 'care-routing'],
    },
    {
      id: 'intake-cognate',
      name: 'Intake Coordinator',
      role: 'Patient Intake Specialist',
      description: 'Handles patient registration and history collection',
      personality: { empathy: 90, precision: 95, patience: 90 },
      skills: ['data-collection', 'insurance-verification', 'appointment-scheduling'],
    },
    {
      id: 'followup-cognate',
      name: 'Care Follow-up',
      role: 'Patient Follow-up Coordinator',
      description: 'Manages post-visit follow-ups and medication reminders',
      personality: { empathy: 95, precision: 85, patience: 95 },
      skills: ['reminder-management', 'satisfaction-surveys', 'care-plan-tracking'],
    },
  ],

  // Sample Automations
  automations: [
    {
      id: 'patient-intake-flow',
      name: 'Patient Intake Flow',
      description: 'Automated patient registration and triage',
      steps: ['Collect symptoms', 'Verify insurance', 'Assess urgency', 'Route to care'],
    },
    {
      id: 'appointment-reminder',
      name: 'Appointment Reminder',
      description: 'Multi-channel appointment reminders',
      steps: ['Check schedule', 'Send SMS', 'Send email', 'Confirm attendance'],
    },
  ],

  // Sample conversations
  sampleConversations: [
    {
      userMessage: "I've been having chest pain for the past hour",
      cognateResponse: "I understand you're experiencing chest pain - this requires immediate attention. Can you tell me: Is the pain sharp or dull? Does it radiate to your arm or jaw? Are you having difficulty breathing? Based on your symptoms, I may need to recommend emergency care.",
      cognateId: 'triage-cognate',
    },
  ],

  // ROI metrics for healthcare
  metrics: {
    timeSavedHours: 2400,
    costSavedDollars: 180000,
    satisfactionScore: 94,
    automationRate: 78,
  },
};
