// Generates the optimized images used by the site from the untouched originals.
// Source: assets/original (see assets/original/SOURCES.md)  ->  Output: public/images
// Run with: npm run images
import { readFile, mkdir, copyFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SRC = path.resolve('assets/original');
const OUT = path.resolve('public/images');
await mkdir(OUT, { recursive: true });

const src = (f) => path.join(SRC, f);
const out = (f) => path.join(OUT, f);

async function variants(file, name, widths, { extract, quality = 78 } = {}) {
  for (const w of widths) {
    let img = sharp(src(file));
    if (extract) img = img.extract(extract);
    await img.resize({ width: w, withoutEnlargement: true }).webp({ quality }).toFile(out(`${name}-${w}.webp`));
  }
  console.log('✓', name, widths.join(','));
}

// Hero portrait — the ONLY photograph of the attorney on the page.
// Source: assets/derived/portrait-cutout.png, made from the original Pic-for-home-page.jpg by
// scripts/make-portrait-cutout.py (background removed; the person is not retouched). Transparent WebP.
for (const w of [400, 620]) {
  await sharp(path.resolve('assets/derived/portrait-cutout.png'))
    .resize({ width: w, withoutEnlargement: true })
    .webp({ quality: 82, alphaQuality: 90, smartSubsample: true })
    .toFile(out(`portrait-cutout-${w}.webp`));
}
console.log('✓ portrait-cutout 400,620');

// Atmosphere images (shown with a CSS duotone).
await variants('personal-injury-lawyer-rock-hill-sc.webp', 'archway', [960, 1600], { quality: 70 });
await variants('legal-council.webp', 'gavel-meeting', [640, 960, 1280], { quality: 72 });
// Desktop "Why Choose" frame: a 4:5 crop of the same photo that keeps the whole gavel and sound block in view
// (the old tall, narrow slice cut the gavel head off and was upscaled ~3×).
await variants('legal-council.webp', 'gavel-portrait', [560, 820, 1024], {
  extract: { left: 450, top: 0, width: 1024, height: 1280 },
  quality: 78,
});
await variants('gavel-and-books.webp', 'gavel-books', [960, 1600], { quality: 70 });

// Logos. The white logo is copied as the original lossless PNG (see the copy list below) so its
// thin script strokes and small "LAW FIRM, PC" lettering stay crisp at large sizes.
await variants('SR-anderson-law-firm-300x283-1.png', 'logo-blue-tile', [120, 240], { quality: 90 });

// Badge "SVGs" are base64 PNGs wrapped in SVG (≈810 KB total). Extract and re-encode at 2× display size.
const badges = [
  'south-carolina-bar-logo', 'york-county-bar-association', 'north-carolina-state-bar-1',
  'avvo-logo', 'google-logo', 'BBB', 'yelp',
];
for (const b of badges) {
  const svg = await readFile(src(`${b}.svg`), 'utf8');
  const m = svg.match(/href="data:image\/\w+;base64,([^"]+)"/);
  if (!m) throw new Error(`No embedded bitmap in ${b}.svg`);
  const info = await sharp(Buffer.from(m[1], 'base64'))
    .resize({ width: 300, height: 120, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 88 })
    .toFile(out(`badge-${b.toLowerCase()}.webp`));
  console.log('✓ badge', b, `${info.width}×${info.height}`);
}

// Files copied as-is.
for (const [from, to] of [
  ['SR-anderson-law-firm-white.png', 'logo-white.png'],
  ['cropped-SR-anderson-law-firm-favicon-32x32.png', 'favicon-32.png'],
  ['cropped-SR-anderson-law-firm-favicon-192x192.png', 'favicon-192.png'],
  ['cropped-SR-anderson-law-firm-favicon-180x180.png', 'apple-touch-icon.png'],
  ['seo.webp', 'og-image.webp'],
]) {
  await copyFile(src(from), out(to));
  console.log('✓ copy', to);
}
