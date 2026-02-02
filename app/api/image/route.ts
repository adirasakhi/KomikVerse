// src/app/api/image/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return new NextResponse('Missing URL parameter', { status: 400 });
  }

  try {
    // Fetch gambar asli dengan header "Palsu" biar dikira akses dari web aslinya
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
        'Referer': 'https://komikindo.ch/', // <-- KUNCI UTAMA: Nipu server gambar
        'Origin': 'https://komikindo.ch/'
      }
    });

    if (!response.ok) {
      return new NextResponse(`Failed to fetch image: ${response.status}`, { status: response.status });
    }

    // Ambil data gambar (buffer)
    const imageBuffer = await response.arrayBuffer();
    
    // Kirim balik ke browser dengan Content-Type yang sesuai
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable', // Cache biar hemat bandwidth
      },
    });

  } catch (error) {
    console.error('Proxy Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

