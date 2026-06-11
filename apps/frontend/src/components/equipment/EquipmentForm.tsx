import { FormEvent, useState } from 'react';
import {
  CreateEquipmentDto,
  EquipmentCondition,
  EquipmentStatus,
} from '@ckpharmacy/shared';
import { equipmentConditionLabels, equipmentStatusLabels } from '../../lib/equipment';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';

interface EquipmentFormProps {
  submitting: boolean;
  onSubmit: (request: CreateEquipmentDto) => Promise<void>;
  onCancel: () => void;
}

export function EquipmentForm({ submitting, onSubmit, onCancel }: EquipmentFormProps) {
  const [form, setForm] = useState<CreateEquipmentDto>(() => Object.assign(new CreateEquipmentDto(), { unit: 'ชิ้น' }));

  function update<K extends keyof CreateEquipmentDto>(key: K, value: CreateEquipmentDto[K]): void {
    setForm((current) => Object.assign(new CreateEquipmentDto(), current, { [key]: value }));
  }

  async function submit(event: FormEvent): Promise<void> {
    event.preventDefault();
    await onSubmit(form);
  }

  return (
    <Card className="p-5 sm:p-7">
      <form className="space-y-6" onSubmit={submit}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-heading text-xl font-bold text-zinc-950">บันทึกอุปกรณ์ใหม่</h2>
            <p className="mt-1 text-sm text-zinc-500">กรอกข้อมูลที่จำเป็นเพื่อเพิ่มรายการเข้าระบบ</p>
          </div>
          <Button variant="ghost" onClick={onCancel}>ยกเลิก</Button>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input required maxLength={120} name="name" label="ชื่ออุปกรณ์" placeholder="เช่น เครื่องวัดความดัน" value={form.name} onChange={(event) => update('name', event.target.value)} />
          <Input required maxLength={80} name="category" label="หมวดหมู่" placeholder="เช่น อุปกรณ์ตรวจวินิจฉัย" value={form.category} onChange={(event) => update('category', event.target.value)} />
          <Input maxLength={50} name="itemCode" label="รหัสอุปกรณ์" value={form.itemCode} onChange={(event) => update('itemCode', event.target.value)} />
          <Input maxLength={100} name="serialNumber" label="หมายเลขเครื่อง" value={form.serialNumber} onChange={(event) => update('serialNumber', event.target.value)} />
          <Input maxLength={80} name="brand" label="ยี่ห้อ" value={form.brand} onChange={(event) => update('brand', event.target.value)} />
          <Input maxLength={80} name="model" label="รุ่น" value={form.model} onChange={(event) => update('model', event.target.value)} />
          <Input required min={1} max={100000} type="number" name="quantity" label="จำนวน" value={form.quantity} onChange={(event) => update('quantity', Number(event.target.value))} />
          <Input required maxLength={30} name="unit" label="หน่วย" placeholder="ชิ้น" value={form.unit} onChange={(event) => update('unit', event.target.value)} />
          <Input maxLength={100} name="location" label="สถานที่จัดเก็บ" value={form.location} onChange={(event) => update('location', event.target.value)} />
          <Select name="condition" label="สภาพอุปกรณ์" value={form.condition} onChange={(event) => update('condition', event.target.value as EquipmentCondition)}>
            {Object.values(EquipmentCondition).map((value) => <option key={value} value={value}>{equipmentConditionLabels[value]}</option>)}
          </Select>
          <Select name="status" label="สถานะ" value={form.status} onChange={(event) => update('status', event.target.value as EquipmentStatus)}>
            {Object.values(EquipmentStatus).map((value) => <option key={value} value={value}>{equipmentStatusLabels[value]}</option>)}
          </Select>
        </div>

        <Textarea maxLength={1000} rows={3} name="notes" label="หมายเหตุ" value={form.notes} onChange={(event) => update('notes', event.target.value)} />

        <div className="flex justify-end">
          <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
            {submitting ? 'กำลังบันทึก...' : 'บันทึกอุปกรณ์'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
