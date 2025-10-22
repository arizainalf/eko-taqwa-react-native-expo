// hooks/useKuisData.ts
import { useState, useEffect, useCallback } from 'react'

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

// URL API Anda
const API_URL = 'https://ekotaqwa.bangkoding.my.id/api/kuis' // Asumsi prefix /refleksi

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

            const res = await fetch(API_URL)
            const responseData = await res.json()

            if (responseData?.success) {
                // Data dari controller ada di dalam 'data'
                setData(responseData.data)
            }
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