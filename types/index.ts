export interface Chapter {
  title: string;
  slug: string;
  date?: string; // Kasih ? biar aman kalau data tanggal ga ada
  releaseTime?: string; // Kadang API namainnya releaseTime
}

export interface Comic {
  title: string;
  slug: string;
  image: string;
  
  // Kasih tanda tanya (?) di properti yang mungkin GAK ADA di History/Search
  type?: string; 
  color?: string; 
  rating?: string;
  
  // HAPUS duplikat, sisain satu yang optional
  chapters?: Chapter[]; 
}

export interface ApiResponse {
  success: boolean;
  // Kadang API balikin 'data', kadang 'komikList', kadang 'genres'
  // Kita pake 'any' atau definisi union biar fleksibel
  data?: any; 
  komikList?: Comic[];
  genres?: any[];
  pagination?: any;
}
