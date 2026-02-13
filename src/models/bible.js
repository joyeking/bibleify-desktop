import Books from '../constants/Books';
import Versions from '../constants/Versions';
import { openBibleRealm } from '../utils/realmClient';

export const bible = {
  state: {
    activeVersion: Versions[4],
    activeBook: Books[0],
    activeChapter: 1,
    activeVerse: null,
    jumpText: '',
    verses: [],
    loading: false,
    error: null,
    offlineReady: true,
  },
  reducers: {
    setActiveChapter(state, payload) {
      return { ...state, activeChapter: payload };
    },
    setActiveBook(state, payload) {
      return { ...state, activeBook: payload };
    },
    jumpToVerse(state, payload) {
      const { activeBook, activeChapter, activeVerse } = payload;
      return { ...state, activeBook, activeChapter, activeVerse };
    },
    setActiveVersion(state, payload) {
      return { ...state, activeVersion: payload };
    },
    setVerses(state, payload) {
      return { ...state, verses: payload, loading: false, error: null };
    },
    setJumpText(state, payload) {
      return { ...state, jumpText: payload };
    },
    setLoading(state, payload) {
      return { ...state, loading: payload };
    },
    setError(state, payload) {
      return { ...state, error: payload, loading: false };
    },
    prevChapter(state) {
      let newChapter = state.activeChapter - 1;
      if (newChapter < 1) {
        newChapter = 1;
      }
      return { ...state, activeChapter: newChapter };
    },
    nextChapter(state) {
      let newChapter = state.activeChapter + 1;
      const currentBook = Books.find(book => book.value == state.activeBook.value);
      if (newChapter > currentBook.total) {
        newChapter = currentBook.total;
      }
      return { ...state, activeChapter: newChapter };
    },
  },
  effects: {
    async fetchVerses(payload) {
      const { activeVersion, activeBook, activeChapter } = payload;
      this.setLoading(true);

      try {
        const realm = await openBibleRealm(activeVersion.value);
        const filteredPassages = realm
          .objects('Passage')
          .filtered(`book = "${activeBook.value}" AND chapter = ${activeChapter}`)
          .sorted('order');

        const verses = filteredPassages.map(item => item);
        if (verses.length) {
          this.setVerses(verses);
        } else {
          this.setError('No passages were found for this chapter.');
        }
      } catch (error) {
        // Surface a user-friendly offline DB error instead of crashing.
        this.setError(`Unable to open ${activeVersion.value}.realm. Ensure the offline database exists.`);
      }
    },
  },
};

export default bible;
