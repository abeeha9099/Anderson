// Rendered-site verification: screenshots + automated checks at 1440 / 768 / 390.
const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const BASE = process.argv[2] || 'http://localhost:4173/';
const OUT = process.argv[3] || require('path').resolve(__dirname, 'output');
const ONLY = process.argv[4]; // optional viewport name filter
fs.mkdirSync(OUT, { recursive: true });
const axeSource = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024, isMobile: true, hasTouch: true },
  { name: 'mobile', width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
];

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const report = {};
  for (const vp of VIEWPORTS.filter((v) => !ONLY || v.name === ONLY)) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: vp.deviceScaleFactor || 1,
      isMobile: !!vp.isMobile,
      hasTouch: !!vp.hasTouch,
      reducedMotion: 'reduce', // disables reveal/entrance animation so screenshots are deterministic
    });
    const page = await ctx.newPage();
    const consoleMsgs = [];
    page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) consoleMsgs.push(`${m.type()}: ${m.text().slice(0, 300)}`); });
    page.on('pageerror', (e) => consoleMsgs.push(`pageerror: ${e.message.slice(0, 300)}`));
    const failed = [];
    page.on('requestfailed', (r) => failed.push(r.url()));
    page.on('response', (r) => { if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`); });

    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(OUT, `${vp.name}-00-fold.png`) });

    const checks = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const visible = (el) => {
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && !el.closest('[hidden]');
      };
      const overflow = [...document.querySelectorAll('body *')]
        .filter((el) => { const r = el.getBoundingClientRect(); return r.right > vw + 1 && r.width > 0 && !el.closest('#review-list') && getComputedStyle(el).position !== 'fixed'; })
        .slice(0, 12)
        .map((el) => `${el.tagName}.${String(el.className).slice(0, 60)} right=${Math.round(el.getBoundingClientRect().right)}`);
      const small = [...document.querySelectorAll('a[href], button, input, select, textarea, [role="tab"]')]
        .filter(visible)
        .filter((el) => { const r = el.getBoundingClientRect(); return r.height < 43.5 || r.width < 43.5; })
        .map((el) => { const r = el.getBoundingClientRect(); return `${el.tagName} "${(el.innerText || el.getAttribute('aria-label') || '').trim().slice(0, 30)}" ${Math.round(r.width)}x${Math.round(r.height)}`; });
      const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => `${'  '.repeat(Number(h.tagName[1]) - 1)}${h.tagName} ${h.textContent.trim().slice(0, 70)}${visible(h) ? '' : ' [hidden]'}`);
      const imgsNoAlt = [...document.images].filter((i) => !i.hasAttribute('alt')).map((i) => i.src);
      const brokenImgs = [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.loading !== 'lazy').map((i) => i.src);
      const fonts = [...document.fonts].filter((f) => f.status === 'loaded').map((f) => `${f.family} ${f.weight} ${f.style}`);
      return {
        docWidth: document.documentElement.scrollWidth, vw, pageHeight: document.documentElement.scrollHeight,
        overflow, small, headings, imgsNoAlt, brokenImgs, fonts,
        h1Count: document.querySelectorAll('h1').length,
      };
    });

    // Section screenshots (header hidden so it does not cover section tops)
    await page.addStyleTag({ content: 'header.sticky{visibility:hidden!important}' });
    const sections = page.locator('main > section, footer');
    const n = await sections.count();
    for (let i = 0; i < n; i++) {
      const el = sections.nth(i);
      const id = (await el.getAttribute('id')) || (await el.getAttribute('aria-labelledby')) || `s${i}`;
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(250);
      await el.screenshot({ path: path.join(OUT, `${vp.name}-s${String(i + 1).padStart(2, '0')}-${id}.png`) });
    }
    await page.addStyleTag({ content: 'header.sticky{visibility:visible!important}' });

    // axe-core (let style changes settle first)
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
    await page.addScriptTag({ content: axeSource });
    const axe = await page.evaluate(async () => {
      const r = await window.axe.run(document, { resultTypes: ['violations'] });
      return r.violations.map((v) => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.slice(0, 4).map((n) => n.target.join(' ')) }));
    });

    report[vp.name] = { ...checks, axe, console: consoleMsgs, failedRequests: failed };
    await ctx.close();
  }
  fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 1));
  for (const [name, r] of Object.entries(report)) {
    console.log(`\n===== ${name}: docWidth ${r.docWidth}/${r.vw}  pageHeight ${r.pageHeight}  h1=${r.h1Count}`);
    console.log('overflow:', r.overflow.length ? r.overflow : 'none');
    console.log('small targets:', r.small.length ? r.small : 'none');
    console.log('imgs without alt:', r.imgsNoAlt.length, ' broken imgs:', r.brokenImgs);
    console.log('console:', r.console.length ? r.console : 'clean', ' failed requests:', r.failedRequests.length ? r.failedRequests : 'none');
    console.log('axe violations:', r.axe.length ? JSON.stringify(r.axe, null, 1) : 'none');
  }
  console.log('\nheadings (desktop):\n' + (report.desktop ? report.desktop.headings.join('\n') : ''));
  console.log('\nfonts loaded:', report[Object.keys(report)[0]].fonts.join(' | '));
  await browser.close();
})();
