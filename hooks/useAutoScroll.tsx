import { useRef, useEffect } from 'react'
import { FlatList } from 'react-native'

export function useAutoScroll<T>(dependencies: T[]) {
    const flatListRef = useRef<FlatList>(null)
    const shouldAutoScrollRef = useRef(true)

    useEffect(() => {
        if (shouldAutoScrollRef.current) {
            const timer = setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true })
            }, 100)
            return () => clearTimeout(timer)
        }
    }, [dependencies])

    const handleScroll = (event: any) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent
        const isAtBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 50

        shouldAutoScrollRef.current = isAtBottom
    }

    return { flatListRef, handleScroll }
}