// app/(tabs)/posts/index.tsx
import React, { useCallback, useRef } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import {
    View,
    Text,
    FlatList,
    Image,
    Pressable,
    ActivityIndicator,
    RefreshControl,
    Alert,
    ListRenderItem,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { usePostsData, Post } from 'hooks/ekoRefleksi/useRefleksiHarianData'
import { useDevice } from 'context/deviceContext'

export default function PostsScreen() {
    const router = useRouter()
    const { deviceId } = useDevice()
    const currentDeviceId = deviceId ?? ''

    const { posts, loading, refreshing, onRefresh, deletePost } = usePostsData(currentDeviceId)
    // pastikan hook usePostsData memiliki fungsi deletePost (kalau belum, bisa kita tambahkan nanti)

    const hasRefetched = useRef(false)

    useFocusEffect(
        useCallback(() => {
            if (!hasRefetched.current) {
                hasRefetched.current = true
                onRefresh()
            }
            return () => {
                hasRefetched.current = false
            }
        }, [])
    )

    const formatDate = useCallback((dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        })
    }, [])

    // 🔹 Fungsi hapus dengan konfirmasi
    const handleDelete = useCallback(
        (postId: string) => {
            Alert.alert(
                'Hapus Refleksi',
                'Apakah Anda yakin ingin menghapus refleksi ini?',
                [
                    { text: 'Batal', style: 'cancel' },
                    {
                        text: 'Hapus',
                        style: 'destructive',
                        onPress: async () => {
                            try {
                                await deletePost(postId)
                                onRefresh()
                            } catch (error) {
                                Alert.alert('Gagal', 'Terjadi kesalahan saat menghapus data. '+ error)
                            }
                        },
                    },
                ],
                { cancelable: true }
            )
        },
        [deletePost, onRefresh]
    )

    // 🔹 Render setiap item
    const renderItem: ListRenderItem<Post> = useCallback(
        ({ item }) => {
            const isMyDevice = item.device.device_id === currentDeviceId

            return (
                <Pressable
                    onPress={() => router.push(`/refleksi/refleksi_harian/${item.id}`)}
                    className="bg-white mx-4 my-2 rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                >
                    {/* Badge */}
                    {isMyDevice && (
                        <View className="bg-green-500 px-3 py-1 flex-row justify-between">
                            <View className='flex-row items-center'>
                                <Ionicons name="star" size={14} color="white" />
                                <Text className="text-white text-xs font-medium ml-1">
                                    Refleksi Anda
                                </Text>
                            </View>
                            <View className='space-x-4'>
                                    <View className="flex-row items-center justify-end space-x-4">
                                        <Pressable
                                            onPress={() =>
                                                router.push(`/refleksi/refleksi_harian/edit/${item.id}`)
                                            }
                                            className="flex-row items-center"
                                        >
                                            <Ionicons name="create-outline" size={18} color="#ffff" />
                                            <Text className="ml-1 text-white text-sm font-medium">
                                                Edit
                                            </Text>
                                        </Pressable>

                                        <Pressable
                                            onPress={() => handleDelete(item.id)}
                                            className="flex-row items-center ms-2 rounded p-2"
                                        >
                                            <Ionicons name="trash-outline" size={18} color="#ffff" />
                                            <Text className="ml-1 text-white text-sm font-medium">
                                                Hapus
                                            </Text>
                                        </Pressable>
                                    </View>
                            </View>
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

                    {/* Konten */}
                    <View className="p-4">
                        <Text className="text-lg font-bold text-gray-900 mb-2">{item.judul}</Text>

                        {item.deskripsi && (
                            <Text
                                className="text-gray-600 text-sm leading-5 mb-3"
                                numberOfLines={3}
                            >
                                {item.deskripsi}
                            </Text>
                        )}

                        {/* Info dan aksi */}
                        <View className="flex-row justify-between items-center mt-1">
                            <Text className="text-gray-400 text-xs">{formatDate(item.tanggal)}</Text>

                            <View className="flex-row items-center">
                                {isMyDevice && (
                                    <Ionicons
                                        name="person"
                                        size={14}
                                        color="#059669"
                                        className="mr-1"
                                    />
                                )}
                                <Text
                                    className={`text-xs ${isMyDevice ? 'text-green-600' : 'text-gray-500'
                                        }`}
                                >
                                    {isMyDevice ? 'Anda' : item.device.name}
                                </Text>
                            </View>
                        </View>
                    </View>
                </Pressable>
            )
        },
        [currentDeviceId, formatDate, handleDelete, router]
    )

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
            {/* Header */}
            <View className="h-96 pb-12 pt-6 px-6 bg-green-600 rounded-b-xl">
                <View className="flex-row items-center mt-5">
                    <Pressable onPress={() => router.back()} className="mr-4 px-1 -ml-1">
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

            {/* Daftar Refleksi */}
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
                    removeClippedSubviews={true}
                    maxToRenderPerBatch={8}
                    windowSize={11}
                    initialNumToRender={8}
                />
            </View>

            {/* Tombol Tambah */}
            <Pressable
                onPress={() => router.push('/refleksi/refleksi_harian/create')}
                className="absolute bottom-6 right-6 bg-green-600 w-14 h-14 rounded-full items-center justify-center shadow-lg"
                android_ripple={{ color: '#ffffff40', borderless: true }}
            >
                <Ionicons name="add" size={32} color="white" />
            </Pressable>
        </View>
    )
}
