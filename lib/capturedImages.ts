const capturedImages = new Map<string, string>();

export function saveCapturedImage(base64Image: string) {
  const imageId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  capturedImages.set(imageId, base64Image);

  return imageId;
}

export function getCapturedImage(imageId?: string) {
  if (!imageId) {
    return null;
  }

  return capturedImages.get(imageId) ?? null;
}
