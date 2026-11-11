# Anderson Law Firm — Homepage Redesign Blueprint

**Status:** Draft for approval. No code has been written.
**Date:** 2026-11-11
**Stack:** React + Vite + Tailwind CSS
**Inputs:** [audit/content-inventory.md](../audit/content-inventory.md) · [audit/screenshots/](../audit/screenshots/) (35 captures) · original image files on srandersonlawfirm.com (homepage + About page)

---

## 0. Ground rules for the build

1. **Every visible string comes from the content inventory, word for word.** The only exceptions are the short UI labels listed in [§11](#11-new-ui-microcopy-needs-approval), and none of them makes a claim.
2. **Content lives in data files, not inside components.** Each entry carries a source reference (for example `// inventory §3 — "Child Custody"`), so every sentence on the page can be traced back to the original site.
3. **Typos, factual inconsistencies and legal wording stay exactly as they are until approved.** They're listed in [§12](#12-client-confirmation-list) with a proposed fix for each.
4. **Nothing is removed silently.** Everything not carried over is listed in [§12-D](#d-not-carried-over-template-leftovers-and-duplicates).
5. **Broken links never get invented destinations.** The three 404 personal-injury links point to the on-page contact form, with that service preselected.
6. **Inner pages stay on the live site.** Only the homepage is being rebuilt, so menu, card and footer links use absolute URLs to the existing pages (`https://www.srandersonlawfirm.com/...`).
7. **No new brand colors.** Every hex value in [§3](#3-color-system) already exists on the current site.

---

## 1. Page structure at a glance

### Desktop (1440 px)

```
┌────────────────────────────────────────────────────────────────────────────┐
│ UTILITY BAR 40px · navy                                                    │
│ Reach Out to Me · (803) 980-5252 · email · 124 Oakland Ave   Spanish-speaking clients welcome │
├────────────────────────────────────────────────────────────────────────────┤
│ [A] Home  About  Family Law▾  Divorce Lawyer▾  Estate Planning▾  More▾   [☎ Call Now] │ 80px → 68px when sticky
├────────────────────────────────────────────────────────────────────────────┤
│ 1 HERO · navy (+ faint archway texture)                 ╭────────╮         │
│   ATTORNEY SYRETTA R. ANDERSON                          │  arch  │         │
│   Your Legal Guardian                                   │ framed │         │
│   in Rock Hill, SC                                      │portrait│         │
│   original hero paragraph                               │        │         │
│   [Send Me a Message]  [☎ Call Now]                     │        │         │
│   ✓ Spanish-speaking clients welcome                    ╰───┬────╯         │
├──────────────── trust card overlaps the hero's lower edge ───┴─────────────┤
│ 2 TRUST · Since 2007 SC │ Since 2010 NC │ Since 2015 │ 7 badge logos       │
├────────────────────────────────────────────────────────────────────────────┤
│ 3 PRACTICE AREAS · mist    H2 + intro │ [Family][Divorce][Estate][Injury]  │
│                            card grid (2×2 / 3×2 / 3×1)                     │
├────────────────────────────────────────────────────────────────────────────┤
│ 4 ATTORNEY · canvas        photo comp │ H2, intro, 6-item list, credentials│
├────────────────────────────────────────────────────────────────────────────┤
│ 5 WHY CHOOSE · primary     duotone image │ H2 + 01 / 02 / 03 pillars       │
├────────────────────────────────────────────────────────────────────────────┤
│ 6 TESTIMONIALS · navy      featured quote │ review grid + "show all"       │
├────────────────────────────────────────────────────────────────────────────┤
│ 7 CONTACT · gavel band "Talk to a Family Attorney Today!" [Let's Talk]     │
│   ┌──────────── panel overlaps the band ──────────────┐                    │
│   │ navy: Contact Me Today! │ white: Request an        │                    │
│   │ phone, email, address,  │ Appointment + form       │                    │
│   │ hours                   │                          │                    │
│   └───────────────────────────────────────────────────┘                    │
├────────────────────────────────────────────────────────────────────────────┤
│ 8 SERVICE AREAS · canvas   H2 + intro │ South Carolina chips / NC chips    │
├────────────────────────────────────────────────────────────────────────────┤
│ 9 FOOTER · navy  logo+contact │ Family Law │ Divorce │ Estate │ Quick Links │
└────────────────────────────────────────────────────────────────────────────┘
```

### Mobile (390 px)

```
┌──────────────────────────────┐
│ [A]        [☎ Call Now] [☰] │ 64px, always sticky, navy
├──────────────────────────────┤
│ HERO                         │
│ ATTORNEY SYRETTA R. ANDERSON │
│ Your Legal Guardian in       │
│ Rock Hill, SC   (40px)       │
│ paragraph (17px)             │
│ [ Send Me a Message ]  full  │  ← both buttons on the first screen
│ [ ☎ Call Now ]         full  │
│ ╭── arch portrait ───╮       │
├──────────────────────────────┤
│ TRUST: 3 fact rows + 3-col logo grid │
│ PRACTICE: 2×2 group buttons → accordion list │
│ ATTORNEY: photo → text → credentials │
│ WHY CHOOSE: image banner → 3 pillars │
│ REVIEWS: featured quote → swipe carousel │
│ CONTACT: band → form card → info │
│ AREAS: wrapped chips (2 groups) │
│ FOOTER: contact → accordions │
└──────────────────────────────┘
```

**Estimated page length:** desktop about 7,000 px (now 9,249 px). Mobile about 8,500 px (now 13,206 px).

---

## 2. Global layout system

| Item | Value | Rationale |
|---|---|---|
| Breakpoints | Tailwind defaults: `sm` 640 · `md` 768 · `lg` 1024 · `xl` 1280 | Mobile under 768, tablet 768–1023, desktop 1024 and up |
| Container | Content max 1240 px. Side padding 20 px (mobile) · 32 px (md) · 40 px (xl) | No horizontal overflow at 320 px |
| Grid | 12 columns, 24 px gutter at `lg` and up | Editorial asymmetric splits (7/5, 5/7) |
| Section spacing | 128 px (`xl`) · 104 px (`lg`) · 88 px (`md`) · 72 px (mobile) | Generous whitespace without dead space |
| Corner radius | 8 px buttons and inputs · 16 px cards · 24 px panels · arch frames rounded fully at the top | 8 / 16 / 24 are the original theme's own radii |
| Shadows | Navy-tinted only. Card: `0 1px 2px rgb(17 18 64/.06), 0 12px 32px -12px rgb(17 18 64/.18)`. Raised panel: `0 32px 64px -32px rgb(17 18 64/.35)` | Shadows match the brand instead of generic grey |
| Hairlines | `#919EAB` at 30% on light backgrounds · `#FFFFFF` at 12% on dark | Both from the original palette |
| Section transitions | Overlaps instead of hard cuts: trust card over the hero, hero portrait crossing the edge, contact panel over the gavel band | Gives the "editorial" feel without decorative dividers |

---

## 3. Color system

### 3.1 Tokens (all original values)

| Token | HEX | Source on current site | Role in the redesign | Never use for |
|---|---|---|---|---|
| `navy` | **#111240** | `--secondary` | Header, hero, testimonials, contact info panel, footer | — |
| `primary` | **#2673A4** | `--primary` | Primary buttons, links on light, eyebrows on light, icons, Why Choose band, active tab, focus ring on light | Text on navy (only 3.44:1) |
| `primary-hover` | **#21628C** | reviews plugin "darken" | Button hover and pressed | — |
| `sky` | **#58B2DC** | `--third` | Accents **on navy only**: eyebrows, arch line, focus ring on dark, quote marks | Anything on white or primary (fails at 2.4:1 and 2.2:1) |
| `ink` | **#212B36** | `--fourth` | Headings and form labels on light | — |
| `slate` | **#637381** | `--fifth` | Body text on light, **input borders** (4.88:1 non-text contrast) | — |
| `mist-line` | **#919EAB** | reviews plugin | Decorative hairlines only, at 30% | Input borders (2.73:1 fails) |
| `white` | **#FFFFFF** | `--sixth` | Cards, text on dark | — |
| `canvas` | **#FBFBFB** | `--body-background-primary` | Default page background | — |
| `mist` | **#F4F6F8** | `--body-background-secondary` | Alternate section background (Practice Areas) | — |
| `gold` | **#D6B867** | reviews plugin `--rating-color` | Star ratings, **on navy only** (9.21:1) | Light backgrounds (1.92:1) |
| `error` | #DC3232 | Contact Form 7 default error color on the current site | Form error text and borders only | Decoration |

The hero overlay `#100000 @ 20%` from the current site is retired, because the hero no longer sits on a full-bleed photo.

### 3.2 Contrast (computed)

| Pairing | Ratio | Result |
|---|---|---|
| ink on canvas / mist / white | 13.87 / 13.25 / 14.35 | AA |
| slate on canvas / mist / white | 4.72 / 4.51 / 4.88 | AA (mist is the floor, so body text on mist is 16 px or larger) |
| primary on canvas / mist / white | 4.99 / 4.76 / 5.16 | AA |
| white on primary / primary-hover | 5.16 / 6.58 | AA |
| white on navy · white at 75% on navy · white at 60% on navy | 17.73 · 10.25 · 6.90 | AA |
| sky on navy · gold on navy | 7.44 · 9.21 | AA |
| primary button edge against navy | 3.44 | Passes the 3:1 rule for non-text elements |
| **white at 85% on primary** | 4.21 | **Fails**, so text on the primary band is always 100% white |

### 3.3 Section background sequence

`navy` (header + hero) → `canvas` + white card (trust) → `mist` (practice) → `canvas` (attorney) → `primary` (why choose) → `navy` (testimonials) → duotone photo band → `canvas` + panel (contact) → `canvas` (areas) → `navy` (footer)

The rhythm alternates dark → light → light → light → color → dark → light → dark.

### 3.4 Photo treatment

- **Attorney photos stay in natural color.** They are genuine portraits and must look true to life.
- **Stock photos (gavel images, archway) get one consistent navy → primary duotone.**
  - It is CSS only: a navy multiply layer plus a primary overlay at 30–40%.
  - It ties mismatched warm stock photos to the palette and hides the softness of low-resolution originals.

---

## 4. Typography hierarchy

**Fonts:** Cabin and Mukta, the original families, self-hosted through `@fontsource`.

**Weights loaded:**
- Cabin: 400, 500, 600, 700, plus 500 italic for the featured quote.
- Mukta: 400, 500, 600.

That replaces the 18 font files the current site loads. The theme's light positive tracking on body text is kept.

| Role | Font | Desktop size / line height | Mobile | Weight · tracking | Color |
|---|---|---|---|---|---|
| H1 (hero) | Cabin | 64 / 68 | 40 / 44 | 700 · −0.015em (original H1 tracking) | white |
| H2 (section) | Cabin | 48 / 54 | 32 / 38 | 700 · −0.01em | ink on light, white on dark |
| H3 (card, pillar, form title) | Cabin | 22 / 30 | 20 / 28 | 600 | ink / white |
| Eyebrow (small label above a heading) | Cabin | 13 / 16, uppercase | 12 / 16 | 600 · +0.16em, with a 24 px rule line in front | primary on light · sky on navy · white on primary |
| Stat numeral (trust) | Cabin | 44 / 48 | 32 / 36 | 700 · −0.01em, tabular numbers | navy |
| Featured quote | Cabin | 30 / 42 | 22 / 32 | 500 italic | white |
| Lead paragraph | Mukta | 19 / 31 | 17 / 27 | 400 | white at 75% on navy / slate |
| Body | Mukta | 17 / 28 | 16 / 26 | 400 · +0.01em | slate / white at 75% |
| Lists | Mukta | 16 / 26 | 16 / 26 | 400–500 | ink (list items read as content, not prose) |
| Small and meta | Mukta | 14 / 22 | 14 / 22 | 400 | slate / white at 60% |
| Nav links | Cabin | 15 / 20 | 20 / 28 (menu sheet) | 500 / 600 | white at 85%, white on hover |
| Buttons | Cabin | 16 / 20 | 16 / 20 | 600 · +0.01em | — |
| Form labels | Cabin | 14 / 20 | 14 / 20 | 600 | ink |

**Line length:** body text is capped at 65 characters per line and lead paragraphs at 34rem.

---

## 5. Section-by-section plan

### 5.0 Utility bar and header

**Utility bar (desktop only, 40 px, navy, scrolls away):**
- **Left:** "Reach Out to Me" · phone link · email link · "124 Oakland Ave, Rock Hill, SC", linking to the original Google Maps directions URL.
- **Right:** "Spanish-speaking clients welcome".
- **Styling:** Mukta 14 px at white 75%. Each item has a hit area at least 44 px tall.

**Main header (desktop):**
- **Height:** 80 px over the hero, shrinking to 68 px once sticky.
- **Background:** navy throughout, so **one logo version, the white one, is used site-wide**. The blue-gradient tile and the blue circle are retired; see §12-F.
- **Logo size:** 64 px tall (about 68 px wide), shrinking to 52 px when sticky.
- **Navigation, with the original labels and order:** Home · About · Family Law▾ · Divorce Lawyer▾ · Estate Planning▾ · More▾.
- **Call button:** "☎ Call Now" in primary, 44 px tall. At `xl` and above the phone number also appears next to it.

**Dropdown menus (desktop):**
- **Panel:** white, 280 px wide, 12 px radius, card shadow.
- **Items:** 44 px rows in Cabin 500 15 px ink. Hover gives a mist background and a 2 px primary bar on the left.
- **Divorce Lawyer:** the first item becomes "Divorce Lawyer" → `/services/divorce-lawyer/`. This existing page is currently reachable only from a card and the footer, so it's a link fix, not new content.
- **More:** opens as a two-column panel. The left column is the "Areas We Serve" label, then "All Areas We Serve" and the 9 location links. The right column is FAQs and Contact (→ `#contact`).
- **Top-level items are `<button>`s,** because their original links point to `#`.

**Sticky behaviour:**
- After 24 px of scroll the header goes solid with a shadow and shrinks.
- The utility bar has already scrolled out of view by then.

**Tablet (768–1023):** logo, Call Now button and menu button. The utility bar is hidden.

**Mobile header (under 768):**
- 64 px tall, always sticky.
- Logo 48 px tall on the left.
- On the right: a **"☎ Call Now" pill** (primary, 44 px tall, always visible, accessible name "Call Now, (803) 980-5252") and a **menu button** (44×44, accessible name "Open menu").

**Mobile menu:**
- A full-height navy sheet that slides in from the right and scrolls internally.
- **Top row:** logo and Close button (44×44).
- **Main list:** accordions in Cabin 600 20 px with 56 px rows, in the same order as the desktop menu. Areas We Serve is nested under More.
- **Fixed footer of the sheet:** a full-width "Call Now (803) 980-5252" button, a "Send Me a Message" button (→ `#contact`), and the email and address.
- **Behaviour:** keyboard focus stays inside the sheet, Esc closes it, the page behind can't scroll, and focus returns to the menu button on close.
- This **replaces** the template's "Get Started / financial planning" block.

**Removed:** the floating "+" button. The always-visible Call Now button covers its job.

---

### 5.1 Hero

**Purpose:** say who she is, what she does and where, and show both ways to get in touch, all on the first screen.

**Desktop:**
- Navy background with the original archway hero photo laid over it at about 12% opacity in the duotone. This keeps continuity with the current site.
- **Left, columns 1–7:**
  - eyebrow "ATTORNEY SYRETTA R. ANDERSON" (sky);
  - **H1**;
  - lead paragraph;
  - buttons: **[Send Me a Message]** (primary, → `#contact`) and **[☎ Call Now]** (white outline, `tel:`);
  - micro-line "✓ Spanish-speaking clients welcome".
- **Right, columns 8–12:** the attorney portrait in an **arch-topped frame** (about 440×600) with a 1 px sky arch outline offset 20 px behind it. The arch echoes the original archway photo and the apex of the "A" monogram.
  - The frame's base runs about 64 px past the hero's bottom edge and overlaps the trust card.
  - A small white name plate on the frame reads "Syretta R. Anderson".
- **Height:** content-driven, about 720 px. There's no forced 100vh.

**Mobile:**
- Eyebrow, H1 (40 px), paragraph (17 px), then two full-width buttons stacked (52 px each). **Both buttons land on the first screen** at 390×844.
- The portrait comes after, in an arch frame at full width (max 340 px) and about 1.25:1 portrait ratio, with a different crop (see §6).

**Content mapping:**

| Slot | Source (inventory) |
|---|---|
| Eyebrow | Name from the About page: "Attorney Syretta R. Anderson" |
| H1 | Hero H2 "Your Legal Guardian in Rock Hill, SC", **promoted to H1**. Option A, see §12-C1 |
| Lead | Hero paragraph, word for word |
| Primary button | "Send Me a Message" (originally → /contact/, now → `#contact`) |
| Secondary button | "Call Now" (header button label) → tel:8039805252 |
| Micro-line | "Spanish-speaking clients welcome" (Section 2) |

**Option B (if you prefer to keep the current H1 text for SEO):**
- H1 "Trust a Seasoned Family Law Attorney in the Rock Hill, SC Area" at 52 px.
- "Your Legal Guardian in Rock Hill, SC" becomes the eyebrow.

---

### 5.2 Trust and badges

**Desktop:**
- A white card (24 px radius, raised shadow) on canvas, **pulled up 64 px over the hero's lower edge**.
- **Row 1 — three fact tiles divided by hairlines:**
  - **Since 2007** · Licensed in South Carolina
  - **Since 2010** · Licensed in North Carolina
  - **Since 2015** · Serving clients in North & South Carolina
- **Row 2 — the 7 badge logos** in 140×72 cells.
  - Logos are greyscale at 70% opacity by default. On hover or focus they go to full color and opacity, with a 150 ms fade.
  - Each linked logo has an accessible name such as "South Carolina Bar (opens in new tab)".
  - York County Bar Association has no link, matching the original.
- **Heading:** a visually hidden H2 "Affiliations & Reviews" (new microcopy).

**Mobile:**
- The card is full width and pulled up 40 px.
- The facts become 3 stacked rows, with the numeral on the left and the label on the right.
- The badges sit in a **3-column grid** (3 + 3 + 1 centered) with no carousel. Logos are at most 40 px tall and shown in full color, since there's no hover on touch.

**Content mapping:**
- The facts come from the About page, reformatted. The labels are new microcopy, listed in §11.
- The badges and their link targets are the original 7, in the original order.

**Deliberately absent:** any "years of experience" figure, because the sources disagree (§12-A1). Any aggregate star rating or review count, because none exists in the source.

---

### 5.3 Practice areas

**Desktop:**
- Mist background.
- **Header row:** on the left (columns 1–6), the eyebrow "PRACTICE AREAS" and H2 "Reliable Legal Expertise Awaits". On the right (columns 7–12), the original intro paragraph, aligned to the bottom of the heading.
- **Tabs:** four tabs with an underline that slides to the selected one: **Family Law · Divorce · Estate Planning · Personal Injury**.
- **Card grid:** 4 cards show as 2×2, 6 as 3×2, 3 as 3×1.
- **Card anatomy:**
  - white card, 16 px radius, 1 px hairline, padding 32;
  - 48 px icon in a 64 px circle tinted with primary at 8%;
  - **H3** title;
  - original front description;
  - hairline;
  - original back-of-card bullet list, with primary check icons and Mukta 15 px ink text. "Our Services Include:" is kept where the original has it;
  - a **"Read More →"** link at the bottom.
- **Card hover:** the card lifts 4 px, the border turns primary at 40%, and the icon circle fills primary with a white icon.
- **Family Law tab extra:** below the grid, two link chips for the menu-only practice areas, **Paternity Law →** and **LGBTQ+ Family Law →**. These have no description in the source, so none is invented.

**Mobile:**
- The tabs become a **2×2 grid of group buttons**, each 52 px tall, so all four groups stay visible without horizontal scrolling.
- Cards become an **accordion list**. Each header is 72 px tall with icon, title and chevron. Expanding it shows the description, bullets and Read More.
- The first card in each group starts expanded.
- **Result:** the Estate Planning group takes about 650 px instead of a 3,000 px stack of cards.

**Content mapping (17 homepage cards, 2 menu-only areas, all original text):**

| Tab | Cards, in original order | "Read More" goes to |
|---|---|---|
| Family Law | Child Custody · Child Support · Adoption · Visitation, plus chips for Paternity Law and LGBTQ+ Family Law | Original `/services/...` URLs on the live site |
| Divorce | Divorce Law · Alimony · Post Separation · Division of Assets | Original URLs |
| Estate Planning | Trusts · Conservatorship · Power of Attorney · Healthcare Power of Attorney · Living Wills · Wills | Original URLs |
| Personal Injury | Premise Liability · Vehicular Accidents · Dog Bites | **Temporary:** button labelled "Send Me a Message" (original label) → `#contact?service=<card>`, which preselects the matching Services option (all three exist in the original dropdown). The originals return 404. |

**Tab order:** Family Law is the default tab, matching the hero text's "focus on family law". Personal Injury is last pending §12-A2.

**Without JavaScript:** all four panels render stacked, with group headings, so nothing can be hidden.

---

### 5.4 Attorney introduction — Syretta R. Anderson

**Desktop:**
- Canvas background.
- **Image composition, columns 1–5:**
  - the About-page portrait in a 24 px-radius frame, about 360×400;
  - a solid navy block offset 24 px down and to the left behind it;
  - a small white card overlapping the bottom-right corner, holding the About-page line "*Legal counsel offered to both English and Spanish-speaking clients" with a speech icon.
- **Text, columns 7–12:**
  - eyebrow "MEET ATTORNEY SYRETTA R. ANDERSON";
  - **H2**;
  - intro paragraph;
  - the 6-item list in 2 columns with check icons;
  - the "over a decade" paragraph;
  - the **credentials block**, a three-part definition list under the About page's own headings: Education · License · Memberships;
  - actions: **[☎ Work With Me]** (primary, `tel:`) and a **"Read More →"** link to /about/ with accessible name "Read more about Attorney Syretta R. Anderson".

**Mobile:**
- The image goes first: frame at most 340 px wide, about 1:1.1, with the navy offset block reduced to 12 px.
- Then the text. The list drops to one column.
- Credentials become three stacked blocks with hairlines between them.
- The buttons are full width.

**Content mapping:**

| Slot | Source |
|---|---|
| H2 | Original **H1** "Trust a Seasoned Family Law Attorney in the Rock Hill, SC Area" (Option A) |
| Intro, list, paragraph | Section 2, word for word, including the 6 list items and "With over a decade of experience…" |
| Education | JD (Juris Doctor) – North Carolina Central University School of Law 2007 · BA (Bachelor of Arts) – Winthrop University 2002 |
| License | North Carolina – 2010 – Present · South Carolina – 2007 – Present |
| Memberships | The 5 About-page items, word for word |
| Overlay card | "*Legal counsel offered to both English and Spanish-speaking clients" (About page) |
| CTA | "Work With Me" → tel:8039805252 (original behavior, now with a visible phone icon) |

---

### 5.5 Why choose Anderson Law Firm

**Desktop:**
- Primary (#2673A4) background, the same color this content had on the current site.
- **Left, columns 1–5:** a duotone image running to the viewport edge and the full height of the section.
- **Right, columns 6–12:**
  - eyebrow "WHY CHOOSE ANDERSON LAW FIRM?" in white;
  - **H2**;
  - three **numbered pillars**, each with a Cabin 700 "01 / 02 / 03" numeral, a white rule at 30% above it, an H3 and a paragraph.
- **All text is 100% white.** The 85% tint fails contrast here; see §3.2.

**Mobile:** the image becomes a 16:9 banner at the top, followed by the heading and the pillars stacked.

**Content mapping:**

| Slot | Source |
|---|---|
| Eyebrow | Section 5 label "Why Choose Anderson Law Firm?" |
| H2 | "A Versatile Divorce Lawyer at Your Service" |
| 01 | "A Client-Focused Divorce & Family Law Attorney" + its paragraph |
| 02 | "Experienced, Compassionate Legal Guidance" + its paragraph |
| 03 | Section 6: label **"Expert Experience Guaranteed!"** (kept, flagged in §12-B) + H3 "Compassionate Family Law Attorney at Your Side" (was H2) + its paragraph |

This merges the near-duplicate sections 5 and 6 into one. No text is lost.

---

### 5.6 Client testimonials

**Desktop:**
- Navy background.
- **Header row:** on the left, the eyebrow "YOU CAN COUNT ON ME" (sky) and H2 "See What My Clients Have to Say!". On the right, two links that both use original URLs: "Read more reviews on Google →" (the Google Maps listing) and **"Leave a Review"** (the g.page link).
- **Body, left (columns 1–5):** a **featured quote**.
  - A large sky quotation mark, then the quote in Cabin 500 italic 30 px.
  - Name, gold stars and a "GOOGLE" label below.
- **Body, right (columns 6–12):** a 2-column staggered grid with **6 cards shown** and the rest revealed by **"Show all reviews"**. All 12 are in the HTML from the start.
- **Card anatomy:**
  - background white at 6% with a white 12% border and 16 px radius;
  - a primary avatar circle with the white initial (original style);
  - name in Cabin 600 white;
  - gold stars, with hidden text "Rated 5 out of 5";
  - review in Mukta 16/26 at white 75%;
  - source label "GOOGLE".
- **Long reviews** are clamped to 6 lines with a **"Read full review"** toggle that announces whether it's open.

**Mobile:**
- The featured quote at 22 px, then a **swipeable carousel** of the other 11 reviews.
- Cards are 85% of the width so the next one peeks in, and they snap into place.
- Prev/next buttons are 44×44, with a "2 / 11" counter that screen readers announce.
- The carousel scrolls only inside its own container, so the page never scrolls sideways.
- No autoplay.

**Content mapping:**
- All 12 Google reviews with names **exactly as written**, typos included. They're client-authored and won't be edited.
- **Featured quote (proposal):** Jeffrey Williams, "Syretta is an amazing lawyer who actually listens and takes her cases personally!", because it's short enough for display size.
- **Grid order:** the original order, minus the featured one.
- **Not added:** no review dates, no aggregate rating, no count. None exists in the source.

---

### 5.7 Unified contact section

This replaces four current sections: "Contact Me Today!" (S7), the gavel banner (S9), "Request an Appointment" (S10) and the photo-plus-form block (S11).

**Part A — call-to-action band:**
- The original `gavel-and-books.webp` image with the navy duotone at 85%, about 380 px tall on desktop.
- **Left:** H2 "Talk to a Family Attorney Today!", its paragraph, and **[Let's Talk →]**, a white button linking to `tel:`.
- **Right (`lg` and up):** the phone number in large Cabin 600 type.

**Part B — contact panel:**
- A white panel (24 px radius, raised shadow) **pulled up 128 px over the band**.
- **Left (columns 1–5), navy inside the panel:**
  - eyebrow "I'M HERE TO HELP" (sky);
  - **H2 "Contact Me Today!"**;
  - both paragraphs from S7: "At Anderson Law Firm, trust, integrity…" and "Get in touch today…";
  - a contact list with 56 px rows and icon circles:
    - **Phone** · "Questions or queries? Get in touch!" · (803) 980-5252
    - **Support** · "Need help? Reach out today!" · syretta@srandersonlawfirm.com
    - The address "124 Oakland Ave, Rock Hill, SC", linking to the original directions URL, as the current site does.
    - **Business Hours**, the four lines word for word.
  - the line "Spanish-speaking clients welcome".
- **Right (columns 6–12), white:**
  - eyebrow "I'D LOVE TO HEAR FROM YOU" (primary);
  - **H3 "Request an Appointment"**;
  - the form.

**Form layout (desktop):**

| Row | Fields |
|---|---|
| 1 | First name · Last name |
| 2 | Email *(required)* · Phone Number |
| 3 | Zip code · Services |
| 4 | Message (5 rows) |
| 5 | **[Submit]**, primary, 52 px |

**Form fields — original labels, placeholders and Services options word for word, with these changes:**

| Field | `autocomplete` | `inputmode` | Validation message |
|---|---|---|---|
| First name | `given-name` | — | — |
| Last name | `family-name` | — | — |
| Email (required) | `email` | `email` | "The email address is invalid, please check the formatting (e.g. email@domain.com)" |
| Phone Number | `tel` | `tel` | "Please enter a 10-digit phone number" |
| Zip code | `postal-code` | `numeric` | — |
| Services | — | — | — (the original 13 options, plus preselection from the Personal Injury cards) |
| Message | — | — | "Please write a message" (shown only if the field becomes required, see §12-E3) |

- **Labels:** always visible above the field, never placeholder-only. Each `for`/`id` pair is matched correctly, fixing the audit's label bug.
- **Required field:** Email shows a "Required" marker, with `aria-required` set.
- **Field style:**
  - white background, 1 px **slate** border (4.88:1), 8 px radius, 52 px tall;
  - focus: 2 px primary border plus a primary ring at 25%;
  - error: 2 px #DC3232 border, an icon and the message, with `aria-invalid` and `aria-describedby`.
- **On submit with errors:** focus moves to the first invalid field, and a live region announces how many errors there are.
- **Submission:** handled by a small adapter function. The default in the prototype is **mailto**: it opens the visitor's email app with every field filled in. Nothing fakes a "sent" confirmation. The real destination is pending §12-E1.

**Mobile:**
- The band shrinks to about 420 px with stacked text and a full-width "Let's Talk" button.
- Then the **form card**, then the **navy info block** (phone, email, address, hours).
- The form comes before the info because the band just above already offers the call.
- Fields are full width with 16 px text, so iOS doesn't zoom in.

**Removed:** the duplicate "Contact Me Today!" heading (now used once), "Start a project with me!", the "Click to Enlarge" button, and the full-length photo beside the form (it moves to the hero). All are listed in §12-D.

---

### 5.8 Service areas

**Desktop:**
- Canvas background.
- **Left (columns 1–5):** H2 "Service Areas", the original paragraph, and a "All Areas We Serve →" link to `/areas-we-serve/` using the original label.
- **Right (columns 7–12):** two groups, each with an H3 and wrapped **chips**:
  - **South Carolina:** Rock Hill, SC · Gaffney, SC · Fort Mill, SC · York County, SC · Cherokee County, SC · Lancaster County, SC · Lake Wylie, SC
  - **North Carolina:** Charlotte, NC · Mecklenburg County, NC · Gaston County, NC
- **Chip styling:** 44 px tall pills with a map-pin icon, hairline border and Cabin 500 15 px text.
  - Linked chips go to the original live-site pages, and on hover turn primary at 8% with a primary border.
  - Mecklenburg County and Gaston County have no page, so they render as plain text chips in a quieter style with no hover.

**Mobile:**
- Same order. The chips wrap 2–3 per row.
- **About 380 px total, down from 1,355 px.**

**Content mapping:**
- The 10 homepage labels, word for word. Grouping by state is reorganization only.
- The menu-only entries ("Gastonia, SC", "York, SC") stay in the menu only, as they are on the current site; see §12-A3.

---

### 5.9 Footer

**Desktop:**
- Navy background, 96 px top padding.
- **Columns 1–4:**
  - white logo, 120 px wide;
  - phone, email and address, each linked the original way;
  - 5 social icons in 44×44 hit areas, each with an accessible name (Facebook, Instagram, Twitter, LinkedIn, Google);
  - **[Leave a Review]** as an outline button with a sky border.
- **Columns 5–12:** four link columns, each headed by a small uppercase H2:
  - **Family Law** (6 links)
  - **Divorce** (4 links: Divorce Lawyer, Alimony Divorce Attorney, Post Separation Support, Equitable Distribution)
  - **Estate Planning** (6 links)
  - **Quick Links** (Home, About, All Areas We Serve, FAQs, Contact)
- **Bottom bar:** a white 12% hairline, then "©2026, SR Anderson Law Firm. All Rights Reserved." · Privacy Policy.

**Mobile:**
- The logo, contact block, socials and review button stack first.
- The four link groups become **accordions** with 52 px headers.
- The bottom bar is centered.
- **About 650 px tall, down from 1,452 px.**

**Content mapping:**
- The original footer had one 8-link "Services" column. It's expanded to every service already in the main menu, so estate planning gets a footer link too. No new links are created.

---

## 6. Image plan

### 6.1 Assets used

| Asset (original file) | Native size | Placement | Crop and treatment | Notes |
|---|---|---|---|---|
| `Pic-for-home-page.jpg` | 1024×1536 | Hero portrait | Desktop: head to mid-calf in a 440×600 arch frame. Mobile: head to knee, about 1:1.25. Natural color, served as AVIF/WebP at 480 / 768 / 1024 w with `fetchpriority="high"` | Highest-resolution genuine portrait. Native pixels limit retina sharpness (§12-F2) |
| `attorney-syretta-anderson.webp` (About page) | 480×439 | Attorney intro | Displayed at most 360 px wide, natural color | Small source file, so a larger original is requested |
| `personal-injury-lawyer-rock-hill-sc.webp` (original hero archway) | 1920×750 | Hero background texture | Duotone at about 12% opacity, fading out to the right | Keeps the original hero's look. No location caption, since the place isn't confirmed |
| `legal-council.webp` (gavel + meeting) | 1920×1280 | Why Choose image panel | Duotone, cover crop on the gavel | — |
| `gavel-and-books.webp` | 1920×394 | Contact CTA band | Duotone with navy at 85% | Very wide source; the overlay hides the upscale softness |
| `SR-anderson-law-firm-white.png` | 400×377 | Header, mobile menu, footer | Native | A vector (SVG) logo is requested |
| 7 badge SVGs | — | Trust card | Greyscale → color on hover | — |
| Favicon set | — | `<head>` | Unchanged | — |

### 6.2 Practice-area icons — decision needed (§12-F4)

The 17 original icons mix three styles: solid filled, outline, and a small multicolor one (Power of Attorney).

- **Proposal:** use one consistent outline icon set in primary blue. Lucide is open source and matches stroke widths.
- **Fallback if not approved:** keep the originals, resized to 96 px WebP. They are currently 1440×1440 PNGs shown at 100 px.

### 6.3 Original images not used (logged, not deleted)

| Asset | Reason |
|---|---|
| `divorce-law.webp` (DIVORCE document) | Only one stock photo per mood is needed. Available as an alternate for Why Choose |
| `home-image-background.webp` (seated portrait + logo circle composite) | The logo is baked into the image and the attorney is cropped at the edge. The clean original of the seated portrait is requested (§12-F2) |
| `female-lawyer-with-judge-gavel…webp`, `close-up-shot-of-lawyer-using-laptop.webp` (About page) | Stock showing unidentified people could be mistaken for the firm's own staff |
| 15 flip-card back photos | The flip interaction is retired. Two of them are also reused on the wrong cards: Trusts and Conservatorship show accident and allowance photos |
| Blue-gradient tile logo and blue-circle logo | One logo version only (§12-F1) |
| `seo.webp` | Still used as the social-sharing image, not shown on the page |

### 6.4 Photography recommendation (client)

A short professional session would raise quality more than any layout change. It needs at least 2,400 px on the long edge: one hero portrait, one seated or desk portrait, and two office or detail shots.

Until then, the layout is designed around the two existing genuine portraits. **No stock photos of people are used.**

---

## 7. Interaction and animation

**Motion tokens:**
- Durations: 150 ms for hovers and color changes · 250 ms for menus, tabs and accordions · 600 ms for reveals.
- Easing: `cubic-bezier(.22,1,.36,1)` for entrances, and the standard `ease` for hovers.

| Element | Behaviour |
|---|---|
| Header | Transparent → solid navy with shadow and 80 → 68 px shrink after 24 px of scroll. The logo scales with it |
| Dropdowns | Open on hover with a 120 ms delay, and on click / Enter / Space. Close with Esc or on leaving. Arrow keys move between items. `aria-expanded` is kept in sync |
| Mobile menu | Slides in from the right (250 ms) and the backdrop fades. Focus stays inside, the page can't scroll, and focus returns to the menu button on close |
| Hero entrance | Eyebrow → H1 → paragraph → buttons fade up 16 px, 80 ms apart. The portrait is uncovered from the bottom up inside the arch over 900 ms |
| Scroll reveals | Section headings and card groups fade up 16 px once, staggered 60 ms, when 15% visible. **Only added after JavaScript has loaded, so content never stays hidden** |
| Practice tabs | The underline slides between tabs. Panels cross-fade and move up 8 px (200 ms). The selected tab can be shared by URL hash (`#practice-estate`). The mobile accordion animates its height |
| Cards | Lift 4 px, border tint and icon circle fill. The "Read More" arrow nudges 4 px |
| Testimonials | "Read full review" expands the height. "Show all reviews" reveals the rest with the same fade. The mobile carousel uses native scroll-snap with buttons and no autoplay |
| Buttons and links | Background change to `primary-hover`. Links get an underline that draws from left to right |
| Anchor links | Smooth scroll, with an offset equal to the sticky header height |
| Reduced motion | `prefers-reduced-motion` turns off every transform, the carousel transition and smooth scrolling. Content appears instantly |

**Implementation:** CSS transitions plus one small IntersectionObserver hook. **No animation library**, to keep the JavaScript bundle small.

**Not used:** autoplaying carousels, parallax scroll effects, sound or video.

---

## 8. Accessibility improvements

| # | Improvement | Fixes audit item |
|---|---|---|
| 1 | One H1 with a correct heading order (outline below). No empty headings, and no H5s used as small labels above headings | Broken heading order, empty `<h2>` |
| 2 | Landmarks (`header`, `nav` with labels, `main`, `footer`) and a "Skip to content" link | — |
| 3 | Form: matching label `for`/`id`, `autocomplete`, `inputmode`, visible "Required", errors linked to their fields, focus on the first error, a live error summary | Mismatched labels |
| 4 | All interactive targets at least **44×44 px**, including chips, social icons, carousel buttons and accordion headers | 34 undersized targets on mobile |
| 5 | Menu and close controls are real `<button>`s with accessible names and `aria-expanded` / `aria-controls` | Hamburger was an `<a>` with no label |
| 6 | Social icon links named "Facebook" etc. External links get `rel="noopener"` and hidden "(opens in new tab)" text | Unlabelled icons |
| 7 | Contrast follows the §3 rules: sky and gold only on navy, full white on primary, slate input borders | Gold stars at 1.78:1, sky at 2.38:1 |
| 8 | Stars carry hidden "Rated 5 out of 5" text. Reviews use `figure` / `blockquote` / `figcaption` | — |
| 9 | Tabs follow the standard tabs pattern (`tablist` / `tab` / `tabpanel`, arrow keys). On mobile the accordion uses buttons with `aria-expanded` | Flip-on-hover cards were inaccessible by touch and keyboard |
| 10 | The carousel is a labelled region with labelled buttons and an announced counter. No autoplay | — |
| 11 | Meaningful alt text ("Attorney Syretta R. Anderson"). Decorative and duotone images get `alt=""`. Logo alt "Anderson Law Firm, PC" | "SR anderson law firm 300x283", "allimony icon", "legal council" |
| 12 | Phone links have accessible names that include the number. "Work With Me" and "Let's Talk" show a phone icon and announce that they call | Buttons that silently start a call |
| 13 | Visible focus ring everywhere: 2 px primary on light, 2 px sky on dark, 2 px offset | — |
| 14 | Reduced motion respected (§7) | — |
| 15 | Works at 320 px wide and 200% zoom with no sideways scrolling. Checked automatically at 320 / 360 / 390 / 414 / 768 / 1024 / 1280 / 1440 | — |

**Planned heading outline:**

```
H1  Your Legal Guardian in Rock Hill, SC
  H2 (visually hidden)  Affiliations & Reviews
  H2  Reliable Legal Expertise Awaits
      H3  ×17 practice cards (+ visually hidden H3 per tab panel)
  H2  Trust a Seasoned Family Law Attorney in the Rock Hill, SC Area
      H3  Education · License · Memberships
  H2  A Versatile Divorce Lawyer at Your Service
      H3  ×3 pillars
  H2  See What My Clients Have to Say!
  H2  Talk to a Family Attorney Today!
  H2  Contact Me Today!
      H3  Request an Appointment
  H2  Service Areas
      H3  South Carolina · North Carolina
  (footer) H2 ×4 link group titles
```

**Verification before handover:** axe-core automated scan · Lighthouse accessibility score of 100 · a full keyboard-only pass · a screen-reader spot check (NVDA / VoiceOver) · Playwright checks for sideways overflow and target sizes.

---

## 9. Performance and SEO

**Performance targets on mobile:** LCP under 2.5 s · CLS under 0.05 · JavaScript under 100 KB gzipped.

**How:**
- Self-hosted Latin-subset fonts, with Cabin 700 and Mukta 400 preloaded.
- Responsive AVIF/WebP images with explicit `width` and `height` attributes.
- Everything below the first screen lazy-loads.
- The 600 KB theme CSS is replaced by purged Tailwind CSS.

**Third-party scripts:**
- The current site loads Google Tag Manager, two Google tags (Ads and GA4), Meta Pixel, WhatConverts, Jetpack Stats, Gauges and CookieYes.
- **None are included in the prototype.** Which ones to restore at launch is a client decision (§12-G3).

**Meta:**
- The original title and meta description stay **unchanged** until §12-G1 is answered. Both currently say "Personal Injury" and "13 years".

**Structured data (proposal):**
- `LegalService` + `Attorney` JSON-LD built only from genuine data: name, address, phone, hours and licences.
- The `logo` field gets fixed; it currently points to the attorney photo.

---

## 10. Build architecture (for reference, built after approval)

```
src/
  content/        verbatim data: nav.ts, hero.ts, practiceAreas.ts, attorney.ts,
                  whyChoose.ts, reviews.ts, contact.ts, serviceAreas.ts, footer.ts
                  (each entry annotated with its inventory source)
  components/     Header, UtilityBar, MobileMenu, Dropdown, Hero, TrustBar,
                  PracticeAreas (Tabs + Accordion + PracticeCard), AttorneyIntro,
                  WhyChoose, Testimonials (Featured, ReviewCard, Carousel),
                  ContactBand, ContactPanel, ContactForm, ServiceAreas, Footer,
                  ui/ (Button, Eyebrow, Section, Container, Icon, Chip)
  hooks/          useScrolled, useReveal, useMediaQuery, useFocusTrap
  assets/original/  untouched downloads of every original file used
  styles/         Tailwind theme tokens (colors, fonts, radii, shadows from §2–§4)
```

**Stack details:**
- TypeScript, so the content data is type-checked.
- `@fontsource/cabin` and `@fontsource/mukta`.
- `lucide-react` for UI icons.
- Inline SVGs for the social logos.

---

## 11. New UI microcopy (needs approval)

These labels don't exist on the current site. None of them makes a claim; each is a navigation label or a reformatted fact.

| Where | Proposed text | Based on |
|---|---|---|
| Hero eyebrow | ATTORNEY SYRETTA R. ANDERSON | About page name |
| Trust facts | "Since 2007 · Licensed in South Carolina" · "Since 2010 · Licensed in North Carolina" · "Since 2015 · Serving clients in North & South Carolina" | About page License list and "Since 2015…" sentence |
| Trust heading (visually hidden) | Affiliations & Reviews | — |
| Practice eyebrow and tabs | PRACTICE AREAS · Family Law · Divorce · Estate Planning · Personal Injury | Menu labels. "Personal Injury" comes from the title tag. "Divorce" shortens "Divorce Lawyer" |
| Attorney eyebrow | MEET ATTORNEY SYRETTA R. ANDERSON | — |
| Hero name plate | Syretta R. Anderson | About page |
| Reviews | "Read more reviews on Google →" · "Show all reviews" · "Read full review" / "Show less" · "Rated 5 out of 5" (visually hidden) | — |
| Areas groups | South Carolina · North Carolina | The state suffix in each label |
| Form | "Required" · error-summary text ("Please fix 2 fields") · mailto notice ("Your email app will open with your message ready to send.") | — |
| Navigation and screen-reader labels | Skip to content · Open menu · Close menu · "(opens in new tab)" | — |

---

## 12. Client confirmation list

Each item shows the **default the build will use** if no answer comes back. Every default keeps the original content.

### A. Factual inconsistencies

1. **Years of experience.** The meta description says "13 years", the homepage says "over a decade", the About page says the firm has served clients "Since 2015", and the SC licence dates from 2007. *Which statement is correct?* Default: keep "over a decade" where it already appears and add **no** experience figure.
2. **Personal injury.** The title tag, meta description and hero image filename say "Personal Injury Lawyer". There are 3 PI cards, but their pages return 404 and PI isn't in the menu or footer. *Does the firm still take these cases?* Default: show the PI tab last, with links to the contact form.
3. **"Gastonia, SC" in the menu.** Gastonia is in **North Carolina**. Default: original label kept until confirmed.
4. **Conservatorship bullets are a copy of the Trusts bullets.** *What should the Conservatorship list say?* Default: shown as-is.
5. **Firm name.** It appears as "Anderson Law Firm" (body text), "Anderson Law Firm, PC" (logo) and "SR Anderson Law Firm" (copyright, site name). *Which is the legal name for the copyright line and structured data?* Default: each kept where it appears now.
6. **"York County, SC"** on the homepage links to `/york-sc/`, which the menu labels "York, SC". *City or county?*
7. **Badge links.** The South Carolina Bar badge links to the bar's *Education Law Committee* page, and York County Bar Association has no link. *Should these change, and to what URL?*
8. **ZIP code 29730.** It comes from the Google Maps link and structured data, not from the visible text. *OK to show it in the contact section?*
9. **Social accounts.** *Are Facebook, Instagram, Twitter/X and LinkedIn all active?* The Twitter link still uses twitter.com.

### B. Legal and advertising wording (needs the attorney's review; kept word for word by default)

This isn't legal advice. These phrases may be affected by South Carolina's rules on lawyer advertising, especially Rule 7.1 (misleading statements) and Rule 7.4 (claims of specialization).

- "**Expert Experience Guaranteed!**"
- "**specializes in**": the Child Support and Post Separation descriptions.
- "**expert**": the Premise Liability and Dog Bites descriptions, and back-of-card bullets "Expert slip fall lawyer", "Expert dog bite lawyer", "Expert child support lawyer", "Expert child visitation attorney" and "Expert Alimony Lawyer".
- "Maximum compensation pursuit", "Aggressive representation", "results-oriented representation".
- "Anderson Law Firm's vehicle accident **lawyers**" (plural, on a solo-attorney site).
- "Your Legal **Guardian**": guardianship is also a legal term.
- *Optional:* an attorney-advertising or "no attorney-client relationship" disclaimer near the form or in the footer. Neither exists on the current site, so nothing will be added without approval.

### C. Proposed copy changes (default: not applied)

1. **Hero heading.**
   - Option A (default): "Your Legal Guardian in Rock Hill, SC" becomes the H1, and the current H1 becomes the attorney-section H2.
   - Option B: keep "Trust a Seasoned Family Law Attorney in the Rock Hill, SC Area" as the H1.
2. **Hero paragraph length.** It's 62 words. *Would the client provide a shorter version?* Default: full text.
3. **Typos:**
   - "Premise Liability" → "Premises Liability", in the card and the form option.
   - "slip fall lawyer" → "slip and fall lawyer", twice.
   - The Dog Bites sentence fragment "With a compassionate approach and thorough expertise."
   - The Wills description is missing its final period.
4. **Voice.** The site speaks as "I" but has "Our Services Include:" (Living Wills, Wills) and "Tell us how we can help" (form placeholder). *Make them first person singular?*

### D. Not carried over (template leftovers and duplicates)

| Item | Why | Default |
|---|---|---|
| Mobile-menu block "Get Started — Prepare for the future you want with financial planning solutions…" + "Contact us" | Theme placeholder, unrelated to law | Removed; the sheet gets real call and message buttons instead |
| "Start a project with me!" (form subheading) | Agency-template text | Removed |
| "Click to Enlarge" button | Leftover map widget | Removed |
| Empty `<h2>` and empty `&nbsp;` paragraph | Markup leftovers | Removed |
| Front-of-card "Read More" that only flips the card | Interaction retired | Replaced by real "Read More" links |
| Floating "+" button | Replaced by the always-visible Call Now button | Removed |
| Second "Contact Me Today!" heading | Duplicate | Used once |
| Contact cards in the intro section (phone, email, address) | The 3rd of 5 repetitions | Kept in the utility bar, the contact section and the footer |
| Blue-gradient tile logo and blue-circle logo | One logo version | Not used |

### E. Contact form

1. **Where should submissions go?** For example: the existing WordPress Contact Form 7 (if the new homepage launches on the same domain), a form service, or email. Default: the mailto fallback.
2. **Services dropdown.** It's missing Divorce Law, Trusts, Conservatorship, Power of Attorney, Healthcare Power of Attorney, Paternity Law and LGBTQ+ Family Law. "Living Will" is singular there, while the card says "Living Wills". *Add them?* Default: the original 13 options as they are.
3. **Required fields.** Only Email is required now. *Should name, phone or message be required?*
4. **Consent or disclaimer line** under the Submit button. Default: none.

### F. Assets

1. **Logo:**
   - *Is there a vector (SVG/AI/EPS) master?*
   - *Approve the white-on-navy logo as the only version used on the homepage?*
2. **Higher-resolution attorney photos.** These are the 1024×1536 portrait, the 480×439 About photo, and the clean original of the seated portrait, which currently exists only inside a composite image. A new photo session is recommended (§6.4).
3. **Stock photo licences.** The gavel and archway images appear on the current site. *Please confirm they're licensed for continued use.*
4. **Practice icons.** *Approve a consistent outline icon set, or keep the original mixed-style icons?*
5. **Archway photo.** *Where was it taken?* It's used only as an unlabelled texture unless a location is confirmed.

### G. Meta, tracking and deployment

1. **Title and meta description.** They currently say "Personal Injury Lawyer…" and "13 years". *Keep them, or approve new ones once A1 and A2 are answered?*
2. **Structured data.** *Approve `LegalService` / `Attorney` JSON-LD from genuine data only?*
3. **Tracking.** *Which of GTM, GA4, Google Ads, Meta Pixel, WhatConverts, Jetpack Stats and Gauges should be restored at launch?* Any that stay need a cookie-consent banner.
4. **Deployment.** *Will this homepage replace the WordPress homepage on the same domain, or run as a standalone site?* This decides link paths and how the form is wired.
5. **Featured testimonial and review order.** Default: Jeffrey Williams featured, the rest in original order.
