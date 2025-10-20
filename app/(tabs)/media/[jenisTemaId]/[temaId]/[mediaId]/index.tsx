import { View, Text, Pressable, RefreshControl, ScrollView, Linking, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useMediaDetail } from 'hooks/useMediaDetail'
import { Colors } from 'constants/Colors'
import LoadingScreen from 'components/LoadingScreen'
import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router'
import YoutubeIframe from 'react-native-youtube-iframe'
import * as Clipboard from 'expo-clipboard';

export default function MediaDetail() {
    const router = useRouter()
    const { mediaId } = useLocalSearchParams<{ mediaId: string }>()
    const { data, loading, error, refetch } = useMediaDetail(mediaId)
    const [isPlaying, setIsPlaying] = useState(false);

    const openVideo = (link: string) => {
        Linking.openURL(link);
    };

    const copyLink = (link: string) => {
        Clipboard.setStringAsync(link);
        Alert.alert("Disalin", "Link video telah disalin ke clipboard.");
    };

    /**
 * Mengambil 11 karakter ID video YouTube dari berbagai format URL.
 * @param url URL video YouTube
 * @returns {string | null} ID video atau null jika tidak ditemukan.
 */
    function getYouTubeVideoId(url: string | undefined | null): string | null {
        if (!url) {
            return null;
        }
        const regex =
            /^(?:https?:\/\/)?(?:www\.)?(?:(?:youtube\.com\/(?:(?:watch\?v=)|(?:embed\/)|(?:live\/)))|(?:youtu\.be\/))([a-zA-Z0-9_-]{11})/;
        const match = url.match(regex);
        return match && match[1] ? match[1] : null;
    }

    if (loading && !data) {
        return <LoadingScreen message="Memuat media..." />
    }

    const onRefresh = async () => {
        await refetch()
    }

    if (error) {
        return (
            <View className="flex-1 justify-center items-center bg-white px-5">
                <Ionicons name="warning" size={48} color="#6B7280" />
                <Text className="mt-4 text-lg font-bold text-gray-900">
                    Gagal memuat data media
                </Text>
                <Text className="mt-2 text-sm text-gray-500 text-center mb-5">
                    {error}
                </Text>
                <Pressable
                    className="bg-green-600 px-5 py-3 rounded-lg"
                    onPress={refetch}
                >
                    <Text className="text-white text-base font-semibold">Coba Lagi</Text>
                </Pressable>
            </View>
        )
    }

    return (
        <ScrollView
            className="flex-1 bg-white"
            refreshControl={
                <RefreshControl
                    refreshing={loading}
                    onRefresh={onRefresh}
                    colors={['#16A34A']}
                />
            }
        >
            <View className="py-10 sm:h-60 h-96 px-6 bg-green-600 rounded-b-2xl">
                <View className="flex-row items-center">
                    <Pressable
                        onPress={() => router.back()}
                        className="mr-4 px-1"
                    >
                        <Ionicons name="arrow-back" size={28} color="white" />
                    </Pressable>

                    <View>
                        <Text className="text-2xl font-bold text-white mb-1">
                            Eko Media
                        </Text>
                        <Text className="text-base text-green-100">
                            {data?.tema?.nama}
                        </Text>
                    </View>

                </View>
            </View>

            <View className="p-3 mx-3 bg-white -mt-64 rounded-2xl shadow-lg">

                <View className="flex-1 bg-background">

                    <View className="w-full rounded-md overflow-hidden">
                        <YoutubeIframe
                            height={207} // Atur tinggi player
                            play={isPlaying} // Kontrol play/pause
                            videoId={getYouTubeVideoId(data?.link)} // Masukkan ID video
                            onChangeState={(event: any) => {
                                if (event === 'playing') setIsPlaying(true);
                                if (event === 'paused') setIsPlaying(false);
                            }}
                        />
                    </View>

                    <View>
                        <Text className="text-2xl font-bold text-text mb-4">
                            {data?.judul}
                        </Text>

                        <View className="h-px bg-gray-300 mb-1" />

                        <Text className="text-base text-textLight leading-[22px] mb-5">
                            {data?.deskripsi}
                        </Text>
                    </View>

                    {data && data.link && (
                        <View className="flex-row justify-between mb-4">
                            <Pressable
                                className="flex-row items-center bg-green-500 p-3 rounded-xl gap-2"
                                onPress={() => openVideo(data.link)}
                            >
                                <Ionicons name="logo-youtube" size={20} color="#FFFFFF" />
                                <Text className="text-white text-md font-bold">Buka di Aplikasi YouTube</Text>
                            </Pressable>
                            <Pressable
                                className="flex-row items-center bg-green-100 px-5 py-3 rounded-lg gap-2"
                                onPress={() => copyLink(data.link)} >
                                <Ionicons name="share-social" size={20} color={Colors.primary} />
                                <Text className="text-primary text-md font-semibold">Bagikan</Text>
                            </Pressable>
                        </View>
                    )}
                </View>
            </View>
        </ScrollView>
    )
}
