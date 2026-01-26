// src/components/LoadMore.tsx
'use client'; // Wajib karena ada interaksi klik

import { useState } from 'react';
import { fetchManga } from '@/lib/api-client';
import Link from 'next/link';

export default function LoadMore() {
  const [page, setPage] = useState(2); // Mulai dari page 2 (karena page 1 udah di-load server)
  const [comics, setComics] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleLoadMore = async () => {
    setLoading(true);
    try {
      // NAH! Di sini kita pake api-client yang nembak ke /api/manga/latest/:page
      const data = await fetchManga(`latest/${page}`);
      setComics([...comics, ...data.komikList]);
      setPage(page + 1);
    } catch (error) {
      console.error(error);
      alert('Gagal memuat komik baru');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Render Komik Tambahan di sini */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 mt-6">
        {comics.map((item, index) => (
           <div 
              key={`${item.slug}-${index}`} // Pake index biar unik
              className="group relative bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-indigo-500/50 transition-all duration-300"
            >
              {/* --- Copy Paste Styling Card yang tadi di sini --- */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <span className="absolute top-2 left-2 z-10 px-2 py-1 text-[10px] font-bold tracking-wider text-slate-100 bg-black/60 backdrop-blur-sm rounded uppercase">
                  {item.type}
                </span>
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
              </div>
              <div className="absolute bottom-0 left-0 w-full p-4">
                 <Link href={`/komik/${item.slug}`}>
                    <h2 className="text-sm font-bold text-slate-100 line-clamp-2 group-hover:text-indigo-400">
                      {item.title}
                    </h2>
                 </Link>
              </div>
           </div>
        ))}
      </div>

      {/* Tombol Load More */}
      <div className="flex justify-center mt-10">
        <button
          onClick={handleLoadMore}
          disabled={loading}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Loading...
            </>
          ) : (
            'Muat Lebih Banyak'
          )}
        </button>
      </div>
    </>
  );
}
