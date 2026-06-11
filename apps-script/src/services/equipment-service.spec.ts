import { EquipmentCondition, EquipmentStatus } from '@ckpharmacy/shared';
import { EquipmentRepository } from '../repositories/equipment-repository';
import { EquipmentService, RequestValidationError } from './equipment-service';

const repository: jest.Mocked<EquipmentRepository> = {
  list: jest.fn(),
  get: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  hasProcessedRequest: jest.fn(),
  logRequest: jest.fn(),
};

describe('EquipmentService', () => {
  const user = { userId: 'U123', displayName: 'Test User' };
  const service = new EquipmentService(repository);

  beforeEach(() => jest.clearAllMocks());

  it('rejects invalid create payloads before repository access', () => {
    expect(() => service.create(user, { name: '', category: '' })).toThrow(RequestValidationError);
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('passes validated create payloads to the repository', () => {
    const payload = {
      name: 'Oximeter',
      category: 'Diagnostic',
      quantity: 1,
      unit: 'piece',
      condition: EquipmentCondition.Good,
      status: EquipmentStatus.Available,
    };
    repository.create.mockReturnValue({ id: '1' } as never);

    service.create(user, payload);

    expect(repository.create).toHaveBeenCalledWith(expect.objectContaining(payload), user);
  });
});

