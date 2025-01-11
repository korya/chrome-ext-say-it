// audioPlayer.js

let audioElement;
let mediaSource;
let sourceBuffer;
let reader;

/**
 * Play audio as it's streamed from ElevenLabs.
 * @param {Response} response - fetch response from synthesizeWithElevenLabsStreaming()
 * @param {number} speed - playback rate (0.5, 1.0, 1.5, etc.)
 */
export async function playAudioStream(response, speed = 1.0) {
  stopAudioStream(); // Clean up any previous audio first

  mediaSource = new MediaSource();
  // Create a URL for the media source, and attach it to an <audio> element
  const objectURL = URL.createObjectURL(mediaSource);

  audioElement = new Audio(objectURL);
  audioElement.playbackRate = speed;
  audioElement.controls = true; // optional, to show default player controls
  document.body.appendChild(audioElement);

  // Start playback as soon as user interacts or code allows
  // (In Chrome extensions, you might need to handle user-gesture requirements)
  audioElement.play().catch(err => console.error('Cannot auto-play:', err));

  // MSE: once sourceopen fires, we can start appending audio chunks
  mediaSource.addEventListener('sourceopen', onSourceOpen);

  // Prepare to read stream
  reader = response.body.getReader();
}

// Called when the media source is ready to receive data
async function onSourceOpen() {
  sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg');

  try {
    while (true) {
      // Read the next chunk from the network stream
      const { done, value } = await reader.read();
      if (done) {
        // No more data, tell MSE we’re done
        mediaSource.endOfStream();
        break;
      }

      // Wait if the SourceBuffer is still processing a previous chunk
      if (sourceBuffer.updating) {
        await new Promise(resolve => {
          sourceBuffer.addEventListener('updateend', resolve, { once: true });
        });
      }

      // Append the new audio chunk
      sourceBuffer.appendBuffer(value);
    }
  } catch (err) {
    console.error('Error reading audio stream:', err);
    mediaSource.endOfStream();
  }
}

/**
 * Stop streaming audio and clean up.
 */
export function stopAudioStream() {
  if (audioElement) {
    audioElement.pause();
    URL.revokeObjectURL(audioElement.src);
    if (audioElement.parentNode) {
      audioElement.parentNode.removeChild(audioElement);
    }
    audioElement = null;
  }
  if (mediaSource) {
    // MSE requires us to close out if we want to re-init next time
    try {
      mediaSource.endOfStream();
    } catch (e) {
      /* ignore if it was never open */
    }
    mediaSource = null;
  }
  reader = null;
  sourceBuffer = null;
}

export function resumeAudio() {
  if (audioElement && audioElement.paused) {
    audioElement.play();
  }
}

export function pauseAudio() {
  if (audioElement && !audioElement.paused) {
    audioElement.pause();
  }
}

export function isPlaying() {
  // Return true if the audio element exists and is not paused
  return audioElement && !audioElement.paused;
}

export function isPaused() {
  // For a streaming approach with MSE, you may still have an `audioElement`.
  // Return the "paused" property if it exists.
  return audioElement ? audioElement.paused : true;
}