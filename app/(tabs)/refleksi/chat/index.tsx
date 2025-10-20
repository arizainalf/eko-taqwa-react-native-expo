import React, { useState, useRef, useEffect, useCallback, memo } from 'react'
import {
    View,
    Text,
    TextInput,
    Pressable,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    ActivityIndicator,
    ListRenderItem,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useChatData } from 'hooks/useChatData'

type MessageItem = {
    id: string;
    sender: 'user' | 'bot';
    text: string;
}

// 🔥 OPTIMIZED MESSAGE BUBBLE DENGAN CUSTOM SHOULD UPDATE
const MessageBubble = memo(({ item }: { item: MessageItem }) => {
    const isUser = item.sender === 'user'

    return (
        <View className={`my-2 mx-4 p-3 rounded-xl max-w-[80%] ${isUser
            ? 'bg-green-100 self-end rounded-br-none'
            : 'bg-gray-100 self-start rounded-bl-none'
            }`}>
            <Text className={`text-base ${isUser ? 'text-green-900' : 'text-gray-900'
                }`}>
                {item.text}
            </Text>
        </View>
    )
}, (prevProps, nextProps) => {

    return (
        prevProps.item.id === nextProps.item.id &&
        prevProps.item.sender === nextProps.item.sender &&
        prevProps.item.text === nextProps.item.text
    )
})

MessageBubble.displayName = 'MessageBubble'

export default function AiChatScreen() {
    const router = useRouter()
    const deviceId = '123123123'
    const { messages, loading, sendMessage, isSending } = useChatData(deviceId)
    const [input, setInput] = useState('')
    const flatListRef = useRef<FlatList>(null)
    const [keyboardVisible, setKeyboardVisible] = useState(false)

    // 🔥 OPTIMIZED MESSAGES REF UNTUK MENCEGAH RE-RENDER
    const messagesRef = useRef(messages)
    useEffect(() => {
        messagesRef.current = messages
    }, [messages])

    // 🔥 DETEKSI KEYBOARD
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidHide',
            () => {
                setKeyboardVisible(true)
                setTimeout(() => {
                    scrollToBottom()
                }, 300)
            }
        )

        const keyboardDidHideListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            () => {
                setKeyboardVisible(false)
            }
        )

        return () => {
            keyboardDidShowListener.remove()
            keyboardDidHideListener.remove()
        }
    }, [])

    // 🔥 OPTIMIZED SCROLL FUNCTION
    const scrollToBottom = useCallback(() => {
        if (messagesRef.current.length > 0 && flatListRef.current) {
            requestAnimationFrame(() => {
                flatListRef.current?.scrollToEnd({ animated: true })
            })
        }
    }, [])

    // 🔥 OPTIMIZED AUTOSCROLL
    useEffect(() => {
        if (messages.length > 0) {
            const timer = setTimeout(() => {
                scrollToBottom()
            }, keyboardVisible ? 350 : 100)

            return () => clearTimeout(timer)
        }
    }, [messages.length, keyboardVisible, scrollToBottom]) // 🔥 HANYA messages.length

    // 🔥 OPTIMIZED SEND MESSAGE
    const handleSend = useCallback(() => {
        if (!input.trim() || isSending) return

        sendMessage(deviceId, input)
        setInput('')

        setTimeout(() => {
            scrollToBottom()
        }, keyboardVisible ? 400 : 150)
    }, [input, isSending, sendMessage, deviceId, keyboardVisible, scrollToBottom])

    // 🔥 OPTIMIZED RENDER ITEM
    const renderItem: ListRenderItem<MessageItem> = useCallback(({ item }) => {
        return <MessageBubble item={item} />
    }, [])

    // 🔥 OPTIMIZED KEY EXTRACTOR
    const keyExtractor = useCallback((item: MessageItem) => item.id, [])

    return (
        <View className="flex-1 bg-white">
            {/* HEADER */}
            <View className="pb-12 pt-6 px-6 bg-green-600 rounded-b-2xl">
                <View className="flex-row items-center mt-5">
                    <Pressable
                        onPress={() => router.back()}
                        className="mr-4 px-1 -ml-1"
                    >
                        <Ionicons name="arrow-back" size={28} color="white" />
                    </Pressable>
                    <View>
                        <Text className="text-2xl font-bold text-white mb-1">
                            Tanya AI
                        </Text>
                        <Text className="text-base text-green-100">
                            Asisten virtual Anda
                        </Text>
                    </View>
                </View>
            </View>

            {/* 🔥 OPTIMIZED FLATLIST */}
            <View className="flex-1 -mt-8 bg-white rounded-xl mx-2">
                {loading && messages.length === 0 ? (
                    <View className="flex-1 justify-center items-center">
                        <ActivityIndicator size="large" color="#059669" />
                        <Text className="mt-2 text-gray-500">
                            Memuat percakapan...
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        keyExtractor={keyExtractor}
                        renderItem={renderItem}
                        removeClippedSubviews={true}
                        maxToRenderPerBatch={8} // 🔥 KURANGI DARI 10 KE 8
                        updateCellsBatchingPeriod={30} // 🔥 KURANGI BATCHING PERIOD
                        windowSize={11} // 🔥 KURANGI WINDOW SIZE (7 + 1 + 3)
                        initialNumToRender={8} // 🔥 KURANGI INITIAL RENDER
                        onEndReachedThreshold={0.5}
                        onContentSizeChange={() => {
                            const delay = keyboardVisible ? 400 : 100
                            setTimeout(() => {
                                scrollToBottom()
                            }, delay)
                        }}
                        onLayout={() => {
                            setTimeout(() => {
                                scrollToBottom()
                            }, 200)
                        }}
                        keyboardDismissMode="interactive"
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={{
                            paddingVertical: 10,
                            flexGrow: 1,
                            paddingBottom: keyboardVisible ? 20 : 10
                        }}
                        showsVerticalScrollIndicator={true}
                    />
                )}
            </View>

            {/* INPUT */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <View className="flex-row items-center p-3 border-t border-gray-200 bg-white">
                    <TextInput
                        className="flex-1 bg-gray-100 rounded-full px-5 py-3 text-base text-gray-900"
                        placeholder="Ketik pesan Anda..."
                        placeholderTextColor="#6B7280"
                        value={input}
                        onChangeText={setInput}
                        multiline
                        maxLength={500}
                        editable={!isSending}
                        onSubmitEditing={handleSend}
                        returnKeyType="send"
                        onFocus={() => {
                            setTimeout(() => {
                                scrollToBottom()
                            }, 500)
                        }}
                    />
                    <Pressable
                        className={`ml-3 p-3.5 rounded-full ${isSending || !input.trim()
                            ? 'bg-gray-400'
                            : 'bg-green-600'
                            }`}
                        onPress={handleSend}
                        disabled={isSending || !input.trim()}
                    >
                        {isSending ? (
                            <ActivityIndicator size="small" color="white" />
                        ) : (
                            <Ionicons name="send" size={20} color="white" />
                        )}
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </View>
    )
}