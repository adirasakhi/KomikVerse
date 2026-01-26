import { Comic } from '@/types';

const HISTORY_KEY = 'mangaskuy_history';

export interface HistoryItem {
  title: string;
  slug: string; // Slug Komik (bukan slug chapter)
  image: string;
  lastChapterTitle: string;
  lastChapterSlug: string; // Slug Chapter buat link 'Lanjut Baca'
  date: number; // Timestamp buat sorting
  type?: string;
}

export const getHistory = (): HistoryItem[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(HISTORY_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveHistory = (item: HistoryItem) => {
  const history = getHistory();
  
  // Cek apakah komik ini udah ada di history?
  const existingIndex = history.findIndex((h) => h.slug === item.slug);
  
  if (existingIndex !== -1) {
    // Kalau ada, hapus yang lama (biar nanti kita push yang baru ke paling atas)
    history.splice(existingIndex, 1);
  }

  // Masukin data baru ke paling depan (unshift)
  history.unshift(item);

  // Limit simpen cuma 50 history terakhir biar storage ga penuh
  if (history.length > 50) history.pop();

  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
};
