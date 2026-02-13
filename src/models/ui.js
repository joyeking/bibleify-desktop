import { loadUiSettings, resolveTheme, saveUiSettings } from '../utils/uiSettings';

const initial = loadUiSettings();

export const ui = {
  state: {
    themeMode: initial.themeMode,
    theme: resolveTheme(initial.themeMode),
    fontSize: initial.fontSize,
  },
  reducers: {
    setThemeMode(state, payload) {
      const next = { ...state, themeMode: payload, theme: resolveTheme(payload) };
      saveUiSettings({ themeMode: next.themeMode, fontSize: next.fontSize });
      return next;
    },
    setFontSize(state, payload) {
      const next = { ...state, fontSize: payload };
      saveUiSettings({ themeMode: next.themeMode, fontSize: next.fontSize });
      return next;
    },
    refreshAutoTheme(state) {
      if (state.themeMode !== 'auto') {
        return state;
      }
      return { ...state, theme: resolveTheme('auto') };
    },
  },
};

export default ui;
