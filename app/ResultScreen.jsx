import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { analyzeImage } from '../lib/gemini';

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

  return JSON.parse(cleanedText);
}

export default function ResultScreen({ route } = {}) {
  const params = useLocalSearchParams();
  const rawBase64Image = route?.params?.base64Image ?? params.base64Image;
  const rawPromptKey = route?.params?.promptKey ?? params.promptKey;
  const base64Image = Array.isArray(rawBase64Image) ? rawBase64Image[0] : rawBase64Image;
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
        const text = result.candidates[0].content.parts[0].text;

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
        <ActivityIndicator size="large" />
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
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 14,
    fontSize: 16,
  },
  errorTitle: {
    marginBottom: 8,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  errorMessage: {
    color: '#4b5563',
    fontSize: 16,
    textAlign: 'center',
  },
  content: {
    gap: 20,
    padding: 24,
  },
  section: {
    gap: 8,
  },
  label: {
    fontSize: 18,
    fontWeight: '700',
  },
  bodyText: {
    color: '#1f2937',
    fontSize: 16,
    lineHeight: 23,
  },
});
