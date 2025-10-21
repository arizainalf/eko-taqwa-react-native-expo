import { Stack } from 'expo-router'

export default function AuthLayout() {
    // Sembunyikan header untuk grup ini
    return <Stack screenOptions={{ headerShown: false }} />
}