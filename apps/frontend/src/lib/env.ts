interface Environment {
  appsScriptUrl?: string;
  lineContactUrl: string;
}

export function getEnvironment(): Environment {
  const appsScriptUrl = import.meta.env.VITE_APPS_SCRIPT_URL;
  const lineContactUrl = import.meta.env.VITE_LINE_CONTACT_URL || 'https://line.me/R/ti/p/';
  return { appsScriptUrl, lineContactUrl };
}
