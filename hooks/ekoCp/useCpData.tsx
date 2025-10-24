import { useState, useEffect } from 'react';
import { apiGet } from 'utils/api';

// Types berdasarkan response API
export interface CpItem {
  id: string;
  fase_id: string;
  mapel_id: string;
  deskripsi: string;
  pendekatan: string;
  model: string;
  teknik: string;
  metode: string;
  taktik: string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse {
  success: boolean;
  code: number;
  message: string;
  data: {
    cp: CpItem[];
    metode: string
  };
  timestamp: string;
}

// Real API function
const fetchCpData = async (): Promise<ApiResponse['data']> => {
  try {
    const result = await apiGet(`/v1/cp`);

    return result as ApiResponse['data'];

  } catch (error) {
    console.error('Error fetching CP data:', error);
    throw error;
  }
};

export const useCpData = () => {
  const [data, setData] = useState<ApiResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchCpData();
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
    refetch: loadData
  };
};