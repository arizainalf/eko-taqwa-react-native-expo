// hooks/useKuisData.ts
import { useState, useEffect, useCallback } from 'react'
import { apiGet } from 'utils/api'

// Tipe data berdasarkan respons controller kuis() Anda
export type KuisItem = {
    id: string
    judul: string
    deskripsi: string | null
    pertanyaan_count: number // Dari withCount('pertanyaan')
}

export type KuisData = {
    total_kuis: number
    total_hasil_kuis: number
    kuis: KuisItem[]
}

interface KuisResponse {
    success: boolean;
    data: KuisData;
    message?: string;
    code?: number;
    timestamp?: string;
}

export function useKuisData() {
    const [data, setData] = useState<KuisData | null>(null)
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    const fetchKuis = useCallback(async (isRefreshing = false) => {
        try {
            if (isRefreshing) {
                setRefreshing(true)
            } else {
                setLoading(true)
            }

            const responseData = await apiGet('/v1/refleksi/kuis') as KuisResponse['data']

            setData(responseData)
        } catch (err) {
            console.error('Failed to fetch kuis data:', err)
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }, [])

    const onRefresh = useCallback(() => {
        fetchKuis(true)
    }, [fetchKuis])

    useEffect(() => {
        fetchKuis()
    }, [fetchKuis])

    // Kembalikan data dan fungsi-fungsi
    return { data, loading, refreshing, onRefresh }
}