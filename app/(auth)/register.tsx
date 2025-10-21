import { useState } from 'react'
import { View, Text, Image, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useDevice } from 'context/deviceContext'

export default function RegisterScreen() {
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const { saveDeviceData } = useDevice() // Ambil fungsi save dari Context

    const handleSave = async () => {
        if (name.trim().length < 3) {
            Alert.alert('Nama Terlalu Pendek', 'Mohon masukkan nama Anda (min. 3 huruf).')
            return
        }

        setLoading(true)
        try {
            await saveDeviceData(name.trim())
            // Navigasi akan ditangani oleh Root Layout
        } catch (e) {
            Alert.alert('Error', 'Gagal menyimpan nama.')
            setLoading(false)
        }
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-100 justify-center p-6">
            <View className="bg-white p-6 rounded-lg shadow-md">
                <View className='items-center'>
                <Image
                    // Gunakan require() untuk gambar lokal
                    source={require('assets/logo.png')} 
                    // Tambahkan styling agar ukuran gambar pas
                    className="w-24 h-24 mb-6" 
                    resizeMode="contain" // Pastikan gambar tidak terpotong
                />
                </View>
                <Text className="text-2xl font-bold text-center mb-5">Selamat Datang!</Text>
                <Text className="text-base text-gray-600 text-center mb-6">
                    Mohon masukkan nama Anda untuk melanjutkan.
                </Text>

                <TextInput
                    className="bg-gray-50 border border-gray-300 rounded-lg p-3 text-base mb-5"
                    placeholder="Masukkan nama Anda..."
                    value={name}
                    onChangeText={setName}
                />

                <TouchableOpacity
                    onPress={handleSave}
                    disabled={loading}
                    className={`rounded-lg p-4 items-center justify-center ${loading ? 'bg-gray-400' : 'bg-green-600'
                        }`}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text className="text-white text-lg font-bold">Simpan & Masuk</Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}