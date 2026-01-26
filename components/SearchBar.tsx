'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search/${encodeURIComponent(query)}`);
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <div className="relative group">
        <input 
          type="search" 
          className="block w-full py-2 pl-4 pr-10 text-sm text-slate-200 bg-slate-950/50 border border-slate-700 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-slate-500 transition-all outline-none group-hover:bg-slate-900" 
          placeholder="Cari komik..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        
        <button 
          type="submit" 
          className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 bg-slate-800 text-slate-400 rounded-full hover:bg-indigo-600 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </button>
      </div>
    </form>
  );
}
