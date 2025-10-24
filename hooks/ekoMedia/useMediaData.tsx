import { useState, useEffect } from 'react';

// Types berdasarkan response API
export interface TemaItem {
    id: string;
    nama: string;
    deskripsi?: string;
    created_at: string;
    updated_at: string;
}
export interface MediaItem {
    id: string;
    tema_id: string;
    judul: string;
    deskripsi?: string;
    link: string;
    created_at: string;
    updated_at: string;
}

export interface ApiResponse {
    success: boolean;
    code: number;
    message: string;
    data: {
        'tema': TemaItem;
        'media': MediaItem[];
    }
    timestamp: string;
}

// Real API function
const fetchMediaData = async (temaId: string): Promise<ApiResponse['data']> => {
    try {
        const API_BASE_URL = 'https://ekotaqwa.bangkoding.my.id/api';
        const response = await fetch(`${API_BASE_URL}/v1/media/tema/${temaId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: ApiResponse = await response.json();

        if (!result.success) {
            throw new Error(result.message || 'Gagal memuat data Tema');
        }

        return result.data;
    } catch (error) {
        console.error('Error fetching Tema data:', error);
        throw error;
    }
};


export const useMediaData = (temaId: string) => {
    const [data, setData] = useState<ApiResponse['data'] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await fetchMediaData(temaId);
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
