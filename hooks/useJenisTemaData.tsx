import { useState, useEffect } from 'react';
import { apiGet } from 'utils/api';

// Types berdasarkan response API
export interface JenisTemaItem {
    id: string;
    nama: string;
    tema_count: number;
    deskripsi?: string;
    created_at: string;
    updated_at: string;
}

export interface ApiResponse {
    success: boolean;
    code: number;
    message: string;
    data: {
        jenistema: JenisTemaItem[];
        tema_count: number;
    }
    timestamp: string;
}

// Real API function
const fetchJenisTemaData = async (): Promise<ApiResponse['data']> => {
    try {
        const result = await apiGet(`/v1/jenis_tema`);

        return result as ApiResponse['data'];

    } catch (error) {
        console.error('Error fetching Jenis Tema data:', error);
        throw error;
    }
};


export const useJenisTemaData = () => {
    const [data, setData] = useState<ApiResponse['data'] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await fetchJenisTemaData();
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
