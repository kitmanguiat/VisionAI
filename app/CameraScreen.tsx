import { CameraView, type CameraCapturedPicture, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Button, Pressable, StyleSheet, Text, View } from 'react-native';

import { saveCapturedImage } from '@/lib/capturedImages';

export default function CameraScreen() {
  const router = useRouter();
  const cameraRef = useRef<CameraView | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isTakingPicture, setIsTakingPicture] = useState(false);

  const takePicture = async () => {
    if (!cameraRef.current || !isCameraReady || isTakingPicture) {
      return;
    }

    setIsTakingPicture(true);

    try {
      const photo: CameraCapturedPicture = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        base64: true,
      });

      if (photo.uri && photo.base64) {
        const imageId = saveCapturedImage(photo.base64);

        router.push({
          pathname: './PreviewScreen',
          params: {
            imageId,
            photoUri: photo.uri,
          },
        });
      }
    } finally {
      setIsTakingPicture(false);
    }
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>We need your permission to use the camera</Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
        onCameraReady={() => setIsCameraReady(true)}
      />
      <View style={styles.captureContainer}>
        <Pressable
          style={[styles.captureButton, (!isCameraReady || isTakingPicture) && styles.disabledButton]}
          onPress={takePicture}
          disabled={!isCameraReady || isTakingPicture}>
          <Text style={styles.captureText}>Capture</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  permissionText: {
    marginBottom: 16,
    textAlign: 'center',
  },
  camera: {
    flex: 1,
  },
  captureContainer: {
    position: 'absolute',
    bottom: 48,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  captureButton: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#d9d9d9',
    borderWidth: 4,
  },
  disabledButton: {
    opacity: 0.6,
  },
  captureText: {
    color: '#111111',
    fontWeight: '600',
  },
});
