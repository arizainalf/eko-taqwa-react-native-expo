import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

export default function RootLayout() {

    return (
        <>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="kuis" />
                <Stack.Screen name="refleksi_harian" />
                <Stack.Screen name="chat" />
            </Stack>
            <StatusBar style="auto" />
        </>
    )
}

