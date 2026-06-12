import { Product, ProductCategoryItem, ProductListRequest } from '@ckpharmacy/shared';
import { ProductRepository } from '../repositories/product-repository';

export class ProductService {
  constructor(private readonly repository: ProductRepository) {}

  list(request: ProductListRequest): Product[] {
    return this.repository.list(request);
  }

  get(id: string): Product {
    const product = this.repository.get(id);
    if (!product) {
      throw new Error('PRODUCT_NOT_FOUND');
    }
    return product;
  }

  listCategories(): ProductCategoryItem[] {
    return this.repository.listCategories();
  }
}
