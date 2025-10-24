import { useState, useEffect } from 'react';
import { apiGet } from 'utils/api';

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

const fetchFaseData = async (): Promise<ApiResponse['data']> => {
  try {
    const result = await apiGet(`/v1/fase`);
    return result as ApiResponse['data']; 
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
