// hooks/usePostsData.ts
import { useState, useEffect, useCallback } from 'react'
import { apiGet, apiDelete, STORAGE_BASE_URL } from 'utils/api' // Import utils API

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

export interface ApiResponse {
    success: boolean;
    code: number;
    message: string;
    data: Post[]; // Diubah karena response /v1/refleksi/harian mengembalikan array
    timestamp: string;
}

export function usePostsData(currentDeviceId: string) {
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    const fetchPosts = useCallback(async (isRefreshing = false) => {
        try {
            if (isRefreshing) {
                setRefreshing(true)
            } else {
                setLoading(true)
            }

            // Gunakan apiGet dari utils
            const data = await apiGet('/v1/refleksi/harian') as ApiResponse['data']

            if (data) {
                // 1. Urutkan posts
                const sortedPosts: Post[] = data.sort((a: Post, b: Post) => {
                    if (a.device_id === currentDeviceId && b.device_id !== currentDeviceId) {
                        return -1
                    }
                    if (b.device_id === currentDeviceId && a.device_id !== currentDeviceId) {
                        return 1
                    }
                    return new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
                })

                // 2. Ubah path gambar menjadi URL lengkap
                const postsWithFullImageUrls = sortedPosts.map(post => {
                    if (post.gambar) {
                        return {
                            ...post,
                            gambar: `${STORAGE_BASE_URL}${post.gambar}`
                        }
                    }
                    return post
                })

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

    const deletePost = async (id: string) => {
        try {
            // Gunakan apiDelete dari utils
            await apiDelete(`/v1/refleksi/harian/${id}`)
        } catch (error) {
            console.error('Gagal menghapus:', error)
            throw error
        }
    }

    const onRefresh = useCallback(() => {
        fetchPosts(true)
    }, [fetchPosts])

    useEffect(() => {
        fetchPosts()
    }, [fetchPosts])

    return { posts, loading, refreshing, fetchPosts, onRefresh, deletePost }
}