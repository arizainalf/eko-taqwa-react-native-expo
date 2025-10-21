// app/refleksi/refleksi_harian/create.tsx

import { useState } from 'react'
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    Pressable,
    Alert,
    ScrollView,
    ActivityIndicator,
    Platform,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as ImagePicker from 'expo-image-picker'
import { useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useDevice } from 'context/deviceContext'

export default function CreateRefleksiPage() {
    const [judul, setJudul] = useState('')
    const [deskripsi, setDeskripsi] = useState('')
    const [imageUri, setImageUri] = useState<string | null>(null) // Menyimpan URI gambar lokal
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const { deviceId } = useDevice()

    // 2. Fungsi untuk memilih gambar dari galeri
    const pickImage = async () => {
        // Meminta izin akses galeri
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted') {
            Alert.alert('Izin Ditolak', 'Maaf, kami memerlukan izin galeri untuk memilih gambar.')
            return
        }

        // Membuka galeri gambar
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3], // Sesuaikan aspect ratio jika perlu
            quality: 0.7,    // Kompresi gambar agar tidak terlalu besar
        })

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setImageUri(result.assets[0].uri)
        }
    }

    // 3. Fungsi untuk mengirim data ke API
    const handleSubmit = async () => {
        // Validasi input
        if (!judul || !deskripsi) {
            Alert.alert('Form Belum Lengkap', 'Judul dan deskripsi wajib diisi.')
            return
        }
        if (!deviceId) {
            Alert.alert('Error', 'Device ID tidak ditemukan. Coba muat ulang halaman.')
            return
        }

        setLoading(true)

        // API harus menerima 'multipart/form-data' untuk upload file
        const formData = new FormData()
        formData.append('judul', judul)
        formData.append('deskripsi', deskripsi)
        formData.append('device_id', deviceId)
        formData.append('tanggal', new Date().toISOString().split('T')[0]) // Format: YYYY-MM-DD

        // Menambahkan gambar ke FormData jika ada
        if (imageUri) {
            const uriParts = imageUri.split('.')
            const fileType = uriParts[uriParts.length - 1]

            // Membuat objek file yang kompatibel dengan API
            const fileToUpload = {
                uri: Platform.OS === 'android' ? imageUri : imageUri.replace('file://', ''),
                name: `photo_${Date.now()}.${fileType}`,
                type: `image/${fileType}`,
            }

            // 'gambar' harus sesuai dengan nama field yang diharapkan backend Laravel
            formData.append('gambar', fileToUpload as any)
        }

        // 4. Kirim data ke API
        try {
            const response = await fetch('https://ekotaqwa.bangkoding.my.id/api/refleksi_harian', {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'accept': 'application/json'
                },
            })

            const data = await response.json()

            if (response.ok && data.success) {
                Alert.alert('Sukses', 'Refleksi harian berhasil ditambahkan.')
                router.back() // Kembali ke halaman list
            } else {
                console.error('API Error:', data)
                Alert.alert('Gagal', data.message || 'Terjadi kesalahan saat menyimpan data.')
            }
        } catch (err) {
            console.error('Network Error:', err)
            Alert.alert('Error', 'Terjadi kesalahan jaringan. Periksa koneksi Anda.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <StatusBar style="dark" />
            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
                <View className="h-96 pb-12 pt-6 px-4 bg-green-600 rounded-b-xl">
                    <View className="flex-row items-center mt-5">
                        <Pressable
                            onPress={() => router.back()}
                            className="mr-4 px-1 -ml-1"
                        >
                            <Ionicons name="arrow-back" size={28} color="white" />
                        </Pressable>
                        <View>
                            <Text className="text-2xl font-bold text-white mb-1">
                                Refleksi Harian
                            </Text>
                            <Text className="text-base text-green-100">
                                Lihat semua refleksi harian terbaru
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Input Judul */}
                <View className='bg-white -mt-64 mx-3 rounded-md'>
                    <View className='px-4 pt-4'>
                        <Text className="text-base font-semibold text-gray-700 mb-2">Judul</Text>
                        <TextInput
                            className="bg-white border border-gray-300 rounded-lg p-3 text-base mb-4"
                            placeholder="Judul refleksi Anda"
                            value={judul}
                            multiline
                            onChangeText={setJudul}
                        />
                    </View>

                    <View className='px-4'>
                        <Text className="text-base font-semibold text-gray-700 mb-2">Deskripsi</Text>
                        <TextInput
                            className="bg-white border border-gray-300 rounded-lg p-3 text-base mb-4 h-72"
                            placeholder="Tuliskan deskripsi refleksi..."
                            value={deskripsi}
                            onChangeText={setDeskripsi}
                            multiline
                            textAlignVertical="top" // Agar kursor mulai dari atas di Android
                        />
                    </View>
                    {/* Input Deskripsi */}

                    <View className='px-4 pt-2 mb-8'>
                        <TouchableOpacity
                            onPress={pickImage}
                            className="bg-blue-100 border border-blue-300 rounded-lg p-4 items-center justify-center mb-4"
                        >
                            <Text className="text-blue-700 font-semibold">
                                {imageUri ? 'Ganti Gambar' : 'Pilih Gambar'}
                            </Text>
                        </TouchableOpacity>

                        {/* Preview Gambar */}
                        {imageUri && (
                            <View className="mb-2 items-center">
                                <Image
                                    source={{ uri: imageUri }}
                                    className="w-full aspect-[4/3] rounded-lg" // Anda bisa ganti `h-48` ke `h-64`
                                    resizeMode="cover"
                                />
                                <TouchableOpacity onPress={() => setImageUri(null)} className="m-4 flex-row items-center">
                                    <Ionicons name="trash" size={20} color="red" />
                                    <Text className="text-red-600">Hapus Gambar</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* Tombol Simpan */}
                        <TouchableOpacity
                            onPress={handleSubmit}
                            disabled={loading}
                            className={`rounded-lg p-4 items-center justify-center ${loading ? 'bg-gray-400' : 'bg-green-600'
                                }`}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text className="text-white text-lg font-bold">Simpan Refleksi</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                    {/* Tombol Pilih Gambar */}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}