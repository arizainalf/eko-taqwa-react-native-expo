// app/kuis/_layout.tsx
import { Stack, useNavigation, useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { NavigationAction } from '@react-navigation/native'

export default function KuisPlayLayout() {
  const router = useRouter()
  const navigation = useNavigation()
  return (
    <Stack screenOptions={{
      headerShown: false,     // Sembunyikan header (tombol back)
      gestureEnabled: false,  // Matikan gestur swipe kembali
    }}>
      {/* Halaman play/[id].tsx (mengerjakan kuis) */}
      <Stack.Screen
        name="play/[id]"
        listeners={{

          beforeRemove: (e) => {
            // e.preventDefault() tetap sama
            e.preventDefault()

            Alert.alert(
              'Kembali?',
              'Apakah Anda yakin ingin kembali ke halaman sebelumnya?',
              [
                {
                  text: "Batal",
                  style: 'cancel',
                  onPress: () => { }
                },
                {
                  text: 'Ya, Kembali',
                  style: 'destructive',
                  // 5. Gunakan navigation.dispatch()
                  onPress: () => navigation.dispatch(e.data.action as NavigationAction),
                },
              ]
            )
          },
        }}
        options={{
          // Di halaman ini, semua gestur kembali dimatikan total
          gestureEnabled: false,
        }}
      />
    </Stack>
  );
}