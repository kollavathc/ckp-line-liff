import { FormEvent, useState } from 'react';
import {
  CreateEquipmentDto,
  EquipmentCondition,
  EquipmentStatus,
} from '@ckpharmacy/shared';

interface EquipmentFormProps {
  submitting: boolean;
  onSubmit: (request: CreateEquipmentDto) => Promise<void>;
  onCancel: () => void;
}

const inputClass = 'mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm';

export function EquipmentForm({ submitting, onSubmit, onCancel }: EquipmentFormProps) {
  const [form, setForm] = useState<CreateEquipmentDto>(new CreateEquipmentDto());

  function update<K extends keyof CreateEquipmentDto>(key: K, value: CreateEquipmentDto[K]): void {
    setForm((current) => Object.assign(new CreateEquipmentDto(), current, { [key]: value }));
  }

  async function submit(event: FormEvent): Promise<void> {
    event.preventDefault();
    await onSubmit(form);
  }

  return (
    <form className="space-y-4 rounded-xl bg-white p-4 shadow-sm" onSubmit={submit}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Record equipment</h2>
        <button type="button" className="text-sm text-slate-600" onClick={onCancel}>Cancel</button>
      </div>
      <label className="block text-sm font-medium">Name
        <input required maxLength={120} className={inputClass} value={form.name} onChange={(event) => update('name', event.target.value)} />
      </label>
      <label className="block text-sm font-medium">Category
        <input required maxLength={80} className={inputClass} value={form.category} onChange={(event) => update('category', event.target.value)} />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="block text-sm font-medium">Item code
          <input maxLength={50} className={inputClass} value={form.itemCode} onChange={(event) => update('itemCode', event.target.value)} />
        </label>
        <label className="block text-sm font-medium">Serial number
          <input maxLength={100} className={inputClass} value={form.serialNumber} onChange={(event) => update('serialNumber', event.target.value)} />
        </label>
        <label className="block text-sm font-medium">Brand
          <input maxLength={80} className={inputClass} value={form.brand} onChange={(event) => update('brand', event.target.value)} />
        </label>
        <label className="block text-sm font-medium">Model
          <input maxLength={80} className={inputClass} value={form.model} onChange={(event) => update('model', event.target.value)} />
        </label>
        <label className="block text-sm font-medium">Quantity
          <input required min={1} max={100000} type="number" className={inputClass} value={form.quantity} onChange={(event) => update('quantity', Number(event.target.value))} />
        </label>
        <label className="block text-sm font-medium">Unit
          <input required maxLength={30} className={inputClass} value={form.unit} onChange={(event) => update('unit', event.target.value)} />
        </label>
      </div>
      <label className="block text-sm font-medium">Location
        <input maxLength={100} className={inputClass} value={form.location} onChange={(event) => update('location', event.target.value)} />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="block text-sm font-medium">Condition
          <select className={inputClass} value={form.condition} onChange={(event) => update('condition', event.target.value as EquipmentCondition)}>
            {Object.values(EquipmentCondition).map((value) => <option key={value}>{value}</option>)}
          </select>
        </label>
        <label className="block text-sm font-medium">Status
          <select className={inputClass} value={form.status} onChange={(event) => update('status', event.target.value as EquipmentStatus)}>
            {Object.values(EquipmentStatus).map((value) => <option key={value}>{value}</option>)}
          </select>
        </label>
      </div>
      <label className="block text-sm font-medium">Notes
        <textarea maxLength={1000} rows={3} className={inputClass} value={form.notes} onChange={(event) => update('notes', event.target.value)} />
      </label>
      <button disabled={submitting} className="w-full rounded-lg bg-emerald-700 px-4 py-3 font-semibold text-white disabled:opacity-50">
        {submitting ? 'Saving...' : 'Save equipment'}
      </button>
    </form>
  );
}

