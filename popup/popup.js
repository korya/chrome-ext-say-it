// popup.js
import { loadSettings, saveSettings } from './settings.js';
import { extractTextFromPage } from '../scripts/textExtraction.js';
import { synthesizeWithElevenLabs } from '../scripts/ttsServices.js';
import {
  playAudioFromArrayBuffer,
  pauseAudio,
  resumeAudio,
  stopAudio,
  isPlaying,
  isPaused
} from '../scripts/audioPlayer.js';

let currentSettings = {};

console.log('+++ WE ARE RUNNING!!! +++');

document.addEventListener('DOMContentLoaded', async () => {
  console.log('+++ WE ARE RUNNING: DomContentLoaded +++');

  // Load settings
  currentSettings = await loadSettings();
  initializeUI(currentSettings);

  // Attach event listeners
  document.getElementById('playBtn').addEventListener('click', onPlayClicked);
  document.getElementById('pauseBtn').addEventListener('click', onPauseClicked);
  document.getElementById('resumeBtn').addEventListener('click', onResumeClicked);
  document.getElementById('stopBtn').addEventListener('click', onStopClicked);

  document.getElementById('apiKeyInput').addEventListener('change', onSettingsChanged);
  document.getElementById('voiceSelect').addEventListener('change', onSettingsChanged);
  document.getElementById('speedSelect').addEventListener('change', onSettingsChanged);
});

function initializeUI(settings) {
  console.log('+++ WE ARE RUNNING: initializeUI +++');
  // Populate the settings fields
  document.getElementById('apiKeyInput').value = settings.apiKey;
  document.getElementById('voiceSelect').value = settings.voice;
  document.getElementById('speedSelect').value = settings.speed;
}

async function onPlayClicked() {
  console.log('+++ onPlayClicked: playing audio');
  toggleButtons({ playing: true });

  // We need text from the page, so we do so via a script injection or content script.
  try {
    console.log('+++ onPlayClicked: getting current tab');
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    console.log('+++ onPlayClicked: extracting text');
    const extractedText = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: extractTextFromPage,
    });

    console.log('+++ onPlayClicked: got extracted text', extractedText);
    if (extractedText && extractedText[0] && extractedText[0].result) {
      let textToRead = extractedText[0].result.trim();
      // XXX No streaming supported yet
      textToRead = textToRead.substring(0, 1000);
      console.log('+++ onPlayClicked: synthesizing audio');
      const arrayBuffer = await synthesizeWithElevenLabs(
        currentSettings.apiKey,
        textToRead,
        currentSettings.voice,
        currentSettings.speed,
      );

      console.log('+++ onPlayClicked: playing audio');
      // For actual speed changes, you can set the audio element playbackRate.
      playAudioFromArrayBuffer(arrayBuffer, parseFloat(currentSettings.speed));
    }
  } catch (error) {
    console.error('Failed to read page or TTS:', error);
  }
}

function onPauseClicked() {
  console.log('+++ onPauseClicked: pausing audio');
  if (isPlaying()) {
    pauseAudio();
    toggleButtons({ paused: true });
  }
}

function onResumeClicked() {
  console.log('+++ onResumeClicked: resuming audio');
  if (isPaused()) {
    resumeAudio();
    toggleButtons({ playing: true });
  }
}

function onStopClicked() {
  console.log('+++ onStopClicked: stopping audio');
  stopAudio();
  toggleButtons({ stopped: true });
}

function toggleButtons({ playing = false, paused = false, stopped = false }) {
  console.log('+++ toggleButtons: playing', playing, 'paused', paused, 'stopped', stopped);
  const playBtn = document.getElementById('playBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const resumeBtn = document.getElementById('resumeBtn');
  const stopBtn = document.getElementById('stopBtn');

  if (playing) {
    // show "Pause" + "Stop"
    playBtn.style.display = 'none';
    pauseBtn.style.display = 'inline-block';
    resumeBtn.style.display = 'none';
    stopBtn.style.display = 'inline-block';
  } else if (paused) {
    // show "Resume" + "Stop"
    playBtn.style.display = 'none';
    pauseBtn.style.display = 'none';
    resumeBtn.style.display = 'inline-block';
    stopBtn.style.display = 'inline-block';
  } else if (stopped) {
    // show only "Play"
    playBtn.style.display = 'inline-block';
    pauseBtn.style.display = 'none';
    resumeBtn.style.display = 'none';
    stopBtn.style.display = 'none';
  }
}

async function onSettingsChanged() {
  console.log('+++ WE ARE RUNNING: onSettingsChanged +++');
  const apiKey = document.getElementById('apiKeyInput').value;
  const voice = document.getElementById('voiceSelect').value;
  const speed = document.getElementById('speedSelect').value;

  currentSettings = { apiKey, voice, speed };
  await saveSettings(currentSettings);
}
