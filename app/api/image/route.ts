import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return new NextResponse('Missing URL parameter', { status: 400 });
  }

  try {
    // 1. Decode URL dengan aman (kadang ada karakter aneh)
    const targetUrl = decodeURIComponent(imageUrl);

    // 2. Fetch gambar dengan Header Penyamaran Full
    const response = await fetch(targetUrl, {
      method: 'GET',
      // PENTING: cache 'no-store' biar server Next.js gak nyimpen gambar error/banner
      cache: 'no-store', 
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://komikindo.ch/',
        'Origin': 'https://komikindo.ch/',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Sec-Fetch-Dest': 'image',
        'Sec-Fetch-Mode': 'no-cors',
        'Sec-Fetch-Site': 'cross-site',
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache'
      }
    });

    if (!response.ok) {
      // Kalau gagal, coba return statusnya biar ketahuan di Inspect Element
      return new NextResponse(`Failed to fetch image. Status: ${response.status}`, { status: response.status });
    }

    // 3. Ambil data gambar
    const imageBuffer = await response.arrayBuffer();
    
    // 4. Pastikan Content-Type bener
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        // Cache di BROWSER user aja (biar cepet), tapi server kita tetep request baru
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('Proxy Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
