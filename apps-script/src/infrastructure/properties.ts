import { AppsScriptProperties } from '../domain';

export function getProperties(): AppsScriptProperties {
  const properties = PropertiesService.getScriptProperties();
  const lineChannelId = properties.getProperty('LINE_CHANNEL_ID');
  const spreadsheetId = properties.getProperty('SPREADSHEET_ID');

  if (!lineChannelId || !spreadsheetId) {
    throw new Error('Required script properties are not configured');
  }

  return { lineChannelId, spreadsheetId };
}

