# Implementation Notes — Anderson Law Firm Homepage Redesign

**Status:** Demo build, verified 2026-11-11. **Not ready to launch** (see [§7](#7-must-be-completed-before-production-launch)).
**Related:** [Blueprint](redesign-blueprint.md) · [Content inventory](../audit/content-inventory.md) · [Verification screenshots](verification/)

This file records every content decision that touched uncertain, disputed or legally meaningful material, so nothing has been resolved silently.

---

## Revision 2 — client feedback (2026-11-11)

| Request | Change |
|---|---|
| "Don't use the picture of the lawyer two times" | **One photograph of the attorney only:** the full-length portrait in the hero. The About-page photo is no longer used. The attorney section is now typographic: heading, intro, focus list, then a credentials band (Education, License, Memberships). |
| "Remove - from every text" | **Removed:** the dash before every section label, and the dash separators in visible text: business hours ("Mon - Thu 8:00 AM - 5:00 PM" → "Mon to Thu", "8:00 AM to 5:00 PM"), credentials ("North Carolina – 2010 – Present" → "North Carolina, 2010 to Present"), the form's "—Please choose an option—" and the demo note. Same facts, numbers and words.<br>**Kept on purpose:** hyphens that belong to the information itself — the phone number "(803) 980-5252", the reviewer name "González-Ortiz", "10-digit", and compound words in the original copy ("Spanish-speaking", "post-separation", "Child-focused", "well-being", "End-of-Life", …). Removing those would change names and numbers or create spelling errors. They can be removed if you want. |
| "Logo should be clear and prominent", then "logo should be medium sized" | **Header logo:** the original lossless PNG, 104px tall on desktop and 76px on phones at the top of the page. When the page scrolls it scales to about 64px / 55px inside the sticky bar. The bar's height is fixed and the logo moves by transform only, so nothing on the page shifts.<br>**Elsewhere:** 96px in the footer, 56px blue tile in the mobile menu. |
| "On mobile the CTA should be sticky throughout scrolling" | **New bottom action bar on phones (under 768px)** with **Call Now** and **Send Me a Message**, fixed for the whole page.<br>It slides away (and becomes inert) while a form field is focused, so it never covers typing. The footer has extra bottom space so the bar never hides the last line. It fits down to 320px screens.<br>On phones, the hero's two buttons and the header's Call button are hidden because the bar replaces them. |
| *(see Revision 3 below for the hero refinement)* | |
| "Don't send test emails" | **No email was ever sent.** The form has no backend: a valid submit only asks the browser to open a mail app with a draft, and the headless test browser has no mail app. The step that submitted a valid form has now been **removed from the test suite**, and every test browser blocks `mailto:` from the start. Tests submit only empty or invalid forms, which never leave the page. |

---

## Revision 3 — hero and header refinement (2026-11-11)

### Problems found before changing anything

1. **The portrait was a hard white rectangle** (the office wall) on the navy hero. It was the brightest object on the page and pulled the eye away from the headline.
2. **The columns were unbalanced.** The portrait started about 110px below the headline, was narrower than the gap beside it, and ran past the bottom of the hero. A thin arch outline floated around it.
3. **The headline "Your Legal Guardian in Rock Hill, SC" was a metaphor** and could be misread, since guardianship is also a legal term.
4. **The archway background sat behind the text** at 12% opacity, unmasked.
5. **The header logo hung below the bar**, out of line with the navigation. The menu floated mid-bar with a ~190px gap before Call Now, which was 48px tall against 44px menu items.
6. **The practice-area links in the hero competed with the two contact buttons**, and nothing near the buttons said when the office answers.

### Changes

| Area | Change |
|---|---|
| **Portrait** | **Background removed from the original photo**: the office wall and floor are gone; the person is not retouched (`scripts/make-portrait-cutout.py`, documented in `assets/derived/README.md`). She now stands in a brand-blue arch panel, with her head breaking above the arch, and fades into the navy below the knees. A soft primary-blue light behind her separates the black dress from the navy. Still the only photograph of the attorney on the page. |
| **Balance** | **Desktop:** copy (6 columns) and portrait (5 columns) are vertically centred together; their centres are 22px apart and the whole hero fits in a 900px-tall screen. **Below 1024px:** the hero stacks (copy, then a centred head-to-waist portrait) so proportions hold on tablet and phone. |
| **Headline** | **"Compassionate Family Law Attorney in Rock Hill, SC"** — taken from the live site's own heading "Compassionate Family Law Attorney at Your Side" plus the firm's location. Not a new claim; needs client approval like all copy. The line above it now reads "Family Law · Divorce · Estate Planning" (the verified menu groups). The name moved to a caption under the portrait: "Syretta R. Anderson / Licensed in South Carolina & North Carolina" (About-page facts). |
| **Typography** | H1 54–60px, line height 1.04, tracking −0.02em, max 16 characters per line. Lead paragraph 18px / 1.7, max 37rem (5 lines, was 6). Consistent spacing: eyebrow→H1 20px, H1→lead 24px, lead→buttons 36px, buttons→reassurance 28px. |
| **Background** | Archway opacity 12% → 6%, masked so it appears only on the portrait side (and only low down on phones). It never sits behind text. |
| **Header** | Fixed bar height (72px phones / 88px desktop). The logo sits inside the bar, centred (58px / 72px, easing to 50 / 60px when scrolled, transform only). Menu, a hairline divider and the 44px Call Now button share one centre line, verified to ±0px. |
| **Conversion** | Both buttons kept (Send Me a Message, Call Now with the number). Below them: weekday office hours and "Spanish-speaking clients welcome", both from the original content. The practice-area quick links were removed from the hero to reduce competing exits; the menu and the Practice Areas section still cover them. |
| **Motion & hover** | **Motion:** text rises in sequence; the arch grows from its base, then the figure rises into it; the caption fades in last.<br>**Hover:** nav links draw a sky underline (it also marks the current page and open menus); primary buttons lift 1px with a soft brand shadow; practice icons lift; service-area chips lift; footer and review links draw an underline.<br>**Reduced motion:** all of this is switched off. |
| **Bug fixed** | The reduced-motion rule used to *shorten* every transition, which silently enabled `transition: all` on every element. This could briefly hide inherited text such as the menu button's screen-reader label. It now switches animations and transitions **off**. |

---

## Revision 6 — "Why Choose" photo adjusted (2026-11-11)

**Problem (client screenshot):** the gavel photo looked soft and awkward.
- The browser loaded the 640px file and stretched it about 3.1× to fill a tall 547×1145 panel. The `sizes` hint described width, but that panel scales by height.
- The tall, narrow slice of a landscape photo cut the gavel head off at the edge and left a hard seam against the blue.
- The navy duotone gave the highlights a lavender cast.

**Fix:** the same original photo (`legal-council.webp`), reframed. No new imagery.
- **Desktop:** a dedicated 4:5 crop (`gavel-portrait-*`, 1024×1280 source) keeps the whole gavel and sound block in frame. It is shown as a framed image beside the text and stays in view while reading; it is now served at 1× / 2× density instead of being stretched.
- **Phones/tablets:** a wide banner centred on the gavel, with `sizes="100vw"`.
- **Colour:** the duotone shadow tint for this section is the brand's darker blue (#21628C) instead of navy, so the image reads as clean blue. The duotone now accepts a `--duotone-tint` setting; the contact banner keeps navy for text contrast.
- Before/after: `docs/verification/cmp-why-choose-image.png`. All 66 checks pass.

---

## Revision 5 — restrained, editorial motion (2026-11-11) — supersedes Revision 4

**Client direction:** subtle and smooth; the hero gets the attention, and the rest of the page is understated, "not a flashy agency site".

**Technology:**
- CSS animations + IntersectionObserver, with **no animation library**.
- Framer Motion was considered and not added. It would add roughly 30–60 KB of JavaScript to a bundle already at 99.7 KB gzipped, and every effect below is native CSS.
- The CSS approach also runs at first paint on the pre-rendered HTML, before React loads.

| Client spec | Implemented (measured in the browser) |
|---|---|
| 1. Hero headline: fade-in, subtle upward reveal, 700–900ms | 800ms fade + 14px rise. Eyebrow 0ms → headline 90ms. |
| 2. Hero paragraph: slight stagger after the headline | 800ms, starts at 220ms. Then actions at 340ms, hours/language line at 440ms, portrait caption at 950ms. |
| 3. CTA hover: lift, smooth colour, small arrow movement, 200–300ms | Every button style lifts 1px with a 250ms eased colour/shadow transition; the trailing arrow moves 4px (300ms). This also fixed a bug: Tailwind 4 moves elements with `translate`, which the old transition list omitted, so the lift used to snap. |
| 4. Attorney portrait: subtle clip-path or fade-and-scale, 900–1100ms | 1050ms fade-and-scale (103.5% → 100%) with a soft bottom-up clip; the arch panel settles in over 1000ms. |
| 5. Background: very slow gradient movement, 8–12s loop | The brand-blue light behind the portrait drifts and breathes over 10s (alternating). It is the only looping motion on the page, and it **pauses while the hero is off screen**. |
| 6. Navigation: smooth hovers, subtle dropdowns | Sky underline draws in on hover (300ms). Dropdowns fade in with a 6px drop (240ms) and fade out a little faster (180ms). Closed menus stay out of the tab order and away from screen readers. |
| 7. Scroll reveal with IntersectionObserver, 500–700ms | Section blocks fade up 16px over 650ms, once. Only below-the-fold content is ever hidden, and never without JavaScript. |
| 8. Practice cards: subtle hover elevation + border | The cell turns white with a soft shadow and a thin primary inset border (300ms, no layout shift). |
| 9. Consistent fade-and-up section transitions | One reveal style for every section. Quiet staggers (70–110ms apart) are used **only** for the practice-area cells and the three Why Choose points, where they follow the reading order. |

**Removed to keep it understated** (from Revision 4):
- the photo zoom effects (Why Choose, contact banner);
- the divider line-draw;
- per-item staggers on trust facts, badges, attorney focus list, credentials, reviews, contact rows and service-area chips;
- all footer entrance motion;
- the practice-icon hover lift.

**Result:** 16 scroll-revealed blocks in total, and 2 short sequences.

**Kept as small interface feedback:**
- tab-switch cell fade (450ms);
- "Show all reviews" fade (500ms);
- form messages easing in (300ms);
- the phone action bar sliding up once after load.

**Avoided:** parallax, bouncing, spinning, flashing, large scaling and continuous floating. **Reduced motion:** every animation and transition is off, nothing is hidden, and content shows immediately (verified: 0 running animations).

**Verified:**
- `npm test` → render checks clean at 1440/768/390 (no overflow, 0 axe violations); **66/66** interaction checks.
- The suite now asserts every duration above, the loop pausing off screen, the button lift and arrow distances, the dropdown mid-fade, the card elevation, the cap on animated blocks, and reduced-motion behaviour.
- Filmed hero entrance at desktop and phone: `docs/verification/motion-hero-entrance.png`.

---

## Revision 4 — light professional animations (2026-11-11) — superseded by Revision 5

**Principles:**
- Short and quiet: 0.35–0.8s; elements travel 16–20px; sequences step 45–120ms apart and stop after 8 steps.
- Only opacity and transform change, so there is no layout shift.
- Nothing loops, bounces or autoplays.
- Content above the fold is never hidden, and nothing is hidden without JavaScript.
- Everything is switched off for visitors who turn off animations in their system settings (reduced motion).

| Where | Motion |
|---|---|
| Trust bar | The three facts rise in sequence, then the seven badges follow in a quicker sequence. |
| Practice areas | **Scroll:** cells rise left to right as the section enters view.<br>**Tabs:** the underline slides to the selected tab (0.5s), and the new tab's cells rise in sequence on every switch. |
| Attorney section | The six focus items rise in sequence; the three credential columns follow. |
| Why Choose | The duotone photo settles in (scale 106% → 100% while fading). The three points rise in order, and each top hairline draws in from the left. |
| Reviews | Cards rise in sequence as the list enters view. The extra reviews from "Show all reviews" fade in one after another. |
| Contact | The banner photo settles in, the panel rises, and the phone / email / address / hours rows follow in sequence. Form errors and the status message ease in. |
| Service areas | Location chips appear in a quick sequence per state. |
| Footer | Brand column, then the four link columns in sequence. |
| Phone action bar | Slides up shortly after load (0.5s delay). |
| Existing | The hero entrance (Revision 3) and the hover effects (nav underline, button lift, icon and chip lift, link underlines) are unchanged. |

**How it works:**
- `useReveal()` with `data-reveal` variants (default / fade / zoom / stagger), documented in `src/index.css`.
- The temporary reveal classes are removed once an entrance finishes, so hover transitions are never delayed.
- Inactive practice tabs opt out of the scroll reveal from the first render (`data-reveal-skip`) and animate when they are selected.

**Verified:**
- 56/56 interaction checks pass, including new ones: tab underline position, tab-cell entrance, every revealed item ends visible with no leftover offset, and temporary classes are cleaned up.
- Filmed frames at 80 / 300 / 600 / 1600ms are in `docs/verification/motion-filmstrip.png`.

---

## 1. Content rules followed

- Every visible sentence comes from [audit/content-inventory.md](../audit/content-inventory.md), copied word for word.
  - Typos, curly apostrophes and the client-written review text are kept exactly as they appear on the live site.
  - The content lives in [src/content/](../src/content/). Each file names the inventory section it came from.
- **Exception:** dash separators were removed at the client's request (see Revision 2). The parity check compares those lines ignoring separator punctuation.
- **An automated check confirms it.** `npm run test:content` compares 231 lines from the inventory against the rendered page:
  - **225 match word for word.**
  - The old hero headline "Your Legal Guardian in Rock Hill, SC" is intentionally gone (client request, Revision 3).
  - The other 5 are expected:
    - the "★★★★★" glyphs, now icons with a text alternative;
    - "Start a project with me!", a template leftover that was removed;
    - two About-page lines that were never on the homepage;
    - one stray quote mark left by the parser.
- **Nothing was invented.** There are no new testimonials, review counts, ratings, case results, statistics, awards or credentials.
- **Personal-injury links point to the contact form.** Their original pages return 404, so they go to `#contact` with the service preselected. No destination URL was invented.

---

## 2. Unresolved items that need client confirmation

Each item shows what the demo does **now**.

| # | Item | What the demo does |
|---|---|---|
| A1 | **Years of experience disagree.** The meta description says "13 years", the homepage says "over a decade", the About page says "Since 2015" (firm) and the SC licence dates from 2007. | Keeps "over a decade" in its original sentence and leaves the meta description unchanged. **No experience figure is added.** The trust bar shows only licence years (2007 SC, 2010 NC) and "Since 2015", all from the About page. |
| A2 | **Personal injury status.** The title tag and meta description say "Personal Injury Lawyer". The 3 PI service pages return 404, and PI is in neither the menu nor the footer. | All 3 PI cards are kept word for word under a **Personal Injury** tab, placed last. Their link reads "Send Me a Message" and goes to the contact form with that service preselected (`?service=…#contact`). The hero's practice-area links show only Family Law, Divorce and Estate Planning, matching the original hero text's "focus on family law". |
| A3 | **"Gastonia, SC"** in the menu. Gastonia is in North Carolina. | Original label kept. |
| A4 | **The Conservatorship bullet list is a copy of the Trusts list.** | Shown as on the live site. A code comment flags it in `practiceAreas.ts`. |
| A5 | **Firm name varies:** "Anderson Law Firm" (body), "Anderson Law Firm, PC" (logo), "SR Anderson Law Firm" (copyright, site name). | Each name stays where it originally appeared. Logo alt text is "Anderson Law Firm, PC". |
| A6 | **"York County, SC"** on the homepage links to `/york-sc/`, which the menu labels "York, SC". | Both labels kept as originally written. |
| A7 | **Badge links.** The SC Bar badge points to the bar's Education Law Committee page; York County Bar Association has no link. | Kept as on the live site. |
| A8 | **ZIP code 29730.** | **Not shown** on the page. It appears only in the structured data, copied word for word from the live site. |
| A9 | **Social accounts.** Are Facebook, Instagram, Twitter and LinkedIn all still active? The Twitter link uses twitter.com. | All 5 original links kept, using the same Font Awesome glyphs as the live site. |
| A10 | **Paternity Law and LGBTQ+ Family Law.** Both pages exist (HTTP 200 on 2026-11-11), but whether the firm actively offers these services is unverified. | **Kept in the menu only**, where they appear on the live site. They are **not** shown as practice cards, footer links or form options. |
| A11 | **Trust-bar labels are newly worded:** "Licensed in South Carolina", "Licensed in North Carolina", "Serving clients in North & South Carolina". | Reworded from the About page's License list and its "Since 2015…" sentence. Needs approval. |
| A12 | **Featured testimonial.** | Jeffrey Williams, chosen because it's short. The other 11 keep their original order. |

### B. Legally meaningful wording, kept word for word until the attorney reviews it

This isn't legal advice. These phrases may be affected by the South Carolina Rules of Professional Conduct on advertising, particularly Rule 7.1 (misleading statements) and Rule 7.4 (claims of specialization):

- "Expert Experience Guaranteed!" (the small label above Why Choose pillar 03)
- "specializes in", in the Child Support and Post Separation descriptions
- "expert", in the Premise Liability and Dog Bites descriptions and these bullets:
  - "Expert slip fall lawyer"
  - "Expert dog bite lawyer"
  - "Expert child support lawyer"
  - "Expert child visitation attorney"
  - "Expert Alimony Lawyer"
- "Maximum compensation pursuit", "Aggressive representation", "results-oriented representation"
- "Anderson Law Firm's vehicle accident **lawyers**" — plural, on a solo-attorney site
- ~~"Your Legal Guardian" (the H1)~~. Replaced at the client's request (Revision 3) by "Compassionate Family Law Attorney in Rock Hill, SC", built from the live site's own heading. The attorney should confirm the new headline.
- No attorney-advertising disclaimer and no "contacting us does not create an attorney-client relationship" notice has been added. Neither exists on the live site, so adding one is the client's decision.

### C. Proposed copy corrections (not applied)

- "Premise Liability" → "Premises Liability", in the card and the form option.
- "slip fall lawyer" → "slip and fall lawyer", twice.
- The Dog Bites sentence fragment "With a compassionate approach and thorough expertise."
- The Wills description has no closing period.
- **Voice:** the site speaks as "I", but has "Our Services Include:" on two cards and "Tell us how we can help" in the form placeholder.

---

## 3. Removed or merged, with nothing useful lost

| Original | What happened |
|---|---|
| Mobile drawer text "Get Started — Prepare for the future you want with financial planning solutions…" + "Contact us" | **Removed** (theme placeholder). The menu now pins "Call Now" and "Send Me a Message". |
| "Start a project with me!" | **Removed** (agency-template subheading). |
| "Click to Enlarge" photo button | **Removed** (leftover map widget). |
| Empty `<h2>` and empty paragraph in the hero / Why Choose | **Removed** (markup leftovers). |
| Front-of-card "Read More" that only flipped the card | **Replaced** by real links. All back-of-card bullets are now always visible. |
| Floating "+" button | **Removed.** The header's "Call Now" button is always visible instead. |
| Second "Contact Me Today!" heading | **Used once.** |
| Contact cards in the intro section | **Merged** into the contact section. Phone, email and address also stay in the utility bar (desktop), the menu and the footer. |
| Sections 5 and 6 (near-duplicates) | **Merged** into one "Why Choose" section with 3 numbered pillars. All text kept. |
| Sections 7, 9, 10, 11 (four contact blocks) | **Merged** into one call banner plus one contact panel. All text kept. |
| Footer "Services" column (8 links) | **Split** into "Family Law" and "Divorce" (the same 8 links). "Estate Planning" added, using the 6 links from the main menu. |
| Blue-circle logo baked into a background image | **Not used.** The white logo is used on dark surfaces and the original blue-tile logo on light ones (the mobile menu). |
| About-page photo of the attorney | **Not used.** Only one photograph of the attorney appears (client request). |
| Dash separators in hours, credentials and the form placeholder | **Replaced** with "to" or commas (client request). Same information. |
| Stock photos: DIVORCE document, About-page stock, 15 flip-card back photos | **Not used** (see the blueprint, §6.3). |

---

## 4. Contact form (demo behavior)

- **Fields:** the original fields, labels, placeholders, 13 Services options and validation messages.
- **Fixes:** every label is now correctly attached to its own field (the live site had them crossed), and each field has the correct `autocomplete` value.
- **There is no backend.** On a valid submit, the form opens the visitor's email app with the details filled in, addressed to syretta@srandersonlawfirm.com.
  - A visible notice says it is a demo and that nothing is sent until the visitor sends that email.
  - The status message never claims the message was sent.
  - Without JavaScript, the form falls back to a plain `mailto:` submission.
- **New UI microcopy:**
  - the "Required" marker;
  - "Please enter your email address." (the original had no message for an empty email field);
  - the error-summary text;
  - the demo notice and the post-submit status message;
  - the email subject line "Appointment request from the website".
- **Required before launch:** connect a real form backend (§7).
- **Still open:**
  - Services missing from the dropdown: Divorce Law, Trusts, Conservatorship, Power of Attorney, Healthcare Power of Attorney, Paternity, LGBTQ+. Also, "Living Will" in the form vs "Living Wills" on the card.
  - Should fields other than Email be required?

---

## 5. New UI microcopy (needs approval)

- **Hero:**
  - headline "Compassionate Family Law Attorney in Rock Hill, SC" (built from original wording; see Revision 3)
  - eyebrow "Family Law · Divorce · Estate Planning"
  - portrait caption "Syretta R. Anderson / Licensed in South Carolina & North Carolina"
  - weekday hours line (from the original business hours)
- **Trust bar:**
  - "Since" above each year
  - the three fact labels (A11)
  - hidden heading "Affiliations & Reviews"
- **Practice areas:**
  - eyebrow "Practice Areas"
  - tab labels "Family Law" / "Divorce" / "Estate Planning" / "Personal Injury"
  - service counts beside each tab
- **Attorney section:**
  - eyebrow "Meet Attorney Syretta R. Anderson"
  - "Read More" link to the About page (reuses the original card wording)
- **Reviews:** "Read more reviews on Google", "Show all reviews (12)", "Show fewer reviews", "Read full review", "Show less", "Rated 5 out of 5" (screen readers only)
- **Service areas:** group headings "South Carolina" / "North Carolina"
- **Footer:** column headings "Family Law" / "Divorce" / "Estate Planning"
- **Screen-reader and navigation labels:** "Skip to content", "Open menu", "Close menu", "Previous/Next review", "(opens in a new tab)"
- **Contact form:** see §4

---

## 6. Departures from the approved blueprint

| Blueprint | Built | Why |
|---|---|---|
| One logo version, the white one | White logo on dark surfaces + **original blue-tile logo** in the light mobile menu | Your approval adjustment |
| Arch-shaped portrait frame | Rectangular portrait with a thin arch **outline** behind it | Your rule not to crop the person: the arch clipped her hair. The full figure is shown, and only background was trimmed. |
| Rounded practice cards | A grid of cells separated by hairlines, without card boxes | Your "avoid excessive rounded cards" adjustment |
| Paternity / LGBTQ+ link chips under the Family Law tab | Not shown | Your approval adjustment (A10) |
| Photo in the attorney introduction | No photo; a typographic layout plus a credentials band | Client: only one picture of the attorney |
| Compact 64–80px header with a small logo | Fixed-height bar with a **medium** logo (104 / 76px at the top, about 64 / 55px when scrolled) | Client: logo should be clear and medium-sized |
| "Call Now" in the mobile header | A **sticky bottom bar** (Call Now + Send Me a Message) on phones for the whole page | Client: mobile CTA should stay visible while scrolling |
| Phone page about 8,500 px tall | **12,230 px** (desktop 8,513 px; the original was 13,206 / 9,249) | My estimate didn't account for keeping every original sentence plus the new credentials. Nothing was cut to hit the number. |
| Duotone: navy base with a primary wash | Primary base with a navy multiply layer | The navy base rendered lavender, off-brand. Both versions use only brand colors. |
| — | **Page pre-rendered to static HTML** at build time | Search engines and no-JS visitors get the full content, and the first paint is faster |
| — | The `inert` attribute on the page behind the open mobile menu | `aria-modal` alone isn't honored by every screen reader |

---

## 7. Must be completed before production launch

1. **Form backend.** Replace the mailto adapter in `src/components/contact/ContactForm.tsx` with a real service. Options: the existing WordPress Contact Form 7 endpoint (if served from the same domain), or a form service with spam protection. Then remove the demo notice.
2. **Client and attorney sign-off** on §2 (A1–A12), §2-B (legal wording), §2-C (copy corrections) and §5 (microcopy).
3. **Title and meta description.** They still say "Personal Injury Lawyer…" and "13 years". Update them once A1 and A2 are answered.
4. **Analytics and consent.** The live site loads Google Tag Manager, two Google tags, Meta Pixel, WhatConverts, Jetpack Stats, Gauges and CookieYes. **None are in this build.** Restore only what the client wants, and add a cookie-consent banner if any tracking returns.
5. **Deployment target.** Inner-page links are absolute URLs to the live WordPress site. If this homepage replaces the WordPress homepage on the same domain, switch them to relative paths. Also confirm whether "Home" and the logo should go to `/`.
6. **Assets:**
   - a vector (SVG) master of the logo;
   - a higher-resolution original of the hero portrait (currently 1024×1536). A new photo session is recommended;
   - confirmation that the stock photos (gavel images, archway) are licensed;
   - approval of the replacement practice-area icons (Lucide, open source), or a request to restore the originals.
7. **Structured data.** The live site's LocalBusiness JSON-LD is copied word for word in `index.html`. Approve before replacing it with `LegalService`/`Attorney` markup.
8. **Real-device testing.** So far testing has used Chrome, with mobile and tablet emulated. Test on real iOS Safari and Android Chrome, and spot-check with VoiceOver and NVDA.
9. **Hosting:** compression, cache headers for `/assets` and `/images`, an SSL certificate, and a fallback 404 page.

---

## 8. Verification performed (2026-11-11)

All of this ran in real Chrome through Playwright, against both the production preview and the dev server. The suite is repeatable with `npm test`.

- **Render checks** at 1440 / 768 / 390 px:
  - **No horizontal overflow** at any width
  - **axe-core: 0 violations** at all three
  - clean console, no failed requests
  - exactly one H1, and every interactive target is **at least 44 px** (the skip link counts only when focused)
- **Interaction checks: 66/66 passed** (after Revision 5), covering:
  - the client's motion plan: hero durations and stagger, portrait reveal, the 8–12s background loop pausing off screen, CTA lift and arrow, dropdown fade, practice-card elevation, a cap on animated blocks, and reduced motion
  - motion: tab underline position, tab-cell entrance, all reveals ending at rest, and cleanup of temporary classes
  - the hero portrait being a transparent cutout (corner pixels fully transparent)
  - hero balance: copy and portrait centres within 60px, and the hero fits in a 900px screen
  - header alignment: menu items and Call Now on one centre line, logo centred, logo inside the bar
  - one attorney photo only
  - medium logo sizes, and the logo never overlapping the hero text
  - a fixed header height, so scrolling causes no layout shift
  - the sticky phone action bar visible from top to bottom, never covering the footer, and stepping aside while typing
  - skip link, dropdown keyboard support, Escape and hover
  - sticky header shrink
  - tab arrow keys, Home/End and hash selection
  - personal-injury service preselection
  - form errors, focus and label association. **The suite never submits a valid form and blocks `mailto:`, so no email draft is ever created.**
  - review expand and "show all"
  - mobile menu focus trap, scroll lock, inert background and focus return
  - mobile accordions and their hidden content
  - carousel controls
  - footer accordions
  - scroll reveals that always finish visible
- **Content parity:** 226 of 231 inventory lines match word for word; the 5 exceptions are explained in §1.
- **Performance:**
  - JavaScript 97 KB gzipped
  - CSS 9.6 KB gzipped
  - images 512 KB in total across all sizes
  - Latin-subset fonts only
- **Contrast:** every text and color pairing was measured; the ratios are in the blueprint, §3.2.
