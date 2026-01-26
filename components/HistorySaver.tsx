'use client';

import { useEffect } from 'react';
import { saveHistory } from '@/lib/history';

interface HistorySaverProps {
  title: string;
  slug: string; // Slug komik induk
  image: string;
  chapterTitle: string;
  chapterSlug: string;
}

export default function HistorySaver({ title, slug, image, chapterTitle, chapterSlug }: HistorySaverProps) {
  useEffect(() => {
    // Simpan history pas komponen di-mount (user buka halaman)
    saveHistory({
      title,
      slug,
      image,
      lastChapterTitle: chapterTitle,
      lastChapterSlug: chapterSlug,
      date: Date.now(),
      type: 'Manga' // Default type
    });
  }, [title, slug, chapterTitle, chapterSlug]); // Re-run kalo pindah chapter

  return null; // Komponen ini ga nampilin apa-apa (invisible)
}
