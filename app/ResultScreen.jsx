import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { analyzeImage } from '../lib/gemini';
import { getCapturedImage } from '../lib/capturedImages';

export const PROMPTS = {
  academic:
    'Act as a university professor reviewing this image for a student. Return only valid JSON in this exact shape: {"objects":["object"],"context":"educational context","activities":"relevant learning observations","recommendations":"one piece of constructive feedback"}. Identify important objects, explain the educational context, and provide one concise piece of constructive feedback.',
  safety:
    'Act as a workplace safety inspector reviewing this image. Return only valid JSON in this exact shape: {"objects":["object"],"context":"inspection context","activities":"visible work activities","recommendations":"visible hazards or a clear statement that none exist"}. Identify visible hazards, or clearly state that no hazards are visible.',
  inventory:
    'Act as an asset management clerk reviewing this image. Return only valid JSON in this exact shape: {"objects":["visible asset"],"context":"","activities":"","recommendations":""}. Provide a clean list of visible assets with no commentary.',
};

function parseAnalysisText(text) {
  const cleanedText = text
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '');

  try {
    return JSON.parse(cleanedText);
  } catch {
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error('The analysis response was not valid JSON.');
    }

    return JSON.parse(jsonMatch[0]);
  }
}

function getAnalysisText(result) {
  const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error(result?.error?.message ?? 'The analysis response was empty.');
  }

  return text;
}

export default function ResultScreen({ route } = {}) {
  const params = useLocalSearchParams();
  const rawImageId = route?.params?.imageId ?? params.imageId;
  const rawBase64Image = route?.params?.base64Image ?? params.base64Image;
  const rawPromptKey = route?.params?.promptKey ?? params.promptKey;
  const imageId = Array.isArray(rawImageId) ? rawImageId[0] : rawImageId;
  const routeBase64Image = Array.isArray(rawBase64Image) ? rawBase64Image[0] : rawBase64Image;
  const base64Image = getCapturedImage(imageId) ?? routeBase64Image;
  const promptKey = Array.isArray(rawPromptKey) ? rawPromptKey[0] : rawPromptKey;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  const prompt = useMemo(() => PROMPTS[promptKey] ?? PROMPTS.academic, [promptKey]);

  useEffect(() => {
    async function runAnalysis() {
      try {
        if (!base64Image) {
          throw new Error('No image was provided for analysis.');
        }

        const result = await analyzeImage(base64Image, prompt);
        const text = getAnalysisText(result);

        setAnalysis(parseAnalysisText(text));
      } catch (caughtError) {
        setError(caughtError instanceof Error ? caughtError.message : 'Unable to analyze this image.');
      } finally {
        setLoading(false);
      }
    }

    runAnalysis();
  }, [base64Image, prompt]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#93c5fd" size="large" />
        <Text style={styles.loadingText}>Analyzing image...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTitle}>Something went wrong</Text>
        <Text style={styles.errorMessage}>
          We could not analyze the image right now. Please try again.
        </Text>
        <Text style={styles.errorDetail}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.label}>Objects</Text>
        {analysis?.objects?.map((object) => (
          <Text key={object} style={styles.bodyText}>
            - {object}
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Context</Text>
        <Text style={styles.bodyText}>{analysis?.context}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Activities</Text>
        <Text style={styles.bodyText}>{analysis?.activities}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Recommendations</Text>
        <Text style={styles.bodyText}>{analysis?.recommendations}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#0b1120',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    color: '#f9fafb',
    marginTop: 14,
    fontSize: 16,
  },
  errorTitle: {
    color: '#f9fafb',
    marginBottom: 8,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  errorMessage: {
    color: '#d1d5db',
    fontSize: 16,
    textAlign: 'center',
  },
  errorDetail: {
    color: '#6b7280',
    fontSize: 13,
    marginTop: 12,
    textAlign: 'center',
  },
  content: {
    backgroundColor: '#0b1120',
    gap: 20,
    flexGrow: 1,
    padding: 24,
  },
  section: {
    backgroundColor: '#111827',
    borderColor: '#374151',
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
    padding: 16,
  },
  label: {
    color: '#f9fafb',
    fontSize: 18,
    fontWeight: '700',
  },
  bodyText: {
    color: '#e5e7eb',
    fontSize: 16,
    lineHeight: 23,
  },
});
