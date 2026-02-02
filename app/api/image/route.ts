import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return new NextResponse('Missing URL parameter', { status: 400 });
  }

  try {
    // 1. Decode URL target
    const targetUrl = decodeURIComponent(imageUrl);

    // 2. Fetch ke server asli dengan Header Penyamaran
    const response = await fetch(targetUrl, {
      method: 'GET',
      // PENTING: No-store biar Next.js gak nyimpen cache gambar rusak/banner
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
      return new NextResponse(`Failed to fetch image. Status: ${response.status}`, { status: response.status });
    }

    // 3. Ambil data binary gambar
    const imageBuffer = await response.arrayBuffer();
    
    // 4. Deteksi otomatis: Apakah ini JPG, PNG, atau lainnya?
    // Kita ambil langsung dari header server aslinya.
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    
    // 5. Kirim balik ke browser dengan format yang benar
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType, // <-- Ini kuncinya biar JPG/PNG otomatis
        // Cache di browser user aja (biar cepet loading page berikutnya)
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('Proxy Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
