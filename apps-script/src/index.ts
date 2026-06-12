import { ApiRequest } from '@ckpharmacy/shared';
import { PostEvent } from './domain';
import { jsonResponse } from './infrastructure/api-response';
import { getProperties } from './infrastructure/properties';
import { SheetEquipmentRepository } from './repositories/equipment-repository';
import { SheetProductRepository } from './repositories/product-repository';
import { Router } from './router';
import { EquipmentService } from './services/equipment-service';
import { LineAuthService } from './services/line-auth-service';
import { ProductService } from './services/product-service';

function createRouter(): Router {
  const properties = getProperties();
  const spreadsheet = SpreadsheetApp.openById(properties.spreadsheetId);
  const repository = new SheetEquipmentRepository(spreadsheet);
  const productRepository = new SheetProductRepository(spreadsheet);
  return new Router(
    new LineAuthService(properties.lineChannelId),
    new EquipmentService(repository),
    repository,
    new ProductService(productRepository),
  );
}

export function doGet(): GoogleAppsScript.Content.TextOutput {
  return jsonResponse({ ok: true, data: { status: 'ok' } });
}

export function doPost(event: PostEvent): GoogleAppsScript.Content.TextOutput {
  try {
    const contents = event.postData?.contents;
    if (!contents) {
      return jsonResponse({
        ok: false,
        error: { code: 'INVALID_JSON', message: 'Request body is required' },
      });
    }
    const request = JSON.parse(contents) as ApiRequest<unknown>;
    return jsonResponse(createRouter().handle(request));
  } catch (error: unknown) {
    console.error(error);
    return jsonResponse({
      ok: false,
      error: { code: 'INVALID_JSON', message: 'Request body must be valid JSON' },
    });
  }
}
