import { View, Text, Pressable, RefreshControl, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams } from 'expo-router'
import { useCpByMetode } from 'hooks/useCpByMetode'
import LoadingScreen from 'components/LoadingScreen'
import { useRouter } from 'expo-router'
import ItemCard from 'components/ItemCard'

export default function CpList() {
    const router = useRouter()
    const { faseId, mapelId, metode } = useLocalSearchParams<{ faseId: string, mapelId: string, metode: string }>()
    const { data, loading, error, refetch } = useCpByMetode(faseId, mapelId, metode)

    if (loading && !data) {
        return <LoadingScreen message="Memuat data cp..." />
    }

    const onRefresh = async () => {
        await refetch()
    }

    if (error) {
        return (
            <View className="flex-1 justify-center items-center bg-white px-5">
                <Ionicons name="warning" size={48} color="#6B7280" />
                <Text className="mt-4 text-lg font-bold text-gray-900">
                    Gagal memuat data cp
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
                            Capaian Pembelajaran
                        </Text>
                        <Text className="text-base text-green-100">
                            Daftar capaian pembelajaran
                        </Text>
                    </View>

                </View>
            </View>

            <View className="p-5 mx-3 bg-white -mt-64 rounded-2xl min-h-[200px]">

                {data?.map((cp: any) => (
                    <ItemCard
                        key={cp.id}
                        title={cp.nama}
                        value={cp.deskripsi}
                        href={`/fase/${faseId}/${mapelId}/${metode}/${cp.id}`}
                    />
                ))}

                {data?.length === 0 && (
                    <View className="items-center py-10 px-5">
                        <Ionicons name="document-text" size={64} color="#6B7280" />
                        <Text className="text-lg font-bold text-gray-900 mt-4 mb-2">
                            Tidak Ada Data CP
                        </Text>
                    </View>
                )}

            </View>

        </ScrollView>
    )
}
