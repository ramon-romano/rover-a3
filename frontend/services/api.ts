import { Platform } from 'react-native';

const getBaseUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8080';
  }
  return 'http://localhost:8080';
};

export const BASE_URL = getBaseUrl();
export const API_URL = `${BASE_URL}/api/rover`;

export async function fetchWorld() {
  const res = await fetch(`${API_URL}/world`);
  if (!res.ok) throw new Error('Failed to fetch world');
  return await res.json();
}

export async function simulateScript(script: string) {
  const res = await fetch(`${API_URL}/simulate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ script })
  });
  return await res.json();
}

export async function resetWorld() {
  const res = await fetch(`${API_URL}/reset`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to reset world');
  return await res.json();
}
