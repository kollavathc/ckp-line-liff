import liff from '@line/liff';

export interface LiffSession {
  idToken: string;
  displayName: string;
}

export async function initializeLiff(liffId: string): Promise<LiffSession> {
  await liff.init({ liffId });
  if (!liff.isLoggedIn()) {
    liff.login({ redirectUri: window.location.href });
    return new Promise(() => undefined);
  }
  const idToken = liff.getIDToken();
  if (!idToken) {
    throw new Error('ไม่สามารถยืนยันตัวตนผ่าน LINE ได้');
  }
  const profile = await liff.getProfile();
  return { idToken, displayName: profile.displayName };
}
