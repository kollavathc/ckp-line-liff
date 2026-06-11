interface Environment {
  liffId: string;
  appsScriptUrl: string;
}

export function getEnvironment(): Environment {
  const liffId = import.meta.env.VITE_LIFF_ID;
  const appsScriptUrl = import.meta.env.VITE_APPS_SCRIPT_URL;
  if (!liffId || !appsScriptUrl) {
    throw new Error('ยังไม่ได้ตั้งค่า LIFF ID หรือ URL ของบริการ');
  }
  return { liffId, appsScriptUrl };
}
