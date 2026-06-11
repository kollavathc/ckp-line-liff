import { ApiResponse } from '@ckpharmacy/shared';

export function jsonResponse<T>(response: ApiResponse<T>): GoogleAppsScript.Content.TextOutput {
  return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

