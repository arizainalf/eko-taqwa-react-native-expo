// hooks/usePostsData.ts
import { useState, useEffect, useCallback } from 'react'


export interface Device {
    id: string
    device_id: string
    name: string;
}

export type Post = {
    id: string
    device_id: string
    gambar: string | null
    judul: string
    device: Device;
    deskripsi: string | null
    tanggal: string
    created_at: Date
    updated_at: Date
}

// === TAMBAHKAN BASE URL UNTUK STORAGE ===
// Asumsi Anda sudah menjalankan `php artisan storage:link` di backend Laravel
const STORAGE_BASE_URL = 'https://ekotaqwa.bangkoding.my.id/storage/'

export function usePostsData(currentDeviceId: string) {
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    const API_URL = 'https://ekotaqwa.bangkoding.my.id/api/refleksi_harian'

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
                // 1. Urutkan posts
                const sortedPosts: Post[] = data.data.sort((a: Post, b: Post) => {
                    if (a.device_id === currentDeviceId && b.device_id !== currentDeviceId) {
                        return -1
                    }
                    if (b.device_id === currentDeviceId && a.device_id !== currentDeviceId) {
                        return 1
                    }
                    return new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
                })

                // === 2. MODIFIKASI: Ubah path gambar menjadi URL lengkap ===
                const postsWithFullImageUrls = sortedPosts.map(post => {
                    // Cek jika 'gambar' ada dan tidak null/kosong
                    if (post.gambar) {
                        return {
                            ...post,
                            // Gabungkan base URL storage dengan path gambar dari API
                            gambar: `${STORAGE_BASE_URL}${post.gambar}`
                        }
                    }
                    return post // Kembalikan post apa adanya jika tidak ada gambar
                })
                // === Selesai Modifikasi ===

                // 3. Simpan data yang sudah dimodifikasi ke state
                setPosts(postsWithFullImageUrls)
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