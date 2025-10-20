import { View, Text, ScrollView, Pressable, RefreshControl } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useHomeData } from 'hooks/useHomeData';
import LoadingScreen from 'components/LoadingScreen';
import StatCard from 'components/StatCard';

export default function HomeScreen() {
  const { data, loading, error, refetch } = useHomeData();
  const router = useRouter();

  const onRefresh = async () => {
    await refetch();
  };

  if (loading && !data) {
    return <LoadingScreen message="Memuat data aplikasi" />;
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-5 bg-white">
        <Ionicons name="warning" size={48} color="#6B7280" />
        <Text className="text-lg font-bold text-gray-800 mt-4 mb-2">Gagal memuat data</Text>
        <Text className="text-sm text-gray-500 text-center mb-5">{error}</Text>
        <Pressable className="bg-green-600 px-5 py-3 rounded-lg" onPress={refetch}>
          <Text className="text-white text-base font-semibold">Coba Lagi</Text>
        </Pressable>
      </View>
    );
  }

  const { stats, featured_tema, active_kuis } = data!;
  const navigateToTema = (id: string) => router.push(`/tema/${id}`);
  const navigateToKuis = (id: string) => router.push(`/kuis/${id}`);
  const navigateToVideo = (id: string) => router.push(`/video/${id}`);

  const formatTime = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}j ${m}m` : `${m}m`;
  };

  return (
    <ScrollView
      className="flex-1 bg-white"
      refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} colors={['#16A34A']} />}
    >
      {/* Header */}
      <View className="p-10 bg-green-600 rounded-b-2xl">
        <Text className="text-2xl font-bold text-white mb-1">Eko Taqwa</Text>
        <Text className="text-green-100 text-base mb-2">Belajar dan uji pengetahuan ekologimu</Text>
      </View>

      {/* Quick Stats */}
      <View className="flex-row justify-between p-5 -mt-14">
        {[
          { icon: 'layers', label: 'Tema', value: stats.total_tema, link: '/tema' },
          { icon: 'help-circle', label: 'Kuis', value: stats.total_kuis, link: '/kuis' },
          { icon: 'play-circle', label: 'Video', value: stats.total_video },
        ].map((item, i) => (
          <Link key={i} href={item.link || '#'} asChild>
            <Pressable className="flex-1 bg-white mx-1 p-4 rounded-xl items-center shadow-xl">
              <Ionicons name={item.icon as any} size={24} color="#16A34A" />
              <Text className="text-green-600 font-bold text-lg mt-2">{item.value}</Text>
              <Text className="text-gray-500 text-xs mt-1">{item.label}</Text>
            </Pressable>
          </Link>
        ))}
      </View>

      {/* Video Hari Ini */}
      {stats.random_video && (
        <View className="p-5">
          <Text className="text-xl font-bold text-gray-800 mb-3">Video Hari Ini</Text>
          <Pressable
            className="bg-white p-4 rounded-xl shadow-lg"
            onPress={() => navigateToVideo(stats.random_video!.id)}
          >
            <View className="flex-row justify-between items-center mb-2">
              <Text className="flex-1 text-base font-bold text-gray-900 mr-3">
                {stats.random_video.judul}
              </Text>
              <View className="flex-row items-center bg-green-600 px-3 py-1.5 rounded-md">
                <Ionicons name="play" size={14} color="white" />
                <Text className="text-white text-xs font-semibold ml-1">Tonton</Text>
              </View>
            </View>
            <Text className="text-gray-500 text-sm leading-5">{stats.random_video.deskripsi}</Text>
          </Pressable>
        </View>
      )}

      {/* Tema Unggulan */}
      <View className="p-5">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-bold text-gray-800">Tema Unggulan</Text>
          <Link href="/tema" asChild>
            <Pressable>
              <Text className="text-green-600 font-semibold text-sm">Lihat Semua</Text>
            </Pressable>
          </Link>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {featured_tema.map((tema) => (
            <Pressable
              key={tema.id}
              className="bg-white p-5 rounded-xl my-3 mr-3 w-72 shadow-lg"
              onPress={() => navigateToTema(tema.id)}
            >
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-green-600 text-xs font-semibold bg-green-50 px-2 py-1 rounded-md">
                  {tema.jenis_tema.nama}
                </Text>
                <View className="flex-row items-center">
                  <Ionicons name="play" size={12} color="#16A34A" />
                  <Text className="text-green-600 text-xs ml-1">{tema.video.length}</Text>
                </View>
              </View>
              <Text className="text-base font-bold text-gray-800 mb-2">{tema.nama}</Text>
              <Text className="text-sm text-gray-500 leading-5 mb-2" numberOfLines={2}>
                {tema.deskripsi}
              </Text>
              <Text className="text-right text-green-600 font-semibold text-sm">Jelajahi →</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Kuis Aktif */}
      <View className="p-5">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-bold text-gray-800">Kuis Aktif</Text>
          <Link href="/kuis" asChild>
            <Pressable>
              <Text className="text-green-600 font-semibold text-sm">Lihat Semua</Text>
            </Pressable>
          </Link>
        </View>

        {active_kuis.map((kuis) => (
          <Pressable
            key={kuis.id}
            className="bg-white p-4 rounded-xl mb-3 shadow-lg"
            onPress={() => navigateToKuis(kuis.id)}
          >
            <View className="flex-row justify-between mb-2">
              <Text className="flex-1 text-base font-bold text-gray-800 mr-3">{kuis.judul}</Text>
              <View className="bg-yellow-100 px-2 py-1 rounded-md">
                <Text className="text-yellow-700 text-xs font-semibold">{formatTime(kuis.batas_waktu)}</Text>
              </View>
            </View>
            <Text className="text-gray-500 text-sm mb-3">{kuis.deskripsi}</Text>
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-500 text-sm">{kuis.pertanyaan_count} Pertanyaan</Text>
              <View className="bg-green-600 px-4 py-1.5 rounded-md">
                <Text className="text-white text-sm font-semibold">Mulai</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </View>

      {/* Progress */}
      <View className="p-5">
        <Text className="text-xl font-bold text-gray-800 mb-3">Progress Belajar</Text>
        <View className="bg-white p-4 rounded-xl shadow-lg">
          <Text className="text-gray-800 text-sm mb-2">
            Kuis Diselesaikan: {stats.kuis_selesai} dari {stats.total_kuis}
          </Text>
          <View className="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
            <View
              className="h-full bg-green-600 rounded-full"
              style={{
                width: `${stats.total_kuis > 0 ? (stats.kuis_selesai / stats.total_kuis) * 100 : 0}%`,
              }}
            />
          </View>
          <Text className="text-green-600 font-semibold text-sm text-right">
            {stats.total_kuis > 0
              ? Math.round((stats.kuis_selesai / stats.total_kuis) * 100)
              : 0}
            %
          </Text>
        </View>
      </View>

      {/* Statistik Lainnya */}
      <View className="p-5">
        <Text className="text-xl font-bold text-gray-800 mb-3">Statistik Lainnya</Text>
        <View className="flex-row flex-wrap gap-3">
          {[
            { icon: 'book', label: `CP: ${stats.total_cp}` },
            { icon: 'school', label: `Kaidah: ${stats.total_kaidah}` },
            { icon: 'bulb', label: `Refleksi: ${stats.total_refleksi}` },
          ].map((item, i) => (
            <View key={i} className="flex-row items-center bg-white p-3 rounded-lg shadow gap-2">
              <Ionicons name={item.icon as any} size={20} color="#16A34A" />
              <Text className="text-gray-800 text-sm font-medium">{item.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
