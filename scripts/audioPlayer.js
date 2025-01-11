// audioPlayer.js

let audioElement;
let currentUrl;

export function playAudioFromArrayBuffer(arrayBuffer, speed = 1.0) {
  stopAudio(); // ensure previous audio is stopped

  const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
  currentUrl = URL.createObjectURL(blob);

  audioElement = new Audio(currentUrl);
  audioElement.playbackRate = speed;

  audioElement.play();
}

export function pauseAudio() {
  if (audioElement && !audioElement.paused) {
    audioElement.pause();
  }
}

export function resumeAudio() {
  if (audioElement && audioElement.paused) {
    audioElement.play();
  }
}

export function stopAudio() {
  if (audioElement) {
    audioElement.pause();
    audioElement.src = '';
    audioElement.load();
    audioElement = null;
  }
  if (currentUrl) {
    URL.revokeObjectURL(currentUrl);
    currentUrl = null;
  }
}

export function isPlaying() {
  return audioElement && !audioElement.paused;
}

export function isPaused() {
  return audioElement && audioElement.paused;
}
