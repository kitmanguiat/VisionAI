import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText type="title">Camera</ThemedText>
        <ThemedText style={styles.description}>
          Take a photo, preview it, then continue to the result screen.
        </ThemedText>
        <Link href="./CameraScreen" style={styles.cameraButton}>
          Open Camera
        </Link>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    padding: 24,
  },
  description: {
    textAlign: 'center',
  },
  cameraButton: {
    borderRadius: 8,
    backgroundColor: '#2563eb',
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
    overflow: 'hidden',
    paddingHorizontal: 22,
    paddingVertical: 14,
  },
});
