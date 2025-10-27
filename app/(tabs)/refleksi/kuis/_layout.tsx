import { Stack } from 'expo-router'

export default function KuisStackLayout() {
    return (
        <Stack screenOptions={{
            headerShown: false,
            gestureEnabled: false,
        }}>
            <Stack.Screen name="index" />
            <Stack.Screen
                name="[id]"
                options={{
                    gestureEnabled: true,
                }}
            />
        </Stack>
    )
}