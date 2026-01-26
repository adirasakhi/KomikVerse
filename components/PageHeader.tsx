import React from 'react';

interface PageHeaderProps {
  title: string;
  icon?: string; // Emoji atau Icon
  description?: React.ReactNode; // Bisa teks atau elemen HTML (buat filter)
}

export default function PageHeader({ title, icon, description }: PageHeaderProps) {
  return (
    <div className="bg-gradient-to-b from-slate-900/50 to-transparent border-b border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col gap-2">
          {/* Judul & Icon */}
          <h1 className="text-2xl md:text-3xl font-bold text-slate-100 flex items-center gap-3">
            {icon && <span className="text-2xl md:text-3xl filter drop-shadow-lg">{icon}</span>}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-400">
              {title}
            </span>
          </h1>

          {/* Garis Aksen Kecil */}
          <div className="w-12 h-1 bg-indigo-500 rounded-full mt-1 mb-2"></div>

          {/* Deskripsi / Filter Aktif */}
          {description && (
            <div className="text-sm text-slate-400 mt-1">
              {description}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
