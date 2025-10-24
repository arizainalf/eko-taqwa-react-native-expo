// hooks/usePostDetail.ts
import { useState, useEffect, useCallback } from 'react'
import { apiGet, apiDelete, STORAGE_BASE_URL } from 'utils/api'
import { Post } from 'hooks/ekoRefleksi/useRefleksiHarianData'

interface PostDetailResponse {
    success: boolean;
    code: number;
    message: string;
    data: Post;
    timestamp: string;
}

export function usePostDetail(postId: string) {
    const [post, setPost] = useState<Post | null>(null)
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    const fetchPostDetail = async (isRefreshing = false) => {
        try {
            if (isRefreshing) {
                setRefreshing(true)
            } else {
                setLoading(true)
            }

            // Gunakan apiGet dari utils dengan type yang spesifik
            const data = await apiGet<PostDetailResponse['data']>(`/v1/refleksi/harian/${postId}`)

            if (data) {
                const fetchedPost: Post = data

                // Cek jika post memiliki gambar, lalu gabungkan dengan URL storage
                if (fetchedPost.gambar) {
                    fetchedPost.gambar = `${STORAGE_BASE_URL}${fetchedPost.gambar}`
                }

                setPost(fetchedPost) // Set post yang sudah dimodifikasi
            } else {
                setPost(null) // Set null jika tidak sukses atau data.data kosong
            }
        } catch (err) {
            console.error('Failed to fetch post detail:', err)
            setPost(null) // Pastikan set null jika error
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

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
        if (postId) {
            fetchPostDetail(true)
        }
    }, [postId, fetchPostDetail])

    useEffect(() => {
        if (postId) {
            fetchPostDetail()
        }
    }, [postId])

    return {
        post,
        loading,
        refreshing,
        deletePost,
        onRefresh,
        refetch: () => fetchPostDetail(true) // Optional: tambahkan refetch function
    }
}