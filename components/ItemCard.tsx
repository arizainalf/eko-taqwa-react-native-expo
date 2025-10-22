import { Pressable, View, Text } from 'react-native'
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface ItemCardProps {
    title: string | number;
    value?: string | number | null; // 'value' sekarang diperlakukan sebagai 'deskripsi'
    href: string;
}

export default function ItemCard({
    title,
    value,
    href,
}: ItemCardProps) {

    return (
        // 1. Seluruh kartu sekarang adalah Link/Pressable
        <Link href={href} asChild>
            <Pressable
                // 2. Class styling diambil dari container Kuis List
                className="bg-white mx-1 mb-4 rounded-xl shadow-sm border border-gray-100 overflow-hidden active:bg-gray-50"
            >
                {/* 3. Konten dibungkus dengan padding p-4 */}
                <View className="p-4">

                    {/* 4. Title di-style seperti 'judul' kuis */}
                    <Text className="text-lg font-bold text-gray-900 mb-2">
                        {title}
                    </Text>

                    {/* 5. Value di-style seperti 'deskripsi' kuis */}
                    {value ? (
                        <Text
                            className="text-gray-600 text-sm leading-5 mb-3"
                        >
                            {value}
                        </Text>
                    ) : (
                        // Placeholder jika value tidak ada
                        <Text
                            className="text-gray-400 text-sm leading-5 mb-3 italic"
                        >
                            Tidak ada detail
                        </Text>
                    )}

                    {/* 6. Info baris bawah, mirip Kuis List tapi pakai chevron */}
                    <View className="flex-row justify-end items-center mt-3 pt-3 border-t border-gray-100">
                        <Text className="text-green-600 text-xs font-semibold mr-1">
                            Buka
                        </Text>
                        <Ionicons name="chevron-forward" size={16} color={'#059669'} />
                    </View>
                </View>
            </Pressable>
        </Link>
    )
}