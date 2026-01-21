import type { SimulationStep } from '@/features/simulation';

export interface CustomerServiceSimulation {
  title: string;
  steps: SimulationStep[];
}

export const customerServiceSimulation: CustomerServiceSimulation = {
  title: 'Customer Service Optimization',
  steps: [
    {
      id: '1',
      label: 'Response Time',
      before: { value: '4.5 hours avg', status: 'warning' as const },
      after: { value: '12 minutes avg', status: 'success' as const },
      impact: '95% faster response time',
    },
    {
      id: '2',
      label: 'First Contact Resolution',
      before: { value: '34%', status: 'error' as const },
      after: { value: '78%', status: 'success' as const },
      impact: '130% improvement in FCR',
    },
    {
      id: '3',
      label: 'Customer Satisfaction',
      before: { value: '3.2 / 5 stars', status: 'warning' as const },
      after: { value: '4.7 / 5 stars', status: 'success' as const },
      impact: '47% higher satisfaction',
    },
  ],
};
