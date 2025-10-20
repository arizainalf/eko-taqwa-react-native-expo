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
  color = '#f59e0b',
  onPress,
}: CardProps) {
  return (
    <Pressable
      onPress={onPress}
      // [DIUBAH] 'items-center' ditambahkan agar icon sejajar di tengah
      // jika blok teksnya menjadi lebih tinggi (karena wrapping)
      className="bg-white px-4 py-5 rounded-xl shadow-lg flex-row justify-between items-center"
    >
      {/* [DIUBAH] 'flex-1' dan 'mr-4' ditambahkan 
          - 'flex-1': Membuat View ini mengambil semua sisa ruang
          - 'mr-4': Memberi jarak agar teks tidak menempel ke icon
      */}
      <View className="flex-1 mr-4">
        {/* [DIHAPUS] 'self-start' dihapus dari title agar teks bisa wrap penuh
            [DIUBAH] 'py-2' menjadi 'pb-2' (padding-bottom) agar lebih rapi
        */}
        <Text className="pb-2 rounded-lg mb-2 text-gray-900 text-md font-bold">
          {title}
        </Text>

        <Text className="self-start bg-green-100 px-4 py-2 rounded text-green-500 text-xl font-bold">
          {value}
        </Text>
      </View>

      {/* View untuk icon ini tidak perlu diubah */}
      <View className="justify-center items-center">
        <MaterialCommunityIcons name={icon} size={38} color={color} />
      </View>
    </Pressable>
  )
}