// app/kuis/[id].tsx
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function KuisDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Mock data kuis
  const kuisData = {
    id: id as string,
    judul: "Kuis Ekologi #14",
    deskripsi: "Placeat provident dolores voluptatem suscipit adipisci nobis.",
    batas_waktu: 413,
    pertanyaan_count: 10,
    instruksi: "Jawab semua pertanyaan dengan benar. Waktu pengerjaan terbatas."
  };

  const startKuis = () => {
    // Navigate ke screen kuis questions
    alert(`Memulai kuis: ${kuisData.judul}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{kuisData.judul}</Text>
        <Text style={styles.description}>{kuisData.deskripsi}</Text>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Ionicons name="time" size={24} color={Colors.primary} />
          <Text style={styles.infoLabel}>Waktu</Text>
          <Text style={styles.infoValue}>{kuisData.batas_waktu} menit</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Ionicons name="help-circle" size={24} color={Colors.primary} />
          <Text style={styles.infoLabel}>Pertanyaan</Text>
          <Text style={styles.infoValue}>{kuisData.pertanyaan_count}</Text>
        </View>
      </View>

      <View style={styles.instructionCard}>
        <Text style={styles.instructionTitle}>Instruksi</Text>
        <Text style={styles.instructionText}>{kuisData.instruksi}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable style={styles.startButton} onPress={startKuis}>
          <Text style={styles.startButtonText}>Mulai Kuis</Text>
        </Pressable>
        
        <Pressable 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Kembali</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 22,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 8,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  instructionCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 16,
    color: Colors.textLight,
    lineHeight: 22,
  },
  buttonContainer: {
    gap: 12,
  },
  startButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: 'transparent',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gray,
  },
  backButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
});