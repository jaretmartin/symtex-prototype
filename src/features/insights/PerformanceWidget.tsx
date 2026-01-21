import { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { getRating, getMemoryUsage, formatBytes } from '@/lib/performance';

interface WebVital {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

export function PerformanceWidget() {
  const [vitals, setVitals] = useState<WebVital[]>([]);
  const [memory, setMemory] = useState<number | null>(null);

  useEffect(() => {
    // Collect performance metrics
    const collectMetrics = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

      if (navigation) {
        const metrics: WebVital[] = [
          {
            name: 'TTFB',
            value: navigation.responseStart - navigation.requestStart,
            rating: getRating('TTFB', navigation.responseStart - navigation.requestStart),
          },
          {
            name: 'FCP',
            value: navigation.domContentLoadedEventEnd - navigation.fetchStart,
            rating: getRating('FCP', navigation.domContentLoadedEventEnd - navigation.fetchStart),
          },
        ];
        setVitals(metrics);
      }

      setMemory(getMemoryUsage());
    };

    collectMetrics();
    const interval = setInterval(collectMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  const ratingColors = {
    good: 'text-green-500',
    'needs-improvement': 'text-yellow-500',
    poor: 'text-red-500',
  };

  return (
    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-indigo-400" />
        <h3 className="font-semibold text-white">Performance</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {vitals.map((vital) => (
          <div key={vital.name} className="bg-slate-900/50 rounded p-3">
            <div className="text-xs text-slate-400 mb-1">{vital.name}</div>
            <div className={`text-lg font-mono ${ratingColors[vital.rating]}`}>
              {vital.value.toFixed(0)}ms
            </div>
          </div>
        ))}

        {memory && (
          <div className="bg-slate-900/50 rounded p-3">
            <div className="text-xs text-slate-400 mb-1">Memory</div>
            <div className="text-lg font-mono text-blue-400">
              {formatBytes(memory)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
