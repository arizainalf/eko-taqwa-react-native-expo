import { useState, useEffect } from 'react';
import { apiGet } from 'utils/api';

export interface Stats {
  total_tema: number;
  total_kuis: number;
  total_video: number;
  total_cp: number;
  total_ayat_hadist: number;
  total_kaidah: number;
  random_video?: {
    id: string;
    tema_id: string;
    judul: string;
    deskripsi: string;
    link: string;
    created_at: string;
    updated_at: string;
  };
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
  active_kuis: ActiveKuis[];
  device: any;
}

export const useHomeData = () => {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiGet<{ data: HomeData }>('/v1/home');
      setData(result.data || result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return { data, loading, error, refetch: loadData };
};
