// app/tema/index.tsx
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

const allTema = [
  {
    id: "0f98749c-04eb-4378-b83b-74295b65045e",
    nama: "Perferendis Ekologi",
    deskripsi: "Velit cupiditate est quasi sit in vero perspiciatis.",
    jenis_tema: { nama: "Kemanusiaan" },
    video: [{ id: "4b77f7a5-bc3e-48cb-8206-19f0fa3b4cb3" }]
  },
  {
    id: "13706237-9c46-453d-af87-b0a33b6cea44",
    nama: "Sed Ekologi", 
    deskripsi: "Quam labore voluptatum quia necessitatibus.",
    jenis_tema: { nama: "Teknologi" },
    video: [{ id: "16bd21e8-c18d-422d-b324-372a3de2a190" }]
  },
  // Tambahkan data lain dari API
];

export default function TemaListScreen() {
  const router = useRouter();

  const navigateToTemaDetail = (temaId: string) => {
    router.push(`/tema/${temaId}`);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={allTema}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable 
            style={styles.temaItem}
            onPress={() => navigateToTemaDetail(item.id)}
          >
            <View style={styles.temaIcon}>
              <Ionicons name="layers" size={24} color={Colors.primary} />
            </View>
            <View style={styles.temaContent}>
              <Text style={styles.temaName}>{item.nama}</Text>
              <Text style={styles.temaCategory}>{item.jenis_tema.nama}</Text>
              <Text style={styles.temaDesc} numberOfLines={2}>
                {item.deskripsi}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
          </Pressable>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    padding: 16,
  },
  temaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  temaIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  temaContent: {
    flex: 1,
  },
  temaName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  temaCategory: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: 4,
  },
  temaDesc: {
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 18,
  },
});