import { useState, useEffect } from 'react';
import { MapelItem } from './useMapelByFase';

// Types berdasarkan response API
export interface MetodeItem {
    metode_pembelajaran: string;
    total: number;
}

export interface ApiResponse {
    success: boolean;
    code: number;
    message: string;
    data: {
        fase_id: string;
        mapel_id: string;
        metode: MetodeItem[];
        mapel: MapelItem
    };
    timestamp: string;
}

// Real API function
const fetchFaseData = async (faseId: string, mapelId: string): Promise<ApiResponse['data']> => {
    try {
        const API_BASE_URL = 'https://ekotaqwa.bangkoding.my.id/api';
        const response = await fetch(`${API_BASE_URL}/v1/fase/${faseId}/mapel/${mapelId}/metode`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: ApiResponse = await response.json();

        if (!result.success) {
            throw new Error(result.message || 'Gagal memuat data Metode');
        }

        return result.data;
    } catch (error) {
        console.error('Error fetching Metode data:', error);
        throw error;
    }
};


export const useMetodeData = (faseId: string, mapelId: string) => {
    const [data, setData] = useState<ApiResponse['data'] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await fetchFaseData(faseId, mapelId);
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
