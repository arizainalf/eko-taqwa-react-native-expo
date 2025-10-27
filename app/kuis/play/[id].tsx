import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  ScrollView,
  DimensionValue,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useDevice } from 'context/deviceContext'
import { useKuisEngine } from 'hooks/ekoRefleksi/useKuisEngine'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useKuisDetailData } from 'hooks/ekoRefleksi/useKuisDetailData'

export default function KuisPlayScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams()
  const kuisId = (Array.isArray(id) ? id[0] : id) ?? ''

  
  const { deviceId } = useDevice()

  const {data} = useKuisDetailData(kuisId, deviceId ?? '')

  const {
    loading,
    questionData,
    jawaban,
    selectAnswer,
    handleNextQuestion,
    isFinished,
    isSubmitting,
    finalResult,
    remainingTime,
  } = useKuisEngine(kuisId, deviceId ?? '', data?.kuis.batas_waktu)

  // BLINK logic: toggle setiap 500ms kalau sisa <= 10
  const [blinkOn, setBlinkOn] = useState(true)
  useEffect(() => {
    let iv: ReturnType<typeof setInterval> | null = null

    if (remainingTime > 0 && remainingTime <= 10) {
      // start blink
      setBlinkOn(true) // pastikan visible awalnya
      iv = setInterval(() => {
        setBlinkOn((v) => !v)
      }, 500)
    } else {
      // pastikan visible / normal kalau bukan kondisi blink
      setBlinkOn(true)
    }

    return () => {
      if (iv) clearInterval(iv)
    }
  }, [remainingTime])

  // helper format mm:ss
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, '0')
    const s = (sec % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  // 1. Tampilan Saat Selesai & Mengirim
  if (isFinished || isSubmitting) {
    return (
      <SafeAreaView className="flex-1 bg-green-600 justify-center items-center p-6">
        {isSubmitting ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <View className="items-center">
            <Ionicons name="trophy" size={80} color="white" />
            <Text className="text-3xl font-bold text-white mt-4">Kuis Selesai!</Text>
            {finalResult ? (
              <View className="items-center mt-6">
                <Text className="text-lg text-green-100">Skor Anda:</Text>
                <Text className="text-6xl font-bold text-white">
                  {finalResult.jawaban_benar}
                  <Text className="text-3xl text-green-100">/ {finalResult.total_pertanyaan}</Text>
                </Text>
              </View>
            ) : (
              <Text className="text-lg text-green-100 mt-2">Gagal menyimpan skor.</Text>
            )}
            <Pressable
              onPress={() => router.back()}
              className="bg-white rounded-full px-10 py-3 mt-10"
            >
              <Text className="text-green-600 text-lg font-bold">Selesai</Text>
            </Pressable>
          </View>
        )}
      </SafeAreaView>
    )
  }

  // 2. Tampilan Saat Loading Soal
  if (loading || !questionData) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#059669" />
      </SafeAreaView>
    )
  }

  // 3. Tampilan Utama Kuis (Saat Mengerjakan)
  const { nomor, total, pertanyaan } = questionData
  const progress = `${(nomor / total) * 100}%`
  const isAnswered = jawaban[pertanyaan.id] != null

  // warna & efek untuk timer: normal hijau, <=10 detik berubah merah dan kedip
  const timerColor =
    remainingTime <= 10 ? (blinkOn ? '#DC2626' /* red-600 */ : 'transparent') : '#16A34A' /* green-600 */

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        {/* Progress Bar + Timer */}
        <View className="px-5 pt-4">
          <View className="flex-row justify-between mb-2 items-center">
            <Text className="text-gray-500">Pertanyaan {nomor} dari {total}</Text>

            <View className="flex-row items-center space-x-2">
              {/* Icon kecil */}
              <Ionicons name="time" size={18} color={remainingTime <= 10 ? '#DC2626' : '#16A34A'} />
              {/* Timer text: gunakan style inline untuk opacity/color blink */}
              <Text
                style={{
                  color: timerColor,
                  fontWeight: '700',
                  // optional: sedikit scale saat <=10 agar terasa 'urgent'
                  transform: remainingTime <= 10 && blinkOn ? [{ scale: 1.04 }] : [{ scale: 1 }],
                }}
                className="text-base"
              >
                ⏱ {formatTime(remainingTime)}
              </Text>
            </View>
          </View>

          <View className="w-full h-2 bg-gray-200 rounded-full">
            <View style={{ width: progress as DimensionValue }} className="h-2 bg-green-600 rounded-full" />
          </View>
        </View>

        <ScrollView contentContainerStyle={{ padding: 20 }}>
          {/* Soal Pertanyaan */}
          <Text className="text-2xl font-bold text-gray-900 mt-4 leading-9">
            {pertanyaan.teks_pertanyaan}
          </Text>

          {/* Pilihan Jawaban */}
          <View className="mt-8 space-y-4">
            {pertanyaan.opsi.map((opsi) => {
              const isSelected = jawaban[pertanyaan.id] === opsi.id
              return (
                <Pressable
                  key={opsi.id}
                  onPress={() => selectAnswer(pertanyaan.id, opsi.id)}
                  className={`border-2 mb-2 rounded-lg p-4 ${isSelected ? 'border-green-600 bg-green-50' : 'border-gray-200 bg-gray-50'}`}
                >
                  <Text className={`text-base ${isSelected ? 'font-bold text-green-700' : 'text-gray-700'}`}>
                    {opsi.jawaban}
                  </Text>
                </Pressable>
              )
            })}
          </View>
        </ScrollView>

        {/* Tombol Navigasi Bawah */}
        <View className="p-5 border-t border-gray-200">
          <Pressable
            onPress={handleNextQuestion}
            disabled={!isAnswered}
            className={`rounded-lg p-4 items-center justify-center ${isAnswered ? 'bg-green-600' : 'bg-gray-300'}`}
          >
            <Text className="text-white text-lg font-bold">
              {questionData.nomor === questionData.total ? 'Selesai & Kirim' : 'Selanjutnya'}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  )
}
