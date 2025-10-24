import { useState, useEffect, useCallback } from 'react'
import { apiGet, apiPost } from 'utils/api'

export function useChatData(deviceId: string) {
    const [messages, setMessages] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [isSending, setIsSending] = useState(false)

    const API_URL = 'https://ekotaqwa.bangkoding.my.id/api'

    const fetchMessages = useCallback(async () => {
        try {
            setLoading(true)
            const data = await apiGet<any>(`/v1/refleksi/chat/${deviceId}`)

            if (data) {
                const formatted = data.map((item: any) => [
                    {
                        id: `${item.id}-user`,
                        sender: 'user' as const,
                        text: item.pesan
                    },
                    {
                        id: `${item.id}-ai`,
                        sender: 'bot' as const,
                        text: item.jawaban
                    },
                ]).flat()
                setMessages(formatted)
            }
        } catch (err) {
            console.error('Failed to fetch messages:', err)
        } finally {
            setLoading(false)
        }
    }, [deviceId])

    const sendMessage = useCallback(async (deviceId: string, text: string) => {
        try {
            setIsSending(true)

            // Tambah pesan user langsung tampil
            const userMessage = {
                id: `user-${Date.now()}-${Math.random()}`,
                sender: 'user' as const,
                text
            }

            setMessages(prev => [...prev, userMessage])

            const result = await apiPost('/v1/refleksi/chat/send', {
                device_id: deviceId,
                message: text,
            }) as any
            if (result?.reply) {
                const botMessage = {
                    id: `bot-${Date.now()}-${Math.random()}`,
                    sender: 'bot' as const,
                    text: result.reply
                }
                setMessages(prev => [...prev, botMessage])
            }

        } catch (err) {
            console.error('Failed to send message:', err)
            // Tambahkan pesan error
            const errorMessage = {
                id: `error-${Date.now()}-${Math.random()}`,
                sender: 'bot' as const,
                text: 'Maaf, terjadi kesalahan. Silakan coba lagi.'
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setIsSending(false)
        }
    }, [])

    useEffect(() => {
        if (deviceId) fetchMessages()
    }, [deviceId, fetchMessages])

    return { messages, loading, isSending, sendMessage, fetchMessages }
}