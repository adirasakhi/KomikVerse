import { NextResponse } from 'next/server';

// WAJIB: Biar Vercel selalu fetch data baru (Real-time)
export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  props: { params: Promise<{ slug: string[] }> }
) {
  try {
    const params = await props.params;
    const { slug } = params;

    // 1. Cek slug biar gak error
    if (!slug || !Array.isArray(slug)) {
      return NextResponse.json({ error: 'Invalid route' }, { status: 400 });
    }

    // 2. Gabungin slug jadi path (misal: "latest/1" atau "detail/one-piece")
    const path = slug.join('/');

    // 3. BASE URL API SANKAVOLLEREI (Kita "Tumpangi" ini)
    const targetUrl = `https://www.sankavollerei.com/comic/komikindo/${path}`;

    // 4. Ambil query string (misal ?q=naruto buat search)
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const finalUrl = queryString ? `${targetUrl}?${queryString}` : targetUrl;

    console.log("🚀 Proxy Nembak ke:", finalUrl);

    // 5. Fetch ke API Tetangga
    const response = await fetch(finalUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.0.0 Safari/537.36'
      },
      cache: 'no-store' // PENTING: Jangan simpan cache biar gak error 404 lama
    });

    if (!response.ok) {
      console.error("❌ Gagal Fetch:", response.status);
      return NextResponse.json({ error: 'Sumber Data Error' }, { status: response.status });
    }

    const data = await response.json();

    // 6. Balikin data mateng ke Frontend lu
    return NextResponse.json(data);

  } catch (error) {
    console.error("🔥 Server Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
