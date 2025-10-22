import { Pressable, View, Text } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

interface CardProps {
  title: string
  value: string | number
  icon: keyof typeof MaterialCommunityIcons.glyphMap
  color?: string
  onPress?: () => void
}

export default function InfoCard({
  title,
  value,
  icon,
  color = '#f59e0b', // Tetap gunakan default oranye
  onPress,
}: CardProps) {
  return (
    <Pressable
      onPress={onPress}
      // 1. Styling kartu utama: w-[48%], shadow lebih tipis, items-center
      className="w-[48%] bg-white p-4 rounded-xl border border-gray-100  shadow-sm active:bg-gray-50 flex-row justify-between items-center"
    >
      {/* 2. Grup Teks (Kiri) */}
      <View className="flex-1 mr-2">

        {/* Title: Dijadikan label kecil, abu-abu, uppercase */}
        <Text
          className="text-gray-500 text-xs font-medium uppercase tracking-wide"
          numberOfLines={1} // Mencegah teks panjang merusak layout
        >
          {title}
        </Text>

        {/* Value: Dijadikan data utama yang besar dan tebal */}
        <Text
          className="text-gray-900 text-2xl font-bold"
          numberOfLines={1} // Mencegah teks panjang merusak layout
        >
          {value}
        </Text>

      </View>

      {/* 3. Ikon (Kanan) */}
      <View className="justify-center items-center">
        {/* Ukuran ikon sedikit diperbesar agar lebih jelas */}
        <MaterialCommunityIcons name={icon} size={28} color={color} />
      </View>
    </Pressable>
  )
}