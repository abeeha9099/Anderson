/**
 * Business information shared across sections.
 * Source: audit/content-inventory.md (top bar, section 10, footer, page meta). Verbatim.
 */

export const LIVE = 'https://www.srandersonlawfirm.com';

export const phone = {
  display: '(803) 980-5252',
  href: 'tel:8039805252',
} as const;

export const email = {
  display: 'syretta@srandersonlawfirm.com',
  href: 'mailto:syretta@srandersonlawfirm.com',
} as const;

export const address = {
  /** Visible text exactly as on the live site (two lines). */
  line1: '124 Oakland Ave,',
  line2: 'Rock Hill, SC',
  /** Original "directions" link used by the top bar, intro cards and footer. */
  directionsHref:
    'https://www.google.com/maps/dir//Anderson+Law+Firm,+124+Oakland+Avenue,+Rock+Hill,+SC+29730/@34.930654,-81.0652718,13z/data=!4m8!4m7!1m0!1m5!1m1!1s0x885688f915b1af2f:0xee20d7e7d2e5fc85!2m2!1d-81.024072!2d34.930661?entry=ttu',
} as const;

/**
 * Section 10 — "Business Hours". Same days and times as the live site; dash separators replaced
 * with "to" at the client's request (live text: "Mon - Thu 8:00 AM - 5:00 PM", "Fri: 8:00 AM - 2:00 PM").
 */
export const businessHours = [
  { day: 'Mon to Thu', hours: '8:00 AM to 5:00 PM' },
  { day: 'Fri', hours: '8:00 AM to 2:00 PM' },
  { day: 'Sat', hours: 'Closed *Available by Appointment Only' },
  { day: 'Sun', hours: 'Closed' },
] as const;

/** Section 2 — homepage wording. */
export const spanishNote = 'Spanish-speaking clients welcome';

/** Top utility bar label. */
export const reachOutLabel = 'Reach Out to Me';

/** Footer — original social links and review link. */
export const socials = [
  { name: 'Facebook', href: 'https://www.facebook.com/srandersonlawfirm/', icon: 'facebook' },
  { name: 'Instagram', href: 'https://www.instagram.com/srandersonlaw/', icon: 'instagram' },
  { name: 'Twitter', href: 'https://twitter.com/srandersonlaw', icon: 'twitter' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/syretta-anderson-799aa6102', icon: 'linkedin' },
  {
    name: 'Google',
    href: 'https://www.google.com/maps/place/Anderson+Law+Firm/@34.930661,-81.024072,17z/data=!4m6!3m5!1s0x885688f915b1af2f:0xee20d7e7d2e5fc85!8m2!3d34.930661!4d-81.024072!16s%2Fg%2F11b807skjg?entry=ttu',
    icon: 'google',
  },
] as const;

export type SocialIcon = (typeof socials)[number]['icon'];

export const leaveReview = {
  label: 'Leave a Review',
  href: 'https://g.page/r/CYX85dLn1yDuEAI/review',
} as const;

/** Google Maps listing (footer "Google" icon) — reused for "Read more reviews on Google". */
export const googleListingHref = socials[4].href;

/** Footer bottom bar. Firm name exactly as the live copyright line (see implementation notes A5). */
export const copyrightName = 'SR Anderson Law Firm';
export const privacyPolicy = { label: 'Privacy Policy', href: `${LIVE}/privacy-policy/` } as const;
