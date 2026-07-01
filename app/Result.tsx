import { Image, StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ResultScreen() {
  const params = useLocalSearchParams();
  const rawPhotoUri = params.photoUri;
  const photoUri = Array.isArray(rawPhotoUri) ? rawPhotoUri[0] : rawPhotoUri;

  return (
    <ThemedView style={styles.container}>
      {photoUri ? <Image source={{ uri: photoUri }} style={styles.photo} resizeMode="contain" /> : null}
      <View style={styles.content}>
        <ThemedText type="title">Ready to Analyze</ThemedText>
        <ThemedText style={styles.message}>Your photo was captured and passed to this screen.</ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  photo: {
    flex: 1,
    width: '100%',
    backgroundColor: '#000000',
  },
  content: {
    gap: 10,
    padding: 24,
  },
  message: {
    textAlign: 'center',
  },
});
