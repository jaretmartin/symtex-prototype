/**
 * SOP Edit Route
 *
 * Provides the full SOP editing experience with the SOPEditor component.
 * This route handles editing existing SOPs for a Cognate.
 */

import { lazy, Suspense } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useCognateStore } from '@/store';

// Lazy load the SOPEditor for code splitting
const SOPEditor = lazy(() =>
  import('@/components/sop/SOPEditor').then((m) => ({ default: m.SOPEditor }))
);

function LoadingFallback(): JSX.Element {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-64px)]">
      <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
    </div>
  );
}

export function SOPEditRoute(): JSX.Element {
  const { id, sopId } = useParams<{ id: string; sopId: string }>();
  const navigate = useNavigate();
  const { cognates, sops, updateSOP } = useCognateStore();

  const cognate = cognates.find((c) => c.id === id);
  const sop = sops.find((s) => s.id === sopId);

  if (!cognate) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-medium text-foreground mb-2">Cognate Not Found</h2>
        <p className="text-muted-foreground mb-4">The requested Cognate does not exist.</p>
        <Link
          to="/studio/cognates"
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Cognates
        </Link>
      </div>
    );
  }

  if (!sop) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-medium text-foreground mb-2">SOP Not Found</h2>
        <p className="text-muted-foreground mb-4">The requested SOP does not exist.</p>
        <Link
          to={`/studio/cognates/${id}/sops`}
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to SOPs
        </Link>
      </div>
    );
  }

  const handleSave = (updatedSOP: typeof sop): void => {
    updateSOP(sopId!, {
      ...updatedSOP,
      updatedAt: new Date().toISOString(),
    });
    navigate(`/studio/cognates/${id}/sops`);
  };

  const handleCancel = (): void => {
    navigate(`/studio/cognates/${id}/sops`);
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      {/* Breadcrumb */}
      <div className="px-6 py-3 border-b border-border bg-surface-base/50">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/studio/cognates" className="hover:text-foreground transition-colors">
            Cognates
          </Link>
          <span>/</span>
          <Link to={`/studio/cognates/${id}/sops`} className="hover:text-foreground transition-colors">
            {cognate.name}
          </Link>
          <span>/</span>
          <span className="text-foreground">{sop.name || 'Edit SOP'}</span>
        </div>
      </div>

      {/* Editor */}
      <Suspense fallback={<LoadingFallback />}>
        <SOPEditor
          sop={sop}
          onChange={() => {}}
          onSave={handleSave}
          onCancel={handleCancel}
          isNew={false}
          className="flex-1"
        />
      </Suspense>
    </div>
  );
}

export default SOPEditRoute;
