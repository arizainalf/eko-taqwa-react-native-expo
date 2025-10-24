import { View, Text, Pressable, RefreshControl, ScrollView, Linking, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useMediaDetail } from 'hooks/ekoMedia/useMediaDetail'
// import { Colors } from 'constants/Colors' // [DIHAPUS] Import ini tidak terpakai
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

    // Fungsi getYouTubeVideoId Anda sudah sangat bagus.
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

    // Tampilan error sudah bagus.
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
                    className="bg-green-600 px-5 py-3 rounded-lg active:bg-green-700"
                    onPress={refetch}
                >
                    <Text className="text-white text-base font-semibold">Coba Lagi</Text>
                </Pressable>
            </View>
        )
    }

    return (
        <ScrollView
            // [DIUBAH] Latar belakang abu-abu konsisten
            className="flex-1 bg-gray-50"
            refreshControl={
                <RefreshControl
                    refreshing={loading}
                    onRefresh={onRefresh}
                    colors={['#16A34A']}
                    tintColor="#16A34A" // [DITAMBAH]
                />
            }
            contentContainerStyle={{ paddingBottom: 40 }} // [DITAMBAH]
        >
            {/* [DIUBAH] Header disamakan (h-96, padding) */}
            <View className="h-96 pb-12 pt-6 px-6 bg-green-600 rounded-b-2xl">
                <View className="flex-row items-center mt-5">
                    <Pressable
                        onPress={() => router.back()}
                        className="mr-4 px-1 -ml-1" // [DIUBAH]
                    >
                        <Ionicons name="arrow-back" size={28} color="white" />
                    </Pressable>

                    <View className="flex-1">
                        <Text className="text-2xl font-bold text-white mb-1">
                            Eko Media
                        </Text>
                        <Text className="text-base text-green-100" numberOfLines={1}>
                            {data?.tema?.nama}
                        </Text>
                    </View>

                </View>
            </View>

            {/* [DIUBAH] Kartu utama: 
                - Dihapus 'p-3'
                - Ditambah 'overflow-hidden' agar player pas
                - 'shadow-lg' jadi 'shadow-sm'
            */}
            <View className="mx-4 bg-white -mt-64 rounded-2xl shadow-sm overflow-hidden">

                {/* Player YouTube (Dibiarkan apa adanya, sudah bagus) */}
                <View className="w-full rounded-md overflow-hidden">
                    <YoutubeIframe
                        height={207}
                        play={isPlaying}
                        videoId={getYouTubeVideoId(data?.link)}
                        onChangeState={(event: any) => {
                            if (event === 'playing') setIsPlaying(true);
                            if (event === 'paused') setIsPlaying(false);
                        }}
                    />
                </View>

                {/* [DITAMBAH] Wrapper untuk padding konten teks & tombol */}
                <View className="p-4">

                    {/* [DIUBAH] Styling Judul & Deskripsi */}
                    <Text className="text-2xl font-bold text-gray-900 mb-2">
                        {data?.judul}
                    </Text>

                    <Text className="text-base text-gray-700 leading-6 mb-6">
                        {data?.deskripsi}
                    </Text>

                    {/* [DIUBAH] Layout Tombol */}
                    {data && data.link && (
                        <View className="flex-row space-x-3 gap-4">

                            {/* Tombol 1: Buka (Primary) */}
                            <Pressable
                                className="flex-1 flex-row items-center justify-center bg-green-600 p-3 rounded-lg space-x-2 active:bg-green-700"
                                onPress={() => openVideo(data.link)}
                            >
                                <Ionicons name="logo-youtube" size={20} color="white" />
                                <Text className="text-white ms-2 text-base font-bold">Buka</Text>
                            </Pressable>

                            {/* Tombol 2: Bagikan (Secondary) */}
                            <Pressable
                                className="flex-1 flex-row items-center justify-center bg-green-100 p-3 rounded-lg space-x-2 active:bg-green-200"
                                onPress={() => copyLink(data.link)} >
                                <Ionicons name="share-social" size={20} color="#059669" />
                                <Text className="text-green-700 ms-2 text-base font-bold">Bagikan</Text>
                            </Pressable>
                        </View>)}
                </View>
            </View>
        </ScrollView>
    )
}