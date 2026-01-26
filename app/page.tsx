import { ApiResponse } from '@/types';
import HomeLatest from '@/components/HomeLatest';
import SearchBar from '@/components/SearchBar'; // Import ini
import Link from 'next/link';


// Update fungsi ini
async function getInitialComics(): Promise<ApiResponse> {
  const targetUrl = 'https://www.sankavollerei.com/comic/komikindo/latest/1';

  try {
    const res = await fetch(targetUrl, {
      next: { revalidate: 60 },
      // Tambahin headers ini biar dianggap browser beneran (kadang API nge-blok bot)
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    // 1. Cek status dulu (bukan 200 OK?)
    if (!res.ok) {
      console.error(`❌ API Error: ${res.status} ${res.statusText}`);
      return { success: false, komikList: [] };
    }

    // 2. Ambil teks mentah dulu, jangan langsung .json()
    const text = await res.text();

    // 3. Cek apakah ini HTML? (Penyebab error "Unexpected token <")
    if (text.trim().startsWith('<')) {
      console.error("❌ API mengembalikan HTML, bukan JSON. Cek URL atau Server API.");
      console.error("Cuplikan Response:", text.substring(0, 100)); // Liat 100 huruf pertama
      return { success: false, komikList: [] }; // Balikin data kosong biar web ga crash
    }

    // 4. Kalau aman, baru parse
    return JSON.parse(text);

  } catch (error) {
    console.error("❌ Fetch Error:", error);
    return { success: false, komikList: [] };
  }
}

export default async function HomePage() {
  const data = await getInitialComics();

  return (
    // Background Slate-950 (Paling Gelap & Nyaman di Mata)
    <main className="min-h-screen bg-slate-950 text-slate-300 pb-10 font-sans">
      
      {/* HEADER dengan Search Bar */}
      <div className="bg-slate-900/50 border-b border-slate-800 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-3 md:h-20 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-6 w-full md:w-auto">
             <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
               MangaSkuy
             </h1>
             
             {/* --- TAMBAHAN MENU NAVIGASI --- */}
             <nav className="hidden md:flex gap-4 text-sm font-medium">
               <Link href="/library" className="text-slate-400 hover:text-indigo-400 transition-colors">Library</Link>
               <Link href="/last" className="text-slate-400 hover:text-indigo-400 transition-colors">History</Link>
               <Link href="/genre" className="text-slate-400 hover:text-indigo-400 transition-colors">Genre</Link> {/* <-- Tambahin ini */}
             </nav>
          </div>

          {/* Search Bar */}
          <div className="w-full md:w-96">
            <SearchBar />
          </div>
          
        </div>
        
        {/* Menu Navigasi Mobile (Muncul di bawah search bar di layar HP) */}
        <div className="md:hidden flex justify-around py-2 border-t border-slate-800 bg-slate-950/50 text-xs font-bold text-slate-500">
           <Link href="/library" className="hover:text-indigo-400 py-1">📚 Library</Link>
           <Link href="/last" className="hover:text-indigo-400 py-1">↺ History</Link>
           <Link href="/genre" className="hover:text-indigo-400 py-1">🏷️ Genre</Link>
        </div>
      </div>

      {/* Konten Utama */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center gap-2">
           <div className="w-1 h-6 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
           <h2 className="text-xl font-bold text-slate-100">Update Terbaru</h2>
        </div>

        {/* Render Komponen Client di sini */}
        <HomeLatest initialComics={data.komikList || []} />
      </div>

    </main>
  );
}
