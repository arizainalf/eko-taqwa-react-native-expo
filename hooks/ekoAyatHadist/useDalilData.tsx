import { useState, useEffect } from 'react';
import { apiGet } from 'utils/api';

// Types berdasarkan response API
export interface TemaItem {
    id: string;
    nama: string;
    deskripsi?: string;
    created_at: string;
    updated_at: string;
}
export interface DalilItem {
    id: string;
    tema_id: string;
    jenis: string;
    teks_asli: string;
    terjemahan: string;
    sumber?: string;
    penjelasan?: string;
    created_at: string;
    updated_at: string;
}

export interface ApiResponse {
    success: boolean;
    code: number;
    message: string;
    data: {
        'dalil': DalilItem[];
        'tema': TemaItem;
    }
    timestamp: string;
}

// Real API function
const fetchDalilData = async (temaId: string): Promise<ApiResponse['data']> => {
    try {
        
        const result = await apiGet(`/v1/ayat_hadist/tema/${temaId}`);

        return result as ApiResponse['data'];

    } catch (error) {
        console.error('Error fetching Tema data:', error);
        throw error;
    }
};


export const useDalilData = (temaId: string) => {
    const [data, setData] = useState<ApiResponse['data'] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await fetchDalilData(temaId);
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
