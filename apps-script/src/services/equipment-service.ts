import { plainToInstance } from 'class-transformer';
import { validateSync, ValidationError } from 'class-validator';
import {
  CreateEquipmentDto,
  EquipmentItem,
  EquipmentListRequest,
  UpdateEquipmentDto,
} from '@ckpharmacy/shared';
import { AuthenticatedLineUser } from '../domain';
import { EquipmentRepository } from '../repositories/equipment-repository';

export class RequestValidationError extends Error {
  constructor(readonly fields: Record<string, string[]>) {
    super('The request is invalid');
  }
}

export class EquipmentService {
  constructor(private readonly repository: EquipmentRepository) {}

  list(user: AuthenticatedLineUser, request: EquipmentListRequest): EquipmentItem[] {
    return this.repository.list(user.userId, request);
  }

  get(user: AuthenticatedLineUser, id: string): EquipmentItem {
    const item = this.repository.get(user.userId, id);
    if (!item) {
      throw new Error('NOT_FOUND');
    }
    return item;
  }

  create(user: AuthenticatedLineUser, payload: unknown): EquipmentItem {
    return this.repository.create(this.validate(CreateEquipmentDto, payload), user);
  }

  update(user: AuthenticatedLineUser, payload: unknown): EquipmentItem {
    const item = this.repository.update(this.validate(UpdateEquipmentDto, payload), user);
    if (!item) {
      throw new Error('NOT_FOUND');
    }
    return item;
  }

  delete(user: AuthenticatedLineUser, id: string): { id: string } {
    if (!this.repository.delete(user.userId, id)) {
      throw new Error('NOT_FOUND');
    }
    return { id };
  }

  private validate<T extends object>(type: new () => T, payload: unknown): T {
    const dto = plainToInstance(type, payload);
    const errors = validateSync(dto, { whitelist: true, forbidNonWhitelisted: true });
    if (errors.length > 0) {
      throw new RequestValidationError(this.validationFields(errors));
    }
    return dto;
  }

  private validationFields(errors: ValidationError[]): Record<string, string[]> {
    return Object.fromEntries(errors.map((error) => [
      error.property,
      Object.values(error.constraints ?? { invalid: 'Invalid value' }),
    ]));
  }
}

