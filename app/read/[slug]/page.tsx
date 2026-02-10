import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import HistorySaver from '@/components/HistorySaver';
export const dynamic = 'force-dynamic';

// --- 1. Definisi Tipe Data ---
interface ImageItem {
  id: number;
  url: string;
}

interface Navigation {
  prev: string | null;
  next: string | null;
}

interface Thumbnail {
  url: string;
  title: string;
}

interface ChapterData {
  id: string;
  title: string;
  navigation: { prev: string | null; next: string | null };
  allChapterSlug: string;
  images: { id: number; url: string }[];
  thumbnail: { url: string; title: string };
}

interface ApiResponse {
  success: boolean;
  data: ChapterData;
}

// --- 2. Fetching Data ---
async function getChapterData(slug: string): Promise<ChapterData | null> {
  // Pastikan URL API backend kamu benar
  const url = `https://www.sankavollerei.com/comic/komikindo/chapter/${slug}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 }, // Cache data chapter selama 1 jam
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!res.ok) return null;
    const json: ApiResponse = await res.json();
    return json.success ? json.data : null;

  } catch (error) {
    console.error("Fetch Error:", error);
    return null;
  }
}

// --- 3. Generate Metadata (SEO) ---
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const chapter = await getChapterData(slug);
  
  if (!chapter) return { title: 'Chapter Tidak Ditemukan - KomikVerse' };

  const cleanChapterTitle = chapter.title.replace(/Komik\s+/i, '').replace(/\n/g, ' ').trim();
  const comicTitle = chapter.thumbnail?.title.replace('Komik ', '') || cleanChapterTitle;

  return {
    title: `${comicTitle} - ${cleanChapterTitle} | Baca di KomikVerse`,
    description: `Baca komik ${comicTitle} ${cleanChapterTitle} bahasa Indonesia gratis.`,
  };
}

// --- 4. Komponen Navigasi ---
const ChapterNav = ({ nav }: { nav: Navigation }) => (
  <div className="flex justify-between items-center gap-4 max-w-3xl mx-auto px-4 py-6">
    {/* Tombol Previous */}
    {nav.prev ? (
      <Link 
        href={`/read/${nav.prev}`}
        className="flex-1 bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white py-3 px-4 rounded-lg text-center font-bold transition-all border border-slate-700 text-sm md:text-base"
      >
        ← Sebelumnya
      </Link>
    ) : (
      <button disabled className="flex-1 bg-slate-900 text-slate-600 py-3 px-4 rounded-lg text-center font-bold cursor-not-allowed border border-slate-800 text-sm md:text-base">
        Mentok Awal
      </button>
    )}

    {/* Tombol Next */}
    {nav.next ? (
      <Link 
        href={`/read/${nav.next}`}
        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg text-center font-bold transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] text-sm md:text-base"
      >
        Selanjutnya →
      </Link>
    ) : (
      <button disabled className="flex-1 bg-slate-900 text-slate-600 py-3 px-4 rounded-lg text-center font-bold cursor-not-allowed border border-slate-800 text-sm md:text-base">
        Mentok Akhir
      </button>
    )}
  </div>
);

// --- 5. Halaman Utama ---
export default async function ReadPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const chapter = await getChapterData(slug);

  if (!chapter) return notFound();

  // Bersihin Judul
  const cleanChapterTitle = chapter.title.replace(/Komik\s+/i, '').replace(/\n/g, ' ').trim();
  const comicTitle = chapter.thumbnail?.title.replace('Komik ', '') || cleanChapterTitle;

  return (
    <main className="min-h-screen bg-slate-950 pb-20 font-sans">
      
      {/* Simpan History Baca */}
      <HistorySaver 
        title={comicTitle}
        slug={chapter.allChapterSlug}
        image={chapter.thumbnail?.url || ''}
        chapterTitle={cleanChapterTitle}
        chapterSlug={slug}
      />
      
      {/* --- HEADER STICKY --- */}
      <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          
          {/* Back Button ke Detail Komik */}
          <Link 
            href={`/komik/${chapter.allChapterSlug}`} 
            className="flex-shrink-0 flex items-center gap-2 text-indigo-400 font-bold hover:text-indigo-300 transition-colors text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            <span className="hidden md:inline">Detail</span>
          </Link>

          {/* Judul Tengah (Truncated) */}
          <h1 className="flex-1 text-sm md:text-base font-bold text-slate-200 truncate text-center">
             <span className="text-slate-400 font-normal mr-2 hidden sm:inline">{comicTitle}</span>
             <span className="text-slate-600 mx-1 hidden sm:inline">|</span>
             <span className="text-indigo-100">{cleanChapterTitle}</span>
          </h1>

          {/* Home Button */}
          <Link href="/" className="flex-shrink-0 text-slate-400 hover:text-white p-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </Link>
        </div>
      </div>

      {/* Navigasi Atas */}
      <ChapterNav nav={chapter.navigation} />

      {/* --- READER AREA (GAMBAR KOMIK) --- */}
      <div className="w-full max-w-3xl mx-auto bg-black min-h-screen shadow-2xl overflow-hidden">
        {chapter.images && chapter.images.length > 0 ? (
          chapter.images.map((item) => (
            <div key={item.id} className="relative w-full">
              {/* SOLUSI ANTI-BLOCK & IMAGE LOOPING:
                 Gunakan layanan wsrv.nl sebagai proxy gambar eksternal.
                 - url: URL gambar asli
                 - output=webp: Otomatis convert ke WebP (lebih ringan)
              */}
              <img 
                src={`https://wsrv.nl/?url=${encodeURIComponent(item.url)}&output=webp`}
                alt={`${comicTitle} - ${cleanChapterTitle} - Page ${item.id}`}
                className="w-full h-auto block" 
                loading="lazy"
              />
            </div>
          ))
        ) : (
          <div className="p-20 text-center flex flex-col items-center justify-center text-slate-500 gap-4">
             <div className="w-16 h-16 border-4 border-slate-700 border-t-indigo-500 rounded-full animate-spin"></div>
             <p>Gambar sedang dimuat atau tidak tersedia...</p>
          </div>
        )}
      </div>

      {/* Navigasi Bawah */}
      <ChapterNav nav={chapter.navigation} />
      
      <div className="text-center text-slate-600 text-xs py-10 px-4">
        <p>Tekan tombol navigasi di atas untuk pindah chapter.</p>
        <p className="mt-2 text-slate-700">KomikVerse Reader v1.0</p>
      </div>

    </main>
  );
}
