import { View, Text, Pressable, RefreshControl, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useJenisTemaData } from 'hooks/useJenisTemaData'
import LoadingScreen from 'components/LoadingScreen'
import InfoCardFull from 'components/InfoCardFull'
import ItemCard from 'components/ItemCard'

export default function JenisTemaList() {
    const { data, loading, error, refetch } = useJenisTemaData()

    if (loading && !data) {
        return <LoadingScreen message="Memuat data Eko Ayat Hadist..." />
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

                <Text className="text-2xl font-bold text-white mb-1">
                    Eko Ayat Hadist
                </Text>
                <Text className="text-base text-green-100">
                    Daftar Jenis Tema
                </Text>
            </View>

            <View className="p-5 mx-3 bg-white -mt-64 rounded-2xl">

                <InfoCardFull
                    title={'Total Tema'}
                    value={data!.tema_count}
                    icon={'palette'}
                />

                <View className="h-px bg-gray-300 my-4" />

                {data?.jenistema.map((jenisTema) => (
                    <ItemCard
                        key={jenisTema.id}
                        title={jenisTema.nama}
                        value={`${jenisTema.tema_count + ' Tema'}`}
                        href={`/dalil/${jenisTema.id}`}
                    />
                ))}
            </View>

            {data?.jenistema.length === 0 && (
                <View className="items-center py-10 px-5">
                    <Ionicons name="document-text" size={64} color="#6B7280" />
                    <Text className="text-lg font-bold text-gray-900 mt-4 mb-2">
                        Tidak Ada Data Jenis Tema
                    </Text>
                </View>
            )}
        </ScrollView>
    )
}
