// settings.js

const STORAGE_KEY = 'myTtsSettings';

export const defaultSettings = {
  apiKey: '',
  voice: 'XrExE9yKIg1WjnnlVkGX',
  speed: '1'
};

export async function loadSettings() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get([STORAGE_KEY], (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        const stored = result[STORAGE_KEY] || {};
        resolve({ ...defaultSettings, ...stored });
      }
    });
  });
}

export async function saveSettings(newSettings) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ [STORAGE_KEY]: newSettings }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
}
