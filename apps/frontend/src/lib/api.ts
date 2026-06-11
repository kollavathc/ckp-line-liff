export interface ApiRequestOptions {
  method?: 'GET' | 'POST';
  headers?: Record<string, string>;
  body?: unknown;
}

export class HttpError extends Error {
  constructor(readonly status: number, message: string) {
    super(message);
  }
}

export async function apiRequest<T>(url: string, options: ApiRequestOptions = {}): Promise<T> {
  const response = await fetch(url, {
    method: options.method ?? 'GET',
    headers: options.headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    redirect: 'follow',
  });

  if (!response.ok) {
    throw new HttpError(response.status, `ไม่สามารถเชื่อมต่อบริการได้ (${response.status})`);
  }

  return response.json() as Promise<T>;
}
