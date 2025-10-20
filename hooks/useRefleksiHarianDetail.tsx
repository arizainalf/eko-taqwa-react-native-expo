// hooks/usePostDetail.ts
import { useState, useEffect } from 'react'
import { Post } from 'hooks/useRefleksiHarianData'

export function usePostDetail(postId: string) {
    const [post, setPost] = useState<Post | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPostDetail = async () => {
            try {
                setLoading(true)
                const res = await fetch(`https://ekotaqwa.bangkoding.my.id/api/refleksi_harian/${postId}`)
                const data = await res.json()

                if (data?.success) {
                    setPost(data.data)
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