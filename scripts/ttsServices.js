// ttsServices.js

/**
 * Calls ElevenLabs streaming endpoint and returns the fetch Response object.
 * The caller is responsible for reading the stream (e.g. MediaSource approach).
 */
export async function synthesizeWithElevenLabsStreaming(apiKey, text, voiceId) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`;

  const requestBody = {
    text
    // Add additional voice settings here if needed
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
      'Accept': 'audio/mpeg',
      // "Transfer-Encoding": "chunked" is implied in streaming
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok || !response.body) {
    throw new Error(`ElevenLabs streaming TTS failed: ${response.status}`);
  }

  return response; // We'll handle the body stream in the audio player
}
  