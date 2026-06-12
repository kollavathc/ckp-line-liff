import { useCallback, useEffect, useMemo, useState } from 'react';
import { CreateEquipmentDto, EquipmentItem, EquipmentStatus } from '@ckpharmacy/shared';
import { EquipmentApi } from '../api/equipment-api';
import { EquipmentForm } from '../components/equipment/EquipmentForm';
import { EquipmentList } from '../components/equipment/EquipmentList';
import { AppShell } from '../components/layout/AppShell';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';

interface EquipmentPageProps {
  api: EquipmentApi;
  displayName: string;
}

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export function EquipmentPage({ api, displayName }: EquipmentPageProps) {
  const [items, setItems] = useState<EquipmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<EquipmentItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setItems(await api.list());
    } catch (loadError: unknown) {
      setError(getErrorMessage(loadError, 'ไม่สามารถโหลดรายการอุปกรณ์ได้'));
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => { void load(); }, [load]);

  const summary = useMemo(() => ({
    total: items.length,
    available: items.filter((item) => item.status === EquipmentStatus.Available).length,
    maintenance: items.filter((item) => item.status === EquipmentStatus.Maintenance).length,
  }), [items]);

  async function create(request: CreateEquipmentDto): Promise<void> {
    setSubmitting(true);
    setError('');
    try {
      const item = await api.create(request);
      setItems((current) => [item, ...current]);
      setShowForm(false);
    } catch (createError: unknown) {
      setError(getErrorMessage(createError, 'ไม่สามารถบันทึกอุปกรณ์ได้'));
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteItem(): Promise<void> {
    if (!itemToDelete) {
      return;
    }
    setError('');
    try {
      await api.delete(itemToDelete.id);
      setItems((current) => current.filter((candidate) => candidate.id !== itemToDelete.id));
      setItemToDelete(null);
    } catch (deleteError: unknown) {
      setError(getErrorMessage(deleteError, 'ไม่สามารถลบอุปกรณ์ได้'));
    }
  }

  return (
    <AppShell displayName={displayName}>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">คลังอุปกรณ์</p>
            <h1 className="mt-2 font-heading text-3xl font-bold text-zinc-950 sm:text-4xl">อุปกรณ์การแพทย์</h1>
            <p className="mt-2 max-w-xl text-zinc-500">ติดตามจำนวน สภาพ และสถานะอุปกรณ์ได้ในที่เดียว</p>
          </div>
          {!showForm && <Button onClick={() => setShowForm(true)}>เพิ่มอุปกรณ์</Button>}
        </section>

        <section className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3" aria-label="สรุปรายการอุปกรณ์">
          <Card className="p-5"><p className="text-sm text-zinc-500">อุปกรณ์ทั้งหมด</p><p className="mt-2 font-heading text-3xl font-bold text-zinc-950">{summary.total}</p></Card>
          <Card className="p-5"><p className="text-sm text-zinc-500">พร้อมใช้งาน</p><p className="mt-2 font-heading text-3xl font-bold text-success-dark">{summary.available}</p></Card>
          <Card className="p-5"><p className="text-sm text-zinc-500">อยู่ระหว่างซ่อม</p><p className="mt-2 font-heading text-3xl font-bold text-secondary">{summary.maintenance}</p></Card>
        </section>

        <section className="mt-8 space-y-5">
          {error && <Alert>{error}</Alert>}
          {showForm ? (
            <EquipmentForm submitting={submitting} onSubmit={create} onCancel={() => setShowForm(false)} />
          ) : loading ? (
            <Card className="p-12 text-center text-zinc-500">กำลังโหลดรายการอุปกรณ์...</Card>
          ) : (
            <EquipmentList items={items} onDelete={setItemToDelete} />
          )}
        </section>
      </main>

      <Modal
        open={itemToDelete !== null}
        title="ยืนยันการลบอุปกรณ์"
        confirmLabel="ลบอุปกรณ์"
        cancelLabel="ยกเลิก"
        onConfirm={() => void deleteItem()}
        onClose={() => setItemToDelete(null)}
      >
        ต้องการลบ <strong className="font-semibold text-zinc-950">{itemToDelete?.name}</strong> ออกจากรายการหรือไม่
      </Modal>
    </AppShell>
  );
}
