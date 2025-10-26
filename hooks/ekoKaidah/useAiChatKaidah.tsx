import { useState, useEffect, useCallback } from 'react'
import { apiGet } from 'utils/api'

type ChatMessage = {
    id: string
    sender: 'user' | 'bot'
    text: string
}

export function useEkoKaidahChatData(temaId: string, deviceId: string) {
    const [messages, setMessages] = useState<ChatMessage[]>([])
        const [loading, setLoading] = useState(false)
        const [isSending, setIsSending] = useState(false)
    
        /**
         * Ambil semua pesan refleksi berdasarkan deviceId
         */
        const fetchMessages = useCallback(async () => {
            if (!deviceId) return
            setLoading(true)
    
            try {
                const data = await apiGet<any[]>(`/v1/kaidah/tema/${temaId}/chat/${deviceId}`)
    
                if (Array.isArray(data)) {
                    const formatted = data
                        .map((item) => [
                            {
                                id: `${item.id}-bot`,
                                sender: 'bot' as const,
                                text: item.jawaban,
                            },
                        ])
                        .flat()
    
                    setMessages(formatted)
                }
            } catch (err) {
                console.error('❌ Failed to fetch messages:', err)
            } finally {
                setLoading(false)
            }
        }, [deviceId])
    
        /**
         * Kirim pesan ke server dan tampilkan respons bot
         */
        const sendMessage = useCallback(async (jenis: string) => {
            if (!deviceId) return
    
            setIsSending(true)
    
            try {
                const result = await apiGet<{ reply?: string }>(
                    `/v1/kaidah/tema/${temaId}/chat/${deviceId}/send-message/${jenis}`
                )
    
                if (result?.reply) {
                    const botMessage: ChatMessage = {
                        id: `bot-${Date.now()}`,
                        sender: 'bot',
                        text: result.reply,
                    }
                    setMessages((prev) => [...prev, botMessage])
                }
            } catch (err) {
                console.error('❌ Failed to send message:', err)
                const errorMessage: ChatMessage = {
                    id: `error-${Date.now()}`,
                    sender: 'bot',
                    text: 'Maaf, terjadi kesalahan. Silakan coba lagi.',
                }
                setMessages((prev) => [...prev, errorMessage])
            } finally {
                setIsSending(false)
            }
        }, [deviceId])
    
        /**
         * Auto-fetch saat deviceId berubah
         */
        useEffect(() => {
            fetchMessages()
        }, [fetchMessages])
    
        return { messages, loading, isSending, sendMessage, fetchMessages }
}
