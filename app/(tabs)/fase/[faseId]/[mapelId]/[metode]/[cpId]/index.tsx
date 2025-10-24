import { View, Text, Pressable, RefreshControl, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams } from 'expo-router'
import { useCpDetail } from 'hooks/ekoCp/useCpDetail'
import LoadingScreen from 'components/LoadingScreen'
import { useRouter } from 'expo-router'

export default function CpDetail() {
    const router = useRouter()
    const { cpId } = useLocalSearchParams<{ cpId: string }>()
    const { data, loading, error, refetch } = useCpDetail(cpId)

    // [DIUBAH] Pesan typo diperbaiki dan dibuat lebih spesifik
    if (loading && !data) {
        return <LoadingScreen message="Memuat capaian pembelajaran..." />
    }

    const onRefresh = async () => {
        await refetch()
    }

    // [BAGUS] Tampilan error sudah sangat baik, tidak perlu diubah.
    if (error) {
        return (
            <View className="flex-1 justify-center items-center bg-white px-5">
                <Ionicons name="warning" size={48} color="#6B7280" />
                <Text className="mt-4 text-lg font-bold text-gray-900">
                    Gagal memuat data
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
            className="flex-1 bg-gray-50" // [DIUBAH] Ganti bg-white ke gray-50
            refreshControl={
                <RefreshControl
                    refreshing={loading}
                    onRefresh={onRefresh}
                    colors={['#16A34A']}
                    tintColor="#16A34A" // Tambahkan tintColor untuk iOS
                />
            }
            // [DITAMBAH] contentContainerStyle untuk padding di bawah
            contentContainerStyle={{ paddingBottom: 40 }}
        >
            {/* [DIUBAH] Header disamakan dengan KuisScreen (padding & h-96) */}
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
                            Capaian Pembelajaran
                        </Text>
                        <Text className="text-base text-green-100" numberOfLines={1}>
                            {data?.nama}
                        </Text>
                    </View>
                </View>
            </View>

            {/* [DIUBAH] <Pressable> jadi <View>. Padding & margin disesuaikan. */}
            <View className="p-6 mx-4 bg-white -mt-64 rounded-2xl shadow-sm">

                {/* [DIUBAH] Judul Badge */}
                <View className="mb-4">
                    <View className="bg-green-100 px-3 py-1.5 self-start rounded-md">
                        <Text className="text-green-700 text-lg font-bold">{data?.nama}</Text>
                    </View>
                </View>

                {/* [DIUBAH] Deskripsi (tipografi lebih baik) */}
                <Text className="text-gray-700 text-base leading-6 mb-6">
                    {data?.deskripsi}
                    _   </Text>

                {/* [DIUBAH] Teaching Methods (layout diubah total) */}
                <View className="flex-col gap-4 mb-6">
                    {data?.pendekatan && (
                        <MethodBlock
                            icon="trending-up"
                            color="#16A34A"
                            title="Pendekatan"
                            value={data.pendekatan}
                        />
                    )}
                    {data?.model && (
                        <MethodBlock
                            icon="cube"
                            color="#F59E0B"
                            title="Model"
                            value={data.model}
                        />
                    )}
                    {data?.teknik && (
                        <MethodBlock
                            icon="construct"
                            color="#3B82F6"
                            title="Teknik"
                            value={data.teknik}
                        />
                    )}
                    {data?.metode && (
                        <MethodBlock
                            icon="settings"
                            color="#6B7280"
                            title="Metode"
                            value={data.metode}
                        />
                    )}
                </View>

                {/* [DIUBAH] Taktik Section (dibuat mirip MethodBlock) */}
                {data?.taktik && (
                    <MethodBlock
                        icon="bulb"
                        color="#D97706"
                        title="Taktik"
                        value={data.taktik}
                    />
                )}
            </View>
        </ScrollView>
    )
}

// [DITAMBAH] Komponen internal untuk merapikan blok metode
type MethodBlockProps = {
    icon: keyof typeof Ionicons.glyphMap
    color: string
    title: string
    value: string
}

function MethodBlock({ icon, color, title, value }: MethodBlockProps) {
    return (
        <View className="bg-gray-50 p-4 rounded-lg flex-row items-start space-x-3">
            {/* 1. Ikon - Hapus mt-0.5 karena sudah sejajar secara default dengan items-start */}

            <View className="flex-1 content-center">
                <View className='flex-row my-2'>
                    <Ionicons name={icon} size={20} color={color} />
                    <Text className="text-gray-500 ms-2 text-sm font-semibold mb-1">{title}</Text>
                </View>
                {/* 2. Title - Tambahkan mb-1 untuk space ke bawah */}
                {/* 3. Value (deskripsi) */}
                <Text className="text-gray-900 text-base font-medium">{value}</Text>
            </View>
        </View>
    )
}