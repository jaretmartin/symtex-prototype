/**
 * Edit SOP Page
 *
 * Edit an existing SOP using the SOPEditor.
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useCognateStore } from '@/store';
import { SOPEditor } from '@/components/sop';
import type { ExtendedSOP } from '@/types';

export function EditSOPPage(): JSX.Element {
  const { id, sopId } = useParams<{ id: string; sopId: string }>();
  const navigate = useNavigate();
  const { cognates, sops, updateSOP } = useCognateStore();

  const cognate = cognates.find((c) => c.id === id);
  const existingSOP = sops.find((s) => s.id === sopId);

  const [sop, setSOP] = useState<ExtendedSOP | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (existingSOP) {
      // Convert SOP to ExtendedSOP
      setSOP({
        ...existingSOP,
      });
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [existingSOP]);

  if (!cognate) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-medium text-white mb-2">Cognate Not Found</h2>
        <p className="text-zinc-400 mb-4">The requested cognate does not exist.</p>
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!sop) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-medium text-white mb-2">SOP Not Found</h2>
        <p className="text-zinc-400 mb-4">The requested SOP does not exist.</p>
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

  const handleSave = (updatedSOP: ExtendedSOP): void => {
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
      <div className="px-6 py-3 border-b border-zinc-800 bg-zinc-900/50">
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <Link to="/studio/cognates" className="hover:text-white transition-colors">
            Cognates
          </Link>
          <span>/</span>
          <Link to={`/studio/cognates/${id}/sops`} className="hover:text-white transition-colors">
            {cognate.name}
          </Link>
          <span>/</span>
          <span className="text-white">{sop.name || 'Edit SOP'}</span>
        </div>
      </div>

      {/* Editor */}
      <SOPEditor
        sop={sop}
        onChange={setSOP}
        onSave={handleSave}
        onCancel={handleCancel}
        isNew={false}
        className="flex-1"
      />
    </div>
  );
}

export default EditSOPPage;
