export interface Chapter {
  title: string;
  slug: string;
  date: string;
}

export interface Comic {
  title: string;
  slug: string;
  image: string;
  type: string;
  color: string;
  rating?: string; // Tambahan: Library punya rating
  chapters?: Chapter[]; // <--- TAMBAHIN TANDA TANYA (?) DI SINI
  chapters: Chapter[];
}

export interface ApiResponse {
  success: boolean;
  komikList: Comic[];
  pagination: any;
}
