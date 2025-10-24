import { View, Text, Pressable, RefreshControl, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams } from 'expo-router'
import { useMapelData } from 'hooks/ekoCp/useMapelByFase'
import LoadingScreen from 'components/LoadingScreen'
import { useRouter } from 'expo-router'
import InfoCardFull from 'components/InfoCardFull'
import ItemCard from 'components/ItemCard'

export default function MapelList() {
  const router = useRouter()
  const { faseId } = useLocalSearchParams<{ faseId: string }>()
  const { data, loading, error, refetch } = useMapelData(faseId)

  if (loading && !data) {
    return <LoadingScreen message="Memuat data Mata Pelajaran pembelajaran..." />
  }

  const onRefresh = async () => {
    await refetch()
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-white px-5">
        <Ionicons name="warning" size={48} color="#6B7280" />
        <Text className="mt-4 text-lg font-bold text-gray-900">
          Gagal memuat data Mata Pelajaran
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
              Eko CP
            </Text>
            <Text className="text-base text-green-100">
              {data?.fase.nama}
            </Text>
          </View>

        </View>
      </View>

      {/* Fase List */}
      <View className="p-5 mx-3 bg-white -mt-64 rounded-2xl min-h-[200px]">

        <InfoCardFull
          title="Total Capaian Pembelajaran"
          value={data?.total_cp ?? 0}
          icon="bookshelf"
          color="#f59e0b"
        />

        <View className="h-px bg-gray-300 my-4" />
        {data?.mapel.map((mapel: any) => (
          <ItemCard
            key={mapel.id}
            title={mapel.nama}
            value={`${mapel.cp_count + ' Capaian pembelajaran'}`}
            href={`/fase/${faseId}/${mapel.id}`}
          />
        ))}

        {data?.mapel.length === 0 && (
          <View className="items-center py-10 px-5">
            <Ionicons name="document-text" size={64} color="#6B7280" />
            <Text className="text-lg font-bold text-gray-900 mt-4 mb-2">
              Tidak Ada Data Mata Pelajaran
            </Text>
          </View>
        )}
      </View>

    </ScrollView>
  )
}
