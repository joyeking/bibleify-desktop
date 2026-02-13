import Realm from './realmClient';
import { getAnnotationRealmPath } from './realmClient';

const AnnotationSchema = {
  name: 'VerseAnnotation',
  primaryKey: 'id',
  properties: {
    id: 'string',
    key: 'string',
    highlightColor: 'string?',
    note: 'string?',
    updatedAt: 'date',
  },
};

const STORAGE_KEY = 'bibleify.annotations.v1';

const memoryFallback = {
  highlights: {},
  notes: {},
};

function buildKey(location) {
  const { version, book, chapter, verse } = location;
  return `${version}:${book}:${chapter}:${verse}`;
}

function loadFromLocalStorage() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { ...memoryFallback };
    }
    return JSON.parse(raw);
  } catch (error) {
    return { ...memoryFallback };
  }
}

function saveToLocalStorage(payload) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

async function withRealm(handler) {
  const realm = await Realm.open({ schema: [AnnotationSchema], path: getAnnotationRealmPath() });
  return handler(realm);
}

export async function loadAnnotations() {
  try {
    return await withRealm(realm => {
      const records = realm.objects('VerseAnnotation');
      const highlights = {};
      const notes = {};
      records.forEach(item => {
        if (item.highlightColor) {
          highlights[item.key] = item.highlightColor;
        }
        if (item.note) {
          notes[item.key] = item.note;
        }
      });
      return { highlights, notes };
    });
  } catch (error) {
    return loadFromLocalStorage();
  }
}

export async function saveHighlight(location, color) {
  const key = buildKey(location);
  try {
    await withRealm(realm => {
      realm.write(() => {
        const existing = realm.objectForPrimaryKey('VerseAnnotation', key);
        realm.create(
          'VerseAnnotation',
          {
            id: key,
            key,
            highlightColor: color || null,
            note: existing ? existing.note : null,
            updatedAt: new Date(),
          },
          Realm.UpdateMode.Modified,
        );
      });
    });
  } catch (error) {
    const data = loadFromLocalStorage();
    if (color) {
      data.highlights[key] = color;
    } else {
      delete data.highlights[key];
    }
    saveToLocalStorage(data);
  }
  return { key, color };
}

export async function saveNote(location, note) {
  const key = buildKey(location);
  try {
    await withRealm(realm => {
      const existing = realm.objectForPrimaryKey('VerseAnnotation', key);
      realm.write(() => {
        realm.create(
          'VerseAnnotation',
          {
            id: key,
            key,
            highlightColor: existing ? existing.highlightColor : null,
            note: note || null,
            updatedAt: new Date(),
          },
          Realm.UpdateMode.Modified,
        );
      });
    });
  } catch (error) {
    const data = loadFromLocalStorage();
    if (note) {
      data.notes[key] = note;
    } else {
      delete data.notes[key];
    }
    saveToLocalStorage(data);
  }
  return { key, note };
}

export { buildKey };
