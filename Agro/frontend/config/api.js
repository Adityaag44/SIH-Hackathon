export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');

export async function apiFetch(path, options) {
  if (!API_BASE_URL) {
    throw new Error('Server address is not configured. Add EXPO_PUBLIC_API_URL to frontend/.env.');
  }

  const response = await fetch(`${API_BASE_URL}${path}`, options);
  const text = await response.text();
  const body = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(body?.detail || body?.message || 'Server request failed.');
  }

  return body;
}
