import { ProductRepository } from '../repositories/product-repository';
import { ProductService } from './product-service';

const repository: jest.Mocked<ProductRepository> = {
  list: jest.fn(),
  get: jest.fn(),
  listCategories: jest.fn(),
};

describe('ProductService', () => {
  const service = new ProductService(repository);

  beforeEach(() => jest.clearAllMocks());

  it('returns published products from the repository', () => {
    repository.list.mockReturnValue([{ id: 'product-1' }] as never);
    expect(service.list({})).toEqual([{ id: 'product-1' }]);
    expect(repository.list).toHaveBeenCalledWith({});
  });

  it('throws when a product cannot be found', () => {
    repository.get.mockReturnValue(null);
    expect(() => service.get('missing')).toThrow('PRODUCT_NOT_FOUND');
  });
});
