'use client'; // Wajib pake ini karena ada state & onClick

import { useState } from 'react';
import { Comic } from '@/types';
import ComicCard from '@/components/ComicCard';
import { fetchManga } from '@/lib/api-client';

interface HomeLatestProps {
  initialComics: Comic[];
}

export default function HomeLatest({ initialComics }: HomeLatestProps) {
  // State data komik (dimulai dengan data dari server)
  const [comics, setComics] = useState<Comic[]>(initialComics);
  const [page, setPage] = useState(2); // Next page mulai dari 2
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Fungsi buat tombol "Load More"
  const handleLoadMore = async () => {
    setLoading(true);
    try {
      // Nembak ke Proxy Lokal (/api/manga/latest/2...)
      const data = await fetchManga(`latest/${page}`);
      
      if (data.komikList && data.komikList.length > 0) {
        setComics((prev) => [...prev, ...data.komikList]);
        setPage((prev) => prev + 1);
      } else {
        setHasMore(false); // Data abis
      }
    } catch (error) {
      console.error("Gagal load more:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      {/* Grid Komik */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {comics.map((item, index) => (
          // Pake key kombinasi slug+index buat jaga-jaga kalau ada duplikat dari API
          <ComicCard key={`${item.slug}-${index}`} comic={item} />
        ))}
      </div>

      {/* Tombol Load More */}
      {hasMore && (
        <div className="flex justify-center mt-12 mb-8">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-8 py-3 bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white rounded-full font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 border border-slate-700 shadow-lg shadow-black/20"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
                <span>Memuat...</span>
              </>
            ) : (
              <span>Muat Lebih Banyak</span>
            )}
          </button>
        </div>
      )}
    </section>
  );
}
