import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Device from 'expo-device'

const ASYNC_STORAGE_KEY = 'useDevice'
// Ganti dengan URL API Anda
const API_BASE_URL = 'https://ekotaqwa.bangkoding.my.id/api'

type DeviceData = {
    name: string | null
    deviceId: string | null
}

type DeviceContextType = DeviceData & {
    isLoading: boolean
    saveDeviceData: (name: string) => Promise<void>
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined)

export function DeviceProvider({ children }: { children: ReactNode }) {
    const [isLoading, setIsLoading] = useState(true)
    const [name, setName] = useState<string | null>(null)
    const [deviceId, setDeviceId] = useState<string | null>(null)

    useEffect(() => {
        const loadDeviceData = async () => {
            try {
                const dataString = await AsyncStorage.getItem(ASYNC_STORAGE_KEY)
                if (dataString) {
                    const data: DeviceData = JSON.parse(dataString)
                    setName(data.name)
                    setDeviceId(data.deviceId)
                }
            } catch (e) {
                console.error('Failed to load user data', e)
            } finally {
                setIsLoading(false)
            }
        }
        loadDeviceData()
    }, [])

    // === FUNGSI INI DIUBAH ===
    const saveDeviceData = async (newName: string) => {
        // 1. Dapatkan Device ID terlebih dahulu
        const currentDeviceId = Device.osBuildId ?? 'unknown'

        try {
            // 2. Kirim data ke API Laravel Anda
            const response = await fetch(`${API_BASE_URL}/device/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    name: newName,
                    device_id: currentDeviceId,
                }),
            })

            const data = await response.json()

            // 3. Cek jika API gagal (misal: validasi 'name' unique gagal)
            if (!response.ok || !data.success) {
                // Cek jika ada error validasi spesifik dari Laravel
                if (data.errors && data.errors.name) {
                    throw new Error(data.errors.name[0]) // Cth: "The name has already been taken."
                }
                // Error umum dari API
                throw new Error(data.message || 'Gagal mendaftarkan perangkat.')
            }

            // 4. JIKA API SUKSES, baru simpan ke AsyncStorage
            const deviceData: DeviceData = { name: newName, deviceId: currentDeviceId }
            await AsyncStorage.setItem(ASYNC_STORAGE_KEY, JSON.stringify(deviceData))

            // 5. Update state di aplikasi
            setName(deviceData.name)
            setDeviceId(deviceData.deviceId)

        } catch (e) {
            console.error('Failed to save user data:', e)
            // Lempar error agar bisa ditangkap oleh halaman RegisterScreen
            // dan ditampilkan di Alert
            throw e
        }
    }
    // === BATAS PERUBAHAN ===

    return (
        <DeviceContext.Provider value={{ isLoading, name, deviceId, saveDeviceData }}>
            {children}
        </DeviceContext.Provider>
    )
}

export function useDevice() {
    const context = useContext(DeviceContext)
    if (context === undefined) {
        throw new Error('useDevice must be used within a DeviceProvider')
    }
    return context
}