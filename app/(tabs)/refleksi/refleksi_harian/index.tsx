// app/(tabs)/posts/index.tsx
import React, { useCallback } from 'react'
import {
    View,
    Text,
    FlatList,
    Image,
    Pressable,
    ActivityIndicator,
    RefreshControl,
    ListRenderItem,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { usePostsData, Post } from 'hooks/useRefleksiHarianData'
import { useDevice } from 'context/deviceContext'

export default function PostsScreen() {
    const router = useRouter()
    const { deviceId } = useDevice()

    const currentDeviceId = deviceId ?? '' // Ganti dengan device_id user saat ini
    const { posts, loading, refreshing, onRefresh } = usePostsData(currentDeviceId)

    // Format tanggal menjadi readable
    const formatDate = useCallback((dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    }, [])

    // Render item dengan prioritas indicator
    const renderItem: ListRenderItem<Post> = useCallback(({ item }) => {
        const isMyDevice = item.device.device_id === currentDeviceId

        return (
            <Pressable
                onPress={() => router.push(`/refleksi/refleksi_harian/${item.id}`)}
                className="bg-white mx-4 my-2 rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
                {/* Priority Badge */}
                {isMyDevice && (
                    <View className="bg-green-500 px-3 py-1 flex-row items-center">
                        <Ionicons name="star" size={14} color="white" />
                        <Text className="text-white text-xs font-medium ml-1">
                            Refleksi Anda
                        </Text>
                    </View>
                )}

                {/* Gambar */}
                {item.gambar && (
                    <Image
                        source={{ uri: item.gambar }}
                        className="w-full h-48"
                        resizeMode="cover"
                    />
                )}

                {/* Content */}
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

                    <View className="flex-row justify-between items-center">
                        <Text className="text-gray-400 text-xs">
                            {formatDate(item.tanggal)}
                        </Text>
                        <View className="flex-row items-center">
                            {isMyDevice && (
                                <Ionicons name="person" size={14} color="#059669" className="mr-1" />
                            )}
                            <Text className={`text-xs ${isMyDevice ? 'text-green-600' : 'text-gray-500'}`}>
                                {isMyDevice ? 'Anda' : item.device.name}
                            </Text>
                        </View>
                    </View>
                </View>
            </Pressable>
        )
    }, [currentDeviceId, formatDate])

    const keyExtractor = useCallback((item: Post) => item.id, [])

    if (loading) {
        return (
            <View className="flex-1 bg-gray-50 justify-center items-center">
                <ActivityIndicator size="large" color="#059669" />
                <Text className="mt-2 text-gray-500">Memuat refleksi harian...</Text>
            </View>
        )
    }

    return (
        <View className="flex-1 bg-gray-50">
            {/* HEADER */}
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
                            Refleksi Harian
                        </Text>
                        <Text className="text-base text-green-100">
                            Lihat semua refleksi harian terbaru
                        </Text>
                    </View>
                </View>
            </View>

            {/* POSTS LIST */}
            <View className="flex-1 -mt-64 bg-white mx-4 rounded-xl">
                <FlatList
                    data={posts}
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
                        paddingVertical: 10,
                        paddingBottom: 20,
                    }}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View className="flex-1 justify-center items-center py-20">
                            <Ionicons name="document-text" size={64} color="#9CA3AF" />
                            <Text className="text-gray-500 text-lg mt-4">
                                Belum ada refleksi harian
                            </Text>
                        </View>
                    }
                    // Performance optimizations
                    removeClippedSubviews={true}
                    maxToRenderPerBatch={8}
                    windowSize={11}
                    initialNumToRender={8}
                />
            </View>
            <Pressable
                // Arahkan ke halaman create
                onPress={() => router.push('/refleksi/refleksi_harian/create')}
                // Styling untuk membuatnya melayang
                className="absolute bottom-6 right-6 bg-green-600 w-14 h-14 rounded-full items-center justify-center shadow-lg"
                // Efek ripple di Android
                android_ripple={{ color: '#ffffff40', borderless: true }}
            >
                <Ionicons name="add" size={32} color="white" />
            </Pressable>
        </View>
    )
}