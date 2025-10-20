// app/(tabs)/cp.tsx (NativeWind Version)
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function LoadingScreen({ message = 'Memuat...', }: { message?: string }) {
  return (
    <View className="flex-1 justify-center items-center bg-white px-5">
      <Ionicons name="refresh" size={48} color="#16A34A" />
      <Text className="mt-4 text-base text-gray-500">{message}</Text>
    </View>
  );
}