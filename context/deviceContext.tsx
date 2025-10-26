import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Device from 'expo-device'
import { apiGet, apiPost } from 'utils/api' 

const ASYNC_STORAGE_KEY = 'useDevice'

type DeviceData = {
    name: string | null
    deviceId: string | null
}

type DeviceContextType = DeviceData & {
    isLoading: boolean
    saveDeviceData: (name: string) => Promise<void>
    fetchDeviceData: () => Promise<void>
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined)

export function DeviceProvider({ children }: { children: ReactNode }) {
    const [isLoading, setIsLoading] = useState(true)
    const [name, setName] = useState<string | null>(null)
    const [deviceId, setDeviceId] = useState<string | null>(null)

    // === LOAD dari local storage saat awal ===
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
                console.error('Failed to load device data', e)
            } finally {
                setIsLoading(false)
            }
        }
        loadDeviceData()
    }, [])

    // === AMBIL DATA DEVICE DARI SERVER ===
    const fetchDeviceData = async () => {
        try {
            const currentDeviceId = Device.osBuildId ?? 'unknown'
            const response = await apiGet<{ name: string; device_id: string }>(
                `/v1/device/${currentDeviceId}`
            )
            if (response) {
                setName(response.name)
                setDeviceId(response.device_id)
                await AsyncStorage.setItem(
                    ASYNC_STORAGE_KEY,
                    JSON.stringify({
                        name: response.name,
                        deviceId: response.device_id,
                    })
                )
            }
        } catch (error) {
            console.error('Failed to fetch device data:', error)
        }
    }

    // === SIMPAN / REGISTER DEVICE KE SERVER ===
    const saveDeviceData = async (newName: string) => {
        const currentDeviceId = Device.osBuildId ?? 'unknown'

        try {
            const data = await apiPost<{ success: boolean; message: string }>(
                '/v1/device/create',
                {
                    name: newName,
                    device_id: currentDeviceId,
                }
            )

            if (!data) {
                throw new Error('Gagal menyimpan data perangkat.')
            }

            const deviceData: DeviceData = {
                name: newName,
                deviceId: currentDeviceId,
            }

            await AsyncStorage.setItem(
                ASYNC_STORAGE_KEY,
                JSON.stringify(deviceData)
            )
            setName(deviceData.name)
            setDeviceId(deviceData.deviceId)
        } catch (e) {
            console.error('Failed to save device data:', e)
            throw e
        }
    }

    return (
        <DeviceContext.Provider
            value={{ isLoading, name, deviceId, saveDeviceData, fetchDeviceData }}
        >
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
