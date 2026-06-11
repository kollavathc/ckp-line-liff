import {
  ApiFailure,
  ApiRequest,
  ApiResponse,
  EquipmentIdRequest,
  EquipmentListRequest,
} from '@ckpharmacy/shared';
import { EquipmentRepository } from './repositories/equipment-repository';
import { EquipmentService, RequestValidationError } from './services/equipment-service';
import { LineAuthService } from './services/line-auth-service';

export class Router {
  constructor(
    private readonly authService: LineAuthService,
    private readonly equipmentService: EquipmentService,
    private readonly repository: EquipmentRepository,
  ) {}

  handle(request: ApiRequest<unknown>): ApiResponse<unknown> {
    try {
      if (request.action === 'health.get') {
        return { ok: true, data: { status: 'ok' }, requestId: request.requestId };
      }

      const user = this.authService.verify(request.idToken ?? '');
      if (request.requestId && this.isMutation(request.action) && this.repository.hasProcessedRequest(request.requestId)) {
        return this.failure('DUPLICATE_REQUEST', 'This request has already been processed', request.requestId);
      }

      const data = this.route(request.action, request.payload, user);
      if (request.requestId && this.isMutation(request.action)) {
        this.repository.logRequest(request.requestId, request.action, user.userId, 'SUCCESS');
      }
      return { ok: true, data, requestId: request.requestId };
    } catch (error: unknown) {
      return this.mapError(error, request.requestId);
    }
  }

  private route(action: string, payload: unknown, user: { userId: string; displayName: string }): unknown {
    switch (action) {
      case 'equipment.list':
        return { items: this.equipmentService.list(user, this.objectPayload<EquipmentListRequest>(payload)) };
      case 'equipment.get':
        return this.equipmentService.get(user, this.idPayload(payload).id);
      case 'equipment.create':
        return this.equipmentService.create(user, payload);
      case 'equipment.update':
        return this.equipmentService.update(user, payload);
      case 'equipment.delete':
        return this.equipmentService.delete(user, this.idPayload(payload).id);
      default:
        throw new Error('UNKNOWN_ACTION');
    }
  }

  private objectPayload<T>(payload: unknown): T {
    return (payload && typeof payload === 'object' ? payload : {}) as T;
  }

  private idPayload(payload: unknown): EquipmentIdRequest {
    const value = this.objectPayload<Partial<EquipmentIdRequest>>(payload);
    if (!value.id || typeof value.id !== 'string') {
      throw new RequestValidationError({ id: ['id must be a string'] });
    }
    return { id: value.id };
  }

  private isMutation(action: string): boolean {
    return ['equipment.create', 'equipment.update', 'equipment.delete'].includes(action);
  }

  private mapError(error: unknown, requestId?: string): ApiFailure {
    if (error instanceof RequestValidationError) {
      return this.failure('VALIDATION_ERROR', error.message, requestId, error.fields);
    }
    if (error instanceof Error) {
      if (error.message === 'UNAUTHORIZED') {
        return this.failure('UNAUTHORIZED', 'LINE authentication failed', requestId);
      }
      if (error.message === 'NOT_FOUND') {
        return this.failure('NOT_FOUND', 'Equipment item was not found', requestId);
      }
      if (error.message === 'UNKNOWN_ACTION') {
        return this.failure('UNKNOWN_ACTION', 'The requested action is not supported', requestId);
      }
    }
    console.error(error);
    return this.failure('INTERNAL_ERROR', 'An unexpected error occurred', requestId);
  }

  private failure(
    code: string,
    message: string,
    requestId?: string,
    fields?: Record<string, string[]>,
  ): ApiFailure {
    return { ok: false, error: { code, message, fields }, requestId };
  }
}

