import { useAuth } from '@clerk/clerk-expo';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://192.168.1.6:8081';

export function useApi() {
  const { getToken } = useAuth();

  async function request(path: string, options: RequestInit = {}) {
    const token = await getToken();
    const url = `${BASE_URL}${path}`;
    console.log('Fetching:', url);
    console.log('Token:', token ? 'exists' : 'null');

    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    console.log('Response status:', res.status);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  return { request };
}