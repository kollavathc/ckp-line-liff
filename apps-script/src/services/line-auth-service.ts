import { AuthenticatedLineUser } from '../domain';

interface LineVerifyResponse {
  sub?: string;
  name?: string;
  aud?: string;
  error?: string;
}

export class LineAuthService {
  constructor(private readonly channelId: string) {}

  verify(idToken: string): AuthenticatedLineUser {
    if (!idToken) {
      throw new Error('UNAUTHORIZED');
    }

    const response = UrlFetchApp.fetch('https://api.line.me/oauth2/v2.1/verify', {
      method: 'post',
      contentType: 'application/x-www-form-urlencoded',
      payload: { id_token: idToken, client_id: this.channelId },
      muteHttpExceptions: true,
    });
    const body = JSON.parse(response.getContentText()) as LineVerifyResponse;

    if (response.getResponseCode() !== 200 || body.error || !body.sub || body.aud !== this.channelId) {
      throw new Error('UNAUTHORIZED');
    }

    return { userId: body.sub, displayName: body.name ?? '' };
  }
}

