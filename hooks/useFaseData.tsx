import { useState, useEffect } from 'react';

// Types berdasarkan response API
export interface FaseItem {
  id: string;
  nama: string;
  deskripsi?: string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse {
  success: boolean;
  code: number;
  message: string;
  data: {
    total_cps: number;
    total_mapel: number;
    fase: FaseItem[];
  };
  timestamp: string;
}

// Real API function
const fetchFaseData = async (): Promise<ApiResponse['data']> => {
  try {
    const API_BASE_URL = 'https://ekotaqwa.bangkoding.my.id/api';
    const response = await fetch(`${API_BASE_URL}/fase`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Gagal memuat data Fase');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching Fase data:', error);
    throw error;
  }
};


export const useFaseData = () => {
  const [data, setData] = useState<ApiResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFaseData();
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

  return { data, loading, error, refetch: loadData };
};
