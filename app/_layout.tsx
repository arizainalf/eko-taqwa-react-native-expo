import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useState } from 'react'
import { View, ActivityIndicator, Text, Image } from 'react-native'
import '../global.css'

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) return <LoadingScreen />

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="tema" />
        <Stack.Screen name="kuis" />
        <Stack.Screen name="video" />
      </Stack>
      <StatusBar style="auto" />
    </>
  )
}

function LoadingScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-white px-5">
      <View className="items-center mb-12">
        <Image
          source={require('../assets/logo.png')}
          className="w-[100px] h-[100px]"
        />
        <Text className="text-base text-gray-500 text-center mt-3">
          Memulai Perubahan Kecil, Mencipta Lingkungan Lestari.
        </Text>
      </View>

      <ActivityIndicator size="large" color="#16A34A" />

      <Text className="mt-5 text-base text-gray-500">
        Memuat aplikasi...
      </Text>
    </View>
  )
}
