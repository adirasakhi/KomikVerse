import { NextResponse } from 'next/server';

const BASE_URL = 'https://www.sankavollerei.com/comic/komikindo';

export async function GET(
  request: Request,
  // PERUBAHAN 1: Definisikan params sebagai Promise
  { params }: { params: Promise<{ slug: string[] }> }
) {
  try {
    // PERUBAHAN 2: Wajib di-await dulu sebelum dipakai!
    const { slug } = await params;
    
    // Sekarang slug udah aman buat dipake (karena udah di-await)
    const path = slug.join('/');
    
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const targetUrl = `${BASE_URL}/${path}${queryString ? `?${queryString}` : ''}`;

    const res = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      next: { revalidate: 3600 } 
    });

    if (!res.ok) {
        return NextResponse.json({ error: 'Gagal fetch data dari sumber' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
