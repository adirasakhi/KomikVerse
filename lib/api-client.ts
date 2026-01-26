// src/lib/api-client.ts
const LOCAL_API = '/api/manga';

export const fetchManga = async (path: string) => {
  // Ini bakal nembak ke: http://localhost:3000/api/manga/...
  const res = await fetch(`${LOCAL_API}/${path}`);
  if (!res.ok) throw new Error('Gagal fetch data');
  return res.json();
};
