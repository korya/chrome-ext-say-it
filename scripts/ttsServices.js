// ttsServices.js

export async function synthesizeWithElevenLabs(apiKey, text, voice, speed) {
  // Check ElevenLabs API docs for details:
  // https://docs.elevenlabs.io/api-reference/eleven-apis/tts
  //
  // Typically, you send a POST request with:
  //   - text
  //   - voice settings
  //   - etc.
  // and receive audio. Then you either use a Blob to create a URL for an <audio> element
  // or feed it to a Web Audio context.

  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voice}`;

  // The ElevenLabs API may not directly support "speed" as a param.
  // You may have to adjust speed client-side in the audio player
  // or see if you can pass a "voice_settings" with stability, similarity etc.

  const requestBody = {
    text,
    // Additional parameters can go here, e.g.:
    // voice_settings: { stability: 0.5, similarity_boost: 0.5 }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    throw new Error(`ElevenLabs TTS failed: ${response.status}`);
  }

  // Response is audio data (MIME type audio/mpeg)
  const arrayBuffer = await response.arrayBuffer();
  return arrayBuffer; 
}
