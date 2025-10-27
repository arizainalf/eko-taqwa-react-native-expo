import { useState, useEffect, useCallback, useRef } from 'react'
import { apiGet, apiPost } from 'utils/api'
import { HasilKuis } from './useKuisDetailData'

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

interface PertanyaanResponse {
    success: boolean
    data: PertanyaanData
}

interface SubmitKuisResponse {
    success: boolean
    data: HasilKuis
}

export function minutesToSeconds(minutes: number | string | null | undefined): number {
    if (!minutes) return 0

    const parsed = typeof minutes === 'string' ? parseFloat(minutes) : minutes
    if (isNaN(parsed) || parsed < 0) return 0

    return parsed * 60
}

export function useKuisEngine(kuisId: string, deviceId: string, durationMinutes?: number) {
    const [remainingTime, setRemainingTime] = useState(durationMinutes ?? 600) // default 10 menit

    useEffect(() => {
        if (durationMinutes) {
            setRemainingTime(minutesToSeconds(durationMinutes))
        }
    }, [durationMinutes])

    const [loading, setLoading] = useState(true)
    const [questionData, setQuestionData] = useState<PertanyaanData | null>(null)
    const [jawaban, setJawaban] = useState<JawabanMap>({})
    const [currentOffset, setCurrentOffset] = useState(0)
    const [startTime, setStartTime] = useState(0)

    const [isFinished, setIsFinished] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [finalResult, setFinalResult] = useState<HasilKuis | null>(null)
    const [submitError, setSubmitError] = useState<string | null>(null)

    const timerRef = useRef<NodeJS.Timeout | null>(null)
    const submitRef = useRef<(() => Promise<void>) | null>(null)

    // --- Fetch Soal ---
    const fetchNextQuestion = useCallback(async (offset: number) => {
        setLoading(true)
        try {
            const data = await apiGet(`/v1/refleksi/kuis/${kuisId}/pertanyaan?offset=${offset}`) as PertanyaanResponse['data']
            if (data) {
                setQuestionData(data)
            } else {
                setQuestionData(null)
                await submitRef.current?.()
            }
        } catch (err) {
            console.error('Gagal mengambil pertanyaan:', err)
            setQuestionData(null)
            await submitRef.current?.()
        } finally {
            setLoading(false)
        }
    }, [kuisId])

    // --- Pilih Jawaban ---
    const selectAnswer = (pertanyaanId: string, opsiId: string) => {
        setJawaban(prev => ({ ...prev, [pertanyaanId]: opsiId }))
    }

    // --- Submit Kuis ---
    const submitKuis = useCallback(async () => {
        if (isSubmitting || isFinished) return

        setIsSubmitting(true)
        setSubmitError(null)

        const waktuPengerjaan = Math.floor((Date.now() - startTime) / 1000)
        try {
            const data = await apiPost('/v1/refleksi/kuis', {
                device_id: deviceId,
                kuis_id: kuisId,
                jawaban,
                waktu_pengerjaan: waktuPengerjaan,
            }) as SubmitKuisResponse['data']

            setFinalResult(data ?? null)
        } catch (err) {
            setSubmitError((err as Error).message || 'Gagal terhubung ke server.')
        } finally {
            setIsSubmitting(false)
            setIsFinished(true)
            if (timerRef.current) clearInterval(timerRef.current)
        }
    }, [deviceId, kuisId, jawaban, startTime, isSubmitting, isFinished])

    // simpan ke ref agar tidak trigger rerender loop
    useEffect(() => {
        submitRef.current = submitKuis
    }, [submitKuis])

    // --- Timer Countdown ---
    useEffect(() => {
        if (!kuisId || !deviceId) return
        setStartTime(Date.now())
        fetchNextQuestion(0)

        timerRef.current = setInterval(() => {
            setRemainingTime(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current!)
                    submitRef.current?.()
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
        }
    }, [kuisId, deviceId, fetchNextQuestion]) // ← dependensi minimal

    // --- Next Question ---
    const handleNextQuestion = () => {
        if (!questionData) return
        const isLast = questionData.nomor === questionData.total
        if (isLast) {
            submitRef.current?.()
        } else {
            const nextOffset = currentOffset + 1
            setCurrentOffset(nextOffset)
            fetchNextQuestion(nextOffset)
        }
    }

    return {
        loading,
        questionData,
        jawaban,
        selectAnswer,
        handleNextQuestion,
        isFinished,
        isSubmitting,
        finalResult,
        submitError,
        remainingTime,
    }
}
