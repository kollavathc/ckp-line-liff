import { EquipmentCondition, EquipmentStatus } from './equipment.enums';

export interface EquipmentItem {
  id: string;
  itemCode: string;
  name: string;
  category: string;
  brand: string;
  model: string;
  serialNumber: string;
  quantity: number;
  unit: string;
  location: string;
  condition: EquipmentCondition;
  status: EquipmentStatus;
  notes: string;
  recordedByLineUserId: string;
  recordedByName: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface EquipmentListRequest {
  query?: string;
  status?: EquipmentStatus;
  limit?: number;
}

export interface EquipmentListResponse {
  items: EquipmentItem[];
}

export interface EquipmentIdRequest {
  id: string;
}

