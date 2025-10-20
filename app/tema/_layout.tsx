// app/tema/_layout.tsx
import { Stack } from 'expo-router';
import { Colors } from '../../constants/Colors';

export default function TemaLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'medium',
        },
        gestureEnabled: true,
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Semua Tema',
        }} 
      />
      <Stack.Screen 
        name="[id]" 
        options={{ 
          title: 'Detail Tema',
        }} 
      />
    </Stack>
  );
}