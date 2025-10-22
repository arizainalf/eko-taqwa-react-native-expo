import { useState, useEffect, useCallback } from 'react'

// URL API Anda
const API_BASE_URL = 'https://ekotaqwa.bangkoding.my.id/api'

// --- Tipe Data berdasarkan Controller 'kuisDetail' ---
// Tipe untuk objek kuis itu sendiri
export type Kuis = {
    id: string
    judul: string
    deskripsi: string
    // tambahkan properti lain jika ada (cth: created_at, dll)
}

// Tipe untuk riwayat pengerjaan
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

// Tipe untuk seluruh data yang dikembalikan
export type KuisDetailData = {
    kuis: Kuis
    diselesaikan: number // Cth: 0 atau 1
    hasil_kuis: HasilKuis[] // Array dari riwayat pengerjaan
}

export function useKuisDetailData(kuisId: string, deviceId: string) {
    const [data, setData] = useState<KuisDetailData | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchKuisDetail = useCallback(async () => {
        // Jangan fetch jika ID belum siap
        if (!kuisId || !deviceId) {
            return
        }

        try {
            setLoading(true)
            // Sesuai route: /kuis/{id}/device/{deviceId}
            const res = await fetch(`${API_BASE_URL}/kuis/${kuisId}/device/${deviceId}`)
            const responseData = await res.json()

            if (responseData?.success) {
                setData(responseData.data)
            } else {
                console.error('Failed to parse kuis detail:', responseData.message)
                setData(null)
            }
        } catch (err) {
            console.error('Failed to fetch kuis detail:', err)
            setData(null)
        } finally {
            setLoading(false)
        }
    }, [kuisId, deviceId])

    // Fetch data saat komponen dimuat atau ID berubah
    useEffect(() => {
        fetchKuisDetail()
    }, [fetchKuisDetail])

    // Kembalikan fungsi refetch jika diperlukan
    const refetch = () => {
        fetchKuisDetail()
    }

    return { data, loading, refetch }
}