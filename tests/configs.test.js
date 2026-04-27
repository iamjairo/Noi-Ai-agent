const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CONFIGS_DIR = path.join(ROOT, 'configs');

function loadJson(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

// ─── noi.space.json ────────────────────────────────────────────────────────────

describe('noi.space.json', () => {
  let spaces;

  beforeAll(() => {
    spaces = loadJson(path.join(CONFIGS_DIR, 'noi.space.json'));
  });

  test('is an array', () => {
    expect(Array.isArray(spaces)).toBe(true);
  });

  test('is non-empty', () => {
    expect(spaces.length).toBeGreaterThan(0);
  });

  test('every space has required fields: id, name, theme, active', () => {
    for (const space of spaces) {
      expect(typeof space.id).toBe('string');
      expect(space.id.length).toBeGreaterThan(0);
      expect(typeof space.name).toBe('string');
      expect(typeof space.theme).toBe('string');
      expect(typeof space.active).toBe('boolean');
    }
  });

  test('space IDs are unique', () => {
    const ids = spaces.map((s) => s.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  test('theme values are valid', () => {
    const validThemes = ['light', 'dark', 'system'];
    for (const space of spaces) {
      expect(validThemes).toContain(space.theme);
    }
  });

  test('at most one space is active', () => {
    const activeCount = spaces.filter((s) => s.active).length;
    expect(activeCount).toBeLessThanOrEqual(1);
  });
});

// ─── noi.conf.json ─────────────────────────────────────────────────────────────

describe('noi.conf.json', () => {
  let conf;

  beforeAll(() => {
    conf = loadJson(path.join(CONFIGS_DIR, 'noi.conf.json'));
  });

  test('is an object', () => {
    expect(conf !== null && typeof conf === 'object' && !Array.isArray(conf)).toBe(true);
  });

  test('language field is a string', () => {
    expect(typeof conf.language).toBe('string');
  });

  test('theme field is a valid theme value', () => {
    const validThemes = ['light', 'dark', 'system'];
    expect(validThemes).toContain(conf.theme);
  });

  test('boolean settings have boolean values', () => {
    const booleanFields = [
      'stay_on_top',
      'auto_update',
      'app_quit_confirm',
      'window_bordless',
      'window_button_highlight',
      'view_main_tabs',
      'view_main_pip',
      'view_main_bookmark',
      'view_left_fixed',
      'view_right_fixed',
      'view_right_bookmark',
      'view_bottom_fixed',
      'view_bottom_toolbar',
      'scan_preview',
      'proxy_rules_enable',
      'proxy_bypass_rules_enable',
      'lock_locales',
    ];
    for (const field of booleanFields) {
      if (Object.prototype.hasOwnProperty.call(conf, field)) {
        expect(typeof conf[field]).toBe('boolean');
      }
    }
  });

  test('numeric settings have numeric values', () => {
    const numericFields = [
      'view_left_width',
      'view_right_width',
      'view_bottom_height',
      'max_history_search',
      'max_ask_prompt',
      'max_ask_log',
      'max_ask_archive',
      'max_ask_semver_menu',
    ];
    for (const field of numericFields) {
      if (Object.prototype.hasOwnProperty.call(conf, field)) {
        expect(typeof conf[field]).toBe('number');
      }
    }
  });

  test('shortcut fields are non-empty strings', () => {
    const shortcutFields = Object.keys(conf).filter((k) => k.startsWith('shortcut_'));
    expect(shortcutFields.length).toBeGreaterThan(0);
    for (const field of shortcutFields) {
      expect(typeof conf[field]).toBe('string');
      expect(conf[field].length).toBeGreaterThan(0);
    }
  });

  test('ua_view fields are non-empty strings', () => {
    const uaFields = Object.keys(conf).filter((k) => k.startsWith('ua_view_'));
    expect(uaFields.length).toBeGreaterThan(0);
    for (const field of uaFields) {
      expect(typeof conf[field]).toBe('string');
      expect(conf[field].length).toBeGreaterThan(0);
    }
  });

  test('user_agent_list is a non-empty array', () => {
    expect(Array.isArray(conf.user_agent_list)).toBe(true);
    expect(conf.user_agent_list.length).toBeGreaterThan(0);
  });

  test('every user agent entry has id, name, and ua', () => {
    for (const entry of conf.user_agent_list) {
      expect(typeof entry.id).toBe('string');
      expect(entry.id.length).toBeGreaterThan(0);
      expect(typeof entry.name).toBe('string');
      expect(typeof entry.ua).toBe('string');
      expect(entry.ua.length).toBeGreaterThan(0);
    }
  });

  test('user agent IDs are unique', () => {
    const ids = conf.user_agent_list.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('search_engine_list is a non-empty array', () => {
    expect(Array.isArray(conf.search_engine_list)).toBe(true);
    expect(conf.search_engine_list.length).toBeGreaterThan(0);
  });

  test('every search engine entry has id, name, url, and icon', () => {
    for (const entry of conf.search_engine_list) {
      expect(typeof entry.id).toBe('string');
      expect(entry.id.length).toBeGreaterThan(0);
      expect(typeof entry.name).toBe('string');
      expect(typeof entry.url).toBe('string');
      expect(entry.url).toContain('{query}');
      expect(typeof entry.icon).toBe('string');
      expect(entry.icon.length).toBeGreaterThan(0);
    }
  });

  test('search engine IDs are unique', () => {
    const ids = conf.search_engine_list.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('nsh config block has required fields with correct types', () => {
    expect(conf.nsh).toBeDefined();
    expect(typeof conf.nsh.fontFamily).toBe('string');
    expect(typeof conf.nsh.fontSize).toBe('number');
    expect(conf.nsh.fontSize).toBeGreaterThan(0);
    expect(typeof conf.nsh.lineHeight).toBe('number');
    expect(typeof conf.nsh.cursorBlink).toBe('boolean');
    expect(typeof conf.nsh.cursorStyle).toBe('string');
    expect(typeof conf.nsh.scrollback).toBe('number');
    expect(conf.nsh.scrollback).toBeGreaterThan(0);
  });

  test('ask_view config block has required fields', () => {
    expect(conf.ask_view).toBeDefined();
    expect(typeof conf.ask_view.main).toBe('boolean');
    expect(typeof conf.ask_view.side).toBe('string');
  });
});

// ─── noi_awesome.json ──────────────────────────────────────────────────────────

describe('noi_awesome.json', () => {
  let entries;
  let entriesById;
  let nonDirEntries;
  let dirEntries;

  beforeAll(() => {
    entries = loadJson(path.join(CONFIGS_DIR, 'noi_awesome.json'));
    entriesById = new Map(entries.map((e) => [e.id, e]));
    nonDirEntries = entries.filter((e) => !e.dir);
    dirEntries = entries.filter((e) => e.dir === true);
  });

  test('is a non-empty array', () => {
    expect(Array.isArray(entries)).toBe(true);
    expect(entries.length).toBeGreaterThan(0);
  });

  test('every entry has an id field that is a non-empty string', () => {
    for (const entry of entries) {
      expect(typeof entry.id).toBe('string');
      expect(entry.id.length).toBeGreaterThan(0);
    }
  });

  test('entry IDs are unique', () => {
    const ids = entries.map((e) => e.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  test('every entry has a text field that is a non-empty string', () => {
    for (const entry of entries) {
      expect(typeof entry.text).toBe('string');
      expect(entry.text.length).toBeGreaterThan(0);
    }
  });

  test('non-directory entries have a url field that is a non-empty string', () => {
    for (const entry of nonDirEntries) {
      expect(typeof entry.url).toBe('string');
      expect(entry.url.length).toBeGreaterThan(0);
    }
  });

  test('non-directory entry URLs start with http, https, or noi://', () => {
    const validPrefixes = ['http://', 'https://', 'noi://'];
    for (const entry of nonDirEntries) {
      const url = entry.url;
      const valid = validPrefixes.some((prefix) => url.startsWith(prefix));
      expect(valid).toBe(true);
    }
  });

  test('directory entries have dir:true and iconDir fields', () => {
    expect(dirEntries.length).toBeGreaterThan(0);
    for (const dir of dirEntries) {
      expect(dir.dir).toBe(true);
      expect(typeof dir.iconDir).toBe('string');
      expect(dir.iconDir.length).toBeGreaterThan(0);
    }
  });

  test('all parent references point to existing IDs or 0 (root)', () => {
    for (const entry of entries) {
      if (entry.parent === 0 || entry.parent === undefined) continue;
      expect(entriesById.has(entry.parent)).toBe(true);
    }
  });

  test('parent references point to directory entries', () => {
    for (const entry of entries) {
      if (entry.parent === 0 || entry.parent === undefined) continue;
      const parent = entriesById.get(entry.parent);
      expect(parent.dir).toBe(true);
    }
  });

  test('active field is boolean when present', () => {
    for (const entry of entries) {
      if (Object.prototype.hasOwnProperty.call(entry, 'active')) {
        expect(typeof entry.active).toBe('boolean');
      }
    }
  });

  test('ask field is boolean when present', () => {
    for (const entry of entries) {
      if (Object.prototype.hasOwnProperty.call(entry, 'ask')) {
        expect(typeof entry.ask).toBe('boolean');
      }
    }
  });

  test('askFixInput is a non-negative integer when present', () => {
    for (const entry of entries) {
      if (Object.prototype.hasOwnProperty.call(entry, 'askFixInput')) {
        expect(typeof entry.askFixInput).toBe('number');
        expect(Number.isInteger(entry.askFixInput)).toBe(true);
        expect(entry.askFixInput).toBeGreaterThanOrEqual(0);
      }
    }
  });

  test('view entries in AI Playground have id and ask fields', () => {
    const playground = entries.find((e) => e.id === 'noi:aiplayground');
    if (!playground) return; // not present in this config variant
    expect(Array.isArray(playground.view)).toBe(true);
    for (const viewItem of playground.view) {
      expect(typeof viewItem.id).toBe('string');
      expect(typeof viewItem.ask).toBe('boolean');
    }
  });

  test('AI Playground view IDs reference existing entries', () => {
    const playground = entries.find((e) => e.id === 'noi:aiplayground');
    if (!playground || !Array.isArray(playground.view)) return;
    for (const viewItem of playground.view) {
      expect(entriesById.has(viewItem.id)).toBe(true);
    }
  });

  test('no entry has both dir:true and a url field', () => {
    for (const entry of entries) {
      if (entry.dir === true) {
        expect(entry.url).toBeUndefined();
      }
    }
  });
});
