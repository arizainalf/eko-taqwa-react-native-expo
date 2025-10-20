import { Pressable, View, Text } from 'react-native'
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface ItemCardProps {
    title: string;
    value?: string | number | null;
    href: string;
}

export default function ItemCard({
    title,
    value,
    href,
}: ItemCardProps) {

    return (
        <View className="bg-white p-4 rounded-md shadow-lg mb-4">
            <View className="mb-3 bg-green-100 px-3 py-1.5 rounded">
                <Text className="text-green-500 text-md font-bold">{title}</Text>
            </View>

<View className="flex-row justify-between items-center w-[88%]">
    {value ? (
        // Ini adalah anak pertama (jika value ada)
        <View className="bg-amber-50 px-3 py-1.5 rounded-md mr-4">
            <Text className="text-amber-900 text-md font-normal">{value}</Text>
        </View>
    ) : (

        <View /> 
    )}

    {/* Ini adalah anak kedua, akan selalu didorong ke kanan */}
    <Link
        href={href}
        asChild
    >
        <Pressable className='bg-green-500 rounded-md px-2 py-1.5 active:bg-green-600'>
            <Ionicons name="chevron-forward" size={24} color={'white'} />
        </Pressable>
    </Link>
</View>
        </View>
    )
}