import Link from 'next/link';
import ComicCard from '@/components/ComicCard';
import PageHeader from '@/components/PageHeader'; // <-- Import komponen baru
import { Comic, ApiResponse } from '@/types';

// Fetch Data Pencarian
async function getSearchResults(query: string): Promise<Comic[]> {
  // Hapus '/1' dan encode query
  const url = `https://www.sankavollerei.com/comic/komikindo/search/${encodeURIComponent(query)}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!res.ok) {
        console.error(`Search API Error: ${res.status}`);
        return [];
    }
    
const json: ApiResponse = await res.json();
    // --- PERBAIKAN DI SINI ---
    return json.success ? (json.komikList || []) : [];

  } catch (error) {
    console.error("Search Fetch Error:", error);
    return [];
  }
}

export default async function SearchPage({ params }: { params: Promise<{ query: string }> }) {
  const { query } = await params;
  const decodedQuery = decodeURIComponent(query);
  const comics = await getSearchResults(decodedQuery);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-300 pb-10 font-sans">
      
      {/* --- GANTI HEADER MANUAL DENGAN PAGE HEADER --- */}
      <PageHeader 
        title="Hasil Pencarian" 
        icon="🔍"
        description={
          <span>
            Menampilkan komik yang cocok dengan kata kunci <span className="text-indigo-400 font-bold">"{decodedQuery}"</span>
          </span>
        } 
      />

      {/* Grid Result */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {comics.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {comics.map((item, index) => (
              <ComicCard key={`${item.slug}-${index}`} comic={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-900/30 rounded-xl border border-slate-800 border-dashed">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-bold text-slate-400">Tidak ditemukan</h2>
            <p className="text-slate-500 mt-2">API mungkin tidak menemukan komik tersebut.</p>
            <Link href="/" className="inline-block mt-6 text-indigo-400 hover:text-indigo-300 font-bold">
              Kembali ke Home
            </Link>
          </div>
        )}
      </div>

    </main>
  );
}
