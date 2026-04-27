const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PROMPTS_DIR = path.join(ROOT, 'prompts');

function loadJson(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

// ─── awesome-chatgpt.zh.json ───────────────────────────────────────────────────

describe('prompts/awesome-chatgpt.zh.json', () => {
  let prompts;

  beforeAll(() => {
    prompts = loadJson(path.join(PROMPTS_DIR, 'awesome-chatgpt.zh.json'));
  });

  test('is a non-empty array', () => {
    expect(Array.isArray(prompts)).toBe(true);
    expect(prompts.length).toBeGreaterThan(0);
  });

  test('every prompt entry has an act field that is a non-empty string', () => {
    for (const entry of prompts) {
      expect(typeof entry.act).toBe('string');
      expect(entry.act.length).toBeGreaterThan(0);
    }
  });

  test('every prompt entry has a prompt field that is a non-empty string', () => {
    for (const entry of prompts) {
      expect(typeof entry.prompt).toBe('string');
      expect(entry.prompt.length).toBeGreaterThan(0);
    }
  });

  test('act values are unique (no duplicate role names)', () => {
    const acts = prompts.map((p) => p.act);
    const unique = new Set(acts);
    expect(unique.size).toBe(acts.length);
  });

  test('every prompt entry has exactly the fields act and prompt', () => {
    const allowedFields = new Set(['act', 'prompt']);
    for (const entry of prompts) {
      const extraFields = Object.keys(entry).filter((k) => !allowedFields.has(k));
      expect(extraFields).toEqual([]);
    }
  });

  test('prompt strings do not contain raw null bytes', () => {
    for (const entry of prompts) {
      expect(entry.prompt).not.toMatch(/\x00/);
    }
  });

  test('prompts file contains at least 20 entries', () => {
    expect(prompts.length).toBeGreaterThanOrEqual(20);
  });
});

// ─── prompts directory structure ──────────────────────────────────────────────

describe('prompts/ directory', () => {
  test('directory exists', () => {
    expect(fs.existsSync(PROMPTS_DIR)).toBe(true);
  });

  test('contains at least one .json file', () => {
    const files = fs.readdirSync(PROMPTS_DIR).filter((f) => f.endsWith('.json'));
    expect(files.length).toBeGreaterThan(0);
  });

  test('all files in prompts/ are valid JSON', () => {
    const files = fs.readdirSync(PROMPTS_DIR).filter((f) => f.endsWith('.json'));
    for (const file of files) {
      const filePath = path.join(PROMPTS_DIR, file);
      expect(() => loadJson(filePath)).not.toThrow();
    }
  });
});
