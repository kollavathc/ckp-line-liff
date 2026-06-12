interface Environment {
  appsScriptUrl?: string;
  lineContactUrl: string;
  liffId?: string;
}

export function getEnvironment(): Environment {
  const appsScriptUrl = import.meta.env.VITE_APPS_SCRIPT_URL;
  const lineContactUrl = import.meta.env.VITE_LINE_CONTACT_URL || 'https://line.me/R/ti/p/';
  const liffId = import.meta.env.VITE_LIFF_ID;
  return { appsScriptUrl, lineContactUrl, liffId };
}
