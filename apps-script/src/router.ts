import {
  ApiFailure,
  ApiRequest,
  ApiResponse,
  ProductGetRequest,
  ProductListRequest,
} from '@ckpharmacy/shared';
import { ProductService } from './services/product-service';

export class Router {
  constructor(private readonly productService: ProductService) {}

  handle(request: ApiRequest<unknown>): ApiResponse<unknown> {
    try {
      switch (request.action) {
        case 'health.get':
          return { ok: true, data: { status: 'ok' }, requestId: request.requestId };
        case 'product.list':
          return {
            ok: true,
            data: { items: this.productService.list(this.objectPayload<ProductListRequest>(request.payload)) },
            requestId: request.requestId,
          };
        case 'product.get':
          return {
            ok: true,
            data: this.productService.get(this.productIdPayload(request.payload).id),
            requestId: request.requestId,
          };
        case 'category.list':
          return { ok: true, data: { items: this.productService.listCategories() }, requestId: request.requestId };
        default:
          return this.failure('UNKNOWN_ACTION', 'The requested action is not supported', request.requestId);
      }
    } catch (error: unknown) {
      return this.mapError(error, request.requestId);
    }
  }

  private objectPayload<T>(payload: unknown): T {
    return (payload && typeof payload === 'object' ? payload : {}) as T;
  }

  private productIdPayload(payload: unknown): ProductGetRequest {
    const value = this.objectPayload<Partial<ProductGetRequest>>(payload);
    if (!value.id || typeof value.id !== 'string') {
      throw new Error('INVALID_PRODUCT_ID');
    }
    return { id: value.id };
  }

  private mapError(error: unknown, requestId?: string): ApiFailure {
    if (error instanceof Error) {
      if (error.message === 'INVALID_PRODUCT_ID') {
        return this.failure('VALIDATION_ERROR', 'Product id is required', requestId, { id: ['id must be a string'] });
      }
      if (error.message === 'PRODUCT_NOT_FOUND') {
        return this.failure('NOT_FOUND', 'Product was not found', requestId);
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
