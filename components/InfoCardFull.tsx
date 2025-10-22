import { Pressable, View, Text } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

interface CardProps {
  title: string
  value: string | number
  icon: keyof typeof MaterialCommunityIcons.glyphMap
  color?: string
  onPress?: () => void
}

export default function InfoCardFull({
  title,
  value,
  icon,
  color = '#059669', // Default hijau
  onPress,
}: CardProps) {
  return (
    <Pressable
      onPress={onPress}
      // 1. Layout dikembalikan seperti asli: 
      // justify-between akan mendorong teks ke kiri & ikon ke kanan
      className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex-row items-center justify-between space-x-4 active:bg-gray-50"
    >
      {/* 2. Grup Teks (di Kiri) */}
      <View className="flex-1">

        {/* Title: Styling baru (label kecil) */}
        <Text className="text-gray-500 text-sm font-medium uppercase tracking-wide">
          {title}
        </Text>

        {/* Value: Styling baru (data besar) */}
        <Text className="text-gray-900 text-2xl font-bold">
          {value}
        </Text>

      </View>

      {/* 3. Ikon (di Kanan) */}
      <View
        style={{ backgroundColor: color }}
        className="w-12 h-12 rounded-lg items-center justify-center"
      >
        <MaterialCommunityIcons name={icon} size={28} color="white" />
      </View>

    </Pressable>
  )
}