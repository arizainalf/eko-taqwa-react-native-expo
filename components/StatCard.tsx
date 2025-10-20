import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';

interface StatCardProps {
  icon: string;
  label: string;
  value: number;
  link?: string;
}

export default function StatCard({ icon, label, value, link,  }: StatCardProps) {
  const content = (
    <View className="flex-1 bg-white mx-1 p-4 rounded-xl items-center shadow">
      <Ionicons name={icon as any} size={24} color="#16A34A" />
      <Text className="text-green-600 font-bold text-lg mt-2">{value}</Text>
      <Text className="text-gray-500 text-xs mt-1">{label}</Text>
    </View>
  );

  return link ? (
    <Link href={link} asChild>
      <Pressable>{content}</Pressable>
    </Link>
  ) : (
    content
  );
}
