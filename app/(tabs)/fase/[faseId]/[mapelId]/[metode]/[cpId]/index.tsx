import { View, Text, Pressable, RefreshControl, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams } from 'expo-router'
import { useCpDetail } from 'hooks/useCpDetail'
import LoadingScreen from 'components/LoadingScreen'
import { useRouter } from 'expo-router'

export default function CpDetail() {
    const router = useRouter()
    const { cpId } = useLocalSearchParams<{ cpId: string }>()
    const { data, loading, error, refetch } = useCpDetail(cpId)

    if (loading && !data) {
        return <LoadingScreen message="Memuat data data?..." />
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
                            Detail capaian pembelajaran
                        </Text>
                    </View>

                </View>
            </View>

            <Pressable key={data?.id} className="p-5 mx-3 bg-white -mt-64 rounded-2xl min-h-[200px]">
                <View className="flex-row justify-between items-center mb-3">
                    <View className="bg-primary py-1.5 rounded">
                        <Text className="text-green-500 text-md font-bold">{data?.nama}</Text>
                    </View>
                </View>

                <Text className="text-gray-900 text-md leading-5 mb-4">
                    {data?.deskripsi}
                </Text>

                {/* Teaching Methods */}
                <View className="flex-col gap-3 mb-4">
                    {data?.pendekatan && (
                        <View className="bg-gray-50 p-3 rounded-lg items-center">
                            <Ionicons name="trending-up" size={16} color="#16A34A" />
                            <Text className="text-gray-500 text-md mt-1 mb-0.5">Pendekatan</Text>
                            <Text className="text-gray-900 text-md ">{data?.pendekatan}</Text>
                        </View>
                    )}

                    {data?.model && (
                        <View className="bg-gray-50 p-3 rounded-lg items-center">
                            <Ionicons name="cube" size={16} color="#F59E0B" />
                            <Text className="text-gray-500 text-md mt-1 mb-0.5">Model</Text>
                            <Text className="text-gray-900 text-md ">{data?.model}</Text>
                        </View>
                    )}

                    {data?.teknik && (
                        <View className="bg-gray-50 p-3 rounded-lg items-center">
                            <Ionicons name="construct" size={16} color="#3B82F6" />
                            <Text className="text-gray-500 text-md mt-1 mb-0.5">Teknik</Text>
                            <Text className="text-gray-900 text-md ">{data?.teknik}</Text>
                        </View>
                    )}

                    {data?.metode && (
                        <View className="bg-gray-50 p-3 rounded-lg items-center">
                            <Ionicons name="settings" size={16} color="#6B7280" />
                            <Text className="text-gray-500 text-md mt-1 mb-0.5">Metode</Text>
                            <Text className="text-gray-900 text-md  ">{data?.metode}</Text>
                        </View>
                    )}
                </View>

                {/* Taktik Section */}
                {data?.taktik && (
                    <View className="flex-row items-start bg-amber-50 p-3 rounded-lg mb-4">
                        <Text className="text-amber-700 text-md mr-2">Taktik:</Text>
                        <Text className="flex-1 text-gray-900 text-md leading-4.5">{data?.taktik}</Text>
                    </View>
                )}
            </Pressable>

        </ScrollView>
    )
}
