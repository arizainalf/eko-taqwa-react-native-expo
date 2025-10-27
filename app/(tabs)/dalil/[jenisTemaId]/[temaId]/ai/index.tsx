import React, { useState, useRef, useEffect, useCallback, memo } from 'react'
import {
    View,
    Text,
    Pressable,
    FlatList,
    ActivityIndicator,
    ListRenderItem,
    Alert,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useDevice } from 'context/deviceContext'
import { useEkoAyatHadistChatData } from 'hooks/ekoAyatHadist/useAiChatAyatHadist'

type MessageItem = {
    id: string
    sender: 'user' | 'bot'
    text: string
}

const STORAGE_KEY_PREFIX = 'ai_ayat_hadist_usage_' // tambahkan prefix

const MessageBubble = memo(({ item }: { item: MessageItem }) => {
    const isUser = item.sender === 'user'
    return (
        <View
            className={`my-2 mx-4 p-3 rounded-xl max-w-[100%] ${isUser
                ? 'bg-green-100 self-end rounded-br-none'
                : 'bg-gray-100 self-start rounded-bl-none'
                }`}
        >
            <Text
                className={`text-base ${isUser ? 'text-green-900' : 'text-gray-900'
                    }`}
            >
                {item.text}
            </Text>
        </View>
    )
})
MessageBubble.displayName = 'MessageBubble'

export default function AiChatEkoCpScreen() {
    const router = useRouter()
    const { deviceId } = useDevice()
    const { temaId } = useLocalSearchParams<{ temaId: string; deviceId: string }>()
    const { messages, loading, sendMessage, isSending } = useEkoAyatHadistChatData(
        temaId,
        deviceId ?? ''
    )

    const [jenis, setJenis] = useState<'hadist' | 'ayat'>('hadist')
    const [clickCount, setClickCount] = useState(0)
    const [today, setToday] = useState('')
    const [lastClickTime, setLastClickTime] = useState<number | null>(null)

    const flatListRef = useRef<FlatList>(null)

    // === GUNAKAN KEY BERDASARKAN DEVICE ===
    const STORAGE_KEY = `${STORAGE_KEY_PREFIX}${deviceId}`

    // === LOAD USAGE PER DEVICE ===
    useEffect(() => {
        const loadUsage = async () => {
            if (!deviceId) return
            const now = new Date().toISOString().split('T')[0]
            setToday(now)
            const data = await AsyncStorage.getItem(STORAGE_KEY)
            if (data) {
                const parsed = JSON.parse(data)
                if (parsed.date === now) {
                    setClickCount(parsed.count)
                    setLastClickTime(parsed.lastClickTime ?? null)
                } else {
                    const freshData = { date: now, count: 0, lastClickTime: null }
                    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(freshData))
                    setClickCount(0)
                    setLastClickTime(null)
                }
            } else {
                const initData = { date: now, count: 0, lastClickTime: null }
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(initData))
            }
        }
        loadUsage()
    }, [deviceId, STORAGE_KEY])

    // === SCROLL ===
    const messagesRef = useRef(messages)
    useEffect(() => {
        messagesRef.current = messages
    }, [messages])

    const scrollToBottom = useCallback(() => {
        if (messagesRef.current.length > 0 && flatListRef.current) {
            requestAnimationFrame(() => {
                flatListRef.current?.scrollToEnd({ animated: true })
            })
        }
    }, [])

    useEffect(() => {
        if (messages.length > 0) {
            const timer = setTimeout(scrollToBottom, 150)
            return () => clearTimeout(timer)
        }
    }, [messages.length, scrollToBottom])

    // === HANDLE SEND ===
    const handleSend = useCallback(
        async (jenisPesan: 'ayat' | 'hadist') => {
            if (isSending) return
            const now = Date.now()

            if (clickCount >= 5) {
                Alert.alert(
                    'Batas Harian Tercapai',
                    'Anda sudah menggunakan fitur ini sebanyak 5 kali hari ini. Coba lagi besok.'
                )
                return
            }

            if (lastClickTime && now - lastClickTime < 120000) {
                const remaining = Math.ceil((120000 - (now - lastClickTime)) / 1000)
                Alert.alert(
                    'Tunggu Sebentar',
                    `Anda baru saja menekan tombol. Silakan tunggu ${remaining} detik lagi sebelum mencoba lagi.`
                )
                return
            }

            // 🔹 Kirim data dengan jenis
            sendMessage(jenisPesan)
            setTimeout(scrollToBottom, 150)

            const newCount = clickCount + 1
            setClickCount(newCount)
            setLastClickTime(now)

            await AsyncStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({ date: today, count: newCount, lastClickTime: now })
            )
        },
        [isSending, clickCount, today, lastClickTime, sendMessage, scrollToBottom, STORAGE_KEY]
    )

    const renderItem: ListRenderItem<MessageItem> = useCallback(
        ({ item }) => <MessageBubble item={item} />,
        []
    )
    const keyExtractor = useCallback((item: MessageItem) => item.id, [])

    return (
        <View className="flex-1 bg-white">
            {/* HEADER */}
            <View className="pb-12 pt-6 px-6 bg-green-600 rounded-b-2xl">
                <View className="flex-row items-center mt-5">
                    <Pressable onPress={() => router.back()} className="mr-4 px-1 -ml-1">
                        <Ionicons name="arrow-back" size={28} color="white" />
                    </Pressable>
                    <View>
                        <Text className="text-2xl font-bold text-white mb-1">
                            Eko Ayat Hadist AI
                        </Text>
                        <Text className="text-base text-green-100">
                            Memuat Data Eko Ayat Hadist dengan AI
                        </Text>
                    </View>
                </View>
            </View>

            {/* LIST PESAN */}
            <View className="flex-1 -mt-8 bg-white rounded-xl mx-2">
                {loading && messages.length === 0 ? (
                    <View className="flex-1 justify-center items-center">
                        <ActivityIndicator size="large" color="#059669" />
                        <Text className="mt-2 text-gray-500">Memuat data...</Text>
                    </View>
                ) : (
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        keyExtractor={keyExtractor}
                        renderItem={renderItem}
                        onContentSizeChange={() => setTimeout(scrollToBottom, 100)}
                        onLayout={() => setTimeout(scrollToBottom, 200)}
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={{
                            paddingVertical: 10,
                            flexGrow: 1,
                            paddingBottom: 120,
                        }}
                    />
                )}
            </View>

            {/* PILIHAN JENIS */}
            <View className="absolute bottom-4 left-4 flex-row gap-3">
                <Pressable
                    onPress={() => setJenis('hadist')}
                    className={`px-4 py-2 rounded-full border ${jenis === 'hadist'
                        ? 'bg-green-600 border-green-600'
                        : 'bg-white border-gray-300'
                        }`}
                >
                    <Text
                        className={`text-sm ${jenis === 'hadist' ? 'text-white' : 'text-gray-700'
                            }`}
                    >
                        Hadist
                    </Text>
                </Pressable>

                <Pressable
                    onPress={() => setJenis('ayat')}
                    className={`px-4 py-2 rounded-full border ${jenis === 'ayat'
                        ? 'bg-green-600 border-green-600'
                        : 'bg-white border-gray-300'
                        }`}
                >
                    <Text
                        className={`text-sm ${jenis === 'ayat' ? 'text-white' : 'text-gray-700'
                            }`}
                    >
                        Ayat Al-quran
                    </Text>
                </Pressable>
            </View>

            {/* TOMBOL GENERATE */}
            <Pressable
                onPress={() => handleSend(jenis)}
                disabled={isSending}
                className={`absolute bottom-4 right-4 ${isSending ? 'bg-gray-400' : 'bg-green-600'
                    } w-28 h-10 rounded-full flex-row items-center justify-center gap-2 shadow-md`}
                android_ripple={{ color: '#ffffff40', borderless: true }}
            >
                <MaterialCommunityIcons name="refresh" size={22} color="white" />
                <Text className="text-white text-sm font-medium">Generate</Text>
            </Pressable>

            {/* INFO KLIK */}
            <View className="absolute bottom-16 right-4 bg-white px-3 py-1 rounded-full border border-gray-300">
                <Text className="text-xs text-gray-700">{clickCount}/5 kali hari ini</Text>
            </View>
        </View>
    )
}
