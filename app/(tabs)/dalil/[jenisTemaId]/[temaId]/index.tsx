import { View, Text, Pressable, RefreshControl, ScrollView } from 'react-native'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useDalilData } from 'hooks/useDalilData'
import LoadingScreen from 'components/LoadingScreen'
import { useLocalSearchParams, useRouter } from 'expo-router'

function ucfirst(str: string) {
    if (!str) return str; // Jaga-jaga jika string-nya kosong
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function KaidahList() {
    const router = useRouter()
    const { temaId } = useLocalSearchParams<{ jenisTemaId: string, temaId: string }>()
    const { data, loading, error, refetch } = useDalilData(temaId)

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
                    Gagal memuat data Eko Ayat Hadist
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

                {data?.dalil.map((dalil) => (
                    <Pressable key={dalil.id} className="bg-white p-4 rounded-xl shadow-lg mb-4">
                        <View className="flex-row mb-3 items-center bg-green-50 px-2 py-1 rounded gap-1">
                            <Ionicons name="checkmark-circle" size={16} color="#16A34A" />
                            <Text className="text-green-700 text-lg font-semibold">{ucfirst(dalil.jenis)}</Text>
                        </View>
                        <View className="mb-3 bg-primary px-3 py-1.5 rounded items-end">
                            <Text className="text-dark text-xl text-right leading-10">
                                {dalil.teks_asli}
                            </Text>
                        </View>

                        {/* Teaching Methods */}
                        <View className="flex-col gap-3 mb-4">
                            {dalil.terjemahan && (
                                <View className="bg-gray-50 p-3 rounded-lg items-center">
                                    <MaterialCommunityIcons name="abjad-arabic" size={16} color="#16A34A" />
                                    <Text className="text-gray-500 text-md mt-1 mb-2">Terjemahan</Text>
                                    <Text className="text-gray-900 text-md italic">{dalil.terjemahan} {dalil.sumber}</Text>
                                </View>
                            )}

                            {dalil.penjelasan && (
                                <View className="bg-gray-50 p-3 rounded-lg items-center">
                                    <MaterialCommunityIcons name="billboard" size={16} color="#16A34A" />
                                    <Text className="text-gray-500 text-md my-2">Penjelasan</Text>
                                    <Text className="text-gray-900 text-md mb-2 ">{dalil.penjelasan}</Text>
                                </View>
                            )}
                        </View>
                    </Pressable>
                ))}

                {data?.dalil.length === 0 && (
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
