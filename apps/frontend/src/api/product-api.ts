import { Product, ProductCategoryItem, ProductListRequest } from '@ckpharmacy/shared';

export interface ProductApi {
  list(request?: ProductListRequest): Promise<Product[]>;
  get(id: string): Promise<Product>;
  listCategories(): Promise<ProductCategoryItem[]>;
}
