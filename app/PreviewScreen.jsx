import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function PreviewScreen({ route, navigation } = {}) {
  const router = useRouter();
  const params = useLocalSearchParams();
  const rawPhotoUri = route?.params?.photoUri ?? params.photoUri;
  const photoUri = Array.isArray(rawPhotoUri) ? rawPhotoUri[0] : rawPhotoUri;

  const retakePhoto = () => {
    if (navigation?.goBack) {
      navigation.goBack();
      return;
    }

    router.back();
  };

  const analyzePhoto = () => {
    if (navigation?.navigate) {
      navigation.navigate('Result', { photoUri });
      return;
    }

    router.push({
      pathname: '/Result',
      params: { photoUri },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={{ uri: photoUri }} style={styles.photo} resizeMode="contain" />
      <View style={styles.buttonRow}>
        <Pressable style={[styles.button, styles.retakeButton]} onPress={retakePhoto}>
          <Text style={styles.buttonText}>Retake</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.analyzeButton]} onPress={analyzePhoto}>
          <Text style={styles.buttonText}>Analyze</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  photo: {
    flex: 1,
    width: '100%',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 16,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 14,
  },
  retakeButton: {
    backgroundColor: '#6b7280',
  },
  analyzeButton: {
    backgroundColor: '#2563eb',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
