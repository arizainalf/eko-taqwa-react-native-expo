import { useState, useEffect } from 'react';
import { apiGet } from 'utils/api';

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
        const result = await apiGet(`/v1/refleksi`);

        return result as ApiResponse['data'];

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
