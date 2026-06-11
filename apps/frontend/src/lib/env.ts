interface Environment {
  liffId: string;
  appsScriptUrl: string;
}

export function getEnvironment(): Environment {
  const liffId = import.meta.env.VITE_LIFF_ID;
  const appsScriptUrl = import.meta.env.VITE_APPS_SCRIPT_URL;
  if (!liffId || !appsScriptUrl) {
    throw new Error('VITE_LIFF_ID and VITE_APPS_SCRIPT_URL must be configured');
  }
  return { liffId, appsScriptUrl };
}

