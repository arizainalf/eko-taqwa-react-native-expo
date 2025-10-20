// app/tema/[id].tsx
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

// Mock data - dalam real app, fetch dari API berdasarkan ID
const temaData = {
  id: "0f98749c-04eb-4378-b83b-74295b65045e",
  nama: "Perferendis Ekologi",
  deskripsi: "Velit cupiditate est quasi sit in vero perspiciatis. Velit cupiditate est quasi sit in vero perspiciatis. Velit cupiditate est quasi sit in vero perspiciatis.",
  jenis_tema: { nama: "Kemanusiaan" },
  video: [
    {
      id: "4b77f7a5-bc3e-48cb-8206-19f0fa3b4cb3",
      judul: "Video et non",
      deskripsi: "Nobis non mollitia voluptas ut tempore saepe.",
      link: "https://youtu.be/7mCZeyDX"
    }
  ]
};

export default function TemaDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const navigateToVideo = (videoId: string) => {
    router.push(`/video/${videoId}`);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{temaData.jenis_tema.nama}</Text>
        </View>
        <Text style={styles.title}>{temaData.nama}</Text>
        <Text style={styles.description}>{temaData.deskripsi}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Video Pembelajaran</Text>
        {temaData.video.map((video) => (
          <Pressable 
            key={video.id}
            style={styles.videoCard}
            onPress={() => navigateToVideo(video.id)}
          >
            <View style={styles.videoThumbnail}>
              <Ionicons name="play-circle" size={48} color="#FFFFFF" />
            </View>
            <View style={styles.videoInfo}>
              <Text style={styles.videoTitle}>{video.judul}</Text>
              <Text style={styles.videoDesc}>{video.deskripsi}</Text>
              <View style={styles.watchButton}>
                <Text style={styles.watchButtonText}>Tonton Video</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Materi Lainnya</Text>
        <Pressable style={styles.materialItem}>
          <Ionicons name="document-text" size={24} color={Colors.primary} />
          <Text style={styles.materialText}>Materi Teks Lengkap</Text>
          <Ionicons name="download" size={20} color={Colors.gray} />
        </Pressable>
        <Pressable style={styles.materialItem}>
          <Ionicons name="images" size={24} color={Colors.primary} />
          <Text style={styles.materialText}>Gambar Pendukung</Text>
          <Ionicons name="eye" size={20} color={Colors.gray} />
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 20,
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  categoryBadge: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#DCFCE7',
    lineHeight: 22,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  videoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  videoThumbnail: {
    height: 120,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoInfo: {
    padding: 16,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  videoDesc: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 12,
    lineHeight: 18,
  },
  watchButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  watchButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  materialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  materialText: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    marginLeft: 12,
  },
});