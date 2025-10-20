// hooks/usePostsData.ts
import { useState, useEffect, useCallback } from 'react'

export type Post = {
    id: string
    device_id: string
    gambar: string | null
    judul: string
    deskripsi: string | null
    tanggal: string
    created_at: Date
    updated_at: Date
}

export function usePostsData(currentDeviceId: string) {
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    const API_URL = 'https://ekotaqwa.bangkoding.my.id/api/refleksi_harian' // Ganti dengan endpoint Anda

    const fetchPosts = useCallback(async (isRefreshing = false) => {
        try {
            if (isRefreshing) {
                setRefreshing(true)
            } else {
                setLoading(true)
            }

            const res = await fetch(API_URL)
            const data = await res.json()

            if (data?.success) {
                // Urutkan posts: device_id yang sama di atas, lalu yang lain
                const sortedPosts = data.data.sort((a: Post, b: Post) => {
                    // Jika a device_id sama dengan current, prioritas tinggi
                    if (a.device_id === currentDeviceId && b.device_id !== currentDeviceId) {
                        return -1
                    }
                    // Jika b device_id sama dengan current, prioritas tinggi  
                    if (b.device_id === currentDeviceId && a.device_id !== currentDeviceId) {
                        return 1
                    }
                    // Jika sama-sama sama atau sama-sama beda, urutkan berdasarkan tanggal terbaru
                    return new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
                })

                setPosts(sortedPosts)
            }
        } catch (err) {
            console.error('Failed to fetch posts:', err)
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }, [currentDeviceId])

    const onRefresh = useCallback(() => {
        fetchPosts(true)
    }, [fetchPosts])

    useEffect(() => {
        fetchPosts()
    }, [fetchPosts])

    return { posts, loading, refreshing, fetchPosts, onRefresh }
}