import { EquipmentCondition, EquipmentStatus } from '@ckpharmacy/shared';

export const equipmentConditionLabels: Record<EquipmentCondition, string> = {
  [EquipmentCondition.New]: 'ใหม่',
  [EquipmentCondition.Good]: 'สภาพดี',
  [EquipmentCondition.Fair]: 'พอใช้',
  [EquipmentCondition.Damaged]: 'ชำรุด',
};

export const equipmentStatusLabels: Record<EquipmentStatus, string> = {
  [EquipmentStatus.Available]: 'พร้อมใช้งาน',
  [EquipmentStatus.InUse]: 'กำลังใช้งาน',
  [EquipmentStatus.Maintenance]: 'อยู่ระหว่างซ่อมบำรุง',
  [EquipmentStatus.Retired]: 'เลิกใช้งาน',
};

const dateFormatter = new Intl.DateTimeFormat('th-TH', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

export function formatThaiDate(value: string): string {
  return value ? dateFormatter.format(new Date(value)) : '-';
}
