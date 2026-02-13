import { openBibleRealm } from '../utils/realmClient';

export const search = {
  state: {
    text: '',
    results: [],
    show: false,
  },
  reducers: {
    setText(state, payload) {
      return { ...state, text: payload };
    },
    setResults(state, payload) {
      return { ...state, results: payload };
    },
    setShow(state, payload) {
      return { ...state, show: payload };
    },
  },
  effects: {
    async fetchSearch(payload, rootState) {
      const { text } = rootState.search;
      const { activeVersion } = rootState.bible;

      if (!text.trim()) {
        this.setResults([]);
        this.setShow(true);
        return;
      }

      try {
        const realm = await openBibleRealm(activeVersion.value);
        // Escape user text for Realm query safety.
        const escapedText = text.replace(/"/g, '\\"');
        const query = `content CONTAINS[c] "${escapedText}" AND type != "t"`;
        const filteredPassages = realm.objects('Passage').filtered(query).slice(0, 50);
        this.setShow(true);
        this.setResults(filteredPassages.map(item => item));
      } catch (error) {
        this.setShow(true);
        this.setResults([]);
      }
    },
  },
};

export default search;
