import { View, Text, Pressable, RefreshControl, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useFaseData } from '../../../hooks/useFaseData'
import LoadingScreen from '../../../components/LoadingScreen'
import InfoCard from 'components/InfoCard'
import ItemCard from 'components/ItemCard'

export default function FaseList() {
  const { data, loading, error, refetch } = useFaseData()

  if (loading && !data) {
    return <LoadingScreen message="Memuat data fase pembelajaran..." />
  }

  const onRefresh = async () => {
    await refetch()
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-white px-5">
        <Ionicons name="warning" size={48} color="#6B7280" />
        <Text className="mt-4 text-lg font-bold text-gray-900">
          Gagal memuat data Fase
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
        <Text className="text-2xl font-bold text-white mb-1">
          Eko CP
        </Text>
        <Text className="text-base text-green-100">
          Daftar Fase Pembelajaran
        </Text>
      </View>

      <View className="p-5 mx-3 bg-white -mt-64 rounded-2xl">
        <View className="flex-row flex-wrap justify-between">
          <InfoCard
            title="Total Mapel"
            value={data?.total_mapel ?? 0}
            icon="bookshelf"
            color="#f59e0b"
          />

          <InfoCard
            title="Total CP"
            value={data?.total_cps ?? 0}
            icon="file-document-multiple-outline"
            color="#f59e0b"
          />
        </View>

        <View className="h-px bg-gray-300 my-4" />

        {data?.fase?.map((fase) => (
          <ItemCard
            key={fase.id}
            title={fase.nama}
            value={`${fase.deskripsi}`}
            href={`/fase/${fase.id}`}
          />
        ))}
      </View>

      {data?.fase?.length === 0 && (
        <View className="items-center py-10 px-5">
          <Ionicons name="document-text" size={64} color="#6B7280" />
          <Text className="text-lg font-bold text-gray-900 mt-4 mb-2">
            Tidak Ada Data Fase
          </Text>
        </View>
      )}
    </ScrollView>
  )
}
