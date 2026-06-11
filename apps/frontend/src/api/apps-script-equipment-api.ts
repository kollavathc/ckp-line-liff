import {
  ApiRequest,
  ApiResponse,
  CreateEquipmentDto,
  EquipmentItem,
  EquipmentListRequest,
  EquipmentListResponse,
  UpdateEquipmentDto,
} from '@ckpharmacy/shared';
import { apiRequest, HttpError } from '../lib/api';
import { EquipmentApi } from './equipment-api';

export class ApiError extends Error {
  constructor(readonly code: string, message: string, readonly fields?: Record<string, string[]>) {
    super(message);
  }
}

const apiErrorMessages: Record<string, string> = {
  VALIDATION_ERROR: 'ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง',
  UNAUTHORIZED: 'ไม่สามารถยืนยันตัวตนผ่าน LINE ได้',
  NOT_FOUND: 'ไม่พบรายการอุปกรณ์ที่ต้องการ',
  DUPLICATE_REQUEST: 'คำขอนี้ถูกดำเนินการแล้ว',
  INTERNAL_ERROR: 'ระบบขัดข้อง กรุณาลองใหม่อีกครั้ง',
};

export class AppsScriptEquipmentApi implements EquipmentApi {
  constructor(private readonly url: string, private readonly idToken: string) {}

  async list(request: EquipmentListRequest = {}): Promise<EquipmentItem[]> {
    return (await this.call<EquipmentListResponse>('equipment.list', request)).items;
  }

  create(request: CreateEquipmentDto): Promise<EquipmentItem> {
    return this.call('equipment.create', request, crypto.randomUUID());
  }

  update(request: UpdateEquipmentDto): Promise<EquipmentItem> {
    return this.call('equipment.update', request, crypto.randomUUID());
  }

  async delete(id: string): Promise<void> {
    await this.call('equipment.delete', { id }, crypto.randomUUID());
  }

  private async call<T>(action: string, payload: unknown, requestId?: string): Promise<T> {
    const body: ApiRequest<unknown> = { action, payload, requestId, idToken: this.idToken };
    let result: ApiResponse<T>;
    try {
      result = await apiRequest<ApiResponse<T>>(this.url, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body,
      });
    } catch (error: unknown) {
      if (error instanceof HttpError) {
        throw new ApiError('NETWORK_ERROR', error.message);
      }
      throw error;
    }
    if (!result.ok) {
      throw new ApiError(
        result.error.code,
        apiErrorMessages[result.error.code] ?? 'ไม่สามารถดำเนินการได้ กรุณาลองใหม่อีกครั้ง',
        result.error.fields,
      );
    }
    return result.data;
  }
}
