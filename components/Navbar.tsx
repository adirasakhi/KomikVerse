'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SearchBar from './SearchBar';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // Buat menu mobile
  const [isTypeOpen, setIsTypeOpen] = useState(false); // Buat dropdown tipe
  const pathname = usePathname();

  // Sembunyiin Navbar pas lagi baca komik biar fokus
  if (pathname.startsWith('/read/')) return null;

  const types = [
    { name: "Manga", value: "manga" },
    { name: "Manhwa", value: "manhwa" },
    { name: "Manhua", value: "manhua" }
  ];

  return (
    <nav className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* 1. Logo (Rebranding Nama Keren) */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
              KomikVerse
            </Link>
          </div>

          {/* 2. Desktop Menu (Hidden on Mobile) */}
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="/library" className="text-slate-300 hover:text-indigo-400 transition-colors">
              Koleksi
            </Link>
            <Link href="/genre" className="text-slate-300 hover:text-indigo-400 transition-colors">
              Genre
            </Link>
            
            {/* LOGIC DROPDOWN FIX:
                Event handler ditaruh di DIV pembungkus (Parent).
                Jadi pas mouse pindah dari tombol ke menu bawahnya, dianggap masih satu area.
                Begitu keluar dari div ini, isTypeOpen jadi false.
            */}
            <div 
              className="relative h-16 flex items-center"
              onMouseEnter={() => setIsTypeOpen(true)}
              onMouseLeave={() => setIsTypeOpen(false)}
            >
              <button 
                className="text-slate-300 hover:text-indigo-400 flex items-center gap-1 h-full"
                onClick={() => setIsTypeOpen(!isTypeOpen)} // Klik juga bisa buat toggle
              >
                Tipe <span className="text-[10px]">▼</span>
              </button>
              
              {/* Dropdown Content */}
              <div 
                className={`absolute left-0 top-14 w-48 bg-slate-900 border border-slate-700 rounded-lg shadow-xl overflow-hidden transition-all duration-200 transform origin-top-left ${
                  isTypeOpen 
                    ? 'opacity-100 visible translate-y-0' 
                    : 'opacity-0 invisible -translate-y-2'
                }`}
              >
                {types.map((t) => (
                  <Link 
                    key={t.value}
                    href={`/library?type=${t.value}`}
                    className="block px-4 py-3 text-slate-300 hover:bg-indigo-600 hover:text-white transition-colors border-b border-slate-800 last:border-0 text-xs font-medium"
                    onClick={() => setIsTypeOpen(false)} // Tutup pas diklik
                  >
                    {t.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link href="/last" className="text-slate-300 hover:text-indigo-400 transition-colors">
              Riwayat
            </Link>
          </div>

          {/* 3. Search Bar (Desktop) */}
          <div className="hidden md:block w-72">
            <SearchBar />
          </div>

          {/* 4. Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-300 hover:text-white p-2"
            >
              {isOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 5. Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 px-4 py-4 space-y-4 shadow-2xl animate-in slide-in-from-top-5 duration-200">
          <SearchBar /> {/* Search Bar di Mobile */}
          
          <div className="flex flex-col gap-2 font-medium">
            <Link href="/library" className="block py-2 text-slate-300 hover:text-indigo-400 border-b border-slate-800/50" onClick={() => setIsOpen(false)}>
              📚 Koleksi Lengkap
            </Link>
            <Link href="/genre" className="block py-2 text-slate-300 hover:text-indigo-400 border-b border-slate-800/50" onClick={() => setIsOpen(false)}>
              🏷️ Daftar Genre
            </Link>
            <Link href="/last" className="block py-2 text-slate-300 hover:text-indigo-400 border-b border-slate-800/50" onClick={() => setIsOpen(false)}>
              ↺ Riwayat Baca
            </Link>
            
            <div className="pt-2 mt-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Filter Tipe Komik</span>
              <div className="grid grid-cols-2 gap-2">
                {types.map((t) => (
                  <Link 
                    key={t.value} 
                    href={`/library?type=${t.value}`}
                    className="text-center py-2 bg-slate-800 rounded text-xs text-slate-300 hover:bg-indigo-600 hover:text-white transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {t.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
