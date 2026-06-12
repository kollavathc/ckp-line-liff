import { Product, ProductCategoryItem, ProductListRequest } from '@ckpharmacy/shared';
import { mockCategories, mockProducts } from '../data/mock-products';
import { ProductApi } from './product-api';

export class MockProductApi implements ProductApi {
  async list(request: ProductListRequest = {}): Promise<Product[]> {
    const query = request.query?.trim().toLocaleLowerCase('th-TH') ?? '';
    return mockProducts.filter((product) =>
      (!request.category || product.category === request.category)
      && (!request.stockStatus || product.stockStatus === request.stockStatus)
      && (!query || [product.name, product.brand, product.shortDescription]
        .some((value) => value.toLocaleLowerCase('th-TH').includes(query))),
    );
  }

  async get(id: string): Promise<Product> {
    const product = mockProducts.find((item) => item.id === id || item.slug === id);
    if (!product) {
      throw new Error('ไม่พบสินค้าที่ต้องการ');
    }
    return product;
  }

  async listCategories(): Promise<ProductCategoryItem[]> {
    return mockCategories;
  }
}

export class UnavailableProductApi implements ProductApi {
  private readonly error = new Error('ยังไม่ได้ตั้งค่า URL บริการสินค้า');

  list(): Promise<Product[]> {
    return Promise.reject(this.error);
  }

  get(): Promise<Product> {
    return Promise.reject(this.error);
  }

  listCategories(): Promise<ProductCategoryItem[]> {
    return Promise.reject(this.error);
  }
}
