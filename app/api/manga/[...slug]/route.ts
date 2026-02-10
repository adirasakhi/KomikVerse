import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  props: { params: Promise<{ slug: string[] }> }
) {
  try {
    const params = await props.params;
    const { slug } = params;
    const path = slug.join('/'); // misal: "latest/1"

    // 1. KITA GANTI TARGET KE BACAKOMIK (Sesuai Screenshot Lu)
    // Asalnya: .../comic/komikindo/...
    // Jadi: .../comic/bacakomik/...
    // Note: Kita sesuaikan path-nya manual karena kadang beda dikit
    let targetEndpoint = '';

    if (path.includes('latest')) {
      targetEndpoint = 'latest'; // BacaKomik endpoint: /comic/bacakomik/latest
    } else if (path.includes('detail')) {
      targetEndpoint = `info/${slug[1]}`; // BacaKomik biasanya pake 'info' bukan 'detail'
    } else if (path.includes('search')) {
        // Search logic (kalau perlu)
         targetEndpoint = `search/${slug[1]}`;
    } else {
      targetEndpoint = path;
    }
    
    const targetUrl = `https://www.sankavollerei.com/comic/bacakomik/${targetEndpoint}`;

    console.log("🚀 Pindah ke BacaKomik:", targetUrl);

    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.0.0 Safari/537.36'
      },
      cache: 'no-store'
    });

    if (!response.ok) throw new Error('Gagal fetch BacaKomik');
    
    const rawData = await response.json();

    // 2. MAPPING DATA (PENTING!)
    // Biar frontend lu gak kaget karena kuncinya beda
    // KomikIndo: { title, thumb, endpoint }
    // BacaKomik: { title, image, endpoint } (Biasanya beda di thumb/image)
    
    let finalData = rawData;

    if (rawData.data && Array.isArray(rawData.data)) {
        finalData.data = rawData.data.map((item: any) => ({
            ...item,
            // Paksa field 'thumb' ada isinya (ambil dari image kalau thumb kosong)
            thumb: item.thumb || item.image || item.thumbnail,
            // Pastikan type ada (Manhwa/Manga)
            type: item.type || 'Komik', 
            endpoint: item.endpoint
        }));
    }

    return NextResponse.json(finalData);

  } catch (error) {
    console.error("🔥 Error Proxy:", error);
    // FALLBACK TERAKHIR: Data Palsu (Kalau BacaKomik mati juga)
    return NextResponse.json({
      success: true,
      data: [
        {
          title: "Server Maintenance (Demo)",
          thumb: "https://via.placeholder.com/150",
          endpoint: "error",
          type: "Info",
          upload_on: "Now"
        }
      ]
    });
  }
}
