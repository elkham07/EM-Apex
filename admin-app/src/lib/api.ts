/** Same-origin API base (nginx proxies /api → api-gateway in Docker). */
export const API_BASE = import.meta.env.VITE_API_URL || '';

export function apiUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${normalized}`;
}
