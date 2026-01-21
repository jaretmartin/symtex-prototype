/**
 * Ledger Page
 *
 * Displays the full audit ledger with filtering, search, and timeline views.
 * Provides complete transparency into all system actions and decisions.
 */

import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { LedgerViewer } from '@/features/ledger/LedgerViewer';
import { useLedgerStore } from '@/features/ledger/ledger-store';

export default function LedgerPage(): JSX.Element {
  const [searchParams] = useSearchParams();
  const { setFilters } = useLedgerStore();

  // Apply URL filters on mount
  useEffect(() => {
    const filterParam = searchParams.get('filter');
    const cognateParam = searchParams.get('cognate');
    const runParam = searchParams.get('run');

    if (filterParam || cognateParam || runParam) {
      setFilters({
        search: filterParam || '',
        // Additional filter params could be applied here
      });
    }
  }, [searchParams, setFilters]);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <LedgerViewer />
      </div>
    </div>
  );
}
