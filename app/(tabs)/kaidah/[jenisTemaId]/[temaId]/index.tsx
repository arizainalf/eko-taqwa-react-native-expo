import { View, Text, Pressable, RefreshControl, ScrollView } from 'react-native'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useKaidahData } from 'hooks/useKaidahData'
import LoadingScreen from 'components/LoadingScreen'
import { useLocalSearchParams, useRouter } from 'expo-router'

export default function KaidahList() {
    const router = useRouter()
    const { jenisTemaId, temaId } = useLocalSearchParams<{ jenisTemaId: string, temaId: string }>()
    const { data, loading, error, refetch } = useKaidahData(temaId)

    if (loading && !data) {
        return <LoadingScreen message="Memuat data eko media..." />
    }

    const onRefresh = async () => {
        await refetch()
    }

    if (error) {
        return (
            <View className="flex-1 justify-center items-center bg-white px-5">
                <Ionicons name="warning" size={48} color="#6B7280" />
                <Text className="mt-4 text-lg font-bold text-gray-900">
                    Gagal memuat data Eko Kaidah
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
                            Eko Kaidah
                        </Text>
                        <Text className="text-base text-green-100">
                            {data?.tema.nama}
                        </Text>
                    </View>

                </View>
            </View>

            <View className="p-5 mx-3 bg-white -mt-64 rounded-2xl">

                {/* <View className="h-px bg-gray-300 my-4" /> */}

                {data?.kaidah.map((kaidah) => (
                    <Pressable key={kaidah.id} className="bg-white p-4 rounded-xl shadow-lg mb-4">
                        <View className="flex-row justify-between items-center mb-3">
                            <View className="flex-row items-center bg-green-50 px-2 py-1 rounded gap-1 w-[30%]">
                                <Ionicons name="checkmark-circle" size={16} color="#16A34A" />
                                <Text className="text-green-700 text-xs font-semibold">Kaidah {kaidah.jenis_kaidah}</Text>
                            </View>
                            <View className="bg-primary px-3 py-1.5 rounded w-[70%]">
                                <Text className="text-dark text-xl font-bold">{kaidah.kaidah}</Text>
                            </View>
                        </View>

                        <Text className="text-gray-900 text-sm leading-5 mb-4">
                            {kaidah.kaidah_latin}
                        </Text>

                        {/* Teaching Methods */}
                        <View className="flex-col gap-3 mb-4">
                            {kaidah.terjemahan && (
                                <View className="bg-gray-50 p-3 rounded-lg items-center">
                                    <MaterialCommunityIcons name="abjad-arabic" size={16} color="#16A34A" />
                                    <Text className="text-gray-500 text-sm mt-1 mb-2">Terjemahan</Text>
                                    <Text className="text-gray-900 text-xs font-semibold">{kaidah.terjemahan}</Text>
                                </View>
                            )}

                            {kaidah.deskripsi && (
                                <View className="bg-gray-50 p-3 rounded-lg items-center">
                                    <MaterialCommunityIcons name="billboard" size={16} color="#16A34A" />
                                    <Text className="text-gray-500 text-sm my-2">Penjelasan</Text>
                                    <Text className="text-gray-900 text-xs mb-2 font-semibold">{kaidah.deskripsi}</Text>
                                </View>
                            )}
                        </View>
                    </Pressable>
                ))}

                {data?.kaidah.length === 0 && (
                    <View className="items-center py-10 px-5">
                        <Ionicons name="document-text" size={64} color="#6B7280" />
                        <Text className="text-lg font-bold text-gray-900 mt-4 mb-2">
                            Tidak Ada Data Eko Kaidah
                        </Text>
                    </View>
                )}
            </View>

        </ScrollView>
    )
}
