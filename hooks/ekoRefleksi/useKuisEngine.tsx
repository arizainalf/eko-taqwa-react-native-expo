import { useState, useEffect, useCallback } from 'react'
import { HasilKuis } from './useKuisDetailData' // Asumsi tipe dari hook sebelumnya

const API_BASE_URL = 'https://ekotaqwa.bangkoding.my.id/api'

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

// Tipe untuk menyimpan jawaban
type JawabanMap = {
    [pertanyaanId: string]: string // cth: { "pertanyaan-uuid": "opsi-uuid" }
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
            const res = await fetch(`${API_BASE_URL}/v1/refleksi/kuis/${kuisId}/pertanyaan?offset=${offset}`)
            const data = await res.json()
            if (data.success) {
                setQuestionData(data.data)
            } else {
                // Kemungkinan kuis selesai (API mengembalikan 404)
                setQuestionData(null)
                // Jika tidak ada pertanyaan lagi, submit hasil
                await submitKuis()
            }
        } catch (err) {
            console.error('Gagal mengambil pertanyaan:', err)
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
            const res = await fetch(`${API_BASE_URL}/v1/refleksi/kuis`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    device_id: deviceId,
                    kuis_id: kuisId,
                    jawaban: jawaban,
                    waktu_pengerjaan: waktuPengerjaan,
                }),
            })
            const data = await res.json()
            if (data.success) {
                setFinalResult(data.data)
            } else {
                // --- 2. INI PERUBAHANNYA ---
                const errorMessage = data.message || 'Gagal menyimpan hasil: API tidak memberikan pesan.'
                // Tampilkan di log konsol Anda
                console.error('Kuis Submit Error (API):', errorMessage, data)
                setSubmitError(errorMessage) // Simpan pesan error ke state
            }
        } catch (err) {
            const errorMessage = (err as Error).message || 'Gagal terhubung ke server.'
            // Tampilkan di log konsol Anda
            console.error('Kuis Submit Error (Network/Parse):', err)
            setSubmitError(errorMessage) // Simpan pesan error ke state
        } finally {
            setIsSubmitting(false)
            setIsFinished(true) // Tampilkan layar hasil
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
            setStartTime(Date.now()) // Catat waktu mulai
            fetchNextQuestion(0) // Ambil pertanyaan pertama (offset 0)
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
    }
}