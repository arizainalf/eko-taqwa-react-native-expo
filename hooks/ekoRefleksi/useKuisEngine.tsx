import { useState, useEffect, useCallback } from 'react'
import { apiGet, apiPost } from 'utils/api' // Import utils API
import { HasilKuis } from './useKuisDetailData' // Asumsi tipe dari hook sebelumnya

// --- Tipe Data berdasarkan Controller 'pertanyaan' ---
type OpsiPertanyaan = {
    id: string
    jawaban: string
}

type Pertanyaan = {
    id: string
    teks_pertanyaan: string
    poin: number
    opsi: OpsiPertanyaan[]
}

type PertanyaanData = {
    nomor: number
    total: number
    pertanyaan: Pertanyaan
}

type JawabanMap = {
    [pertanyaanId: string]: string
}

// Interface untuk API responses
interface PertanyaanResponse {
    success: boolean
    data: PertanyaanData
    message?: string
}

interface SubmitKuisResponse {
    success: boolean
    data: HasilKuis
    message?: string
}

export function useKuisEngine(kuisId: string, deviceId: string) {
    const [loading, setLoading] = useState(true)
    const [questionData, setQuestionData] = useState<PertanyaanData | null>(null)
    const [jawaban, setJawaban] = useState<JawabanMap>({})
    const [currentOffset, setCurrentOffset] = useState(0)
    const [startTime, setStartTime] = useState(0)

    const [isFinished, setIsFinished] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [finalResult, setFinalResult] = useState<HasilKuis | null>(null)
    const [submitError, setSubmitError] = useState<string | null>(null)

    // 1. Fungsi untuk mengambil pertanyaan
    const fetchNextQuestion = useCallback(async (offset: number) => {
        setLoading(true)
        try {
            // Route: /kuis/{id}/pertanyaan?offset=...
            const data = await apiGet(`/v1/refleksi/kuis/${kuisId}/pertanyaan?offset=${offset}`) as PertanyaanResponse['data']

            if (data) {
                setQuestionData(data)
            } else {
                // Kemungkinan kuis selesai (API mengembalikan 404)
                setQuestionData(null)
                // Jika tidak ada pertanyaan lagi, submit hasil
                await submitKuis()
            }
        } catch (err) {
            console.error('Gagal mengambil pertanyaan:', err)
            // Handle error case - mungkin kuis sudah selesai
            if ((err as Error).message.includes('404') || (err as Error).message.includes('tidak ditemukan')) {
                setQuestionData(null)
                await submitKuis()
            }
        } finally {
            setLoading(false)
        }
    }, [kuisId])

    // 2. Fungsi untuk menyimpan jawaban
    const selectAnswer = (pertanyaanId: string, opsiId: string) => {
        setJawaban(prev => ({
            ...prev,
            [pertanyaanId]: opsiId,
        }))
    }

    // 3. Fungsi untuk mengirim semua jawaban ke API
    const submitKuis = async () => {
        setIsSubmitting(true)
        setSubmitError(null)
        const waktuPengerjaan = Math.floor((Date.now() - startTime) / 1000) // dalam detik

        try {
            // Route: POST /kuis
            const data = await apiPost('/v1/refleksi/kuis', {
                device_id: deviceId,
                kuis_id: kuisId,
                jawaban: jawaban,
                waktu_pengerjaan: waktuPengerjaan,
            }) as SubmitKuisResponse['data']

            if (data) {
                setFinalResult(data)
            } else {
                const errorMessage = data || 'Gagal menyimpan hasil: API tidak memberikan pesan.'
                console.error('Kuis Submit Error (API):', errorMessage, data)
                setSubmitError(errorMessage)
            }
        } catch (err) {
            const errorMessage = (err as Error).message || 'Gagal terhubung ke server.'
            console.error('Kuis Submit Error (Network/Parse):', err)
            setSubmitError(errorMessage)
        } finally {
            setIsSubmitting(false)
            setIsFinished(true)
        }
    }

    // 4. Fungsi untuk tombol "Selanjutnya"
    const handleNextQuestion = () => {
        if (!questionData) return

        const isLastQuestion = questionData.nomor === questionData.total
        if (isLastQuestion) {
            submitKuis()
        } else {
            const nextOffset = currentOffset + 1
            setCurrentOffset(nextOffset)
            fetchNextQuestion(nextOffset)
        }
    }

    // 5. Load pertanyaan pertama saat hook dijalankan
    useEffect(() => {
        if (kuisId && deviceId) {
            setStartTime(Date.now())
            fetchNextQuestion(0)
        }
    }, [kuisId, deviceId, fetchNextQuestion])

    return {
        loading,
        questionData,
        jawaban,
        selectAnswer,
        handleNextQuestion,
        isFinished,
        isSubmitting,
        finalResult,
        submitError, // Export submitError juga untuk ditampilkan di UI
    }
}