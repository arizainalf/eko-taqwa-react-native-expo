import { View, Text, Pressable, RefreshControl, ScrollView } from 'react-native'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useDalilData } from 'hooks/ekoAyatHadist/useDalilData' // Menggunakan hook Dalil
import LoadingScreen from 'components/LoadingScreen'
import { useLocalSearchParams, useRouter } from 'expo-router'

function ucfirst(str: string) {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// [DIUBAH] Nama komponen diganti agar sesuai dengan data
export default function DalilList() {
    const router = useRouter()
    const { temaId } = useLocalSearchParams<{ temaId: string }>()
    const { data, loading, error, refetch } = useDalilData(temaId)

    if (loading && !data) {
        // [DIUBAH] Pesan disesuaikan
        return <LoadingScreen message="Memuat data Eko Dalil..." />
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
                    // [DITAMBAH] active state
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
                        className="mr-4 px-1 -ml-1"
                    >
                        <Ionicons name="arrow-back" size={28} color="white" />
                    </Pressable>

                    <View className="flex-1">
                        <Text className="text-2xl font-bold text-white mb-1">
                            Eko Ayat Hadist
                        </Text>
                        <Text className="text-base text-green-100" numberOfLines={1}>
                            {data?.tema.nama}
                        </Text>
                    </View>

                </View>
            </View>

            {/* [DIUBAH] Kartu utama, p-6 dan mx-4 agar konsisten */}
            <View className="p-6 mx-4 bg-white -mt-64 rounded-2xl shadow-sm">

                {/* [DIUBAH] Hapus card-in-card, .map() langsung di sini */}
                {data?.dalil.map((dalil, index) => (
                    <View
                        key={dalil.id}
                        // Garis pemisah antar item
                        className={index > 0 ? 'pt-5 mt-5 border-t border-gray-100' : ''}
                    >
                        {/* Badge Jenis Dalil */}
                        <View className="flex-row mb-4 items-center bg-green-100 px-3 py-1.5 rounded-md self-start gap-2">
                            <Ionicons name="checkmark-circle" size={18} color="#15803D" />
                            <Text className="text-green-700 text-base font-bold">{ucfirst(dalil.jenis)}</Text>
                        </View>

                        {/* Teks Asli (Arab) */}
                        <View className="mb-4 bg-gray-100 p-4 rounded-lg">
                            <Text className="text-gray-900 text-2xl text-right leading-9">
                                {dalil.teks_asli}
                            </Text>
                        </View>

                        {/* Blok Terjemahan & Penjelasan */}
                        <View className="flex-col gap-4">
                            {dalil.terjemahan && (
                                <View className="bg-gray-50 p-4 rounded-lg flex-row items-start space-x-3">
                                    <View className="flex-1">
                                        <View className='flex-row mb-1'>
                                            <MaterialCommunityIcons name="abjad-arabic" size={20} color="#16A34A" />
                                            <Text className="text-gray-500 ms-1 text-sm font-semibold">Terjemahan</Text>
                                        </View>
                                        {/* [DIUBAH] Terjemahan diberi style italic, sumber di baris baru */}
                                        <Text className="text-gray-900 text-base font-medium italic">"{dalil.terjemahan}"</Text>
                                        {dalil.sumber && (
                                            <Text className="text-gray-500 text-sm font-medium mt-1">({dalil.sumber})</Text>
                                        )}
                                    </View>
                                </View>
                            )}

                            {dalil.penjelasan && (
                                < View className="bg-gray-50 p-4 rounded-lg flex-row items-start space-x-3">
                                    <View className="flex-1">
                                        <View className='flex-row mb-1'>
                                            <MaterialCommunityIcons name="billboard" size={20} color="#16A34A" />
                                            <Text className="text-gray-500 text-sm ms-2 font-semibold">Penjelasan</Text>
                                        </View>
                                        <Text className="text-gray-900 text-base font-medium">{dalil.penjelasan}</Text>
                                    </View>
                                </View>
                            )}
                        </View>
                    </View>
                ))}

                {data?.dalil.length === 0 && (
                    <View className="items-center py-10 px-5">
                        <Ionicons name="document-text" size={64} color="#6B7280" />
                        <Text className="text-lg font-bold text-gray-900 mt-4 mb-2">
                            Tidak Ada Data Eko Dalil
                        </Text>
                    </View>
                )}
            </View>

        </ScrollView >
    )
}