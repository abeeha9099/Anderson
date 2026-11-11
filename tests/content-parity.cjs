// Content parity: every content line of audit/content-inventory.md must appear verbatim in the rendered page.
const { chromium } = require('playwright-core');
const fs = require('fs');

const INVENTORY = process.argv[2] || require('path').resolve(__dirname, '../audit/content-inventory.md');
const BASE = process.argv[3] || 'http://localhost:4173/';

const norm = (s) => s.replace(/[’‘]/g, "'").replace(/[“”]/g, '"').replace(/ /g, ' ').replace(/\s+/g, ' ').trim();

const md = fs.readFileSync(INVENTORY, 'utf8');
// Only the homepage sections + attorney facts (skip page meta, which lives in <head>)
const body = md.slice(md.indexOf('## Top utility bar'));
const candidates = [];
for (let raw of body.split('\n')) {
  let line = raw.trim();
  if (!line || line.startsWith('#') || line.startsWith('---') || line.startsWith('|') || line.startsWith('_') || line.startsWith('`')) continue;
  if (/^(Mobile menu drawer|Floating elements|Social icons:|Button:|Bottom bar:|Services dropdown options|Validation messages|Source:|Copy below)/.test(line)) continue;
  line = line.replace(/^- /, '').replace(/^\*\*\[H\d\]\*\*\s*/, '');
  line = line.replace(/\*\*←.*$/, '').replace(/`[^`]*`.*$/, '');
  line = line.replace(/_\(sic[^)]*\)_/, '').replace(/_\(hidden on mobile\)_/, '');
  line = line.replace(/\(parent link is `#`\)/, '');
  // Links: [text](url) -> text
  line = line.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
  line = line.replace(/\*\*/g, '').replace(/\s*→\s*\S+/g, '').trim();
  if (line.includes(' · ')) { for (const part of line.split(' · ')) candidates.push(part.trim()); continue; }
  if (line.length < 2) continue;
  candidates.push(line);
}
// Attorney facts block uses "Label: value" bullets
const facts = [];
for (const c of candidates.splice(0)) {
  const m = c.match(/^(Name|Education|License|Memberships):\s*(.*)$/);
  if (m) facts.push(...m[2].split(' · '));
  else facts.push(c);
}
const items = [...new Set(facts.map(norm).filter((s) => s.length > 1 && !/^Attorney Syretta R\. Anderson$/.test(s)))];

// Explicit extras from the form inventory / dropdown
const formOptions = ['Premise Liability', 'Vehicular Accidents', 'Dog Bites', 'Child Custody', 'Child Support', 'Adoption', 'Visitation', 'Alimony', 'Post Separation', 'Division of Assets', 'Living Will', 'Wills', 'Other'];
const placeholders = ['John', 'Smith', 'john@smith.com', '(123)456-7890', '12345', 'Tell us how we can help'];

(async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  // Open every desktop dropdown so their links are in the DOM text (they are in the DOM anyway; textContent ignores hidden state)
  const data = await page.evaluate(() => ({
    text: document.body.textContent,
    placeholders: [...document.querySelectorAll('[placeholder]')].map((e) => e.getAttribute('placeholder')),
    options: [...document.querySelectorAll('#field-service option')].map((o) => o.textContent),
    alts: [...document.images].map((i) => i.alt),
  }));
  await browser.close();

  const text = norm(data.text);
  const squash = (s) => s.replace(/\s+/g, '');
  const textSquashed = squash(text);
  const clean = (s) => s.replace(/^"|"$/g, '').replace(/\s*Maps directions$/, '').replace(/\s*\((parent link is|column heading)\)?$/, '').replace(/^Button:\s*/, '').trim();
  // Separator-insensitive form: the client asked for dash separators to be removed (e.g. "Mon - Thu" →
  // "Mon to Thu", "North Carolina – 2010 – Present" → "North Carolina, 2010 to Present"). Same words/numbers.
  const canon = (s) => s.toLowerCase().replace(/[-–—:,]/g, ' ').replace(/\bto\b/g, ' ').replace(/\s+/g, '');
  const textCanon = canon(text);
  const missing = items
    .map((s) => ({ raw: s, c: clean(s) }))
    .filter(({ c }) => c.length > 1 && !c.startsWith('[') && !c.includes('](http') && !text.includes(c) && !textSquashed.includes(squash(c)) && !textCanon.includes(canon(c)))
    .map(({ c }) => c);
  const missingOptions = formOptions.filter((o) => !data.options.includes(o));
  const missingPh = placeholders.filter((p) => !data.placeholders.includes(p));
  const shouldBeGone = ['Start a project with me!', 'financial planning', 'Click to Enlarge'].filter((s) => text.includes(norm(s)));

  console.log(`Checked ${items.length} content lines from the inventory.`);
  console.log(`Present: ${items.length - missing.length}   Missing: ${missing.length}`);
  if (missing.length) console.log('MISSING:\n  - ' + missing.join('\n  - '));
  console.log('Form options missing:', missingOptions.length ? missingOptions : 'none');
  console.log('Placeholders missing:', missingPh.length ? missingPh : 'none');
  console.log('Template leftovers still present:', shouldBeGone.length ? shouldBeGone : 'none');
})();
