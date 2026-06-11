import { EquipmentItem } from '@ckpharmacy/shared';

interface EquipmentListProps {
  items: EquipmentItem[];
  deletingId: string | null;
  onDelete: (item: EquipmentItem) => Promise<void>;
}

export function EquipmentList({ items, deletingId, onDelete }: EquipmentListProps) {
  if (items.length === 0) {
    return <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">No equipment recorded yet.</div>;
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.id} className="rounded-xl bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-semibold">{item.name}</h2>
              <p className="text-sm text-slate-500">{item.category} · {item.quantity} {item.unit}</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-800">{item.status.replace('_', ' ')}</span>
          </div>
          <div className="mt-3 flex items-end justify-between gap-3 text-sm">
            <div className="text-slate-600">
              {item.itemCode && <p>Code: {item.itemCode}</p>}
              {item.location && <p>Location: {item.location}</p>}
              <p>Condition: {item.condition}</p>
            </div>
            <button
              type="button"
              disabled={deletingId === item.id}
              className="rounded-lg px-3 py-2 text-red-700 disabled:opacity-50"
              onClick={() => onDelete(item)}
            >
              {deletingId === item.id ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

