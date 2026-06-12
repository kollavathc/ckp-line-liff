import { AppsScriptProperties } from '../domain';

export function getProperties(): AppsScriptProperties {
  const properties = PropertiesService.getScriptProperties();
  const lineChannelId = properties.getProperty('LINE_CHANNEL_ID');
  const spreadsheetId = properties.getProperty('SPREADSHEET_ID');

  if (!spreadsheetId) {
    throw new Error('SPREADSHEET_ID is not configured');
  }

  return { lineChannelId: lineChannelId ?? '', spreadsheetId };
}
