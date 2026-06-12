import {
  ApiRequest,
  ApiResponse,
  Product,
  ProductCategoryListResponse,
  ProductListRequest,
  ProductListResponse,
} from '@ckpharmacy/shared';
import { apiRequest, HttpError } from '../lib/api';
import { ProductApi } from './product-api';

export class ApiError extends Error {
  constructor(readonly code: string, message: string) {
    super(message);
  }
}

export class AppsScriptProductApi implements ProductApi {
  constructor(private readonly url: string) {}

  async list(request: ProductListRequest = {}): Promise<Product[]> {
    return (await this.call<ProductListResponse>('product.list', request)).items;
  }

  get(id: string): Promise<Product> {
    return this.call('product.get', { id });
  }

  async listCategories(): Promise<ProductCategoryListResponse['items']> {
    return (await this.call<ProductCategoryListResponse>('category.list', {})).items;
  }

  private async call<T>(action: string, payload: unknown): Promise<T> {
    const body: ApiRequest<unknown> = { action, payload };
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
      throw new ApiError(result.error.code, result.error.code === 'NOT_FOUND' ? 'ไม่พบสินค้าที่ต้องการ' : 'ไม่สามารถโหลดข้อมูลสินค้าได้');
    }
    return result.data;
  }
}
