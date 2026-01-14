/**
 * New SOP Page
 *
 * Create a new SOP for a Cognate using the SOPEditor.
 */

import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useCognateStore } from '@/store';
import { SOPEditor } from '@/components/sop';
import type { ExtendedSOP } from '@/types';

export function NewSOPPage(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cognates, addSOP } = useCognateStore();

  const cognate = cognates.find((c) => c.id === id);

  // Initialize empty SOP
  const [sop, setSOP] = useState<ExtendedSOP>({
    id: '',
    cognateId: id || '',
    name: '',
    description: '',
    status: 'draft',
    priority: 'medium',
    version: '0.1.0',
    rules: [],
    tags: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    triggerCount: 0,
    isValid: false,
  });

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

  const handleSave = (updatedSOP: ExtendedSOP): void => {
    const newSOP = {
      ...updatedSOP,
      id: `sop-${Date.now()}`,
      cognateId: id!,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isValid: true, // Will be validated server-side
    };

    addSOP(newSOP);
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
          <span className="text-white">New SOP</span>
        </div>
      </div>

      {/* Editor */}
      <SOPEditor
        sop={sop}
        onChange={setSOP}
        onSave={handleSave}
        onCancel={handleCancel}
        isNew={true}
        className="flex-1"
      />
    </div>
  );
}

export default NewSOPPage;
