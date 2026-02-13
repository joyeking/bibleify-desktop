import { buildKey, loadAnnotations, saveHighlight, saveNote } from '../utils/annotationStore';

export const annotations = {
  state: {
    highlights: {},
    notes: {},
    loaded: false,
    error: null,
  },
  reducers: {
    setAll(state, payload) {
      return { ...state, ...payload, loaded: true, error: null };
    },
    setHighlight(state, payload) {
      const highlights = { ...state.highlights };
      if (payload.color) {
        highlights[payload.key] = payload.color;
      } else {
        delete highlights[payload.key];
      }
      return { ...state, highlights };
    },
    setNote(state, payload) {
      const notes = { ...state.notes };
      if (payload.note) {
        notes[payload.key] = payload.note;
      } else {
        delete notes[payload.key];
      }
      return { ...state, notes };
    },
    setError(state, payload) {
      return { ...state, error: payload };
    },
  },
  effects: {
    async init() {
      try {
        const data = await loadAnnotations();
        this.setAll(data);
      } catch (error) {
        this.setError('Failed to load annotations from local storage.');
      }
    },
    async setVerseHighlight(payload, rootState) {
      const location = {
        version: rootState.bible.activeVersion.value,
        book: rootState.bible.activeBook.value,
        chapter: rootState.bible.activeChapter,
        verse: payload.verse,
      };
      const result = await saveHighlight(location, payload.color);
      this.setHighlight(result);
    },
    async setVerseNote(payload, rootState) {
      const location = {
        version: rootState.bible.activeVersion.value,
        book: rootState.bible.activeBook.value,
        chapter: rootState.bible.activeChapter,
        verse: payload.verse,
      };
      const result = await saveNote(location, payload.note);
      this.setNote(result);
    },
  },
};

export function getAnnotationKey(bible, verse) {
  return buildKey({
    version: bible.activeVersion.value,
    book: bible.activeBook.value,
    chapter: bible.activeChapter,
    verse,
  });
}

export default annotations;
