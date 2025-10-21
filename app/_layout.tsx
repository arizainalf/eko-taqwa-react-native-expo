// app/_layout.tsx

import { Stack, useRouter, useSegments } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import * as SplashScreen from 'expo-splash-screen'

// Impor Context dan Hook yang sudah dibuat
import { DeviceProvider, useDevice } from 'context/deviceContext'

// Impor file CSS global Anda
import '../global.css'

// 1. Jaga agar Splash Screen tetap terlihat saat aplikasi memuat
SplashScreen.preventAutoHideAsync()

// 2. Buat komponen navigasi terpisah yang akan dibungkus oleh Provider
function RootLayoutNav() {
  // Ambil status loading dan nama pengguna dari Context
  const { isLoading, name } = useDevice()
  const router = useRouter()
  const segments = useSegments()

  useEffect(() => {
    // Jika masih dalam proses memuat data dari AsyncStorage, jangan lakukan apa-apa
    if (isLoading) {
      return
    }

    // Cek apakah pengguna sedang berada di dalam grup (auth)
    const inAuthGroup = segments[0] === '(auth)'

    if (name && inAuthGroup) {
      // KASUS 1: Pengguna SUDAH punya nama, TAPI masih di halaman auth (register).
      // Arahkan ke halaman utama (tabs).
      router.replace('/(tabs)')
    } else if (!name && !inAuthGroup) {
      // KASUS 2: Pengguna BELUM punya nama, TAPI tidak di halaman auth.
      // Paksa pengguna ke halaman register.
      router.replace('/(auth)/register')
    }

    // 3. Setelah semua logika selesai, sembunyikan Splash Screen
    SplashScreen.hideAsync()
  }, [isLoading, name, segments, router])

  // Selama loading, tampilkan null. Splash Screen bawaan akan terlihat.
  if (isLoading) {
    return null
  }

  // Setelah selesai loading, tampilkan navigator utama
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Rute-rute yang sudah Anda miliki */}
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="tema" />
        <Stack.Screen name="kuis" />
        <Stack.Screen name="video" />
        {/* TAMBAHKAN rute untuk grup auth */}
        <Stack.Screen name="(auth)" />
      </Stack>
      <StatusBar style="auto" />
    </>
  )
}

// 4. Ini adalah komponen utama yang diekspor
export default function RootLayout() {
  // Bungkus seluruh aplikasi dengan DeviceProvider agar semua halaman
  // bisa mengakses data pengguna (nama & deviceId)
  return (
    <DeviceProvider>
      <RootLayoutNav />
    </DeviceProvider>
  )
}