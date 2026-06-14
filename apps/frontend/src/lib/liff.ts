import liff from '@line/liff';

export async function initLiff(liffId: string | undefined): Promise<void> {
  if (!liffId) {
    return;
  }
  try {
    await liff.init({ liffId });
  } catch (error: unknown) {
    console.error('LIFF init failed', error);
  }
}

export function canShareToLine(): boolean {
  try {
    return liff.isApiAvailable('shareTargetPicker') && liff.isLoggedIn();
  } catch {
    return false;
  }
}

export async function shareToLine(text: string): Promise<boolean> {
  const result = await liff.shareTargetPicker([{ type: 'text', text }]);
  return Boolean(result);
}

export function isInLiffClient(): boolean {
  try {
    return liff.isInClient();
  } catch {
    return false;
  }
}

export function isInLiffChatContext(): boolean {
  try {
    const context = liff.getContext();
    return ['utou', 'room', 'group', 'multichattab'].includes(context?.type ?? '');
  } catch {
    return false;
  }
}

export async function sendLineInquiry(text: string): Promise<void> {
  await liff.sendMessages([{ type: 'text', text }]);
  liff.closeWindow();
}
