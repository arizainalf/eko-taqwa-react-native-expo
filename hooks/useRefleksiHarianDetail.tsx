// hooks/usePostDetail.ts
import { useState, useEffect } from 'react'
// Pastikan path import ini benar dan tipe 'Post' diekspor dari file tersebut
import { Post } from 'hooks/useRefleksiHarianData'

const STORAGE_BASE_URL = 'https://ekotaqwa.bangkoding.my.id/storage/'

export function usePostDetail(postId: string) {
    const [post, setPost] = useState<Post | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPostDetail = async () => {
            try {
                setLoading(true)
                const res = await fetch(`https://ekotaqwa.bangkoding.my.id/api/refleksi_harian/${postId}`)
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

        if (postId) {
            fetchPostDetail()
        }
    }, [postId])

    return { post, loading }
}