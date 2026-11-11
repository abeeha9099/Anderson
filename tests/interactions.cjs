// Interaction tests against the built site.
const { chromium } = require('playwright-core');
const path = require('path');
const BASE = process.argv[2] || 'http://localhost:4173/';
const OUT = process.argv[3] || require('path').resolve(__dirname, 'output');
const results = [];
const check = (name, ok, detail = '') => { results.push(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`); };

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  // ---------- DESKTOP ----------
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await ctx.route('mailto:*', (route) => route.abort()); // never create email drafts during tests
    const p = await ctx.newPage();
    const errors = [];
    p.on('pageerror', (e) => errors.push(e.message));
    p.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    await p.goto(BASE, { waitUntil: 'networkidle' });

    // Skip link is first tab stop and becomes visible
    await p.keyboard.press('Tab');
    const skip = await p.evaluate(() => ({ text: document.activeElement.textContent, w: document.activeElement.getBoundingClientRect().width }));
    check('Skip link is first focus and visible', skip.text === 'Skip to content' && skip.w > 50, JSON.stringify(skip));

    // Dropdown via keyboard: focus "Family Law" button, Enter opens, Escape closes & returns focus
    const fam = p.getByRole('button', { name: 'Family Law' });
    await fam.focus();
    await p.keyboard.press('Enter');
    let expanded = await fam.getAttribute('aria-expanded');
    const panelVisible = await p.locator('#nav-family-law').isVisible();
    check('Dropdown opens with Enter (aria-expanded + visible)', expanded === 'true' && panelVisible);
    await p.screenshot({ path: path.join(OUT, 'i-desktop-dropdown.png'), clip: { x: 0, y: 0, width: 1440, height: 520 } });
    await p.keyboard.press('Tab');
    const inPanel = await p.evaluate(() => !!document.activeElement.closest('#nav-family-law'));
    check('Tab moves into dropdown links', inPanel);
    await p.keyboard.press('Escape');
    expanded = await fam.getAttribute('aria-expanded');
    const focusBack = await p.evaluate(() => document.activeElement.textContent.trim());
    check('Escape closes dropdown and returns focus', expanded === 'false' && focusBack.startsWith('Family Law'), focusBack);

    // Hover opens "More" (two-column panel)
    await p.getByRole('button', { name: 'More' }).hover();
    await p.waitForTimeout(300);
    check('Hover opens "More" panel', await p.locator('#nav-more').isVisible());
    await p.screenshot({ path: path.join(OUT, 'i-desktop-more.png'), clip: { x: 500, y: 0, width: 940, height: 640 } });
    await p.mouse.move(10, 600);
    await p.waitForTimeout(400);
    check('Moving away closes "More" panel', !(await p.locator('#nav-more').isVisible()));

    // Only one photograph of the attorney on the page
    const portraits = await p.evaluate(() => [...document.images].filter((i) => /syretta/i.test(i.alt) || /portrait-(cutout|full|about)/i.test(i.src)).length);
    check('Only one photograph of the attorney is used', portraits === 1, `found ${portraits}`);

    // Logo: large at top, does not overlap hero text
    const logo = p.locator('header.sticky img');
    const logoTop = await logo.boundingBox();
    const eyebrow = await p.locator('#top p').first().boundingBox();
    const headerTop = await p.locator('header.sticky').boundingBox();
    check('Desktop: logo is medium-sized (64–80px) and fully inside the header bar', logoTop.height >= 64 && logoTop.height <= 80 && logoTop.y >= headerTop.y && logoTop.y + logoTop.height <= headerTop.y + headerTop.height, `${Math.round(logoTop.height)}px`);
    check('Desktop: logo does not overlap hero text', logoTop.y + logoTop.height < eyebrow.y, `logo bottom ${Math.round(logoTop.y + logoTop.height)}, text top ${Math.round(eyebrow.y)}`);

    // Header alignment: nav items, divider and Call Now share one vertical centre line
    const centres = await p.evaluate(() => {
      const c = (el) => { const r = el.getBoundingClientRect(); return r.top + r.height / 2; };
      const nav = [...document.querySelectorAll('nav[aria-label="Main"] > ul > li > :is(a,button)')].map(c);
      const call = c(document.querySelector('header.sticky a[href^="tel:"]'));
      const logoC = c(document.querySelector('header.sticky img'));
      return { spread: Math.max(...nav, call) - Math.min(...nav, call), logoOff: Math.abs(logoC - call) };
    });
    check('Desktop: nav items and Call Now are aligned on one centre line (±1px), logo centred (±2px)', centres.spread <= 1 && centres.logoOff <= 2, JSON.stringify(centres));

    // Hero: copy block and portrait are vertically balanced, and the whole hero fits in a 900px screen
    const heroBal = await p.evaluate(() => {
      const copy = document.querySelector('#hero-heading').parentElement.getBoundingClientRect();
      const fig = document.querySelector('#top figure').getBoundingClientRect();
      const hero = document.querySelector('#top').getBoundingClientRect();
      return { copyMid: Math.round(copy.top + copy.height / 2), figMid: Math.round(fig.top + fig.height / 2), heroBottom: Math.round(hero.bottom), figH: Math.round(fig.height), copyH: Math.round(copy.height) };
    });
    check('Desktop hero: copy and portrait centres within 60px; hero ends within the first screen', Math.abs(heroBal.copyMid - heroBal.figMid) <= 60 && heroBal.heroBottom <= 900, JSON.stringify(heroBal));

    // Portrait has no white rectangle: the image is a transparent cutout (corner pixels fully transparent)
    const cornerAlpha = await p.evaluate(async () => {
      const img = document.querySelector('#top figure img');
      await img.decode();
      const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight;
      const g = c.getContext('2d'); g.drawImage(img, 0, 0);
      return [[2, 2], [c.width - 3, 2], [2, c.height / 2], [c.width - 3, c.height / 2]].map(([x, y]) => g.getImageData(x, y, 1, 1).data[3]);
    });
    check('Hero portrait is a transparent cutout (no white background)', cornerAlpha.every((a) => a === 0), JSON.stringify(cornerAlpha));

    // Sticky header: bar height constant (no layout shift), logo scales down to fit the bar
    const h0 = await p.locator('header.sticky > div').evaluate((e) => e.getBoundingClientRect().height);
    await p.mouse.wheel(0, 1200);
    await p.waitForTimeout(600);
    const h1 = await p.locator('header.sticky > div').evaluate((e) => e.getBoundingClientRect().height);
    const headerBox = await p.locator('header.sticky').boundingBox();
    const logoScrolled = await logo.boundingBox();
    check('Sticky header stays at top with constant 88px height (no layout shift)', Math.round(h0) === 88 && Math.round(h1) === 88 && headerBox.y === 0, `${h0}→${h1}`);
    check('Scrolled logo fits inside the header bar', logoScrolled.y >= 0 && logoScrolled.y + logoScrolled.height <= headerBox.height && logoScrolled.height >= 50, `${Math.round(logoScrolled.height)}px tall`);
    await p.screenshot({ path: path.join(OUT, 'i-desktop-sticky.png'), clip: { x: 0, y: 0, width: 1440, height: 300 } });

    // A #practice-<group> link selects that tab
    await p.evaluate(() => { window.scrollTo(0, 0); window.location.hash = '#practice-estate'; });
    await p.waitForTimeout(900);
    const estSel = await p.locator('#tab-estate').getAttribute('aria-selected');
    const estVisible = await p.locator('#practice-estate').isVisible();
    check('#practice-estate link selects the Estate Planning tab', estSel === 'true' && estVisible);

    // Tabs keyboard: ArrowRight moves to Personal Injury, Home goes to first
    await p.locator('#tab-estate').focus();
    await p.keyboard.press('ArrowRight');
    const injSel = await p.locator('#tab-injury').getAttribute('aria-selected');
    const injFocus = await p.evaluate(() => document.activeElement.id);
    check('ArrowRight selects + focuses next tab', injSel === 'true' && injFocus === 'tab-injury');
    await p.keyboard.press('ArrowRight');
    check('ArrowRight wraps to first tab', (await p.evaluate(() => document.activeElement.id)) === 'tab-family');
    await p.keyboard.press('End');
    check('End selects last tab', (await p.locator('#tab-injury').getAttribute('aria-selected')) === 'true');
    await p.waitForTimeout(1000); // sliding underline (0.5s) + staggered cell entrance (last ends ≈0.72s)
    const tabMotion = await p.evaluate(() => {
      const tab = document.getElementById('tab-injury');
      const bar = document.querySelector('[role="tablist"] > span[aria-hidden="true"]');
      const t = tab.getBoundingClientRect(); const b = bar.getBoundingClientRect();
      const ul = document.querySelector('#practice-injury ul');
      return {
        barAligned: Math.abs(t.left - b.left) <= 1 && Math.abs(t.width - b.width) <= 1,
        tabEnter: ul.classList.contains('tab-enter'),
        cellsVisible: [...ul.children].every((li) => getComputedStyle(li).opacity === '1'),
      };
    });
    check('Tabs: sliding underline sits under the selected tab; new cells animate in and end fully visible', tabMotion.barAligned && tabMotion.tabEnter && tabMotion.cellsVisible, JSON.stringify(tabMotion));
    await p.locator('#practice-areas').screenshot({ path: path.join(OUT, 'i-desktop-injury-tab.png') });

    // PI card → contact form with service preselected
    await p.getByRole('link', { name: 'Send Me a Message about Dog Bites' }).click();
    // Wait until the smooth scroll has actually finished (scroll position stable for 300ms), not a fixed time.
    await p.waitForFunction(() => new Promise((resolve) => {
      let last = window.scrollY, stable = 0;
      const tick = () => { if (window.scrollY === last) stable += 50; else { stable = 0; last = window.scrollY; } if (stable >= 300) resolve(true); else setTimeout(tick, 50); };
      setTimeout(tick, 50);
    }), null, { timeout: 8000 });
    const svc = await p.locator('#field-service').inputValue();
    const url = p.url();
    const contactTop = await p.locator('#contact').evaluate((e) => Math.round(e.getBoundingClientRect().top));
    check('PI link preselects "Dog Bites" and scrolls to form', svc === 'Dog Bites' && url.includes('service=Dog+Bites') && url.endsWith('#contact') && contactTop < 200, `value=${svc} top=${contactTop} url=${url.split('/').pop()}`);

    // Form validation: submit empty
    await p.getByRole('button', { name: 'Submit' }).click();
    await p.waitForTimeout(200);
    const alert = await p.locator('[role="alert"]').innerText().catch(() => '');
    const focusedId = await p.evaluate(() => document.activeElement.id);
    const emailInvalid = await p.locator('#field-email').getAttribute('aria-invalid');
    const emailDesc = await p.locator('#field-email').getAttribute('aria-describedby');
    check('Empty submit shows error summary, focuses Email, links error', alert.includes('Email') && focusedId === 'field-email' && emailInvalid === 'true' && emailDesc === 'field-email-error', `focus=${focusedId}`);
    await p.locator('#field-email').fill('not-an-email');
    await p.locator('#field-phone').fill('12345');
    await p.getByRole('button', { name: 'Submit' }).click();
    await p.waitForTimeout(200);
    const emailErr = await p.locator('#field-email-error').innerText();
    const phoneErr = await p.locator('#field-phone-error').innerText();
    check('Invalid email/phone show the original validation messages', emailErr.includes('The email address is invalid') && phoneErr.includes('Please enter a 10-digit phone number'));
    await p.locator('#contact').screenshot({ path: path.join(OUT, 'i-desktop-form-errors.png') });

    // Labels are associated (clicking label focuses field)
    for (const [label, id] of [['First name', 'field-firstName'], ['Last name', 'field-lastName'], ['Email', 'field-email'], ['Phone Number', 'field-phone'], ['Zip code', 'field-zip'], ['Services', 'field-service'], ['Message', 'field-message']]) {
      const ok = await p.getByLabel(label, { exact: label !== 'Email' }).first().evaluate((el, i) => el.id === i, id).catch(() => false);
      check(`Label "${label}" is associated with #${id}`, ok);
    }

    // NOTE: the suite never submits a VALID form, so no email draft is ever created (client request:
    // "don't send test emails"). Only invalid submissions are tested above; they never leave the page.
    check('Demo disclosure is visible above Submit', await p.getByText('Demo form: not connected to a server yet.').isVisible());

    // Reviews: show all + read full review
    const visibleBefore = await p.locator('#review-list > li:visible').count();
    await p.getByRole('button', { name: /Show all reviews/ }).click();
    const visibleAfter = await p.locator('#review-list > li:visible').count();
    check('"Show all reviews" reveals all 11 non-featured reviews', visibleBefore === 6 && visibleAfter === 11, `${visibleBefore}→${visibleAfter}`);
    const rf = p.locator('button[aria-controls="review-jessyca-s"]');
    const label0 = await rf.innerText();
    await rf.click();
    const label1 = await rf.innerText();
    const clamped = await p.locator('#review-jessyca-s').evaluate((e) => e.classList.contains('line-clamp-6'));
    check('"Read full review" expands text and toggles aria-expanded/label', (await rf.getAttribute('aria-expanded')) === 'true' && !clamped && label0.startsWith('Read full review') && label1.startsWith('Show less'));

    check('No runtime errors on desktop', errors.length === 0, errors.join(' | '));
    await ctx.close();
  }

  // ---------- MOBILE ----------
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
    await ctx.route('mailto:*', (route) => route.abort()); // never create email drafts during tests
    const p = await ctx.newPage();
    const errors = [];
    p.on('pageerror', (e) => errors.push(e.message));
    await p.goto(BASE, { waitUntil: 'networkidle' });

    // Logo: large and clear at top, not overlapping hero text
    const mLogo = await p.locator('header.sticky img').boundingBox();
    const mEyebrow = await p.locator('#top p').first().boundingBox();
    check('Mobile: logo is medium-sized (52–64px), inside the bar and clear of hero text', mLogo.height >= 52 && mLogo.height <= 64 && mLogo.y + mLogo.height <= 72 && mLogo.y + mLogo.height < mEyebrow.y, `${Math.round(mLogo.height)}px, bottom ${Math.round(mLogo.y + mLogo.height)} < ${Math.round(mEyebrow.y)}`);

    // Sticky bottom action bar: visible at top, mid-page and at the very bottom
    const bar = p.getByRole('complementary', { name: 'Quick contact' });
    const barCall = bar.getByRole('link', { name: /Call Now/ });
    const barMsg = bar.getByRole('link', { name: 'Send Me a Message' });
    const inView = async () => {
      const b = await bar.boundingBox();
      return b && b.y >= 0 && Math.round(b.y + b.height) <= 844 && (await barCall.isVisible()) && (await barMsg.isVisible());
    };
    await p.waitForTimeout(1300); // the bar slides up shortly after load
    const atTop = await inView();
    await p.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight / 2));
    await p.waitForTimeout(300);
    const atMid = await inView();
    await p.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await p.waitForTimeout(300);
    const atEnd = await inView();
    const callBox = await barCall.boundingBox();
    const msgBox = await barMsg.boundingBox();
    check('Mobile: sticky CTA bar visible at top, middle and end of page', atTop && atMid && atEnd);
    check('Mobile: CTA bar buttons are ≥44px and call is tel:', callBox.height >= 44 && msgBox.height >= 44 && (await barCall.getAttribute('href')) === 'tel:8039805252');
    const barBox = await bar.boundingBox();
    const lastLine = await p.locator('footer').getByRole('link', { name: 'Privacy Policy' }).boundingBox();
    check('Mobile: CTA bar does not cover the last footer line', lastLine.y + lastLine.height <= barBox.y, `privacy bottom ${Math.round(lastLine.y + lastLine.height)}, bar top ${Math.round(barBox.y)}`);
    await p.screenshot({ path: path.join(OUT, 'i-mobile-bar-end.png') });

    // Bar steps aside (and is inert) while typing in the form
    await p.locator('#field-email').focus();
    await p.waitForTimeout(400);
    const hiddenWhileTyping = await p.evaluate(() => {
      const el = document.querySelector('aside[aria-label="Quick contact"]');
      return el.hasAttribute('inert') && el.getBoundingClientRect().top >= window.innerHeight - 1;
    });
    check('Mobile: CTA bar slides away and is inert while a form field is focused', hiddenWhileTyping);
    await p.locator('#field-email').blur();
    await p.waitForTimeout(400);
    check('Mobile: CTA bar returns after leaving the field', await inView());
    await p.evaluate(() => window.scrollTo(0, 0));
    await p.waitForTimeout(300);

    // Menu: open, focus inside, trap, escape
    await p.getByRole('button', { name: 'Open menu' }).tap();
    await p.waitForTimeout(400);
    const dialog = p.getByRole('dialog', { name: 'Menu' });
    check('Mobile menu opens as modal dialog', await dialog.isVisible());
    const firstFocus = await p.evaluate(() => !!document.activeElement.closest('#mobile-menu'));
    check('Focus moves into menu', firstFocus);
    const bodyLocked = await p.evaluate(() => getComputedStyle(document.body).overflow === 'hidden');
    check('Page scroll locked while menu open', bodyLocked);
    const outsideInert = await p.evaluate(() => document.querySelector('main').closest('[inert]') !== null && document.querySelector('footer').closest('[inert]') !== null);
    check('Content behind the menu is inert while open', outsideInert);
    await dialog.getByRole('button', { name: 'Estate Planning' }).tap();
    await p.waitForTimeout(250);
    await p.screenshot({ path: path.join(OUT, 'i-mobile-menu.png') });
    for (let i = 0; i < 40; i++) await p.keyboard.press('Tab');
    const stillInside = await p.evaluate(() => !!document.activeElement.closest('#mobile-menu'));
    check('Focus trap keeps Tab inside menu', stillInside);
    await p.keyboard.press('Escape');
    await p.waitForTimeout(200);
    const closed = !(await dialog.isVisible().catch(() => false));
    const returned = await p.evaluate(() => document.activeElement.getAttribute('aria-controls'));
    check('Escape closes menu and returns focus to menu button', closed && returned === 'mobile-menu');

    // Practice accordion: tap a collapsed item expands it
    await p.locator('#tab-divorce').tap();
    const acc = p.locator('#practice-divorce').getByRole('button', { name: 'Alimony' });
    await acc.scrollIntoViewIfNeeded();
    const before = await acc.getAttribute('aria-expanded');
    await acc.tap();
    await p.waitForTimeout(350);
    const after = await acc.getAttribute('aria-expanded');
    const bodyVis = await p.locator('#alimony-details').evaluate((e) => getComputedStyle(e.firstElementChild).visibility);
    check('Mobile: practice accordion expands on tap', before === 'false' && after === 'true' && bodyVis === 'visible');
    const collapsedVis = await p.locator('#post-separation-details').evaluate((e) => getComputedStyle(e.firstElementChild).visibility);
    check('Mobile: collapsed accordion content is not focusable (visibility hidden)', collapsedVis === 'hidden');
    await p.locator('#practice-areas').screenshot({ path: path.join(OUT, 'i-mobile-practice.png') });

    // Carousel next button
    const next = p.getByRole('button', { name: 'Next review' });
    await next.scrollIntoViewIfNeeded();
    await next.tap();
    await p.waitForTimeout(700);
    const counter = await p.locator('#reviews [aria-live="polite"]').innerText();
    check('Mobile: carousel Next advances counter', counter.startsWith('2 /'), counter);
    const docW = await p.evaluate(() => document.documentElement.scrollWidth);
    check('Mobile: still no horizontal overflow after carousel use', docW === 390, String(docW));

    // Footer accordion
    const fBtn = p.locator('footer').getByRole('button', { name: 'Estate Planning' });
    await fBtn.scrollIntoViewIfNeeded();
    await fBtn.tap();
    await p.waitForTimeout(300);
    check('Mobile: footer group expands', (await fBtn.getAttribute('aria-expanded')) === 'true' && (await p.locator('footer').getByRole('link', { name: 'Wills', exact: true }).isVisible()));

    check('No runtime errors on mobile', errors.length === 0, errors.join(' | '));
    await ctx.close();
  }

  // ---------- REVEAL (motion enabled) ----------
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const p = await ctx.newPage();
    await p.goto(BASE, { waitUntil: 'networkidle' });
    const pendingAtStart = await p.locator('.reveal-pending').count();
    for (let y = 0; y < 9000; y += 400) { await p.evaluate((v) => window.scrollTo(0, v), y); await p.waitForTimeout(80); }
    await p.waitForTimeout(800);
    const stillPending = await p.locator('.reveal-pending').count();
    check('Scroll reveal: below-fold items start hidden and all end visible', pendingAtStart > 0 && stillPending === 0, `pending ${pendingAtStart}→${stillPending}`);
    // A bare `data-reveal` renders as data-reveal="true" in React: that is the default variant.
    const kinds = await p.evaluate(() => [...new Set([...document.querySelectorAll('[data-reveal]')].map((e) => (!e.dataset.reveal || e.dataset.reveal === 'true' ? 'default' : e.dataset.reveal)))].sort());
    check('Restrained reveals: only soft fade-up + quiet sequence variants (no zoom/line effects)', kinds.join(',') === 'default,stagger', kinds.join(','));
    const revealCount = await p.evaluate(() => {
      const els = [...document.querySelectorAll('[data-reveal]')].filter((e) => !e.closest('[hidden]'));
      const seqs = els.filter((e) => e.dataset.reveal === 'stagger').map((e) => e.closest('section')?.id || e.closest('section')?.getAttribute('aria-labelledby'));
      return { blocks: els.length, sequences: seqs, footer: document.querySelectorAll('footer [data-reveal]').length };
    });
    check('Not everything animates: ≤ 16 reveal blocks, sequences only in practice areas + why-choose, footer static', revealCount.blocks <= 16 && revealCount.sequences.every((s) => s === 'practice-areas' || s === 'why-choose') && revealCount.footer === 0, JSON.stringify(revealCount));
    // Every revealed element (and every staggered child) ends fully opaque at its own resting opacity.
    await p.waitForTimeout(2600);
    const notVisible = await p.evaluate(() => {
      const bad = [];
      for (const el of document.querySelectorAll('[data-reveal]')) {
        if (el.closest('[hidden]')) continue;
        const targets = el.dataset.reveal === 'stagger' ? [...el.children] : [el];
        for (const t of targets) {
          const cs = getComputedStyle(t);
          if (cs.display === 'none') continue;
          if (parseFloat(cs.opacity) < 0.55 || (cs.transform !== 'none' && cs.transform !== 'matrix(1, 0, 0, 1, 0, 0)')) bad.push(`${t.tagName}.${String(t.className).slice(0, 30)} op=${cs.opacity} tf=${cs.transform}`);
        }
      }
      return bad;
    });
    check('All revealed and staggered items end at rest (visible, no leftover offset)', notVisible.length === 0, notVisible.slice(0, 3).join(' | '));
    // Temporary reveal classes are removed afterwards, so hover transitions are not delayed.
    const leftovers = await p.locator('.reveal-in').count();
    check('Temporary reveal classes are cleaned up after the entrance', leftovers === 0, `${leftovers} left`);
    const heroOpacity = await p.locator('#hero-heading').evaluate((e) => getComputedStyle(e).opacity);
    check('Hero heading is visible (not stuck in reveal)', heroOpacity === '1');
    await ctx.close();
  }

  // ---------- MOTION SPEC (the client's animation plan) ----------
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await ctx.route('mailto:*', (route) => route.abort());
    const p = await ctx.newPage();
    await p.goto(BASE, { waitUntil: 'domcontentloaded' });
    const ms = (v) => (v.endsWith('ms') ? parseFloat(v) : parseFloat(v) * 1000);
    const hero = await p.evaluate(() => {
      const a = (sel) => { const cs = getComputedStyle(document.querySelector(sel)); return { dur: cs.animationDuration, delay: cs.animationDelay, iter: cs.animationIterationCount }; };
      return {
        h1: a('#hero-heading'),
        lead: a('#hero-heading + p'),
        figure: a('#top figure img'),
        ambient: a('#top .hero-ambient'),
      };
    });
    check('Hero headline: fade-up within 700–900ms', ms(hero.h1.dur) >= 700 && ms(hero.h1.dur) <= 900, JSON.stringify(hero.h1));
    check('Hero paragraph: fade-up within 700–900ms, starting after the headline (stagger)', ms(hero.lead.dur) >= 700 && ms(hero.lead.dur) <= 900 && ms(hero.lead.delay) > ms(hero.h1.delay), `${hero.lead.delay} after ${hero.h1.delay}`);
    check('Attorney portrait: fade-and-scale reveal within 900–1100ms', ms(hero.figure.dur) >= 900 && ms(hero.figure.dur) <= 1100, JSON.stringify(hero.figure));
    check('Background: slow gradient loop within 8–12s', ms(hero.ambient.dur) >= 8000 && ms(hero.ambient.dur) <= 12000 && hero.ambient.iter === 'infinite', JSON.stringify(hero.ambient));
    await p.waitForLoadState('networkidle');
    await p.waitForTimeout(1500);
    // The loop pauses when the hero is off screen.
    await p.evaluate(() => window.scrollTo(0, 2500));
    await p.waitForTimeout(400);
    const paused = await p.evaluate(() => getComputedStyle(document.querySelector('#top .hero-ambient')).animationPlayState);
    await p.evaluate(() => window.scrollTo(0, 0));
    await p.waitForTimeout(400);
    const running = await p.evaluate(() => getComputedStyle(document.querySelector('#top .hero-ambient')).animationPlayState);
    check('Background loop pauses while the hero is off screen', paused === 'paused' && running === 'running', `${paused} → ${running}`);

    // CTA hover: lift + 200–300ms colour transition + arrow movement, on every button style.
    const cta = p.locator('#top').getByRole('link', { name: /Send Me a Message/ });
    const ghost = p.locator('#top').getByRole('link', { name: /Call Now/ });
    const ctaInfo = await cta.evaluate((e) => ({ dur: getComputedStyle(e).transitionDuration, props: getComputedStyle(e).transitionProperty }));
    const before = await cta.boundingBox(); const arrowBefore = await cta.locator('span[aria-hidden]').last().boundingBox();
    await cta.hover(); await p.waitForTimeout(400);
    const after = await cta.boundingBox(); const arrowAfter = await cta.locator('span[aria-hidden]').last().boundingBox();
    const gBefore = await ghost.boundingBox(); await ghost.hover(); await p.waitForTimeout(400); const gAfter = await ghost.boundingBox();
    check('CTA hover: 250ms eased colour + lift transition, button lifts 1px, arrow moves ~4px; outline button lifts too',
      ctaInfo.props.includes('translate') && ms(ctaInfo.dur.split(',')[0]) >= 200 && ms(ctaInfo.dur.split(',')[0]) <= 300 &&
      Math.round(before.y - after.y) === 1 && Math.round(arrowAfter.x - arrowBefore.x) >= 3 && Math.round(gBefore.y - gAfter.y) === 1,
      `dur ${ctaInfo.dur.split(',')[0]}, lift ${(before.y - after.y).toFixed(1)}, arrow ${(arrowAfter.x - arrowBefore.x).toFixed(1)}, ghost ${(gBefore.y - gAfter.y).toFixed(1)}`);

    // Navigation dropdown: fades + drops in, fades out.
    await p.mouse.move(10, 400);
    const btn = p.getByRole('button', { name: 'Estate Planning' });
    await btn.hover();
    await p.waitForTimeout(130); // mid-animation
    const mid = await p.locator('#nav-estate-planning').evaluate((e) => parseFloat(getComputedStyle(e).opacity));
    await p.waitForTimeout(400);
    const open = await p.locator('#nav-estate-planning').evaluate((e) => ({ op: getComputedStyle(e).opacity, vis: getComputedStyle(e).visibility, tf: getComputedStyle(e).transform }));
    await p.mouse.move(10, 600); await p.waitForTimeout(500);
    const closed = await p.locator('#nav-estate-planning').evaluate((e) => getComputedStyle(e).visibility);
    check('Dropdown animates in (fade + small drop) and is hidden again on close', mid > 0 && mid < 1 && open.op === '1' && open.vis === 'visible' && closed === 'hidden', `mid ${mid.toFixed(2)} open ${JSON.stringify(open)} closed ${closed}`);

    // Practice card hover: subtle elevation + border.
    await p.evaluate(() => document.getElementById('practice-areas').scrollIntoView());
    await p.waitForTimeout(1200);
    const card = p.locator('#practice-family article').first();
    const shadow0 = await card.evaluate((e) => getComputedStyle(e).boxShadow);
    await card.hover(); await p.waitForTimeout(450);
    const shadow1 = await card.evaluate((e) => ({ s: getComputedStyle(e).boxShadow, bg: getComputedStyle(e).backgroundColor }));
    check('Practice card hover: subtle elevation shadow + thin primary border on white', shadow0 === 'none' && shadow1.s.includes('inset') && shadow1.bg === 'rgb(255, 255, 255)', shadow1.s.slice(0, 70));
    await ctx.close();
  }

  // ---------- REDUCED MOTION ----------
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
    const p = await ctx.newPage();
    await p.goto(BASE, { waitUntil: 'networkidle' });
    for (let y = 0; y < 13000; y += 600) { await p.evaluate((v) => window.scrollTo(0, v), y); await p.waitForTimeout(40); }
    const rm = await p.evaluate(() => ({
      running: document.getAnimations().length,
      pending: document.querySelectorAll('.reveal-pending').length,
      heroOpacity: getComputedStyle(document.getElementById('hero-heading')).opacity,
      buttonTransition: getComputedStyle(document.querySelector('aside[aria-label="Quick contact"] a')).transitionDuration,
    }));
    check('Reduced motion: no animations or transitions run, nothing is hidden, content shows immediately', rm.running === 0 && rm.pending === 0 && rm.heroOpacity === '1' && rm.buttonTransition === '0s', JSON.stringify(rm));
    await ctx.close();
  }

  await browser.close();
  console.log(results.join('\n'));
  console.log(`\n${results.filter((r) => r.startsWith('PASS')).length}/${results.length} passed`);
})();
