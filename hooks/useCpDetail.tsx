import { useState, useEffect, useCallback } from 'react';

// --- Interface ---
// 1. Definisikan interface untuk OBJEK detail di dalam "data"
export interface CpDetail {
    id: string;
    fase_id: string;
    mapel_id: string;
    metode_pembelajaran: string;
    nama: string;
    deskripsi: string;
    pendekatan?: string | null;
    model?: string | null;
    teknik?: string | null;
    metode?: string | null;
    taktik?: string | null;
    created_at: string;
    updated_at: string;
}

// 2. Definisikan interface untuk respons API utama
export interface ApiResponse {
    success: boolean;
    code: number;
    message: string;
    data: CpDetail; // <-- Perhatikan, ini adalah objek, BUKAN array (CpDetail[])
    timestamp: string;
}

// --- Fungsi Fetch ---
// Fungsi API yang mengambil data
const fetchCpDetail = async (cpId: string): Promise<CpDetail> => {
    try {
        // Ganti URL ini dengan endpoint API Anda yang sebenarnya
        const API_BASE_URL = 'https://ekotaqwa.bangkoding.my.id/api';
        const response = await fetch(`${API_BASE_URL}/cp/${cpId}`, { // <-- Asumsi endpoint
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: ApiResponse = await response.json();

        if (!result.success) {
            throw new Error(result.message || 'Gagal memuat detail CP');
        }

        return result.data;
    } catch (error) {
        console.error('Error fetching CP detail:', error);
        throw error;
    }
};


// --- Custom Hook ---
export const useCpDetail = (cpId: string) => {
    // State 'data' sekarang menampung CpDetail tunggal atau null
    const [data, setData] = useState<CpDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Bungkus loadData dengan useCallback, dengan dependency 'cpId'
    const loadData = useCallback(async () => {
        // Jika cpId belum siap (misal dari router), jangan fetch
        if (!cpId) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const result = await fetchCpDetail(cpId);
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, [cpId]); // <-- 'cpId' adalah dependency

    // Jalankan 'loadData' saat pertama kali render atau saat 'loadData' (cpId) berubah
    useEffect(() => {
        loadData();
    }, [loadData]);

    // Kembalikan state dan fungsi refetch
    return { data, loading, error, refetch: loadData };
};