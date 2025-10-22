import React from 'react'
import {
    View,
    Text,
    Pressable,
    ActivityIndicator,
    ScrollView,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useDevice } from 'context/deviceContext'
import { useKuisDetailData } from 'hooks/useKuisDetailData'

export default function KuisDetailScreen() {
    const router = useRouter()

    // 1. Ambil Kuis ID dari URL (cth: /kuis/123)
    const { id } = useLocalSearchParams()
    const kuisId = Array.isArray(id) ? id[0] : id

    // 2. Ambil Device ID dari Context
    const { deviceId } = useDevice()

    // 3. Fetch data menggunakan hook
    const { data, loading } = useKuisDetailData(kuisId ?? '', deviceId ?? '')

    // Tampilkan loading spinner
    if (loading) {
        return (
            <View className="flex-1 bg-gray-50 justify-center items-center">
                <ActivityIndicator size="large" color="#059669" />
                <Text className="mt-2 text-gray-500">Memuat detail kuis...</Text>
            </View>
        )
    }

    // Tampilkan jika data tidak ditemukan
    if (!data) {
        return (
            <View className="flex-1 bg-gray-50 justify-center items-center p-4">
                <Ionicons name="warning-outline" size={64} color="#9CA3AF" />
                <Text className="text-gray-500 text-lg mt-4 text-center">
                    Gagal memuat data kuis. Silakan coba lagi.
                </Text>
                <Pressable onPress={() => router.back()} className="mt-6">
                    <Text className="text-green-600 font-semibold">Kembali</Text>
                </Pressable>
            </View>
        )
    }

    // 4. Tentukan status kuis
    const kuis = data.kuis
    const isDone = data.diselesaikan > 0
    const lastResult = isDone ? data.hasil_kuis[0] : null // Ambil hasil terakhir

    // 5. Fungsi untuk navigasi ke halaman pengerjaan kuis
    // (Anda perlu membuat halaman ini, cth: /kuis/play/[id].tsx)
    const handleStartKuis = () => {
        if (kuisId) {
            // Arahkan ke halaman 'play' (dimana pertanyaan akan dimuat)
            router.push(`/kuis/play/${kuisId}`)
        }
    }

    return (
        <View className="flex-1 bg-gray-50">
            {/* HEADER (Sama seperti KuisScreen) */}
            <View className="h-96 pb-12 pt-6 px-6 bg-green-600 rounded-b-xl">
                <View className="flex-row items-center mt-5">
                    <Pressable
                        onPress={() => router.back()}
                        className="mr-4 px-1 -ml-1"
                    >
                        <Ionicons name="arrow-back" size={28} color="white" />
                    </Pressable>
                    <View className="flex-1">
                        <Text className="text-2xl font-bold text-white mb-1" numberOfLines={1}>
                            Detail Kuis
                        </Text>
                        <Text className="text-base text-green-100" numberOfLines={1}>
                            {kuis.judul}
                        </Text>
                    </View>
                </View>
            </View>

            {/* KONTEN (Kartu tumpang tindih) */}
            {/* Gunakan ScrollView karena kontennya statis, bukan list */}
            <ScrollView className="flex-1 -mt-64">
                {/* Kartu Detail Kuis */}
                <View className="bg-white mx-4 rounded-xl shadow-md p-6">
                    <Text className="text-xl font-bold text-gray-900 mb-3">{kuis.judul}</Text>
                    <Text className="text-base text-gray-600 leading-6">{kuis.deskripsi}</Text>
                </View>

                {/* Kartu Status Pengerjaan */}
                <View className="bg-white mx-4 rounded-xl shadow-md p-6 mt-4">
                    <Text className="text-lg font-semibold text-gray-800 mb-4">Status Anda</Text>
                    {isDone ? (
                        // --- Tampilan Jika SUDAH Mengerjakan ---
                        <View>
                            <View className="flex-row items-center bg-green-50 p-3 rounded-lg">
                                <Ionicons name="checkmark-circle" size={24} color="#059669" />
                                <Text className="text-base font-semibold text-green-700 ml-3">
                                    Anda sudah mengerjakan kuis ini
                                </Text>
                            </View>
                            {lastResult && (
                                <View className="mt-4">
                                    <Text className="text-sm text-gray-500 mb-1">Skor Terakhir:</Text>
                                    <Text className="text-3xl font-bold text-gray-800">
                                        {lastResult.jawaban_benar}
                                        <Text className="text-xl font-medium text-gray-500">
                                            / {lastResult.total_pertanyaan} Benar
                                        </Text>
                                    </Text>
                                </View>
                            )}
                        </View>
                    ) : (
                        // --- Tampilan Jika BELUM Mengerjakan ---
                        <View className="flex-row items-center bg-gray-100 p-3 rounded-lg">
                            <Ionicons name="information-circle-outline" size={24} color="#4B5563" />
                            <Text className="text-base font-semibold text-gray-700 ml-3">
                                Anda belum mengerjakan kuis ini
                            </Text>
                        </View>
                    )}
                </View>

                {/* Tombol Aksi (Mulai / Ulangi) */}
                <View className="mx-4 mt-6 mb-10">
                    <Pressable
                        onPress={handleStartKuis}
                        // Ganti warna tombol jika sudah selesai
                        className={`rounded-lg p-4 items-center justify-center shadow-md ${isDone ? 'bg-blue-600' : 'bg-green-600'
                            }`}
                        android_ripple={{ color: '#ffffff40' }}
                    >
                        <Text className="text-white text-lg font-bold">
                            {isDone ? 'Ulangi Kuis' : 'Mulai Kuis'}
                        </Text>
                    </Pressable>
                </View>

            </ScrollView>
        </View>
    )
}