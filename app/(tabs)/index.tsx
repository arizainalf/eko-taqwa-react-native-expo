import { View, Text, ScrollView, Pressable, RefreshControl } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useHomeData } from 'hooks/useHomeData';
import LoadingScreen from 'components/LoadingScreen';
import { useDevice } from 'context/deviceContext';

export function getGreeting(): string {
  const currentHour = new Date().getHours();

  if (currentHour >= 5 && currentHour < 10) {
    return "Selamat Pagi";
  } else if (currentHour >= 10 && currentHour < 15) {
    return "Selamat Siang";
  } else if (currentHour >= 15 && currentHour < 18) {
    return "Selamat Sore";
  } else {
    return "Selamat Malam";
  }
}

export default function HomeScreen() {
  const { data, loading, error, refetch } = useHomeData();
  const router = useRouter();
  const device = useDevice();

  const onRefresh = async () => {
    await refetch();
  };

  if (loading && !data) {
    return <LoadingScreen message="Memuat data aplikasi..." />;
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-5 bg-white">
        <Ionicons name="warning" size={48} color="#6B7280" />
        <Text className="text-lg font-bold text-gray-800 mt-4 mb-2">Gagal memuat data</Text>
        <Text className="text-sm text-gray-500 text-center mb-5">{error}</Text>
        <Pressable
          className="bg-green-600 px-5 py-3 rounded-lg active:bg-green-700"
          onPress={refetch}
        >
          <Text className="text-white text-base font-semibold">Coba Lagi</Text>
        </Pressable>
      </View>
    );
  }

  if (!data) return null;

  const { stats, active_kuis } = data;

  const formatTime = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}j ${m}m` : `${m}m`;
  };

  const quickStatsData = [
    {
      icon: 'clipboard-check-outline' as const,
      label: 'CP',
      value: stats.total_cp?.toString() || '0', // ✅ Perbaiki: pastikan string
      link: '/(tabs)/fase'
    },
    {
      icon: 'play-circle' as const,
      label: 'Media',
      value: stats.total_video?.toString() || '0',
      link: '/(tabs)/media'
    },
    {
      icon: 'scale-balance' as const,
      label: 'Kaidah',
      value: stats.total_kaidah?.toString() || '0',
      link: '/(tabs)/kaidah'
    },
    {
      icon: 'abjad-arabic' as const,
      label: 'Ayat & Hadist',
      value: stats.total_ayat_hadist?.toString() || '0',
      link: '/(tabs)/dalil'
    },
    {
      icon: 'help-circle' as const,
      label: 'Kuis',
      value: stats.total_kuis?.toString() || '0',
      link: '/refleksi/kuis'
    },
  ];

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={onRefresh}
          colors={['#16A34A']}
          tintColor="#16A34A"
        />
      }
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Header */}
      <View className="p-6 pt-10 pb-56 bg-green-600 rounded-b-2xl">
        <Text className="text-3xl font-bold text-white mb-1">Eko Taqwa</Text>
        <Text className="text-white text-base">{getGreeting() + ', ' + device.name}</Text>
      </View>

      {/* Quick Stats */}
      <View className="flex-row flex-wrap justify-between px-4 -mt-48 mb-6">
        {quickStatsData.map((item, i) => {
          const isLastRow = i >= 3;
          const widthClass = isLastRow ? 'w-[48%]' : 'w-[30%]';

          return (
            <Link key={item.icon} href={item.link} asChild>
              <Pressable className={`bg-white p-4 rounded-xl items-center shadow-md active:bg-gray-50 ${widthClass} ${i < 3 ? 'mb-4' : ''}`}>
                <MaterialCommunityIcons name={item.icon} size={28} color="#16A34A" />
                <Text className="text-green-700 font-bold text-xl mt-2">{item.value}</Text>
                <Text className="text-gray-500 text-xs font-medium mt-1 uppercase tracking-wide text-center">{item.label}</Text>
              </Pressable>
            </Link>
          );
        })}
      </View>

      {/* Video Hari Ini */}
      {stats.random_video && (
        <View className="px-4 mb-6">
          <Text className="text-xl font-bold text-gray-800 mb-3 px-1">Video Hari Ini</Text>
          <Pressable
            className="bg-white p-4 rounded-xl shadow-sm active:bg-gray-50"
            onPress={() => router.push(`/media/[jenisTemaId]/[temaId]/${stats.random_video?.id}`)}
          >
            <View className="flex-row justify-between items-start mb-2 space-x-3">
              <View className="flex-1">
                <Text className="text-base font-bold text-gray-900 leading-snug">
                  {stats.random_video.judul}
                </Text>
              </View>
              <View className="flex-row items-center bg-green-600 px-3 py-1 rounded-full space-x-1.5">
                <Ionicons name="play" size={14} color="white" />
                <Text className="text-white text-xs font-semibold">Tonton</Text>
              </View>
            </View>
            <Text className="text-gray-600 text-sm leading-5">{stats.random_video.deskripsi}</Text>
          </Pressable>
        </View>
      )}

      {/* Kuis Aktif */}
      {active_kuis.length > 0 && (
        <View className="px-4 mb-6">
          <View className="flex-row justify-between items-center mb-3 px-1">
            <Text className="text-xl font-bold text-gray-800">Kuis Aktif</Text>
            <Link href="/refleksi/kuis" asChild>
              <Pressable>
                <Text className="text-green-600 font-semibold text-sm">Lihat Semua</Text>
              </Pressable>
            </Link>
          </View>

          <View className="space-y-3">
            {active_kuis.map((kuis) => (
              <Pressable
                key={kuis.id} // ✅ DITAMBAH: key prop
                className="bg-white p-4 rounded-xl my-2 shadow-sm border border-gray-100 active:bg-gray-50"
                onPress={() => router.push(`/refleksi/kuis/${kuis.id}`)} // ✅ Diperbaiki
              >
                <View className="flex-row justify-between items-start mb-2 space-x-3">
                  <Text className="flex-1 text-lg font-bold text-gray-900">{kuis.judul}</Text>
                  <View className="bg-yellow-100 px-2 py-1 rounded-md">
                    <Text className="text-yellow-700 text-xs font-semibold">{formatTime(kuis.batas_waktu)}</Text>
                  </View>
                </View>
                <Text className="text-gray-600 text-sm leading-5 mb-3" numberOfLines={2}>{kuis.deskripsi}</Text>
                <View className="flex-row justify-between items-center mt-3 pt-3 border-t border-gray-100">
                  <View className="flex-row items-center space-x-1.5">
                    <Ionicons name="help-circle-outline" size={16} color="#6B7280" />
                    <Text className="text-gray-500 text-xs">{kuis.pertanyaan_count} Pertanyaan</Text>
                  </View>
                  <View className="flex-row items-center space-x-1.5">
                    <Text className="text-green-600 text-sm font-semibold">Mulai</Text>
                    <Ionicons name="arrow-forward" size={16} color="#059669" />
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}