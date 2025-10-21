// app/(tabs)/posts/[id].tsx
import React from 'react'
import {
    View,
    Text,
    Image,
    ScrollView,
    Pressable,
    ActivityIndicator,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { usePostDetail } from 'hooks/useRefleksiHarianDetail'
import { useDevice } from 'context/deviceContext'

export default function PostDetailScreen() {
    const router = useRouter()
    const { id } = useLocalSearchParams()
    const { post, loading } = usePostDetail(id as string)
    const { deviceId } = useDevice()
    const currentDeviceId = deviceId

    if (loading) {
        return (
            <View className="flex-1 bg-white justify-center items-center">
                <ActivityIndicator size="large" color="#059669" />
                <Text className="mt-2 text-gray-500">Memuat postingan...</Text>
            </View>
        )
    }

    if (!post) {
        return (
            <View className="flex-1 bg-white justify-center items-center">
                <Ionicons name="alert-circle" size={64} color="#9CA3AF" />
                <Text className="text-gray-500 text-lg mt-4">
                    Refleksi harian tidak ditemukan
                </Text>
                <Pressable
                    onPress={() => router.back()}
                    className="bg-green-600 px-6 py-3 rounded-full mt-6"
                >
                    <Text className="text-white font-medium">Kembali</Text>
                </Pressable>
            </View>
        )
    }

    const isMyDevice = post.device_id === currentDeviceId
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    }

    return (
        <View className="flex-1 bg-white">
            {/* HEADER */}
            <View className="pb-12 pt-6 px-6 bg-green-600 rounded-b-2xl">
                <View className="flex-row items-center mt-5">
                    <Pressable
                        onPress={() => router.back()}
                        className="mr-4 px-1 -ml-1"
                    >
                        <Ionicons name="arrow-back" size={28} color="white" />
                    </Pressable>
                    <View className="flex-1">
                        <Text className="text-2xl font-bold text-white mb-1">
                            Detail Refleksi Harian
                        </Text>
                        {isMyDevice && (
                            <View className="flex-row items-center">
                                <Ionicons name="star" size={14} color="#BBF7D0" />
                                <Text className="text-green-100 text-sm ml-1">
                                    Refleksi Harian Anda
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>

            {/* CONTENT */}
            <ScrollView
                className="flex-1 -mt-8"
                contentContainerStyle={{ paddingBottom: 20 }}
            >
                <View className="bg-white mx-4 rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Gambar */}
                    {post.gambar && (
                        <View className='p-4'>
                            <Image
                                source={{ uri: post.gambar }}
                                className="w-full h-64 rounded-md"
                                resizeMode="cover"
                            />
                        </View>
                    )}

                    {/* Content */}
                    <View className="p-6">
                        <Text className="text-2xl font-bold text-gray-900 mb-4">
                            {post.judul}
                        </Text>

                        {post.deskripsi && (
                            <Text className="text-gray-700 text-base leading-6 mb-6">
                                {post.deskripsi}
                            </Text>
                        )}

                        <View className="flex-row justify-between items-center pt-4 border-t border-gray-100">
                            <View>
                                <Text className="text-gray-500 text-sm mb-1">
                                    Diposting pada
                                </Text>
                                <Text className="text-gray-700 font-medium">
                                    {formatDate(post.tanggal)}
                                </Text>
                            </View>

                            <View className="items-end">
                                <Text className="text-gray-500 text-sm mb-1">
                                    Oleh
                                </Text>
                                <View className="flex-row items-center">
                                    {isMyDevice && (
                                        <Ionicons name="person" size={14} color="#059669" className="mr-1" />
                                    )}
                                    <Text className={`font-medium ${isMyDevice ? 'text-green-600' : 'text-gray-700'}`}>
                                        {isMyDevice ? 'Anda' : 'Pengguna Lain'}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}