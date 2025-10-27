import { useState, useEffect, useCallback } from 'react'
import { apiGet } from 'utils/api' // pastikan path sesuai struktur kamu

// --- Tipe Data berdasarkan Controller 'kuisDetail' ---
// Data kuis
export type Kuis = {
    id: string
    judul: string
    deskripsi: string
    batas_waktu: number
    // tambahkan properti lain jika ada (cth: created_at, updated_at)
}

// Riwayat pengerjaan kuis
export type HasilKuis = {
    id: string
    device_id: string
    kuis_id: string
    skor: number
    total_pertanyaan: number
    jawaban_benar: number
    jawaban_salah: number
    waktu_pengerjaan: number
    jawaban: any // JSON jawaban
    created_at: string
}

// Struktur data lengkap dari endpoint
export type KuisDetailData = {
    kuis: Kuis
    diselesaikan: number // 0 atau 1
    hasil_kuis: HasilKuis
}

// Respons API Laravel (opsional, jika mau validasi struktur)
interface KuisDetailResponse {
    success: boolean
    data: KuisDetailData
    message?: string
    code?: number
    timestamp?: string
}

/**
 * Hook untuk mengambil detail kuis berdasarkan ID kuis dan device_id
 */
export function useKuisDetailData(kuisId: string, deviceId: string) {
    const [data, setData] = useState<KuisDetailData | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchKuisDetail = useCallback(async () => {
        if (!kuisId || !deviceId) return

        setLoading(true)
        try {
            // ✅ Gunakan helper apiGet agar otomatis pakai BASE_URL dan X-API-KEY
            const response = await apiGet<KuisDetailResponse['data']>(
                `/v1/refleksi/kuis/${kuisId}/device/${deviceId}`
            )

            if (response) {
                setData(response)
            } else {
                console.warn('⚠️ Data kuis tidak ditemukan atau format tidak sesuai.')
                setData(null)
            }
        } catch (err) {
            console.error('❌ Failed to fetch kuis detail:', err)
            setData(null)
        } finally {
            setLoading(false)
        }
    }, [kuisId, deviceId])

    // Fetch pertama kali & saat ID berubah
    useEffect(() => {
        fetchKuisDetail()
    }, [fetchKuisDetail])

    // Fungsi manual refetch
    const refetch = useCallback(() => {
        fetchKuisDetail()
    }, [fetchKuisDetail])

    return { data, loading, refetch }
}
