/**
 * Footer link groups. The live footer has one "Services" column (8 links) and "Quick Links" (5 links).
 * Here the services are split into Family Law / Divorce (the same 8 links) and the Estate Planning links
 * from the main menu are added so every live service page is reachable. Paternity and LGBTQ+ Family Law are
 * not added (they were never in the footer and are unverified — notes A10).
 */
import { LIVE } from './site';

export const footerGroups = [
  {
    heading: 'Family Law',
    links: [
      { label: 'Child Custody Lawyer', href: `${LIVE}/services/child-custody-lawyer/` },
      { label: 'Child Support Lawyer', href: `${LIVE}/services/child-support-lawyer/` },
      { label: 'Adoption Attorney', href: `${LIVE}/services/adoption-attorney/` },
      { label: 'Child Visitation Attorney', href: `${LIVE}/services/visitation-attorney/` },
    ],
  },
  {
    heading: 'Divorce',
    links: [
      { label: 'Divorce Lawyer', href: `${LIVE}/services/divorce-lawyer/` },
      { label: 'Alimony Divorce Attorney', href: `${LIVE}/services/alimony-lawyer/` },
      { label: 'Post Separation Support', href: `${LIVE}/services/separation-attorney/` },
      { label: 'Equitable Distribution', href: `${LIVE}/services/divorce-mediation-attorney/` },
    ],
  },
  {
    heading: 'Estate Planning',
    links: [
      { label: 'Trusts', href: `${LIVE}/services/trust-lawyer/` },
      { label: 'Conservatorship', href: `${LIVE}/services/conservatorship/` },
      { label: 'Power of Attorney', href: `${LIVE}/services/power-of-attorney-lawyer/` },
      { label: 'Healthcare Power of Attorney', href: `${LIVE}/services/healthcare-proxy-lawyer/` },
      { label: 'Living Wills', href: `${LIVE}/services/living-will-attorney/` },
      { label: 'Wills', href: `${LIVE}/services/will-lawyer/` },
    ],
  },
  {
    heading: 'Quick Links',
    links: [
      { label: 'Home', href: '/' },
      { label: 'About', href: `${LIVE}/about/` },
      { label: 'All Areas We Serve', href: `${LIVE}/areas-we-serve/` },
      { label: 'FAQs', href: `${LIVE}/faqs/` },
      { label: 'Contact', href: '#contact' },
    ],
  },
] as const;
