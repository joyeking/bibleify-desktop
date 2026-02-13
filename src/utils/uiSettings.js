const SETTINGS_KEY = 'bibleify.ui.settings.v1';

const defaults = {
  themeMode: 'auto',
  fontSize: 19,
};

export function loadUiSettings() {
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      return defaults;
    }
    return { ...defaults, ...JSON.parse(raw) };
  } catch (error) {
    return defaults;
  }
}

export function saveUiSettings(settings) {
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function resolveTheme(themeMode) {
  if (themeMode === 'auto') {
    // Keep auto mode aligned with OS preference when available.
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return themeMode;
}
