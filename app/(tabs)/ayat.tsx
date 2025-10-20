// app/(tabs)/cp.tsx (NativeWind Version)
import { View, Text, ScrollView, Pressable, RefreshControl } from 'react-native';
import { useCpData } from '../../hooks/useCpData';
import { Ionicons } from '@expo/vector-icons';

// NativeWind Loading Component
function LoadingScreen({ message = 'Memuat...' }: { message?: string }) {
  return (
    <View className="flex-1 justify-center items-center bg-white px-5">
      <Ionicons name="book" size={48} color="#16A34A" />
      <Text className="mt-4 text-base text-gray-500">{message}</Text>
    </View>
  );
}

export default function AyatScreen() {
  const { data, loading, error, refetch } = useCpData();

  const onRefresh = async () => {
    await refetch();
  };

  if (loading && !data) {
    return <LoadingScreen message="Memuat data CP..." />;
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-white px-5">
        <Ionicons name="warning" size={48} color="#6B7280" />
        <Text className="mt-4 text-lg font-bold text-gray-900">Gagal memuat data Ayat dan Hadist</Text>
        <Text className="mt-2 text-sm text-gray-500 text-center mb-5">{error}</Text>
        <Pressable 
          className="bg-primary px-5 py-3 rounded-lg"
          onPress={refetch}
        >
          <Text className="text-white text-base font-semibold">Coba Lagi</Text>
        </Pressable>
      </View>
    );
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
      {/* Header */}
      <View className="bg-dark px-5 pt-12 pb-14 rounded-b-3xl shadow-xl">
        <Text className="text-2xl font-bold text-gray mb-1">Capaian Pembelajaran (CP)</Text>
        <Text className="text-base text-green-500">
          Profil kompetensi dan pendekatan pembelajaran
        </Text>
      </View>

      {/* Stats */}
      <View className="flex-row justify-between px-5 -mt-7">
        <View className="bg-white px-4 py-4 rounded-xl shadow-lg flex-1 mx-1 items-center">
          <Ionicons name="layers" size={24} color="#16A34A" />
          <Text className="text-lg font-bold text-primary mt-2">{data?.length || 0}</Text>
          <Text className="text-xs text-gray-500 mt-1">Total CP</Text>
        </View>
        
        <View className="bg-white px-4 py-4 rounded-xl shadow-lg flex-1 mx-1 items-center">
          <Ionicons name="school" size={24} color="#F59E0B" />
          <Text className="text-lg font-bold text-primary mt-2 text-start">
            {data ? new Set(data.map(item => item.pendekatan)).size : 0}
          </Text>
          <Text className="text-xs text-gray-500 mt-1">Pendekatan</Text>
        </View>
        
        <View className="bg-white px-4 py-4 rounded-xl shadow-lg flex-1 mx-1 items-center">
          <Ionicons name="bulb" size={24} color="#3B82F6" />
          <Text className="text-lg font-bold text-primary mt-2">
            {data ? new Set(data.map(item => item.model)).size : 0}
          </Text>
          <Text className="text-xs text-gray-500 mt-1">Model</Text>
        </View>
      </View>

      {/* CP List */}
      <View className="px-5 py-6">
        <Text className="text-xl font-bold text-gray-900 mb-4">Daftar Competency Profile</Text>
        
        {data?.map((cp, index) => (
          <Pressable key={cp.id} className="bg-white p-4 rounded-xl shadow-lg mb-4">
            <View className="flex-row justify-between items-center mb-3">
              <View className="bg-primary px-3 py-1.5 rounded">
                <Text className="text-white text-xs font-bold">CP {index + 1}</Text>
              </View>
              <View className="flex-row items-center bg-green-50 px-2 py-1 rounded gap-1">
                <Ionicons name="checkmark-circle" size={16} color="#16A34A" />
                <Text className="text-green-700 text-xs font-semibold">Aktif</Text>
              </View>
            </View>

            <Text className="text-gray-900 text-sm leading-5 mb-4">
              {cp.deskripsi}
            </Text>

            {/* Teaching Methods */}
            <View className="flex-col gap-3 mb-4">
  {cp.pendekatan && (
    <View className="bg-gray-50 p-3 rounded-lg items-center">
      <Ionicons name="trending-up" size={16} color="#16A34A" />
      <Text className="text-gray-500 text-xs mt-1 mb-0.5">Pendekatan</Text>
      <Text className="text-gray-900 text-xs font-semibold">{cp.pendekatan}</Text>
    </View>
  )}

  {cp.model && (
    <View className="bg-gray-50 p-3 rounded-lg items-center">
      <Ionicons name="cube" size={16} color="#F59E0B" />
      <Text className="text-gray-500 text-xs mt-1 mb-0.5">Model</Text>
      <Text className="text-gray-900 text-xs font-semibold">{cp.model}</Text>
    </View>
  )}

  {cp.teknik && (
    <View className="bg-gray-50 p-3 rounded-lg items-center">
      <Ionicons name="construct" size={16} color="#3B82F6" />
      <Text className="text-gray-500 text-xs mt-1 mb-0.5">Teknik</Text>
      <Text className="text-gray-900 text-xs font-semibold">{cp.teknik}</Text>
    </View>
  )}

  {cp.metode && (
    <View className="bg-gray-50 p-3 rounded-lg items-center">
      <Ionicons name="settings" size={16} color="#6B7280" />
      <Text className="text-gray-500 text-xs mt-1 mb-0.5">Metode</Text>
      <Text className="text-gray-900 text-xs font-semibold ">{cp.metode}</Text>
    </View>
  )}
</View>

            {/* Taktik Section */}
                {cp.taktik && (
                <View className="flex-row items-start bg-amber-50 p-3 rounded-lg mb-4">
                <Text className="text-amber-700 text-sm font-semibold mr-2">Taktik:</Text>
                <Text className="flex-1 text-gray-900 text-sm leading-4.5">{cp.taktik}</Text>
                </View>
                )}

            <View className="flex-row justify-between items-center border-t border-gray-200 pt-3">
              <Text className="text-gray-500 text-xs">
                Dibuat: {new Date(cp.created_at).toLocaleDateString('id-ID')}
              </Text>
              <Pressable className="flex-row items-center gap-1">
                <Text className="text-primary text-sm font-semibold">Detail</Text>
                <Ionicons name="chevron-forward" size={16} color="#16A34A" />
              </Pressable>
            </View>
          </Pressable>
        ))}
      </View>

      {/* Empty State */}
      {data?.length === 0 && (
        <View className="items-center py-10 px-5">
          <Ionicons name="document-text" size={64} color="#6B7280" />
          <Text className="text-lg font-bold text-gray-900 mt-4 mb-2">Tidak Ada Data CP</Text>
          <Text className="text-sm text-gray-500 text-center">
            Data competency profile belum tersedia
          </Text>
        </View>
      )}
    </ScrollView>
  );
}