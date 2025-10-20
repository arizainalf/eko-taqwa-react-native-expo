// app/users/[id].tsx
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function UserDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // In real app, you would fetch user data based on ID
  const user = {
    id: id as string,
    name: `User ${id}`,
    email: `user${id}@example.com`,
    bio: `This is the bio for user ${id}`,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Details</Text>
      
      <View style={styles.userInfo}>
        <Text style={styles.label}>ID:</Text>
        <Text style={styles.value}>{user.id}</Text>
        
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{user.name}</Text>
        
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user.email}</Text>
        
        <Text style={styles.label}>Bio:</Text>
        <Text style={styles.value}>{user.bio}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  userInfo: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
});