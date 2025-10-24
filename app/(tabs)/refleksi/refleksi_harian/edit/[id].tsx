import { useState, useEffect } from 'react'
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
    Modal,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as ImagePicker from 'expo-image-picker'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useDevice } from 'context/deviceContext'

export default function EditRefleksiPage() {
    const [tanggal, setTanggal] = useState(new Date())
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [judul, setJudul] = useState('')
    const [deskripsi, setDeskripsi] = useState('')
    const [imageUri, setImageUri] = useState<string | null>(null)
    const [originalImageUri, setOriginalImageUri] = useState<string | null>(null)
    const [imageAction, setImageAction] = useState<'keep' | 'update' | 'remove'>('keep')
    const [loading, setLoading] = useState(false)
    const [loadingData, setLoadingData] = useState(true)

    const router = useRouter()
    const { id } = useLocalSearchParams()
    const { deviceId } = useDevice()

    const API_URL = `https://ekotaqwa.bangkoding.my.id/api/v1/refleksi/harian/${id}`

    // Generate data untuk date picker
    const days = Array.from({ length: 31 }, (_, i) => i + 1)
    const months = [
        { name: 'Januari', value: 0 },
        { name: 'Februari', value: 1 },
        { name: 'Maret', value: 2 },
        { name: 'April', value: 3 },
        { name: 'Mei', value: 4 },
        { name: 'Juni', value: 5 },
        { name: 'Juli', value: 6 },
        { name: 'Agustus', value: 7 },
        { name: 'September', value: 8 },
        { name: 'Oktober', value: 9 },
        { name: 'November', value: 10 },
        { name: 'Desember', value: 11 }
    ]
    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: 10 }, (_, i) => currentYear - i + 5)

    const formatTanggal = (date: Date) => {
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    // Format tanggal untuk API (YYYY-MM-DD)
    const formatTanggalForAPI = (date: Date) => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
    }

    const updateDate = (type: 'day' | 'month' | 'year', value: number) => {
        const newDate = new Date(tanggal)
        if (type === 'day') newDate.setDate(value)
        if (type === 'month') newDate.setMonth(value)
        if (type === 'year') newDate.setFullYear(value)
        setTanggal(newDate)
    }

    const showPicker = () => {
        setShowDatePicker(true)
    }

    const confirmDate = () => {
        setShowDatePicker(false)
    }

    // 🔹 Load data lama
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(API_URL)
                const data = await res.json()


                if (res.ok && data.success && data.data) {
                    const refleksi = data.data
                    setJudul(refleksi.judul || '')
                    setDeskripsi(refleksi.deskripsi || '')

                    const fullImageUrl = refleksi.gambar ?
                        (refleksi.gambar.startsWith('http') ? refleksi.gambar : `https://ekotaqwa.bangkoding.my.id/storage/${refleksi.gambar}`)
                        : null

                    setImageUri(fullImageUrl)
                    setOriginalImageUri(fullImageUrl)
                    setImageAction('keep')


                    // Set tanggal dari data API
                    if (refleksi.tanggal) {
                        const apiDate = new Date(refleksi.tanggal)
                        setTanggal(apiDate)
                    }
                } else {
                    Alert.alert('Gagal', 'Tidak dapat memuat data refleksi.')
                    router.back()
                }
            } catch (error) {
                Alert.alert('Error', 'Gagal memuat data refleksi.')
                router.back()
            } finally {
                setLoadingData(false)
            }
        }

        fetchData()
    }, [id])

    // 🔹 Pilih gambar
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted') {
            Alert.alert('Izin Ditolak', 'Kami memerlukan izin untuk mengakses galeri.')
            return
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
        })

        if (!result.canceled && result.assets.length > 0) {
            setImageUri(result.assets[0].uri)
            setImageAction('update')
        }
    }

    // 🔹 Hapus gambar
    const removeImage = () => {
        setImageUri(null)
        setImageAction('remove')
    }

    // 🔹 Simpan perubahan - FIX BOOLEAN VALIDATION ERROR
    const handleUpdate = async () => {
        if (!judul) {
            Alert.alert('Form Belum Lengkap', 'Judul dan deskripsi wajib diisi.')
            return
        }

        if (!deviceId) {
            Alert.alert('Error', 'Device ID tidak ditemukan.')
            return
        }

        setLoading(true)

        const formData = new FormData()
        formData.append('judul', judul)
        formData.append('deskripsi', deskripsi)
        formData.append('tanggal', formatTanggalForAPI(tanggal))
        formData.append('_method', 'PUT')

        try {
            // 1. Handle penghapusan gambar - kirim hapus_gambar sebagai boolean
            if (imageAction === 'remove' && originalImageUri) {
                // Kirim sebagai boolean (1/0) bukan string
                formData.append('hapus_gambar', '1') // Laravel akan convert '1' ke boolean true
            }

            // 2. Handle upload gambar baru
            if (imageAction === 'update' && imageUri && !imageUri.startsWith('http')) {
                const uriParts = imageUri.split('.')
                const fileType = uriParts[uriParts.length - 1]

                formData.append('gambar', {
                    uri: Platform.OS === 'android' ? imageUri : imageUri.replace('file://', ''),
                    name: `photo_${Date.now()}.${fileType}`,
                    type: `image/${fileType}`,
                } as any)
            }

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'accept': 'application/json',
                },
                body: formData,
            })


            const data = await response.json()

            if (response.ok && data.success) {
                Alert.alert('Sukses', 'Refleksi berhasil diperbarui.')
                router.back()
            } else {
                if (data.errors) {
                    const errorMessages = Object.values(data.errors).flat().join('\n')
                    Alert.alert('Validasi Gagal', errorMessages)
                } else {
                    Alert.alert('Gagal', data.message || 'Terjadi kesalahan saat update.')
                }
            }
        } catch (err: any) {
            if (err.message?.includes('Network request failed')) {
                Alert.alert(
                    'Koneksi Gagal',
                    'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.'
                )
            } else {
                Alert.alert('Error', 'Gagal memperbarui data: ' + (err.message || 'Unknown error'))
            }
        } finally {
            setLoading(false)
        }
    }

    // 🔹 Loading awal data
    if (loadingData) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-50">
                <ActivityIndicator size="large" color="#059669" />
                <Text className="text-gray-600 mt-2">Memuat data refleksi...</Text>
            </View>
        )
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <StatusBar style="dark" />
            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
                <View className="h-96 pb-12 pt-6 px-4 bg-green-600 rounded-b-xl">
                    <View className="flex-row items-center mt-5">
                        <Pressable onPress={() => router.back()} className="mr-4 px-1 -ml-1">
                            <Ionicons name="arrow-back" size={28} color="white" />
                        </Pressable>
                        <View>
                            <Text className="text-2xl font-bold text-white mb-1">Edit Refleksi</Text>
                            <Text className="text-base text-green-100">Perbarui refleksi harian Anda</Text>
                        </View>
                    </View>
                </View>

                <View className="bg-white -mt-64 mx-3 rounded-md">

                    {/* Input Tanggal */}
                    <View className='px-4 pt-4'>
                        <Text className="text-base font-semibold text-gray-700 mb-2">Tanggal Refleksi</Text>
                        <TouchableOpacity
                            onPress={showPicker}
                            className="bg-white border border-gray-300 rounded-lg p-3 flex-row justify-between items-center mb-4"
                        >
                            <Text className="text-base text-gray-800">
                                {formatTanggal(tanggal)}
                            </Text>
                            <Ionicons name="calendar-outline" size={20} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    {/* Input Judul */}
                    <View className="px-4">
                        <Text className="text-base font-semibold text-gray-700 mb-2">Judul Refleksi</Text>
                        <TextInput
                            className="bg-white border border-gray-300 rounded-lg p-3 text-base mb-4"
                            placeholder="Judul refleksi Anda"
                            value={judul}
                            onChangeText={setJudul}
                            multiline
                        />
                    </View>

                    {/* Input Deskripsi */}
                    <View className="px-4">
                        <Text className="text-base font-semibold text-gray-700 mb-2">Deskripsi Refleksi</Text>
                        <TextInput
                            className="bg-white border border-gray-300 rounded-lg p-3 text-base mb-4 h-72"
                            placeholder="Tuliskan deskripsi refleksi..."
                            value={deskripsi}
                            onChangeText={setDeskripsi}
                            multiline
                            textAlignVertical="top"
                        />
                    </View>

                    {/* Pilih / Preview Gambar */}
                    <View className="px-4 pt-2 mb-8">
                        <Text className="text-base font-semibold text-gray-700 mb-2">Gambar Refleksi</Text>

                        <TouchableOpacity
                            onPress={pickImage}
                            className="bg-blue-100 border border-blue-300 rounded-lg p-4 items-center justify-center mb-4"
                        >
                            <Text className="text-blue-700 font-semibold">
                                {imageUri ? 'Ganti Gambar' : 'Pilih Gambar (Opsional)'}
                            </Text>
                        </TouchableOpacity>

                        {/* Tampilkan gambar yang aktif */}
                        {imageUri && (
                            <View className="mb-4 items-center">
                                <Image
                                    source={{ uri: imageUri }}
                                    className="w-full aspect-[4/3] rounded-lg"
                                    resizeMode="cover"
                                />
                                <TouchableOpacity
                                    onPress={removeImage}
                                    className="mt-3 flex-row items-center bg-red-50 px-4 py-2 rounded-lg border border-red-200"
                                >
                                    <Ionicons name="trash-outline" size={18} color="red" />
                                    <Text className="text-red-600 ml-2 font-medium">
                                        Hapus Gambar
                                    </Text>
                                </TouchableOpacity>

                                {imageUri.startsWith('http') ? (
                                    <Text className="text-gray-500 text-sm mt-2 text-center">
                                        Gambar saat ini
                                    </Text>
                                ) : (
                                    <Text className="text-green-600 text-sm mt-2 text-center">
                                        Gambar baru yang akan diupload
                                    </Text>
                                )}
                            </View>
                        )}

                        {!imageUri && originalImageUri && (
                            <View className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                <Text className="text-yellow-700 text-sm text-center">
                                    Gambar akan dihapus dari server ketika disimpan
                                </Text>
                            </View>
                        )}

                        {/* Tombol Simpan */}
                        <TouchableOpacity
                            onPress={handleUpdate}
                            disabled={loading}
                            className={`rounded-lg p-4 items-center justify-center ${loading ? 'bg-gray-400' : 'bg-green-600'
                                }`}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text className="text-white text-lg font-bold">Perbarui Refleksi</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Custom Date Picker Modal */}
                <Modal
                    visible={showDatePicker}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setShowDatePicker(false)}
                >
                    <View className="flex-1 justify-end bg-black/50">
                        <View className="bg-white rounded-t-3xl max-h-3/4">
                            {/* Header */}
                            <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
                                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                                    <Text className="text-red-600 font-semibold text-lg">Batal</Text>
                                </TouchableOpacity>
                                <Text className="text-lg font-semibold">Pilih Tanggal Refleksi</Text>
                                <TouchableOpacity onPress={confirmDate}>
                                    <Text className="text-green-600 font-semibold text-lg">Pilih</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Date Selector */}
                            <View className="flex-row p-4" style={{ maxHeight: 300 }}>
                                {/* Days */}
                                <View className="flex-1">
                                    <Text className="text-center font-semibold mb-2 text-gray-700">Hari</Text>
                                    <ScrollView
                                        showsVerticalScrollIndicator={false}
                                        contentContainerStyle={{ paddingHorizontal: 4 }}
                                    >
                                        {days.map(day => (
                                            <TouchableOpacity
                                                key={day}
                                                onPress={() => updateDate('day', day)}
                                                className={`py-3 px-2 rounded-lg m-1 ${tanggal.getDate() === day ? 'bg-green-500' : 'bg-gray-100'
                                                    }`}
                                            >
                                                <Text className={`text-center font-medium ${tanggal.getDate() === day ? 'text-white' : 'text-gray-800'
                                                    }`}>
                                                    {day}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>

                                {/* Months */}
                                <View className="flex-1">
                                    <Text className="text-center font-semibold mb-2 text-gray-700">Bulan</Text>
                                    <ScrollView
                                        showsVerticalScrollIndicator={false}
                                        contentContainerStyle={{ paddingHorizontal: 4 }}
                                    >
                                        {months.map(month => (
                                            <TouchableOpacity
                                                key={month.value}
                                                onPress={() => updateDate('month', month.value)}
                                                className={`py-3 px-2 rounded-lg m-1 ${tanggal.getMonth() === month.value ? 'bg-green-500' : 'bg-gray-100'
                                                    }`}
                                            >
                                                <Text className={`text-center font-medium ${tanggal.getMonth() === month.value ? 'text-white' : 'text-gray-800'
                                                    }`}>
                                                    {month.name}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>

                                {/* Years */}
                                <View className="flex-1">
                                    <Text className="text-center font-semibold mb-2 text-gray-700">Tahun</Text>
                                    <ScrollView
                                        showsVerticalScrollIndicator={false}
                                        contentContainerStyle={{ paddingHorizontal: 4 }}
                                    >
                                        {years.map(year => (
                                            <TouchableOpacity
                                                key={year}
                                                onPress={() => updateDate('year', year)}
                                                className={`py-3 px-2 rounded-lg m-1 ${tanggal.getFullYear() === year ? 'bg-green-500' : 'bg-gray-100'
                                                    }`}
                                            >
                                                <Text className={`text-center font-medium ${tanggal.getFullYear() === year ? 'text-white' : 'text-gray-800'
                                                    }`}>
                                                    {year}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            </View>

                            {/* Selected Date Preview */}
                            <View className="p-4 bg-gray-50 border-t border-gray-200">
                                <Text className="text-center text-lg font-semibold text-gray-800">
                                    {formatTanggal(tanggal)}
                                </Text>
                            </View>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </SafeAreaView>
    )
}