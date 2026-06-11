export interface AuthenticatedLineUser {
  userId: string;
  displayName: string;
}

export interface AppsScriptProperties {
  lineChannelId: string;
  spreadsheetId: string;
}

export interface PostEvent {
  postData?: {
    contents?: string;
  };
}

