const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const LOCALES_DIR = path.join(ROOT, 'locales');

function loadJson(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

/**
 * Recursively collect all leaf-key paths of a nested object.
 * e.g. { a: { b: 'x', c: 'y' }, d: 'z' } → ['a.b', 'a.c', 'd']
 */
function collectKeys(obj, prefix = '') {
  const keys = [];
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (obj[key] !== null && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      keys.push(...collectKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

// ─── noi.lang.json ─────────────────────────────────────────────────────────────

describe('noi.lang.json', () => {
  let langFile;

  beforeAll(() => {
    langFile = loadJson(path.join(LOCALES_DIR, 'noi.lang.json'));
  });

  test('is an object with required metadata fields', () => {
    expect(typeof langFile.name).toBe('string');
    expect(typeof langFile.link).toBe('string');
    expect(typeof langFile.version).toBe('string');
    expect(Array.isArray(langFile.locales)).toBe(true);
  });

  test('locales array is non-empty', () => {
    expect(langFile.locales.length).toBeGreaterThan(0);
  });

  test('every locale entry has a code and a label', () => {
    for (const locale of langFile.locales) {
      expect(typeof locale.code).toBe('string');
      expect(locale.code.length).toBeGreaterThan(0);
      expect(typeof locale.label).toBe('string');
      expect(locale.label.length).toBeGreaterThan(0);
    }
  });

  test('locale codes are unique', () => {
    const codes = langFile.locales.map((l) => l.code);
    expect(new Set(codes).size).toBe(codes.length);
  });

  test('every language code has a corresponding locale directory', () => {
    for (const locale of langFile.locales) {
      const dirPath = path.join(LOCALES_DIR, locale.code);
      expect(fs.existsSync(dirPath)).toBe(true);
    }
  });

  test('every locale directory has an app.json file', () => {
    for (const locale of langFile.locales) {
      const appJsonPath = path.join(LOCALES_DIR, locale.code, 'app.json');
      expect(fs.existsSync(appJsonPath)).toBe(true);
    }
  });
});

// ─── locale app.json completeness ─────────────────────────────────────────────

describe('locale app.json files', () => {
  let langFile;
  let baseKeys;

  beforeAll(() => {
    langFile = loadJson(path.join(LOCALES_DIR, 'noi.lang.json'));
    const baseLocale = loadJson(path.join(LOCALES_DIR, 'en', 'app.json'));
    baseKeys = collectKeys(baseLocale).sort();
  });

  test('English app.json has a substantial number of translation keys', () => {
    expect(baseKeys.length).toBeGreaterThan(50);
  });

  const localeCodes = (() => {
    try {
      const lf = loadJson(path.join(LOCALES_DIR, 'noi.lang.json'));
      return lf.locales.map((l) => l.code);
    } catch {
      return [];
    }
  })();

  for (const code of localeCodes) {
    if (code === 'en') continue; // English is the baseline

    test(`${code}/app.json has no extra keys beyond the English baseline`, () => {
      const filePath = path.join(LOCALES_DIR, code, 'app.json');
      if (!fs.existsSync(filePath)) return;
      const locale = loadJson(filePath);
      const localeKeys = collectKeys(locale).sort();
      const extras = localeKeys.filter((k) => !baseKeys.includes(k));
      expect(extras).toEqual([]);
    });

    test(`${code}/app.json is missing no top-level keys from English`, () => {
      const filePath = path.join(LOCALES_DIR, code, 'app.json');
      if (!fs.existsSync(filePath)) return;
      const locale = loadJson(filePath);
      const localeTopKeys = Object.keys(locale).sort();
      const baseTopKeys = (() => {
        const base = loadJson(path.join(LOCALES_DIR, 'en', 'app.json'));
        return Object.keys(base).sort();
      })();
      const missing = baseTopKeys.filter((k) => !localeTopKeys.includes(k));
      expect(missing).toEqual([]);
    });

    test(`${code}/app.json leaf values are non-empty strings or non-empty arrays`, () => {
      const filePath = path.join(LOCALES_DIR, code, 'app.json');
      if (!fs.existsSync(filePath)) return;
      const locale = loadJson(filePath);
      const keys = collectKeys(locale);
      for (const key of keys) {
        const parts = key.split('.');
        let value = locale;
        for (const part of parts) value = value[part];
        if (Array.isArray(value)) {
          expect(value.length).toBeGreaterThan(0);
        } else {
          expect(typeof value).toBe('string');
          expect(value.length).toBeGreaterThan(0);
        }
      }
    });
  }

  test('no unexpected directories exist under locales/', () => {
    const knownCodes = new Set(localeCodes);
    const entries = fs.readdirSync(LOCALES_DIR, { withFileTypes: true });
    const extraDirs = entries
      .filter((e) => e.isDirectory() && !knownCodes.has(e.name))
      .map((e) => e.name);
    expect(extraDirs).toEqual([]);
  });
});
