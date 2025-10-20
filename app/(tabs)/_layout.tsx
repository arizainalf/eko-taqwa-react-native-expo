// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.success,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          tabBarLabelStyle: {
            fontSize: 8,
          },
        }}
      />
      <Tabs.Screen
        name="fase"
        options={{
          title: 'Eko CP',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkbox" size={size} color={color} />
          ),
          tabBarLabelStyle: { fontSize: 8 },
        }}
      />
      <Tabs.Screen
        name="media"
        options={{
          title: 'Eko Media',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="play-circle" size={size} color={color} />
          ),
          tabBarLabelStyle: { fontSize: 8 },
        }}
      />
      <Tabs.Screen
        name="kaidah"
        options={{
          title: 'Eko kaidah',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="scale-balance" size={size} color={color} />
          ),
          tabBarLabelStyle: { fontSize: 8 },
        }}
      />
      <Tabs.Screen
        name="cp"
        options={{
          title: 'CP',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkbox" size={size} color={color} />
          ),
          tabBarLabelStyle: {
            fontSize: 8,
          },
        }}
      />
      <Tabs.Screen
        name="ayat"
        options={{
          title: 'EKO Ayat Hadist',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book" size={size} color={color} />
          ),
          tabBarLabelStyle: {
            fontSize: 8,
          },
        }}
      />
    </Tabs>
  );
}