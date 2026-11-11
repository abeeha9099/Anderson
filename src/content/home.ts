/**
 * Homepage copy for the hero, trust bar, attorney introduction and "Why Choose" sections.
 * Source: audit/content-inventory.md (sections 1, 2, 4, 5, 6) and the About-page facts it records.
 * Verbatim unless marked "UI microcopy" (listed in docs/implementation-notes.md §5).
 */
import { LIVE } from './site';

export const hero = {
  /** UI microcopy — the three verified practice groups, named as in the live menu (Personal Injury is unconfirmed, notes A2). */
  eyebrow: 'Family Law · Divorce · Estate Planning',
  /**
   * Revision 3 (client request): replaces "Your Legal Guardian in Rock Hill, SC".
   * Wording is the live site's own heading "Compassionate Family Law Attorney at Your Side" + the firm's location.
   */
  heading: 'Compassionate Family Law Attorney in Rock Hill, SC',
  /** Section 1 paragraph, verbatim. */
  lead: 'Looking for an experienced and reliable attorney in Rock Hill, SC? At Anderson Law Firm, I provide dedicated legal representation with a focus on family law. Whether you’re dealing with a divorce, child custody dispute, adoption, alimony, post-separation support, or property division, I’m committed to guiding you through the legal process with expertise and care.',
  primaryCta: 'Send Me a Message',
  portraitAlt: 'Attorney Syretta R. Anderson',
  /** Portrait caption. Name from the About page; licence states from its License list (SC 2007, NC 2010). */
  caption: { name: 'Syretta R. Anderson', detail: 'Licensed in South Carolina & North Carolina' },
} as const;

/**
 * Trust facts — reformatted from the About page (License list; "Since 2015, Anderson Law Firm has been
 * providing legal services for clients in both North and South Carolina."). Labels are UI microcopy.
 * Deliberately no "years of experience" figure: the sources disagree (notes A1).
 */
export const trustFacts = [
  { year: '2007', label: 'Licensed in South Carolina' },
  { year: '2010', label: 'Licensed in North Carolina' },
  { year: '2015', label: 'Serving clients in North & South Carolina' },
] as const;

/** Section 4 badges — original order, links and images. */
export const badges = [
  {
    name: 'South Carolina Bar',
    image: 'badge-south-carolina-bar-logo.webp', w: 235, h: 120,
    // Verbatim from the live site; points at a committee page (notes A7).
    href: 'https://www.scbar.org/lawyers/sections-committees-divisions/committees/education-law-committee/',
  },
  { name: 'York County Bar Association', image: 'badge-york-county-bar-association.webp', w: 116, h: 120, href: null },
  { name: 'North Carolina State Bar', image: 'badge-north-carolina-state-bar-1.webp', w: 300, h: 65, href: 'https://www.ncbar.gov/' },
  { name: 'Avvo', image: 'badge-avvo-logo.webp', w: 300, h: 86, href: 'https://www.avvo.com/attorneys/29730-sc-syretta-anderson-4676343.html' },
  {
    name: 'Review us on Google',
    image: 'badge-google-logo.webp', w: 135, h: 120,
    href: 'https://www.google.com/search?client=opera&q=anderson+law+firm+124+Oakland+Ave%2C+Rock+Hill%2C+SC+29730&sourceid=opera&ie=UTF-8&oe=UTF-8#lkt=overview&lrd=0x885688f915b1af2f:0xee20d7e7d2e5fc85,3,,,&trex=m_t:lcl_akp,rc_f:nav,rc_ludocids:17158951970957294725,rc_q:Anderson%2520Law%2520Firm,ru_q:Anderson%2520Law%2520Firm',
  },
  { name: 'Better Business Bureau', image: 'badge-bbb.webp', w: 96, h: 120, href: 'https://www.bbb.org/us/sc/rock-hill/profile/divorce-lawyers/anderson-law-firm-0473-459578' },
  { name: 'Yelp', image: 'badge-yelp.webp', w: 297, h: 120, href: 'https://www.yelp.com/biz/anderson-law-firm-rock-hill-2' },
] as const;

export const attorney = {
  /** UI microcopy. */
  eyebrow: 'Meet Attorney Syretta R. Anderson',
  /** The live site's H1, moved to this section (blueprint Option A). */
  heading: 'Trust a Seasoned Family Law Attorney in the Rock Hill, SC Area',
  intro:
    'If you’re facing a legal challenge, having the right attorney makes all the difference. At Anderson Law Firm, I provide trusted legal assistance in Rock Hill, SC, and surrounding areas for clients in:',
  focus: [
    'Divorce law',
    'Child custody and visitation',
    'Child support and alimony',
    'Post-separation support',
    'Equitable distribution and property division',
    'Adoption and family law matters',
  ],
  /** Verbatim. Experience wording is disputed across sources (notes A1) — unchanged. */
  closing:
    'With over a decade of experience, I treat every client like family, offering compassionate, strategic, and results-oriented representation to protect your rights and achieve the best possible outcome.',
  /** About page, verbatim. */
  languageNote: '*Legal counsel offered to both English and Spanish-speaking clients',
  /**
   * About-page credentials. Same facts and years; the en-dash separators were replaced with commas
   * and "to" at the client's request (e.g. live text "North Carolina – 2010 – Present").
   */
  credentials: [
    {
      heading: 'Education',
      items: [
        'JD (Juris Doctor), North Carolina Central University School of Law, 2007',
        'BA (Bachelor of Arts), Winthrop University, 2002',
      ],
    },
    {
      heading: 'License',
      items: ['North Carolina, 2010 to Present', 'South Carolina, 2007 to Present'],
    },
    {
      heading: 'Memberships',
      items: [
        'Education Law Committee Member, 2014 to Present',
        'Children’s Law Committee Member, 2013 to Present',
        'North Carolina Bar Association Member, 2010 to Present',
        'York County Bar Association Member, 2007 to Present',
        'South Carolina Bar Association Member, 2007 to Present',
      ],
    },
  ],
  primaryCta: 'Work With Me',
  aboutLink: { label: 'Read More', href: `${LIVE}/about/`, accessibleLabel: 'Read more about Attorney Syretta R. Anderson' },
} as const;

/** Sections 5 + 6 merged. All text verbatim. */
export const whyChoose = {
  eyebrow: 'Why Choose Anderson Law Firm?',
  heading: 'A Versatile Divorce Lawyer at Your Service',
  pillars: [
    {
      title: 'A Client-Focused Divorce & Family Law Attorney',
      body: 'Divorce and family law matters can be emotionally challenging. At Anderson Law Firm, I provide a client-centered approach tailored to your specific needs. From child custody and visitation to post-separation support, alimony, and division of assets, I evaluate each case from every perspective to ensure fair and effective representation.',
    },
    {
      title: 'Experienced, Compassionate Legal Guidance',
      body: 'Family law requires both compassion and strength. With years of experience handling child custody, child support, adoption, and family conflict cases, I help clients navigate stressful legal matters productively and respectfully.',
    },
    {
      // Original section 6 label — kept verbatim; flagged for attorney review (notes B).
      label: 'Expert Experience Guaranteed!',
      title: 'Compassionate Family Law Attorney at Your Side',
      body: 'Family law requires a delicate balance of compassion and strength. Anderson Law Firm in Rock Hill, SC, provides just that. Navigating a family matter such as child custody, support, or adoption is stressful for everyone involved. With the assistance of an experienced family law attorney, these situations can be handled in a productive and caring manner. If you are currently facing family conflict and need effective legal advice and counsel, turn to me today.',
    },
  ],
} as const;
