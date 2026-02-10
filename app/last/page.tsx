'use client';

import { useEffect, useState } from 'react';
import { getHistory, HistoryItem } from '@/lib/history';
import ComicCard from '@/components/ComicCard';
import PageHeader from '@/components/PageHeader'; // Import komponen baru
import { Comic } from '@/types';
export const dynamic = 'force-dynamic';


export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setHistory(getHistory());
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-300 pb-10">
      
      {/* Pake PageHeader, HAPUS header lama */}
      <PageHeader 
        title="Riwayat Baca" 
        icon="🕒" 
        description="Daftar komik yang terakhir kamu baca di perangkat ini."
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {history.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {history.map((item, index) => {
              const comicData: Comic = {
                title: item.title,
                slug: item.slug,
                image: item.image,
                type: item.type || 'Manga',
                chapters: [
                  {
                    title: item.lastChapterTitle,
                    slug: item.lastChapterSlug,
                    date: new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
                  }
                ]
              };
              return <ComicCard key={`${item.slug}-${index}`} comic={comicData} />;
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-900/30 rounded-xl border border-slate-800 border-dashed">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-xl font-bold text-slate-400">Belum ada riwayat</h2>
            <p className="text-slate-500 mt-2">Baca dulu gih, nanti nongol di sini.</p>
          </div>
        )}
      </div>
    </main>
  );
}
