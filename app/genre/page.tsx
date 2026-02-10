import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
export const dynamic = 'force-dynamic';

// 1. Update Interface sesuai JSON lo
interface Genre {
  name: string;
  value: string; // Ini slug-nya, misal: "action", "adventure"
}

interface GenreResponse {
  success: boolean;
  genres: Genre[]; // Ganti dari list_genre jadi genres
}

async function getGenres(): Promise<Genre[]> {
  const url = 'https://www.sankavollerei.com/comic/komikindo/genres';
  
  try {
    const res = await fetch(url, {
      next: { revalidate: 86400 }, // Cache 24 jam
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!res.ok) return [];
    
    const json: GenreResponse = await res.json();
    // Ambil dari key 'genres'
    return json.success ? json.genres : [];

  } catch (error) {
    console.error("Genre Fetch Error:", error);
    return [];
  }
}

export default async function GenreListPage() {
  const genres = await getGenres();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-300 pb-10 font-sans">
      
      <PageHeader 
        title="Daftar Genre" 
        icon="🏷️" 
        description="Pilih genre favoritmu untuk menemukan komik yang sesuai selera."
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* ... Grid Genre tetep sama ... */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {genres.map((genre, idx) => (
            <Link 
              key={idx}
              href={`/library?genre=${genre.value}`} // Arahin ke Library filter genre
              className="bg-slate-900 border border-slate-800 hover:border-indigo-500 hover:bg-indigo-600/10 hover:text-indigo-400 rounded-lg p-4 text-center transition-all font-medium text-sm truncate group"
            >
              <span className="group-hover:scale-105 inline-block transition-transform">
                {genre.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
