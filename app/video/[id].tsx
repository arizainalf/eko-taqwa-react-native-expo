import { View, Text, Pressable, Linking } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Colors } from 'constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

// 1. Import library yang baru diinstal
import YoutubeIframe from 'react-native-youtube-iframe';

export default function VideoDetailScreen() {
    const { id } = useLocalSearchParams();
    const [isPlaying, setIsPlaying] = useState(false);

    // Mock data video
    const videoData = {
        id: id as string,
        judul: 'Video perferendis sint',
        deskripsi: 'Et et id omnis fugit sunt quidem.',
        // 2. Kita butuh Video ID-nya saja
        videoId: 'KEkPwpfF6Fo', // Diambil dari link: https://youtu.be/KEkPwpfF6Fo
        link: 'https://youtu.be/KEkPwpfF6Fo?si=BH6e5AHoHi6p0I5c',
    };

    const openVideo = () => {
        Linking.openURL(videoData.link);
    };

    return (
        <View className="flex-1 bg-background">

            <View className="w-full">
                <YoutubeIframe
                    height={250} // Atur tinggi player
                    play={isPlaying} // Kontrol play/pause
                    videoId={videoData.videoId} // Masukkan ID video
                    onChangeState={(event: any) => {
                        if (event === 'playing') setIsPlaying(true);
                        if (event === 'paused') setIsPlaying(false);
                    }}
                />
            </View>

            <View className="p-5">
                <Text className="text-2xl font-bold text-text mb-3">
                    {videoData.judul}
                </Text>
                <Text className="text-base text-textLight leading-[22px] mb-6">
                    {videoData.deskripsi}
                </Text>

                {/* Tombol ini sekarang bisa jadi opsional, atau tetap ada */}
                <Pressable
                    className="flex-row items-center justify-center bg-primary p-4 rounded-xl gap-2 mb-6"
                    onPress={openVideo}
                >
                    <Ionicons name="logo-youtube" size={20} color="#FFFFFF" />
                    <Text className="text-white text-lg font-bold">Buka di Aplikasi YouTube</Text>
                </Pressable>

                <View className="flex-row justify-around">
                    {/* ... sisa kode tombol ... */}
                    <Pressable className="flex-row items-center bg-green-50 px-5 py-3 rounded-lg gap-2">
                        <Ionicons name="download" size={20} color={Colors.primary} />
                        <Text className="text-primary text-sm font-semibold">Download</Text>
                    </Pressable>

                    <Pressable className="flex-row items-center bg-green-50 px-5 py-3 rounded-lg gap-2">
                        <Ionicons name="share-social" size={20} color={Colors.primary} />
                        <Text className="text-primary text-sm font-semibold">Bagikan</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}