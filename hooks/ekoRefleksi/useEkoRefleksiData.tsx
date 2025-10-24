import { useState, useEffect } from 'react';

// Types berdasarkan response API
export interface RefleksiEko {
    kuis: number;
    chat: number;
    refleksi: number;
}

export interface ApiResponse {
    success: boolean;
    code: number;
    message: string;
    data: RefleksiEko;
    timestamp: string;
}

// Real API function
const fetchEkoRefleksiData = async (): Promise<ApiResponse['data']> => {
    try {
        const API_BASE_URL = 'https://ekotaqwa.bangkoding.my.id/api';
        const response = await fetch(`${API_BASE_URL}/v1/refleksi`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: ApiResponse = await response.json();

        if (!result.success) {
            throw new Error(result.message || 'Gagal memuat data Eko Refleksi');
        }

        return result.data;
    } catch (error) {
        console.error('Error fetching Eko Refleksi data:', error);
        throw error;
    }
};


export const useEkoRefleksiData = () => {
    const [data, setData] = useState<ApiResponse['data'] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await fetchEkoRefleksiData();
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
