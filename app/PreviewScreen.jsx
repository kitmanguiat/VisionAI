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
        <Text style={styles.controlsTitle}>Choose analysis type</Text>
        <Text style={styles.controlsSubtitle}>Select how you want this image reviewed.</Text>
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
    backgroundColor: '#111827',
    borderTopColor: '#374151',
    borderTopWidth: 1,
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 22,
    paddingTop: 18,
  },
  controlsTitle: {
    color: '#f9fafb',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  controlsSubtitle: {
    color: '#d1d5db',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
    textAlign: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    minHeight: 52,
    paddingVertical: 14,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    elevation: 3,
  },
  retakeButton: {
    backgroundColor: '#4b5563',
  },
  academicButton: {
    backgroundColor: '#1d4ed8',
  },
  safetyButton: {
    backgroundColor: '#b91c1c',
  },
  inventoryButton: {
    backgroundColor: '#047857',
  },
  buttonText: {
    color: '#f9fafb',
    fontSize: 16,
    fontWeight: '700',
  },
});
