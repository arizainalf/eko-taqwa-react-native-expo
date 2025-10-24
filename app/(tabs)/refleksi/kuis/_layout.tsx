import { Stack, useRouter, useNavigation } from 'expo-router'
import { Alert } from 'react-native'
import { NavigationAction } from '@react-navigation/native'

export default function KuisStackLayout() {
    const navigation = useNavigation()
    const router = useRouter;
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