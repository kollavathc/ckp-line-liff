import { EquipmentItem, EquipmentStatus } from '@ckpharmacy/shared';
import { equipmentConditionLabels, equipmentStatusLabels, formatThaiDate } from '../../lib/equipment';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface EquipmentListProps {
  items: EquipmentItem[];
  onDelete: (item: EquipmentItem) => void;
}

function StatusBadge({ status }: { status: EquipmentStatus }) {
  const color = status === EquipmentStatus.Available
    ? 'bg-emerald-50 text-emerald-700'
    : status === EquipmentStatus.Maintenance
      ? 'bg-amber-50 text-amber-700'
      : status === EquipmentStatus.Retired
        ? 'bg-rose-50 text-rose-700'
        : 'bg-stone-100 text-zinc-700';

  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${color}`}>{equipmentStatusLabels[status]}</span>;
}

export function EquipmentList({ items, onDelete }: EquipmentListProps) {
  if (items.length === 0) {
    return (
      <Card className="border-dashed p-10 text-center">
        <h2 className="font-heading text-lg font-bold text-zinc-950">ยังไม่มีรายการอุปกรณ์</h2>
        <p className="mt-2 text-sm text-zinc-500">เริ่มต้นด้วยการเพิ่มอุปกรณ์ชิ้นแรกของคุณ</p>
      </Card>
    );
  }

  return (
    <>
      <ul className="space-y-4 md:hidden">
        {items.map((item) => (
          <li key={item.id}>
            <Card className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-heading font-bold text-zinc-950">{item.name}</h2>
                  <p className="mt-1 text-sm text-zinc-500">{item.category}</p>
                </div>
                <StatusBadge status={item.status} />
              </div>
              <dl className="mt-5 grid grid-cols-2 gap-4 rounded-2xl bg-[#f1ede5] p-4 text-sm">
                <div><dt className="text-zinc-500">จำนวน</dt><dd className="mt-1 font-semibold text-zinc-900">{item.quantity} {item.unit}</dd></div>
                <div><dt className="text-zinc-500">สภาพ</dt><dd className="mt-1 font-semibold text-zinc-900">{equipmentConditionLabels[item.condition]}</dd></div>
                <div><dt className="text-zinc-500">สถานที่</dt><dd className="mt-1 text-zinc-700">{item.location || '-'}</dd></div>
                <div><dt className="text-zinc-500">อัปเดตล่าสุด</dt><dd className="mt-1 text-zinc-700">{formatThaiDate(item.updatedAt)}</dd></div>
              </dl>
              <Button variant="ghost" className="mt-3 w-full text-rose-600 hover:bg-rose-50 hover:text-rose-700" onClick={() => onDelete(item)}>ลบรายการ</Button>
            </Card>
          </li>
        ))}
      </ul>

      <Card className="hidden overflow-hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-100 text-zinc-700">
              <tr>
                <th className="px-5 py-4 font-semibold">อุปกรณ์</th>
                <th className="px-5 py-4 font-semibold">จำนวน</th>
                <th className="px-5 py-4 font-semibold">สภาพ</th>
                <th className="px-5 py-4 font-semibold">สถานะ</th>
                <th className="px-5 py-4 font-semibold">อัปเดตล่าสุด</th>
                <th className="px-5 py-4"><span className="sr-only">จัดการ</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {items.map((item) => (
                <tr key={item.id} className="text-zinc-700">
                  <td className="px-5 py-4"><p className="font-semibold text-zinc-950">{item.name}</p><p className="mt-1 text-zinc-500">{item.category}</p></td>
                  <td className="px-5 py-4">{item.quantity} {item.unit}</td>
                  <td className="px-5 py-4">{equipmentConditionLabels[item.condition]}</td>
                  <td className="px-5 py-4"><StatusBadge status={item.status} /></td>
                  <td className="px-5 py-4">{formatThaiDate(item.updatedAt)}</td>
                  <td className="px-5 py-4 text-right"><Button variant="ghost" className="text-rose-600 hover:bg-rose-50 hover:text-rose-700" onClick={() => onDelete(item)}>ลบ</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
