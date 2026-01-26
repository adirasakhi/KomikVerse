import Link from 'next/link';
import ComicCard from '@/components/ComicCard';
import PageHeader from '@/components/PageHeader'; // <-- Import komponen baru
import { Comic, ApiResponse } from '@/types';

// Fetch Komik berdasarkan Genre lewat endpoint Library
async function getComicsByGenre(slug: string, page: number): Promise<Comic[]> {
  const url = `https://www.sankavollerei.com/comic/komikindo/library?page=${page}&genre=${encodeURIComponent(slug)}`;

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
    console.error("Genre Fetch Error:", error);
    return [];
  }
}

export default async function GenreDetailPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ slug: string }>; 
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const pageParams = await searchParams;
  const page = Number(pageParams.page) || 1;
  
  const comics = await getComicsByGenre(slug, page);
  const genreName = slug.replace(/-/g, ' ').toUpperCase(); 

  return (
    <main className="min-h-screen bg-slate-950 text-slate-300 pb-10 font-sans">
      
      {/* --- PAGE HEADER BARU --- */}
      <PageHeader 
        title={`Genre: ${genreName}`}
        icon="🏷️"
        description={
          <span>
            Menampilkan koleksi komik yang terdaftar dalam kategori <span className="text-indigo-400 font-bold">{genreName}</span>.
          </span>
        }
      />

      {/* List Komik */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {comics.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {comics.map((item, index) => (
                <ComicCard key={`${item.slug}-${index}`} comic={item} />
              ))}
            </div>
            
            {/* Pagination Simple */}
            <div className="flex justify-center gap-4 mt-12">
               {page > 1 ? (
                 <Link href={`/genre/${slug}?page=${page - 1}`} className="px-6 py-2 bg-slate-800 hover:bg-indigo-600 rounded-full border border-slate-700 transition-colors">← Prev</Link>
               ) : (
                 <button disabled className="px-6 py-2 bg-slate-900 text-slate-600 rounded-full border border-slate-800 cursor-not-allowed">← Prev</button>
               )}
               
               <Link href={`/genre/${slug}?page=${page + 1}`} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg transition-colors">Next →</Link>
            </div>
          </>
        ) : (
          <div className="text-center py-20 bg-slate-900/50 rounded-xl border border-slate-800 border-dashed">
            <div className="text-6xl mb-4">🌪️</div>
            <h2 className="text-xl font-bold text-slate-400">Genre Kosong</h2>
            <p className="text-slate-500 mt-2">Tidak ada komik ditemukan untuk genre ini.</p>
            <Link href="/genre" className="inline-block mt-6 text-indigo-400 hover:text-indigo-300 font-bold">
              Pilih Genre Lain
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
