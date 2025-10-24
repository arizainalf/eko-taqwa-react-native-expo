// app/(tabs)/kuis/index.tsx
import React, { useCallback } from 'react'
import {
    View,
    Text,
    FlatList,
    Pressable,
    ActivityIndicator,
    RefreshControl,
    ListRenderItem,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useKuisData, KuisItem } from 'hooks/ekoRefleksi/useKuisData' // <-- Gunakan hook baru

export default function KuisScreen() {
    const router = useRouter()
    // Hook baru tidak memerlukan deviceId untuk list
    const { data, loading, refreshing, onRefresh } = useKuisData()

    // Render item kuis
    const renderItem: ListRenderItem<KuisItem> = useCallback(({ item }) => {
        return (
            <Pressable
                // Arahkan ke halaman detail kuis
                onPress={() => router.push(`/refleksi/kuis/${item.id}`)}
                className="bg-white mx-4 my-2 rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
                {/* Content Kuis */}
                <View className="p-4">
                    <Text className="text-lg font-bold text-gray-900 mb-2">
                        {item.judul}
                    </Text>

                    {item.deskripsi && (
                        <Text
                            className="text-gray-600 text-sm leading-5 mb-3"
                            numberOfLines={3}
                        >
                            {item.deskripsi}
                        </Text>
                    )}

                    {/* Info Jumlah Pertanyaan (Pengganti Tgl/Author) */}
                    <View className="flex-row items-center mt-3 pt-3 border-t border-gray-100">
                        <Ionicons name="help-circle-outline" size={16} color="#6B7280" />
                        <Text className="text-gray-500 text-xs ml-1.5">
                            {item.pertanyaan_count} Pertanyaan
                        </Text>
                    </View>
                </View>
            </Pressable>
        )
    }, [])

    const keyExtractor = useCallback((item: KuisItem) => item.id, [])

    if (loading) {
        return (
            <View className="flex-1 bg-gray-50 justify-center items-center">
                <ActivityIndicator size="large" color="#059669" />
                <Text className="mt-2 text-gray-500">Memuat kuis...</Text>
            </View>
        )
    }

    return (
        <View className="flex-1 bg-gray-50">
            {/* HEADER (Sama seperti PostsScreen) */}
            <View className="h-96 pb-12 pt-6 px-6 bg-green-600 rounded-b-xl">
                <View className="flex-row items-center mt-5">
                    <Pressable
                        onPress={() => router.back()}
                        className="mr-4 px-1 -ml-1"
                    >
                        <Ionicons name="arrow-back" size={28} color="white" />
                    </Pressable>
                    <View>
                        <Text className="text-2xl font-bold text-white mb-1">
                            Daftar Kuis
                        </Text>
                        <Text className="text-base text-green-100">
                            Uji pemahaman Anda melalui kuis berikut
                        </Text>
                    </View>
                </View>
            </View>

            {/* KUIS LIST (Kartu tumpang tindih) */}
            <View className="flex-1 -mt-64 bg-white mx-4 rounded-xl overflow-hidden">

                {/* Header Statistik Kuis */}
                <View className="flex-row justify-around py-4 border-b border-gray-100 bg-gray-50">
                    <View className="items-center px-4">
                        <Text className="text-2xl font-bold text-green-600">
                            {data?.total_kuis ?? 0}
                        </Text>
                        <Text className="text-sm text-gray-500 mt-1">Total Kuis</Text>
                    </View>
                    <View className="border-l border-gray-200" />
                    <View className="items-center px-4">
                        <Text className="text-2xl font-bold text-green-600">
                            {data?.total_hasil_kuis ?? 0}
                        </Text>
                        <Text className="text-sm text-gray-500 mt-1">Total Pengerjaan</Text>
                    </View>
                </View>

                <FlatList
                    data={data?.kuis} // <-- Ambil list kuis dari data
                    keyExtractor={keyExtractor}
                    renderItem={renderItem}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#059669']}
                            tintColor="#059669"
                        />
                    }
                    contentContainerStyle={{
                        paddingBottom: 20,
                    }}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View className="flex-1 justify-center items-center py-20">
                            <Ionicons name="document-text" size={64} color="#9CA3AF" />
                            <Text className="text-gray-500 text-lg mt-4">
                                Belum ada kuis tersedia
                            </Text>
                        </View>
                    }
                    // Optimasi (sama seperti di PostsScreen)
                    removeClippedSubviews={true}
                    maxToRenderPerBatch={8}
                    windowSize={11}
                    initialNumToRender={8}
                />
            </View>
            {/* Tidak ada FAB (tombol +) karena API tidak menyediakan create kuis */}
        </View>
    )
}