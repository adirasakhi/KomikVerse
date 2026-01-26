import Link from 'next/link';
import ComicCard from '@/components/ComicCard';
import PageHeader from '@/components/PageHeader';
import { Comic, ApiResponse } from '@/types';

// Update Fetcher: Handle Capitalization
async function getLibrary(page: number, type?: string, genre?: string): Promise<Comic[]> {
  // Base URL
  let url = `https://www.sankavollerei.com/comic/komikindo/library?page=${page}`;
  
  // LOGIC FIX: Kapitalisasi huruf pertama (manhwa -> Manhwa)
  if (type) {
    // Ubah jadi lowercase dulu jaga-jaga, terus kapitalin depannya
    const cleanType = type.toLowerCase();
    const capitalizedType = cleanType.charAt(0).toUpperCase() + cleanType.slice(1);
    url += `&type=${capitalizedType}`;
  }
  
  // Kalau ada parameter Genre
  if (genre) url += `&genre=${encodeURIComponent(genre)}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!res.ok) return [];
    
    const json: ApiResponse = await res.json();
    return json.success ? (json.komikList || []) : [];

  } catch (error) {
    console.error("Library Error:", error);
    return [];
  }
}

// ... (Bagian Pagination dan Component LibraryPage biarin sama aja kayak sebelumnya) ...

// Pagination Component
const Pagination = ({ page, type, genre }: { page: number, type?: string, genre?: string }) => {
  const getLink = (newPage: number) => {
    let link = `/library?page=${newPage}`;
    if (type) link += `&type=${type}`; // Di URL browser biarin huruf kecil gapapa
    if (genre) link += `&genre=${genre}`;
    return link;
  };

  return (
    <div className="flex justify-center gap-4 mt-12 mb-8">
      {page > 1 ? (
        <Link 
          href={getLink(page - 1)}
          className="px-6 py-2 bg-slate-800 hover:bg-indigo-600 text-slate-200 rounded-full font-bold transition-all border border-slate-700"
        >
          ← Prev
        </Link>
      ) : (
        <button disabled className="px-6 py-2 bg-slate-900 text-slate-600 rounded-full font-bold cursor-not-allowed border border-slate-800">
          ← Prev
        </button>
      )}

      <span className="px-4 py-2 text-slate-500 font-mono flex items-center">
        Page {page}
      </span>

      <Link 
        href={getLink(page + 1)}
        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)]"
      >
        Next →
      </Link>
    </div>
  );
};

export default async function LibraryPage({ searchParams }: { searchParams: Promise<{ page?: string; type?: string; genre?: string }> }) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const currentType = params.type;
  const currentGenre = params.genre;

  const comics = await getLibrary(currentPage, currentType, currentGenre);

  // Logic Deskripsi Header
  const headerDescription = (currentType || currentGenre) ? (
    <div className="flex flex-wrap items-center gap-2">
       <span>Menampilkan hasil filter:</span>
       {currentType && (
         <span className="bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20 capitalize text-xs font-bold">
           Type: {currentType}
         </span>
       )}
       {currentGenre && (
         <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 capitalize text-xs font-bold">
           Genre: {currentGenre}
         </span>
       )}
       <Link href="/library" className="text-xs text-red-400 hover:text-red-300 underline ml-2">Hapus Filter</Link>
    </div>
  ) : "Jelajahi semua koleksi komik lengkap dari A-Z.";

  return (
    <main className="min-h-screen bg-slate-950 text-slate-300 pb-10 font-sans">
      
      {/* Page Header Baru */}
      <PageHeader 
        title="Koleksi Komik" 
        icon="📚" 
        description={headerDescription}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {comics.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {comics.map((item, index) => (
                <ComicCard key={`${item.slug}-${index}`} comic={item} />
              ))}
            </div>
            <Pagination page={currentPage} type={currentType} genre={currentGenre} />
          </>
        ) : (
           <div className="text-center py-20 bg-slate-900/30 rounded-xl border border-slate-800 border-dashed">
             <div className="text-6xl mb-4">📭</div>
             <h2 className="text-xl font-bold text-slate-500">Tidak ditemukan</h2>
             <p className="text-slate-600 mt-2">Coba ganti filter tipe atau genre lain.</p>
           </div>
        )}
      </div>
    </main>
  );
}
