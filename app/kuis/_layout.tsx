// app/kuis/_layout.tsx
import { Stack } from 'expo-router';
import { Colors } from '../../constants/Colors';

export default function KuisLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Semua Kuis',
        }} 
      />
      <Stack.Screen 
        name="[id]" 
        options={{ 
          title: 'Mulai Kuis',
        }} 
      />
    </Stack>
  );
}