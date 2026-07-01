export async function analyzeImage(base64Image, prompt) {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_KEY;
  const endpoint =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

  const response = await fetch(`${endpoint}?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
            {
              inline_data: {
                mime_type: 'image/jpeg',
                data: base64Image,
              },
            },
          ],
        },
      ],
    }),
  });

  return response.json();
}
