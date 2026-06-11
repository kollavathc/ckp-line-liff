import {
  ApiRequest,
  ApiResponse,
  CreateEquipmentDto,
  EquipmentItem,
  EquipmentListRequest,
  EquipmentListResponse,
  UpdateEquipmentDto,
} from '@ckpharmacy/shared';
import { EquipmentApi } from './equipment-api';

export class ApiError extends Error {
  constructor(readonly code: string, message: string, readonly fields?: Record<string, string[]>) {
    super(message);
  }
}

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
    const response = await fetch(this.url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(body),
      redirect: 'follow',
    });
    if (!response.ok) {
      throw new ApiError('NETWORK_ERROR', `API request failed with status ${response.status}`);
    }
    const result = await response.json() as ApiResponse<T>;
    if (!result.ok) {
      throw new ApiError(result.error.code, result.error.message, result.error.fields);
    }
    return result.data;
  }
}

