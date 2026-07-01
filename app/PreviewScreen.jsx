import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function PreviewScreen({ route, navigation } = {}) {
  const router = useRouter();
  const params = useLocalSearchParams();
  const rawPhotoUri = route?.params?.photoUri ?? params.photoUri;
  const rawBase64Image = route?.params?.base64Image ?? params.base64Image;
  const photoUri = Array.isArray(rawPhotoUri) ? rawPhotoUri[0] : rawPhotoUri;
  const base64Image = Array.isArray(rawBase64Image) ? rawBase64Image[0] : rawBase64Image;

  const retakePhoto = () => {
    if (navigation?.goBack) {
      navigation.goBack();
      return;
    }

    router.back();
  };

  const analyzePhoto = (promptKey) => {
    if (navigation?.navigate) {
      navigation.navigate('Result', { base64Image, promptKey });
      return;
    }

    router.push({
      pathname: './Result',
      params: { base64Image, promptKey },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.photoArea}>
        <Image source={{ uri: photoUri }} style={styles.photo} resizeMode="contain" />
      </View>
      <View style={styles.controls}>
        <Pressable style={[styles.button, styles.retakeButton]} onPress={retakePhoto}>
          <Text style={styles.buttonText}>Retake</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.academicButton]} onPress={() => analyzePhoto('academic')}>
          <Text style={styles.buttonText}>Academic Analysis</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.safetyButton]} onPress={() => analyzePhoto('safety')}>
          <Text style={styles.buttonText}>Safety Analysis</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.inventoryButton]} onPress={() => analyzePhoto('inventory')}>
          <Text style={styles.buttonText}>Inventory Analysis</Text>
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
  photoArea: {
    flex: 1,
    minHeight: 220,
  },
  photo: {
    height: '100%',
    width: '100%',
  },
  controls: {
    backgroundColor: '#000000',
    gap: 10,
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 16,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    minHeight: 48,
    paddingVertical: 14,
  },
  retakeButton: {
    backgroundColor: '#6b7280',
  },
  academicButton: {
    backgroundColor: '#2563eb',
  },
  safetyButton: {
    backgroundColor: '#dc2626',
  },
  inventoryButton: {
    backgroundColor: '#059669',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
