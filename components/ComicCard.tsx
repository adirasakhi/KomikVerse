import Link from 'next/link';
import { Comic } from '@/types';

interface ComicCardProps {
  comic: Comic;
}

export default function ComicCard({ comic }: ComicCardProps) {
  // Cek apakah data chapter tersedia?
  const hasChapter = comic.chapters && comic.chapters.length > 0;

  return (
    <div className="group relative bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10">
      {/* --- Cover Image --- */}
      <div className="relative aspect-[3/4] overflow-hidden">
        {/* Type Label (Kasih fallback kalau type kosong) */}
        <span className="absolute top-2 left-2 z-10 px-2 py-1 text-[10px] font-bold tracking-wider text-slate-200 bg-slate-950/80 backdrop-blur-sm rounded uppercase border border-slate-700">
          {comic.type || 'Manga'} 
        </span>
        
        {/* Tampilkan Rating jika ada */}
        {comic.rating && (
           <span className="absolute top-2 right-2 z-10 px-2 py-1 text-[10px] font-bold text-yellow-400 bg-black/70 backdrop-blur-sm rounded border border-yellow-500/30 flex items-center gap-1">
             ⭐ {comic.rating}
           </span>
        )}
        
        <img 
          src={comic.image} 
          alt={comic.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out opacity-90 group-hover:opacity-100"
          loading="lazy"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
      </div>

      {/* --- Info Komik --- */}
      <div className="absolute bottom-0 left-0 w-full p-4">
        <Link href={`/komik/${comic.slug}`} className="block">
          <h2 className="text-sm font-bold text-slate-100 leading-tight line-clamp-2 group-hover:text-indigo-400 transition-colors drop-shadow-md">
            {comic.title}
          </h2>
        </Link>

        {/* LOGIC PENGAMAN CHAPTER */}
        <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-2">
          {hasChapter ? (
            // Kalau ada chapter (Halaman Home/Latest)
            <>
              <Link 
                href={`/read/${comic.chapters![0].slug}`}
                className="flex-1 truncate hover:text-emerald-400 transition-colors font-medium"
              >
                {comic.chapters![0].title.replace('Chapter ', 'Ch. ')}
              </Link>
              <span className="text-[10px] text-slate-500 ml-2">
                {/* --- PERBAIKAN DI SINI --- */}
                {/* Pake ?.replace() dan fallback || '' */}
                {comic.chapters![0].date?.replace(' lalu', '') || ''}
              </span>
            </>
          ) : (
            // Kalau TIDAK ada chapter (Halaman Library) -> Arahin ke Detail
            <Link 
              href={`/komik/${comic.slug}`}
              className="w-full text-center text-indigo-400 hover:text-indigo-300 transition-colors font-bold py-1 bg-slate-800/50 rounded"
            >
              Lihat Detail →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
