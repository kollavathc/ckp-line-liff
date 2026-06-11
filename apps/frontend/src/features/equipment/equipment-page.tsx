import { useCallback, useEffect, useState } from 'react';
import { CreateEquipmentDto, EquipmentItem } from '@ckpharmacy/shared';
import { EquipmentApi } from '../../api/equipment-api';
import { EquipmentForm } from './equipment-form';
import { EquipmentList } from './equipment-list';

interface EquipmentPageProps {
  api: EquipmentApi;
  displayName: string;
}

export function EquipmentPage({ api, displayName }: EquipmentPageProps) {
  const [items, setItems] = useState<EquipmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setItems(await api.list());
    } catch (loadError: unknown) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load equipment');
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => { void load(); }, [load]);

  async function create(request: CreateEquipmentDto): Promise<void> {
    setSubmitting(true);
    setError('');
    try {
      const item = await api.create(request);
      setItems((current) => [item, ...current]);
      setShowForm(false);
    } catch (createError: unknown) {
      setError(createError instanceof Error ? createError.message : 'Unable to save equipment');
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteItem(item: EquipmentItem): Promise<void> {
    if (!window.confirm(`Delete ${item.name}?`)) {
      return;
    }
    setDeletingId(item.id);
    setError('');
    try {
      await api.delete(item.id);
      setItems((current) => current.filter((candidate) => candidate.id !== item.id));
    } catch (deleteError: unknown) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete equipment');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-xl px-4 py-5">
      <header className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Signed in as {displayName}</p>
          <h1 className="text-2xl font-bold">Medical equipment</h1>
        </div>
        {!showForm && <button className="rounded-lg bg-emerald-700 px-4 py-2 font-semibold text-white" onClick={() => setShowForm(true)}>Add item</button>}
      </header>
      {error && <div role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</div>}
      {showForm ? (
        <EquipmentForm submitting={submitting} onSubmit={create} onCancel={() => setShowForm(false)} />
      ) : loading ? (
        <div className="py-12 text-center text-slate-500">Loading equipment...</div>
      ) : (
        <EquipmentList items={items} deletingId={deletingId} onDelete={deleteItem} />
      )}
    </main>
  );
}

