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
  color = '#f59e0b',
  onPress,
}: CardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="w-[48%] bg-white px-4 py-5 rounded-xl shadow-lg active:bg-gray-50 flex-row justify-between"
    >
      <View>
        <Text className="self-start py-2 rounded-lg mb-2 text-gray-900 text-sm font-bold">{title}</Text>
        <Text className="self-start bg-green-100 px-4 py-2 rounded text-green-500 text-xl font-bold">{value}</Text>
      </View>
      <View className="justify-center items-center">
        <MaterialCommunityIcons name={icon} size={24} color={color} />
      </View>
      {/* Header: title + icon */}
    </Pressable>
  )
}
