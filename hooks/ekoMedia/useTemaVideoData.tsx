import { useState, useEffect } from 'react';
import { apiGet } from 'utils/api';

export interface JenisTemaItem {
    id: string;
    nama: string;
    tema_count: number;
    deskripsi?: string;
    created_at: string;
    updated_at: string;
}

export interface TemaItem {
    id: string;
    nama: string;
    deskripsi?: string;
    video_count: number;
    created_at: string;
    updated_at: string;
    jenistema: JenisTemaItem;
}

export interface ApiResponse {
    success: boolean;
    code: number;
    message: string;
    data: {
        tema: TemaItem[]
        jenistema: JenisTemaItem
        jenis_tema_id: string
        video_count: number
    };
    timestamp: string;
}

// Real API function
const fetchTemaData = async (jenisTemaId: string): Promise<ApiResponse['data']> => {
    try {

        const result = await apiGet(`/v1/media/jenis_tema/${jenisTemaId}`);

        return result as ApiResponse['data'];

    } catch (error) {
        console.error('Error fetching Tema data:', error);
        throw error;
    }
};

export const useTemaMediaData = (jenisTemaId: string) => {
    const [data, setData] = useState<ApiResponse['data'] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await fetchTemaData(jenisTemaId);
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
