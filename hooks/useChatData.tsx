import { useState, useEffect, useCallback } from 'react'

export function useChatData(deviceId: string) {
    const [messages, setMessages] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [isSending, setIsSending] = useState(false)

    const API_URL = 'https://ekotaqwa.bangkoding.my.id/api/tanya_jawab'

    const fetchMessages = useCallback(async () => {
        try {
            setLoading(true)
            const res = await fetch(`${API_URL}/${deviceId}`)
            const data = await res.json()

            if (data?.success) {
                const formatted = data.data.map((item: any) => [
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

            const res = await fetch(`${API_URL}/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    device_id: deviceId,
                    message: text,
                }),
            })

            const result = await res.json()
            if (result?.data?.reply) {
                const botMessage = {
                    id: `bot-${Date.now()}-${Math.random()}`,
                    sender: 'bot' as const,
                    text: result.data.reply
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