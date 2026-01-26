import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; // <-- Import Navbar

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MangaSkuy - Baca Komik Online",
  description: "Baca Manga, Manhwa, Manhua bahasa Indonesia gratis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.className} bg-slate-950 text-slate-300`}>
        {/* Pasang Navbar di sini, di atas Children */}
        <Navbar />
        
        {children}
      </body>
    </html>
  );
}
