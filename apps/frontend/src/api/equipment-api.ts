import {
  CreateEquipmentDto,
  EquipmentItem,
  EquipmentListRequest,
  UpdateEquipmentDto,
} from '@ckpharmacy/shared';

export interface EquipmentApi {
  list(request?: EquipmentListRequest): Promise<EquipmentItem[]>;
  create(request: CreateEquipmentDto): Promise<EquipmentItem>;
  update(request: UpdateEquipmentDto): Promise<EquipmentItem>;
  delete(id: string): Promise<void>;
}

