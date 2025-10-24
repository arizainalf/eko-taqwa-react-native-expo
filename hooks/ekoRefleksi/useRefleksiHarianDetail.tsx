// hooks/usePostDetail.ts
import { useState, useEffect, useCallback } from 'react'
// Pastikan path import ini benar dan tipe 'Post' diekspor dari file tersebut
import { Post } from 'hooks/ekoRefleksi/useRefleksiHarianData'

const STORAGE_BASE_URL = 'https://ekotaqwa.bangkoding.my.id/storage/'
const API_URL = 'https://ekotaqwa.bangkoding.my.id/api'

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
            const res = await fetch(`${API_URL}/v1/refleksi/harian/${postId}`)
            const data = await res.json()

            if (data?.success && data.data) {
                // === MODIFIKASI DIMULAI ===
                const fetchedPost: Post = data.data

                // Cek jika post memiliki gambar, lalu gabungkan dengan URL storage
                if (fetchedPost.gambar) {
                    fetchedPost.gambar = `${STORAGE_BASE_URL}${fetchedPost.gambar}`
                }

                setPost(fetchedPost) // Set post yang sudah dimodifikasi
                // === MODIFIKASI SELESAI ===
            } else {
                setPost(null) // Set null jika tidak sukses atau data.data kosong
            }
        } catch (err) {
            console.error('Failed to fetch post detail:', err)
        } finally {
            setLoading(false)
        }
    }

    const deletePost = async (id: string) => {
        try {
            await fetch(`${API_URL}/v1/refleksi/harian/${id}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                }
            )

        } catch (error) {
            console.error('Gagal menghapus:', error)
            throw error
        }
    }

    const onRefresh = useCallback(() => {
        fetchPostDetail(true)
    }, [fetchPostDetail])

    useEffect(() => {
        if (postId) {
            fetchPostDetail()
        }
    }, [postId])




    return { post, loading , deletePost, onRefresh}
}