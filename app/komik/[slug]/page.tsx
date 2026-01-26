import Link from 'next/link';
import { notFound } from 'next/navigation';

// --- 1. Define Types Sesuai JSON Lo ---
interface Genre {
  name: string;
  slug: string;
}

interface Chapter {
  title: string;
  slug: string;
  releaseTime: string;
}

interface ComicDetail {
  id: string;
  title: string;
  image: string;
  rating: string;
  votes: string;
  detail: {
    status: string;
    author: string;
    type: string;
  };
  genres: Genre[];
  description: string;
  chapters: Chapter[];
}

interface ApiResponse {
  success: boolean;
  data: ComicDetail;
}

// --- 2. Fetch Data (Server Side) ---
async function getComicDetail(slug: string): Promise<ComicDetail | null> {
  const url = `https://www.sankavollerei.com/comic/komikindo/detail/${slug}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 }, 
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!res.ok) return null;
    const json: ApiResponse = await res.json();
    return json.success ? json.data : null;

  } catch (error) {
    console.error("Error fetching detail:", error);
    return null;
  }
}

// --- 3. Component Utama ---
export default async function DetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const comic = await getComicDetail(slug);

  if (!comic) {
    return notFound(); 
  }

  // Bersihin Judul
  const cleanTitle = comic.title.replace(/\n/g, ' ').trim();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-300 font-sans pb-20">
      
      {/* --- HERO SECTION (Background Blur) --- */}
      <div className="relative h-[300px] md:h-[400px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center blur-xl opacity-30"
          style={{ backgroundImage: `url(${comic.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-950/80 to-slate-950" />
      </div>

      {/* --- CONTENT UTAMA --- */}
      <div className="max-w-6xl mx-auto px-4 -mt-60 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* KIRI: Cover Image & Info Singkat */}
          <div className="flex-shrink-0 mx-auto md:mx-0 w-64 md:w-72">
            <div className="rounded-xl overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-slate-800">
              <img 
                src={comic.image} 
                alt={cleanTitle} 
                className="w-full h-auto object-cover"
              />
            </div>
            
            {/* Stats Box */}
            <div className="grid grid-cols-2 gap-2 mt-4 text-center">
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                <div className="text-yellow-500 font-bold text-xl">{comic.rating}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">Rating</div>
              </div>
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                <div className="text-indigo-400 font-bold text-xl">{comic.detail.status}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">Status</div>
              </div>
            </div>
          </div>

          {/* KANAN: Detail Info & Chapters */}
          <div className="flex-1">
            {/* Judul */}
            <h1 className="text-2xl md:text-4xl font-bold text-slate-100 mb-2 leading-tight">
              {cleanTitle}
            </h1>
            <p className="text-slate-400 text-sm mb-4">
              by <span className="text-indigo-400">{comic.detail.author}</span> • {comic.detail.type}
            </p>

            {/* --- GENRES (UPDATE: Link ke Filter) --- */}
            <div className="flex flex-wrap gap-2 mb-6">
              {comic.genres.map((genre) => {
                // Bersihin slug dari API (misal: "/genres/comedy" -> "comedy")
                const cleanSlug = genre.slug.replace('/genres/', '').replace('/', '');
                
                return (
                  <Link 
                    key={genre.slug} 
                    href={`/genre/${cleanSlug}`} // Link ke halaman Genre Detail
                    className="px-3 py-1 text-xs font-medium bg-slate-800 text-slate-300 rounded-full border border-slate-700 hover:border-indigo-500 hover:bg-indigo-600/20 hover:text-indigo-300 transition-all"
                  >
                    {genre.name}
                  </Link>
                );
              })}
            </div>

            {/* Sinopsis */}
            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 mb-8">
              <h3 className="text-lg font-bold text-slate-100 mb-3 border-b border-slate-800 pb-2">
                Sinopsis
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed text-justify">
                {comic.description}
              </p>
            </div>

            {/* --- CHAPTER LIST --- */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <span className="w-1 h-6 bg-indigo-500 rounded-full"></span>
                  Daftar Chapter
                </h3>
                <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded">
                  Total: {comic.chapters.length} Ch.
                </span>
              </div>

              {/* List Container */}
              <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                {/* Header Table */}
                <div className="grid grid-cols-12 gap-4 p-4 bg-slate-800/50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <div className="col-span-8 md:col-span-9">Chapter</div>
                  <div className="col-span-4 md:col-span-3 text-right">Rilis</div>
                </div>

                {/* Items */}
                <div className="max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
                  {comic.chapters.map((chapter, idx) => (
                    <Link 
                      key={idx} 
                      href={`/read/${chapter.slug}`}
                      className="grid grid-cols-12 gap-4 p-4 border-b border-slate-800/50 hover:bg-indigo-600/10 hover:border-indigo-500/30 transition-all group"
                    >
                      <div className="col-span-8 md:col-span-9 font-medium text-slate-300 group-hover:text-indigo-400 transition-colors truncate">
                        {chapter.title}
                      </div>
                      <div className="col-span-4 md:col-span-3 text-right text-xs text-slate-500 group-hover:text-slate-400">
                        {chapter.releaseTime}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
