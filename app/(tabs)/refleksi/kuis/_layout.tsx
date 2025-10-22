import { Stack, useRouter, useNavigation } from 'expo-router'
import { Alert } from 'react-native'
import { NavigationAction } from '@react-navigation/native'

export default function KuisStackLayout() {
    const navigation = useNavigation()
    const router = useRouter;
    return (
        <Stack screenOptions={{
            headerShown: false, // <-- Menyembunyikan header (termasuk tombol back)
            gestureEnabled: false, // <-- Mencegah swipe kembali di iOS
        }}>
            <Stack.Screen name="index" />
            {/* Halaman [id].tsx (detail) juga diatur di sini */}
            <Stack.Screen
                name="[id]"
                options={{
                    gestureEnabled: true,
                }}
            />
        </Stack>
    )
}