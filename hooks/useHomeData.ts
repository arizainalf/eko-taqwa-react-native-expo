// hooks/useHomeData.ts
import { useState, useEffect } from 'react';

// Types berdasarkan response API
export interface Stats {
  total_tema: number;
  total_kuis: number;
  total_video: number;
  total_cp: number;
  total_kaidah: number;
  total_refleksi: number;
  total_ayat: number;
  total_hadist: number;
  total_kitab: number;
  kuis_selesai: number;
  random_video?: {
    id: string;
    tema_id: string;
    judul: string;
    deskripsi: string;
    link: string;
    created_at: string;
    updated_at: string;
  };
  device: any;
}

export interface JenisTema {
  id: string;
  nama: string;
  deskripsi: string;
  created_at: string;
  updated_at: string;
}

export interface Video {
  id: string;
  tema_id: string;
  judul: string;
  deskripsi: string;
  link: string;
  created_at: string;
  updated_at: string;
}

export interface FeaturedTema {
  id: string;
  jenis_tema_id: string;
  nama: string;
  deskripsi: string;
  created_at: string;
  updated_at: string;
  jenis_tema: JenisTema;
  video: Video[];
}

export interface ActiveKuis {
  id: string;
  judul: string;
  deskripsi: string;
  batas_waktu: number;
  aktif: number;
  created_at: string;
  updated_at: string;
  pertanyaan_count: number;
}

export interface HomeData {
  stats: Stats;
  featured_tema: FeaturedTema[];
  active_kuis: ActiveKuis[];
  device: any;
}

export interface ApiResponse {
  success: boolean;
  code: number;
  message: string;
  data: HomeData;
  timestamp: string;
}

// Real API function
const fetchHomeData = async (): Promise<HomeData> => {
  try {
    // Ganti dengan URL API Anda
    const API_BASE_URL = 'https://ekotaqwa.bangkoding.my.id/api';
    
    const response = await fetch(`${API_BASE_URL}/home`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Tambahkan headers lain jika diperlukan (Authorization, dll)
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch home data');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching home data:', error);
    throw error;
  }
};

export const useHomeData = () => {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchHomeData();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return { 
    data, 
    loading, 
    error,
    refetch: loadData // Untuk pull-to-refresh
  };
};