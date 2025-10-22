import { View, Text, Pressable, RefreshControl, ScrollView } from 'react-native'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useKaidahData } from 'hooks/useKaidahData'
import LoadingScreen from 'components/LoadingScreen'
import { useLocalSearchParams, useRouter } from 'expo-router'

// Fungsi ucfirst Anda sudah bagus, tidak perlu diubah
function ucfirst(str: string) {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function KaidahList() {
    const router = useRouter()
    const { temaId } = useLocalSearchParams<{ temaId: string }>()
    const { data, loading, error, refetch } = useKaidahData(temaId)

    // [DIUBAH] Pesan typo diperbaiki
    if (loading && !data) {
        return <LoadingScreen message="Memuat data Eko Kaidah..." />
    }

    const onRefresh = async () => {
        await refetch()
    }

    // Tampilan Error sudah bagus, hanya tambahkan active state
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
            // [DIUBAH] Latar belakang ScrollView jadi abu-abu
            className="flex-1 bg-gray-50"
            refreshControl={
                <RefreshControl
                    refreshing={loading}
                    onRefresh={onRefresh}
                    colors={['#16A34A']}
                    tintColor="#16A34A" // [DITAMBAH] tintColor untuk iOS
                />
            }
            // [DITAMBAH] contentContainerStyle untuk padding di bawah
            contentContainerStyle={{ paddingBottom: 40 }}
        >
            {/* [DIUBAH] Header disamakan dengan layout Kuis/CP (h-96, padding) */}
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
                            Eko Kaidah</Text>
                        <Text className="text-base text-green-100" numberOfLines={1}>
                            {data?.tema.nama}
                        </Text>
                    </View>
                </View>
            </View>

            {/* [DIUBAH] Kartu utama, p-6 dan mx-4 agar konsisten */}
            <View className="p-6 mx-4 bg-white -mt-64 rounded-2xl shadow-sm">

                {/* [DIUBAH] Loop .map() sekarang ada di dalam kartu, 
                             menggunakan <View> BUKAN <Pressable> card-in-card */}
                {data?.kaidah.map((kaidah, index) => (
                    <View
                        key={kaidah.id}
                        // [DITAMBAH] Garis pemisah antar item
                        className={index > 0 ? 'pt-5 mt-5 border-t border-gray-100' : ''}
                    >
                        {/* [DIUBAH] Badge Judul Kaidah */}
                        <View className="flex-row mb-4 items-center bg-green-100 px-3 py-1.5 rounded-md self-start gap-2">
                            <Ionicons name="checkmark-circle" size={18} color="#15803D" />
                            <Text className="text-green-700 text-base font-bold">
                                Kaidah {ucfirst(kaidah.jenis_kaidah)}
                            </Text>
                        </View>

                        {/* [DIUBAH] Blok Teks Arab (Kaidah) */}
                        <View className="mb-2 bg-gray-100 p-4 rounded-lg">
                            <Text className="text-gray-900 text-2xl text-right">
                                {kaidah.kaidah}
                            </Text>
                        </View>

                        {/* [DIUBAH] Blok Teks Latin */}
                        <Text className="text-gray-500 text-sm leading-5 mb-5 italic text-right">
                            {kaidah.kaidah_latin}
                        </Text>

                        {/* [DIUBAH] Blok Terjemahan & Penjelasan (dibuat mirip MethodBlock) */}
                        <View className="flex-col gap-4">
                            {kaidah.terjemahan && (
                                <View className="bg-gray-50 p-4 rounded-lg flex-row items-start space-x-3">
                                    <View className="flex-1">
                                        <View className='flex-row'>
                                            <MaterialCommunityIcons name="abjad-arabic" size={20} color="#16A34A" />
                                            <Text className="text-gray-500 ms-2 text-sm font-semibold mb-1">Terjemahan</Text>
                                        </View>
                                        <Text className="text-gray-900 text-base font-medium">{kaidah.terjemahan}</Text>
                                    </View>
                                </View>
                            )}
                            {kaidah.deskripsi && (
                                <View className="bg-gray-50 p-4 rounded-lg flex-row items-start space-x-3">
                                    <View className="flex-1">
                                        <View className='flex-row'>
                                            <MaterialCommunityIcons name="billboard" size={20} color="#16A34A" />
                                            <Text className="text-gray-500 ms-2 text-sm font-semibold mb-1">Penjelasan</Text>
                                        </View>
                                        <Text className="text-gray-900 text-base font-medium">{kaidah.deskripsi}</Text>
                                    </View>
                                </View>
                            )}
                        </View>
                    </View>
                ))}

                {data?.kaidah.length === 0 && (
                    <View className="items-center py-10 px-5">
                        D   <Ionicons name="document-text" size={64} color="#6B7280" />
                        <Text className="text-lg font-bold text-gray-900 mt-4 mb-2">
                            Tidak Ada Data Eko Kaidah
                        </Text>
                    </View>
                )}
            </View>

        </ScrollView>
    )
}