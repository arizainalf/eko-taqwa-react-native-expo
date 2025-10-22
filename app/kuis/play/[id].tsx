import React from 'react'
import {
    View,
    Text,
    Pressable,
    ActivityIndicator,
    ScrollView,
    DimensionValue
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useDevice } from 'context/deviceContext'
import { useKuisEngine } from 'hooks/useKuisEngine'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function KuisPlayScreen() {
    const router = useRouter()
    const { id } = useLocalSearchParams()
    const kuisId = (Array.isArray(id) ? id[0] : id) ?? ''

    const { deviceId } = useDevice()

    const {
        loading,
        questionData,
        jawaban,
        selectAnswer,
        handleNextQuestion,
        isFinished,
        isSubmitting,
        finalResult,
    } = useKuisEngine(kuisId, deviceId ?? '')

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
                                    <Text className="text-3xl text-green-100">
                                        / {finalResult.total_pertanyaan}
                                    </Text>
                                </Text>
                            </View>
                        ) : (
                            <Text className="text-lg text-green-100 mt-2">Gagal menyimpan skor.</Text>
                        )}
                        <Pressable
                            // Ganti navigasi kembali ke list kuis (di dalam tabs)
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

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1">
                {/* Progress Bar */}
                <View className="px-5 pt-4">
                    <Text className="text-gray-500 mb-2 text-right">
                        Pertanyaan {nomor} dari {total}
                    </Text>
                    <View className="w-full h-2 bg-gray-200 rounded-full">
                        <View style={{ width: progress as DimensionValue }}
                            className="h-2 bg-green-600 rounded-full"
                        />
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
                                    className={`border-2 mb-2 rounded-lg p-4 ${isSelected
                                        ? 'border-green-600 bg-green-50'
                                        : 'border-gray-200 bg-gray-50'
                                        }`}
                                >
                                    <Text className={`text-base ${isSelected ? 'font-bold text-green-700' : 'text-gray-700'
                                        }`}>
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
                        disabled={!isAnswered} // Tombol disable jika belum dijawab
                        className={`rounded-lg p-4 items-center justify-center ${isAnswered ? 'bg-green-600' : 'bg-gray-300'
                            }`}
                    >
                        <Text className="text-white text-lg font-bold">
                            {questionData.nomor === questionData.total ? 'Selesai & Kirim' : 'Selanjutnya'}
                        </Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView >
    )
}