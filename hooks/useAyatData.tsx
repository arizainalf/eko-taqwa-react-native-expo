// hooks/useCpData.ts
import { useState, useEffect } from 'react';

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
  data: CpItem[];
  timestamp: string;
}

// Real API function
const fetchCpData = async (): Promise<CpItem[]> => {
  try {
    // Ganti dengan URL API Anda
    const API_BASE_URL = 'https://eko-taqwa.bangkoding.my.id/api';
    
    const response = await fetch(`${API_BASE_URL}/ayat`, { // Sesuaikan endpoint
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Tambahkan headers lain jika diperlukan
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch Ayat data');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching Ayat data:', error);
    throw error;
  }
};

export const useCpData = () => {
  const [data, setData] = useState<CpItem[] | null>(null);
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