// app/video/_layout.tsx
import { Stack } from 'expo-router';
import { Colors } from '../../constants/Colors';

export default function VideoLayout() {
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
        name="[id]" 
        options={{ 
          title: 'Video Pembelajaran',
        }} 
      />
    </Stack>
  );
}